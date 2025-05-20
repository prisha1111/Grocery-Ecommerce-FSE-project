// import { useCart } from '../CartContext';

// function ProductCard({ id, name, price, image, deliveryTime }) {
//   const { addToCart } = useCart();

//   const handleAddToCart = () => {
//     addToCart({ id, name, price, image });
//   };

//   return (
//     <div className="border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md flex flex-col items-center justify-between w-full max-w-xs">
//       <div className="w-full flex justify-center">
//         <img
//           src={image}
//           alt={name}
//           className="max-w-full max-h-28 object-contain"
//         />
//       </div>
//       <div className="text-xs text-gray-500 mt-1 flex items-center">
//         <span className="mr-1">⏱</span> {deliveryTime} MIN
//       </div>
//       <h3 className="text-sm font-medium mt-1 text-center truncate">{name}</h3>
//       <p className="text-gray-700 text-sm mt-1">₹{price}</p>
//       <button
//         onClick={handleAddToCart}
//         className="mt-2 bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600 w-full"
//       >
//         ADD
//       </button>
//     </div>
//   );
// }

// export default ProductCard;


"use client"
import { motion } from "framer-motion"
import { Clock, ShoppingCart } from "lucide-react"
import { useCart } from "../CartContext"

const ProductCard = ({ id, name, price, image, deliveryTime, description, stock }) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      image,
      description,
      stock,
    })
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg?height=192&width=256"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <Clock className="h-3 w-3 mr-1" />
          <span>{deliveryTime} mins</span>
        </div>
        <h3 className="font-semibold text-gray-800 mb-1 truncate">{name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description || "Fresh product ready for delivery"}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-green-600">₹{price}</span>
          <button
            onClick={handleAddToCart}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full flex items-center transition-colors"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
