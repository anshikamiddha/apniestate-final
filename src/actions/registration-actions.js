"use server";

import { prisma } from "@/libs/prisma";
import { sendRegistrationApprovalEmail } from "@/libs/registration-email";

export const submitRegistration = async (formData) => {
  try {
    const role = formData.get("role");
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const phone = formData.get("phone") || null;
    const experience = formData.get("experience") || null;
    const description = formData.get("description") || null;
    const profileImage = formData.get("profileImage") || null;
    
    // Parse JSON arrays
    const portfolio = JSON.parse(formData.get("portfolio") || "[]");
    const documents = JSON.parse(formData.get("documents") || "[]");

    // Validation
    if (!role || !name || !email || !password) {
      return {
        success: false,
        error: "Please fill in all required fields",
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Please enter a valid email address",
      };
    }

    // Password validation
    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long",
      };
    }

    // Check if email already exists in User table
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "This email is already registered",
      };
    }

    // Check if registration already submitted
    const existingRegistration = await prisma.userRegistration.findUnique({
      where: { email },
    });

    if (existingRegistration) {
      if (existingRegistration.status === "pending") {
        return {
          success: false,
          error: "Registration already submitted. Please wait for admin approval.",
        };
      } else if (existingRegistration.status === "approved") {
        return {
          success: false,
          error: "This email is already registered and approved. Please login.",
        };
      } else if (existingRegistration.status === "rejected") {
        return {
          success: false,
          error: "Previous registration was rejected. Please contact support for more information.",
        };
      }
    }

    // Store plain password - Better Auth will hash it on approval
    // Create registration
    const registration = await prisma.userRegistration.create({
      data: {
        role,
        name,
        email,
        password: password, // Store plain password for Better Auth to hash later
        phone,
        experience,
        description,
        profileImage,
        portfolio,
        documents,
        status: "pending",
      },
    });

    // Send approval email to admin
    const emailResult = await sendRegistrationApprovalEmail({
      id: registration.id,
      role: registration.role,
      name: registration.name,
      email: registration.email,
      phone: registration.phone,
      experience: registration.experience,
      description: registration.description,
      profileImage: registration.profileImage,
      portfolio: registration.portfolio,
      documents: registration.documents,
      approvalToken: registration.approvalToken,
      rejectionToken: registration.rejectionToken,
    });

    // Log email result but don't fail registration if email fails
    if (!emailResult.success) {
      console.error("Failed to send approval email:", emailResult.error);
    }

    return {
      success: true,
      message: "Registration submitted successfully! You will receive an email once your application is reviewed and approved.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "Failed to submit registration. Please try again later.",
    };
  }
};

// Get registration status by email (for checking application status)
export const getRegistrationStatus = async (email) => {
  try {
    const registration = await prisma.userRegistration.findUnique({
      where: { email },
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        status: true,
        rejectionReason: true,
        reviewedAt: true,
        createdAt: true,
      },
    });

    if (!registration) {
      return {
        success: false,
        error: "No registration found with this email",
      };
    }

    return {
      success: true,
      registration,
    };
  } catch (error) {
    console.error("Get registration status error:", error);
    return {
      success: false,
      error: "Failed to fetch registration status",
    };
  }
};
