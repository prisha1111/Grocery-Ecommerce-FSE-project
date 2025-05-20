import { Link } from 'react-router-dom';

function Promotile({ title, subtitle, imageUrl, buttonText, onClick, path }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-md hover:shadow-lg transition flex-1 min-w-[300px] max-w-[400px]">
      <img src={imageUrl} alt={title} className="w-full h-40 object-cover rounded mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{subtitle}</p>
      {path ? (
        <Link
          to={path}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {buttonText}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default Promotile;