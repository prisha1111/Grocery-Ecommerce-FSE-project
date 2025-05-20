"use client"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, Package, ShoppingBag, LogOut, Settings, BarChart2 } from "lucide-react"
import { motion } from "framer-motion"

const AdminSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const menuItems = [
    { path: "/admin/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { path: "/admin/products", icon: <Package size={20} />, label: "Products" },
    { path: "/admin/orders", icon: <ShoppingBag size={20} />, label: "Orders" },
    { path: "/admin/settings", icon: <Settings size={20} />, label: "Settings" },
  ]

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-white shadow-lg min-h-screen flex flex-col"
    >
      <div className="p-6 border-b">
        <Link to="/admin/dashboard" className="flex items-center">
          <BarChart2 className="h-8 w-8 text-green-600 mr-2" />
          <span className="text-xl font-bold text-gray-800">GrocHop Admin</span>
        </Link>
      </div>
      <div className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <LogOut size={20} />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </motion.div>
  )
}

export default AdminSidebar
