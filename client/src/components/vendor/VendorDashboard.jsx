import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import VendorHeader from "./VendorHeader";
import VendorMap from "./VendorMap";
import { useVendorStore } from "../../stores/useVendorStore";

// --- SupplierProfilePreview Component ---
const SupplierProfilePreview = ({ supplier, products, onClose }) => {
  const [sort, setSort] = useState("priceLowHigh");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 4;

  // Sorting/filtering logic
  const filteredProducts = [...products]
    .sort((a, b) => {
      if (sort === "priceLowHigh") return a.price - b.price;
      if (sort === "priceHighLow") return b.price - a.price;
      return 0;
    })
    .filter((p) => (filter === "all" ? true : p.status === filter));

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Badge color helper
  const badgeColor = (score) => {
    if (score >= 4.5) return "bg-green-100 text-green-800";
    if (score >= 3.5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Progress bar color
  const progressColor = (score) => {
    if (score >= 4.5) return "bg-green-500";
    if (score >= 3.5) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Star rating rendering
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={i}
            className="w-6 h-6 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        ))}
        {halfStar && (
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path
              fill="url(#half)"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"
            />
          </svg>
        )}
        <span className="ml-2 text-lg font-bold text-gray-900">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Reset page on sort/filter change
  React.useEffect(() => {
    setPage(1);
  }, [sort, filter, products]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl flex w-full max-w-5xl h-[80vh] overflow-hidden animate-slideUp">
        {/* Left Sticky Section */}
        <div className="w-80 bg-gray-50 border-r p-6 flex flex-col sticky left-0 top-0 h-full">
          <h2 className="text-2xl font-bold mb-2">{supplier.name}</h2>
          <div className="mb-2 text-gray-600">{supplier.address}</div>
          <div className="mb-2 text-sm">📞 {supplier.phone}</div>
          <div className="mb-2 text-sm">✉️ {supplier.email}</div>
          <div className="mb-2 text-sm">📍 {supplier.distance} km away</div>
          {/* Modern Ratings Card */}
          <div className="bg-white rounded-xl shadow p-4 mt-4 mb-2 flex flex-col items-center">
            {renderStars(supplier.rating)}
            <div className="w-full mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-700">Quality</span>
                <span
                  className={`font-semibold ${badgeColor(supplier.quality)}`}
                >
                  {supplier.quality}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                <div
                  className={`h-2 rounded-full ${progressColor(
                    supplier.quality
                  )}`}
                  style={{ width: `${(supplier.quality / 5) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-700">Reliability</span>
                <span
                  className={`font-semibold ${badgeColor(
                    supplier.reliability
                  )}`}
                >
                  {supplier.reliability}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                <div
                  className={`h-2 rounded-full ${progressColor(
                    supplier.reliability
                  )}`}
                  style={{ width: `${(supplier.reliability / 5) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-gray-700">Speed</span>
                <span className={`font-semibold ${badgeColor(supplier.speed)}`}>
                  {supplier.speed}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full ${progressColor(
                    supplier.speed
                  )}`}
                  style={{ width: `${(supplier.speed / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded transition"
          >
            Close
          </button>
        </div>
        {/* Right Scrollable Section */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Products</h3>
            <div className="flex gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
              </select>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border rounded-lg p-4 flex flex-col shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {product.name}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${badgeColor(
                      product.status === "in-stock"
                        ? 5
                        : product.status === "low-stock"
                        ? 3
                        : 1
                    )}`}
                  >
                    {product.status.replace("-", " ")}
                  </span>
                </div>
                <div className="mb-1 text-gray-600">
                  ₹{product.price} / {product.unit}
                </div>
                <button className="mt-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition">
                  Order Now
                </button>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
// --- End SupplierProfilePreview ---

// --- Floating Checkout Component ---
const FloatingCheckout = ({ cart, onCheckout, onRemoveItem }) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                {totalItems}
              </div>
              <span className="text-gray-700 font-medium">Items in cart</span>
            </div>
            <div className="text-gray-600">
              {cart.map((item) => (
                <span
                  key={item.id}
                  className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm mr-2 mb-1"
                >
                  {item.name} x{item.quantity}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-xl font-bold text-gray-900">
                ₹{totalPrice.toFixed(2)}
              </div>
            </div>
            <button
              onClick={onCheckout}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
              <span>Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// --- End Floating Checkout ---

const VendorDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  // Use vendor store
  const {
    profile,
    suppliers,
    products,
    stats,
    loading,
    error,
    fetchProfile,
    fetchSuppliers,
    fetchProducts,
    fetchStats,
    getSupplierById,
    getProductsBySupplier,
    getProductsByCategory,
    getInStockProducts,
    getLowStockProducts,
  } = useVendorStore();

  // Fetch data on component mount
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id, user.token);
      fetchSuppliers({}, user.token);
      fetchProducts({}, user.token);
      fetchStats(user.id, user.token);
    }
  }, [user, fetchProfile, fetchSuppliers, fetchProducts, fetchStats]);

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Dashboard stats from store
  const dashboardStats = stats
    ? [
        {
          title: t("vendorDashboard.totalPurchases"),
          value: `₹${stats.totalSpent?.toLocaleString() || "0"}`,
          change: "+15.2%",
          changeType: "positive",
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          ),
        },
        {
          title: t("vendorDashboard.itemsPurchased"),
          value: stats.totalOrders?.toString() || "0",
          change: "+8.7%",
          changeType: "positive",
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          ),
        },
        {
          title: t("vendorDashboard.suppliersConnected"),
          value: stats.activeSuppliers?.toString() || "0",
          change: "+2",
          changeType: "positive",
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          ),
        },
        {
          title: t("vendorDashboard.monthlySpending"),
          value: `₹${stats.averageOrderValue?.toLocaleString() || "0"}`,
          change: "+12.3%",
          changeType: "positive",
          icon: (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          ),
        },
      ]
    : [];

  // Categories from products
  const categories = [
    { id: "all", name: t("vendorDashboard.allCategories"), icon: "🛒" },
    ...Array.from(new Set(products.map((p) => p.category))).map((category) => ({
      id: category,
      name: t(`supplier.${category}`),
      icon:
        category === "vegetables"
          ? "🥬"
          : category === "fruits"
          ? "🍎"
          : category === "dairy"
          ? "🥛"
          : "🌾",
    })),
  ];

  // Quick actions
  const quickActions = [
    {
      title: t("vendorDashboard.searchProducts"),
      description: t("vendorDashboard.findBestSuppliers"),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      action: () => setActiveTab("products"),
      color: "bg-blue-500",
    },
    {
      title: t("vendorDashboard.viewCart"),
      description: t("vendorDashboard.manageOrders"),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"
          />
        </svg>
      ),
      action: () => setShowCart(true),
      color: "bg-green-500",
    },
    {
      title: t("vendorDashboard.supplierPerformance"),
      description: t("vendorDashboard.ratingsAndReviews"),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      action: () => setActiveTab("performance"),
      color: "bg-purple-500",
    },
    {
      title: t("common.feedback"),
      description: t("vendorDashboard.shareExperience"),
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      action: () => (window.location.href = "/feedback"),
      color: "bg-orange-500",
    },
  ];

  // Cart functions
  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { cart } });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader cart={cart} showCart={showCart} setShowCart={setShowCart} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t("common.welcome")}, {profile?.name || user?.name || "Vendor"}! 👋
          </h2>
          <p className="text-gray-600">
            {t("vendorDashboard.monthlySpendingOverview")}
          </p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-4 md:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <div className="text-green-600">{stat.icon}</div>
                    </div>
                  </div>
                  <div className="ml-3 md:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-xl md:text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === "positive"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "products"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t("vendorDashboard.searchProducts")} ({filteredProducts.length})
            </button>
            <button
              onClick={() => setActiveTab("performance")}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "performance"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t("vendorDashboard.supplierPerformance")}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t("vendorDashboard.quickActions")}
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color}`}>
                        <div className="text-white">{action.icon}</div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Nearby Suppliers */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t("vendorDashboard.nearbySuppliers")}
              </h3>
              <div className="bg-white rounded-lg shadow p-6">
                <VendorMap products={products} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t("vendorDashboard.searchProducts")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vendorDashboard.searchPlaceholder")}
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("vendorDashboard.searchPlaceholder")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vendorDashboard.category")}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">
                        {product.name}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        per {product.unit}
                      </span>
                    </div>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-sm text-gray-600">
                          {product.supplier.rating}
                        </span>
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        • {product.supplier.name}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                      >
                        {t("vendorDashboard.addToCart")}
                      </button>
                      <Link
                        to={`/vendors/${encodeURIComponent(
                          product.supplier.name
                        )}/public`}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 text-center"
                      >
                        {t("vendorDashboard.viewSupplierProfile")}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t("vendorDashboard.supplierPerformance")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("vendorDashboard.performanceDescription")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      {supplier.name}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {supplier.distance}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {t("vendorDashboard.qualityRating")}:
                      </span>
                      <span className="font-medium">{supplier.rating}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {t("vendorDashboard.speedRating")}:
                      </span>
                      <span className="font-medium">{supplier.rating}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {t("vendorDashboard.reliabilityRating")}:
                      </span>
                      <span className="font-medium">{supplier.rating}</span>
                    </div>
                  </div>
                  <Link
                    to={`/vendors/${encodeURIComponent(supplier.name)}/public`}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 text-center block"
                  >
                    {t("vendorDashboard.viewDetails")}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Cart */}
      {showCart && (
        <FloatingCheckout
          cart={cart}
          onCheckout={handleCheckout}
          onRemoveItem={removeFromCart}
        />
      )}
    </div>
  );
};

export default VendorDashboard;
