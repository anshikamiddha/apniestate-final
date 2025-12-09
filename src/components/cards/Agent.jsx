"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import ContactAgentModal from "@/components/modals/ContactAgentModal";
import { FaEnvelope } from "react-icons/fa";

const Agent = ({ data }) => {
  const t = useTranslations("agent");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryNames = {
    builder: "Builder",
    "interior-designer": "Interior Designer",
    architect: "Architect",
    contractor: "Contractor",
    "real-estate-agent": "Real Estate Agent",
    "vastu-consultant": "Vastu Consultant",
  };

  const handleConnectClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="border rounded-md p-6 hover:shadow-lg transition-shadow relative group">
        <Link href={`/agents/${data.id}`} className="block">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Image
              src={data.image || "/images/agent-placeholder.jpg"}
              alt={data.name}
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
            <div className="w-full flex-1">
              <h1 className="font-medium text-2xl md:text-3xl mb-1 text-center md:text-start">
                {data.name}
              </h1>
              <p className="font-medium text-xs md:text-sm text-slate-500 text-center md:text-start">
                {data.experience} {data.experience === 1 ? "year" : "years"} of experience
              </p>
              {data.category && (
                <p className="text-xs text-blue-600 font-medium mt-1 text-center md:text-start">
                  {categoryNames[data.category] || data.category}
                </p>
              )}
            </div>
          </div>
          
          {/* Bio */}
          {data.bio && (
            <p className="mt-4 text-sm text-gray-600 line-clamp-3">
              {data.bio}
            </p>
          )}
          
          {/* Specialties */}
          {data.specialties && data.specialties.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {data.specialties.slice(0, 3).map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Link>

        {/* Connect Button */}
        <button
          onClick={handleConnectClick}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
        >
          <FaEnvelope />
          <span>Connect with Agent</span>
        </button>
      </div>

      <ContactAgentModal 
        agent={data} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default Agent;
