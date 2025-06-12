import User from "../models/User.js";
import PaymentHistory from "../models/PaymentHistory.js";
import FormData from "../models/FormData.js";
import accounttransporter from "../config/account-mailer.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { uploadFileToS3 } from "../config/s3Uploder.js";
import { decryptPassword } from "../config/encryption.js";
import Adminuser from "../models/Adminuser.js";

export const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};
export const editAdminUser = async (req, res) => {
  const { id } = req.params;
  const { email, username, password, role } = req.body;

  try {
    const user = await Adminuser.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = email;
    user.username = username;
    user.password = password;
    user.role = role;

    await user.save();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteAdminUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Adminuser.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUserform = async (req, res) => {
  const userform = await FormData.find({});
  res.json(userform);
};
export const getUserById = async (req, res) => {  
  try {
    const userId = req.params.id;

    // Find user by ID
    const user = await User.findById(userId).select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// --- Helper Function 1: Send Payment Details Email ---


const generateInvoiceNumber = (paymentId) => {
  const timestamp = Date.now();
  return `INV-${paymentId || Math.floor(Math.random() * 10000)}-${timestamp}`;
};

export const sendPaymentDetailsEmail = async (user, paymentInfo) => {
  const {
    _id: paymentId,
    paymentStatus,
    amount,
    duration,
    expiryDate,
    razorpayPaymentId,
  } = paymentInfo;

  const invoiceNumber = generateInvoiceNumber(razorpayPaymentId);
  const doc = new PDFDocument({ margin: 50 });
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", async () => {
    const pdfBuffer = Buffer.concat(buffers);
    const fileName = `${invoiceNumber}.pdf`;
    const mimeType = "application/pdf";
    const userId = user._id;
    const folderName = 'invoices'; 


    // Upload to S3
    const s3Url = await uploadFileToS3(pdfBuffer, fileName, mimeType,userId,folderName);

    // Save invoice URL in DB
    await PaymentHistory.findByIdAndUpdate(paymentId, { invoiceUrl: s3Url });

    // Send Email
    const paymentHtml = `
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f7f7f7; color: #333;">
        <table role="presentation" style="width: 100%; background-color: #f9f9f9; padding: 30px;" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table role="presentation" style="max-width: 600px; width: 100%; background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background: #2f327d; color: white; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                    <div style="font-size: 50px; margin-bottom: 10px;">💳</div>
                    <h1 style="margin: 0; font-size: 24px;">Email<span style="color: #f48c06;">con</span> Payment Confirmation</h1>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding: 20px;">
                    <p style="margin: 10px 0; font-size: 16px;">Hello <strong>${user.username}</strong>,</p>
                    <p style="margin: 10px 0; font-size: 14px;">Your payment has been <strong>received successfully</strong>.</p>
                    <div style="margin-top: 20px;">
                      <p style="font-size: 16px; font-weight: bold;">Payment Details:</p>
                      <ul style="padding-left: 20px; font-size: 14px; line-height: 1.6;">
                        <li><strong>Status:</strong> ${paymentStatus}</li>
                        <li><strong>Amount:</strong> ₹${amount}</li>
                        <li><strong>Duration:</strong> ${duration}</li>
                        <li><strong>Expiry Date:</strong> ${new Date(expiryDate).toDateString()}</li>
                        <li><strong>Payment ID:</strong> ${razorpayPaymentId || 'N/A'}</li>
                        <li><strong>Invoice:</strong> <a href="${s3Url}">Download Invoice</a></li>
                      </ul>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px; background: #f7f7f7; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                    <p style="font-size: 12px; color: #666;">
                      If you have any questions, contact us at
                      <a href="mailto:support@emailcon.in" style="color: #1a5eb8; text-decoration: none;">support@emailcon.in</a>.
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
      subject: `💳 Payment Confirmation`,
      replyTo: "support@emailcon.in",
      html: paymentHtml,
      attachments: [
        {
          filename: fileName,
          path: s3Url,
        },
      ],
    });
  });

  // PDF Content with logo and table
  const logoPath = path.join(process.cwd(), "../Frontend/public/images/logo-4.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 100 });
  }
  doc.fontSize(20).text("Emailcon Invoice", 200, 50, { align: "right" });
  doc.moveDown(2);

  doc.fontSize(12).text(`Invoice Number: ${invoiceNumber}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.text(`Payment ID: ${razorpayPaymentId}`);
  doc.moveDown();

  doc.font("Helvetica-Bold").text("Billed To:");
  doc.font("Helvetica")
    .text(user.username)
    .text(user.email)
    .moveDown();

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  doc.font("Helvetica-Bold").text("Description", 50);
  doc.text("Amount", 450, doc.y - 15);
  doc.moveDown();

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  doc.font("Helvetica")
    .text(`Subscription for ${duration}`, 50)
    .text(`Rs.${amount}`, 450, doc.y - 15)
    .moveDown();

  doc.moveDown(2);
  doc.font("Helvetica-Bold").text("Total", 50);
  doc.text(`Rs.${amount}`, 450, doc.y - 15);

  doc.moveDown();
  doc.fontSize(10).text(`Invoice valid till: ${new Date(expiryDate).toDateString()}`);
  doc.moveDown();
  doc.fontSize(10).text("This is an auto-generated invoice. Thank you for using Emailcon.");

  doc.end();
};


// --- Helper Function 2: Send Activation + Login Email ---
const sendActivationEmail = async (user) => {
  const userpassword=decryptPassword(user.password);
  const activationHtml = `
          <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f7f7f7; color: #333;">
          <table role="presentation" style="width: 100%; background-color: #f9f9f9; padding: 30px;" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <table role="presentation" style="max-width: 600px; width: 100%; background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background: #2f327d; color: white; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                      <div style="font-size: 50px; margin-bottom: 10px;">✉️</div>
                      <h1 style="margin: 0; font-size: 24px;">Email<span style="color: #f48c06;">con</span> Account Notification</h1>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="padding: 20px;">
                      <p style="margin: 10px 0; font-size: 16px;">Hello <strong>${user.username}</strong>,</p>
                      <h3 style="color: #28a745;">
                        Your account has been activated.
                      </h3>
                      <p style="margin: 10px 0; font-size: 14px;">You can now access your account using the details below:</p>
                      <div style="text-align: left; margin-top: 20px;">
                        <p><strong>Login Credentials:</strong></p>
                        <p>Email: <span style="color: #333;">${user.email}</span></p>
                        <p>Password: <span style="color: #333;">${userpassword || "N/A"}</span></p>
                        <p><strong>Tip:Don't share your login credentials to others for security reasons.keep it safe and secure.</strong></p>

                        </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 20px; background: #f7f7f7; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                      <p style="font-size: 12px; color: #666;">
                        If you have any questions, contact us at
                        <a href="mailto:support@emailcon.in" style="color: #1a5eb8; text-decoration: none;">support@emailcon.in</a>.
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
    subject: `✅ Account Activated`,
    replyTo: "support@emailcon.in",
    html: activationHtml,
  });
};

export const updateStatus = async (req, res) => {
  const {
    id,
    status,
    duration, // example: "30 days"
    amount,
    paymentStatus,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
  } = req.body;

  try {
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const wasPreviouslyInactive = !existingUser.isActive;

    // Fetch last payment to calculate remaining time if not expired
    const lastPayment = await PaymentHistory.findOne({ userId: id, paymentStatus: "paid" })
      .sort({ createdAt: -1 });
      let newExpiryDate = new Date();
      let durationDays = parseInt(duration); // incoming new duration (e.g., "30" from "30 days")
      let combinedDuration = durationDays;
      
      if (lastPayment && lastPayment.expiryDate && new Date(lastPayment.expiryDate) > new Date()) {
        // Remaining time from last plan
        const remainingMs = new Date(lastPayment.expiryDate) - new Date();
        const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
      
        combinedDuration = remainingDays + durationDays;
        newExpiryDate.setDate(newExpiryDate.getDate() + combinedDuration);
      } else {
        newExpiryDate.setDate(newExpiryDate.getDate() + durationDays);
      }
    // 1. Update user status
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: status,role:"paid" },
      { new: true }
    );

    // 2. Log new payment
    await PaymentHistory.create({
      userId: id,
      paymentStatus,
      expiryDate: newExpiryDate,
      duration:combinedDuration,
      amount,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    });

    // 3. Email
    await sendPaymentDetailsEmail(user, {
      paymentStatus,
      amount,
      duration,
      expiryDate: newExpiryDate,
      razorpayPaymentId,
    });

    if (status && wasPreviouslyInactive) {
      setTimeout(() => {
        sendActivationEmail(user).catch((err) =>
          console.error("Error sending activation email:", err)
        );
      }, 30000);
    }

    res.send(
      `Payment email sent. ${
        status && wasPreviouslyInactive
          ? "Activation email will be sent after 30 seconds."
          : "No activation email needed for upgrade."
      }`
    );
  } catch (err) {
    console.error("Error in updateStatus:", err);
    res.status(500).send("Failed to update status or send email.");
  }
};


export const updateStatusmanually = async (req, res) => {
  const { id, status } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: status,role:"paid" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let expiryDate;
    if (status === true) {
      // Step 1: Set 1-day trial expiry
      expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);

      // Step 2: Log trial in PaymentHistory
      await PaymentHistory.create({
        userId: id,
        paymentStatus: "trial",
        expiryDate,
        duration: "1 Day Trial",
        amount: 0,
        razorpayPaymentId: "TRIAL-MANUAL",
        razorpayOrderId: "TRIAL-MANUAL",
        razorpaySignature: "TRIAL-MANUAL",
      });
    }

    const userpassword=decryptPassword(user.password);

    // Step 3: Compose Email Template
    const htmlContent = `
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f7f7f7; color: #333;">
        <table role="presentation" style="width: 100%; background-color: #f9f9f9; padding: 30px;" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table role="presentation" style="max-width: 600px; width: 100%; background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background: #2f327d; color: white; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                    <div style="font-size: 50px; margin-bottom: 10px;">✉️</div>
                    <h1 style="margin: 0; font-size: 24px;">Email<span style="color: #f48c06;">con</span> Account Notification</h1>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding: 20px;">
                    <p style="margin: 10px 0; font-size: 16px;">Hello <strong>${user.username}</strong>,</p>
                    <h3 style="color: ${status ? '#28a745' : '#dc3545'};">
                      Your account has been ${status ? 'activated' : 'deactivated'}.
                    </h3>
                    ${
                      status
                        ? `
                      <p style="margin: 10px 0; font-size: 14px;">You can now access your account using the details below:</p>
                      <div style="text-align: left; margin-top: 20px;">
                        <p><strong>Login Credentials:</strong></p>
                        <p>Email: <span style="color: #333;">${user.email}</span></p>
                        <p>Password: <span style="color: #333;">${userpassword || "N/A"}</span></p>
                        <p style="color: red; font-size: 14px; margin-top: 15px;"><strong>Note:</strong> This is a <strong>trial account</strong> and will <strong>expire on ${expiryDate.toDateString()}</strong>.</p>
                      </div>
                    `
                        : `<p style="margin: 10px 0; font-size: 14px;">Please contact admin for more details.</p>`
                    }
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px; background: #f7f7f7; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                    <p style="font-size: 12px; color: #666;">
                      If you have any questions, contact us at
                      <a href="mailto:support@emailcon.in" style="color: #1a5eb8; text-decoration: none;">support@emailcon.in</a>.
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
      subject: `Account ${status ? "Activated" : "Deactivated"}`,
      replyTo: "support@emailcon.in",
      html: htmlContent,
    });

    res.send(`Account ${status ? "activated" : "deactivated"} successfully.`);
  } catch (err) {
    console.error("Error updating account status or sending email:", err);
    res.status(500).send("Failed to update status or send email.");
  }
};

export const updateStatusemployee = async (req, res) => {
  const { id, status } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let expiryDate;
    if (status === true) {
      // Step 1: Set trial expiry
      expiryDate = new Date();

      // Step 2: Log trial in PaymentHistory
      await PaymentHistory.create({
        userId: id,
        paymentStatus: "Employee-Trail",
        expiryDate,
        duration: "Employee-Usage",
        amount: 0,
        razorpayPaymentId: "TRIAL-MANUAL",
        razorpayOrderId: "TRIAL-MANUAL",
        razorpaySignature: "TRIAL-MANUAL",
      });
    }

    const userpassword=decryptPassword(user.password);

    // Step 3: Compose Email Template
    const htmlContent = `
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f7f7f7; color: #333;">
        <table role="presentation" style="width: 100%; background-color: #f9f9f9; padding: 30px;" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table role="presentation" style="max-width: 600px; width: 100%; background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background: #2f327d; color: white; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                    <div style="font-size: 50px; margin-bottom: 10px;">✉️</div>
                    <h1 style="margin: 0; font-size: 24px;">Email<span style="color: #f48c06;">con</span> Account Notification</h1>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding: 20px;">
                    <p style="margin: 10px 0; font-size: 16px;">Hello <strong>${user.username}</strong>,</p>
                    <h3 style="color: ${status ? '#28a745' : '#dc3545'};">
                      Your account has been ${status ? 'activated' : 'deactivated'}.
                    </h3>
                    ${
                      status
                        ? `
                      <p style="margin: 10px 0; font-size: 14px;">You can now access your account using the details below:</p>
                      <div style="text-align: left; margin-top: 20px;">
                        <p><strong>Login Credentials:</strong></p>
                        <p>Email: <span style="color: #333;">${user.email}</span></p>
                        <p>Password: <span style="color: #333;">${userpassword || "N/A"}</span></p>
                      </div>
                    `
                        : `<p style="margin: 10px 0; font-size: 14px;">Please contact admin for more details.</p>`
                    }
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px; background: #f7f7f7; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                    <p style="font-size: 12px; color: #666;">
                      If you have any questions, contact us at
                      <a href="mailto:support@emailcon.in" style="color: #1a5eb8; text-decoration: none;">support@emailcon.in</a>.
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
      subject: `Account ${status ? "Activated" : "Deactivated"}`,
      replyTo: "support@emailcon.in",
      html: htmlContent,
    });

    res.send(`Account ${status ? "activated" : "deactivated"} successfully.`);
  } catch (err) {
    console.error("Error updating account status or sending email:", err);
    res.status(500).send("Failed to update status or send email.");
  }
};



export const Userform = async (req, res) => {
  try {
    const newForm = new FormData(req.body);
    await newForm.save();
    res.status(201).json({ message: 'Form submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit form' });
  }
};

export const sendCredentials = async (req, res) => {
  const {
    id
  } = req.body; // Expecting the user ID from the request body

  if (!id) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  try {
    // Fetch the user details from the database
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const userpassword=decryptPassword(user.password);
    // Define the email options
    const mailOptions = {
      from: `"Emailcon Support" <user-noreply@account.emailcon.in>`,
      to: user.email,
      subject: "Your Login Credentials",
      replyTo: "support@emailcon.in",
      html: `
       <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f7f7f7; color: #333;">
  <table role="presentation" style="width: 100%; background-color: #fcfcfc; padding: 30px;" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table role="presentation" style="max-width: 600px; width: 100%; background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="background: #2f327d; color: white; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px;">
              <div style="font-size: 50px; margin-bottom: 10px;">🔑</div>
              <h1 style="margin: 0; font-size: 24px;">Email<span style="color: #f48c06;">con</span> Login Credentials</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px;">
              <p style="margin: 10px 0; font-size: 16px;">Hello <strong>${user.username}</strong>,</p>
              <p style="margin: 10px 0; font-size: 16px;">Here are your login credentials:</p>
              <p style="margin: 10px 0; font-size: 16px;"><strong>Email:</strong> ${user.email}</p>
              <p style="margin: 10px 0; font-size: 16px;"><strong>Password:</strong> ${userpassword}</p>
              <p style="margin: 10px 0; font-size: 14px; text-align: center; font-weight: bold;">
                &#8220;Please keep this info safe. For best security practices, it's recommended to change your password and avoid sharing it with anyone.&#8221;
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px; background: #f7f7f7; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
              <p style="font-size: 12px; color: #666;">
                If you have any questions, contact us at
                <a href="mailto:support@emailcon.in" style="color: #1a5eb8; text-decoration: none;">
                  support@emailcon.in
                </a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
`,
    };

    // Send the email
    accounttransporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          message: "Failed to send credentials",
        });
      }
      res.status(200).json({
        message: "Credentials sent successfully",
      });
    });
  } catch (error) {
    console.error("Error fetching user or sending email:", error);
    res.status(500).json({
      message: "An error occurred",
    });
  }
};
 

//send admin credentials
export const sendAdminCredentials = async (req, res) => {
  const {
    id
  } = req.body; // Expecting the user ID from the request body

  if (!id) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  try {
    // Fetch the user details from the database
    const user = await Adminuser.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // Define the email options
    const mailOptions = {
      from: `"Emailcon Support" <user-noreply@account.emailcon.in>`,
      to: user.email,
      subject: "Your Admin Login Credentials",
      replyTo: "support@emailcon.in",
      html: `
       <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f7f7f7; color: #333;">
  <table role="presentation" style="width: 100%; background-color: #fcfcfc; padding: 30px;" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table role="presentation" style="max-width: 600px; width: 100%; background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="background: #2f327d; color: white; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px;">
              <div style="font-size: 50px; margin-bottom: 10px;">🔑</div>
              <h1 style="margin: 0; font-size: 24px;">Email<span style="color: #f48c06;">con</span> Admin Login Credentials</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px;">
              <p style="margin: 10px 0; font-size: 16px;">Hello <strong>${user.username}</strong>,</p>
              <p style="margin: 10px 0; font-size: 16px;">Here are your login credentials:</p>
              <p style="margin: 10px 0; font-size: 16px;"><strong>Email:</strong> ${user.email}</p>
              <p style="margin: 10px 0; font-size: 16px;"><strong>Password:</strong> ${user.password}</p>
              <p style="margin: 10px 0; font-size: 14px; text-align: center; font-weight: bold;">
                &#8220;Please keep this info safe. For best security practices, it's recommended to change your password and avoid sharing it with anyone.&#8221;
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px; background: #f7f7f7; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
              <p style="font-size: 12px; color: #666;">
                If you have any questions, contact us at
                <a href="mailto:support@emailcon.in" style="color: #1a5eb8; text-decoration: none;">
                  support@emailcon.in
                </a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
`,
    };

    // Send the email
    accounttransporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          message: "Failed to send credentials",
        });
      }
      res.status(200).json({
        message: "Credentials sent successfully",
      });
    });
  } catch (error) {
    console.error("Error fetching user or sending email:", error);
    res.status(500).json({
      message: "An error occurred",
    });
  }
};
 

// Create admin user

export const createAdminUser = async (req, res) => {
  const { email, username, password, role } = req.body;

  try {
    const existingUser = await Adminuser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin user already exists" });
    }
    const newAdminUser = new Adminuser({
      email,
      username,
      password,
      role,
      isActive: false,
    });
    await newAdminUser.save();
    res.status(201).json({ message: "Admin user created successfully" });
  }
  catch (error) {
    console.error("Error creating admin user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

//Admin user activate
export const updateAdminStatusmanually = async (req, res) => {
  const { id, status } = req.body;

  try {
    const user = await Adminuser.findByIdAndUpdate(
      id,
      { isActive: status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 3: Compose Email Template
    const htmlContent = `
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f7f7f7; color: #333;">
        <table role="presentation" style="width: 100%; background-color: #f9f9f9; padding: 30px;" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table role="presentation" style="max-width: 600px; width: 100%; background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background: #2f327d; color: white; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                    <div style="font-size: 50px; margin-bottom: 10px;">✉️</div>
                    <h1 style="margin: 0; font-size: 24px;">Email<span style="color: #f48c06;">con</span> Admin Account Notification</h1>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="padding: 20px;">
                    <p style="margin: 10px 0; font-size: 16px;">Hello <strong>${user.username}</strong>,</p>
                    <h3 style="color: ${status ? '#28a745' : '#dc3545'};">
                      Your account has been ${status ? 'activated' : 'deactivated'}.
                    </h3>
                    ${
                      status
                        ? `
                      <p style="margin: 10px 0; font-size: 14px;">You can now access your account using the details below:</p>
                      <div style="text-align: left; margin-top: 20px;">
                        <p><strong>Login Credentials:</strong></p>
                        <p>Email: <span style="color: #333;">${user.email}</span></p>
                        <p>Password: <span style="color: #333;">${user.password || "N/A"}</span></p>
                        <p style="margin: 10px 0; font-size: 14px; text-align: center; font-weight: bold;">
                &#8220;Please keep this info safe. For best security practices, it's recommended to change your password and avoid sharing it with anyone.&#8221;
              </p>
                        </div>
                    `
                        : `<p style="margin: 10px 0; font-size: 14px;">Please contact admin for more details.</p>`
                    }
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px; background: #f7f7f7; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                    <p style="font-size: 12px; color: #666;">
                      If you have any questions, contact us at
                      <a href="mailto:support@emailcon.in" style="color: #1a5eb8; text-decoration: none;">support@emailcon.in</a>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    `;

     accounttransporter.sendMail({
      from: `"Emailcon Support" <user-noreply@account.emailcon.in>`,
      to: user.email,
      subject: `Account ${status ? "Activated" : "Deactivated"}`,
      replyTo: "support@emailcon.in",
      html: htmlContent,
    });

    res.send(`Account ${status ? "activated" : "deactivated"} successfully.`);
  } catch (err) {
    console.error("Error updating account status or sending email:", err);
    res.status(500).send("Failed to update status or send email.");
  }
};






// Get all admin users
export const getAdminUsers = async (req, res) => {
  try {
    const adminUsers = await Adminuser.find();
    res.status(200).json(adminUsers);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateFormData = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const updated = await FormData.findByIdAndUpdate(
      req.params.id,
      { status, remarks },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};
