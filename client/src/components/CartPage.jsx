
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../CartContext"
import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import CheckoutForm from "./CheckoutForm"

function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    couponApplied,
    getSubtotal,
    getTotal,
    clearCart,
  } = useCart()

  const [couponCode, setCouponCode] = useState("")
  const [showCheckout, setShowCheckout] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleApplyCoupon = () => {
    applyCoupon(couponCode)
  }

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }
    setShowCheckout(true)
  }

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="cart-container max-w-6xl mx-auto p-6"
      >
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="cart-container max-w-6xl mx-auto p-6"
    >
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {!showCheckout ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex items-center py-4 border-b last:border-b-0">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-grow ml-4">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">₹{item.price}</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded-l"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded-r"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {!couponApplied ? (
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-grow p-2 border rounded"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Try code: SAVE10</p>
                </div>
              ) : (
                <div className="mb-4 p-2 bg-green-50 text-green-700 rounded flex justify-between items-center">
                  <span>Coupon SAVE10 applied</span>
                  <button onClick={removeCoupon} className="text-sm text-red-500 hover:text-red-700">
                    Remove
                  </button>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getSubtotal().toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span>-₹{(getSubtotal() * 0.1).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>₹{getTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                >
                  Proceed to Checkout
                </button>
                <button onClick={clearCart} className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CheckoutForm
          cartItems={cartItems}
          totalAmount={getTotal()}
          onCancel={() => setShowCheckout(false)}
          onSuccess={() => {
            clearCart()
            navigate("/")
          }}
          setError={setError}
        />
      )}
    </motion.div>
  )
}

export default CartPage
