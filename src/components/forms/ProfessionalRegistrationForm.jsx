"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { CldUploadWidget } from "next-cloudinary";
import { submitRegistration } from "@/actions/registration-actions";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaImage, FaBriefcase, FaFileAlt, FaUpload, FaTimes } from "react-icons/fa";

export default function ProfessionalRegistrationForm({ role }) {
  const t = useTranslations("registration.form");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [documents, setDocuments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      formData.append("role", role);
      formData.append("profileImage", profileImage || "");
      formData.append("portfolio", JSON.stringify(portfolio));
      formData.append("documents", JSON.stringify(documents));

      const result = await submitRegistration(formData);

      if (result.success) {
        toast.success(result.message);
        router.push("/");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpload = (result) => {
    if (result.event === "success") {
      setProfileImage(result.info.secure_url);
      toast.success("Profile image uploaded successfully");
    }
  };

  const handlePortfolioUpload = (result) => {
    if (result.event === "success") {
      setPortfolio((prev) => [...prev, result.info.secure_url]);
      toast.success("Portfolio image added");
    }
  };

  const handleDocumentUpload = (result) => {
    if (result.event === "success") {
      setDocuments((prev) => [...prev, result.info.secure_url]);
      toast.success("Document uploaded successfully");
    }
  };

  const removePortfolioImage = (index) => {
    setPortfolio((prev) => prev.filter((_, i) => i !== index));
    toast.info("Portfolio image removed");
  };

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
    toast.info("Document removed");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">
          {t("personalInfo")}
        </h2>

        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
            {t("fullName")} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t("fullNamePlaceholder")}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            {t("email")} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t("emailPlaceholder")}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
            {t("password")} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={8}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t("passwordPlaceholder")}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">{t("passwordHint")}</p>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
            {t("phone")}
          </label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t("phonePlaceholder")}
            />
          </div>
        </div>
      </div>

      {/* Profile Image */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">
          {t("profileSection")}
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t("profileImage")}
          </label>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={handleProfileImageUpload}
          >
            {({ open }) => (
              <div>
                {profileImage ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-slate-300">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setProfileImage(null)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <FaImage className="text-slate-400" />
                    <span className="text-slate-600">{t("uploadProfileImage")}</span>
                  </button>
                )}
              </div>
            )}
          </CldUploadWidget>
        </div>
      </div>

      {/* Professional Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">
          {t("professionalInfo")}
        </h2>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-2">
            {t("experience")}
          </label>
          <div className="relative">
            <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="experience"
              name="experience"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t("experiencePlaceholder")}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
            {t("description")}
          </label>
          <div className="relative">
            <FaFileAlt className="absolute left-3 top-3 text-slate-400" />
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder={t("descriptionPlaceholder")}
            />
          </div>
        </div>
      </div>

      {/* Portfolio */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">
          {t("portfolio")}
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t("portfolioImages")}
          </label>
          <p className="text-sm text-slate-500 mb-3">{t("portfolioHint")}</p>

          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={handlePortfolioUpload}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors mb-4"
              >
                <FaUpload className="text-slate-400" />
                <span className="text-slate-600">{t("addPortfolioImage")}</span>
              </button>
            )}
          </CldUploadWidget>

          {portfolio.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {portfolio.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-slate-300">
                  <img
                    src={url}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePortfolioImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 border-b pb-2">
          {t("documents")}
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {t("uploadDocuments")}
          </label>
          <p className="text-sm text-slate-500 mb-3">{t("documentsHint")}</p>

          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={handleDocumentUpload}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors mb-4"
              >
                <FaUpload className="text-slate-400" />
                <span className="text-slate-600">{t("addDocument")}</span>
              </button>
            )}
          </CldUploadWidget>

          {documents.length > 0 && (
            <div className="space-y-2">
              {documents.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <FaFileAlt className="text-blue-500" />
                    <span className="text-sm text-slate-700">
                      {t("document")} {index + 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {loading ? t("submitting") : t("submitRegistration")}
        </button>
      </div>

      {/* Terms Notice */}
      <p className="text-xs text-center text-slate-500">
        {t("termsNotice")}
      </p>
    </form>
  );
}
