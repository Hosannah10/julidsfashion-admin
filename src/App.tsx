import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Hamburger from "./components/Hamburger";
import Login from "./pages/Login/Login";
import AddWears from "./pages/Wears/AddWears";
import AddedWears from "./pages/Wears/AddedWears";
import ShopOrders from "./pages/Orders/ShopOrders";
import CustomOrders from "./pages/Orders/CustomOrders";
import ShopOrderReport from "./pages/Reports/ShopOrderReport";
import CustomOrderReport from "./pages/Reports/CustomOrderReport";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

const App: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWears, setShowWears] = useState(true);
  const [showOrders, setShowOrders] = useState(true);
  const [showReports, setShowReports] = useState(true);
  
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleWears = () => setShowWears((prev) => !prev);
  const toggleOrders = () => setShowOrders((prev) => !prev);
  const toggleReports = () => setShowReports((prev) => !prev);

  return (
    <div className="app-layout">

      {/* 🔥 Hide sidebar + hamburger on login */}
      {!isLoginPage && (
        <>
          <Sidebar
            open={sidebarOpen}
            toggleSidebar={toggleSidebar}
            toggleWears={toggleWears}
            toggleOrders={toggleOrders}
            toggleReports={toggleReports}
            showWears={showWears}
            showOrders={showOrders}
            showReports={showReports}
          />
          <Hamburger open={sidebarOpen} onToggle={toggleSidebar} />
        </>
      )}

      <main className="content-area">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/add-wears" element={
            <ProtectedRoute>
            <AddWears />
            </ProtectedRoute>
            } />
          <Route path="/added-wears" element={
            <ProtectedRoute>
            <AddedWears />
            </ProtectedRoute>
            } />
          <Route path="/shop-orders" element={
            <ProtectedRoute>
            <ShopOrders />
            </ProtectedRoute>
            } />
          <Route path="/custom-orders" element={
            <ProtectedRoute>
            <CustomOrders />
            </ProtectedRoute>
            } />
          <Route path="/shop-order-report" element={
            <ProtectedRoute>
            <ShopOrderReport />
            </ProtectedRoute>
            } />
          <Route path="/custom-order-report" element={
            <ProtectedRoute>
            <CustomOrderReport />
            </ProtectedRoute>
            } />
        </Routes>
      </main>
    </div>
  );
};

export default App;
