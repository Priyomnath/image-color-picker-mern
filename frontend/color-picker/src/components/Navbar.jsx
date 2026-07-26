import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function NavbarComponent() {
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className={`navbar-component py-2 py-lg-3 ${
        darkMode ? "bg-dark navbar-dark" : "bg-white navbar-light"
      }`}
      style={{
        borderBottom: darkMode
          ? "1px solid #343a40"
          : "1px solid #e9ecef",
        zIndex: 1030,
      }}
    >
      <Container>

        {/* ================================= */}
        {/* BRAND */}
        {/* ================================= */}

        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2"
        >
          {/* Logo */}

          <div
            className="navbar-logo rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "42px",
              height: "42px",
              background:
                "linear-gradient(135deg, #6f42c1, #0d6efd)",
              fontSize: "22px",
            }}
          >
            🎨
          </div>

          {/* Brand Text */}

          <div className="navbar-brand-text">
            <div className="fw-bold fs-5">
              Color Picker
            </div>

            <small
              className={
                darkMode
                  ? "text-secondary"
                  : "text-muted"
              }
            >
              Extract colors from images
            </small>
          </div>
        </Navbar.Brand>

        {/* ================================= */}
        {/* MOBILE TOGGLE */}
        {/* ================================= */}

        <Navbar.Toggle
          aria-controls="main-navbar"
          className="border-0 shadow-none"
        />

        {/* ================================= */}
        {/* NAVBAR COLLAPSE */}
        {/* ================================= */}

        <Navbar.Collapse id="main-navbar">

          <Nav className="ms-auto align-items-lg-center gap-lg-2 navbar-nav-custom">

            {/* ================================= */}
            {/* HOME */}
            {/* ================================= */}

            <Nav.Link
              as={Link}
              to="/"
              className={`navbar-link px-3 rounded-3 ${
                isActive("/")
                  ? "active fw-semibold"
                  : ""
              }`}
            >
              Home
            </Nav.Link>

            {/* ================================= */}
            {/* EXTRACT COLORS */}
            {/* ================================= */}

            <Nav.Link
              as={Link}
              to="/extract-colors-from-image"
              className={`navbar-link px-3 rounded-3 ${
                isActive("/extract-colors-from-image")
                  ? "active fw-semibold"
                  : ""
              }`}
            >
              Extract Colors
            </Nav.Link>

            {/* ================================= */}
            {/* PALETTE GENERATOR */}
            {/* ================================= */}

            <Nav.Link
              as={Link}
              to="/color-palette-generator"
              className={`navbar-link px-3 rounded-3 ${
                isActive("/color-palette-generator")
                  ? "active fw-semibold"
                  : ""
              }`}
            >
              Palette Generator
            </Nav.Link>

            {/* ================================= */}
            {/* MY PALETTES */}
            {/* ================================= */}

            <Nav.Link
              as={Link}
              to="/my-palettes"
              className={`navbar-link px-3 rounded-3 ${
                isActive("/my-palettes")
                  ? "active fw-semibold"
                  : ""
              }`}
            >
              My Palettes
            </Nav.Link>

            {/* ================================= */}
            {/* LOGIN */}
            {/* ================================= */}

            <Nav.Link
              as={Link}
              to="/login"
              className={`navbar-link px-3 rounded-3 ${
                isActive("/login")
                  ? "active fw-semibold"
                  : ""
              }`}
            >
              Login
            </Nav.Link>

            {/* ================================= */}
            {/* DESKTOP DIVIDER */}
            {/* ================================= */}

            <div
              className="navbar-divider d-none d-lg-block mx-1"
              style={{
                height: "28px",
                width: "1px",
                backgroundColor: darkMode
                  ? "#495057"
                  : "#dee2e6",
              }}
            />

            {/* ================================= */}
            {/* THEME TOGGLE */}
            {/* ================================= */}

            <button
              type="button"
              className={`btn navbar-theme-btn rounded-pill px-3 ${
                darkMode
                  ? "btn-outline-light"
                  : "btn-outline-dark"
              }`}
              onClick={toggleTheme}
            >
              {darkMode
                ? "☀️ Light"
                : "🌙 Dark"}
            </button>

            {/* ================================= */}
            {/* LOGOUT */}
            {/* ================================= */}

            <button
              type="button"
              className="btn navbar-logout-btn btn-danger rounded-pill px-3"
              onClick={logout}
            >
              Logout
            </button>

          </Nav>

        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default NavbarComponent;