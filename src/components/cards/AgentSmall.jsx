import React from "react";
import Link from "next/link";
import { Link as LocaleLink } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";

const AgentSmall = ({ agent }) => {
  const t = useTranslations("agent");
  const joinYear = new Date(agent.createdAt).getFullYear();

  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-center mb-5">
        <LocaleLink href={`/agents/${agent.id}`}>
          <Image
            src={agent.image || "/images/agent-placeholder.jpg"}
            alt={agent.name}
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
        </LocaleLink>
        <div className="ps-4">
          <LocaleLink href={`/agents/${agent.id}`}>
            <h1 className="text-xl md:text-2xl mb-1 font-medium">
              {agent.name}
            </h1>
            <p className="text-xs md:text-sm text-slate-500">
              {agent.experience} years experience
            </p>
          </LocaleLink>
        </div>
      </div>
      <Link
        href={`tel:${agent.phone}`}
        className="w-full block bg-blue-500 text-white rounded-md py-3 font-medium text-center mb-4"
      >
        {t("phone")}
      </Link>
      <Link
        href={`mailto:${agent.email}`}
        className="w-full block border bg-white rounded-md py-3 font-medium text-center"
      >
        {t("email")}
      </Link>
    </div>
  );
};

export default AgentSmall;
