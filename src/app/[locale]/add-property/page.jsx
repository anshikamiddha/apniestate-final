import AddPropertyForm from "@/components/forms/AddPropertyForm";

export const metadata = {
  title: "Add Property | Apni Estate",
};

export default function AddPropertyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <AddPropertyForm />
    </div>
  );
}
