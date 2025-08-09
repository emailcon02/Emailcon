import Camhistory from "../models/Camhistory.js";
import mongoose from "mongoose";
import axios from "axios";
import cron from "node-cron";
import User from "../models/User.js";
import apiConfig from "../api/apiconfigbackend.js";

console.log("Cron job started for sending scheduled emails.");

// Configure delay settings (in milliseconds)
const DELAY_BETWEEN_EMAILS = 500; // 0.5 seconds between each email
const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds between batches
const BATCH_SIZE = 10; // Number of emails to send in each batch

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

cron.schedule('*/2 * * * *', async () => {
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

      // Update status to Processing
      await Camhistory.findByIdAndUpdate(camhistory._id, { status: "Processing" });

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

      // Split students into batches
      const batches = [];
      let sentEmails = [];
      let failedEmails = [...invalidEmails];
      
      for (let i = 0; i < validStudents.length; i += BATCH_SIZE) {
        batches.push(validStudents.slice(i, i + BATCH_SIZE));
      }

      // Process batches sequentially with delay
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        const batchSent = [];
        const batchFailed = [];

        // Process emails within batch sequentially with delay
        for (const student of batch) {
          try {
            // Personalize content
const personalizedContent = camhistory.previewContent.map((item) => {
  const personalizedItem = { ...item };

  if (Array.isArray(item.content)) {
    // Table format → loop through rows & cells
    personalizedItem.content = item.content.map(row =>
      row.map(cell => {
        let cellText = String(cell ?? "");
        Object.entries(student).forEach(([key, value]) => {
          const regex = new RegExp(`\\{${key}\\}`, "gi");
          cellText = cellText.replace(regex, value != null ? String(value).trim() : "");
        });
        return cellText;
      })
    );
  } else if (typeof item.content === "string") {
    // Normal text, banner, etc.
    Object.entries(student).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, "gi");
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
              const regex = new RegExp(`\\{${key}\\}`, "gi");
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
            batchSent.push(student.Email);
            
            // Add delay between individual emails
            if (student !== batch[batch.length - 1]) {
              await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_EMAILS));
            }
            
          } catch (error) {
            console.error(`❌ Error sending to ${student.Email}:`, error);
            batchFailed.push(student.Email);
          }
        }

        // Update sent and failed emails
        sentEmails = [...sentEmails, ...batchSent];
        failedEmails = [...failedEmails, ...batchFailed];

        // Update progress after each batch
        const currentProgress = Math.round(((batchIndex + 1) / batches.length) * 100);
        await Camhistory.findByIdAndUpdate(camhistory._id, {
          progress: currentProgress,
          sendcount: sentEmails.length,
          failedcount: failedEmails.length,
          sentEmails: sentEmails,
          failedEmails: failedEmails,
          status: "Processing",
        });

        // Add delay between batches (except after last batch)
        if (batchIndex < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
      }

      // Final update after all batches are processed
      const finalStatus = failedEmails.length > 0 ? "Failed" : "Success";
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