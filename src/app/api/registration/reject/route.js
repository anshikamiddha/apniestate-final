import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { sendRejectionNotificationEmail } from "@/libs/registration-email";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const reason = searchParams.get("reason") || "Your application did not meet our current requirements.";

    if (!token) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invalid Token</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #dc2626; margin-bottom: 20px; }
            p { color: #666; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Invalid Token</h1>
            <p>The rejection link is invalid or missing.</p>
          </div>
        </body>
        </html>`,
        { 
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" } 
        }
      );
    }

    const registration = await prisma.userRegistration.findUnique({
      where: { rejectionToken: token },
    });

    if (!registration) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invalid or Expired Token</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #dc2626; margin-bottom: 20px; }
            p { color: #666; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ Invalid or Expired Token</h1>
            <p>This rejection link is invalid or has already been used.</p>
            <p style="margin-top: 20px; font-size: 14px; color: #999;">If you believe this is an error, please contact support.</p>
          </div>
        </body>
        </html>`,
        { 
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" } 
        }
      );
    }

    if (registration.status !== "pending") {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Already Processed</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #f59e0b; margin-bottom: 20px; }
            p { color: #666; line-height: 1.6; }
            .status { background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; color: #92400e; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>⚠️ Already Processed</h1>
            <p>This registration has already been processed.</p>
            <div class="status">
              <strong>Current Status:</strong> ${registration.status.toUpperCase()}
            </div>
            <p style="font-size: 14px; color: #999;">Reviewed at: ${registration.reviewedAt ? new Date(registration.reviewedAt).toLocaleString() : 'N/A'}</p>
          </div>
        </body>
        </html>`,
        { 
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" } 
        }
      );
    }

    // Update registration status
    await prisma.userRegistration.update({
      where: { id: registration.id },
      data: {
        status: "rejected",
        rejectionReason: reason,
        reviewedAt: new Date(),
      },
    });

    // Send rejection notification email to user
    await sendRejectionNotificationEmail({
      email: registration.email,
      name: registration.name,
      role: registration.role,
      reason: reason,
    });

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Registration Rejected</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); min-height: 100vh; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
          h1 { color: #dc2626; margin-bottom: 20px; font-size: 32px; }
          p { color: #666; line-height: 1.8; font-size: 16px; }
          .reject-icon { font-size: 64px; margin-bottom: 20px; }
          .details { background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: left; }
          .details strong { color: #991b1b; }
          .details p { margin: 10px 0; color: #991b1b; }
          .reason { background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: left; }
          .reason strong { color: #92400e; }
          .reason p { margin: 10px 0; color: #92400e; }
          .note { background-color: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; color: #3730a3; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="reject-icon">❌</div>
          <h1>Registration Rejected</h1>
          <p style="font-size: 18px; margin: 20px 0;">
            The registration for <strong>${registration.name}</strong> has been rejected.
          </p>
          <div class="details">
            <p><strong>Name:</strong> ${registration.name}</p>
            <p><strong>Email:</strong> ${registration.email}</p>
            <p><strong>Role:</strong> ${registration.role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
            <p><strong>Rejected at:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div class="reason">
            <p><strong>Rejection Reason:</strong></p>
            <p>${reason}</p>
          </div>
          <div class="note">
            📧 A rejection notification email has been sent to the user with the reason and guidance for reapplication.
          </div>
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            This window can be safely closed.
          </p>
        </div>
      </body>
      </html>`,
      { 
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" } 
      }
    );
  } catch (error) {
    console.error("Rejection error:", error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          h1 { color: #dc2626; margin-bottom: 20px; }
          p { color: #666; line-height: 1.6; }
          .error { background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; color: #991b1b; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>❌ Error</h1>
          <p>Failed to reject registration. Please try again or contact support.</p>
          <div class="error">
            ${error.message || 'An unexpected error occurred'}
          </div>
        </div>
      </body>
      </html>`,
      { 
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" } 
      }
    );
  }
}
