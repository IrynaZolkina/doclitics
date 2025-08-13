import nodemailer from "nodemailer";

export async function sendActivationMail(to, link) {
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

  transporter.sendMail({
    from: process.env.SMTP_USER,
    to: to,
    subject: "Activation" + process.env.API_URL,
    text: "",
    html: `
      <div>
        <h1>
          For activation <a href="${link}">${link}</a>
        </h1>
      </div>
    `,
  });
  return <div></div>;
}
