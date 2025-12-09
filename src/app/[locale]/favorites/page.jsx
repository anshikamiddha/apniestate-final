import Property from "@/components/cards/Property";
import NotFound from "@/components/ui/NotFound";
import { getFavorites } from "@/actions/favorite-actions";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const t = await getTranslations("favoritesPage");

  const result = await getFavorites();
  
  // If user is not authenticated, redirect to login
  if (!result.success && result.error === "Please login to view favorites") {
    redirect("/login");
  }

  const myFavorites = result.data || [];

  return (
    <section className="pt-24 md:pt-32 pb-16 min-h-screen">
      <div className="container">
        <div className="w-full px-2">
          <h1 className="font-semibold text-3xl md:text-4xl mb-4">
            {t("title")}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-md">
            {t("description")}
          </p>
        </div>
        {myFavorites.length > 0 ? (
          <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {myFavorites.map((data) => (
              <Property data={data.property} key={data.property.slug} />
            ))}
          </div>
        ) : (
          <NotFound />
        )}
      </div>
    </section>
  );
};

export default Page;
