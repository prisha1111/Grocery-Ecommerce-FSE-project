import React from 'react';

const CategoryTile = ({ title, imageUrl }) => {
  return (
    <div className="w-full h-32 bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col justify-between items-center p-2">
      <div className="w-full h-24 overflow-hidden flex items-center justify-center bg-gray-100"> {/* Increased height to h-24 and added bg-gray-100 as fallback */}
        <img
          src={imageUrl}
          alt={title}
          className="w-auto h-full object-contain" 
        />
      </div>
      <div className="text-center text-xs font-medium text-gray-800 truncate w-full pt-1">
        {title}
      </div>
    </div>
  );
};

export default CategoryTile;