"use server";

import { prisma } from "@/libs/prisma";
import { requireAuth } from "./auth-actions";
import { revalidatePath } from "next/cache";

// Get user's favorite properties
export async function getFavorites() {
  try {
    const session = await requireAuth();

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        property: {
          include: {
            agent: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: favorites,
    };
  } catch (error) {
    console.error("Get favorites error:", error);
    return {
      success: false,
      error: error.message === "Unauthorized" ? "Please login to view favorites" : "Failed to fetch favorites",
    };
  }
}

// Add property to favorites
export async function addToFavorites(propertyId) {
  try {
    const session = await requireAuth();

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return {
        success: false,
        error: "Property not found",
      };
    }

    // Check if already in favorites
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId,
        },
      },
    });

    if (existingFavorite) {
      return {
        success: false,
        error: "Property already in favorites",
      };
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        propertyId,
      },
    });

    revalidatePath("/favorites");
    revalidatePath(`/properties/${property.slug}`);

    return {
      success: true,
      data: favorite,
    };
  } catch (error) {
    console.error("Add to favorites error:", error);
    return {
      success: false,
      error: error.message === "Unauthorized" ? "Please login to add favorites" : "Failed to add to favorites",
    };
  }
}

// Remove property from favorites
export async function removeFromFavorites(propertyId) {
  try {
    const session = await requireAuth();

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId,
        },
      },
    });

    if (!favorite) {
      return {
        success: false,
        error: "Favorite not found",
      };
    }

    await prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });

    revalidatePath("/favorites");
    
    return {
      success: true,
    };
  } catch (error) {
    console.error("Remove from favorites error:", error);
    return {
      success: false,
      error: error.message === "Unauthorized" ? "Please login to remove favorites" : "Failed to remove from favorites",
    };
  }
}

// Check if property is in user's favorites
export async function isFavorite(propertyId) {
  try {
    const session = await requireAuth();

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId,
        },
      },
    });

    return {
      success: true,
      data: !!favorite,
    };
  } catch (error) {
    return {
      success: true,
      data: false,
    };
  }
}

// Toggle favorite status
export async function toggleFavorite(propertyId) {
  try {
    const session = await requireAuth();

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId,
        },
      },
    });

    if (favorite) {
      await prisma.favorite.delete({
        where: { id: favorite.id },
      });
      
      revalidatePath("/favorites");
      
      return {
        success: true,
        action: "removed",
      };
    } else {
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          propertyId,
        },
      });
      
      revalidatePath("/favorites");
      
      return {
        success: true,
        action: "added",
      };
    }
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return {
      success: false,
      error: error.message === "Unauthorized" ? "Please login to manage favorites" : "Failed to toggle favorite",
    };
  }
}
