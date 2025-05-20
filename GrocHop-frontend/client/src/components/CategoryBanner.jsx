import { Link } from 'react-router-dom';

function CategoryBanner({ title, subtitle }) {
  return (
    <div className="relative text-gray-800 p-2 mb-4">
      <div className="container mx-auto flex flex-row items-center justify-between">
        <div className="text-left">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <Link to="/products">
          <button className="text-green-500 hover:underline text-sm font-medium">
            see all
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CategoryBanner;