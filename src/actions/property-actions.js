"use server";

import { prisma } from "@/libs/prisma";
import { revalidatePath } from "next/cache";

// Get all properties with optional filters
export async function getProperties({
  page = 1,
  limit = 10,
  type,
  category,
  city,
  status = "available",
  minPrice,
  maxPrice,
  search,
} = {}) {
  try {
    const skip = (page - 1) * limit;
    
    const where = {
      status,
      ...(type && { type }),
      ...(category && { category }),
      ...(city && { city: { contains: city, mode: "insensitive" } }),
      ...(minPrice && { price: { gte: parseInt(minPrice) } }),
      ...(maxPrice && { price: { lte: parseInt(maxPrice) } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          agent: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.property.count({ where }),
    ]);

    return {
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Get properties error:", error);
    return {
      success: false,
      error: "Failed to fetch properties",
    };
  }
}

// Get a single property by slug
export async function getPropertyBySlug(slug) {
  try {
    const property = await prisma.property.findUnique({
      where: { slug },
      include: {
        agent: true,
      },
    });

    if (!property) {
      return {
        success: false,
        error: "Property not found",
      };
    }

    return {
      success: true,
      data: property,
    };
  } catch (error) {
    console.error("Get property error:", error);
    return {
      success: false,
      error: "Failed to fetch property",
    };
  }
}

// Get a single property by ID
export async function getPropertyById(id) {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        agent: true,
      },
    });

    if (!property) {
      return {
        success: false,
        error: "Property not found",
      };
    }

    return {
      success: true,
      data: property,
    };
  } catch (error) {
    console.error("Get property error:", error);
    return {
      success: false,
      error: "Failed to fetch property",
    };
  }
}

// Create a new property (admin only)
export async function createProperty(data) {
  try {
    const property = await prisma.property.create({
      data: {
        ...data,
        slug: generateSlug(data.title),
      },
      include: {
        agent: true,
      },
    });

    revalidatePath("/properties");
    
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

// Update a property (admin only)
export async function updateProperty(id, data) {
  try {
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

// Delete a property (admin only)
export async function deleteProperty(id) {
  try {
    await prisma.property.delete({
      where: { id },
    });

    revalidatePath("/properties");
    
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

// Get featured properties
export async function getFeaturedProperties(limit = 6) {
  try {
    const properties = await prisma.property.findMany({
      where: { status: "available" },
      include: {
        agent: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: properties,
    };
  } catch (error) {
    console.error("Get featured properties error:", error);
    return {
      success: false,
      error: "Failed to fetch featured properties",
    };
  }
}
