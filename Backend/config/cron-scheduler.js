import Camhistory from "../models/Camhistory.js";
import mongoose from "mongoose";
import axios from "axios";
import cron from "node-cron";
import User from "../models/User.js";
import apiConfig from "../api/apiconfigbackend.js";

console.log("Cron job started for sending scheduled emails.");

// Helper function to validate email
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Helper function to send email (mocked, replace with actual implementation)
const sendEmailToStudent = async ({ student, campaignId, userId, subject, attachments, previewtext, aliasName, replyTo, previewContent, bgColor }) => {
  const emailData = {
    recipientEmail: student.Email,
    subject,
    aliasName,
    replyTo,
    body: JSON.stringify(previewContent),
    bgColor,
    previewtext,
    attachments,
    userId,
    groupId: student.groupname || 'no group',
    campaignId,
  };
  
  await axios.post(`${apiConfig.baseURL}/api/stud/sendbulkEmail`, emailData);
};

cron.schedule('*/10 * * * *', async () => {
  try {
    const nowUTC = new Date();
    nowUTC.setSeconds(0, 0);

    const tenMinutesAgo = new Date(nowUTC);
    tenMinutesAgo.setMinutes(nowUTC.getMinutes() - 10);

    console.log("⏰ Checking for scheduled emails between:", tenMinutesAgo.toISOString(), "and", nowUTC.toISOString());

    const camhistories = await Camhistory.find({
      status: "Scheduled On",
      scheduledTime: { $gte: tenMinutesAgo.toISOString(), $lte: nowUTC.toISOString() },
    });

    if (camhistories.length === 0) {
      console.log("No scheduled emails found.");
      return;
    }

    for (const camhistory of camhistories) {
      // Check if the user is active before proceeding
      const user = await User.findById(camhistory.user);
      if (!user || !user.isActive) {
        console.log(`Skipping email processing for user ${camhistory.user} as they are inactive.`);
        continue;
      }

      console.log(`Processing scheduled email for user: ${camhistory.user}`);
      const groupId = camhistory.groupId?.trim();

      // Update status to Pending
      await Camhistory.findByIdAndUpdate(camhistory._id, { status: "Pending" });

      // Get students based on groupId
      let students = [];
      if (!groupId || groupId.toLowerCase() === "no group") {
        students = camhistory.recipients.split(",").map(email => ({ Email: email.trim() }));
      } else if (groupId.toLowerCase() === "no id") {
        students = camhistory.exceldata.map(student => ({
          ...(student._doc || student),
          ...student.additionalFields,
        }));
      } else if (mongoose.Types.ObjectId.isValid(groupId)) {
        const studentsResponse = await axios.get(`${apiConfig.baseURL}/api/stud/groups/${groupId}/students`);
        students = studentsResponse.data;
      } else {
        console.warn(`⚠️ Invalid groupId "${groupId}" for campaign ${camhistory._id}`);
        continue;
      }

      // Filter valid students
      const validStudents = students.filter(student => 
        student?.Email && isValidEmail(student.Email)
      );
      const invalidEmails = students
        .filter(student => !student?.Email || !isValidEmail(student.Email))
        .map(student => student?.Email || 'missing');

      // Initial update with invalid emails
      await Camhistory.findByIdAndUpdate(camhistory._id, {
        failedcount: invalidEmails.length,
        failedEmails: invalidEmails,
      });

      const batchSize = 10;
      const totalEmails = validStudents.length;
      let processedEmails = 0;
      let sentEmails = [];
      let failedEmails = [...invalidEmails]; // Start with invalid emails

      // Split into batches
      const batches = [];
      for (let i = 0; i < validStudents.length; i += batchSize) {
        batches.push(validStudents.slice(i, i + batchSize));
      }

      // Process batches in parallel
      await Promise.all(
        batches.map(async (batch) => {
          for (const student of batch) {
            try {
              // Personalize content
              const personalizedContent = camhistory.previewContent.map((item) => {
                const personalizedItem = { ...item };
                if (item.content) {
                  Object.entries(student).forEach(([key, value]) => {
                    const regex = new RegExp(`\\{?${key}\\}?`, "g");
                    personalizedItem.content = personalizedItem.content.replace(
                      regex,
                      value != null ? String(value).trim() : ""
                    );
                  });
                }
                return personalizedItem;
              });

              // Personalize subject
              let personalizedSubject = camhistory.subject;
              Object.entries(student).forEach(([key, value]) => {
                const regex = new RegExp(`\\{?${key}\\}?`, "g");
                personalizedSubject = personalizedSubject.replace(
                  regex,
                  value != null ? String(value).trim() : ""
                );
              });

              // Send email
              await sendEmailToStudent({
                student,
                campaignId: camhistory._id,
                userId: camhistory.user,
                subject: personalizedSubject,
                attachments: camhistory.attachments,
                previewtext: camhistory.previewtext,
                aliasName: camhistory.aliasName,
                replyTo: camhistory.replyTo,
                previewContent: personalizedContent,
                bgColor: camhistory.bgColor,
              });
              sentEmails.push(student.Email);
            } catch (error) {
              console.error(`❌ Error sending to ${student.Email}:`, error);
              failedEmails.push(student.Email);
            }

            processedEmails++;
            const progress = Math.round((processedEmails / totalEmails) * 100);

            // Update progress dynamically
            await Camhistory.findByIdAndUpdate(camhistory._id, {
              progress,
              sendcount: sentEmails.length,
              failedcount: failedEmails.length,
              sentEmails,
              failedEmails,
              status:
                progress === 100
                  ? failedEmails.length > 0
                    ? "Partial Success"
                    : "Success"
                  : "Processing",
            });

            // Optional throttling: delay between emails
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        })
      );

      // Final update
      const finalStatus = failedEmails.length === 0 ? "Success" : "Failed";
      const finalProgress = failedEmails.length > 0
        ? Math.round((failedEmails.length / (sentEmails.length + failedEmails.length)) * 100)
        : 100;

      await Camhistory.findByIdAndUpdate(camhistory._id, {
        status: finalStatus,
        progress: finalProgress,
        recipients: sentEmails.join(", "),
        sendcount: sentEmails.length,
        failedcount: failedEmails.length,
        sentEmails,
        failedEmails,
      });
      
    console.log(`Campaign ${camhistory._id} completed with status ${finalStatus}`);
    }
  } catch (error) {
    console.error("Error in cron job:", error.message);
  }
});