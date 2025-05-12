import cron from "node-cron";
import User from "../models/User.js";
import accounttransporter from "./account-mailer.js";

cron.schedule("*/30 * * * *", async () => {
  const now = new Date();

  try {
    const nowUTC = new Date();
    nowUTC.setSeconds(0, 0);
    const nextMinute = new Date(nowUTC);
    nextMinute.setMinutes(nowUTC.getMinutes() + 1);
    console.log("Checking for user expiry at:", new Date().toLocaleString());
    const expiredUsers = await User.find({
      isActive: true,
      expiryDate: { $gte: nowUTC.toISOString(), $lt: nextMinute.toISOString() },
    });
    if (expiredUsers.length === 0) {
      console.log("No expired accounts found at:", new Date().toLocaleString());
      return;
    }

    for (const user of expiredUsers) {
      // Deactivate user
      user.isActive = false;
      user.paymentStatus = "expired";
      await user.save();

      // Send expiration email
      const mailOptions = {
        from: `"Emailcon Support" <account-noreply@account.emailcon.in>`,
        to: user.email,
        replyTo: "support@emailcon.in",
        subject: `Your Emailcon access has expired`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #dc3545;">⏰ Access Expired</h2>
            <p>Hi <strong>${user.username}</strong>,</p>
            <p>Your account access has expired as of <strong>${now.toLocaleString()}</strong>.</p>
            <p>To regain access, please log in and renew your subscription.</p>
            <p style="margin-top: 20px;">
              <a href="https://localhost:3000/userpayment/${user._id}" style="padding: 10px 20px; background-color: #1a5eb8; color: white; text-decoration: none; border-radius: 5px;">Renew Now</a>
            </p>
            <p style="font-size: 12px; color: gray;">If you have questions, reply to this email or contact support.</p>
          </div>
        `,
      };

      accounttransporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error(`❌ Failed to send expiry email to ${user.email}`, error);
        } else {
          console.log(`📧 Sent expiry email to ${user.email}`);
        }
      });
    }

    if (expiredUsers.length > 0) {
      console.log(`🔔 Deactivated ${expiredUsers.length} expired accounts at ${now.toISOString()}`);
    }
  } catch (err) {
    console.error("❌ Cron job error:", err);
  }
});
