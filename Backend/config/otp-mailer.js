import nodemailer from "nodemailer";

const otptransporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true, 
          auth: {
            user:"code-noreply@account.emailcon.in",
            pass:"Code@con01"
          },
          tls: {
            rejectUnauthorized: false,
          },
});

export default otptransporter;