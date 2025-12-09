"use client";

import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import React from "react";
import { FaSpinner } from "react-icons/fa6";

const FiltersType = ({ filters, typeProperties, loadings }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleButton = (value) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("category", value);
    router.replace(`?${currentParams.toString()}`);
  };

  return (
    <div className="max-w-full">
      <div className="flex gap-4 overflow-x-auto">
        {typeProperties?.data?.map((data) => (
          <button
            onClick={() => handleButton(data.value)}
            key={data.value}
            className={`px-4 py-2 rounded-md text-sm font-medium border whitespace-nowrap flex-shrink-0 ${
              filters.category === data.value
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {loadings ? (
              <FaSpinner className="w-5 h-5 animate-spin" />
            ) : (
              data.label
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FiltersType;
