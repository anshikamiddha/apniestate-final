"use client";

import { useState, useEffect } from "react";
import Agent from "@/components/cards/Agent";
import ContactUsSection from "@/components/section/ContactUsSection";
import NotFound from "@/components/ui/NotFound";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getAgents } from "@/actions/agent-actions";
import { useTranslations } from "next-intl";
import { FaSearch } from "react-icons/fa";

const AgentsPage = () => {
  const t = useTranslations("agentsPage");
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Professionals" },
    { id: "builder", label: "Builders" },
    { id: "interior-designer", label: "Interior Designers" },
    { id: "architect", label: "Architects" },
    { id: "contractor", label: "Contractors" },
    { id: "real-estate-agent", label: "Real Estate Agents" },
    { id: "vastu-consultant", label: "Vastu Consultants" },
  ];

  useEffect(() => {
    fetchAgents();
  }, [search, category]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const result = await getAgents({ 
        search: search.trim(), 
        category: category,
        limit: 100 
      });
      setAgents(result.data || []);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <section className="min-h-screen pt-24 md:pt-32 pb-16">
        <div className="container">
          {/* Header */}
          <div className="w-full px-2 mb-8">
            <h1 className="font-semibold text-3xl md:text-4xl mb-4">
              {t("title")}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 max-w-md">
              {t("description")}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="px-2 mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-xl">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by name, email, or bio..."
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    category === cat.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : agents.length > 0 ? (
            <>
              <p className="text-sm text-slate-600 px-2 mb-4">
                Found {agents.length} {agents.length === 1 ? "professional" : "professionals"}
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 px-2 gap-5">
                {agents.map((data) => (
                  <Agent data={data} key={data.id} />
                ))}
              </div>
            </>
          ) : (
            <NotFound />
          )}
        </div>
      </section>
      <ContactUsSection />
    </>
  );
};

export default AgentsPage;
