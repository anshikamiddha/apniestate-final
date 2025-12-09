"use server";

import nodemailer from "nodemailer";

// Send contact agent email
export const contactAgent = async (formData) => {
  try {
    const agentName = formData.get("agentName");
    const agentEmail = formData.get("agentEmail");
    const agentCategory = formData.get("agentCategory");
    const userName = formData.get("userName");
    const userEmail = formData.get("userEmail");
    const userPhone = formData.get("userPhone");
    const message = formData.get("message") || "";

    // Validation
    if (!userName || !userEmail || !userPhone) {
      return {
        success: false,
        error: "Please fill in all required fields",
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return {
        success: false,
        error: "Please enter a valid email address",
      };
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const categoryNames = {
      builder: "Builder",
      "interior-designer": "Interior Designer",
      architect: "Architect",
      contractor: "Contractor",
      "real-estate-agent": "Real Estate Agent",
      "vastu-consultant": "Vastu Consultant",
    };

    // Email to admin/company
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Agent Contact Request: ${agentName} (${categoryNames[agentCategory] || agentCategory})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">
            New Agent Contact Request
          </h2>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Agent Being Contacted:</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 5px; font-weight: bold;">Name:</td>
                <td style="padding: 5px;">${agentName}</td>
              </tr>
              <tr>
                <td style="padding: 5px; font-weight: bold;">Email:</td>
                <td style="padding: 5px;">${agentEmail}</td>
              </tr>
              <tr>
                <td style="padding: 5px; font-weight: bold;">Category:</td>
                <td style="padding: 5px;">${categoryNames[agentCategory] || agentCategory}</td>
              </tr>
            </table>
          </div>

          <div style="margin: 25px 0;">
            <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Client Information</h3>
            <table style="width: 100%; margin: 15px 0;">
              <tr>
                <td style="padding: 8px; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 8px;">${userName}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 8px; font-weight: bold;">Email:</td>
                <td style="padding: 8px;">${userEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Phone:</td>
                <td style="padding: 8px;">${userPhone}</td>
              </tr>
              ${message ? `
              <tr style="background-color: #f9fafb;">
                <td style="padding: 8px; font-weight: bold; vertical-align: top;">Message:</td>
                <td style="padding: 8px;">${message}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>Action Required:</strong> Please connect this client with the agent or forward this inquiry to ${agentEmail}.
            </p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #777; font-size: 12px;">
            <p><strong>Received at:</strong> ${new Date().toLocaleString()}</p>
            <p>This email was sent from Apni Estate contact agent system.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Your request has been sent successfully! We'll connect you with the agent soon.",
    };
  } catch (error) {
    console.error("Contact agent error:", error);
    return {
      success: false,
      error: "Failed to send contact request. Please try again later.",
    };
  }
};
