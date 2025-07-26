import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SupplierHeader from './SupplierHeader';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../hooks/useAuth';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SupplierProfile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [cart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showTrackOrder, setShowTrackOrder] = useState(null);
  const [editForm, setEditForm] = useState({
    name: 'Fresh Farm Supplies',
    email: 'supplier@freshfarm.com',
    phone: '+91 98765 12345',
    address: 'Farm Road, Bangalore Rural, Karnataka 562123',
    businessType: 'Agricultural Farm',
    farmSize: '25 acres',
    specializations: ['Organic Vegetables', 'Fresh Fruits', 'Dairy Products'],
    certifications: ['Organic Certified', 'FSSAI Approved', 'ISO 22000']
  });

  // Mock supplier profile data
  const supplierProfile = {
    name: 'Fresh Farm Supplies',
    email: 'supplier@freshfarm.com',
    phone: '+91 98765 12345',
    address: 'Farm Road, Bangalore Rural, Karnataka 562123',
    businessType: 'Agricultural Farm',
    registrationDate: '2022-06-10',
    totalOrders: 89,
    totalEarnings: 125000,
    averageOrderValue: 1404,
    rating: 4.5,
    reviews: 67,
    farmSize: '25 acres',
    specializations: ['Organic Vegetables', 'Fresh Fruits', 'Dairy Products'],
    certifications: ['Organic Certified', 'FSSAI Approved', 'ISO 22000']
  };

  // Mock orders data with updated status workflow
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      vendor: 'Fresh Market Vendor',
      items: [
        { name: 'Fresh Tomatoes', quantity: 10, unit: 'kg', price: 40 },
        { name: 'Organic Onions', quantity: 5, unit: 'kg', price: 25 }
      ],
      totalAmount: 525,
      orderDate: '2024-01-20',
      expectedDelivery: '2024-01-22',
      status: 'order-received',
      vendorPhone: '+91 98765 43210',
      vendorAddress: '123 Market Street, Bangalore'
    },
    {
      id: 'ORD002',
      vendor: 'Green Restaurant',
      items: [
        { name: 'Fresh Carrots', quantity: 8, unit: 'kg', price: 30 },
        { name: 'Green Peas', quantity: 3, unit: 'kg', price: 60 }
      ],
      totalAmount: 420,
      orderDate: '2024-01-19',
      expectedDelivery: '2024-01-21',
      status: 'packed',
      vendorPhone: '+91 98765 67890',
      vendorAddress: '456 Restaurant Road, Bangalore'
    },
    {
      id: 'ORD003',
      vendor: 'Organic Cafe',
      items: [
        { name: 'Organic Apples', quantity: 6, unit: 'dozen', price: 120 },
        { name: 'Fresh Milk', quantity: 10, unit: 'liters', price: 60 }
      ],
      totalAmount: 1200,
      orderDate: '2024-01-18',
      expectedDelivery: '2024-01-20',
      status: 'in-transit',
      vendorPhone: '+91 98765 11111',
      vendorAddress: '789 Cafe Street, Bangalore'
    },
    {
      id: 'ORD004',
      vendor: 'Local Grocery Store',
      items: [
        { name: 'Fresh Potatoes', quantity: 15, unit: 'kg', price: 35 },
        { name: 'Fresh Milk', quantity: 5, unit: 'liters', price: 60 }
      ],
      totalAmount: 825,
      orderDate: '2024-01-17',
      expectedDelivery: '2024-01-19',
      status: 'out-for-delivery',
      vendorPhone: '+91 98765 22222',
      vendorAddress: '321 Grocery Lane, Bangalore'
    },
    {
      id: 'ORD005',
      vendor: 'Farm Fresh Market',
      items: [
        { name: 'Organic Bananas', quantity: 8, unit: 'dozen', price: 80 },
        { name: 'Fresh Eggs', quantity: 10, unit: 'dozen', price: 120 }
      ],
      totalAmount: 1600,
      orderDate: '2024-01-16',
      expectedDelivery: '2024-01-18',
      status: 'delivered',
      vendorPhone: '+91 98765 33333',
      vendorAddress: '654 Market Road, Bangalore'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'order-received': return 'bg-blue-100 text-blue-800';
      case 'packed': return 'bg-yellow-100 text-yellow-800';
      case 'in-transit': return 'bg-orange-100 text-orange-800';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'order-received': return 'Order Received';
      case 'packed': return 'Packed';
      case 'in-transit': return 'In Transit';
      case 'out-for-delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleEditProfile = () => {
    setEditForm({
      name: supplierProfile.name,
      email: supplierProfile.email,
      phone: supplierProfile.phone,
      address: supplierProfile.address,
      businessType: supplierProfile.businessType,
      farmSize: supplierProfile.farmSize,
      specializations: supplierProfile.specializations,
      certifications: supplierProfile.certifications
    });
    setShowEditProfile(true);
  };

  const handleSaveProfile = () => {
    alert(t('supplier.profileUpdated'));
    setShowEditProfile(false);
  };

  const handleCancelEdit = () => {
    setShowEditProfile(false);
  };

  const handleCloseTrack = () => {
    setShowTrackOrder(null);
  };

  const handleOrderAction = (orderId, action) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          let newStatus = order.status;
          switch (action) {
            case 'pack':
              newStatus = 'packed';
              break;
            case 'start-transit':
              newStatus = 'in-transit';
              break;
            case 'out-delivery':
              newStatus = 'out-for-delivery';
              break;
            case 'mark-delivered':
              newStatus = 'delivered';
              break;
            default:
              break;
          }
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
    
    // Show success message
    switch (action) {
      case 'pack':
        alert('Order marked as packed!');
        break;
      case 'start-transit':
        alert('Order marked as in transit!');
        break;
      case 'out-delivery':
        alert('Order marked as out for delivery!');
        break;
      case 'mark-delivered':
        alert('Order marked as delivered!');
        break;
      default:
        break;
    }
  };

  const quickActions = [
    {
      title: t('supplier.editProfile'),
      description: t('supplier.updateProfileInfo'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      action: handleEditProfile,
      color: 'bg-blue-500'
    },
    {
      title: t('supplier.viewOrders'),
      description: t('supplier.manageIncomingOrders'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      action: () => setActiveTab('orders'),
      color: 'bg-purple-500'
    },
    {
      title: t('common.dashboard'),
      description: t('supplier.backToDashboard'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      ),
      action: () => window.location.href = '/dashboard/supplier',
      color: 'bg-orange-500'
    }
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'orders') return order.status !== 'delivered';
    if (activeTab === 'history') return order.status === 'delivered';
    return true;
  });

  // Vendor read-only view
  if (user && user.role === 'vendor') {
    return (
      <div className="min-h-screen bg-gray-50">
        <SupplierHeader cart={cart} showCart={showCart} setShowCart={setShowCart} />
        <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {t('supplier.profile')} 👨‍🌾
            </h2>
            <p className="text-gray-600">{t('supplier.supplierInfoForVendor')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{supplierProfile.name}</h3>
            <p className="text-gray-700 mb-2">{supplierProfile.address}</p>
            <p className="text-gray-700 mb-2">{supplierProfile.phone}</p>
            <p className="text-gray-700 mb-2">{supplierProfile.email}</p>
            <p className="text-gray-700 mb-2">{t('supplier.businessType')}: {supplierProfile.businessType}</p>
            <p className="text-gray-700 mb-2">{t('supplier.farmSize')}: {supplierProfile.farmSize}</p>
            <p className="text-gray-700 mb-2">{t('supplier.specializations')}: {supplierProfile.specializations.join(', ')}</p>
            <p className="text-gray-700 mb-2">{t('supplier.certifications')}: {supplierProfile.certifications.join(', ')}</p>
            <p className="text-gray-700 mb-2">{t('supplier.rating')}: {supplierProfile.rating} ⭐</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SupplierHeader cart={cart} showCart={showCart} setShowCart={setShowCart} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t('supplier.profile')} 👨‍🌾
          </h2>
          <p className="text-gray-600">
            {t('supplier.manageProfileOrders')}
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('supplier.profile')}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('supplier.activeOrders')} ({orders.filter(o => o.status !== 'delivered').length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('supplier.orderHistory')} ({orders.filter(o => o.status === 'delivered').length})
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'profile' && (
          <>
            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('supplier.quickActions')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 group text-left"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <div className="text-white">
                            {action.icon}
                          </div>
                        </div>
                        <div className="ml-3 md:ml-4">
                          <h4 className="text-base md:text-lg font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                            {action.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-4 md:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3 md:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{t('supplier.totalOrders')}</dt>
                        <dd className="text-xl md:text-2xl font-semibold text-gray-900">{supplierProfile.totalOrders}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-4 md:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3 md:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{t('supplier.totalEarnings')}</dt>
                        <dd className="text-xl md:text-2xl font-semibold text-gray-900">₹{supplierProfile.totalEarnings.toLocaleString()}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-4 md:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3 md:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{t('supplier.rating')}</dt>
                        <dd className="text-xl md:text-2xl font-semibold text-gray-900">{supplierProfile.rating}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-4 md:p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3 md:ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{t('supplier.avgOrderValue')}</dt>
                        <dd className="text-xl md:text-2xl font-semibold text-gray-900">₹{supplierProfile.averageOrderValue}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">{t('supplier.profileDetails')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">{t('supplier.personalInfo')}</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('supplier.name')}</label>
                      <p className="text-sm text-gray-900 mt-1">{supplierProfile.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('supplier.email')}</label>
                      <p className="text-sm text-gray-900 mt-1">{supplierProfile.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('supplier.phone')}</label>
                      <p className="text-sm text-gray-900 mt-1">{supplierProfile.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('supplier.address')}</label>
                      <p className="text-sm text-gray-900 mt-1">{supplierProfile.address}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">{t('supplier.businessInfo')}</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('supplier.businessType')}</label>
                      <p className="text-sm text-gray-900 mt-1">{supplierProfile.businessType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('supplier.farmSize')}</label>
                      <p className="text-sm text-gray-900 mt-1">{supplierProfile.farmSize}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('supplier.registrationDate')}</label>
                      <p className="text-sm text-gray-900 mt-1">{supplierProfile.registrationDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('supplier.specializations')}</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {supplierProfile.specializations.map((spec, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">{t('supplier.certifications')}</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {supplierProfile.certifications.map((cert, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={handleEditProfile}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                >
                  {t('supplier.editProfile')}
                </button>
              </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditProfile && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{t('supplier.editProfile')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('supplier.name')}</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('supplier.email')}</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('supplier.phone')}</label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('supplier.address')}</label>
                        <textarea
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('supplier.businessType')}</label>
                        <select
                          value={editForm.businessType}
                          onChange={(e) => setEditForm({ ...editForm, businessType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="Agricultural Farm">Agricultural Farm</option>
                          <option value="Dairy Farm">Dairy Farm</option>
                          <option value="Poultry Farm">Poultry Farm</option>
                          <option value="Organic Farm">Organic Farm</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('supplier.farmSize')}</label>
                        <input
                          type="text"
                          value={editForm.farmSize}
                          onChange={(e) => setEditForm({ ...editForm, farmSize: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                      >
                        {t('common.save')}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Orders Tab */}
        {(activeTab === 'orders' || activeTab === 'history') && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {activeTab === 'orders' ? t('supplier.activeOrders') : t('supplier.orderHistory')}
              </h3>
            </div>
            
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{order.vendor}</h4>
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-lg font-bold text-gray-900">₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">{t('supplier.orderItems')}</h5>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-900">{item.name}</span>
                        <span className="text-gray-500">
                          {item.quantity} {item.unit} × ₹{item.price} = ₹{item.quantity * item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('supplier.orderDate')}</label>
                    <p className="text-sm text-gray-900 mt-1">{order.orderDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('supplier.expectedDelivery')}</label>
                    <p className="text-sm text-gray-900 mt-1">{order.expectedDelivery}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {order.status === 'order-received' && (
                    <button 
                      onClick={() => handleOrderAction(order.id, 'pack')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Mark as Packed
                    </button>
                  )}
                  {order.status === 'packed' && (
                    <button 
                      onClick={() => handleOrderAction(order.id, 'start-transit')}
                      className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors duration-200"
                    >
                      Start Transit
                    </button>
                  )}
                  {order.status === 'in-transit' && (
                    <button 
                      onClick={() => handleOrderAction(order.id, 'out-delivery')}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors duration-200"
                    >
                      Out for Delivery
                    </button>
                  )}
                  {order.status === 'out-for-delivery' && (
                    <button 
                      onClick={() => handleOrderAction(order.id, 'mark-delivered')}
                      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'orders' ? t('supplier.noActiveOrders') : t('supplier.noOrderHistory')}
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'orders' ? t('supplier.waitingForOrders') : t('supplier.noCompletedOrders')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Order Tracking Modal */}
        {showTrackOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('supplier.trackOrder')} #{showTrackOrder}
                  </h3>
                  <button
                    onClick={handleCloseTrack}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="h-96 mb-4">
                  <MapContainer
                    center={[12.9716, 77.5946]}
                    zoom={10}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {/* Supplier Location */}
                    <Marker position={[12.9716, 77.5946]}>
                      <Popup>
                        <div>
                          <h4 className="font-medium">Supplier Location</h4>
                          <p className="text-sm text-gray-600">Fresh Farm Supplies</p>
                        </div>
                      </Popup>
                    </Marker>
                    {/* Vendor Location */}
                    <Marker position={[12.9716, 77.5946]}>
                      <Popup>
                        <div>
                          <h4 className="font-medium">Vendor Location</h4>
                          <p className="text-sm text-gray-600">Fresh Market Vendor</p>
                        </div>
                      </Popup>
                    </Marker>
                    {/* Route Line */}
                    <Polyline
                      positions={[
                        [12.9716, 77.5946], // Supplier
                        [12.9716, 77.5946]  // Vendor
                      ]}
                      color="blue"
                      weight={3}
                    />
                  </MapContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900">Supplier</h4>
                    <p className="text-sm text-blue-700">Fresh Farm Supplies</p>
                    <p className="text-xs text-blue-600">Farm Road, Bangalore Rural</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900">Current Status</h4>
                    <p className="text-sm text-green-700">Confirmed</p>
                    <p className="text-xs text-green-600">Expected: 2024-01-22</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-900">Vendor</h4>
                    <p className="text-sm text-purple-700">Fresh Market Vendor</p>
                    <p className="text-xs text-purple-600">123 Market Street, Bangalore</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleCloseTrack}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
                  >
                    {t('common.close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SupplierProfile; 