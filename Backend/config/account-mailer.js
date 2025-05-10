import nodemailer from "nodemailer";

const accounttransporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true, 
          auth: {
            user:"account-noreply@account.emailcon.in",
            pass:"Account@con01"
          },
          tls: {
            rejectUnauthorized: false,
          },
});

export default accounttransporter;