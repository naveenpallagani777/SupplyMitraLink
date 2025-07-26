import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VendorHeader from './VendorHeader';

const SupplierPublicView = () => {
  const { t } = useTranslation();
  const { supplierName } = useParams();
  const [sort, setSort] = useState('priceLowHigh');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  // Dummy supplier data
  const supplier = {
    name: supplierName || 'Fresh Farm Supplies',
    address: 'Farm Road, Bangalore Rural, Karnataka 562123',
    phone: '+91 98765 12345',
    email: 'supplier@freshfarm.com',
    distance: 2.3,
    rating: 4.5,
    quality: 4.8,
    speed: 4.2,
    reliability: 4.6,
    businessType: 'Agricultural Farm',
    farmSize: '25 acres',
    specializations: ['Organic Vegetables', 'Fresh Fruits', 'Dairy Products'],
    certifications: ['Organic Certified', 'FSSAI Approved', 'ISO 22000']
  };

  // Dummy products data
  const products = [
    { id: 1, name: 'Fresh Tomatoes', price: 40, unit: 'kg', status: 'in-stock' },
    { id: 2, name: 'Organic Onions', price: 25, unit: 'kg', status: 'in-stock' },
    { id: 3, name: 'Fresh Carrots', price: 30, unit: 'kg', status: 'low-stock' },
    { id: 4, name: 'Organic Apples', price: 120, unit: 'dozen', status: 'out-of-stock' },
    { id: 5, name: 'Fresh Milk', price: 60, unit: 'liter', status: 'in-stock' },
    { id: 6, name: 'Sweet Bananas', price: 60, unit: 'dozen', status: 'in-stock' },
    { id: 7, name: 'Basmati Rice', price: 80, unit: 'kg', status: 'in-stock' },
    { id: 8, name: 'Green Peas', price: 60, unit: 'kg', status: 'low-stock' }
  ];

  // Sorting/filtering logic
  const filteredProducts = [...products].sort((a, b) => {
    if (sort === 'priceLowHigh') return a.price - b.price;
    if (sort === 'priceHighLow') return b.price - a.price;
    return 0;
  }).filter(p => filter === 'all' ? true : p.status === filter);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  // Badge color helper
  const badgeColor = (score) => {
    if (score >= 4.5) return 'bg-green-100 text-green-800';
    if (score >= 3.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Progress bar color
  const progressColor = (score) => {
    if (score >= 4.5) return 'bg-green-500';
    if (score >= 3.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Star rating rendering
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        ))}
        {halfStar && (
          <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs><linearGradient id="half"><stop offset="50%" stopColor="#facc15"/><stop offset="50%" stopColor="#e5e7eb"/></linearGradient></defs>
            <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        )}
        <span className="ml-2 text-lg font-bold text-gray-900">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Reset page on sort/filter change
  React.useEffect(() => { setPage(1); }, [sort, filter]);

  // Add to cart logic
  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart } });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader cart={cart} showCart={showCart} setShowCart={setShowCart} />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/dashboard/vendor" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{supplier.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Supplier Details */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{supplier.name}</h1>
              
              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {supplier.address}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {supplier.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {supplier.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {supplier.distance} km away
                </div>
              </div>

              {/* Business Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div><span className="font-medium">Type:</span> {supplier.businessType}</div>
                  <div><span className="font-medium">Size:</span> {supplier.farmSize}</div>
                  <div><span className="font-medium">Specializations:</span> {supplier.specializations.join(', ')}</div>
                  <div><span className="font-medium">Certifications:</span> {supplier.certifications.join(', ')}</div>
                </div>
              </div>

              {/* Modern Ratings Card */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Ratings & Performance</h3>
                <div className="flex flex-col items-center mb-4">
                  {renderStars(supplier.rating)}
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">Quality</span>
                      <span className={`font-semibold ${badgeColor(supplier.quality)}`}>{supplier.quality}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className={`h-2 rounded-full ${progressColor(supplier.quality)}`} style={{ width: `${(supplier.quality/5)*100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">Reliability</span>
                      <span className={`font-semibold ${badgeColor(supplier.reliability)}`}>{supplier.reliability}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className={`h-2 rounded-full ${progressColor(supplier.reliability)}`} style={{ width: `${(supplier.reliability/5)*100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">Speed</span>
                      <span className={`font-semibold ${badgeColor(supplier.speed)}`}>{supplier.speed}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className={`h-2 rounded-full ${progressColor(supplier.speed)}`} style={{ width: `${(supplier.speed/5)*100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Products */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Available Products</h2>
                <div className="flex gap-2">
                  <select value={sort} onChange={e => setSort(e.target.value)} className="border rounded px-3 py-2 text-sm">
                    <option value="priceLowHigh">Price: Low to High</option>
                    <option value="priceHighLow">Price: High to Low</option>
                  </select>
                  <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded px-3 py-2 text-sm">
                    <option value="all">All</option>
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {paginatedProducts.map(product => (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-800">{product.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeColor(product.status === 'in-stock' ? 5 : product.status === 'low-stock' ? 3 : 1)}`}>
                        {product.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 mb-3">₹{product.price} / {product.unit}</div>
                    <button
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm font-medium">Page {page} of {totalPages}</span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Checkout */}
      {cart.length > 0 && (
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
                  {cart.map(item => (
                    <span key={item.id} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm mr-2 mb-1">
                      {item.name} x{item.quantity}
                      <button 
                        onClick={() => removeFromCart(item.id)}
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
                  <div className="text-xl font-bold text-gray-900">₹{totalPrice.toFixed(2)}</div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <span>Checkout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierPublicView; 