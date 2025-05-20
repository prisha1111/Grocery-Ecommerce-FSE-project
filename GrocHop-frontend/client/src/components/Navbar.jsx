

"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { cn } from "../lib/utils"
import { MapPin, ChevronDown, Clock, Navigation, Home, Search, X, LogOut, User, ShoppingCart } from "lucide-react"
import { useCart } from "../CartContext"
import { useAuth } from "../contexts/AuthContext"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import logo from "../assets/logo.jpg"

function Navbar() {
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [suggestionsIndex, setSuggestionsIndex] = useState(0)
  const [isPlaceholderAnimating, setIsPlaceholderAnimating] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState("B62, Pocket B, South City I, Sect...")
  const searchRef = useRef(null)
  const searchTimeoutRef = useRef(null)
  const autoRotateRef = useRef(null)
  const { cartItems } = useCart()
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const savedLocations = [
    { id: 1, name: "Home", address: "B62, Pocket B, South City I, Sector 41" },
    { id: 2, name: "Office", address: "Tower A, Cyber City, DLF Phase 2" },
    { id: 3, name: "Gym", address: "Fitness Hub, Sector 15, Part II" },
  ]

  const recentLocations = [
    { id: 1, address: "Market Place, Sector 47" },
    { id: 2, address: "Metro Station, Sector 54" },
    { id: 3, address: "Central Park, Sector 21" },
  ]

  const suggestionList = [
    "rice",
    "curd",
    "paneer",
    "milk",
    "bread",
    "eggs",
    "butter",
    "cheese",
    "yogurt",
    "cream",
    "wheat flour",
    "oil",
    "spices",
    "vegetables",
    "fruits",
    "cereal",
    "snacks",
    "chocolates",
  ]

  const autoRotatingSuggestions = [
    'Search "rice"',
    'Search "paneer"',
    'Search "milk"',
    'Search "bread"',
    'Search "vegetables"',
    'Search "fruits"',
  ]

  useEffect(() => {
    if (!inputValue) {
      autoRotateRef.current = setInterval(() => {
        setIsPlaceholderAnimating(true)
        setTimeout(() => {
          setSuggestionsIndex((prevIndex) => (prevIndex === autoRotatingSuggestions.length - 1 ? 0 : prevIndex + 1))
          setIsPlaceholderAnimating(false)
        }, 300)
      }, 2000)
    }

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current)
      }
    }
  }, [inputValue])

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (inputValue.trim() !== "") {
      setIsAnimating(true)
      searchTimeoutRef.current = setTimeout(() => {
        const filteredSuggestions = suggestionList.filter((suggestion) =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase()),
        )
        setSuggestions(filteredSuggestions)
        setShowSuggestions(true)
        setTimeout(() => setIsAnimating(false), 100)
      }, 200)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [inputValue])

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion)
    setShowSuggestions(false)
    
    navigate(`/products?search=${suggestion}`)
  }

  const handleSearch = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      navigate(`/products?search=${inputValue}`)
    }
  }

  const clearSearch = () => {
    setInputValue("")
    setShowSuggestions(false)
  }

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.address.length > 30 ? location.address.substring(0, 30) + "..." : location.address)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="bg-green-100 text-black p-3 shadow-md flex justify-between items-center border-b sticky top-0 z-50">
      <div className="flex items-center space-x-4 md:space-x-6 flex-1">
        <Link to="/" className="flex items-center">
          <img src={logo || "/placeholder.svg"} alt="GrocHop Logo" className="h-8 md:h-10" />
        </Link>

        <div className="hidden md:flex items-center">
          <span className="text-sm md:text-base font-semibold mr-2">Delivery in 8 minutes</span>

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center bg-white text-gray-800 p-1.5 rounded border border-gray-300 text-sm hover:bg-gray-50 transition-colors">
                <MapPin className="text-green-600 h-4 w-4 mr-1" />
                <span className="truncate max-w-[200px]">{selectedLocation}</span>
                <ChevronDown className="h-3 w-3 ml-1 text-gray-500" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-3 border-b">
                <h3 className="font-medium mb-2">Saved Locations</h3>
                <div className="space-y-2">
                  {savedLocations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationSelect(location)}
                      className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md text-left"
                    >
                      {location.name === "Home" ? (
                        <Home className="text-green-600 h-4 w-4 mr-2" />
                      ) : (
                        <MapPin className="text-green-600 h-4 w-4 mr-2" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{location.name}</p>
                        <p className="text-xs text-gray-500 truncate">{location.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-medium mb-2 flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" />
                  <span>Recent Locations</span>
                </h3>
                <div className="space-y-2">
                  {recentLocations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationSelect(location)}
                      className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md text-left"
                    >
                      <Clock className="text-gray-400 h-3.5 w-3.5 mr-2" />
                      <p className="text-sm text-gray-700 truncate">{location.address}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 border-t">
                <button className="flex items-center justify-center w-full p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-md text-sm font-medium transition-colors">
                  <Navigation className="h-4 w-4 mr-1" />
                  Use current location
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="relative flex-1 max-w-xl" ref={searchRef}>
          <div className="flex items-center bg-gray-100 border border-gray-300 rounded-md p-2 w-full">
            <Search className="text-gray-500 mr-2 h-4 w-4" />
            <div className="w-full relative">
              <input
                type="text"
                placeholder=" "
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleSearch}
                onFocus={() => inputValue && setShowSuggestions(true)}
                className="bg-transparent border-none w-full focus:outline-none text-gray-600 text-sm"
              />
              {!inputValue && (
                <div
                  className={cn(
                    "absolute left-0 top-0 text-gray-400 text-sm pointer-events-none",
                    isPlaceholderAnimating ? "animate-placeholder-fade-out" : "animate-placeholder-fade-in",
                  )}
                >
                  {autoRotatingSuggestions[suggestionsIndex]}
                </div>
              )}
            </div>
            {inputValue && <X className="text-gray-500 h-4 w-4 cursor-pointer" onClick={clearSearch} />}
          </div>

          {showSuggestions && (
            <div
              className={cn(
                "absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto",
                isAnimating ? "animate-fade-in" : "",
              )}
            >
              {suggestions.length > 0 ? (
                <ul>
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                      style={{
                        animationDelay: `${index * 30}ms`,
                        animation: `fadeSlideIn 0.3s ease-out ${index * 30}ms both`,
                      }}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center">
                        <Search className="text-gray-400 mr-2 h-3 w-3" />
                        <span>{suggestion}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 text-center text-gray-500 animate-fade-in">No results found for "{inputValue}"</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6 ml-4">
        {isAuthenticated() ? (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center text-gray-800 hover:text-green-700 transition-colors">
                  <User className="h-5 w-5 mr-1" />
                  <span className="hidden md:inline font-medium">Hi, {user.name.split(" ")[0]}</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0">
                <div className="py-2">
                  <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    My Profile
                  </Link>
                  <Link to="/orders" className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm">
                    <ShoppingCart className="h-4 w-4 mr-2 text-gray-500" />
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm w-full text-left text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-green-800 text-white px-3 py-2 rounded-md hover:bg-green-900 text-sm md:text-base flex items-center"
          >
            Login
          </Link>
        )}

        <Link
          to="/cart"
          className="bg-green-800 text-white px-3 py-2 rounded-md hover:bg-green-900 text-sm md:text-base flex items-center"
        >
          <span className="mr-1">My Cart</span>
          <span className="bg-white text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {cartItems.length}
          </span>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
