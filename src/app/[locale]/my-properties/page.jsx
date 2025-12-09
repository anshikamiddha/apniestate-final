import { getMyProperties } from "@/actions/user-property-actions";
import { Link } from "@/i18n/routing";
import MyPropertyCard from "@/components/cards/MyPropertyCard";

export const metadata = {
  title: "My Properties | Apni Estate",
};

export default async function MyPropertiesPage() {
  const result = await getMyProperties();

  if (!result.success) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">{result.error}</p>
          <Link href="/login" className="text-blue-600 hover:underline">
            Login to view your properties
          </Link>
        </div>
      </div>
    );
  }

  const properties = result.data;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <Link
          href="/add-property"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't added any properties yet.</p>
          <Link
            href="/add-property"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <MyPropertyCard key={property.id} data={property} />
          ))}
        </div>
      )}
    </div>
  );
}
