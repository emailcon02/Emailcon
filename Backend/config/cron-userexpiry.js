import cron from "node-cron";
import PaymentHistory from "../models/PaymentHistory.js";
import accounttransporter from "./account-mailer.js";
import apiConfig from "../api/apiconfigbackend.js";

cron.schedule("*/10 * * * *", async () => {
  const now = new Date();
  const nowUTC = new Date(now.toISOString().slice(0, 19) + "Z");
  nowUTC.setSeconds(0, 0);

  const tenMinutesAgo = new Date(nowUTC);
  tenMinutesAgo.setMinutes(nowUTC.getMinutes() - 10);

  console.log("🔍 Checking for payment expiries between", tenMinutesAgo.toISOString(), "and", nowUTC.toISOString());

  try {
    const expiredPayments = await PaymentHistory.find({
      paymentStatus: { $in: ["paid", "trial"] },
      expiryDate: { $gte: tenMinutesAgo, $lt: nowUTC }
    }).populate("userId");

    if (expiredPayments.length === 0) {
      console.log("No expired accounts found at:", now.toLocaleString());
      return;
    }

    for (const payment of expiredPayments) {
      const user = payment.userId;

      // Deactivate user
      if (user.isActive) {
        user.isActive = false;
        await user.save();
      }

      // Update payment status
      payment.paymentStatus = "expired";
      await payment.save();

      // Send expiration email
      const mailOptions = {
        from: `"Emailcon Support" <account-noreply@account.emailcon.in>`,
        to: user.email,
        replyTo: "support@emailcon.in",
        subject: `Your Emailcon access has expired`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color:#f48c06;">⏰ Access Expired</h2>
            <p>Hi <strong>${user.username}</strong>,</p>
            <p>Your account access has expired as of <strong>${now.toLocaleString()}</strong>.</p>
            <p>To regain access, please log in and renew your subscription.</p>
            <p style="margin-top: 20px;">
              <a href="${apiConfig.baseURL}/userpayment/${user._id}" style="padding: 10px 20px; background-color:#2f327d; color: white; text-decoration: none; border-radius: 5px;">Renew Now</a>
            </p>
            <p style="font-size: 12px; color: gray;">If you have questions, reply to this email or contact support.</p>
          </div>
        `
      };

      accounttransporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error(`❌ Failed to send expiry email to ${user.email}`, error);
        } else {
          console.log(`📧 Sent expiry email to ${user.email}`);
        }
      });
    }

    console.log(`🔔 Deactivated ${expiredPayments.length} expired accounts at ${nowUTC.toISOString()}`);
  } catch (err) {
    console.error("❌ Cron job error:", err);
  }
});
