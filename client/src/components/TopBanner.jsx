import { Link } from 'react-router-dom';
import banner from '../assets/banner.png';

function TopBanner() {
  return (
    <div
      className="relative bg-cover bg-center text-white rounded-lg mb-8 overflow-hidden"
      style={{ backgroundImage: `url(${banner})`, height: '400px' }}
    >
      <div className="relative z-10 h-full w-full flex flex-col items-start justify-end p-8">
        {/* Tagline with new font color */}
        <h1 className="text-2xl font-bold mb-4 text-white">Freshness Delivered Daily, Right to Your Door!</h1>
        <Link to="/products">
          <button
            className="bg-white text-green-500 py-3 px-8 rounded hover:bg-gray-200 shadow-md text-base font-semibold"
          >
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  );
}

export default TopBanner;