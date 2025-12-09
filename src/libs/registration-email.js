import nodemailer from "nodemailer";

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
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

// Send registration approval request to admin
export const sendRegistrationApprovalEmail = async ({
  id,
  role,
  name,
  email,
  phone,
  experience,
  description,
  profileImage,
  portfolio,
  documents,
  approvalToken,
  rejectionToken,
}) => {
  const transporter = createTransporter();

  const roleNames = {
    builder: "Builder",
    "interior-designer": "Interior Designer",
    architect: "Architect",
    contractor: "Contractor",
    "real-estate-agent": "Real Estate Agent",
    "vastu-consultant": "Vastu Consultant",
  };

  const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
  const approveUrl = `${baseUrl}/api/registration/approve?token=${approvalToken}`;
  const rejectUrl = `${baseUrl}/api/registration/reject?token=${rejectionToken}`;

  const portfolioList =
    portfolio && portfolio.length > 0
      ? `<h3>Portfolio/Work Samples:</h3>
         <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin: 15px 0;">
           ${portfolio.map((url) => `<img src="${url}" alt="Portfolio" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px;" />`).join("")}
         </div>`
      : "";

  const documentsList =
    documents && documents.length > 0
      ? `<h3>Submitted Documents:</h3>
         <ul>
           ${documents.map((doc, idx) => `<li><a href="${doc}" target="_blank">Document ${idx + 1}</a></li>`).join("")}
         </ul>`
      : "";

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `New Registration Request: ${roleNames[role]} - ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">
          New Professional Registration Request
        </h2>
        
        <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Role Applied For:</h3>
          <p style="font-size: 18px; font-weight: bold; margin: 5px 0;">${roleNames[role]}</p>
        </div>

        <div style="margin: 25px 0;">
          <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Applicant Information</h3>
          
          ${
            profileImage
              ? `<div style="text-align: center; margin: 15px 0;">
                <img src="${profileImage}" alt="Profile" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid #2563eb;" />
              </div>`
              : ""
          }
          
          <table style="width: 100%; margin: 15px 0;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 150px;">Full Name:</td>
              <td style="padding: 8px;">${name}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td style="padding: 8px; font-weight: bold;">Email:</td>
              <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            ${
              phone
                ? `<tr>
                <td style="padding: 8px; font-weight: bold;">Phone:</td>
                <td style="padding: 8px;"><a href="tel:${phone}">${phone}</a></td>
              </tr>`
                : ""
            }
            ${
              experience
                ? `<tr style="background-color: #f9fafb;">
                <td style="padding: 8px; font-weight: bold;">Experience:</td>
                <td style="padding: 8px;">${experience}</td>
              </tr>`
                : ""
            }
          </table>

          ${
            description
              ? `<div style="margin: 20px 0;">
              <h4 style="color: #333; margin-bottom: 10px;">Description/Bio:</h4>
              <p style="background-color: #f9fafb; padding: 15px; border-radius: 5px; white-space: pre-wrap; line-height: 1.6;">${description}</p>
            </div>`
              : ""
          }
        </div>

        ${portfolioList}
        ${documentsList}

        <div style="margin: 40px 0; padding: 25px; background-color: #f9fafb; border-radius: 8px; text-align: center;">
          <h3 style="color: #333; margin-top: 0;">Action Required</h3>
          <p style="color: #666; margin-bottom: 25px;">Please review the application and take appropriate action:</p>
          
          <table style="width: 100%; max-width: 400px; margin: 0 auto;">
            <tr>
              <td style="padding: 10px;">
                <a href="${approveUrl}" 
                   style="display: inline-block; width: 100%; padding: 15px 30px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center;">
                  ✓ APPROVE APPLICATION
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px;">
                <a href="${rejectUrl}" 
                   style="display: inline-block; width: 100%; padding: 15px 30px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center;">
                  ✗ REJECT APPLICATION
                </a>
              </td>
            </tr>
          </table>

          <p style="color: #888; font-size: 12px; margin-top: 20px;">
            These links are unique and can only be used once. No login required.
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #777; font-size: 12px;">
          <p><strong>Registration ID:</strong> ${id}</p>
          <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
          <p>This email was sent from Apni Estate registration system.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Registration approval email error:", error);
    return { success: false, error: error.message };
  }
};

// Send approval confirmation to user
export const sendApprovalConfirmationEmail = async ({ email, name, role }) => {
  const transporter = createTransporter();

  const roleNames = {
    builder: "Builder",
    "interior-designer": "Interior Designer",
    architect: "Architect",
    contractor: "Contractor",
    "real-estate-agent": "Real Estate Agent",
    "vastu-consultant": "Vastu Consultant",
  };

  const loginUrl = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/login`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "🎉 Registration Approved - Welcome to Apni Estate!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
          <p style="color: #dbeafe; margin: 10px 0 0 0; font-size: 16px;">Your KYC has been verified</p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px 20px;">
          <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">Dear ${name},</p>
          
          <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 20px 0;">
            <p style="font-size: 15px; line-height: 1.8; color: #555; margin: 0;">
              We are pleased to inform you that your registration as a <strong style="color: #2563eb;">${roleNames[role]}</strong> has been <strong style="color: #16a34a;">APPROVED</strong>! 
            </p>
          </div>

          <div style="background-color: #ecfdf5; border-left: 4px solid #16a34a; padding: 20px; margin: 25px 0; border-radius: 4px;">
            <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 16px;">✓ Account Activated</h3>
            <p style="color: #166534; margin: 0; line-height: 1.6;">
              Your account is now active and you can login to access all features and start showcasing your services on our platform.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" 
               style="display: inline-block; padding: 16px 40px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
              Login to Your Account →
            </a>
          </div>

          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">What's Next?</h3>
            <ul style="color: #666; line-height: 2; margin: 0; padding-left: 20px;">
              <li>Complete your profile</li>
              <li>Add your services and pricing</li>
              <li>Upload more portfolio items</li>
              <li>Start receiving client inquiries</li>
            </ul>
          </div>

          <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 25px 0;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>
        </div>

        <div style="background-color: #1e293b; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #cbd5e1; font-size: 14px; margin: 5px 0;">Welcome to the Apni Estate family!</p>
          <p style="color: #94a3b8; font-size: 12px; margin: 5px 0;">Apni Estate Team</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Approval confirmation email error:", error);
    return { success: false, error: error.message };
  }
};

// Send rejection notification to user
export const sendRejectionNotificationEmail = async ({
  email,
  name,
  role,
  reason,
}) => {
  const transporter = createTransporter();

  const roleNames = {
    builder: "Builder",
    "interior-designer": "Interior Designer",
    architect: "Architect",
    contractor: "Contractor",
    "real-estate-agent": "Real Estate Agent",
    "vastu-consultant": "Vastu Consultant",
  };

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Registration Application Update - Apni Estate",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
          Registration Application Status
        </h2>
        
        <p>Dear ${name},</p>
        
        <p>Thank you for your interest in joining Apni Estate as a <strong>${roleNames[role]}</strong>.</p>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 25px 0; border-radius: 4px;">
          <p style="color: #991b1b; margin: 0; font-weight: 500;">
            After careful review, we are unable to approve your registration at this time.
          </p>
        </div>

        ${
          reason
            ? `<div style="margin: 25px 0;">
            <h3 style="color: #333; margin-bottom: 10px;">Reason:</h3>
            <p style="background-color: #f9fafb; padding: 15px; border-radius: 5px; color: #666; line-height: 1.6;">${reason}</p>
          </div>`
            : ""
        }

        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #0369a1; margin: 0 0 10px 0;">What can you do?</h3>
          <ul style="color: #075985; line-height: 1.8; margin: 10px 0; padding-left: 20px;">
            <li>Review the provided feedback</li>
            <li>Update your qualifications/documents</li>
            <li>Re-apply after addressing the concerns</li>
            <li>Contact us for more clarification</li>
          </ul>
        </div>

        <p style="color: #666; line-height: 1.6;">
          We appreciate your interest in Apni Estate and encourage you to reapply once you've addressed the feedback provided.
        </p>

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
    console.error("Rejection notification email error:", error);
    return { success: false, error: error.message };
  }
};
