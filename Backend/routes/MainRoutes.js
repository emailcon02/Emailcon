import express from "express";
import nodemailer from "nodemailer";
import { upload,uploadFileToS3,uploadImageToS3,deleteFromS3 } from "../config/s3Uploder.js";
import Student from "../models/Student.js";
import Group from "../models/Group.js";
import Campaign from "../models/Campaign.js";
import Template from "../models/Template.js";
import User from "../models/User.js";
import Camhistory from "../models/Camhistory.js";
import { decryptPassword } from "../config/encryption.js";
import EmailOpen from "../models/EmailOpen.js";
import ClickTracking from "../models/ClickTracking.js";
import apiConfig from "../api/apiconfigbackend.js";
import authMiddleware from "../config/authMiddleware.js";
import mongoose from "mongoose";
import BirthdayTemplate from "../models/BirthdayTemplates.js";
import PaymentHistory from "../models/PaymentHistory.js";
import Aliasname from "../models/Aliasname.js";
import Replyto from "../models/Replyto.js";
import Adminuser from "../models/Adminuser.js";
import ImageUrl from "../models/Imageurl.js";
import Folder from "../models/Folder.js";
import accounttransporter from "../config/account-mailer.js";
import {
  S3Client,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import  { google } from 'googleapis';

import getAuthorizedOAuthClient from "../config/googleAuthClient.js";
const router = express.Router();

// Upload image to s3 bucket
router.post('/upload', upload.array('image', 10), async (req, res) => {
  try {
    const { userId, folderName } = req.body;
    if (!userId) return res.status(400).send("Missing userId");

    const urls = [];

    for (const file of req.files) {
      const url = await uploadImageToS3(
        file.buffer,
        file.originalname,
        file.mimetype,
        folderName,
        userId
      );
      urls.push(url);
    }
    res.json({ imageUrls: urls });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});


router.post('/uploadfile', upload.array('attachments', 10), async (req, res) => {
  try {
    const { folderName = 'files', userId } = req.body;
    if (!userId) return res.status(400).send("Missing userId");
    const fileUrls = await Promise.all(
      req.files.map(file =>
        uploadFileToS3(file.buffer, file.originalname, file.mimetype,userId,folderName)
      )
    );
    res.json({ fileUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});
// DELETE route to remove file from S3
router.delete('/file', async (req, res) => {
  const { key } = req.query;

  if (!key) return res.status(400).json({ error: 'Missing key parameter' });

  try {
    await deleteFromS3(key);
    res.status(200).json({ message: 'File deleted successfully from S3' });
  } catch (err) {
    console.error('S3 deletion failed:', err);
    res.status(500).json({ error: 'Failed to delete file', details: err.message });
  }
});
// DELETE template route
router.delete('/templates/:templateId', async (req, res) => {
  try {
    const {
      templateId
    } = req.params;
    const deletedTemplate = await Template.findByIdAndDelete(templateId);

    if (!deletedTemplate) {
      return res.status(404).json({
        message: 'Template not found'
      });
    }
    const userId = deletedTemplate.user;
    const camname = deletedTemplate.camname;
    await Campaign.deleteOne({camname: camname, user: userId});

    res.status(200).json({
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting template:', error.message);
    res.status(500).json({
      message: 'Error deleting template'
    });
  }
});
// DELETE birthday template route
router.delete('/birthtemplates/:templateId', async (req, res) => {
  try {
    const {
      templateId
    } = req.params;
    const deletedTemplate = await BirthdayTemplate.findByIdAndDelete(templateId);

    if (!deletedTemplate) {
      return res.status(404).json({
        message: 'Template not found'
      });
    }
    const userId = deletedTemplate.user;
    const camname = deletedTemplate.camname;
    await Campaign.deleteOne({camname: camname, user: userId});
    res.status(200).json({
      message: 'Birthday Template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting template:', error.message);
    res.status(500).json({
      message: 'Error deleting  birthday template'
    });
  }
});

//single send
router.post('/sendtestmail', async (req, res) => {
  try {
    const {
      emailData,
      aliasName,
      replyTo,
      attachments,
      previewContent,
      bgColor,
      campaignId,
      userId
    } = req.body;

    // Find the current user by userId
    const user = await User.findById(userId);
    if(!user){
          return res.status(404).send('User not found');
    }

// Find the student by email and check ownership directly
const student = await Student.findOne({ Email: emailData.recipient,user: userId });

if (!student) {
  return res.status(404).json({ message: 'Student not found' });
}

// ✅ Check if student belongs to the current user
if (student.user.toString() !== userId) {
  return res.status(403).json({ message: 'Unauthorized access to student' });
}

// ✅ Check if unsubscribed
if (student.isUnsubscribed) {
  console.log(`❌ Skipping email for unsubscribed recipient: ${emailData.recipient}`);
  return res.status(200).json({ message: 'User has unsubscribed. Email not sent.' });
}


    const {email}= user;

    const generateTrackingLink = (originalUrl, userId, campaignId, recipientEmail) => {
      return `${apiConfig.baseURL}/api/stud/track-click?emailId=${encodeURIComponent(recipientEmail)}&url=${encodeURIComponent(originalUrl)}&userId=${userId}&campaignId=${campaignId}`;
    };


    const emailContent = previewContent.map((item) => {
      if (item.type === 'para') {
        return `<div class="para" style="border-radius:${item.style.borderRadius};font-size:${item.style.fontSize};padding:10px; color:${item.style.color}; margin-top:20px; background-color:${item.style.backgroundColor}">${item.content}</div>`;
      } else if (item.type === 'head') {
        return `<p class="head" style="font-size:${item.style.fontSize};border-radius:10px;margin-top:10px;padding:10px;font-weight:bold;color:${item.style.color};text-align:${item.style.textAlign};background-color:${item.style.backgroundColor}">${item.content}</p>`;
      } else if (item.type === 'logo') {
        return `<div style="text-align:${item.style.textAlign};margin:10px auto !important">
        <img src="${item.src}" style="width:${item.style.width};height:${item.style.height};border-radius:${item.style.borderRadius};pointer-events:none;margin:${item.style.margin};background-color:${item.style.backgroundColor};"/>
        </div>`
      } else if (item.type === 'image') {
        return `<div style="text-align:${item.style.textAlign};margin:10px auto !important">
        <img src="${item.src}" style="margin-top:10px;width:${item.style.width};pointer-events:none;height:${item.style.height};border-radius:${item.style.borderRadius};background-color:${item.style.backgroundColor}"/>
        </div>`;
      }
      else if (item.type === 'break') {
        return `<table role="presentation" align="center" width="100%" style="border-collapse: separate; border-spacing: 0; margin: 10px auto!important;">
      <tr>
        <td align="center"  style="padding: 0;">
          <hr style="width:100%; background-color:#00000; margin:30px 0px;" />
        </td>
      </tr>
    </table>`;
      } else if (item.type === 'gap') {
        return `
    <table role="presentation" align="center" width="100%" style="border-collapse: separate; border-spacing: 0; margin: ${item.style.margin || '30px 0'};">
      <tr>
        <td align="center" width="100%" style="padding: 0;">
          <div style="width:100%; height:50px; margin: 0 auto;"></div>
        </td>
      </tr>
    </table>
  `;}

      else if (item.type === 'cardimage') {
        return `
        <table role="presentation" align="center" width="${item.style.width}" style="border-collapse: separate; border-spacing: 0; margin: 10px auto!important;">
    <tr>
        <td align="center" width="${item.style.width}" style="vertical-align: top; border-radius: 10px; padding: 0;">
            <!-- Image -->
            <img src="${item.src1}" width="${item.style.width}" style="display: block; width: 100%; height: auto; max-width: ${item.style.width}; border-top-left-radius: 10px; border-top-right-radius: 10px; object-fit: cover;" alt="image"/>
            
            <!-- Text Content -->
            <div style="font-size: 15px; background-color: ${item.style1.backgroundColor || '#f4f4f4'};width: ${item.style.width}; color: ${item.style1.color || 'black'}; padding:10px 0px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                ${item.content1}
            </div>
        </td>
    </tr>
</table>`
      }

      else if (item.type === 'multi-image') {
        return `<table class="multi" style="width:100%; border-collapse:collapse;margin:10px auto !important;">
        <tr>
            <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                <img src="${item.src1}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
                    <a class = "img-btn"
                    href="${generateTrackingLink(item.link1, userId, campaignId, emailData.recipient)}"
                    target = "_blank"
                    style = "display:inline-block;padding:12px 25px;margin-top:20px;font-weight:bold;font-size:${item.buttonStyle1.fontSize || '18px'};width:${item.buttonStyle1.width || 'auto'};color:${item.buttonStyle1.color || '#000'};text-decoration:none;background-color:${item.buttonStyle1.backgroundColor || '#f0f0f0'};text-align:${item.buttonStyle1.textAlign || 'left'};border-radius:${item.buttonStyle1.borderRadius || '5px'};" >
                        ${item.content1}
                    </a>
            </td>
            <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                <img src="${item.src2}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
                    <a class = "img-btn"
                    href="${generateTrackingLink(item.link2, userId, campaignId, emailData.recipient)}"
                    target = "_blank"
                    style = "display:inline-block;padding:12px 25px;font-weight:bold;font-size:${item.buttonStyle1.fontSize || '18px'};margin-top:20px;width:${item.buttonStyle2.width || 'auto'};color:${item.buttonStyle2.color || '#000'};text-decoration:none;background-color:${item.buttonStyle2.backgroundColor || '#f0f0f0'};text-align:${item.buttonStyle2.textAlign || 'left'};border-radius:${item.buttonStyle2.borderRadius || '5px'};" >
                        ${item.content2}
                    </a>
            </td>
        </tr>
    </table>`

      }

      else if (item.type === 'multipleimage') {
        return `<table class="multi" style="width:100%; border-collapse:collapse;margin:10px auto !important;">
        <tr>
            <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                <img src="${item.src1}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
            </td>
            <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                <img src="${item.src2}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
            </td>
        </tr>
    </table>`
      }


      else if (item.type === 'icons') {
        return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${item.ContentStyle.backgroundColor || 'white'}; border-radius:${item.ContentStyle.borderRadius || '10px'}; margin:15px 0px !important;">
            <tr>
                <td align="${item.ContentStyle.textAlign}" style="padding: 20px; text-align: center;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                        <tr>
                            <td style="padding: 0 10px;">
                                <a href="${generateTrackingLink(item.links1, userId, campaignId, emailData.recipient)}" target="_blank" style="text-decoration:none;">
                                    <img src="${item.iconsrc1}" style="cursor:pointer;width:${item.style1.width};height:${item.style1.height};" alt="icon1"/>
                                </a>
                            </td>
                            <td style="padding: 0 10px;">
                                <a href="${generateTrackingLink(item.links2, userId, campaignId, emailData.recipient)}" target="_blank" style="text-decoration:none;">
                                    <img src="${item.iconsrc2}" style="cursor:pointer;width:${item.style2.width};height:${item.style2.height};" alt="icon2"/>
                                </a>
                            </td>
                            <td style="padding: 0 12px;">
                                <a href="${generateTrackingLink(item.links3, userId, campaignId, emailData.recipient)}" target="_blank" style="text-decoration:none;">
                                    <img src="${item.iconsrc3}" style="cursor:pointer;width:${item.style3.width};height:${item.style3.height};" alt="icon3"/>
                                </a>
                            </td>
                            <td style="padding: 0 10px;">
                                <a href="${generateTrackingLink(item.links4, userId, campaignId, emailData.recipient)}" target="_blank" style="text-decoration:none;">
                                    <img src="${item.iconsrc4}" style="cursor:pointer;width:${item.style4.width};height:${item.style4.height};" alt="icon4"/>
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>`;
      }

      else if (item.type === 'video-icon') {
        return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
      <tr>
        <td align="center">
          <table role="presentation" width="${item.style.width}" height="${item.style.height}" cellspacing="0" cellpadding="0" border="0"
                 style="background: url('${item.src1}') no-repeat center center; background-size: cover; border-radius: 10px; overflow: hidden; margin: 15px 0px !important;">
            <tr>
              <td align="center" valign="middle" style="height: ${item.style.height}; padding: 0;">
                <a href="${generateTrackingLink(item.link, userId, campaignId, emailData.recipient)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
  <img src="${item.src2}" width="70" height="70" 
       style="display: block; border-radius: 50%; background-color: white; cursor: pointer;" 
       alt="Play Video" border="0"/>
</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
      }

      else if (item.type ==='banner') {
        return `<div>
        <img src="${item.src}" style="margin-top:10px;width:${item.style.width};pointer-events:none;height:${item.style.height};border-radius:${item.style.borderRadius};background-color:${item.style.backgroundColor}"/>
        </div>`;
      }




else if (item.type === 'multi-image-card') {
        return `<table class="multi" style="width:100%; border-collapse:collapse;margin:10px auto !important;">
    <tr>
      <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
        <img src="${item.src1}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
        <h3 style="margin:10px 0;">${item.title1 || 'Name of the product'}</h3>
        <p style="margin:5px 0;"><s>${item.originalPrice1 ? `₹${item.originalPrice1}` : '₹9000'}</s></p>
        <p style="margin:5px 0;">${item.offerPrice1 ? `Off Price ₹${item.offerPrice1}` : 'Off Price ₹5999'}</p>
        <a class="img-btn"
          href="${generateTrackingLink(item.link1, userId, campaignId, emailData.recipient)}"
          target="_blank"
          style="display:inline-block;padding:12px 25px;margin-top:20px;font-weight:bold;font-size:${item.buttonStyle1.fontSize || '18px'};width:${item.buttonStyle1.width || 'auto'};color:${item.buttonStyle1.color || '#000'};text-decoration:none;background-color:${item.buttonStyle1.backgroundColor || '#f0f0f0'};text-align:${item.buttonStyle1.textAlign || 'left'};border-radius:${item.buttonStyle1.borderRadius || '5px'};">
          ${item.content1}
        </a>
      </td>
      <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
        <img src="${item.src2}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
        <h3 style="margin:10px 0;">${item.title2 || 'Name of the product'}</h3>
        <p style="margin:5px 0;"><s>${item.originalPrice2 ? `₹${item.originalPrice2}` : '₹8000'}</s></p>
        <p style="margin:5px 0;">${item.offerPrice2 ? `Off Price ₹${item.offerPrice2}` : 'Off Price ₹4999'}</p>
        <a class="img-btn"
          href="${generateTrackingLink(item.link2, userId, campaignId, emailData.recipient)}"
          target="_blank"
          style="display:inline-block;padding:12px 25px;font-weight:bold;font-size:${item.buttonStyle2.fontSize || '18px'};margin-top:20px;width:${item.buttonStyle2.width || 'auto'};color:${item.buttonStyle2.color || '#000'};text-decoration:none;background-color:${item.buttonStyle2.backgroundColor || '#f0f0f0'};text-align:${item.buttonStyle2.textAlign || 'left'};border-radius:${item.buttonStyle2.borderRadius || '5px'};">
          ${item.content2}
        </a>
      </td>
    </tr>
  </table>`;
      }


      else if (item.type === 'imagewithtext') {
        return `<table class="image-text" style="width:100%;height:220px !important;background-color:${item.style1.backgroundColor || '#f4f4f4'}; border-collapse:seperate;border-radius:${item.style1.borderRadius || '10px'};margin:20px 0px !important">
        <tr>
            <td style = "vertical-align:top;padding:10px;" >
                <img src="${item.src1}" style="border-radius:10px;width:200px !important;height:auto;pointer-events:none !important; object-fit:cover;" alt="image"/>                  
            </td>
            <td style = "vertical-align:top;padding:10px;color:${item.style1.color || 'black'};" >
                <div class="img-para" style="overflow: auto;max-height: 200px !important;font-size:18px;">
                ${item.content1}
                </div>
            </td>
        </tr>
    </table>`;
      }

      else if (item.type === 'textwithimage') {
        return `<table class="image-text" style="width:100%;height:220px !important;background-color:${item.style.backgroundColor || '#f4f4f4'}; border-collapse:seperate;border-radius:${item.style.borderRadius || '10px'};margin:20px 0px !important">
        <tr>
          <td style = "vertical-align:top;padding:10px;color:${item.style.color || 'black'};" >
                <div class="img-para" style="overflow: auto;max-height: 200px !important;font-size:18px;">
                ${item.content2}
                </div> 
            </td>
            <td style = "vertical-align:top;padding:10px;" >
                <img src="${item.src2}" style="border-radius:10px;width:200px !important;height:auto;pointer-events:none !important; object-fit:cover;" alt="image"/>                  
            </td>         
        </tr>
    </table>`
      }
      else if (item.type === 'link-image') {
        return `<div style="text-align:${item.style.textAlign};margin:10px auto !important">
        <a href="${generateTrackingLink(item.link, userId, campaignId, emailData.recipient)}" taget="_blank" style="text-decoration:none;"><img src="${item.src}" style="margin-top:10px;width:${item.style.width};text-align:${item.style.textAlign};pointer-events:none;height:${item.style.height};border-radius:${item.style.borderRadius};background-color:${item.style.backgroundColor}"/></a>
        </div>`;
      } else if (item.type === 'button') {
        return `<div style="text-align:${item.style.textAlign || 'left'};padding-top:20px;">
                  <a href="${generateTrackingLink(item.link, userId, campaignId, emailData.recipient)}" target="_blank" style="display:inline-block;font-weight:bold;font-size:${item.style.fontSize};padding:12px 25px;width:${item.style.width || 'auto'};color:${item.style.color || '#000'};text-decoration:none;background-color:${item.style.backgroundColor || '#f0f0f0'};text-align:${item.style.textAlign || 'left'};border-radius:${item.style.borderRadius || '0px'};">
                    ${item.content || 'Button'}
                  </a>
                </div>`;
      }
    }).join('');

    // Tracking pixel
    const trackingPixel = `<img src="${apiConfig.baseURL}/api/stud/track-email-open?emailId=${encodeURIComponent(emailData.recipient)}&userId=${userId}&campaignId=${campaignId}&t=${Date.now()}" width="1" height="1" style="display:none;" />`;
    const unsubscribeLink = `${apiConfig.baseURL}/api/stud/unsubscribe?email=${encodeURIComponent(emailData.recipient)}&userId=${userId}`;

    // Full email HTML
    const emailHtml = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            @media(max-width:768px) {
              .main { width: 330px !important; }
              .img-case { width: 330px !important; }
              .para{ font-size:15px !important; }
              .img-para{ font-size:15px !important; }
              .image-text{ width:330px !important;}
              .image-text tr{
                display: flex !important;
                flex-wrap: nowrap !important;
                justify-content: space-between !important;
              }
              .multi tr {
                display: flex !important;
                flex-wrap: nowrap !important;
                justify-content: space-between !important;
              }
              .multi tr td {
                width: 48% !important;
                padding: 5px !important;
              }
              .multi tr td img {
                height: 150px !important;
                width: 100% !important;
                object-fit: cover !important;
              }
              .img-btn{
                width:85% !important;
                margin:20px auto !important;
                font-size:10px !important;
                padding:10px !important;
              }
              .head{
                font-size:20px !important;
              }
            }
          </style>
        </head>
        <body>
          <div style="display:none !important; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
            ${emailData.previewtext}  
          </div>
          <div class="main" style="background-color:${bgColor || "white"};box-shadow:0 4px 8px rgba(0, 0, 0, 0.2);border:1px solid rgb(255, 245, 245);padding:20px;width:700px;height:auto;border-radius:10px;margin:0 auto;">
            ${emailContent}
            ${trackingPixel}        
          </div>
           <div style="text-align:center; margin-top: 20px; font-size: 14px; color: #777;">
  If you no longer wish to receive these emails, you can 
  <a href="${unsubscribeLink}" style="color:#007BFF; text-decoration:underline;">unsubscribe here</a>.
</div>
        </body>
      </html>
    `;

    // Process attachments
   let attachmentParts = [];

if (attachments && attachments.length > 0) {
  for (const file of attachments) {
    try {
      const response = await fetch(file.fileUrl);
      if (!response.ok) throw new Error(`Failed to fetch attachment: ${response.statusText}`);

      // Convert arrayBuffer to Buffer
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const base64Content = buffer.toString('base64');

      attachmentParts.push([
        `--boundary_string`,
        `Content-Type: ${file.mimetype}`,
        `Content-Disposition: attachment; filename="${file.originalName}"`,
        `Content-Transfer-Encoding: base64`,
        '',
        base64Content
      ].join('\n'));
    } catch (error) {
      console.error(`Error processing attachment ${file.originalName}:`, error);
    }
  }
}

 // Determine sending method based on email domain
    if (email.includes("gmail")) {
      try {
        const oAuth2Client = await getAuthorizedOAuthClient(userId);
        
        const messageParts = [
          `From: "${aliasName}" <${email}>`,
          `To: ${emailData.recipient}`,
          `Reply-To: ${replyTo || email}`,
          `Subject: ${emailData.subject}`,
          'MIME-Version: 1.0',
          'Content-Type: multipart/mixed; boundary="boundary_string"',
          `List-Unsubscribe: <${unsubscribeLink}>`,   
          '',
          '--boundary_string',
          'Content-Type: text/html; charset="UTF-8"',
          '',
          emailHtml,
          ...attachmentParts,
          '--boundary_string--'
        ];

        const rawMessage = messageParts.join('\n');
        const encodedMessage = Buffer.from(rawMessage)
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        const sendResponse = await gmail.users.messages.send({
          userId: 'me',
          requestBody: { raw: encodedMessage }
        });

        console.log(`✅ Email sent via Gmail API to: ${emailData.recipient}`);
        return res.status(200).json({ 
          message: 'Email sent successfully via Gmail API', 
          response: sendResponse.data 
        });

      } catch (error) {
        console.error('Gmail API error:', error);
        if (error.code === 401) {
          return res.status(401).json({
            error: 'Gmail authentication failed - token may be expired',
            authUrl: `${apiConfig.baseURL}/auth/google?userId=${userId}`
          });
        }
        throw error;
      }
    } else {
      // Use Hostinger SMTP
      try {
        const transporter = nodemailer.createTransport({
         host: "smtp.hostinger.com",
          port: 465,
          secure: true,
          auth: {
            user: email,
            pass: decryptPassword(user.smtppassword),
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        // Prepare attachments for Nodemailer
        const Attachments = attachments.map(file => ({
      filename: file.originalName,
      path: file.fileUrl, // Use Cloudinary URL directly
      contentType: file.mimetype
    }));

        const info = await transporter.sendMail({
          from: `"${aliasName}" <${email}>`,
          to: emailData.recipient,
          replyTo: replyTo || email,
          subject: emailData.subject,
          html: emailHtml,
          attachments: Attachments,
          headers: {
            'X-Campaign-ID': campaignId,
            'X-User-ID': userId,
            'List-Unsubscribe': `<${unsubscribeLink}>` 

          }
        });

        console.log(`✅ Email sent via Hostinger: ${emailData.recipient}`);
        return res.status(200).json({ 
          message: 'Email sent successfully via Hostinger SMTP', 
          messageId: info.messageId 
        });

      } catch (error) {
        console.error('Hostinger SMTP error:', error);
        if (error.code === 'EAUTH') {
          return res.status(401).json({ 
            error: 'Hostinger authentication failed - check your credentials'
          });
        }
        throw error;
      }
    }

  } catch (error) {
    console.error('FULL SEND ERROR:', error);
    return res.status(500).json({ 
      error: `Error sending email: ${error.message}` 
    });
  }
});

router.get('/unsubscribe', async (req, res) => {
   const { email, userId } = req.query;

  if (!email || !userId) {
    return res.status(400).send("Invalid unsubscribe link.");
  }

  try {
  // Find the student by email and check ownership directly
const student = await Student.findOne({ Email: email,user: userId});

if (!student) {
  return res.status(404).json({ message: 'Student not found' });
}

// ✅ Check if student belongs to the current user
if (student.user.toString() !== userId) {
  return res.status(403).json({ message: 'Unauthorized access to student' });
}


    // Mark as unsubscribed
    student.isUnsubscribed = true;
    await student.save();

    // HTML with Undo button
    return res.send(`
      <html>
        <head>
          <title>Unsubscribed</title>
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              background: #f4f4f4;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .box {
              background: white;
              padding: 30px 40px;
              border-radius: 10px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              text-align: center;
              width: 100%;
              max-width: 400px;
            }
            h2 {
              color: #333;
              margin-bottom: 15px;
            }
            p {
              color: #666;
              font-size: 15px;
              margin-bottom: 25px;
            }
            .btn {
              background-color: #F48C06;
              color: white;
              border: none;
              padding: 10px 20px;
              font-size: 15px;
              border-radius: 6px;
              cursor: pointer;
              transition: 0.3s;
              text-decoration: none;
            }
            .btn:hover {
              background-color: #ea8502ff;
            }
          </style>
        </head>
        <body>
          <div class="box">
            <h2>You’ve successfully unsubscribed</h2>
            <p>If this was a mistake, you can undo it below.</p>
            <a class="btn" href="${apiConfig.baseURL}/api/stud/resubscribe?email=${encodeURIComponent(email)}&userId=${userId}">Undo Unsubscribe</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return res.status(500).send("Something went wrong. Please try again later.");
  }
});

router.get('/resubscribe', async (req, res) => {
   const { email, userId } = req.query;

  if (!email || !userId) {
    return res.status(400).send("Invalid unsubscribe link.");
  }

  try {
   // Find the student by email and check ownership directly
const student = await Student.findOne({ Email: email,user: userId });

if (!student) {
  return res.status(404).json({ message: 'Student not found' });
}

// ✅ Check if student belongs to the current user
if (student.user.toString() !== userId) {
  return res.status(403).json({ message: 'Unauthorized access to student' });
}



    student.isUnsubscribed = false;
    await student.save();

    return res.send(`
      <html>
        <head>
          <title>Resubscribed</title>
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              background: #f4f4f4;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            .box {
              background: white;
              padding: 30px 40px;
              border-radius: 10px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              text-align: center;
              width: 100%;
              max-width: 400px;
            }
            h2 {
              color: #333;
              margin-bottom: 15px;
            }
            p {
              color: #666;
              font-size: 15px;
              margin-bottom: 25px;
            }
          </style>
        </head>
        <body>
          <div class="box">
            <h2>You’ve been resubscribed</h2>
            <p>Welcome back! You’ll now receive future emails from us.</p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Resubscribe error:", err);
    return res.status(500).send("Something went wrong. Please try again later.");
  }
});


// New route for starting campaigns
router.post('/start-campaign', async (req, res) => {
  let campaignId = null;
  let transporter = null;

  try {
    const {
      campaignname,
      groupname,
      subject,
      attachments,
      previewtext,
      aliasName,
      replyTo,
      previewContent,
      bgColor,
      scheduledTime,
      senddate,
      user: userId,
      groupId,
      students
    } = req.body;

    // Validate required fields
    if (!groupId || !subject || !previewtext || !aliasName || !replyTo) {
      return res.status(400).json({ error: "Please ensure all required fields are provided." });
    }

    if (!previewContent || previewContent.length === 0) {
      return res.status(400).json({ error: "No preview content available." });
    }
    

    // Filter out students with invalid emails before processing
    const validStudents = students.filter(student => 
      student?.Email && isValidEmail(student.Email)
    );
    const invalidEmails = students
      .filter(student => !student?.Email || !isValidEmail(student.Email))
      .map(student => student?.Email || 'missing');

    // Create initial campaign record
    const campaignData = {
      campaignname,
      groupname,
      totalcount: students.length,
      recipients: "no mail",
      sendcount: 0,
      failedcount: invalidEmails.length,
      failedEmails: invalidEmails,
      sentEmails: [],
      subject,
      attachments,
      exceldata: [{}],
      previewtext,
      aliasName,
      replyTo,
      previewContent,
      bgColor,
      scheduledTime,
      status: "Pending",
      progress: 0,
      senddate,
      user: userId,
      groupId,
    };

    const newCampaign = await Camhistory.create(campaignData);
    campaignId = newCampaign._id;

    // Create common transporter
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    transporter = await createTransporter(user,aliasName);

    // Configure delay settings (in milliseconds)
    const DELAY_BETWEEN_EMAILS = 1000; // 1 seconds between each email
    const DELAY_BETWEEN_BATCHES = 2000; // 2 second between batches
    const BATCH_SIZE = 10; // Number of emails to send in each batch

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

   const dbStudent = await Student.findOne({ Email: student.Email,user: userId });

    if (!dbStudent) {
      console.log(`❌ Student not found: ${student.Email}`);
      continue;
    }

    if (!dbStudent.user || dbStudent.user.toString() !== userId) {
      console.log(`🚫 Unauthorized or invalid user for: ${student.Email}`);
      continue;
    }

    if (dbStudent.isUnsubscribed) {
      console.log(`⛔ Skipping unsubscribed user: ${student.Email}`);
      continue;
    }


          // Personalize content
          const personalizedContent = previewContent.map((item) => {
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
          let personalizedSubject = subject;
          Object.entries(student).forEach(([key, value]) => {
            const regex = new RegExp(`\\{?${key}\\}?`, "g");
            personalizedSubject = personalizedSubject.replace(
              regex,
              value != null ? String(value).trim() : ""
            );
          });

          // Prepare mail options
          const mailOptions = createMailOptions({
            student,
            userId,
            campaignId,
            subject: personalizedSubject,
            attachments,
            previewtext,
            aliasName,
            replyTo,
            previewContent: personalizedContent,
            bgColor,
            userEmail: user.email
          });

          // Send with retry logic
          await sendWithRetry(transporter, mailOptions);
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
      await Camhistory.findByIdAndUpdate(campaignId, {
        progress: currentProgress,
        sendcount: sentEmails.length,
        failedcount: failedEmails.length,
        sentEmails,
        failedEmails,
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
    await Camhistory.findByIdAndUpdate(campaignId, {
      status: finalStatus,
      progress: finalProgress,
      recipients: sentEmails.join(", "),
      sendcount: sentEmails.length,
      failedcount: failedEmails.length,
      sentEmails,
      failedEmails,
    });

    res.status(200).json({
      message: "Campaign processed successfully",
      campaignId,
      sentCount: sentEmails.length,
      failedCount: failedEmails.length,
      invalidEmailsCount: invalidEmails.length,
    });
  } catch (error) {
    console.error("Error processing campaign:", error);

    if (campaignId) {
      await Camhistory.findByIdAndUpdate(campaignId, {
        status: "Failed",
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Failed to process campaign",
      details: error.message,
    });
  } 
});

// Helper function to create transporter with minimal logging
async function createTransporter(user, aliasName) {
  if (user.email.includes('gmail')) {
    const oAuth2Client = await getAuthorizedOAuthClient(user._id);
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    return {
      sendMail: async (mailOptions) => {
        try {
          // Process attachments for Gmail API
          let attachmentParts = [];
          if (mailOptions.attachments && mailOptions.attachments.length > 0) {
            for (const file of mailOptions.attachments) {
              const response = await fetch(file.path);
              if (!response.ok) throw new Error(`Failed to fetch attachment`);
              const arrayBuffer = await response.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              const base64Content = buffer.toString('base64');
              attachmentParts.push([
                `--boundary_string`,
                `Content-Type: ${file.contentType}`,
                `Content-Disposition: attachment; filename="${file.filename}"`,
                `Content-Transfer-Encoding: base64`,
                '',
                base64Content
              ].join('\n'));
            }
          }

          // Construct email message
          const messageParts = [
            `From: "${aliasName}" <${user.email}>`,
            `Sender: "${aliasName}" <${user.email}>`,
            `To: ${mailOptions.to}`,
            `Reply-To: ${mailOptions.replyTo}`,
            `Subject: ${mailOptions.subject}`,
            'MIME-Version: 1.0',
            'Content-Type: multipart/mixed; boundary="boundary_string"',
            '',
            '--boundary_string',
            'Content-Type: text/html; charset="UTF-8"',
            '',
            mailOptions.html,
            ...attachmentParts,
            '--boundary_string--'
          ];

          const rawMessage = messageParts.join('\n');
          const encodedMessage = Buffer.from(rawMessage)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

          await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw: encodedMessage }
          });
          console.log(`Sent Mail Via Gmail Api to ${mailOptions.to}`);
        } catch (error) {
          console.log(`❌ Failed to send to ${mailOptions.to}`);
          throw error;
        }
      }
    };
  } else {
    // Hostinger SMTP
    const config = {
      auth: {
        user: user.email,
        pass: decryptPassword(user.smtppassword),
      },
      pool: true,
      maxConnections: 3,
      tls: { rejectUnauthorized: false }
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      ...config
    });

    return {
      sendMail: async (mailOptions) => {
        try {
          // Process attachments for SMTP
          if (mailOptions.attachments && mailOptions.attachments.length > 0) {
            mailOptions.attachments = await Promise.all(mailOptions.attachments.map(async (file) => {
              const response = await fetch(file.path);
              if (!response.ok) throw new Error(`Failed to fetch attachment`);
              const arrayBuffer = await response.arrayBuffer();
              return {
                filename: file.filename,
                content: Buffer.from(arrayBuffer),
                contentType: file.contentType
              };
            }))
          }

          await transporter.sendMail(mailOptions);
          console.log(`✅ Sent Mail Via Hostinger to ${mailOptions.to}`);
        } catch (error) {
          console.log(`❌ Failed to send to ${mailOptions.to}`);
          throw error;
        }
      }
    };
  }
}
// Helper function to create mail options
function createMailOptions({
  student,
  userId,
  campaignId,
  subject,
  attachments,
  previewtext,
  aliasName,
  replyTo,
  previewContent,
  bgColor,
  userEmail
}) {
  const dynamicHtml = previewContent.map(item => 
    generateHtml(item, userId, campaignId, student.Email)
  ).join('');

  const emailAttachments = attachments.map(file => ({
    filename: file.originalName,
    path: file.fileUrl,
    contentType: file.mimetype
  }));

  const trackingPixel = `<img src="${apiConfig.baseURL}/api/stud/track-email-open?emailId=${encodeURIComponent(student.Email)}&userId=${userId}&campaignId=${campaignId}&t=${Date.now()}" width="1" height="1" style="display:none;" />`;
  const unsubscribeLink = `${apiConfig.baseURL}/api/stud/unsubscribe?email=${encodeURIComponent(student.Email)}&userId=${userId}`;

  return {
    from: `"${aliasName}" <${userEmail}>`,
    to: student.Email,
    subject: subject,
    replyTo: replyTo,
    attachments: emailAttachments,
    html: `
      <html>
        <head>
     <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              
             .img-case {
  margin:0 auto !important;
  text-align:center !important;
  display:block;
  width:100%;
  max-width: 650px; /* Adjust as needed */
}

.img-case img {
  display: block;
  margin: 0 auto; /* Ensures the image is centered */
  max-width: 100%;
  height: auto; /* Ensures the image maintains its aspect ratio */
}
           

              @media(max-width:768px) {
                .main { width: 330px !important; }
                .img-case { width: 330px !important; }
                .img-para{
                  font-size:12px !important;
                }
                  .image-text tr{
    display: flex !important;
    flex-wrap: nowrap !important;
    justify-content: space-between !important;
  }
                
  /* Keep images inline on small screens */
  .multi tr {
    display: flex !important;
    flex-wrap: nowrap !important;
    justify-content: space-between !important;
  }
  .multi tr td {
    width: 48% !important; /* Ensures images stay side by side */
    padding: 5px !important;
  }
  .multi tr td img {
    height: 150px !important; /* Adjust image height for better fit */
    width: 100% !important;
    object-fit: cover !important;
  } 

                // .multimain td{
                //   padding:5px 8px 0px 0px !important;
                // }
                // .multi-img{
                //   width:100% !important;
                //   max-width:170px !important;
                //   height:auto !important;
                //   object-fit: contain !important; 

                // }
                 .img-btn{
                  width:85% !important;
                  margin:20px auto !important;
                  font-size:10px !important;
                  padding:10px !important;
                  
                }
                .head{
                  font-size:20px !important;
                }
              }
            </style>
        </head>
        <body>
          <div style="display:none !important; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
            ${previewtext}
          </div>
          <div class="main" style="background-color:${bgColor || "white"}; box-shadow:0 4px 8px rgba(0, 0, 0, 0.2); border:1px solid rgb(255, 245, 245); padding:20px;width:700px;height:auto;border-radius:10px;margin:0 auto;">
            ${dynamicHtml}
            ${trackingPixel}           
          </div>
          <div style="text-align:center; margin-top: 20px; font-size: 14px; color: #777;">
  If you no longer wish to receive these emails, you can 
  <a href="${unsubscribeLink}" style="color:#007BFF; text-decoration:underline;">unsubscribe here</a>.
        </div>
        </body>
      </html>
    `
  };
}

// Email validation helper
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Retry logic for email sending
async function sendWithRetry(transporter, mailOptions, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      if (typeof transporter.sendMail === 'function') {
        await transporter.sendMail(mailOptions);
      } else if (typeof transporter === 'object' && transporter.sendMail) {
        await transporter.sendMail(mailOptions); // Gmail API wrapper
      } else {
        throw new Error('Invalid transporter object');
      }
      return;
    } catch (error) {
      console.error(`❌ Attempt ${i + 1} failed for ${mailOptions.to}:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 5000 * (i + 1)));
    }
  }
}


// Keep your existing generateHtml function as is
function generateHtml(element, userId, campaignId, recipientEmail) {
      const {
        type,
        content,
        content1,
        content2,
        src1,
        src2,
        src,
        style,
        style1, style2, style3, style4,
        link, links1, links2, links3, links4,
        ContentStyle,
        iconsrc1, iconsrc2, iconsrc3, iconsrc4,
        link2,
        link1,
        buttonStyle1,
        buttonStyle2,
        title1,title2,offerPrice1,offerPrice2,originalPrice1,originalPrice2,
      } = element;
      const ContentStyleString = Object.entries(ContentStyle || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString4 = Object.entries(style4 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString3 = Object.entries(style3 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString2 = Object.entries(style2 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString1 = Object.entries(style1 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString = Object.entries(style || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const stylebuttonString1 = Object.entries(buttonStyle1 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const stylebuttonString2 = Object.entries(buttonStyle2 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleStringvideo = Object.entries(style || {})
        .filter(([key]) => key === 'width' || key === 'height')
        .map(([key, value]) => `${key}:${value}`)
        .join(';');

   const generateTrackingLink = (originalUrl, userId, campaignId, recipientEmail) => {
  if (!originalUrl || !userId || !campaignId || !recipientEmail) {
    console.error('Missing parameters for tracking link:', { originalUrl, userId, campaignId, recipientEmail });
    return originalUrl; 
  }
    return `${apiConfig.baseURL}/api/stud/track-click?emailId=${encodeURIComponent(recipientEmail)}&url=${encodeURIComponent(originalUrl)}&userId=${userId}&campaignId=${campaignId}`;
};
      switch (type) {
        case 'logo':
          return `<div style="margin:10px auto !important;${styleString};">
                  <img src="${src}" style="margin-top:10px;${styleString};" alt="image"/>
                </div>`;

        case 'image':
          return `<div class="img-case" style="margin:10px auto !important;${styleString};">
       <img src="${src}" style="${styleString};margin-top:10px;" alt="image" />
       </div>`;

        case 'imagewithtext':
          return `<table class="image-text" style="width:100%;border-radius:10px;height:220px !important;border-collapse:seperate;margin:15px 0px !important;${styleString1};">
      <tr>
          <td style = "vertical-align:top;padding:10px;">
              <img  src="${src1}" style="width:200px !important;border-radius:10px;height:200px !important;pointer-events:none !important; object-fit:cover;" alt="image"/>                  
          </td>
          <td style = "vertical-align:top;padding:10px;${styleString1};">
              <div class="img-para" style="overflow: auto;max-height: 200px !important;font-size:18px;">
              ${content1}
              </div>
          </td>
      </tr>
  </table>`;

  
case 'break':
  return `<table style="width:100%; border-collapse:collapse; margin:10px auto !important;">
    <tr>
      <td style="padding: 0;">
        <hr style="width:100%;background-color:#000000;margin: 30px 0px;" />
      </td>
    </tr>
  </table>`;

    case 'banner':
          return `<div style="margin:10px auto !important;${styleString};">
       <img src="${src}" style="${styleString};margin-top:10px;" alt="image" />
       </div>`;

  case 'multi-image-card':
      return `<table class="multi" style="width:100%; border-collapse:collapse;margin:10px auto !important;">
    <tr>
      <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
        <img src="${src1}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
        <h3 style="margin:10px 0;">${title1 || 'Name of the product'}</h3>
        <p style="margin:5px 0;"><s>${originalPrice1 ? `₹${originalPrice1}` : '₹9000'}</s></p>
        <p style="margin:5px 0;">${offerPrice1 ? `Off Price ₹${offerPrice1}` : 'Off Price ₹5999'}</p>
        <a class="img-btn"
          href="${generateTrackingLink(link1, userId, campaignId,recipientEmail)}"
          target="_blank"
          style="display:inline-block;padding:12px 25px;text-decoration: none;margin-top:20px;font-weight:bold;${stylebuttonString1}">
          ${content1}
        </a>
      </td>
      <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
        <img src="${src2}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
        <h3 style="margin:10px 0;">${title2 || 'Name of the product'}</h3>
        <p style="margin:5px 0;"><s>${originalPrice2 ? `₹${originalPrice2}` : '₹8000'}</s></p>
        <p style="margin:5px 0;">${offerPrice2 ? `Off Price ₹${offerPrice2}` : 'Off Price ₹4999'}</p>
        <a class="img-btn"
          href="${generateTrackingLink(link2, userId, campaignId, recipientEmail)}"
          target="_blank"
          style="display:inline-block;padding:12px 25px;font-weight:bold;text-decoration: none;${stylebuttonString2}">
          ${content2}
        </a>
      </td>
    </tr>
  </table>`;

  case 'gap':
  return `<table style="width:100%; border-collapse:collapse; margin:30px 0;">
    <tr>
      <td style="padding: 0;">
        <div style="margin:0 auto;width:100%;height:40px"></div>
      </td>
    </tr>
  </table>`;

        case 'cardimage':
          return `
    <table role="presentation" align="center"  style="${styleString};border-collapse: separate; border-spacing: 0; margin: 10px auto!important;">
<tr>
    <td align="center"  style="vertical-align: top;${styleString} border-radius: 10px; padding: 0;">
        <!-- Image -->
        <img src="${src1}" style="display: block;${styleString}; border-top-left-radius: 10px; border-top-right-radius: 10px; object-fit: cover;" alt="image"/>
        
        <!-- Text Content -->
        <div style="font-size: 15px;${styleString};${styleString1}; padding:10px 0px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            ${content1}
        </div>
    </td>
</tr>
</table>`


        case 'textwithimage':
          return `<table class="image-text" style="width:100%;border-radius:10px;height:220px !important;border-collapse:seperate;margin:15px 0px !important;${styleString};">
      <tr>
        <td style = "vertical-align:top;padding:10px;${styleString};">
              <div class="img-para" style="overflow: auto;max-height: 200px !important;font-size:18px;">
              ${content2}
              </div>
          </td>
          <td style = "vertical-align:top;padding:10px;">
              <img  src="${src2}" style="width:200px !important;border-radius:10px;height:200px !important;pointer-events:none !important; object-fit:cover;" alt="image"/>                  
          </td>
        
      </tr>
  </table>`;

        case 'video-icon':
          return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
<tr>
  <td align="center">
    <table role="presentation"  cellspacing="0" cellpadding="0" border="0" 
           style="${styleStringvideo};background: url('${src1}') no-repeat center center; background-size: cover; border-radius: 10px; overflow: hidden;margin:15px 0px !important;">
      <tr>
        <td align="center" valign="middle" style="${styleStringvideo};padding: 0;">
            <a href="${generateTrackingLink(link, userId, campaignId, recipientEmail)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
            <img src="${src2}" width="70" height="70" 
                 style="display: block; border-radius: 50%; background-color: white;" 
                 alt="Click Now" />
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>
</table>
  `;


        case 'icons':
          return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${ContentStyleString};margin:15px 0px !important;">
        <tr>
            <td style="padding: 20px; text-align:center;${ContentStyleString};">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                        <td style="padding: 0 10px;">
                            <a href="${generateTrackingLink(links1, userId, campaignId, recipientEmail)}" target="_blank" style="text-decoration:none;">
                                <img src="${iconsrc1}" style="cursor:pointer;${styleString1};" alt="icon1"/>
                            </a>
                        </td>
                        <td style="padding: 0 10px;">
                            <a href="${generateTrackingLink(links2, userId, campaignId, recipientEmail)}" target="_blank" style="text-decoration:none;">
                                <img src="${iconsrc2}" style="cursor:pointer;${styleString2};" alt="icon2"/>
                            </a>
                        </td>
                        <td style="padding: 0 12px;">
                        <a href="${generateTrackingLink(links3, userId, campaignId, recipientEmail)}" target="_blank" style="text-decoration:none;">
                            <img src="${iconsrc3}" style="cursor:pointer;${styleString3};" alt="icon3"/>
                        </a>
                    </td>
                     <td style="padding: 0 10px;">
                        <a href="${generateTrackingLink(links4, userId, campaignId, recipientEmail)}"  target="_blank" style="text-decoration:none;">
                            <img src="${iconsrc4}" style="cursor:pointer;${styleString4};" alt="icon3"/>
                        </a>
                    </td>                     
                  </tr>
                </table>
            </td>
        </tr>
    </table>`;

        case 'link-image':
          return `<div class="img-case" style="margin:10px auto !important;${styleString};">
        <a href ="${generateTrackingLink(link, userId, campaignId, recipientEmail)}" target = "_blank" style="text-decoration:none;"><img src="${src}" style="${styleString};margin-top:10px;" alt="image"/></a>
        </div>`;

        case 'multi-image':
          return `<table class="multi" style="width:100%; border-collapse:collapse;margin:10px auto !important;">
          <tr>
              <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                  <img src="${src1}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover; ${styleString}" alt="image"/>
                  <a class="img-btn" href="${generateTrackingLink(link1, userId, campaignId, recipientEmail)}"  target="_blank" style="${stylebuttonString1}; display:inline-block;margin-top:20px; padding:12px 25px; text-decoration:none;">
                      ${content1}
                  </a>
              </td>
              <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                  <img src="${src2}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;${styleString}" alt="image"/>
                  <a class="img-btn" href="${generateTrackingLink(link2, userId, campaignId, recipientEmail)}" target="_blank" style="${stylebuttonString2}; display:inline-block;margin-top:20px; padding:12px 25px; text-decoration:none;">
                      ${content2}
                  </a>
              </td>
          </tr>
        </table>`;

        case 'multipleimage':
          return `<table class="multi" style="width:100%; border-collapse:collapse;margin:10px auto !important;">
          <tr>
              <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                  <img src="${src1}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
              </td>
              <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                  <img src="${src2}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
              </td>
          </tr>
      </table>`

        case 'head':
          return `<p class="head" style="${styleString};border-radius:10px;margin-top:10px;padding:10px;font-weight:bold;">${content}</p>`;
        case 'para':
          return `<div style="${styleString};margin-top:20px;padding:10px 40px;">${content}</div>`;
        case 'button':
          return `<div style="margin:20px auto 0 auto;text-align:center;">
                  <a href = "${generateTrackingLink(link, userId, campaignId, recipientEmail)}"
                  target = "_blank"
                  style = "${styleString};display:inline-block;padding:12px 25px;text-decoration:none;" >
                    ${content}
                  </a>
                </div>`;
        default:
          return '';
      }
    };


//sendexcelmail directly
router.post('/sendexcelEmail', async (req, res) => {
  const {
    recipientEmail,
    subject,
    aliasName,
    body,
    bgColor, attachments,replyTo,
    previewtext,
    userId,
    campaignId
  } = req.body;

  if (!recipientEmail) {
    return res.status(400).send("Email is required.");
  }
  // Find the current user by userId
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send('User not found');
  }

  // user model has fields for email and smtppassword
  const {
    email,
    smtppassword
  } = user;

  // Determine the transporter based on email provider
  let transporter;

  if (email.includes("gmail")) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: decryptPassword(smtppassword),
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: email,
        pass: decryptPassword(smtppassword),
      },
      tls: {
        // Do not fail on invalid certificates
        rejectUnauthorized: false,
      },
    });
  }


  try {
    // Parse the body string as JSON
    const bodyElements = JSON.parse(body);

    // Function to generate HTML from JSON structure
    const generateHtml = (element) => {
      const {
        type,
        content,
        content1,
        content2,
        src1,
        src2,
        src,
        style,
        style1, style2, style3, style4,
        link, links1, links2, links3, links4,
        ContentStyle,
        iconsrc1, iconsrc2, iconsrc3, iconsrc4,
        link2,
        link1,
        buttonStyle1,
        buttonStyle2,
        title1,title2,offerPrice1,offerPrice2,originalPrice1,originalPrice2,
      } = element;
      const ContentStyleString = Object.entries(ContentStyle || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString4 = Object.entries(style4 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString3 = Object.entries(style3 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString2 = Object.entries(style2 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString1 = Object.entries(style1 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString = Object.entries(style || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const stylebuttonString1 = Object.entries(buttonStyle1 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const stylebuttonString2 = Object.entries(buttonStyle2 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleStringvideo = Object.entries(style || {})
        .filter(([key]) => key === 'width' || key === 'height')
        .map(([key, value]) => `${key}:${value}`)
        .join(';');
      const generateTrackingLink = (originalUrl, userId, campaignId, recipientEmail) => {
        return `${apiConfig.baseURL}/api/stud/track-click?emailId=${encodeURIComponent(recipientEmail)}&url=${encodeURIComponent(originalUrl)}&userId=${userId}&campaignId=${campaignId}`;
      };
      switch (type) {
        case 'logo':
          return `<div style="margin:10px auto !important;${styleString};">
                  <img src="${src}" style="margin-top:10px;${styleString};" alt="image"/>
                </div>`;

        case 'image':
          return `<div class="img-case" style="margin:10px auto !important;${styleString};">
       <img src="${src}" style="${styleString};margin-top:10px;" alt="image" />
       </div>`;

        case 'imagewithtext':
          return `<table class="image-text" style="width:100%;height:220px !important;border-collapse:seperate;margin:15px 0px !important;${styleString1};">
      <tr>
          <td style = "vertical-align:top;padding:10px;">
              <img  src="${src1}" style="width:200px !important;height:200px !important;pointer-events:none !important; object-fit:cover;" alt="image"/>                  
          </td>
          <td style = "vertical-align:top;padding:10px;${styleString1};">
              <div class="img-para" style="overflow: auto;max-height: 200px !important;font-size:18px;">
              ${content1}
              </div>
          </td>
      </tr>
  </table>`;

   
case 'break':
  return `<table style="width:100%; border-collapse:collapse; margin:10px auto !important;">
    <tr>
      <td style="padding: 0;">
        <hr style="width:100%;background-color:#000000;margin: 30px 0px;" />
      </td>
    </tr>
  </table>`;

    case 'banner':
          return `<div style="margin:10px auto !important;${styleString};">
       <img src="${src}" style="${styleString};margin-top:10px;" alt="image" />
       </div>`;

  case 'multi-image-card':
      return `<table class="multi" style="width:100%; border-collapse:collapse;margin:10px auto !important;">
    <tr>
      <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
        <img src="${src1}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
        <h3 style="margin:10px 0;">${title1 || 'Name of the product'}</h3>
        <p style="margin:5px 0;"><s>${originalPrice1 ? `₹${originalPrice1}` : '₹9000'}</s></p>
        <p style="margin:5px 0;">${offerPrice1 ? `Off Price ₹${offerPrice1}` : 'Off Price ₹5999'}</p>
        <a class="img-btn"
          href="${generateTrackingLink(link1, userId, campaignId,recipientEmail)}"
          target="_blank"
          style="display:inline-block;padding:12px 25px;margin-top:20px;text-decoration:none;font-weight:bold;${stylebuttonString1}">
          ${content1}
        </a>
      </td>
      <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
        <img src="${src2}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
        <h3 style="margin:10px 0;">${title2 || 'Name of the product'}</h3>
        <p style="margin:5px 0;"><s>${originalPrice2 ? `₹${originalPrice2}` : '₹8000'}</s></p>
        <p style="margin:5px 0;">${offerPrice2 ? `Off Price ₹${offerPrice2}` : 'Off Price ₹4999'}</p>
        <a class="img-btn"
          href="${generateTrackingLink(link2, userId, campaignId, recipientEmail)}"
          target="_blank"
          style="display:inline-block;padding:12px 25px;text-decoration:none;font-weight:bold;${stylebuttonString2}">
          ${content2}
        </a>
      </td>
    </tr>
  </table>`;

  case 'gap':
  return `<table style="width:100%; border-collapse:collapse; margin:30px 0;">
    <tr>
      <td style="padding: 0;">
        <div style="margin:0 auto;width:100%;height:40px"></div>
      </td>
    </tr>
  </table>`;
        case 'cardimage':
          return `
    <table role="presentation" align="center"  style="${styleString};border-collapse: separate; border-spacing: 0; margin: 10px auto!important;">
<tr>
    <td align="center"  style="vertical-align: top;${styleString} border-radius: 10px; padding: 0;">
        <!-- Image -->
        <img src="${src1}" style="display: block;${styleString}; border-top-left-radius: 10px; border-top-right-radius: 10px; object-fit: cover;" alt="image"/>
        
        <!-- Text Content -->
        <div style="font-size: 15px;${styleString};${styleString1}; padding:10px 0px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            ${content1}
        </div>
    </td>
</tr>
</table>`

        case 'textwithimage':
          return `<table class="image-text" style="width:100%;height:220px !important;border-collapse:seperate;margin:15px 0px !important;${styleString};">
      <tr>
        <td style = "vertical-align:top;padding:10px;${styleString};">
              <div class="img-para" style="overflow: auto;max-height: 200px !important;font-size:18px;">
              ${content2}
              </div>
          </td>
          <td style = "vertical-align:top;padding:10px;">
              <img  src="${src2}" style="width:200px !important;height:200px !important;pointer-events:none !important; object-fit:cover;" alt="image"/>                  
          </td>
        
      </tr>
  </table>`;

        case 'video-icon':
          return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
<tr>
  <td align="center">
    <table role="presentation"  cellspacing="0" cellpadding="0" border="0" 
           style="${styleStringvideo};background: url('${src1}') no-repeat center center; background-size: cover; border-radius: 10px; overflow: hidden;margin:15px 0px !important;">
      <tr>
        <td align="center" valign="middle" style="${styleStringvideo};padding: 0;">
          <a href="${generateTrackingLink(link, userId, campaignId, recipientEmail)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
            <img src="${src2}" width="70" height="70" 
                 style="display: block; border-radius: 50%; background-color: white;" 
                 alt="Click Now" />
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>
</table>
  `;


        case 'icons':
          return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${ContentStyleString};margin:15px 0px !important;">
        <tr>
            <td style="padding: 20px; text-align:center;${ContentStyleString};">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                        <td style="padding: 0 10px;">
                            <a href="${generateTrackingLink(links1, userId, campaignId, recipientEmail)}" target="_blank" style="text-decoration:none;">
                                <img src="${iconsrc1}" style="cursor:pointer;${styleString1};" alt="icon1"/>
                            </a>
                        </td>
                        <td style="padding: 0 10px;">
                            <a href="${generateTrackingLink(links2, userId, campaignId, recipientEmail)}" target="_blank" style="text-decoration:none;">
                                <img src="${iconsrc2}" style="cursor:pointer;${styleString2};" alt="icon2"/>
                            </a>
                        </td>
                        <td style="padding: 0 12px;">
                        <a href="${generateTrackingLink(links3, userId, campaignId, recipientEmail)}" target="_blank" style="text-decoration:none;">
                            <img src="${iconsrc3}" style="cursor:pointer;${styleString3};" alt="icon3"/>
                        </a>
                    </td>
                     <td style="padding: 0 10px;">
                        <a href="${generateTrackingLink(links4, userId, campaignId, recipientEmail)}" target="_blank" style="text-decoration:none;">
                            <img src="${iconsrc4}" style="cursor:pointer;${styleString4};" alt="icon3"/>
                        </a>
                    </td>                     
                  </tr>
                </table>
            </td>
        </tr>
    </table>`;

        case 'link-image':
          return `<div class="img-case" style="margin:10px auto !important;${styleString};">
        <a href = "${generateTrackingLink(link, userId, campaignId, recipientEmail)}"  target = "_blank" style="text-decoration:none;"><img src="${src}" style="${styleString};margin-top:10px;" alt="image"/></a>
        </div>`;

        case 'multi-image':
          return `<table class="multi" style="width:100%; border-collapse:collapse;margin:10px auto !important;">
          <tr>
              <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                  <img src="${src1}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover; ${styleString}" alt="image"/>
                  <a class="img-btn" href="${generateTrackingLink(link1, userId, campaignId, recipientEmail)}" target="_blank" style="${stylebuttonString1}; display:inline-block; margin-top:20px;padding:12px 25px; text-decoration:none;">
                      ${content1}
                  </a>
              </td>
              <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                  <img src="${src2}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;${styleString}" alt="image"/>
                  <a class="img-btn" href="${generateTrackingLink(link2, userId, campaignId, recipientEmail)}" target="_blank" style="${stylebuttonString2}; display:inline-block;margin-top:20px; padding:12px 25px; text-decoration:none;">
                      ${content2}
                  </a>
              </td>
          </tr>
        </table>`;
        case 'multipleimage':
          return `<table class="multi" style="width:100%; border-collapse:collapse;margin:10px auto !important;">
          <tr>
              <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                  <img src="${src1}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
              </td>
              <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                  <img src="${src2}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
              </td>
          </tr>
      </table>`

        case 'head':
          return `<p class="head" style="${styleString};border-radius:10px;margin-top:10px;padding:10px;font-weight:bold;">${content}</p>`;
        case 'para':
          return `<div style="${styleString};margin-top:20px;padding:10px 40px; white-space: pre-line;
  word-break: break-word;">${content}</div>`;
        case 'button':
          return `<div style="margin:20px auto 0 auto;text-align:center;">
                  <a href = "${generateTrackingLink(link, userId, campaignId, recipientEmail)}"
                  target = "_blank"
                  style = "${styleString};display:inline-block;padding:12px 25px;text-decoration:none;" >
                    ${content}
                  </a>
                </div>`;
        default:
          return '';
      }
    };

    const dynamicHtml = bodyElements.map(generateHtml).join('');
    const Attachments = attachments.map(file => ({
      filename: file.originalName,
      path: file.fileUrl, // Use Cloudinary URL directly
      contentType: file.mimetype
    }));

    const trackingPixel = `<img src="${apiConfig.baseURL}/api/stud/track-email-open?emailId=${encodeURIComponent(recipientEmail)}&userId=${userId}&campaignId=${campaignId}&t=${Date.now()}" width="1" height="1" style="display:none;" />`;

    const mailOptions = {
      from: `"${aliasName}" <${email}>`,
      to: recipientEmail,
      subject: subject,
      replyTo:replyTo,
      attachments: Attachments,

      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              
             .img-case {
  margin:0 auto !important;
  text-align:center !important;
  display:block;
  width:100%;
  max-width: 650px; /* Adjust as needed */
}

.img-case img {
  display: block;
  margin: 0 auto; /* Ensures the image is centered */
  max-width: 100%;
  height: auto; /* Ensures the image maintains its aspect ratio */
}
           

              @media(max-width:768px) {
                .main { width: 330px !important; }
                .img-case { width: 330px !important; }

                .para{
                  font-size:15px !important;
                }
                .img-para{
                  font-size:12px !important;
                }
                  .image-text tr{
    display: flex !important;
    flex-wrap: nowrap !important;
    justify-content: space-between !important;
  }
                
  /* Keep images inline on small screens */
  .multi tr {
    display: flex !important;
    flex-wrap: nowrap !important;
    justify-content: space-between !important;
  }
  .multi tr td {
    width: 48% !important; /* Ensures images stay side by side */
    padding: 5px !important;
  }
  .multi tr td img {
    height: 150px !important; /* Adjust image height for better fit */
    width: 100% !important;
    object-fit: cover !important;
  } 

                // .multimain td{
                //   padding:5px 8px 0px 0px !important;
                // }
                // .multi-img{
                //   width:100% !important;
                //   max-width:170px !important;
                //   height:auto !important;
                //   object-fit: contain !important; 

                // }
                 .img-btn{
                  width:85% !important;
                  margin:20px auto !important;
                  font-size:10px !important;
                  padding:10px !important;
                  
                }
                .head{
                  font-size:20px !important;
                }
              }
            </style>
          </head>
          <body>
            <div style="display:none !important; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
              ${previewtext}
            </div>
              <div class="main" style="background-color:${bgColor || "white"}; box-shadow:0 4px 8px rgba(0, 0, 0, 0.2); border:1px solid rgb(255, 245, 245); padding:20px;width:700px;height:auto;border-radius:10px;margin:0 auto;">
                ${dynamicHtml}
                ${trackingPixel}
              </div>
          </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${recipientEmail}`);
    res.send('All Email sent successfully!');
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send(error.toString());
  }
});


//Sendbulk mail using group
router.post('/sendbulkEmail', async (req, res) => {
  const {
    recipientEmail,
    subject,
    aliasName,replyTo,
    body,
    bgColor, attachments,
    previewtext,
    userId,
    campaignId
  } = req.body;

  if (!recipientEmail) {
    return res.status(400).send("Email is required.");
  }
  // Find the current user by userId
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send('User not found');
  }

// Find the student by email and check ownership directly
const student = await Student.findOne({ Email: recipientEmail,user: userId});

if (!student) {
  return res.status(404).json({ message: 'Student not found' });
}

// ✅ Check if student belongs to the current user
if (student.user.toString() !== userId) {
  return res.status(403).json({ message: 'Unauthorized access to student' });
}

// ✅ Check if unsubscribed
if (student.isUnsubscribed) {
  console.log(`❌ Skipping email for unsubscribed recipient: ${recipientEmail}`);
  return res.status(200).json({ message: 'User has unsubscribed. Email not sent.' });
}

  const {
    email
  } = user;


  try {
    // Parse the body string as JSON
    const bodyElements = JSON.parse(body);

    // Function to generate HTML from JSON structure
    const generateHtml = (element) => {
      const {
        type,
        content,
        content1,
        content2,
        src1,
        src2,
        src,
        style,
        style1, style2, style3, style4,
        link, links1, links2, links3, links4,
        ContentStyle,
        iconsrc1, iconsrc2, iconsrc3, iconsrc4,
        link2,
        link1,
        buttonStyle1,
        buttonStyle2,
        title1,title2,offerPrice1,offerPrice2,originalPrice1,originalPrice2,
      } = element;
      const ContentStyleString = Object.entries(ContentStyle || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString4 = Object.entries(style4 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString3 = Object.entries(style3 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString2 = Object.entries(style2 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString1 = Object.entries(style1 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleString = Object.entries(style || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const stylebuttonString1 = Object.entries(buttonStyle1 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const stylebuttonString2 = Object.entries(buttonStyle2 || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');
      const styleStringvideo = Object.entries(style || {})
        .filter(([key]) => key === 'width' || key === 'height')
        .map(([key, value]) => `${key}:${value}`)
        .join(';');

      const generateTrackingLink = (originalUrl, userId, campaignId, recipientEmail) => {
        return `${apiConfig.baseURL}/api/stud/track-click?emailId=${encodeURIComponent(recipientEmail)}&url=${encodeURIComponent(originalUrl)}&userId=${userId}&campaignId=${campaignId}`;
      };

      switch (type) {
        case 'logo':
          return `<div style="margin:10px auto !important;${styleString};">
                  <img src="${src}" style="margin-top:10px;${styleString};" alt="image"/>
                </div>`;

        case 'image':
          return `<div class="img-case" style="margin:10px auto !important;${styleString};">
       <img src="${src}" style="${styleString};margin-top:10px;" alt="image" />
       </div>`;

        case 'imagewithtext':
          return `<table class="image-text" style="width:100%;border-radius:10px;height:220px !important;border-collapse:seperate;margin:15px 0px !important;${styleString1};">
      <tr>
          <td style = "vertical-align:top;padding:10px;">
              <img  src="${src1}" style="width:200px !important;border-radius:10px;height:200px !important;pointer-events:none !important; object-fit:cover;" alt="image"/>                  
          </td>
          <td style = "vertical-align:top;padding:10px;${styleString1};">
              <div class="img-para" style="overflow: auto;max-height: 200px !important;font-size:18px;">
              ${content1}
              </div>
          </td>
      </tr>
  </table>`;

  
case 'break':
  return `<table style="width:100%; border-collapse:collapse; margin:10px auto !important;">
    <tr>
      <td style="padding: 0;">
        <hr style="width:100%;background-color:#000000;margin: 30px 0px;" />
      </td>
    </tr>
  </table>`;

    case 'banner':
          return `<div style="margin:10px auto !important;${styleString};">
       <img src="${src}" style="${styleString};margin-top:10px;" alt="image" />
       </div>`;

  case 'multi-image-card':
      return `<table class="multi" style="width:100%; border-collapse:collapse;margin:10px auto !important;">
    <tr>
      <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
        <img src="${src1}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
        <h3 style="margin:10px 0;">${title1 || 'Name of the product'}</h3>
        <p style="margin:5px 0;"><s>${originalPrice1 ? `₹${originalPrice1}` : '₹9000'}</s></p>
        <p style="margin:5px 0;">${offerPrice1 ? `Off Price ₹${offerPrice1}` : 'Off Price ₹5999'}</p>
        <a class="img-btn"
          href="${generateTrackingLink(link1, userId, campaignId,recipientEmail)}"
          target="_blank"
          style="display:inline-block;padding:12px 25px;text-decoration: none;margin-top:20px;font-weight:bold;${stylebuttonString1}">
          ${content1}
        </a>
      </td>
      <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
        <img src="${src2}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
        <h3 style="margin:10px 0;">${title2 || 'Name of the product'}</h3>
        <p style="margin:5px 0;"><s>${originalPrice2 ? `₹${originalPrice2}` : '₹8000'}</s></p>
        <p style="margin:5px 0;">${offerPrice2 ? `Off Price ₹${offerPrice2}` : 'Off Price ₹4999'}</p>
        <a class="img-btn"
          href="${generateTrackingLink(link2, userId, campaignId, recipientEmail)}"
          target="_blank"
          style="display:inline-block;padding:12px 25px;font-weight:bold;text-decoration: none;${stylebuttonString2}">
          ${content2}
        </a>
      </td>
    </tr>
  </table>`;

  case 'gap':
  return `<table style="width:100%; border-collapse:collapse; margin:30px 0;">
    <tr>
      <td style="padding: 0;">
        <div style="margin:0 auto;width:100%;height:40px"></div>
      </td>
    </tr>
  </table>`;

        case 'cardimage':
          return `
    <table role="presentation" align="center"  style="${styleString};border-collapse: separate; border-spacing: 0; margin: 10px auto!important;">
<tr>
    <td align="center"  style="vertical-align: top;${styleString} border-radius: 10px; padding: 0;">
        <!-- Image -->
        <img src="${src1}" style="display: block;${styleString}; border-top-left-radius: 10px; border-top-right-radius: 10px; object-fit: cover;" alt="image"/>
        
        <!-- Text Content -->
        <div style="font-size: 15px;${styleString};${styleString1}; padding:10px 0px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            ${content1}
        </div>
    </td>
</tr>
</table>`


        case 'textwithimage':
          return `<table class="image-text" style="width:100%;border-radius:10px;height:220px !important;border-collapse:seperate;margin:15px 0px !important;${styleString};">
      <tr>
        <td style = "vertical-align:top;padding:10px;${styleString};">
              <div class="img-para" style="overflow: auto;max-height: 200px !important;font-size:18px;">
              ${content2}
              </div>
          </td>
          <td style = "vertical-align:top;padding:10px;">
              <img  src="${src2}" style="width:200px !important;border-radius:10px;height:200px !important;pointer-events:none !important; object-fit:cover;" alt="image"/>                  
          </td>
        
      </tr>
  </table>`;

        case 'video-icon':
          return `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
<tr>
  <td align="center">
    <table role="presentation"  cellspacing="0" cellpadding="0" border="0" 
           style="${styleStringvideo};background: url('${src1}') no-repeat center center; background-size: cover; border-radius: 10px; overflow: hidden;margin:15px 0px !important;">
      <tr>
        <td align="center" valign="middle" style="${styleStringvideo};padding: 0;">
            <a href="${generateTrackingLink(link, userId, campaignId, recipientEmail)}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
            <img src="${src2}" width="70" height="70" 
                 style="display: block; border-radius: 50%; background-color: white;" 
                 alt="Click Now" />
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>
</table>
  `;


        case 'icons':
          return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${ContentStyleString};margin:15px 0px !important;">
        <tr>
            <td style="padding: 20px; text-align:center;${ContentStyleString};">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                        <td style="padding: 0 10px;">
                            <a href="${generateTrackingLink(links1, userId, campaignId, recipientEmail)}" target="_blank" style="text-decoration:none;">
                                <img src="${iconsrc1}" style="cursor:pointer;${styleString1};" alt="icon1"/>
                            </a>
                        </td>
                        <td style="padding: 0 10px;">
                            <a href="${generateTrackingLink(links2, userId, campaignId, recipientEmail)}" target="_blank" style="text-decoration:none;">
                                <img src="${iconsrc2}" style="cursor:pointer;${styleString2};" alt="icon2"/>
                            </a>
                        </td>
                        <td style="padding: 0 12px;">
                        <a href="${generateTrackingLink(links3, userId, campaignId, recipientEmail)}" target="_blank" style="text-decoration:none;">
                            <img src="${iconsrc3}" style="cursor:pointer;${styleString3};" alt="icon3"/>
                        </a>
                    </td>
                     <td style="padding: 0 10px;">
                        <a href="${generateTrackingLink(links4, userId, campaignId, recipientEmail)}"  target="_blank" style="text-decoration:none;">
                            <img src="${iconsrc4}" style="cursor:pointer;${styleString4};" alt="icon3"/>
                        </a>
                    </td>                     
                  </tr>
                </table>
            </td>
        </tr>
    </table>`;

        case 'link-image':
          return `<div class="img-case" style="margin:10px auto !important;${styleString};">
        <a href ="${generateTrackingLink(link, userId, campaignId, recipientEmail)}" target = "_blank" style="text-decoration:none;"><img src="${src}" style="${styleString};margin-top:10px;" alt="image"/></a>
        </div>`;

        case 'multi-image':
          return `<table class="multi" style="width:100%; border-collapse:collapse;margin:10px auto !important;">
          <tr>
              <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                  <img src="${src1}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover; ${styleString}" alt="image"/>
                  <a class="img-btn" href="${generateTrackingLink(link1, userId, campaignId, recipientEmail)}"  target="_blank" style="${stylebuttonString1}; display:inline-block;margin-top:20px; padding:12px 25px; text-decoration:none;">
                      ${content1}
                  </a>
              </td>
              <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                  <img src="${src2}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;${styleString}" alt="image"/>
                  <a class="img-btn" href="${generateTrackingLink(link2, userId, campaignId, recipientEmail)}" target="_blank" style="${stylebuttonString2}; display:inline-block;margin-top:20px; padding:12px 25px; text-decoration:none;">
                      ${content2}
                  </a>
              </td>
          </tr>
        </table>`;

        case 'multipleimage':
          return `<table class="multi" style="width:100%; border-collapse:collapse;margin:10px auto !important;">
          <tr>
              <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                  <img src="${src1}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
              </td>
              <td style="width:50%;text-align:center;padding:8px; vertical-align:top;">
                  <img src="${src2}" style="border-radius:10px;object-fit:contain;height:230px !important;width:100%;pointer-events:none !important; object-fit:cover;" alt="image"/>
              </td>
          </tr>
      </table>`

        case 'head':
          return `<p class="head" style="${styleString};border-radius:10px;margin-top:10px;padding:10px;font-weight:bold;">${content}</p>`;
        case 'para':
          return `<div style="${styleString};margin-top:20px;padding:10px 40px; white-space: pre-line;
  word-break: break-word;">${content}</div>`;
        case 'button':
          return `<div style="margin:20px auto 0 auto;text-align:center;">
                  <a href = "${generateTrackingLink(link, userId, campaignId, recipientEmail)}"
                  target = "_blank"
                  style = "${styleString};display:inline-block;padding:12px 25px;text-decoration:none;" >
                    ${content}
                  </a>
                </div>`;
        default:
          return '';
      }
    };

    const dynamicHtml = bodyElements.map(generateHtml).join('');
     // Tracking pixel
    const trackingPixel = `<img src="${apiConfig.baseURL}/api/stud/track-email-open?emailId=${encodeURIComponent(recipientEmail)}&userId=${userId}&campaignId=${campaignId}&t=${Date.now()}" width="1" height="1" style="display:none;" />`;
    const unsubscribeLink = `${apiConfig.baseURL}/api/stud/unsubscribe?email=${encodeURIComponent(recipientEmail)}&userId=${userId}`;

    // Full email HTML
    const emailHtml = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            @media(max-width:768px) {
              .main { width: 330px !important; }
              .img-case { width: 330px !important; }
              .para{ font-size:15px !important; }
              .img-para{ font-size:15px !important; }
              .image-text{ width:330px !important;}
              .image-text tr{
                display: flex !important;
                flex-wrap: nowrap !important;
                justify-content: space-between !important;
              }
              .multi tr {
                display: flex !important;
                flex-wrap: nowrap !important;
                justify-content: space-between !important;
              }
              .multi tr td {
                width: 48% !important;
                padding: 5px !important;
              }
              .multi tr td img {
                height: 150px !important;
                width: 100% !important;
                object-fit: cover !important;
              }
              .img-btn{
                width:85% !important;
                margin:20px auto !important;
                font-size:10px !important;
                padding:10px !important;
              }
              .head{
                font-size:20px !important;
              }
            }
          </style>
        </head>
        <body>
            <div style="display:none !important; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
              ${previewtext}
            </div>
              <div class="main" style="background-color:${bgColor || "white"}; box-shadow:0 4px 8px rgba(0, 0, 0, 0.2); border:1px solid rgb(255, 245, 245); padding:20px;width:700px;height:auto;border-radius:10px;margin:0 auto;">
                ${dynamicHtml}
                ${trackingPixel}               
              </div>
              <div style="text-align:center; margin-top: 20px; font-size: 14px; color: #777;">
  If you no longer wish to receive these emails, you can 
  <a href="${unsubscribeLink}" style="color:#007BFF; text-decoration:underline;">unsubscribe here</a>.
</div>
          </body>
      </html>
    `;

    // Process attachments
   let attachmentParts = [];

if (attachments && attachments.length > 0) {
  for (const file of attachments) {
    try {
      const response = await fetch(file.fileUrl);
      if (!response.ok) throw new Error(`Failed to fetch attachment: ${response.statusText}`);

      // Convert arrayBuffer to Buffer
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const base64Content = buffer.toString('base64');

      attachmentParts.push([
        `--boundary_string`,
        `Content-Type: ${file.mimetype}`,
        `Content-Disposition: attachment; filename="${file.originalName}"`,
        `Content-Transfer-Encoding: base64`,
        '',
        base64Content
      ].join('\n'));
    } catch (error) {
      console.error(`Error processing attachment ${file.originalName}:`, error);
    }
  }
}

 // Determine sending method based on email domain
    if (email.includes("gmail")) {
      try {
        const oAuth2Client = await getAuthorizedOAuthClient(userId);
        
        const messageParts = [
          `From: "${aliasName}" <${email}>`,
          `To: ${recipientEmail}`,
          `Reply-To: ${replyTo || email}`,
          `Subject: ${subject}`,
          'MIME-Version: 1.0',
          'Content-Type: multipart/mixed; boundary="boundary_string"',
          '',
          '--boundary_string',
          'Content-Type: text/html; charset="UTF-8"',
          '',
          emailHtml,
          ...attachmentParts,
          '--boundary_string--'
        ];

        const rawMessage = messageParts.join('\n');
        const encodedMessage = Buffer.from(rawMessage)
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        const sendResponse = await gmail.users.messages.send({
          userId: 'me',
          requestBody: { raw: encodedMessage }
        });

        console.log(`✅ Email sent via Gmail API to: ${recipientEmail}`);
        return res.status(200).json({ 
          message: 'Email sent successfully via Gmail API', 
          response: sendResponse.data 
        });

      } catch (error) {
        console.error('Gmail API error:', error);
        if (error.code === 401) {
          return res.status(401).json({
            error: 'Gmail authentication failed - token may be expired',
            authUrl: `${apiConfig.baseURL}/auth/google?userId=${userId}`
          });
        }
        throw error;
      }
    } else {
      // Use Hostinger SMTP
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true,
          auth: {
            user: email,
            pass: decryptPassword(user.smtppassword),
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        // Prepare attachments for Nodemailer
        const Attachments = attachments.map(file => ({
      filename: file.originalName,
      path: file.fileUrl, // Use Cloudinary URL directly
      contentType: file.mimetype
    }));

        const info = await transporter.sendMail({
          from: `"${aliasName}" <${email}>`,
          to: recipientEmail,
          replyTo: replyTo || email,
          subject: subject,
          html: emailHtml,
          attachments: Attachments,
          headers: {
            'X-Campaign-ID': campaignId,
            'X-User-ID': userId,
          }
        });

        console.log(`✅ Email sent via Hostinger: ${recipientEmail}`);
        return res.status(200).json({ 
          message: 'Email sent successfully via Hostinger SMTP', 
          messageId: info.messageId 
        });

      } catch (error) {
        console.error('Hostinger SMTP error:', error);
        if (error.code === 'EAUTH') {
          return res.status(401).json({ 
            error: 'Hostinger authentication failed - check your credentials'
          });
        }
        throw error;
      }
    }

  } catch (error) {
    console.error('FULL SEND ERROR:', error);
    return res.status(500).json({ 
      error: `Error sending email: ${error.message}` 
    });
  }
});


   

//getting particular students in selected group for send bulk
router.get("/groups/:groupId/students", async (req, res) => {
  const {
    groupId
  } = req.params;
  const students = await Student.find({
    group: groupId
  });
  res.json(students);
});
//create group
router.post('/groups', async (req, res) => {
  const {
    name,
    userId
  } = req.body;

  if (!userId) {
    return res.status(400).send({
      message: "User ID is required"
    });
  }

  try {
    // Check if the group name already exists for the user
    const existingGroup = await Group.findOne({
      name,
      user: userId
    });
    if (existingGroup) {
      return res.status(400).send({
        message: "Group name already exists for this user"
      });
    }
    // Create a new group
    const group = new Group({
      name,
      user: userId
    }); // Correct object structure
    await group.save();
    res.status(201).send(group);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error creating group"
    });
  }
});
//create Replyto
router.post('/replyTo', async (req, res) => {
  const { replyTo,userId } = req.body;

  if (!userId) {
    return res.status(400).send({
      message: "User ID is required"
    });
  }

  try {
    // Check if the replyto already exists for the user
    const existingReply = await Replyto.findOne({
      replyTo,
      user: userId
    });
    if (existingReply) {
      return res.status(400).send({
        message: "Reply to Mail already exists for this user"
      });
    }
    // Create a new reply to
    const replytonew = new Replyto({
      replyTo,
      user: userId
    }); 
    await replytonew.save();
    res.status(201).send(replytonew);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error creating reply to mail"
    });
  }
});

//getting all replyto
router.get('/replyTo/:userId', async (req, res) => {
  try {
    const replyTo = await Replyto.find({
      user: req.params.userId
    });
    res.json(replyTo);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching replyto mail'
    });
  }
});
//create aliasname
router.post('/aliasname', async (req, res) => {
  const { aliasname,userId } = req.body;

  if (!userId) {
    return res.status(400).send({
      message: "User ID is required"
    });
  }

  try {
    // Check if the alias name already exists for the user
    const existingName = await Aliasname.findOne({
      aliasname,
      user: userId
    });
    if (existingName) {
      return res.status(400).send({
        message: "Alias name already exists for this user"
      });
    }
    // Create a new aliasname
    const aliasnamenew = new Aliasname({
      aliasname,
      user: userId
    }); 
    await aliasnamenew.save();
    res.status(201).send(aliasnamenew);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error creating aliasname"
    });
  }
});

//getting all aliasname
router.get('/aliasname/:userId', async (req, res) => {
  try {
    const aliasname = await Aliasname.find({
      user: req.params.userId
    });
    res.json(aliasname);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching aliasname'
    });
  }
});

//add student to selected group through excel
router.post("/students/upload", async (req, res) => {
  try {
    // console.log("Received data:", req.body); // Debugging
    await Student.insertMany(req.body);
    res.status(201).send("Students uploaded successfully");
  } catch (error) {
    console.error("Error inserting students:", error);
    res.status(500).send("Error uploading students");
  }
});

//add manually student to selected group
router.post("/students/manual", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.status(201).send(student);
});

router.get('/students', async (req, res) => {
  try {
    const { user } = req.query; // expecting user ID in query

    // Populate the group and filter by group's user
    const students = await Student.find()
      .populate({
        path: 'group',
        match: { user: user }, // filter groups by user ID
      });

    // Filter out students whose group is null after population
    const filteredStudents = students.filter(student => student.group !== null);

    res.json(filteredStudents);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

//getting all groups
router.get('/groups/:userId', async (req, res) => {
  try {
    const groups = await Group.find({
      user: req.params.userId
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching groups'
    });
  }
});
//getting user payment-history
router.get('/payment-history/:userId', async (req, res) => {
  try {
    const payments = await PaymentHistory.find({
      userId: req.params.userId
    }).populate('userId', 'username'); // Populate only the username field

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching payments'
    });
  }
});


//grt latest payment-history
router.get('/payment-history-latest/:userId', async (req, res) => {
  try {
    const latestPayment = await PaymentHistory.findOne({ userId: req.params.userId })
      .sort({ createdAt: -1 }); // Sort descending, latest first

    if (!latestPayment) {
      return res.status(404).json({ message: 'No payment history found' });
    }

    res.json(latestPayment); // Return only the latest one
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest payment' });
  }
});

//getting admin user
router.get('/adminuserdata/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await Adminuser.findById(userId) 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//getting user
router.get('/userdata/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select('-smtppassword'); // Exclude sensitive fields like password and smtppassword

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT route to update a campaign by ID
router.put('/bdycamhistory/:campaignId', async (req, res) => {
  const { campaignId } = req.params;
  const { campaignname, previewContent, bgColor,groupname, groupId } = req.body;

  try {
    const updatedCampaign = await Camhistory.findByIdAndUpdate(
      campaignId,
      {
        campaignname,
        previewContent,
        groupname,
        bgColor,
        groupId,
      },
      { new: true } // Return the updated document
    );

    if (!updatedCampaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.status(200).json({ message: 'Campaign updated successfully', data: updatedCampaign });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// 2. DELETE route to delete a group and its associated students
router.delete('/groups/:id', async (req, res) => {
  try {
    const groupId = req.params.id;
    await Group.findByIdAndDelete(groupId); // Delete group
    await Student.deleteMany({
      group: groupId
    }); // Delete all students in that group
    res.status(200).json({
      message: 'Group and associated students deleted'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting group and students'
    });
  }
});


router.post("/students/check-duplicate", async (req, res) => {
  try {
    const { email, groupId } = req.body;

    if (!email || !groupId) {
      return res.status(400).json({ message: "Email and groupId are required." });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid groupId format." });
    }

    const existingStudent = await Student.findOne({
      Email: { $regex: new RegExp(`^${email}$`, "i") },
      group: new mongoose.Types.ObjectId(groupId),
    });

    res.json({ isDuplicate: !!existingStudent });
  } catch (err) {
    console.error("Duplicate check error:", err);
    res.status(500).json({ message: "Server error during duplicate check." });
  }
});
// 1. GET route to fetch all user payment history
// 1. GET route to fetch all user payment history with user details
router.get('/all-payment-history', async (req, res) => {
  try {
    const allPaymentHistory = await PaymentHistory.find().populate('userId', 'username email'); 
    res.json(allPaymentHistory);
  } catch (error) {
    console.error("Error fetching all user history:", error);
    res.status(500).json({ message: "Server error while fetching all user history." });
  }
});



// 4. DELETE route to delete selected students
router.delete('/students', async (req, res) => {
  try {
    const {
      studentIds
    } = req.body; // Array of student IDs to delete
    await Student.deleteMany({
      _id: {
        $in: studentIds
      }
    }); // Delete students
    res.status(200).json({
      message: 'Selected students deleted'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting students'
    });
  }
});

// 5. PUT route to edit a student's details
router.put("/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Automatically update all fields, including dynamic ones
      { new: true, runValidators: true } // Return updated student and validate fields
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: "Error updating student", error: err });
  }
});

// 5. PUT route to update a student's lastSentYear
router.put("/updateStudent/:id", async (req, res) => {
  try {
    // Ensure we only update the 'lastSentYear' field
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: { lastSentYear: req.body.lastSentYear } }, // Only update lastSentYear field
      { new: true, runValidators: true } // Return updated student and validate fields
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: "Error updating student", error: err });
  }
});
//edit group name
router.put('/groups/:id', (req, res) => {
  const groupId = req.params.id;
  const updatedName = req.body.name;

  // Assuming you are using MongoDB with Mongoose
  Group.findByIdAndUpdate(groupId, {
    name: updatedName
  }, {
    new: true
  })
    .then(updatedGroup => res.json(updatedGroup))
    .catch(err => res.status(400).send(err));
});

//create campaign
router.post('/campaign', async (req, res) => {
  const {
    camname,
    userId
  } = req.body;

  if (!userId) {
    return res.status(400).send({
      message: "User ID is required"
    });
  }

  try {
    // Check if a campaign with the same name already exists for the user
    const existingCampaign = await Campaign.findOne({
      camname,
      user: userId
    });
    if (existingCampaign) {
      return res.status(400).send({
        message: "Campaign with this name already exists for the user"
      });
    }
    // Create a new campaign
    const campaign = new Campaign({
      camname,
      user: userId
    });
    const savedCampaign = await campaign.save();
    const campaignData = {
      id: savedCampaign._id,
      camname: savedCampaign.camname,
    };

    res.json({
      campaign: campaignData
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error creating campaign"
    });
  }
});
router.get('/template/check', async (req, res) => {
  const { temname, userId } = req.query;

  if (!temname || !userId) {
    return res.status(400).json({ message: "Template name and user ID required" });
  }

  const template = await Template.findOne({ temname, user: userId });
  if (template) {
    return res.json(template);
  } else {
    return res.json(null);
  }
});
router.put('/template/:id', async (req, res) => {
  const { id } = req.params;
  const { previewContent, bgColor, camname } = req.body;

  try {
    const updated = await Template.findByIdAndUpdate(
      id,
      { previewContent, bgColor, camname, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating template" });
  }
});

router.get('/birthtemplates/check', async (req, res) => {
  const { temname, userId } = req.query;

  if (!temname || !userId) {
    return res.status(400).json({ message: "Template name and user ID required" });
  }

  const template = await BirthdayTemplate.findOne({ temname, user: userId });
  if (template) {
    return res.json(template);
  } else {
    return res.json(null);
  }
});
router.put('/birthtemplates/:id', async (req, res) => {
  const { id } = req.params;
  const { previewContent, bgColor, camname } = req.body;

  try {
    const updated = await BirthdayTemplate.findByIdAndUpdate(
      id,
      { previewContent, bgColor, camname, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating template" });
  }
});

//create Template
router.post('/create-template', async (req, res) => {
  const {
    temname,
    userId
  } = req.body;

  if (!userId) {
    return res.status(400).send({
      message: "User ID is required"
    });
  }

  try {
    // Check if a template with the same name already exists for the user
    const existingTemplate = await Template.findOne({
      temname,
      user: userId
    });
    if (existingTemplate) {
      return res.status(400).send({
        message: "Template with this name already exists for the user"
      });
    }
    // Create a new template
    const template = new Template({
      temname,
      user: userId
    });
    const savedTemplate = await template.save();
    const templateData = {
      id: savedTemplate._id,
      temname: savedTemplate.temname,
    };
    res.json({
      template: templateData
    });
    } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error saving template"
    });
  }
});


//Save template
router.post('/template', async (req, res) => {
  const {
    temname,
    camname,
    previewContent,
    bgColor,
    userId
  } = req.body;

  if (!userId) {
    return res.status(400).send({
      message: "User ID is required"
    });
  }

  try {
    // Check if a template with the same name already exists for the user
    const existingTemplate = await Template.findOne({
      temname,
      user: userId
    });
    if (existingTemplate) {
      return res.status(400).send({
        message: "Template with this name already exists for the user"
      });
    }
    // Create a new template
    const template = new Template({
      temname,
      camname,
      previewContent,
      bgColor,
      user: userId
    });
    await template.save();
    res.status(201).send(template);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error saving template"
    });
  }
});

//getting all template
router.get('/templates/:userId', async (req, res) => {
  try {
    const templates = await Template.find({
      user: req.params.userId
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching templates'
    });
  }
});
//Save birthday template
router.post('/birthtemplate', async (req, res) => {
  const {
    temname,
    camname,
    previewContent,
    bgColor,
    userId
  } = req.body;

  if (!userId) {
    return res.status(400).send({
      message: "User ID is required"
    });
  }

  try {
    // Check if a template with the same name already exists for the user
    const existingTemplate = await BirthdayTemplate.findOne({
      temname,
      user: userId
    });
    if (existingTemplate) {
      return res.status(400).send({
        message: "Template with this name already exists for the user"
      });
    }
    // Create a new template
    const template = new BirthdayTemplate({
      temname,
      camname,
      previewContent,
      bgColor,
      user: userId
    });
    await template.save();
    res.status(201).send(template);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error saving Birthday template"
    });
  }
});


//getting all birthday template
router.get('/birthtemplates/:userId', async (req, res) => {
  try {
    const templates = await BirthdayTemplate.find({
      user: req.params.userId
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching Birthday templates'
    });
  }
});

//getting all campaign history
router.get('/campaigns/:userId', async (req, res) => {
  try {
    const campaigns = await Camhistory.find({
      user: req.params.userId
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching campaigns'
    });
  }
});

router.get("/groups/:groupId/unsubscribe-student", async (req, res) => {
  const { groupId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ error: "Invalid groupId" });
  }

  try {
    const students = await Student.find({
      group: groupId,
      isUnsubscribed: true 
    });

    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Store campaign history
router.post("/camhistory", async (req, res) => {
  try {
    const {
      campaignname,
      groupname,
      totalcount,
      sendcount,
      failedcount,
      sentEmails,
      failedEmails,
      recipients,
      subject,
      previewtext,
      scheduledTime,
      attachments,
      status,
      progress, aliasName,replyTo,
      senddate,
      previewContent,
      exceldata,
      bgColor,
      user,
      groupId,
    } = req.body;

    const campaignHistory = new Camhistory({
      campaignname,
      recipients,
      groupname,
      totalcount,
      sendcount,
      failedcount,
      exceldata,
      subject,
      previewtext,
      sentEmails,
      attachments,
      failedEmails,
      scheduledTime, aliasName,replyTo,
      status,
      progress,
      senddate,
      previewContent,
      bgColor,
      user,
      groupId,
    });

    const savedCampaign = await campaignHistory.save();
    res.json({
      id: savedCampaign._id,
      message: "Campaign history saved successfully"
    });
  } catch (error) {
    console.error("Error creating campaign history:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
});
// Route to get campaign data by ID
router.get("/getcamhistory/:campaignId", async (req, res) => {
  try {
    const {
      campaignId
    } = req.params;

    // Fetch campaign from MongoDB
    const campaign = await Camhistory.findById(campaignId);

    // If no campaign found, return 404
    if (!campaign) {
      return res.status(404).json({
        message: "Campaignhistory not found"
      });
    }

    // Send the campaign data as JSON
    res.status(200).json(campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

// Update Campaign History by ID
router.put("/camhistory/:id", async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const {
      sendcount,
      failedcount,
      sentEmails,
      failedEmails,
      scheduledTime,
      status,
      progress
    } = req.body;

    // Find the campaign by ID and update it
    const updatedCampaign = await Camhistory.findByIdAndUpdate(
      id, {
      sendcount,
      failedcount,
      sentEmails,
      failedEmails,
      scheduledTime,
      status,
      progress
    }, {
      new: true
    }
    );

    if (!updatedCampaign) {
      return res.status(404).json({
        message: "Campaign history not found"
      });
    }

    res.json({
      message: "Campaign history updated successfully",
      updatedCampaign
    });
  } catch (error) {
    console.error("Error updating campaign history:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

router.get("/track-email-open", async (req, res) => {
  const { emailId, userId, campaignId } = req.query;

  if (!emailId || !userId || !campaignId) {
    console.error("❌ Missing parameters:", { emailId, userId, campaignId });
    return res.status(400).json({ error: "Missing required parameters" });
  }

  console.log(`✅ Email opened: userId=${userId}, campaignId=${campaignId}`);

  try {
    // Upsert: Update existing entry, or insert if not found
    await EmailOpen.findOneAndUpdate(
      { emailId, userId, campaignId }, // Query condition
      {
        $set: {
          sendTime: new Date(),
          ipAddress: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
          userAgent: req.headers["user-agent"],
        },
      },
      { upsert: true, new: true } // If not found, create a new entry
    );

    // Return a 1x1 transparent pixel
    const transparentPixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgAB/dfH1FAAAAAASUVORK5CYII=",
      "base64"
    );

    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": transparentPixel.length,
    });

    res.end(transparentPixel);
  } catch (err) {
    console.error("❌ Error in track-email-open:", err);
    res.status(500).send("Server Error");
  }
});

router.get("/get-email-open-count", async (req, res) => {
  const { userId, campaignId } = req.query;

  if (!userId || !campaignId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // Fetch emails with valid emailId
    const emailOpens = await EmailOpen.find({ userId, campaignId })
      .select("emailId timestamp sendTime")
      .lean(); // Convert Mongoose objects to plain JS objects

    // Check if emails exist
    if (!emailOpens || emailOpens.length === 0) {
      return res.json({ count: 0, emails: [] });
    }

    // Log data for debugging
    // console.log(`Email open details for user ${userId}, campaign ${campaignId}:`, emailOpens);

    res.json({ count: emailOpens.length, emails: emailOpens });
  } catch (error) {
    console.error("Error fetching email open details:", error);
    res.status(500).send("Server Error");
  }
});

// Track URL Click
router.get("/track-click", async (req, res) => {
  const { userId, campaignId, url, emailId } = req.query;

  if (!userId || !campaignId || !url || !emailId) {
    console.error("❌ Missing parameters:", { userId, campaignId, url, emailId });
    return res.status(400).json({ error: "Missing required parameters" });
  }

  console.log(`✅ Clicked URL: ${url} | userId=${userId} | campaignId=${campaignId} | emailId=${emailId}`);

  try {
    // Upsert to prevent duplicate click entries
    await ClickTracking.findOneAndUpdate(
      { userId, campaignId, emailId, clickedUrl: url }, // Find by unique combination
      { $set: { clickedAt: new Date() } }, // Update the timestamp
      { upsert: true, new: true } // If not found, create new entry
    );

    // Redirect the user to the target URL
    res.redirect(url);

  } catch (err) {
    console.error("❌ Error in track-click:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/get-click", async (req, res) => {
  const { userId, campaignId } = req.query;

  if (!userId || !campaignId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // 1️⃣ Count unique emails who clicked at least one link
    const uniqueEmails = await ClickTracking.aggregate([
      { $match: { userId, campaignId } },
      { $group: { _id: "$emailId" } } // Group by unique emailId
    ]);

    // 2️⃣ Get URLs with their corresponding emails + timestamps
    const urlClicks = await ClickTracking.aggregate([
      { $match: { userId, campaignId } },
      {
        $group: {
          _id: "$clickedUrl",
          clicks: {
            $push: { emailId: "$emailId", timestamp: "$timestamp" }
          }
        }
      },
      { $project: { clickedUrl: "$_id", clicks: 1, _id: 0 } } // Format output
    ]);

    res.json({ count: uniqueEmails.length, urls: urlClicks, emails: uniqueEmails });
  } catch (error) {
    console.error("Error fetching unique click count:", error);
    res.status(500).json({ error: "Server Error" });
  }
});
// 5. PUT route to update a student's lastSentYear
router.put("/updateStudent/:id", async (req, res) => {
  try {
    // Ensure we only update the 'lastSentYear' field
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: { lastSentYear: req.body.lastSentYear } }, // Only update lastSentYear field
      { new: true, runValidators: true } // Return updated student and validate fields
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: "Error updating student", error: err });
  }
});

router.delete('/camhistory/:id', async (req, res) => {
  const campaignId = req.params.id;
  console.log('Deleting campaign history:', campaignId);

  try {
    // Use the Camhistory model to delete the campaign history
    const deletedCampaign = await Camhistory.findByIdAndDelete(campaignId);
    if (!deletedCampaign) {
      return res.status(404).json({
        message: 'Campaign history not found'
      });
    }
    res.status(200).json({
      message: 'Campaign history deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting campaign history:', error);
    res.status(500).json({
      message: 'Server error while deleting campaign history'
    });
  }
});

// user-expiry-check

router.get("/validate", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user._id); // or req.user.id if `req.user` is just the payload
  if (!user) return res.status(404).send("User not found");

  res.send({ user });
});

// POST /api/stud/create-folder
router.post('/create-folder', async (req, res) => {
  const { userId, folderName } = req.body;
  if (!userId || !folderName) {
    return res.status(400).json({ error: 'Missing userId or folderName' });
  }

  try {
    const existingFolder = await Folder.findOne({ userId, name: folderName });
    if (existingFolder) {
      return res.status(400).json({ error: 'Folder already exists' });
    }

    const folder = new Folder({ user:userId, name: folderName });
    await folder.save();
    res.status(201).json({ message: 'Folder created', folder });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all folder based on user
router.get("/folders/:userId", async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.params.userId });
    res.status(200).json(folders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch folders" });
  }
});

router.post('/save-image', async (req, res) => {
  const { userId, imageUrl, folderName } = req.body;

  if (!userId || !imageUrl) {
    return res.status(400).json({ error: 'Missing userId or imageUrl' });
  }

  try {
    const image = new ImageUrl({ user: userId, imageUrl, folderName });
    await image.save();
    res.status(201).json({ message: 'Image saved', image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET /api/stud/images/:userId
router.get('/images/:userId', async (req, res) => {
  const { userId } = req.params;
  const { folderName } = req.query;

  try {
    const query = { user: userId };

    if (folderName) {
      query.folderName = folderName;
    } else {
      // Show only images in the "root" (i.e., no folder)
      query.$or = [
        { folderName: null },
        { folderName: "" },
        { folderName: { $exists: false } }
      ];
    }

    const images = await ImageUrl.find(query).sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: 'Server error' });
  }
});



// Initialize AWS SDK
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.delete('/images/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await ImageUrl.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: 'Image not found in database' });
    }

    res.status(200).json({ message: 'Image record deleted from DB' });
  } catch (err) {
    console.error('DB Delete Error:', err);
    res.status(500).json({ error: 'Error deleting image from DB' });
  }
});


router.delete('/folder/:folderName', async (req, res) => {
  try {
    const { folderName } = req.params;

    // Step 1: Find the folder and get userId
    const folder = await Folder.findOne({ name: folderName });

    if (!folder) {
      return res.status(404).json({ success: false, message: "Folder not found" });
    }

    const userId = folder.user?.toString();
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID not found in folder" });
    }

    // Step 1: List all S3 objects with prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: `uploads/${userId}/${folderName}/`,
    });

    const listResult = await s3.send(listCommand);
    const objectsToDelete = (listResult.Contents || []).map((item) => ({
      Key: item.Key,
    }));

    // Step 2: Delete from S3
    if (objectsToDelete.length > 0) {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: { Objects: objectsToDelete },
      });
      await s3.send(deleteCommand);
    }

    // Step 3: Delete from DB
    const imageResult = await ImageUrl.deleteMany({ folderName });
    const folderResult = await Folder.deleteOne({ name: folderName });

    res.status(200).json({
      success: true,
      message: `Folder '${folderName}' and all associated images deleted Successfully`,
      deletedImages: imageResult.deletedCount,
      deletedFolder: folderResult.deletedCount,
    });
  } catch (err) {
    console.error("Error deleting folder and images:", err);
    res.status(500).json({
      success: false,
      message: 'Error deleting folder and images.',
      error: err.message,
    });
  }
});

router.delete('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const prefix = `uploads/${userId}/`;

    // Step 1: List all S3 objects in the user's upload folder
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: prefix,
    });

    const listResult = await s3.send(listCommand);
    const objectsToDelete = (listResult.Contents || []).map((item) => ({
      Key: item.Key,
    }));

    // Step 2: Delete from S3
    if (objectsToDelete.length > 0) {
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: { Objects: objectsToDelete },
      });
      await s3.send(deleteCommand);
    }

    // Step 3: Delete from MongoDB
    await User.findByIdAndDelete(userId);
    await PaymentHistory.deleteMany({ userId });
    await Aliasname.deleteMany({ user: userId });
    await BirthdayTemplate.deleteMany({ user: userId });
    await Camhistory.deleteMany({ user: userId });
    await Campaign.deleteMany({ user: userId });
    await Folder.deleteMany({ user: userId });
    await Group.deleteMany({ user: userId });
    await ImageUrl.deleteMany({ user: userId });
    await Replyto.deleteMany({ user: userId });
    await Template.deleteMany({ user: userId });

   res.status(200).json({
  success: true,
  message: `User and all associated data, including images, have been successfully deleted.`,
  deletedFiles: objectsToDelete.length,
});
  } catch (err) {
    console.error("Error deleting user and data:", err);
    res.status(500).json({
      success: false,
      message: 'Error deleting user data.',
      error: err.message,
    });
  }
});



// send alert mail for user
router.post('/send-alert', async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the plan is NOT a trail plan
    if (user.plan && user.plan.toLowerCase() === 'trail') {
      return res.status(400).json({ message: "Trail users are not eligible for renewal alert." });
    }

    const htmlContent = `
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f7f7f7; color: #333;">
        <table role="presentation" style="width: 100%; background-color: #f9f9f9; padding: 30px;" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table role="presentation" style="max-width: 600px; width: 100%; background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background: #2f327d; color: white; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                    <div style="font-size: 50px; margin-bottom: 10px;">⏰</div>
                    <h1 style="margin: 0; font-size: 24px;">Renew Your <span style="color: #f48c06;">Emailcon</span> Account</h1>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding: 20px;">
                    <p style="margin: 10px 0; font-size: 16px;">Hi <strong>${user.username}</strong>,</p>
                    <p style="margin: 10px 0; font-size: 14px;">We noticed your subscription has expired.</p>
                    <p style="margin: 10px 0; font-size: 14px;">To continue using your account and access all features, please renew your plan now.</p>
                    <p style="margin: 10px 0; font-size: 14px; color: red; font-weight: bold;">
                      ⚠️ Warning: If you do not renew within 7 days, your account and all associated data will be permanently deleted.
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                      <a href="${apiConfig.baseURL}/userpayment/${user._id}" 
                        style="background-color:#f48c06; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                        Renew Now
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px; background: #f7f7f7; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                    <p style="font-size: 12px; color: #666;">
                      Need help? Contact us at
                      <a href="mailto:support@emailcon.in" style="color: #1a5eb8; text-decoration: none;">support@emailcon.in</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    `;

    await accounttransporter.sendMail({
      from: `"Emailcon Support" <user-noreply@account.emailcon.in>`,
      to: user.email,
      subject: "⚠️ Action Required: Renew Your Emailcon Account",
      replyTo: "support@emailcon.in",
      html: htmlContent,
    });

    res.status(200).json({ message: "Renewal alert email sent successfully" });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update folderName of an image
router.put("/update-folder", async (req, res) => {
  const { imageId, newFolder } = req.body;

  try {
    const updated = await ImageUrl.findByIdAndUpdate(
      imageId,
      { folderName: newFolder },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Image not found" });

    res.json({ success: true, image: updated });
  } catch (err) {
    console.error("Error updating folder name:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});


export default router;