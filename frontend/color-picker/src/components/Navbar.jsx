import { Navbar, Container, Nav } from "react-bootstrap";

function NavbarComponent() {
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand>
          <h3 className="fw-bold text-primary">Color Picker</h3>
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link>Home</Nav.Link>

            <Nav.Link>Extract</Nav.Link>

            <Nav.Link>Saved</Nav.Link>

            <Nav.Link>Login</Nav.Link>

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
