"use client";

import Property from "@/components/cards/Property";
import ContactUsSection from "@/components/section/ContactUsSection";
import FiltersType from "@/components/ui/FiltersType";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import NotFound from "@/components/ui/NotFound";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import { getProperties } from "@/actions/property-actions";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const params = useSearchParams();
  const [page, setPage] = useState(1);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: params.get("category") || "",
    query: params.get("query") || "",
  });

  // Available property categories
  const propertyCategories = [
    { value: "", label: "All" },
    { value: "sale", label: "For Sale" },
    { value: "rent", label: "For Rent" },
    { value: "buy", label: "Buy" },
  ];

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const result = await getProperties({
        category: filters.category || undefined,
        search: filters.query || undefined,
        page: page,
        limit: 12,
      });
      
      if (result.success) {
        setProperties(result.data || []);
        // Calculate total pages (assuming 12 items per page)
        setTotalPages(Math.ceil((result.data?.length || 0) / 12));
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters.category, page, filters.query]);

  useEffect(() => {
    const category = params.get("category") || "";
    const query = params.get("query") || "";
    setFilters({ category, query });
  }, [params]);

  return (
    <>
      <section className="min-h-screen py-32 md:py-24">
        <div className="container">
          <div className="w-full flex flex-wrap-reverse items-end justify-between px-2">
            <FiltersType
              filters={filters}
              typeProperties={{ data: propertyCategories }}
              loadings={false}
            />
            <div className="mb-8 md:mb-0 w-full md:w-auto flex justify-end">
              <SearchBar filters={filters} setFilters={setFilters} />
            </div>
          </div>
          <div className="px-2">
            <hr className="my-5" />
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((data) => (
                  <Property data={data} key={data.slug} />
                ))}
              </div>
              <Pagination
                setPage={setPage}
                page={page}
                lastPage={totalPages}
              />
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

export default Page;
