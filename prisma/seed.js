const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Create a sample user for properties
  const sampleUser = await prisma.user.upsert({
    where: { email: "demo@horizonhomes.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@horizonhomes.com",
      emailVerified: true,
    },
  });

  console.log("Sample user created:", sampleUser);

  // Create sample agents
  const agent1 = await prisma.agent.upsert({
    where: { email: "john.smith@realestate.com" },
    update: {},
    create: {
      name: "John Smith",
      email: "john.smith@realestate.com",
      phone: "+1 (555) 123-4567",
      bio: "With over 10 years of experience in real estate, John specializes in luxury homes and commercial properties. His dedication to client satisfaction and deep market knowledge make him a top choice for buyers and sellers alike.",
      experience: 10,
      specialties: ["Luxury Homes", "Commercial Properties", "Investment Properties"],
    },
  });

  const agent2 = await prisma.agent.upsert({
    where: { email: "sarah.johnson@realestate.com" },
    update: {},
    create: {
      name: "Sarah Johnson",
      email: "sarah.johnson@realestate.com",
      phone: "+1 (555) 234-5678",
      bio: "Sarah is passionate about helping first-time homebuyers find their perfect property. With 7 years in the industry, she provides personalized service and expert guidance throughout the buying process.",
      experience: 7,
      specialties: ["First-Time Buyers", "Residential Properties", "Condominiums"],
    },
  });

  const agent3 = await prisma.agent.upsert({
    where: { email: "michael.brown@realestate.com" },
    update: {},
    create: {
      name: "Michael Brown",
      email: "michael.brown@realestate.com",
      phone: "+1 (555) 345-6789",
      bio: "Michael brings 15 years of expertise in commercial real estate and property investment. He has successfully closed deals worth millions and is known for his strategic market insights.",
      experience: 15,
      specialties: ["Commercial Real Estate", "Property Investment", "Market Analysis"],
    },
  });

  console.log("Agents created:", { agent1, agent2, agent3 });

  // Create sample properties
  const properties = [
    {
      title: "Modern Luxury Villa with Ocean View",
      description: "Stunning 5-bedroom villa featuring contemporary design, floor-to-ceiling windows, infinity pool, and breathtaking ocean views. This property combines luxury living with modern architecture, perfect for those seeking an exclusive lifestyle.",
      price: 2500000,
      address: "123 Ocean Drive",
      city: "Miami",
      state: "Florida",
      zipCode: "33139",
      type: "house",
      status: "available",
      bedrooms: 5,
      bathrooms: 4,
      area: 4500,
      images: [
        "/images/property1.jpg",
        "/images/property1-2.jpg",
        "/images/property1-3.jpg",
      ],
      features: [
        "Ocean View",
        "Infinity Pool",
        "Smart Home System",
        "Gourmet Kitchen",
        "Home Theater",
        "Wine Cellar",
      ],
      agentId: agent1.id,
      userId: sampleUser.id,
    },
    {
      title: "Downtown Luxury Penthouse",
      description: "Exquisite penthouse in the heart of downtown featuring panoramic city views, high-end finishes, private elevator, and rooftop terrace. This residence offers the ultimate urban living experience.",
      price: 1800000,
      address: "456 Park Avenue",
      city: "New York",
      state: "New York",
      zipCode: "10022",
      type: "apartment",
      status: "available",
      bedrooms: 3,
      bathrooms: 3,
      area: 3200,
      images: [
        "/images/property2.jpg",
        "/images/property2-2.jpg",
      ],
      features: [
        "Panoramic Views",
        "Private Elevator",
        "Rooftop Terrace",
        "Concierge Service",
        "Fitness Center",
        "24/7 Security",
      ],
      agentId: agent1.id,
      userId: sampleUser.id,
    },
    {
      title: "Charming Family Home in Suburbs",
      description: "Beautiful 4-bedroom family home in a quiet neighborhood with excellent schools nearby. Features include a spacious backyard, updated kitchen, and a two-car garage. Perfect for growing families.",
      price: 650000,
      address: "789 Maple Street",
      city: "Portland",
      state: "Oregon",
      zipCode: "97201",
      type: "house",
      status: "available",
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      images: [
        "/images/property3.jpg",
      ],
      features: [
        "Large Backyard",
        "Updated Kitchen",
        "Two-Car Garage",
        "Near Schools",
        "Hardwood Floors",
        "Central Air",
      ],
      agentId: agent2.id,
      userId: sampleUser.id,
    },
    {
      title: "Modern Condo with City Views",
      description: "Sleek 2-bedroom condo with floor-to-ceiling windows offering stunning city views. Features modern finishes, open floor plan, and access to premium building amenities.",
      price: 450000,
      address: "321 Urban Way",
      city: "San Francisco",
      state: "California",
      zipCode: "94102",
      type: "condo",
      status: "available",
      bedrooms: 2,
      bathrooms: 2,
      area: 1400,
      images: [
        "/images/property4.jpg",
      ],
      features: [
        "City Views",
        "Modern Design",
        "Building Gym",
        "Rooftop Pool",
        "Pet Friendly",
        "Walk Score 95",
      ],
      agentId: agent2.id,
      userId: sampleUser.id,
    },
    {
      title: "Commercial Office Space",
      description: "Prime commercial office space in downtown business district. Features include modern amenities, conference rooms, and excellent visibility. Perfect for growing businesses.",
      price: 3200000,
      address: "555 Business Boulevard",
      city: "Chicago",
      state: "Illinois",
      zipCode: "60601",
      type: "commercial",
      status: "available",
      bedrooms: 0,
      bathrooms: 4,
      area: 8000,
      images: [
        "/images/property5.jpg",
      ],
      features: [
        "Prime Location",
        "Conference Rooms",
        "Parking Garage",
        "High-Speed Internet",
        "Security System",
        "Modern HVAC",
      ],
      agentId: agent3.id,
      userId: sampleUser.id,
    },
    {
      title: "Beachfront Paradise",
      description: "Exclusive beachfront property with direct beach access, private dock, and spectacular sunset views. This tropical paradise features 6 bedrooms and resort-style amenities.",
      price: 4500000,
      address: "777 Beach Road",
      city: "Malibu",
      state: "California",
      zipCode: "90265",
      type: "house",
      status: "available",
      bedrooms: 6,
      bathrooms: 5,
      area: 6200,
      images: [
        "/images/property6.jpg",
      ],
      features: [
        "Beach Access",
        "Private Dock",
        "Resort Pool",
        "Outdoor Kitchen",
        "Guest House",
        "Ocean Views",
      ],
      agentId: agent3.id,
      userId: sampleUser.id,
    },
  ];

  for (const propertyData of properties) {
    const slug = propertyData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    await prisma.property.upsert({
      where: { slug },
      update: {},
      create: {
        ...propertyData,
        slug,
      },
    });
  }

  console.log("Sample properties created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
