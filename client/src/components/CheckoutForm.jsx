"use client"

import { useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Check, CreditCard, Truck, AlertCircle } from "lucide-react"

const CheckoutForm = ({ cartItems, totalAmount, onCancel, onSuccess, setError }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    pincode: "",
    paymentMethod: "cod",
    
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    
    upiId: "",
  })
  const [loading, setLoading] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      })
    }
  }

  const validateShippingForm = () => {
    const errors = {}

    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.address.trim()) errors.address = "Address is required"

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      errors.phone = "Please enter a valid 10-digit phone number"
    }

    if (!formData.pincode.trim()) {
      errors.pincode = "Pincode is required"
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = "Please enter a valid 6-digit pincode"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePaymentForm = () => {
    const errors = {}

    if (formData.paymentMethod === "card") {
      if (!formData.cardNumber.trim()) {
        errors.cardNumber = "Card number is required"
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
        errors.cardNumber = "Please enter a valid 16-digit card number"
      }

      if (!formData.cardName.trim()) errors.cardName = "Cardholder name is required"

      if (!formData.cardExpiry.trim()) {
        errors.cardExpiry = "Expiry date is required"
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        errors.cardExpiry = "Please use MM/YY format"
      }

      if (!formData.cardCvv.trim()) {
        errors.cardCvv = "CVV is required"
      } else if (!/^\d{3,4}$/.test(formData.cardCvv)) {
        errors.cardCvv = "Please enter a valid CVV"
      }
    } else if (formData.paymentMethod === "upi") {
      if (!formData.upiId.trim()) {
        errors.upiId = "UPI ID is required"
      } else if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/.test(formData.upiId)) {
        errors.upiId = "Please enter a valid UPI ID (e.g., name@upi)"
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitShipping = (e) => {
    e.preventDefault()
    if (validateShippingForm()) {
      setStep(2)
    }
  }

  const handleSubmitPayment = async (e) => {
    e.preventDefault()

    if (!validatePaymentForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("You must be logged in to place an order")
      }

      
      const items = cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))


      await axios.post(
        "http://localhost:3000/api/orders",
        {
          items,
          totalAmount,
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          pincode: formData.pincode,
          paymentMethod: formData.paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setLoading(false)
      setOrderComplete(true)

      
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err) {
      console.error("Error placing order:", err)
      setLoading(false)
      setError(err.response?.data?.message || "Failed to place order. Please try again.")
      setStep(1)
    }
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value)
    setFormData({
      ...formData,
      cardNumber: formattedValue,
    })

    if (validationErrors.cardNumber) {
      setValidationErrors({
        ...validationErrors,
        cardNumber: "",
      })
    }
  }

  const handleCardExpiryChange = (e) => {
    let { value } = e.target
    value = value.replace(/\D/g, "")

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }

    setFormData({
      ...formData,
      cardExpiry: value,
    })

    if (validationErrors.cardExpiry) {
      setValidationErrors({
        ...validationErrors,
        cardExpiry: "",
      })
    }
  }

  if (orderComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-md p-8 text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-6">Thank you for your purchase. Your order is being processed.</p>
      </motion.div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center">
          <div
            className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 1 ? "bg-green-500 text-white" : "bg-gray-300"}`}
          >
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-green-500" : "bg-gray-300"}`}></div>
          <div
            className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 2 ? "bg-green-500 text-white" : "bg-gray-300"}`}
          >
            2
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm font-medium">Shipping Details</span>
          <span className="text-sm font-medium">Payment</span>
        </div>
      </div>

      {step === 1 ? (
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmitShipping}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  validationErrors.name ? "border-red-500" : ""
                }`}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {validationErrors.name}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  validationErrors.address ? "border-red-500" : ""
                }`}
              />
              {validationErrors.address && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {validationErrors.address}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  validationErrors.phone ? "border-red-500" : ""
                }`}
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {validationErrors.phone}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                Pincode *
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  validationErrors.pincode ? "border-red-500" : ""
                }`}
              />
              {validationErrors.pincode && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {validationErrors.pincode}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back to Cart
            </button>
            <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Continue to Payment
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmitPayment}
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
            <div className="space-y-4">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 [&:has(:checked)]:bg-green-50 [&:has(:checked)]:border-green-500">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-gray-600" />
                  <div>
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when your order arrives</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 [&:has(:checked)]:bg-green-50 [&:has(:checked)]:border-green-500">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-gray-500">Pay securely with your card</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 [&:has(:checked)]:bg-green-50 [&:has(:checked)]:border-green-500">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={formData.paymentMethod === "upi"}
                  onChange={handleChange}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <div className="h-5 w-5 mr-2 text-center font-bold text-gray-600">₹</div>
                  <div>
                    <p className="font-medium">UPI</p>
                    <p className="text-sm text-gray-500">Pay using UPI apps</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          
          {formData.paymentMethod === "card" && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Card Details</h4>
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      validationErrors.cardNumber ? "border-red-500" : ""
                    }`}
                  />
                  {validationErrors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors.cardNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      validationErrors.cardName ? "border-red-500" : ""
                    }`}
                  />
                  {validationErrors.cardName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {validationErrors.cardName}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date (MM/YY) *
                    </label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleCardExpiryChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        validationErrors.cardExpiry ? "border-red-500" : ""
                      }`}
                    />
                    {validationErrors.cardExpiry && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.cardExpiry}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      id="cardCvv"
                      name="cardCvv"
                      value={formData.cardCvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        validationErrors.cardCvv ? "border-red-500" : ""
                      }`}
                    />
                    {validationErrors.cardCvv && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {validationErrors.cardCvv}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          
          {formData.paymentMethod === "upi" && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">UPI Details</h4>
              <div>
                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID *
                </label>
                <input
                  type="text"
                  id="upiId"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="yourname@upi"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    validationErrors.upiId ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.upiId && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {validationErrors.upiId}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="border-t pt-4 mb-6">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Items:</span>
                <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  )
}

export default CheckoutForm
