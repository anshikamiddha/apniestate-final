import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  FaBuilding,
  FaPaintBrush,
  FaGavel,
  FaOm,
  FaHardHat,
  FaMoneyBillWave,
  FaCube,
} from "react-icons/fa";

export const metadata = {
  title: "Our Services | Apni Estate",
  description:
    "Explore our comprehensive real estate services including construction, interior design, legal support, and more.",
};

const ServicesPage = async () => {
  const t = await getTranslations("servicesPage");

  const services = [
    {
      id: "construction",
      icon: <FaBuilding className="w-12 h-12" />,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "interior-design",
      icon: <FaPaintBrush className="w-12 h-12" />,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "legal",
      icon: <FaGavel className="w-12 h-12" />,
      color: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      id: "vastu",
      icon: <FaOm className="w-12 h-12" />,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: "consulting",
      icon: <FaHardHat className="w-12 h-12" />,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "home-loan",
      icon: <FaMoneyBillWave className="w-12 h-12" />,
      color: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      id: "materials",
      icon: <FaCube className="w-12 h-12" />,
      color: "bg-gray-100",
      iconColor: "text-gray-600",
    },
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16 px-2">
          <h1 className="font-bold text-4xl md:text-5xl mb-4">
            {t("title")}
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg">
            {t("description")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 h-full border border-gray-100 hover:border-blue-300">
                <div
                  className={`${service.color} ${service.iconColor} w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {service.icon}
                </div>
                <h3 className="font-bold text-2xl mb-3">
                  {t(`services.${service.id}.title`)}
                </h3>
                <p className="text-slate-600 mb-4 line-clamp-3">
                  {t(`services.${service.id}.description`)}
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                  {t("learnMore")}
                  <span className="ml-2 group-hover:ml-0 transition-all">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white">
          <h2 className="font-bold text-3xl md:text-4xl mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            {t("cta.description")}
          </p>
          <Link
            href="/properties"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            {t("cta.button")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
