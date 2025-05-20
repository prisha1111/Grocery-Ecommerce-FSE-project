
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

function Category({ categories }) { 
  const { catName } = useParams();

  const category = categories.find(cat => 
    cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === catName
  );

  const products = category ? category.products : [];

  const displayName = category ? category.name : catName.replace(/-/g, ' ');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{displayName}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            deliveryTime={product.deliveryTime}
          />
        ))}
      </div>
    </div>
  );
}

export default Category;
