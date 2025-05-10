import nodemailer from "nodemailer";

const resettransporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true, 
          auth: {
            user:"reset-noreply@account.emailcon.in",
            pass:"Reset@con01"
          },
          tls: {
            rejectUnauthorized: false,
          },
});

export default resettransporter;