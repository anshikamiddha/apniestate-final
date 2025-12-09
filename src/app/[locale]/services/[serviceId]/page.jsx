import React from "react";
import { getTranslations } from "next-intl/server";
import ServiceRequestForm from "@/components/forms/ServiceRequestForm";
import {
  FaBuilding,
  FaPaintBrush,
  FaGavel,
  FaOm,
  FaHardHat,
  FaMoneyBillWave,
  FaCube,
} from "react-icons/fa";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { serviceId } = params;
  const validServices = [
    "construction",
    "interior-design",
    "legal",
    "vastu",
    "consulting",
    "home-loan",
    "materials",
  ];

  if (!validServices.includes(serviceId)) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${serviceId.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} Services | Apni Estate`,
  };
}

const ServiceDetailPage = async ({ params }) => {
  const { serviceId } = params;
  const t = await getTranslations("servicesPage");

  const validServices = [
    "construction",
    "interior-design",
    "legal",
    "vastu",
    "consulting",
    "home-loan",
    "materials",
  ];

  if (!validServices.includes(serviceId)) {
    notFound();
  }

  const serviceIcons = {
    construction: <FaBuilding className="w-16 h-16" />,
    "interior-design": <FaPaintBrush className="w-16 h-16" />,
    legal: <FaGavel className="w-16 h-16" />,
    vastu: <FaOm className="w-16 h-16" />,
    consulting: <FaHardHat className="w-16 h-16" />,
    "home-loan": <FaMoneyBillWave className="w-16 h-16" />,
    materials: <FaCube className="w-16 h-16" />,
  };

  const serviceColors = {
    construction: "from-blue-600 to-blue-800",
    "interior-design": "from-purple-600 to-purple-800",
    legal: "from-red-600 to-red-800",
    vastu: "from-orange-600 to-orange-800",
    consulting: "from-green-600 to-green-800",
    "home-loan": "from-yellow-600 to-yellow-800",
    materials: "from-gray-600 to-gray-800",
  };

  return (
    <div className="min-h-screen py-24">
      <div className="container">
        {/* Service Header */}
        <div
          className={`bg-gradient-to-r ${serviceColors[serviceId]} rounded-2xl p-12 text-white mb-12`}
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              {serviceIcons[serviceId]}
            </div>
            <div>
              <h1 className="font-bold text-4xl md:text-5xl mb-2">
                {t(`services.${serviceId}.title`)}
              </h1>
              <p className="text-xl opacity-90">
                {t(`services.${serviceId}.subtitle`)}
              </p>
            </div>
          </div>
          <p className="text-lg leading-relaxed max-w-4xl">
            {t(`services.${serviceId}.fullDescription`)}
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-12 px-2">
          <h2 className="font-bold text-3xl mb-6">
            {t("serviceDetails.features")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((num) => {
              const featureKey = `services.${serviceId}.features.${num}`;
              try {
                const feature = t(featureKey);
                if (feature === featureKey) return null; // Skip if translation doesn't exist
                return (
                  <div
                    key={num}
                    className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg"
                  >
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      {num}
                    </div>
                    <p className="text-slate-700">{feature}</p>
                  </div>
                );
              } catch {
                return null;
              }
            })}
          </div>
        </div>

        {/* Request Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="font-bold text-3xl mb-2">
            {t("serviceDetails.requestTitle")}
          </h2>
          <p className="text-slate-600 mb-8">
            {t("serviceDetails.requestDescription")}
          </p>
          <ServiceRequestForm serviceType={serviceId} />
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
