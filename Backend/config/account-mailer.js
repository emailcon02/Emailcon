import nodemailer from "nodemailer";

const accounttransporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true, 
          auth: {
            user:"user-noreply@account.emailcon.in",
            pass:"Email@marketinguser#*$04"
          },
          tls: {
            rejectUnauthorized: false,
          },       
});

export default accounttransporter;