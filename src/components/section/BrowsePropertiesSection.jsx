"use client";

import { getProperties } from "@/actions/property-actions";
import React, { useEffect, useState } from "react";
import Property from "../cards/Property";
import { useTranslations } from "next-intl";
import NotFound from "../ui/NotFound";
import LoadingSpinner from "../ui/LoadingSpinner";

const BrowsePropertiesSection = () => {
  const t = useTranslations("browsePropertySection");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      const result = await getProperties({ limit: 6 });
      if (result.success) {
        setProperties(result.data || []);
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen py-12 md:py-24 flex items-center justify-center">
        <LoadingSpinner />
      </section>
    );
  }

  return (
    <section className="min-h-screen py-12 md:py-24">
      <div className="container">
        <div className="w-full px-2 mb-10">
          <h1 className="font-medium text-2xl md:text-3xl lg:text-4xl mb-3">
            {t("title")}
          </h1>
          <p className="text-xs md:text-sm max-w-lg text-slate-500">
            {t("description")}
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

export default BrowsePropertiesSection;
