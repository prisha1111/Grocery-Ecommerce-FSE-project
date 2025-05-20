"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Search, Plus, Edit, Trash2, Filter } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { motion } from "framer-motion"
import AddEditProductModal from "../../components/admin/AddEditProductModal"

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const navigate = useNavigate()

  const categories = ["Daily items", "Snacks", "Beverages", "Pharmacy", "Pet", "Kids", "Other"]

  useEffect(() => {
    fetchProducts()
  }, [categoryFilter])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      let url = "http://localhost:3000/api/products"
      if (categoryFilter) {
        url += `?category=${categoryFilter}`
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setProducts(response.data.products)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products")
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      let url = "http://localhost:3000/api/products"
      const params = new URLSearchParams()

      if (searchTerm) {
        params.append("search", searchTerm)
      }

      if (categoryFilter) {
        params.append("category", categoryFilter)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setProducts(response.data.products)
      setLoading(false)
    } catch (err) {
      console.error("Error searching products:", err)
      setError("Failed to search products")
      setLoading(false)
    }
  }

  const handleAddProduct = () => {
    setCurrentProduct(null)
    setShowModal(true)
  }

  const handleEditProduct = (product) => {
    setCurrentProduct(product)
    setShowModal(true)
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:3000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      
      setProducts(products.filter((product) => product.id !== id))
      alert("Product deleted successfully")
    } catch (err) {
      console.error("Error deleting product:", err)
      alert("Failed to delete product")
    }
  }

  const handleModalClose = (productAdded = false) => {
    setShowModal(false)
    if (productAdded) {
      fetchProducts()
    }
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && products.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <button
              onClick={handleAddProduct}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Product
            </button>
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <div className="w-full md:w-64">
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={
                        product.image
                          ? `http://localhost:3000${product.image}`
                          : "/placeholder.svg?height=192&width=256"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-lg mb-1 truncate">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description || "No description"}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-600">₹{product.price}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex items-center text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      
      {showModal && <AddEditProductModal product={currentProduct} onClose={handleModalClose} categories={categories} />}
    </div>
  )
}

export default Products
