"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { CldUploadWidget } from "next-cloudinary";
import { submitServiceRequest } from "@/actions/service-actions";
import toast from "react-hot-toast";
import { useRouter } from "@/i18n/routing";
import LoadingSpinner from "../ui/LoadingSpinner";

const ServiceRequestForm = ({ serviceType }) => {
  const t = useTranslations("serviceForm");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  const serviceConfig = {
    construction: {
      needsBudget: true,
      needsLocation: true,
      needsTimeline: true,
      needsDocuments: true,
    },
    "interior-design": {
      needsBudget: true,
      needsLocation: true,
      needsTimeline: true,
      needsDocuments: true,
    },
    legal: {
      needsBudget: false,
      needsLocation: true,
      needsTimeline: false,
      needsDocuments: true,
    },
    vastu: {
      needsBudget: true,
      needsLocation: true,
      needsTimeline: false,
      needsDocuments: false,
    },
    consulting: {
      needsBudget: true,
      needsLocation: true,
      needsTimeline: true,
      needsDocuments: true,
    },
    "home-loan": {
      needsBudget: true,
      needsLocation: true,
      needsTimeline: false,
      needsDocuments: true,
    },
    materials: {
      needsBudget: true,
      needsLocation: true,
      needsTimeline: true,
      needsDocuments: false,
    },
  };

  const config = serviceConfig[serviceType] || {};

  const handleUploadSuccess = (result) => {
    if (result.event === "success") {
      setDocuments((prev) => [...prev, result.info.secure_url]);
      toast.success(t("documentUploaded"));
    }
  };

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    formData.append("serviceType", serviceType);
    formData.append("documents", JSON.stringify(documents));

    try {
      const result = await submitServiceRequest(formData);

      if (result.success) {
        toast.success(t("success"));
        router.push("/");
      } else {
        toast.error(result.error || t("error"));
      }
    } catch (error) {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="name">
            {t("name")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t("namePlaceholder")}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            {t("email")} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t("emailPlaceholder")}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="phone">
            {t("phone")} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t("phonePlaceholder")}
          />
        </div>

        {/* Budget */}
        {config.needsBudget && (
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="budget">
              {t("budget")}
            </label>
            <input
              type="text"
              id="budget"
              name="budget"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t("budgetPlaceholder")}
            />
          </div>
        )}

        {/* Location */}
        {config.needsLocation && (
          <div className={config.needsBudget ? "" : "md:col-span-2"}>
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="location"
            >
              {t("location")}
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t("locationPlaceholder")}
            />
          </div>
        )}

        {/* Timeline */}
        {config.needsTimeline && (
          <div className="md:col-span-2">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="timeline"
            >
              {t("timeline")}
            </label>
            <input
              type="text"
              id="timeline"
              name="timeline"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t("timelinePlaceholder")}
            />
          </div>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="message">
          {t("message")} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows="5"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t("messagePlaceholder")}
        ></textarea>
      </div>

      {/* Documents Upload */}
      {config.needsDocuments && (
        <div>
          <label className="block text-sm font-medium mb-2">
            {t("documents")}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <CldUploadWidget
              uploadPreset={
                process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
              }
              onSuccess={handleUploadSuccess}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  {t("uploadDocument")}
                </button>
              )}
            </CldUploadWidget>
            <p className="text-sm text-gray-500 mt-2">
              {t("documentInfo")}
            </p>
          </div>

          {/* Uploaded Documents List */}
          {documents.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm">{t("uploadedDocuments")}:</h4>
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <a
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate flex-1"
                  >
                    {doc.split("/").pop()}
                  </a>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <LoadingSpinner />
              {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </button>
      </div>
    </form>
  );
};

export default ServiceRequestForm;
