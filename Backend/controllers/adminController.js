import User from "../models/User.js";
import FormData from "../models/FormData.js";
import accounttransporter from "../config/account-mailer.js";
export const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
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

export const updateStatus = async (req, res) => {
  const { id, status, paymentStatus, expiryDate, duration, amount } = req.body;
  try {
    // Find the user by ID and update their status
    const user = await User.findByIdAndUpdate(
      id,
      {
        isActive: status,
        paymentStatus: paymentStatus,
        expiryDate: expiryDate,
        duration: duration,
        amount: amount,
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const htmlContent = `
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Notification</title>
      </head>
      <body style="margin:0; padding:20px; font-family:Arial, sans-serif; background-color:#f7f7f7; color:#333;">
        <table role="presentation" style="width:100%; background-color:#f7f7f7;" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <table role="presentation" style="max-width:600px; width:100%; background:#fff; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.1);" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="background:#1a5eb8; color:white; padding:20px;">
                    <div style="font-size:50px;margin-bottom:10px;border:none;display:inline-block;">✉️</div>
                    <h1 style="margin:0; font-size:24px;">Account Notification</h1>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:20px;">
                    <p style="margin:10px 0; font-size:16px;">Hello <strong>${user.username}</strong>,</p>
                    <h3 style="color:${status ? "#28a745" : "#dc3545"};">
                      Your account has been ${status ? "activated" : "deactivated"}.
                    </h3>
                    <p style="margin:10px 0; font-size:14px;">
                      You can ${status ? "now access your services" : "contact admin for more details"}.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:20px; background:#f7f7f7;">
                    <p style="font-size:12px; color:#666;">
                      If you have any questions, contact us at
                      <a href="mailto:support@emailcon.in" style="color:#1a5eb8; text-decoration:none;">support@emailcon.in</a>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    await accounttransporter.sendMail({
      from: `"Emailcon Support" <account-noreply@account.emailcon.in>`,
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

    // Define the email options
    const mailOptions = {
      from: `"Emailcon Support" <account-noreply@account.emailcon.in>`,
      to: user.email,
      subject: "Your Login Credentials",
      replyTo: "support@emailcon.in",
      html: `
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Credentials</title>
        </head>
        <body style="margin:0; padding:20px; font-family:Arial, sans-serif; background-color:#f7f7f7; color:#333;">
            <table role="presentation" style="width:100%; background-color:#f7f7f7;" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center">
                        <table role="presentation" style="max-width:600px; width:100%; background:#fff; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.1);" cellpadding="0" cellspacing="0">
                            <tr>
                                <td align="center" style="background:#1a5eb8; color:white; padding:20px;">
                                    <div style="font-size:50px;margin-bottom:10px;border:none;display:inline-block;">🔑</div>
                                    <h1 style="margin:0; font-size:24px;">Your Login Credentials</h1>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding:20px;">
                                    <p style="margin:10px 0; font-size:16px;">Hello <strong>${user.username}</strong>,</p>
                                    <p style="margin:10px 0; font-size:16px;">Here are your login credentials:</p>
                                    <p style="margin:10px 0; font-size:16px;"><strong>Email:</strong> ${user.email}</p>
                                    <p style="margin:10px 0; font-size:16px;"><strong>Password:</strong> ${user.password}</p>
                                    <p style="margin:10px 0; font-size:14px;">Please keep this information secure.</p>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="padding:20px; background:#f7f7f7;">
                                    <p style="font-size:12px; color:#666;">
                                        If you have any questions, contact us at
                                        <a href="mailto:support@emailcon.in" style="color:#1a5eb8; text-decoration:none;">support@emailcon.in</a>.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>`,
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