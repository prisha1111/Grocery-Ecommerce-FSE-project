

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Category from "./pages/Category"
import CartPage from "./components/CartPage"
import ForgotPassword from "./pages/ForgotPassword"
import PetCarePage from "./pages/PetCare"
import PharmacyPage from "./pages/Pharmacy"
import Products from "./pages/Products"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./CartContext"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

import Dashboard from "./pages/admin/Dashboard"
import AdminProducts from "./pages/admin/Products"
import Orders from "./pages/admin/Orders"

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/pharmacy" element={<PharmacyPage />} />
                <Route path="/pet-care" element={<PetCarePage />} />
                <Route path="/products" element={<Products />} />
                <Route path="/category/:catName" element={<Category />} />

                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <Dashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <Orders />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
