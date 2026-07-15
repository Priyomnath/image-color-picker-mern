import { Navbar, Container, Nav } from "react-bootstrap";

// 14/07/2026
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function NavbarComponent() {
  // 14/07/2026
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-dark", "text-white");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("bg-dark", "text-white");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (
    <Navbar
      bg={darkMode ? "dark" : "white"}
      variant={darkMode ? "dark" : "light"}
      expand="lg"
      className="shadow-sm py-3"
    >
      <Container>
        <Navbar.Brand>
          <h3 className="fw-bold text-primary">Color Picker</h3>
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/">
              Extract
            </Nav.Link>

            <Nav.Link as={Link} to="/my-palettes">
              My Palettes
            </Nav.Link>

            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>

            {/* // 14/07/2026 */}
            <button
              className="btn btn-secondary me-2"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
