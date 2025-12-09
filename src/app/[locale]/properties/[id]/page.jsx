import { getPropertyById, getProperties } from "@/actions/property-actions";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import React from "react";
import { FaMapMarkedAlt, FaBed, FaBath } from "react-icons/fa";
import { IoIosExpand } from "react-icons/io";
import Link from "next/link";
import AgentSmall from "@/components/cards/AgentSmall";
import ContactUsSection from "@/components/section/ContactUsSection";
import Property from "@/components/cards/Property";
import NotFound from "@/components/ui/NotFound";
import AddToFavorite from "@/components/buttons/AddToFavorite";
import ImageCarousel from "@/components/ui/ImageCarousel";

const page = async ({ params: { id } }) => {
  const t = await getTranslations();

  const result = await getPropertyById(id);
  if (!result.success || !result.data) notFound();

  const property = result.data;
  
  // Get related properties (same type)
  const relatedResult = await getProperties({ type: property.type, limit: 3 });
  const relatedProperties = (relatedResult.data || []).filter(p => p.id !== id);

  return (
    <>
      <section className="min-h-screen pt-24 pb-16">
        <div className="container">
          {/* Image Carousel */}
          <div className="w-full px-2 mb-8">
            <ImageCarousel images={property.images} title={property.title} />
          </div>

          <div className="px-2">
            <hr className="my-5" />
          </div>
          <div className="w-full flex flex-wrap gap-8">
            <div className="w-full md:w-[65%] px-2">
              <h1 className="font-semibold text-4xl md:text-5xl text-blue-500 mb-4">
                ${property.price.toLocaleString()}
              </h1>
              <h1 className="font-semibold text-4xl md:text-5xl mb-3">
                {property.title}
              </h1>
              <div className="flex items-center text-blue-500 mb-3">
                <FaMapMarkedAlt />
                <span className="ms-2">
                  {property.address}, {property.city}, {property.state}
                </span>
              </div>
              <div className="mt-4">
                <AddToFavorite propertyId={property.id} />
              </div>
              
              {/* Specifications */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg">
                    <FaBed className="text-3xl text-blue-500 mb-2" />
                    <span className="font-semibold">{property.bedrooms}</span>
                    <span className="text-sm text-gray-500">Bedrooms</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg">
                    <FaBath className="text-3xl text-blue-500 mb-2" />
                    <span className="font-semibold">{property.bathrooms}</span>
                    <span className="text-sm text-gray-500">Bathrooms</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg">
                    <IoIosExpand className="text-3xl text-blue-500 mb-2" />
                    <span className="font-semibold">{property.area}</span>
                    <span className="text-sm text-gray-500">ft²</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg capitalize">
                    <span className="font-semibold text-lg text-blue-500">{property.type}</span>
                    <span className="text-sm text-gray-500">Property Type</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">Features</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {property.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Contact Information Sidebar */}
            <div className="w-full md:w-[30%] px-2 space-y-6">
              {/* Contact Card */}
              {(property.phone || property.email) && (
                <div className="p-6 border rounded-lg bg-white shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {property.phone && (
                      <Link
                        href={`tel:${property.phone}`}
                        className="w-full block bg-blue-500 text-white rounded-md py-3 font-medium text-center hover:bg-blue-600 transition-colors"
                      >
                        📞 Call Now
                      </Link>
                    )}
                    {property.email && (
                      <Link
                        href={`mailto:${property.email}`}
                        className="w-full block border-2 border-blue-500 text-blue-500 rounded-md py-3 font-medium text-center hover:bg-blue-50 transition-colors"
                      >
                        ✉️ Send Email
                      </Link>
                    )}
                  </div>
                  {property.phone && (
                    <p className="text-sm text-gray-600 mt-4 text-center">{property.phone}</p>
                  )}
                  {property.email && (
                    <p className="text-sm text-gray-600 mt-2 text-center break-all">{property.email}</p>
                  )}
                </div>
              )}
              
              {/* Agent Card */}
              {property.agent && <AgentSmall agent={property.agent} />}
            </div>
          </div>
        </div>
      </section>
      <div className="py-8 md:py-12">
        <div className="container">
          <div className="w-full px-2 mb-5 md:mb-8">
            <h1 className="font-semibold text-3xl md:text-4xl">
              Related Properties
            </h1>
          </div>
          {relatedProperties.length > 0 ? (
            <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedProperties.map((data) => (
                <Property data={data} key={data.id} />
              ))}
            </div>
          ) : (
            <NotFound />
          )}
        </div>
      </div>
      <ContactUsSection />
    </>
  );
};

export default page;
