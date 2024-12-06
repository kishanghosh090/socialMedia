import nodemailer from "nodemailer";
const sendOTP = async (email, otp) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use a mail service like Gmail, Outlook, etc.
    auth: {
      user: `kishanranaghosh@gmail.com`, // Your email address
      pass: `wbxv dpfp vonc xshy`, // Your email password or app-specific password
    },
  });

  // Mail options
  const mailOptions = {
    from: "kishanranaghosh@gmail.com", // Sender address
    to: `${email}`, // List of recipients
    subject: "Hello from kishan service", // Subject line
    text: `Your OTP is ${otp}`, // Plain text body
    html: `<h1>Hello!</h1><p>This is a test email sent using <b>Your OTP is ${otp}</b>.</p>`, // HTML body
  };

  // Send email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export { sendOTP };
