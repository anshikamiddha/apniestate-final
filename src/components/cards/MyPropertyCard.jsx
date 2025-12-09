"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState } from "react";
import { FaBath, FaBed, FaMapMarked, FaEdit, FaTrash } from "react-icons/fa";
import { IoIosExpand } from "react-icons/io";
import { deleteMyProperty } from "@/actions/user-property-actions";
import toast from "react-hot-toast";
import { useRouter } from "@/i18n/routing";

const MyPropertyCard = ({ data }) => {
  const t = useTranslations("property.specification");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Format price consistently to avoid hydration errors
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(data.price);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    
    setLoading(true);
    try {
      const result = await deleteMyProperty(data.id);
      
      if (result.success) {
        toast.success("Property deleted successfully!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete property");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-64 w-full">
        <div className="absolute top-4 left-4 z-10">
          <div className="px-3 py-1 font-medium text-xs bg-blue-600 text-white rounded-md capitalize shadow-md">
            {data.category === "sale" ? "For Sale" : data.category === "rent" ? "For Rent" : "Buy"}
          </div>
        </div>
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Link
            href={`/edit-property/${data.id}`}
            className="p-2 bg-white rounded-md shadow-md hover:bg-blue-50"
          >
            <FaEdit className="w-4 h-4 text-blue-600" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 bg-white rounded-md shadow-md hover:bg-red-50 disabled:opacity-50"
          >
            <FaTrash className="w-4 h-4 text-red-600" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 z-10">
          <div className="px-4 py-2 font-medium text-sm bg-white rounded-md capitalize shadow-md">
            {data.type}
          </div>
        </div>
        <Link href={`/properties/${data.id}`}>
          <Image
            src={data.images?.[0] || "/images/placeholder.jpg"}
            alt={data.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-3 text-blue-500">
          <FaMapMarked />
          <span className="ms-2">{data.city}, {data.state}</span>
        </div>
        <h1 className="font-bold text-xl md:text-2xl mb-3">
          {formattedPrice}
        </h1>
        <Link href={`/properties/${data.id}`}>
          <h2 className="font-semibold capitalize text-2xl md:text-3xl mb-2 truncate">
            {data.title}
          </h2>
        </Link>
        <p className="text-xs md:text-sm text-slate-500 line-clamp-2">
          {data.description}
        </p>
        <hr className="my-4" />
        <div className="flex justify-between text-blue-500">
          <div className="flex items-center">
            <FaBed />
            <span className="ms-2 text-xs md:text-sm font-medium">
              {data.bedrooms} {t("bedroom")}
            </span>
          </div>
          <div className="flex items-center">
            <FaBath />
            <span className="ms-2 text-xs md:text-sm font-medium">
              {data.bathrooms} {t("bathroom")}
            </span>
          </div>
          <div className="flex items-center">
            <IoIosExpand />
            <span className="ms-2 text-xs md:text-sm font-medium">
              {data.area} ft²
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPropertyCard;
