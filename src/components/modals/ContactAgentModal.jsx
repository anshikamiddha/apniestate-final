"use client";

import { useState } from "react";
import { contactAgent } from "@/actions/agent-contact-actions";
import toast from "react-hot-toast";
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaCommentDots } from "react-icons/fa";

export default function ContactAgentModal({ agent, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      formData.append("agentName", agent.name);
      formData.append("agentEmail", agent.email);
      formData.append("agentCategory", agent.category || "");

      const result = await contactAgent(formData);

      if (result.success) {
        toast.success(result.message);
        e.target.reset();
        onClose();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categoryNames = {
    builder: "Builder",
    "interior-designer": "Interior Designer",
    architect: "Architect",
    contractor: "Contractor",
    "real-estate-agent": "Real Estate Agent",
    "vastu-consultant": "Vastu Consultant",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Contact Agent</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="mt-3">
            <p className="text-white text-opacity-90">{agent.name}</p>
            <p className="text-sm text-white text-opacity-75">
              {categoryNames[agent.category] || agent.category || "Professional"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-slate-600 text-sm">
            Fill in your details and we'll connect you with {agent.name}.
          </p>

          {/* Name */}
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-slate-700 mb-2">
              Your Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                id="userName"
                name="userName"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-slate-700 mb-2">
              Your Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                id="userEmail"
                name="userEmail"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="userPhone" className="block text-sm font-medium text-slate-700 mb-2">
              Your Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                id="userPhone"
                name="userPhone"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
              Message (Optional)
            </label>
            <div className="relative">
              <FaCommentDots className="absolute left-3 top-3 text-slate-400" />
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tell us about your requirements..."
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
            >
              {loading ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
