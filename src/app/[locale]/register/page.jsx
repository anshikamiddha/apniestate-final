import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  FaBuilding,
  FaPaintBrush,
  FaHardHat,
  FaHome,
  FaOm,
  FaTools,
} from "react-icons/fa";

export const metadata = {
  title: "Professional Registration | Apni Estate",
  description: "Join Apni Estate as a professional service provider",
};

const RegisterPage = async () => {
  const t = await getTranslations("registration");

  const roles = [
    {
      id: "builder",
      icon: <FaBuilding className="w-12 h-12" />,
      color: "from-blue-600 to-blue-800",
    },
    {
      id: "interior-designer",
      icon: <FaPaintBrush className="w-12 h-12" />,
      color: "from-purple-600 to-purple-800",
    },
    {
      id: "architect",
      icon: <FaTools className="w-12 h-12" />,
      color: "from-green-600 to-green-800",
    },
    {
      id: "contractor",
      icon: <FaHardHat className="w-12 h-12" />,
      color: "from-orange-600 to-orange-800",
    },
    {
      id: "real-estate-agent",
      icon: <FaHome className="w-12 h-12" />,
      color: "from-red-600 to-red-800",
    },
    {
      id: "vastu-consultant",
      icon: <FaOm className="w-12 h-12" />,
      color: "from-yellow-600 to-yellow-800",
    },
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="container">
        <div className="text-center mb-16 px-2">
          <h1 className="font-bold text-4xl md:text-5xl mb-4">
            {t("title")}
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg">
            {t("description")}
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6 max-w-2xl mx-auto">
            <p className="text-yellow-800 text-sm">
              ⚠️ {t("approvalNotice")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 max-w-6xl mx-auto">
          {roles.map((role) => (
            <Link
              key={role.id}
              href={`/register/${role.id}`}
              className="group"
            >
              <div className={`bg-gradient-to-br ${role.color} rounded-xl p-8 h-full text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
                <div className="bg-white bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {role.icon}
                </div>
                <h3 className="font-bold text-2xl mb-3">
                  {t(`roles.${role.id}.title`)}
                </h3>
                <p className="text-white text-opacity-90 mb-4">
                  {t(`roles.${role.id}.description`)}
                </p>
                <div className="flex items-center text-white font-medium group-hover:gap-2 transition-all">
                  {t("apply")}
                  <span className="ml-2 group-hover:ml-0 transition-all">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600">
            {t("alreadyRegistered")} <Link href="/login" className="text-blue-600 hover:underline font-medium">{t("loginHere")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
