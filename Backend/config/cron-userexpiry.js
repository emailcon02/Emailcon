import cron from "node-cron";
import PaymentHistory from "../models/PaymentHistory.js";
import accounttransporter from "./account-mailer.js";
import apiConfig from "../api/apiconfigfrontend.js";

cron.schedule("*/10 * * * *", async () => {
  const now = new Date();
  const nowUTC = new Date(now.toISOString().slice(0, 19) + "Z");

  console.log("🔍 Running user payment reminder check at:", nowUTC.toISOString());

  try {
    const payments = await PaymentHistory.aggregate([
      {
        $match: {
          paymentStatus: { $in: ["paid", "trial"] },
          expiryDate: { $ne: null }
        }
      },
      {
        $sort: { expiryDate: -1 }
      },
      {
        $group: {
          _id: "$userId",
          latestPayment: { $first: "$$ROOT" }
        }
      }
    ]);

   for (const entry of payments) {
  const payment = entry.latestPayment;
  const expiryDate = new Date(payment.expiryDate);
  const populatedPayment = await PaymentHistory.findById(payment._id).populate("userId");

  const user = populatedPayment.userId;

  // ✅ Null check to avoid TypeError
  if (!user || !user.email) {
    continue;
  }

  const notifyDates = [
    new Date(expiryDate.getTime() - 10 * 24 * 60 * 60 * 1000),
    new Date(expiryDate.getTime() - 5 * 24 * 60 * 60 * 1000),
    expiryDate
  ];

  for (const notifyDate of notifyDates) {
    const timeDiff = Math.abs(notifyDate.getTime() - nowUTC.getTime());

    if (timeDiff <= 10 * 60 * 1000) {
      const isFinalNotice = notifyDate.getTime() === expiryDate.getTime();

      const subject = isFinalNotice
        ? "Your Emailcon access has expired"
        : "Reminder: Your Emailcon access is expiring soon";

      const message = isFinalNotice
        ? `Your account access has expired as of <strong>${now.toLocaleString()}</strong>.`
        : `Your Emailcon account will expire on <strong>${expiryDate.toLocaleDateString()}</strong>. Please renew to avoid interruption.`;

      const mailOptions = {
        from: `"Emailcon Support" <user-noreply@account.emailcon.in>`,
        to: user.email,
        replyTo: "support@emailcon.in",
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color:#f48c06;">${isFinalNotice ? "⏰ Access Expired" : "⚠️ Access Expiry Reminder"}</h2>
            <p>Hi <strong>${user.username}</strong>,</p>
            <p>${message}</p>
            <p style="margin-top: 20px;">
              <a href="${apiConfig.baseURL}/userpayment/${user._id}" style="padding: 10px 20px; background-color:#2f327d; color: white; text-decoration: none; border-radius: 5px;">Renew Now</a>
            </p>
            <p style="font-size: 12px; color: gray;">If you have questions, reply to this email or contact support.</p>
          </div>
        `
      };

      accounttransporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error(`❌ Failed to send email to ${user.email}`, error);
        } else {
          console.log(`📧 Sent ${isFinalNotice ? "expiry" : "reminder"} email to ${user.email}`);
        }
      });

      if (isFinalNotice && user.isActive) {
        user.isActive = false;
        await user.save();

        populatedPayment.paymentStatus = "expired";
        await populatedPayment.save();

        console.log(`🔒 Deactivated user ${user.email} and marked payment as expired.`);
      }

      break; // Avoid sending multiple emails
    }
  }
}

  } catch (err) {
    console.error("❌ Cron job error:", err);
  }
});
