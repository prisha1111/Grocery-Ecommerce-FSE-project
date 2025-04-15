"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    const token = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      })

      const { token, user } = response.data

      
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      
      setUser(user)

      toast.success("Login successful!")
      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error.response?.data?.message || "Login failed")
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await axios.post("http://localhost:3000/api/register", {
        name,
        email,
        password,
      })

      const { token, user } = response.data

      
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      
      setUser(user)

      toast.success("Registration successful!")
      return { success: true }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error.response?.data?.message || "Registration failed")
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = () => {
    
    localStorage.removeItem("token")
    localStorage.removeItem("user")


    setUser(null)

    toast.info("Logged out successfully")
  }

  const updateProfile = async (userData) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("You must be logged in")
      }

      const response = await axios.put("http://localhost:3000/api/user", userData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const updatedUser = response.data.user


      localStorage.setItem("user", JSON.stringify(updatedUser))

      
      setUser(updatedUser)

      toast.success("Profile updated successfully")
      return { success: true }
    } catch (error) {
      console.error("Update profile error:", error)
      toast.error(error.response?.data?.message || "Failed to update profile")
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update profile",
      }
    }
  }

  const isAuthenticated = () => {
    return !!user
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
