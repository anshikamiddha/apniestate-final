"use client";

import React, { useState } from "react";
import Accordion from "../ui/Accordion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  FaBriefcase,
  FaHandHoldingUsd,
  FaUserCog,
  FaBuilding,
  FaPaintBrush,
  FaGavel,
  FaOm,
  FaHardHat,
  FaMoneyBillWave,
  FaCube,
} from "react-icons/fa";

const ServiceSection = () => {
  const [accordionOpen, setAccordionOpen] = useState(0);

  const t = useTranslations("serviceSection");

  const accordionItems = [
    "bestPrice",
    "expertAdvice",
    "personalizedService",
    "support",
  ];

  const services = [
    {
      title: "bestPrice",
      icon: <FaHandHoldingUsd className="w-7 h-7" />,
    },
    {
      title: "expertAdvice",
      icon: <FaUserCog className="w-7 h-7" />,
    },
    {
      title: "personalizedService",
      icon: <FaBriefcase className="w-7 h-7" />,
    },
  ];

  const additionalServices = [
    {
      id: "construction",
      icon: <FaBuilding className="w-8 h-8" />,
      color: "bg-blue-50 hover:bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "interior-design",
      icon: <FaPaintBrush className="w-8 h-8" />,
      color: "bg-purple-50 hover:bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "legal",
      icon: <FaGavel className="w-8 h-8" />,
      color: "bg-red-50 hover:bg-red-100",
      iconColor: "text-red-600",
    },
    {
      id: "vastu",
      icon: <FaOm className="w-8 h-8" />,
      color: "bg-orange-50 hover:bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: "consulting",
      icon: <FaHardHat className="w-8 h-8" />,
      color: "bg-blue-50 hover:bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: "home-loan",
      icon: <FaMoneyBillWave className="w-8 h-8" />,
      color: "bg-yellow-50 hover:bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      id: "materials",
      icon: <FaCube className="w-8 h-8" />,
      color: "bg-gray-50 hover:bg-gray-100",
      iconColor: "text-gray-600",
    },
  ];

  const handleButton = (i) => {
    if (accordionOpen === i) return;
    setAccordionOpen(i);
  };

  return (
    <div className="py-12 md:py-24">
      <div className="container">
        <div className="w-full px-2 mb-10">
          <h1 className="font-medium text-4xl mb-4">{t("heading")}</h1>
          <p className="text-xs md:text-sm max-w-md text-slate-500">
            {t("description")}
          </p>
        </div>
        <div className="w-full flex flex-wrap items-center ">
          <div className="w-full md:w-1/2 flex flex-wrap mb-10 md:mb-0">
            <div className="w-1/2 p-1">
              <div className="bg-[#FFF5D1] h-full p-4">
                <h3 className="font-semibold text-sm md:text-lg mb-2 text-slate-500 ">
                  {t("statistics.trustedBy.title")}
                </h3>
                <h1 className="font-bold text-4xl xl:text-6xl">
                  {t("statistics.trustedBy.value")}
                </h1>
              </div>
            </div>
            <div className="w-1/2 p-1">
              {services.map((key) => (
                <div
                  key={key.title}
                  className="w-full bg-[#E6F3FF] flex items-center gap-4 px-4 py-5 rounded-md mb-2"
                >
                  <div className="me-2">{key.icon}</div>
                  <h1 className="font-semibold text-sm md:text-base">
                    {t(`services.${key.title}.title`)}
                  </h1>
                </div>
              ))}
            </div>
            <div className="w-full p-1">
              <div className="bg-[#FFE6E6] h-64 w-full flex flex-col justify-center items-center">
                <h1 className="font-bold text-3xl md:text-6xl lg:text-8xl mb-3">
                  {t("statistics.propertiesSold.value")}
                </h1>
                <h3>{t("statistics.propertiesSold.title")}</h3>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-2 flex flex-col gap-4">
            {accordionItems.map((data, index) => (
              <Accordion
                data={{
                  title: t(`accordionItems.${data}.title`),
                  value: t(`accordionItems.${data}.content`),
                }}
                isOpen={accordionOpen === index}
                setIsOpen={handleButton}
                index={index}
                key={data}
              />
            ))}
          </div>
        </div>

        {/* Additional Services Section */}
        <div className="w-full mt-16 px-2">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-semibold text-2xl md:text-3xl">
              {t("additionalServices.title")}
            </h2>
            <Link
              href="/services"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              {t("additionalServices.viewAll")}
              <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {additionalServices.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className={`${service.color} rounded-xl p-6 transition-all duration-300 shadow-sm hover:shadow-md`}
              >
                <div className={`${service.iconColor} mb-4`}>
                  {service.icon}
                </div>
                <h3 className="font-semibold text-sm md:text-base">
                  {t(`additionalServices.items.${service.id}`)}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
