"use client";

import { toggleFavorite } from "@/actions/favorite-actions";
import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import toast from "react-hot-toast";

const AddToFavorite = ({ propertyId, initialIsFavorite = false }) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const result = await toggleFavorite(propertyId);
      
      if (result.success) {
        setIsFavorite(result.action === "added");
        toast.success(
          result.action === "added" 
            ? "Added to favorites!" 
            : "Removed from favorites!"
        );
      } else {
        toast.error(result.error || "Failed to update favorites");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="px-3 py-3 font-medium text-sm rounded-md border flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
    >
      {isFavorite ? (
        <>
          <FaHeart className="w-4 h-4 text-red-500" />
          <span>Remove From Favorites</span>
        </>
      ) : (
        <>
          <FaRegHeart className="w-4 h-4" />
          <span>Add To Favorites</span>
        </>
      )}
    </button>
  );
};

export default AddToFavorite;
