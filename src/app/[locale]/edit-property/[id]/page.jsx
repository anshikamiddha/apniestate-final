import { getMyProperties } from "@/actions/user-property-actions";
import EditPropertyForm from "@/components/forms/EditPropertyForm";
import { redirect } from "@/i18n/routing";

export const metadata = {
  title: "Edit Property | Apni Estate",
};

export default async function EditPropertyPage({ params }) {
  const { id } = params;
  
  // Get user's properties to verify ownership
  const result = await getMyProperties();

  if (!result.success) {
    redirect("/login");
  }

  // Find the property by ID
  const property = result.data.find((p) => p.id === id);

  if (!property) {
    redirect("/my-properties");
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <EditPropertyForm property={property} />
    </div>
  );
}
