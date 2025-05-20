
"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import ProductCard from "../components/ProductCard"
import CategoryBanner from "../components/CategoryBanner"
import Promotile from "../components/PromoTile"
import TopBanner from "../components/TopBanner"
import CategoryTile from "../components/CategoryTile"
import pet from "../assets/pet.jpg"
import pharmacy from "../assets/pharmacy.jpg"
import diaper from "../assets/diaper.jpg"
import paan_corner_products from "../assets/paan-corner_products.avif"
import Dairy_products from "../assets/Dairy_products.avif"
import fruits_vegetables from "../assets/fruits_vegetables.avif"
import colddrinks from "../assets/colddrinks.avif"
import Snacks from "../assets/Snacks.avif"
import Breakfast from "../assets/Breakfast.avif"
import Sweettooth from "../assets/Sweettooth.avif"
import Bakery from "../assets/Bakery.avif"
import TeaCoffee from "../assets/TeaCoffee.avif"
import AttaDal from "../assets/AttaDal.avif"
import MasalaOil from "../assets/MasalaOil.avif"
import Sauces from "../assets/Sauces.avif"
import Chicken from "../assets/Chicken.avif"
import Organic from "../assets/Organic.avif"
import BabyCare from "../assets/BabyCare.avif"
import PharmaWell from "../assets/PharmaWell.avif"
import Cleaning from "../assets/Cleaning.avif"
import HomeOffice from "../assets/HomeOffice.avif"
import PersonalCare from "../assets/PersonalCare.avif"
import PetCare from "../assets/PetCare.avif"

export default function Home() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products")

      
      const productsByCategory = response.data.products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = []
        }
        acc[product.category].push({
          id: product.id,
          name: product.name,
          price: Number.parseFloat(product.price),
          image: `http://localhost:3000${product.image}`,
          deliveryTime: 8, 
          description: product.description,
          stock: product.stock,
        })
        return acc
      }, {})

      
      const categoriesArray = Object.keys(productsByCategory).map((category) => ({
        name: category,
        subtitle: `Explore our ${category.toLowerCase()} collection`,
        products: productsByCategory[category],
      }))

      setCategories(categoriesArray)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products")
      setLoading(false)
    }
  }

  const categoryTiles = [
    { title: "Paan Corner", imageUrl: paan_corner_products, path: "/category/paan-corner" },
    { title: "Dairy, Bread & Eggs", imageUrl: Dairy_products, path: "/category/dairy-bread-eggs" },
    { title: "Fruits & Vegetables", imageUrl: fruits_vegetables, path: "/category/fruits-vegetables" },
    { title: "Cold Drinks & Juices", imageUrl: colddrinks, path: "/category/cold-drinks-juices" },
    { title: "Snacks & Munchies", imageUrl: Snacks, path: "/category/snack-munchies" },
    { title: "Breakfast & Instant Food", imageUrl: Breakfast, path: "/category/breakfast-instant" },
    { title: "Sweet Tooth", imageUrl: Sweettooth, path: "/category/sweet-tooth" },
    { title: "Bakery & Biscuits", imageUrl: Bakery, path: "/category/bakery-biscuits" },
    { title: "Tea, Coffee & Health Drink", imageUrl: TeaCoffee, path: "/category/tea-coffee" },
    { title: "Atta, Rice & Dal", imageUrl: AttaDal, path: "/category/atta-rice-dal" },
    { title: "Masala, Oil & More", imageUrl: MasalaOil, path: "/category/masala-oil" },
    { title: "Sauces & Spreads", imageUrl: Sauces, path: "/category/sauces-spreads" },
    { title: "Chicken, Meat & Fish", imageUrl: Chicken, path: "/category/chicken-meat-fish" },
    { title: "Organic & Healthy Living", imageUrl: Organic, path: "/category/organic-healthy" },
    { title: "Baby Care", imageUrl: BabyCare, path: "/category/baby-care" },
    { title: "Pharma & Wellness", imageUrl: PharmaWell, path: "/category/pharma-wellness" },
    { title: "Cleaning Essentials", imageUrl: Cleaning, path: "/category/cleaning-essentials" },
    { title: "Home & Office", imageUrl: HomeOffice, path: "/category/home-office" },
    { title: "Personal Care", imageUrl: PersonalCare, path: "/category/personal-care" },
    { title: "Pet Care", imageUrl: PetCare, path: "/category/pet-care" },
  ]

  const promotiles = [
    {
      title: "Pharmacy at your doorstep!",
      subtitle: "Cough syrups, pain relief sprays & more",
      imageUrl: pharmacy,
      buttonText: "Order Now",
      path: "/products",
    },
    {
      title: "Pet Care supplies in minutes",
      subtitle: "Food, treats, toys & more",
      imageUrl: pet,
      buttonText: "Order Now",
      path: "/products",
    },
    {
      title: "No time for a diaper run?",
      subtitle: "Get baby care essentials in minutes",
      imageUrl: diaper,
      buttonText: "Order Now",
      path: "/products",
    },
  ]

  return (
    <div className="container mx-auto p-4 bg-yellow-50 min-h-screen">
      
      <TopBanner />

      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotiles.map((tile, index) => (
            <Promotile
              key={index}
              title={tile.title}
              subtitle={tile.subtitle}
              imageUrl={tile.imageUrl}
              buttonText={tile.buttonText}
              path={tile.path}
            />
          ))}
        </div>
      </motion.div>

      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-4">
          {categoryTiles.slice(0, 10).map((tile, index) => (
            <Link to={tile.path} key={index}>
              <CategoryTile title={tile.title} imageUrl={tile.imageUrl} />
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-4 mt-4">
          {categoryTiles.slice(10, 20).map((tile, index) => (
            <Link to={tile.path} key={index + 10}>
              <CategoryTile title={tile.title} imageUrl={tile.imageUrl} />
            </Link>
          ))}
        </div>
        <Link to="/categories" className="block mt-4 text-green-500 hover:underline">
          see all
        </Link>
        <h2 className="text-4xl font-bold mt-6 mb-4 text-black-600">Explore All Categories</h2>
      </motion.div>

      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products available</p>
        </div>
      ) : (
        categories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="mb-8"
          >
            <CategoryBanner title={category.name} subtitle={category.subtitle} />
            <h2 className="text-2xl font-bold mb-4 sr-only">{category.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {category.products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  deliveryTime={product.deliveryTime}
                  description={product.description}
                  stock={product.stock}
                />
              ))}
            </div>
            {category.products.length > 4 && (
              <div className="text-center mt-4">
                <Link
                  to={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  View all {category.name} products
                </Link>
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  )
}


