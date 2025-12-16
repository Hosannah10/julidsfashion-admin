import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../components/styles/Sidebar.css";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, LogOut } from "lucide-react";
import logo from "../assets/JulidsFashionlogo.jpg";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
  toggleWears: () => void;
  toggleOrders: () => void;
  toggleReports: () => void;
  showWears: boolean
  showOrders: boolean;
  showReports: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleSidebar, toggleWears, toggleOrders, toggleReports, showWears, showOrders, showReports }) => {
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();          // clear auth state
    navigate("/");     // redirect to login
  };

  return (
    <aside className={`sidebar ${open ? "open" : "closed"}`}>

      {/* Mobile Close Button */}
      <button className="sidebar-close-btn" onClick={toggleSidebar}>
        ✕
      </button>
      
      <div className="sidebar-top">
        <img src={logo} alt="JulidFashion" className="logo" />
      </div>

      <nav className="sidebar-nav">
        <div className="reports-group">
          <div
            className="reports-title"
            onClick={toggleWears}
            title={!open ? "Wears" : ""}
          >
            <span className="link-text">Wears</span>
            {open && (
              <ChevronDown
                size={18}
                className={`chevron ${showWears ? "rotated" : ""}`}
              />
            )}
          </div>

          {showWears && (
            <div className="reports-links">
              <NavLink
                to="/add-wears"
                className={({ isActive }) => (isActive ? "active" : "")}
                title={!open ? "Add Wears" : ""}
              >
                <span className="link-text">Add Wears</span>
              </NavLink>

              <NavLink
                to="/added-wears"
                className={({ isActive }) => (isActive ? "active" : "")}
                title={!open ? "Added Wears" : ""}
              >
                <span className="link-text">Added Wears</span>
              </NavLink>
            </div>
          )}
        </div>
        
        <div className="reports-group">
          <div
            className="reports-title"
            onClick={toggleOrders}
            title={!open ? "Orders" : ""}
          >
            <span className="link-text">Orders</span>
            {open && (
              <ChevronDown
                size={18}
                className={`chevron ${showOrders ? "rotated" : ""}`}
              />
            )}
          </div>

          {showOrders && (
            <div className="reports-links">
              <NavLink
                to="/shop-orders"
                className={({ isActive }) => (isActive ? "active" : "")}
                title={!open ? "Shop Orders" : ""}
              >
                <span className="link-text">Shop Orders</span>
              </NavLink>
              
              <NavLink
                to="/custom-orders"
                className={({ isActive }) => (isActive ? "active" : "")}
                title={!open ? "Custom Orders" : ""}
              >
                <span className="link-text">Custom Orders</span>
              </NavLink>

            </div>
          )}
        </div>

        
        <div className="reports-group">
          <div
            className="reports-title"
            onClick={toggleReports}
            title={!open ? "Reports" : ""}
          >
            <span className="link-text">Reports</span>
            {open && (
              <ChevronDown
                size={18}
                className={`chevron ${showReports ? "rotated" : ""}`}
              />
            )}
          </div>

          {showReports && (
            <div className="reports-links">

              <NavLink
                to="/shop-order-report"
                className={({ isActive }) => (isActive ? "active" : "")}
                title={!open ? "Shop Order Report" : ""}
              >
                <span className="link-text">Shop Order Report</span>
              </NavLink>

              <NavLink
                to="/custom-order-report"
                className={({ isActive }) => (isActive ? "active" : "")}
                title={!open ? "Custom Order Report" : ""}
              >
                <span className="link-text">Custom Order Report</span>
              </NavLink>

            </div>
          )}
        </div>

        {/* Logout Nav Item */}
        <button
          onClick={handleLogout}
          className="logout-btn"
          title={!open ? "Logout" : ""}
        >
          <LogOut size={18} />
          <span className="link-text">Logout</span>
        </button>
        
      </nav>
    </aside>
  );
};

export default Sidebar;

