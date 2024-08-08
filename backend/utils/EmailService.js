import nodemailer from "nodemailer";

class EmailService {
  constructor({ recipientEmail, emailSubject, emailMessage }) {
    this.recipientEmail = recipientEmail;
    this.emailSubject = emailSubject;
    this.emailMessage = emailMessage;

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SMTP_SERVICE,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail() {
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: this.recipientEmail,
      subject: this.emailSubject,
      text: this.emailMessage,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export default EmailService;
