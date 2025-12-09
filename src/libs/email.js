import nodemailer from "nodemailer";

// Create email transporter
export const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "465"),
    secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Accept self-signed certificates
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

// Send service request email
export const sendServiceRequestEmail = async ({
  serviceType,
  name,
  email,
  phone,
  message,
  budget,
  location,
  timeline,
  documents,
}) => {
  const transporter = createTransporter();

  const serviceNames = {
    construction: "Construction Services",
    "interior-design": "Interior Design",
    legal: "Legal Services",
    vastu: "Vastu Consultation",
    consulting: "Construction Consulting",
    "home-loan": "Home Loans",
    materials: "Construction Materials",
  };

  const documentsList =
    documents && documents.length > 0
      ? `<h3>Attached Documents:</h3>
         <ul>
           ${documents.map((doc) => `<li><a href="${doc}">${doc}</a></li>`).join("")}
         </ul>`
      : "";

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `New Service Request: ${serviceNames[serviceType]}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          New Service Request
        </h2>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #4CAF50; margin-top: 0;">Service Type:</h3>
          <p style="font-size: 16px; font-weight: bold;">${serviceNames[serviceType]}</p>
        </div>

        <div style="margin: 20px 0;">
          <h3 style="color: #333;">Contact Information:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
        </div>

        ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ""}
        ${location ? `<p><strong>Location:</strong> ${location}</p>` : ""}
        ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ""}

        <div style="margin: 20px 0;">
          <h3 style="color: #333;">Message:</h3>
          <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
        </div>

        ${documentsList}

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #777; font-size: 12px;">
          <p>This email was sent from Apni Estate service request form.</p>
          <p>Submitted at: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
};

// Send confirmation email to user
export const sendConfirmationEmail = async ({ email, name, serviceType }) => {
  const transporter = createTransporter();

  const serviceNames = {
    construction: "Construction Services",
    "interior-design": "Interior Design",
    legal: "Legal Services",
    vastu: "Vastu Consultation",
    consulting: "Construction Consulting",
    "home-loan": "Home Loans",
    materials: "Construction Materials",
  };

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Service Request Received - Apni Estate",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          Thank You for Your Request!
        </h2>
        
        <p>Dear ${name},</p>
        
        <p>We have received your request for <strong>${serviceNames[serviceType]}</strong>.</p>
        
        <div style="background-color: #f0f8ff; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
          <p style="margin: 0;">Our team will review your request and get back to you within 24-48 hours.</p>
        </div>

        <p>If you have any urgent questions, please feel free to contact us directly.</p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #777; font-size: 14px; margin: 5px 0;">Best regards,</p>
          <p style="color: #333; font-weight: bold; margin: 5px 0;">Apni Estate Team</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Confirmation email error:", error);
    return { success: false, error: error.message };
  }
};
