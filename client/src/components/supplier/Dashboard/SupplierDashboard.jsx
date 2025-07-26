import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useSupplierStore } from '../../../stores/useSupplierStore';
import { useOrderStore } from '../../../stores/useOrderStore';
import SupplierHeader from '../../common/Header/SupplierHeader';
import SupplierMap from '../Map/SupplierMap';
import LoadingSpinner from '../../common/Loading/LoadingSpinner';

const SupplierDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  // Zustand store hooks
  const {
    stats,
    loading: statsLoading,
    error: statsError,
    fetchStats
  } = useSupplierStore();

  const {
    orders,
    activeOrders,
    loading: ordersLoading,
    error: ordersError,
    fetchOrders,
    updateOrderStatus
  } = useOrderStore();

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user?.id) {
        try {
          // Fetch stats and orders in parallel
          await Promise.all([
            fetchStats(user.id, user.token),
            fetchOrders({ supplierId: user.id }, user.token)
          ]);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      }
    };

    fetchDashboardData();
  }, [user?.id, user?.token, fetchStats, fetchOrders]);

  // Loading state
  const isLoading = statsLoading || ordersLoading;

  // Error state
  const hasError = statsError || ordersError;

  // Stats data with fallback
  const dashboardStats = [
    {
      title: t('supplierDashboard.totalSales'),
      value: stats ? `₹${stats.totalEarnings?.toLocaleString() || '0'}` : '₹0',
      change: '+12.5%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: t('supplierDashboard.successfulDeliveries'),
      value: stats?.successfulDeliveries?.toString() || '0',
      change: '+8.2%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: t('supplierDashboard.pendingOrders'),
      value: stats?.pendingOrders?.toString() || '0',
      change: '-3.1%',
      changeType: 'negative',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: t('supplierDashboard.confirmedOrders'),
      value: stats?.confirmedOrders?.toString() || '0',
      change: '+15.3%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const quickActions = [
    {
      title: t('supplierDashboard.manageItems'),
      description: t('supplierDashboard.addEditRemove'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      link: '/supplier/items',
      color: 'bg-blue-500'
    },
    {
      title: t('supplierDashboard.viewManageWarnings'),
      description: t('supplierDashboard.priceWarningAlerts'),
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
      case 'packed': return 'bg-purple-100 text-purple-800';
      case 'in_transit': return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'packed': return 'Packed';
      case 'in_transit': return 'In Transit';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleOrderAction = async (orderId, action) => {
    if (!user?.token) return;

    try {
      let newStatus = '';
      let note = '';

      switch (action) {
        case 'accept':
          newStatus = 'confirmed';
          note = 'Order accepted by supplier';
          break;
        case 'reject':
          newStatus = 'cancelled';
          note = 'Order rejected by supplier';
          break;
        case 'pack':
          newStatus = 'packed';
          note = 'Items packed and ready';
          break;
        case 'start-transit':
          newStatus = 'in_transit';
          note = 'Order picked up for delivery';
          break;
        case 'out-delivery':
          newStatus = 'out_for_delivery';
          note = 'Out for delivery';
          break;
        case 'mark-delivered':
          newStatus = 'delivered';
          note = 'Order delivered successfully';
          break;
        default:
          return;
      }

      await updateOrderStatus(orderId, newStatus, note, user.token);
      
      // Show success message
      const actionMessages = {
        'accept': 'Order accepted and moved to active orders!',
        'reject': 'Order rejected!',
        'pack': 'Order marked as packed!',
        'start-transit': 'Order marked as in transit!',
        'out-delivery': 'Order marked as out for delivery!',
        'mark-delivered': 'Order marked as delivered!'
      };
      
      alert(actionMessages[action] || 'Order status updated!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  // Filter orders based on active tab
  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'local':
        return orders.filter(order => {
          // Mock logic for local orders (within 5km)
          const orderId = parseInt(order.id.split('-')[1]);
          return orderId % 3 === 0; // Simulate local orders
        });
      case 'confirmed':
        return orders.filter(order => order.status === 'confirmed');
      case 'active':
        return activeOrders;
      case 'all':
        return orders.filter(order => {
          // Mock logic for non-local orders
          const orderId = parseInt(order.id.split('-')[1]);
          return orderId % 3 !== 0; // Simulate non-local orders
        });
      default:
        return [];
    }
  };

  const filteredOrders = getFilteredOrders();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SupplierHeader />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="lg" text="Loading dashboard data..." />
        </main>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SupplierHeader />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-red-800">Error Loading Dashboard</h3>
                <p className="text-red-700 mt-1">
                  {statsError || ordersError || 'Failed to load dashboard data. Please refresh the page.'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
            {t('supplierDashboard.monthlySalesOverview')}
          </p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
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
              {t('supplierDashboard.localOrders')} ({orders.filter(o => parseInt(o.id.split('-')[1]) % 3 === 0).length})
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'confirmed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('supplierDashboard.confirmedOrders')} ({stats?.confirmedOrders || 0})
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
              {t('supplierDashboard.otherOrders')} ({orders.filter(o => parseInt(o.id.split('-')[1]) % 3 !== 0).length})
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('supplierDashboard.quickActions')}
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
                {t('supplierDashboard.mapView')}
              </h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <SupplierMap orders={filteredOrders} />
              </div>
            </div>
          </>
        )}

        {/* Orders Lists */}
        {(activeTab === 'local' || activeTab === 'confirmed' || activeTab === 'active' || activeTab === 'all') && (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">
                  {activeTab === 'local' && 'No local orders available.'}
                  {activeTab === 'confirmed' && 'No confirmed orders available.'}
                  {activeTab === 'active' && 'No active orders available.'}
                  {activeTab === 'all' && 'No other orders available.'}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          Order #{order.id}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            parseInt(order.id.split('-')[1]) % 3 === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {parseInt(order.id.split('-')[1]) % 3 === 0 ? 'Local' : 'Remote'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Items:</strong> {order.items.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(', ')}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Total:</strong> ₹{order.totalAmount}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Address:</strong> {order.deliveryAddress}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Expected Delivery: {new Date(order.expectedDelivery).toLocaleDateString()}
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
                      {order.status === 'confirmed' && (
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
                      {order.status === 'in_transit' && (
                        <button
                          onClick={() => handleOrderAction(order.id, 'out-delivery')}
                          className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
                        >
                          Out for Delivery
                        </button>
                      )}
                      {order.status === 'out_for_delivery' && (
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
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SupplierDashboard; 