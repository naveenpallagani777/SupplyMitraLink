import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import VendorHeader from './VendorHeader';

const Feedback = () => {
  const { t } = useTranslation();
  const [cart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  
  const [supplierRatings] = useState([
    {
      id: 1,
      supplierName: 'Fresh Farm Supplies',
      averageRating: 4.5,
      totalReviews: 23,
      categories: {
        Quality: 4.6,
        Price: 4.2,
        Delivery: 4.8,
        Communication: 4.4
      },
      recentReviews: [
        { rating: 5, comment: 'Excellent quality vegetables, very fresh!', date: '2024-01-15' },
        { rating: 4, comment: 'Good prices and timely delivery', date: '2024-01-14' }
      ]
    },
    {
      id: 2,
      supplierName: 'Green Valley Produce',
      averageRating: 4.2,
      totalReviews: 18,
      categories: {
        Quality: 4.3,
        Price: 4.0,
        Delivery: 4.1,
        Communication: 4.4
      },
      recentReviews: [
        { rating: 4, comment: 'Good variety of products', date: '2024-01-13' },
        { rating: 5, comment: 'Best tomatoes in the market!', date: '2024-01-12' }
      ]
    },
    {
      id: 3,
      supplierName: 'Organic Harvest Co.',
      averageRating: 4.7,
      totalReviews: 31,
      categories: {
        Quality: 4.8,
        Price: 4.5,
        Delivery: 4.7,
        Communication: 4.6
      },
      recentReviews: [
        { rating: 5, comment: 'Premium quality organic products', date: '2024-01-15' },
        { rating: 4, comment: 'Slightly expensive but worth it', date: '2024-01-14' }
      ]
    }
  ]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader cart={cart} showCart={showCart} setShowCart={setShowCart} />

      <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          {t('common.feedback')} 📝
        </h2>
        <div className="space-y-6">
          {supplierRatings.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{supplier.supplierName}</h4>
                <div className="flex items-center mt-1">
                  <div className="flex items-center">
                    {renderStars(Math.round(supplier.averageRating))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {supplier.averageRating} ({supplier.totalReviews} {t('vendor.reviews')})
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {Object.entries(supplier.categories).map(([category, rating]) => (
                    <div key={category} className="text-center">
                      <div className="text-sm text-gray-600">{t(`vendor.${category.toLowerCase()}`)}</div>
                      <div className="flex justify-center items-center mt-1">
                        {renderStars(Math.round(rating))}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{rating.toFixed(1)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h5 className="text-md font-medium text-gray-900 mb-2">{t('vendor.recentReviews')}</h5>
                  <div className="space-y-2">
                    {supplier.recentReviews.map((review, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-center mb-1">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className="ml-2 text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0 md:ml-8 flex-shrink-0 flex items-center">
                <Link
                  to={`/vendors/${supplier.supplierName}/public`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  {t('vendor.viewDetails')}
                </Link>
              </div>
            </div>
          ))}
          {supplierRatings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('vendor.noSupplierRatings')}</h3>
              <p className="text-gray-500">{t('vendor.beFirstToRate')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Feedback; 