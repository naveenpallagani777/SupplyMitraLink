import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import ScrollToTop from "./components/common/ScrollToTop";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import SupplierDashboard from "./components/supplier/SupplierDashboard";
import VendorDashboard from "./components/vendor/VendorDashboard";
import SupplierItems from "./components/supplier/SupplierItems";
import PriceWarnings from "./components/supplier/PriceWarnings";
import Feedback from "./components/feedback/Feedback";
import Checkout from "./components/orders/Checkout";
import OrderConfirmation from "./components/orders/OrderConfirmation";
import SupplierProfile from "./components/supplier/SupplierProfile";
import VendorProfile from "./components/vendor/VendorProfile";
import SupplierPublicView from "./components/vendor/SupplierPublicView";
import PredictionPage from "./pages/PredictionPage";
import "./i18n";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard/supplier"
            element={
              <ProtectedRoute role="supplier">
                <SupplierDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/vendor"
            element={
              <ProtectedRoute role="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/items"
            element={
              <ProtectedRoute role="supplier">
                <SupplierItems />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts/price-warnings"
            element={
              <ProtectedRoute role="supplier">
                <PriceWarnings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <ProtectedRoute role="vendor">
                <Feedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute role="vendor">
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute role="vendor">
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors/:supplierName/public"
            element={
              <ProtectedRoute>
                <SupplierPublicView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/:supplierName"
            element={
              <ProtectedRoute role="vendor">
                <SupplierProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/vendor"
            element={
              <ProtectedRoute role="vendor">
                <VendorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/supplier"
            element={
              <ProtectedRoute role="supplier">
                <SupplierProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prediction"
            element={
              <ProtectedRoute role="vendor">
                <PredictionPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
