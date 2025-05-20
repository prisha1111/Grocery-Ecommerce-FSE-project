"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import ProductCard from "../components/ProductCard"
import { useCart } from "../CartContext"

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("newest")
  const location = useLocation()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const categories = ["Daily items", "Snacks", "Beverages", "Pharmacy", "Pet", "Kids", "Other"]

  useEffect(() => {
    // Get search params from URL
    const params = new URLSearchParams(location.search)
    const searchParam = params.get("search")
    const categoryParam = params.get("category")

    if (searchParam) setSearchTerm(searchParam)
    if (categoryParam) setCategoryFilter(categoryParam)

    fetchProducts(searchParam, categoryParam)
  }, [location.search])

  const fetchProducts = async (search = searchTerm, category = categoryFilter) => {
    try {
      setLoading(true)

      let url = "http://localhost:3000/api/products"
      const params = new URLSearchParams()

      if (search) params.append("search", search)
      if (category) params.append("category", category)

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await axios.get(url)

      setProducts(response.data.products)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products")
      setLoading(false)
    }
  }

  const handleSearch = () => {
    // Update URL with search params
    const params = new URLSearchParams()
    if (searchTerm) params.append("search", searchTerm)
    if (categoryFilter) params.append("category", categoryFilter)

    navigate(`/products?${params.toString()}`)
  }

  const handleCategoryChange = (category) => {
    setCategoryFilter(category)

    // Update URL with new category
    const params = new URLSearchParams(location.search)
    if (category) {
      params.set("category", category)
    } else {
      params.delete("category")
    }

    if (searchTerm) params.set("search", searchTerm)

    navigate(`/products?${params.toString()}`)
  }

  const handlePriceRangeChange = (e, index) => {
    const newRange = [...priceRange]
    newRange[index] = Number(e.target.value)
    setPriceRange(newRange)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const filteredProducts = products
    .filter((product) => {
      const price = Number(product.price)
      return price >= priceRange[0] && price <= priceRange[1]
    })
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return Number(a.price) - Number(b.price)
      } else if (sortBy === "price-high") {
        return Number(b.price) - Number(a.price)
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else {
        // Default: newest
        return new Date(b.created_at) - new Date(a.created_at)
      }
    })

  return (
    <div className="container mx-auto p-4 bg-yellow-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Products</h1>
        {searchTerm && <p className="text-gray-600">Showing results for "{searchTerm}"</p>}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="font-semibold text-lg mb-4">Search</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button
                onClick={handleSearch}
                className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="font-semibold text-lg mb-4">Categories</h2>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={categoryFilter === ""}
                  onChange={() => handleCategoryChange("")}
                  className="mr-2"
                />
                All Categories
              </label>
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={categoryFilter === category}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-2"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h2 className="font-semibold text-lg mb-4">Price Range</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
              <div className="flex space-x-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(e, 0)}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(e, 1)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="font-semibold text-lg mb-4">Sort By</h2>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg mb-4">No products found</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("")
                  setPriceRange([0, 1000])
                  navigate("/products")
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={Number(product.price)}
                  image={product.image ? `http://localhost:3000${product.image}` : null}
                  deliveryTime={8}
                  description={product.description}
                  stock={product.stock}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Products
