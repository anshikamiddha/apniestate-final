"use server";

import { prisma } from "@/libs/prisma";
import {
  sendServiceRequestEmail,
  sendConfirmationEmail,
} from "@/libs/email";
import { auth } from "@/auth";

export const submitServiceRequest = async (formData) => {
  try {
    // Validate required fields
    const serviceType = formData.get("serviceType");
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const message = formData.get("message");

    if (!serviceType || !name || !email || !phone || !message) {
      return {
        success: false,
        error: "Please fill all required fields",
      };
    }

    // Get optional fields
    const budget = formData.get("budget") || null;
    const location = formData.get("location") || null;
    const timeline = formData.get("timeline") || null;
    
    // Get documents array (from Cloudinary upload)
    const documentsJson = formData.get("documents");
    const documents = documentsJson ? JSON.parse(documentsJson) : [];

    // Get current user if logged in
    const session = await auth();
    const userId = session?.user?.id || null;

    // Create service request in database
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        serviceType,
        name,
        email,
        phone,
        message,
        budget,
        location,
        timeline,
        documents,
        userId,
        status: "pending",
      },
    });

    // Send email notification to admin
    const emailResult = await sendServiceRequestEmail({
      serviceType,
      name,
      email,
      phone,
      message,
      budget,
      location,
      timeline,
      documents,
    });

    if (!emailResult.success) {
      console.error("Failed to send admin email:", emailResult.error);
    }

    // Send confirmation email to user
    const confirmationResult = await sendConfirmationEmail({
      email,
      name,
      serviceType,
    });

    if (!confirmationResult.success) {
      console.error("Failed to send confirmation email:", confirmationResult.error);
    }

    return {
      success: true,
      message: "Service request submitted successfully",
      requestId: serviceRequest.id,
    };
  } catch (error) {
    console.error("Service request error:", error);
    return {
      success: false,
      error: "Failed to submit service request. Please try again.",
    };
  }
};

export const getUserServiceRequests = async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const requests = await prisma.serviceRequest.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      requests,
    };
  } catch (error) {
    console.error("Fetch service requests error:", error);
    return {
      success: false,
      error: "Failed to fetch service requests",
    };
  }
};
