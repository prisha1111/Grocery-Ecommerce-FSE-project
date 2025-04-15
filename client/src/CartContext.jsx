

"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "react-toastify"


import { useAuth } from "./contexts/AuthContext"

const CartContext = createContext()

const COUPON_DISCOUNT = 0.1

export function CartProvider({ children }) {
  const { user } = useAuth() || { user: null }
  const [cartItems, setCartItems] = useState([])
  const [couponApplied, setCouponApplied] = useState(false)


  const getCartStorageKey = () => {
    return user ? `groceryCart_${user.id}` : "groceryCart_guest"
  }

  
  useEffect(() => {
    const loadCart = () => {
      const storageKey = getCartStorageKey()
      const savedCart = localStorage.getItem(storageKey)
      return savedCart ? JSON.parse(savedCart) : []
    }

    setCartItems(loadCart())
    setCouponApplied(false)
  }, [user])

  
  useEffect(() => {
    const storageKey = getCartStorageKey()
    localStorage.setItem(storageKey, JSON.stringify(cartItems))
  }, [cartItems, user])

  const addToCart = (product) => {
    try {
      
      const cartItemId = Date.now() + "-" + product.id
      const newItem = { ...product, cartItemId, quantity: 1 }

      setCartItems((prevItems) => {
        toast.success(`${product.name} added to cart!`)
        return [...prevItems, newItem]
      })
    } catch (error) {
      toast.error("Error adding item to cart")
    }
  }

  const updateQuantity = (cartItemId, quantity) => {
    try {
      setCartItems((prevItems) =>
        prevItems
          .map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: Math.max(0, quantity) } : item))
          .filter((item) => item.quantity > 0),
      )
      toast.success("Cart updated")
    } catch (error) {
      toast.error("Error updating cart")
    }
  }

  const removeFromCart = (cartItemId) => {
    try {
      setCartItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId))
      toast.success("Item removed from cart")
    } catch (error) {
      toast.error("Error removing item from cart")
    }
  }

  const applyCoupon = (code) => {
    if (code === "SAVE10") {
      setCouponApplied(true)
      toast.success("Coupon applied successfully!")
      return true
    }
    toast.error("Invalid coupon code")
    return false
  }

  const removeCoupon = () => {
    setCouponApplied(false)
    toast.info("Coupon removed")
  }

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotal = () => {
    const subtotal = getSubtotal()
    return couponApplied ? subtotal * (1 - COUPON_DISCOUNT) : subtotal
  }

  const clearCart = () => {
    setCartItems([])
    setCouponApplied(false)
    toast.info("Cart cleared")
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        couponApplied,
        getSubtotal,
        getTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
