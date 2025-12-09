"use server";

import { prisma } from "@/libs/prisma";
import { revalidatePath } from "next/cache";

// Get all agents with optional pagination, search, and category filter
export async function getAgents({ page = 1, limit = 10, search, category } = {}) {
  try {
    const skip = (page - 1) * limit;
    
    const where = {};
    
    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
      ];
    }
    
    // Add category filter
    if (category && category !== "all") {
      where.category = category;
    }

    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where,
        include: {
          properties: {
            where: { status: "available" },
            take: 3,
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.agent.count({ where }),
    ]);

    return {
      success: true,
      data: agents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Get agents error:", error);
    return {
      success: false,
      error: "Failed to fetch agents",
    };
  }
}

// Get a single agent by ID
export async function getAgentById(id) {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        properties: {
          where: { status: "available" },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!agent) {
      return {
        success: false,
        error: "Agent not found",
      };
    }

    return {
      success: true,
      data: agent,
    };
  } catch (error) {
    console.error("Get agent error:", error);
    return {
      success: false,
      error: "Failed to fetch agent",
    };
  }
}

// Create a new agent (admin only)
export async function createAgent(data) {
  try {
    const agent = await prisma.agent.create({
      data,
    });

    revalidatePath("/agents");
    
    return {
      success: true,
      data: agent,
    };
  } catch (error) {
    console.error("Create agent error:", error);
    return {
      success: false,
      error: "Failed to create agent",
    };
  }
}

// Update an agent (admin only)
export async function updateAgent(id, data) {
  try {
    const agent = await prisma.agent.update({
      where: { id },
      data,
    });

    revalidatePath("/agents");
    revalidatePath(`/agents/${id}`);
    
    return {
      success: true,
      data: agent,
    };
  } catch (error) {
    console.error("Update agent error:", error);
    return {
      success: false,
      error: "Failed to update agent",
    };
  }
}

// Delete an agent (admin only)
export async function deleteAgent(id) {
  try {
    await prisma.agent.delete({
      where: { id },
    });

    revalidatePath("/agents");
    
    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete agent error:", error);
    return {
      success: false,
      error: "Failed to delete agent",
    };
  }
}

// Get featured agents
export async function getFeaturedAgents(limit = 6) {
  try {
    const agents = await prisma.agent.findMany({
      include: {
        properties: {
          where: { status: "available" },
          take: 3,
        },
      },
      take: limit,
      orderBy: { experience: "desc" },
    });

    return {
      success: true,
      data: agents,
    };
  } catch (error) {
    console.error("Get featured agents error:", error);
    return {
      success: false,
      error: "Failed to fetch featured agents",
    };
  }
}
