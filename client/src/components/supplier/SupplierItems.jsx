import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import SupplierHeader from "./SupplierHeader";
import { useSupplierStore } from "../../stores/useSupplierStore";

const SupplierItems = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Use supplier store
  const {
    inventory: items,
    loading,
    error,
    fetchInventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  } = useSupplierStore();

  // Fetch inventory data on component mount
  useEffect(() => {
    if (user?.id) {
      fetchInventory(user.id, user.token);
    }
  }, [user, fetchInventory]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    unit: "kg",
    category: "Vegetables",
  });

  const handleAddItem = async () => {
    if (formData.name && formData.price && formData.quantity) {
      try {
        const newItem = {
          name: formData.name,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          unit: formData.unit,
          category: formData.category,
        };
        await addInventoryItem(user.id, newItem, user.token);
        setFormData({
          name: "",
          price: "",
          quantity: "",
          unit: "kg",
          category: "Vegetables",
        });
        setShowAddForm(false);
      } catch (error) {
        alert("Failed to add item: " + error.message);
      }
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      quantity: item.quantity.toString(),
      unit: item.unit,
      category: item.category,
    });
    setShowAddForm(true);
  };

  const handleUpdateItem = async () => {
    if (formData.name && formData.price && formData.quantity) {
      try {
        const updatedItem = {
          name: formData.name,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          unit: formData.unit,
          category: formData.category,
        };
        await updateInventoryItem(
          user.id,
          editingItem.id,
          updatedItem,
          user.token
        );
        setFormData({
          name: "",
          price: "",
          quantity: "",
          unit: "kg",
          category: "Vegetables",
        });
        setEditingItem(null);
        setShowAddForm(false);
      } catch (error) {
        alert("Failed to update item: " + error.message);
      }
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteInventoryItem(user.id, id, user.token);
      } catch (error) {
        alert("Failed to delete item: " + error.message);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      price: "",
      quantity: "",
      unit: "kg",
      category: "Vegetables",
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SupplierHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("supplier.manageItemsTitle")}
            </h1>
            <p className="text-gray-600">
              Manage your inventory items and track their availability
            </p>
          </div>

          {/* Add Item Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-400 to-blue-800 hover:from-blue-500 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {t("supplier.addNewItem")}
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingItem
                  ? t("supplier.editItem")
                  : t("supplier.addNewItem")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder={t("supplier.itemName")}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="number"
                  placeholder={`${t("supplier.price")} (₹)`}
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="number"
                  placeholder={t("supplier.quantity")}
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <select
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="kg">{t("supplier.kg")}</option>
                  <option value="dozen">{t("supplier.dozen")}</option>
                  <option value="pieces">{t("supplier.pieces")}</option>
                  <option value="liters">{t("supplier.liters")}</option>
                </select>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Vegetables">{t("supplier.vegetables")}</option>
                  <option value="Fruits">{t("supplier.fruits")}</option>
                  <option value="Dairy">{t("supplier.dairy")}</option>
                  <option value="Grains">{t("supplier.grains")}</option>
                </select>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                >
                  {editingItem ? t("common.save") : t("common.add")}
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  {t("common.cancel")}
                </button>
              </div>
            </div>
          )}

          {/* Items Table */}
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {t("supplier.inventoryItems")}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("supplier.itemName")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("supplier.category")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("supplier.price")} (₹)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("supplier.quantity")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("supplier.unit")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("supplier.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ₹{item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="text-blue-600 hover:text-blue-900 mr-4 transition-colors duration-150"
                        >
                          {t("common.edit")}
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-150"
                        >
                          {t("common.delete")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {items.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-500">
                Start by adding your first inventory item.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SupplierItems;
