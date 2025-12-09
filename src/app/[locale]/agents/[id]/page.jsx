import Property from "@/components/cards/Property";
import NotFound from "@/components/ui/NotFound";
import { getAgentById } from "@/actions/agent-actions";
import { getProperties } from "@/actions/property-actions";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { notFound } from "next/navigation";

const page = async ({ params }) => {
  const t = await getTranslations("agent");
  
  const agentResult = await getAgentById(params.id);
  if (!agentResult.success || !agentResult.data) notFound();
  
  const agent = agentResult.data;
  
  const propertiesResult = await getProperties({ agentId: params.id });
  const properties = propertiesResult.data || [];

  return (
    <section className="min-h-screen pt-32 pb-16">
      <div className="container">
        <div className="w-full px-2 flex items-center flex-col md:flex-row gap-8">
          <div className="w-full md:w-[80%] mb-10 lg:mb-0">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative w-48 h-48 flex-shrink-0">
                <Image
                  src={agent.image || "/images/agent-placeholder.jpg"}
                  alt={agent.name}
                  fill
                  className="rounded-full lg:rounded-md object-cover"
                />
              </div>
              <div className="w-full">
                <h1 className="font-medium text-2xl md:text-4xl mb-2 text-center md:text-start">
                  {agent.name}
                </h1>
                <p className="font-medium text-xs md:text-sm text-slate-500 text-center md:text-start mb-4">
                  {agent.experience} years of experience
                </p>
                
                {/* Contact buttons */}
                <div className="flex gap-3 justify-center md:justify-start">
                  <Link
                    href={`tel:${agent.phone}`}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
                  >
                    Call
                  </Link>
                  <Link
                    href={`mailto:${agent.email}`}
                    className="px-6 py-2 border bg-white rounded-md font-medium hover:bg-gray-50 transition-colors"
                  >
                    Email
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Bio */}
            {agent.bio && (
              <div className="mt-8">
                <h2 className="mb-3 font-semibold text-xl">About</h2>
                <p className="text-gray-700 whitespace-pre-line">{agent.bio}</p>
              </div>
            )}
            
            {/* Specialties */}
            {agent.specialties && agent.specialties.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-3 font-semibold text-xl">Specialties</h2>
                <div className="flex flex-wrap gap-3">
                  {agent.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="px-2">
          <hr className="my-8" />
        </div>
      </div>
      <div className="container">
        <div className="w-full px-2 mb-5 md:mb-8">
          <h1 className="font-semibold text-3xl md:text-4xl">
            Properties by {agent.name}
          </h1>
          <p className="text-gray-600 mt-2">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} listed
          </p>
        </div>
        {properties.length > 0 ? (
          <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((data) => (
              <Property data={data} key={data.slug} />
            ))}
          </div>
        ) : (
          <NotFound />
        )}
      </div>
    </section>
  );
};

export default page;
