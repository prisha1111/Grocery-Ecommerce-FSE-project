import ProductCard from '../components/ProductCard';

function PharmacyPage({ pharmacyProducts }) {
  return (
    <div className="container mx-auto p-4 bg-yellow-50 min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-black-600">Pharmacy Products</h2>
      {pharmacyProducts.length === 0 ? (
        <p className="text-gray-600">No products available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {pharmacyProducts.map(product => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              deliveryTime={product.deliveryTime}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PharmacyPage;