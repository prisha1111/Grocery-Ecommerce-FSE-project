"use client"

import { useState } from "react"
import axios from "axios"
import { X } from "lucide-react"
import { motion } from "framer-motion"

const OrderDetailsModal = ({ order, onClose, statuses }) => {
  const [status, setStatus] = useState(order.status)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleStatusChange = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      await axios.put(
        `http://localhost:3000/api/orders/${order.id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setLoading(false)
      onClose(true) 
    } catch (err) {
      console.error("Error updating order status:", err)
      setError(err.response?.data?.message || "Failed to update order status")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Order #{order.id}</h2>
          <button onClick={() => onClose()} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Order Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-600">Date:</div>
                  <div>{new Date(order.created_at).toLocaleString()}</div>

                  <div className="text-gray-600">Status:</div>
                  <div>
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
                  </div>

                  <div className="text-gray-600">Payment Method:</div>
                  <div>{order.payment_method}</div>

                  <div className="text-gray-600">Total Amount:</div>
                  <div className="font-semibold">₹{order.total_amount}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-600">Name:</div>
                  <div>{order.name}</div>

                  <div className="text-gray-600">Phone:</div>
                  <div>{order.phone}</div>

                  <div className="text-gray-600">Address:</div>
                  <div>{order.address}</div>

                  <div className="text-gray-600">Pincode:</div>
                  <div>{order.pincode}</div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">Order Items</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items &&
                    order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={
                                  item.product_image
                                    ? `http://localhost:3000${item.product_image}`
                                    : "/placeholder.svg?height=40&width=40"
                                }
                                alt={item.product_name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₹{item.price}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Update Order Status</h3>
            <div className="flex items-center space-x-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusChange}
                disabled={loading || status === order.status}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default OrderDetailsModal
