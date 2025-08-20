import nodemailer from "nodemailer";

export async function sendActivationMail(to, code) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: to,
    subject: "Activation" + process.env.API_URL,
    text: "",
    html: `
      <div>
      <h1>Activate Your Account</h1>
          <p>Click the link below to activate your account:</p>
    
       
         <p>${code}</p>
       
         <p>This link will expire in 24 hours.</p>
      </div>
    `,
  });
  return <div></div>;
}
