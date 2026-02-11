import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TopNav = () => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSalesDropdown, setShowSalesDropdown] = useState(false);
  const [showPaymentsDropdown, setShowPaymentsDropdown] = useState(false);

  // ✅ Mobile
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSalesOpen, setMobileSalesOpen] = useState(false);
  const [mobilePaymentsOpen, setMobilePaymentsOpen] = useState(false);

  const { logout, getDisplayName } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const navRef = useRef(null);

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    {
      label: "Sales",
      children: [
        { path: "/orders/sales", label: "Orders" },
        { path: "/refunds/sales", label: "Refunds" },
        { path: "/fees/sales", label: "Fees" },
      ],
    },
    {
      label: "Payments",
      children: [
        { path: "/orders/payments", label: "Orders" },
        { path: "/refunds/payments", label: "Refunds" },
        { path: "/fees/payments", label: "Fees" },
      ],
    },
    { path: "/errors", label: "Errors" },
    { path: "/reports", label: "Reports" },
    { path: "/accounting", label: "Accounting" },
  ];

  const userMenuItems = [{ path: "/user-profile", label: "My Profile" }];

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setShowUserDropdown(false);
    setMobileOpen(false);
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    navigate("/login");
  };

  const cancelLogout = () => setShowLogoutConfirm(false);

  // ✅ Cerrar menús al click afuera / ESC
  useEffect(() => {
    const onDown = (e) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target)) {
        setShowUserDropdown(false);
        setShowSalesDropdown(false);
        setShowPaymentsDropdown(false);
        setMobileOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowUserDropdown(false);
        setShowSalesDropdown(false);
        setShowPaymentsDropdown(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const closeAll = () => {
    setShowUserDropdown(false);
    setShowSalesDropdown(false);
    setShowPaymentsDropdown(false);
    setMobileOpen(false);
  };

  // arriba en el componente:
  const salesRef = useRef(null);
  const paymentsRef = useRef(null);
  const [salesPos, setSalesPos] = useState({ left: 0, top: 64 });
  const [paymentsPos, setPaymentsPos] = useState({ left: 0, top: 64 });

  const placeMenu = (ref, setPos) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      left: Math.max(8, Math.min(r.left, window.innerWidth - 220)),
      top: r.bottom,
    });
  };


  return (
    <div className="top-nav" ref={navRef}>
      <div className="logo">AmazonPay Reconciliation</div>

      {/* ✅ Hamburger (solo mobile) */}
      <button
        className="nav-burger"
        aria-label="Open menu"
        onClick={() => setMobileOpen((v) => !v)}
      >
        ☰
      </button>

      {/* ✅ Tabs desktop */}
      <div className="nav-tabs">
        {navItems.map((item) => {
          if (item.label === "Sales") {
            return (
              <div
                key="Sales"
                ref={salesRef}
                className="nav-tab sales-dropdown"
                onMouseEnter={() => {
                  placeMenu(salesRef, setSalesPos);
                  setShowSalesDropdown(true);
                }}
                onMouseLeave={() => setShowSalesDropdown(false)}
              >
                <span>Sales ▾</span>

                {showSalesDropdown && (
                  <div
                    className="dropdown-menu-fixed"
                    style={{ left: salesPos.left, top: salesPos.top }}
                    onMouseEnter={() => setShowSalesDropdown(true)}
                    onMouseLeave={() => setShowSalesDropdown(false)}
                  >
                    {navItems.find(n => n.label === "Sales").children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className="dropdown-item"
                        onClick={() => setShowSalesDropdown(false)}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          if (item.label === "Payments") {
            return (
              <div
                key="Payments"
                ref={paymentsRef}
                className="nav-tab payments-dropdown"
                onMouseEnter={() => {
                  placeMenu(paymentsRef, setPaymentsPos);
                  setShowPaymentsDropdown(true);
                }}
                onMouseLeave={() => setShowPaymentsDropdown(false)}
              >
                <span>Payments ▾</span>

                {showPaymentsDropdown && (
                  <div
                    className="dropdown-menu-fixed"
                    style={{ left: paymentsPos.left, top: paymentsPos.top }}
                    onMouseEnter={() => setShowPaymentsDropdown(true)}
                    onMouseLeave={() => setShowPaymentsDropdown(false)}
                  >
                    {navItems.find(n => n.label === "Payments").children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className="dropdown-item"
                        onClick={() => setShowPaymentsDropdown(false)}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-tab ${isActive ? "active" : ""}`}
              onClick={closeAll}
            >
              {item.label}
            </NavLink>
          );
        })}
      </div>

      {/* USER MENU (desktop) */}
      <div className="user-wrap">
        <div
          className="user-menu"
          onClick={() => setShowUserDropdown((v) => !v)}
        >
          {getDisplayName()}
        </div>

        <div className={`user-dropdown ${showUserDropdown ? "active" : ""}`}>
          {userMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="user-dropdown-item"
              onClick={closeAll}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="user-dropdown-item logout" onClick={handleLogout}>
            Logout
          </div>
        </div>
      </div>

      {/* ✅ Drawer mobile */}
      <div className={`mobile-overlay ${mobileOpen ? "active" : ""}`} onClick={() => setMobileOpen(false)} />

      <aside className={`mobile-drawer ${mobileOpen ? "active" : ""}`}>
        <div className="mobile-drawer-header">
          <div className="mobile-user">{getDisplayName()}</div>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>
            ✕
          </button>
        </div>

        <NavLink to="/dashboard" className="mobile-link" onClick={closeAll}>
          Dashboard
        </NavLink>

        <button className="mobile-accordion" onClick={() => setMobileSalesOpen((v) => !v)}>
          Sales <span>{mobileSalesOpen ? "▴" : "▾"}</span>
        </button>
        {mobileSalesOpen && (
          <div className="mobile-sub">
            <NavLink to="/orders/sales" className="mobile-sublink" onClick={closeAll}>Orders</NavLink>
            <NavLink to="/refunds/sales" className="mobile-sublink" onClick={closeAll}>Refunds</NavLink>
            <NavLink to="/fees/sales" className="mobile-sublink" onClick={closeAll}>Fees</NavLink>
          </div>
        )}

        <button className="mobile-accordion" onClick={() => setMobilePaymentsOpen((v) => !v)}>
          Payments <span>{mobilePaymentsOpen ? "▴" : "▾"}</span>
        </button>
        {mobilePaymentsOpen && (
          <div className="mobile-sub">
            <NavLink to="/orders/payments" className="mobile-sublink" onClick={closeAll}>Orders</NavLink>
            <NavLink to="/refunds/payments" className="mobile-sublink" onClick={closeAll}>Refunds</NavLink>
            <NavLink to="/fees/payments" className="mobile-sublink" onClick={closeAll}>Fees</NavLink>
          </div>
        )}

        <NavLink to="/errors" className="mobile-link" onClick={closeAll}>Errors</NavLink>
        <NavLink to="/reports" className="mobile-link" onClick={closeAll}>Reports</NavLink>
        <NavLink to="/accounting" className="mobile-link" onClick={closeAll}>Accounting</NavLink>

        <div className="mobile-divider" />

        <NavLink to="/user-profile" className="mobile-link" onClick={closeAll}>
          My Profile
        </NavLink>
        <button className="mobile-logout" onClick={handleLogout}>Logout</button>
      </aside>

      {/* Modal logout (igual que tenías) */}
      {showLogoutConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 3000,
          }}
          onClick={cancelLogout}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>Logout</h3>
            <p style={{ margin: "0 0 20px 0" }}>Are you sure you want to logout?</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={{ flex: 1, padding: "10px" }} onClick={cancelLogout}>
                Cancel
              </button>
              <button
                style={{ flex: 1, padding: "10px", background: "#FF6B00", color: "white", border: "none" }}
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNav;
