import { useState } from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function NavbarComponent() {
  const { darkMode, toggleTheme } = useTheme();
  const { isLoggedIn, logout, user } = useAuth();
  const location = useLocation();

  // Mobile menu state
  const [expanded, setExpanded] = useState(false);

  // =========================================
  // ACTIVE LINK
  // =========================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  // =========================================
  // CLOSE MOBILE MENU
  // =========================================

  const closeMenu = () => {
    setExpanded(false);
  };

  // =========================================
  // USER INFORMATION
  // =========================================

  const userEmail = user?.email || "User";

  // Google normally returns "picture"
  // We also support other possible field names
  const userPicture =
    user?.picture ||
    user?.profilePicture ||
    user?.avatar ||
    user?.image ||
    null;

  // Get first letter for fallback avatar
  const userInitial = userEmail.charAt(0).toUpperCase();

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    closeMenu();

    logout();

    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      sticky="top"
      className={`navbar-component py-2 py-lg-3 ${
        darkMode ? "bg-dark navbar-dark" : "bg-white navbar-light"
      }`}
      style={{
        borderBottom: darkMode ? "1px solid #343a40" : "1px solid #e9ecef",
        zIndex: 1030,
      }}
    >
      <Container>
        {/* ========================================= */}
        {/* BRAND */}
        {/* ========================================= */}

        <Navbar.Brand
          as={Link}
          to="/"
          onClick={closeMenu}
          className="d-flex align-items-center gap-2"
        >
          {/* Logo */}

          <div
            className="navbar-logo rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "42px",
              height: "42px",
              background: "linear-gradient(135deg, #6f42c1, #0d6efd)",
              fontSize: "22px",
            }}
          >
            🎨
          </div>

          {/* Brand Text */}

          <div className="navbar-brand-text">
            <div className="fw-bold fs-5">Color Picker</div>

            <small className={darkMode ? "text-secondary" : "text-muted"}>
              Extract colors from images
            </small>
          </div>
        </Navbar.Brand>

        {/* ========================================= */}
        {/* MOBILE TOGGLE */}
        {/* ========================================= */}

        <Navbar.Toggle
          aria-controls="main-navbar"
          className="border-0 shadow-none"
        />

        {/* ========================================= */}
        {/* NAVBAR MENU */}
        {/* ========================================= */}

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-lg-center gap-lg-2 navbar-nav-custom">
            {/* ========================================= */}
            {/* HOME */}
            {/* ========================================= */}

            <Nav.Link
              as={Link}
              to="/"
              onClick={closeMenu}
              className={`navbar-link px-3 rounded-3 ${
                isActive("/") ? "active fw-semibold" : ""
              }`}
            >
              Home
            </Nav.Link>

            {/* ========================================= */}
            {/* EXTRACT COLORS */}
            {/* ========================================= */}

            <Nav.Link
              as={Link}
              to="/extract-colors-from-image"
              onClick={closeMenu}
              className={`navbar-link px-3 rounded-3 ${
                isActive("/extract-colors-from-image")
                  ? "active fw-semibold"
                  : ""
              }`}
            >
              Extract Colors
            </Nav.Link>

            {/* ========================================= */}
            {/* PALETTE GENERATOR */}
            {/* ========================================= */}

            <Nav.Link
              as={Link}
              to="/color-palette-generator"
              onClick={closeMenu}
              className={`navbar-link px-3 rounded-3 ${
                isActive("/color-palette-generator") ? "active fw-semibold" : ""
              }`}
            >
              Palette Generator
            </Nav.Link>

            {/* ========================================= */}
            {/* MY PALETTES */}
            {/* Only show when logged in */}
            {/* ========================================= */}

            {isLoggedIn && (
              <Nav.Link
                as={Link}
                to="/my-palettes"
                onClick={closeMenu}
                className={`navbar-link px-3 rounded-3 ${
                  isActive("/my-palettes") ? "active fw-semibold" : ""
                }`}
              >
                My Palettes
              </Nav.Link>
            )}

            {/* ========================================= */}
            {/* LOGIN / REGISTER */}
            {/* Only show when logged out */}
            {/* ========================================= */}

            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-primary rounded-pill px-3"
                  onClick={closeMenu}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn btn-primary rounded-pill px-3 ms-lg-2"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}

            {/* ========================================= */}
            {/* DESKTOP DIVIDER */}
            {/* ========================================= */}

            <div
              className="navbar-divider d-none d-lg-block mx-1"
              style={{
                height: "28px",
                width: "1px",
                backgroundColor: darkMode ? "#495057" : "#dee2e6",
              }}
            />

            {/* ========================================= */}
            {/* THEME BUTTON */}
            {/* ========================================= */}

            <button
              type="button"
              className={`btn navbar-theme-btn rounded-pill px-3 ${
                darkMode ? "btn-outline-light" : "btn-outline-dark"
              }`}
              onClick={() => {
                toggleTheme();
                closeMenu();
              }}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            {/* ========================================= */}
            {/* USER PROFILE */}
            {/* Only show when logged in */}
            {/* ========================================= */}

            {/* ========================================= */}
            {/* PROFESSIONAL USER PROFILE */}
            {/* ========================================= */}

            {isLoggedIn && (
              <Dropdown align="end" className="profile-dropdown">
                <Dropdown.Toggle
                  as="button"
                  className="profile-toggle"
                  id="profile-dropdown"
                >
                  <div className="profile-avatar-wrapper">
                    {userPicture ? (
                      <img
                        src={userPicture}
                        alt="Profile"
                        referrerPolicy="no-referrer"
                        className="profile-avatar"
                      />
                    ) : (
                      <div className="profile-avatar profile-fallback">
                        {userInitial}
                      </div>
                    )}

                    {/* Online indicator */}
                    <span className="profile-online-dot"></span>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="profile-menu">
                  {/* Profile Header */}

                  <div className="profile-header">
                    <div className="profile-large-avatar-wrapper">
                      {userPicture ? (
                        <img
                          src={userPicture}
                          alt="Profile"
                          referrerPolicy="no-referrer"
                          className="profile-large-avatar"
                        />
                      ) : (
                        <div className="profile-large-avatar profile-fallback">
                          {userInitial}
                        </div>
                      )}

                      <span className="profile-large-online"></span>
                    </div>

                    <div className="profile-user-info">
                      <div className="profile-name">
                        {user?.name || user?.displayName || "User"}
                      </div>

                      <div className="profile-email" title={userEmail}>
                        {userEmail}
                      </div>

                      <div className="profile-status">
                        <span></span>
                        Logged in
                      </div>
                    </div>
                  </div>

                  <div className="profile-divider"></div>

                  {/* Email */}

                  <div className="profile-email-box">
                    <div className="profile-info-icon">✉</div>

                    <div>
                      <small>Email</small>
                      <div>{userEmail}</div>
                    </div>
                  </div>

                  <div className="profile-divider"></div>

                  {/* Logout */}

                  <Dropdown.Item
                    onClick={handleLogout}
                    className="profile-logout"
                  >
                    <span className="profile-logout-icon">↪</span>
                    <span>Logout</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
