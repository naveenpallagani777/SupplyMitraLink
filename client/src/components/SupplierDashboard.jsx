import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import SupplierHeader from './SupplierHeader';
import SupplierMap from './SupplierMap';

const SupplierDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for dashboard
  const stats = [
    {
      title: t('supplier.totalSales'),
      value: '₹45,230',
      change: '+12.5%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: t('supplier.successfulDeliveries'),
      value: '156',
      change: '+8.2%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: t('supplier.pendingOrders'),
      value: '23',
      change: '-3.1%',
      changeType: 'negative',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: t('supplier.confirmedOrders'),
      value: '8',
      change: '+15.3%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  // Mock orders data with updated workflow
  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: 'Rajesh Kumar',
      items: ['Tomatoes', 'Onions', 'Potatoes'],
      total: '₹1,250',
      distance: '2.3 km',
      status: 'pending',
      isLocal: true,
      address: '123 Main Street, City Center',
      phone: '+91 98765 43210',
      orderTime: '2 hours ago'
    },
    {
      id: 2,
      customerName: 'Priya Sharma',
      items: ['Milk', 'Bread', 'Eggs'],
      total: '₹890',
      distance: '4.1 km',
      status: 'confirmed',
      isLocal: true,
      address: '456 Park Avenue, Downtown',
      phone: '+91 98765 43211',
      orderTime: '1 hour ago'
    },
    {
      id: 3,
      customerName: 'Amit Patel',
      items: ['Rice', 'Wheat', 'Sugar'],
      total: '₹2,100',
      distance: '7.2 km',
      status: 'order-received',
      isLocal: false,
      address: '789 Industrial Area, Suburb',
      phone: '+91 98765 43212',
      orderTime: '3 hours ago'
    },
    {
      id: 4,
      customerName: 'Sita Devi',
      items: ['Apples', 'Bananas', 'Oranges'],
      total: '₹1,450',
      distance: '3.8 km',
      status: 'packed',
      isLocal: true,
      address: '321 Garden Road, Residential Area',
      phone: '+91 98765 43213',
      orderTime: '30 minutes ago'
    },
    {
      id: 5,
      customerName: 'Ramesh Singh',
      items: ['Fresh Vegetables', 'Dairy Products'],
      total: '₹1,800',
      distance: '1.5 km',
      status: 'in-transit',
      isLocal: true,
      address: '654 Local Market, City Center',
      phone: '+91 98765 43214',
      orderTime: '45 minutes ago'
    },
    {
      id: 6,
      customerName: 'Lakshmi Devi',
      items: ['Organic Fruits', 'Fresh Milk'],
      total: '₹2,300',
      distance: '5.2 km',
      status: 'out-for-delivery',
      isLocal: false,
      address: '987 Organic Store, Suburb',
      phone: '+91 98765 43215',
      orderTime: '1 hour ago'
    }
  ]);

  const quickActions = [
    {
      title: t('supplier.manageItems'),
      description: t('supplier.addEditRemove'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      link: '/supplier/items',
      color: 'bg-blue-500'
    },
    {
      title: t('supplier.viewManageWarnings'),
      description: t('supplier.priceWarningAlerts'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      link: '/alerts/price-warnings',
      color: 'bg-orange-500'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'order-received': return 'bg-green-100 text-green-800';
      case 'packed': return 'bg-purple-100 text-purple-800';
      case 'in-transit': return 'bg-orange-100 text-orange-800';
      case 'out-for-delivery': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'order-received': return 'Order Received';
      case 'packed': return 'Packed';
      case 'in-transit': return 'In Transit';
      case 'out-for-delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const handleOrderAction = (orderId, action) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          let newStatus = order.status;
          switch (action) {
            case 'accept':
              newStatus = 'order-received';
              break;
            case 'reject':
              newStatus = 'cancelled';
              break;
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
      case 'accept':
        alert('Order accepted and moved to active orders!');
        break;
      case 'reject':
        alert('Order rejected!');
        break;
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

  const localOrders = orders.filter(order => order.isLocal);
  const otherOrders = orders.filter(order => !order.isLocal);
  const confirmedOrders = orders.filter(order => order.status === 'confirmed');
  const activeOrders = orders.filter(order => 
    ['order-received', 'packed', 'in-transit', 'out-for-delivery'].includes(order.status)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SupplierHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t('common.welcome')}, {user?.name || 'Supplier'}! 👋
          </h2>
          <p className="text-gray-600">
            {t('supplier.monthlySalesOverview')}
          </p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 md:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <div className="text-blue-600">
                        {stat.icon}
                      </div>
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
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
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
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('local')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'local'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('supplier.localOrders')} ({localOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'confirmed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('supplier.confirmedOrders')} ({confirmedOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Orders ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('supplier.otherOrders')} ({otherOrders.length})
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('supplier.quickActions')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 group"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <div className="text-white">
                            {action.icon}
                          </div>
                        </div>
                        <div className="ml-3 md:ml-4">
                          <h4 className="text-base md:text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {action.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Map View Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('supplier.mapView')}
              </h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <SupplierMap orders={orders} />
              </div>
            </div>
          </>
        )}

        {/* Orders Lists */}
        {(activeTab === 'local' || activeTab === 'confirmed' || activeTab === 'active' || activeTab === 'all') && (
          <div className="space-y-4">
            {(() => {
              let filteredOrders = [];
              if (activeTab === 'local') filteredOrders = localOrders;
              else if (activeTab === 'confirmed') filteredOrders = confirmedOrders;
              else if (activeTab === 'active') filteredOrders = activeOrders;
              else filteredOrders = otherOrders;

              return filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {order.customerName}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.isLocal ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.distance}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Items:</strong> {order.items.join(', ')}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Total:</strong> {order.total}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Address:</strong> {order.address}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Phone:</strong> {order.phone}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Ordered {order.orderTime}
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleOrderAction(order.id, 'accept')}
                            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            Accept Order
                          </button>
                          <button
                            onClick={() => handleOrderAction(order.id, 'reject')}
                            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            Reject Order
                          </button>
                        </>
                      )}
                      {order.status === 'order-received' && (
                        <button
                          onClick={() => handleOrderAction(order.id, 'pack')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Mark as Packed
                        </button>
                      )}
                      {order.status === 'packed' && (
                        <button
                          onClick={() => handleOrderAction(order.id, 'start-transit')}
                          className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
                        >
                          Start Transit
                        </button>
                      )}
                      {order.status === 'in-transit' && (
                        <button
                          onClick={() => handleOrderAction(order.id, 'out-delivery')}
                          className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
                        >
                          Out for Delivery
                        </button>
                      )}
                      {order.status === 'out-for-delivery' && (
                        <button
                          onClick={() => handleOrderAction(order.id, 'mark-delivered')}
                          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </main>
    </div>
  );
};

export default SupplierDashboard;