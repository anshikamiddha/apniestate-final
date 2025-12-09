"use server";

import { prisma } from "@/libs/prisma";
import { requireAuth } from "./auth-actions";
import { revalidatePath } from "next/cache";

// Get current user's properties
export async function getMyProperties() {
  try {
    const session = await requireAuth();

    const properties = await prisma.property.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        agent: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: properties,
    };
  } catch (error) {
    console.error("Get my properties error:", error);
    return {
      success: false,
      error: error.message === "Unauthorized" ? "Please login" : "Failed to fetch properties",
    };
  }
}

// Create a new property for the logged-in user
export async function createMyProperty(data) {
  try {
    const session = await requireAuth();

    const property = await prisma.property.create({
      data: {
        ...data,
        slug: generateSlug(data.title),
        userId: session.user.id,
      },
      include: {
        agent: true,
      },
    });

    revalidatePath("/properties");
    revalidatePath("/my-properties");
    
    return {
      success: true,
      data: property,
    };
  } catch (error) {
    console.error("Create property error:", error);
    return {
      success: false,
      error: "Failed to create property",
    };
  }
}

// Update user's property
export async function updateMyProperty(id, data) {
  try {
    const session = await requireAuth();

    // Check if property belongs to user
    const existing = await prisma.property.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return {
        success: false,
        error: "Property not found or unauthorized",
      };
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        ...data,
        ...(data.title && { slug: generateSlug(data.title) }),
      },
      include: {
        agent: true,
      },
    });

    revalidatePath("/properties");
    revalidatePath("/my-properties");
    revalidatePath(`/properties/${property.slug}`);
    
    return {
      success: true,
      data: property,
    };
  } catch (error) {
    console.error("Update property error:", error);
    return {
      success: false,
      error: "Failed to update property",
    };
  }
}

// Delete user's property
export async function deleteMyProperty(id) {
  try {
    const session = await requireAuth();

    // Check if property belongs to user
    const existing = await prisma.property.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return {
        success: false,
        error: "Property not found or unauthorized",
      };
    }

    await prisma.property.delete({
      where: { id },
    });

    revalidatePath("/properties");
    revalidatePath("/my-properties");
    
    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete property error:", error);
    return {
      success: false,
      error: "Failed to delete property",
    };
  }
}

// Helper function to generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
