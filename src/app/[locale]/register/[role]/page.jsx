import React from "react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ProfessionalRegistrationForm from "@/components/forms/ProfessionalRegistrationForm";

export async function generateMetadata({ params }) {
  const { role } = params;
  const validRoles = [
    "builder",
    "interior-designer",
    "architect",
    "contractor",
    "real-estate-agent",
    "vastu-consultant",
  ];

  if (!validRoles.includes(role)) {
    return { title: "Role Not Found" };
  }

  const roleName = role.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  
  return {
    title: `Register as ${roleName} | Apni Estate`,
    description: `Professional registration for ${roleName}`,
  };
}

const RoleRegistrationPage = async ({ params }) => {
  const { role } = params;
  const t = await getTranslations("registration");

  const validRoles = [
    "builder",
    "interior-designer",
    "architect",
    "contractor",
    "real-estate-agent",
    "vastu-consultant",
  ];

  if (!validRoles.includes(role)) {
    notFound();
  }

  return (
    <div className="min-h-screen py-24">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 px-2">
            <h1 className="font-bold text-3xl md:text-4xl mb-4">
              {t(`roles.${role}.title`)} {t("registrationForm")}
            </h1>
            <p className="text-slate-600">
              {t("formDescription")}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-10">
            <ProfessionalRegistrationForm role={role} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleRegistrationPage;
