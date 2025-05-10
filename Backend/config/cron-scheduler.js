import Camhistory from "../models/Camhistory.js";
import mongoose from "mongoose";
import axios from "axios";
import cron from "node-cron";
import User from "../models/User.js";
import apiConfig from "../api/apiconfigbackend.js";

console.log("Cron job started for sending scheduled emails.");

cron.schedule('*/10 * * * *', async () => {
  try {
    const nowUTC = new Date();
    nowUTC.setSeconds(0, 0);
    const nextMinute = new Date(nowUTC);
    nextMinute.setMinutes(nowUTC.getMinutes() + 1);

    console.log("Checking for scheduled emails at:", new Date().toLocaleString());

    const camhistories = await Camhistory.find({
      status: "Scheduled On",
      scheduledTime: { $gte: nowUTC.toISOString(), $lt: nextMinute.toISOString() },
    });

    if (camhistories.length === 0) {
      console.log("No scheduled emails found.");
      return;
    }

    for (const camhistory of camhistories) {
        // Check if the user is active before proceeding
        const user = await User.findById(camhistory.user); // Fetch the user by their ID
        if (!user || !user.isActive) {
          console.log(`Skipping email processing for user ${camhistory.user} as they are inactive.`);
          continue;  // Skip processing this entry and move to the next
        }
      console.log(`Processing scheduled email for user: ${camhistory.user}`);
      const groupId = camhistory.groupId?.trim();
      let sentEmails = [];
      let failedEmails = [];

      await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${camhistory._id}`, { status: "Pending" });

      if (!groupId || groupId.toLowerCase() === "no group") {
        const recipients = camhistory.recipients.split(",").map(email => email.trim());

        for (const email of recipients) {
          const personalizedContent = camhistory.previewContent.map(item =>
            item.content
              ? { ...item, content: item.content.replace(/\{?Email\}?/g, email) }
              : item
          );

          const emailData = {
            recipientEmail: email,
            subject: camhistory.subject,
            aliasName: camhistory.aliasName,
            body: JSON.stringify(personalizedContent),
            bgColor: camhistory.bgColor,
            previewtext: camhistory.previewtext,
            attachments: camhistory.attachments,
            userId: camhistory.user,
            groupId: camhistory.groupname,
            campaignId: camhistory._id,
          };

          try {
            await axios.post(`${apiConfig.baseURL}/api/stud/sendbulkEmail`, emailData);
            sentEmails.push(email);
          } catch (error) {
            console.error(`Failed to send email to ${email}:`, error.message);
            failedEmails.push(email);
          }
        }

      } 
      const BATCH_SIZE = 50;

      if (groupId.toLowerCase() === "no id") {
        const students = camhistory.exceldata.map(student => ({
          ...(student._doc || student),
          ...student.additionalFields,
        }));
      
        const batches = [];
        for (let i = 0; i < students.length; i += BATCH_SIZE) {
          batches.push(students.slice(i, i + BATCH_SIZE));
        }
      
        await Promise.all(
          batches.map(async (batch) => {
            for (const student of batch) {
              const email = student.Email;
              if (!email) continue;
      
              const personalizedContent = camhistory.previewContent.map(item => {
                const personalizedItem = { ...item };
                if (item.content) {
                  Object.entries(student).forEach(([key, value]) => {
                    const regex = new RegExp(`\\{${key.trim()}\\}`, "gi");
                    personalizedItem.content = personalizedItem.content.replace(regex, value != null ? String(value).trim() : "");
                  });
                }
                return personalizedItem;
              });
      
              const emailData = {
                recipientEmail: email,
                subject: camhistory.subject,
                aliasName: camhistory.aliasName,
                body: JSON.stringify(personalizedContent),
                bgColor: camhistory.bgColor,
                previewtext: camhistory.previewtext,
                attachments: camhistory.attachments,
                userId: camhistory.user,
                groupId: camhistory.groupname,
                campaignId: camhistory._id,
              };
      
              try {
                await axios.post(`${apiConfig.baseURL}/api/stud/sendbulkEmail`, emailData);
                sentEmails.push(email);
              } catch (error) {
                console.error(`Failed to send email to ${email}:`, error.message);
                failedEmails.push(email);
              }
            }
          })
        );
      
      } else if (mongoose.Types.ObjectId.isValid(groupId)) {
        const studentsResponse = await axios.get(`${apiConfig.baseURL}/api/stud/groups/${groupId}/students`);
        const students = studentsResponse.data;
      
        const batches = [];
        for (let i = 0; i < students.length; i += BATCH_SIZE) {
          batches.push(students.slice(i, i + BATCH_SIZE));
        }
      
        await Promise.all(
          batches.map(async (batch) => {
            for (const student of batch) {
              const email = student.Email;
              if (!email) continue;
      
              let personalizedSubject = camhistory.subject;
              Object.entries(student).forEach(([key, value]) => {
                const regex = new RegExp(`\\{?${key}\\}?`, "g");
                personalizedSubject = personalizedSubject.replace(regex, value != null ? String(value).trim() : "");
              });
      
              const personalizedContent = camhistory.previewContent.map(item => {
                const personalizedItem = { ...item };
                if (item.content) {
                  Object.entries(student).forEach(([key, value]) => {
                    const regex = new RegExp(`\\{?${key}\\}?`, "g");
                    personalizedItem.content = personalizedItem.content.replace(regex, value != null ? String(value).trim() : "");
                  });
                }
                return personalizedItem;
              });
      
              const emailData = {
                recipientEmail: email,
                subject: personalizedSubject,
                aliasName: camhistory.aliasName,
                body: JSON.stringify(personalizedContent),
                bgColor: camhistory.bgColor,
                previewtext: camhistory.previewtext,
                attachments: camhistory.attachments,
                userId: camhistory.user,
                groupId: camhistory.groupname,
                campaignId: camhistory._id,
              };
      
              try {
                await axios.post(`${apiConfig.baseURL}/api/stud/sendbulkEmail`, emailData);
                sentEmails.push(email);
              } catch (error) {
                console.error(`Failed to send email to ${email}:`, error.message);
                failedEmails.push(email);
              }
            }
          })
        );
      }
      

      // ✅ Final status & progress calculation
      const totalEmails = camhistory.totalcount || sentEmails.length + failedEmails.length;
      const successCount = sentEmails.length;
      const failureCount = failedEmails.length;
      const finalStatus = failureCount > 0 ? "Failed" : "Success";
      const finalProgress = failureCount > 0
        ? Math.round((failureCount / totalEmails) * 100)
        : 100;

      await axios.put(`${apiConfig.baseURL}/api/stud/camhistory/${camhistory._id}`, {
        sendcount: successCount,
        failedcount: failureCount,
        sentEmails,
        failedEmails,
        status: finalStatus,
        progress: finalProgress,
      });

      console.log(`Final progress: ${finalProgress}%, Status: ${finalStatus}`);
    }

  } catch (error) {
    console.error("Error in cron job:", error.message);
  }
});
