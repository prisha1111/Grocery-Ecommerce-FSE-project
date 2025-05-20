"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Search, Filter, Eye, Trash2 } from "lucide-react"
import AdminSidebar from "../../components/admin/AdminSidebar"
import { motion } from "framer-motion"
import OrderDetailsModal from "../../components/admin/OrderDetailsModal"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(null)
  const navigate = useNavigate()

  const statuses = ["pending", "accepted", "packing", "shipped", "delivered", "cancelled"]

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      let url = "http://localhost:3000/api/orders"
      if (statusFilter) {
        url += `?status=${statusFilter}`
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setOrders(response.data.orders)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Failed to load orders")
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      let url = "http://localhost:3000/api/orders"
      const params = new URLSearchParams()

      if (searchTerm) {
        params.append("search", searchTerm)
      }

      if (statusFilter) {
        params.append("status", statusFilter)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setOrders(response.data.orders)
      setLoading(false)
    } catch (err) {
      console.error("Error searching orders:", err)
      setError("Failed to search orders")
      setLoading(false)
    }
  }

  const handleViewOrder = (order) => {
    setCurrentOrder(order)
    setShowModal(true)
  }

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:3000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      
      setOrders(orders.filter((order) => order.id !== id))
      alert("Order deleted successfully")
    } catch (err) {
      console.error("Error deleting order:", err)
      alert("Failed to delete order")
    }
  }

  const handleModalClose = (orderUpdated = false) => {
    setShowModal(false)
    if (orderUpdated) {
      fetchOrders()
    }
  }

  if (loading && orders.length === 0) {
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

  if (error && orders.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
          <p className="text-gray-600">Manage customer orders</p>
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
                placeholder="Search orders by name, address, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <div className="w-full md:w-64">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
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
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{order.name}</div>
                        <div className="text-xs text-gray-400">{order.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{order.total_amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => handleViewOrder(order)} className="text-blue-600 hover:text-blue-900">
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      
      {showModal && <OrderDetailsModal order={currentOrder} onClose={handleModalClose} statuses={statuses} />}
    </div>
  )
}

export default Orders
