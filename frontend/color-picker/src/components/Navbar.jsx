// import { Navbar, Container, Nav } from "react-bootstrap";
// // 20/07/2026
// //import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// function NavbarComponent() {
//   // 21/07/2026   {time: 12:09 AM}
//   const { darkMode, toggleTheme } = useTheme();

//   // 21/07/2026   {time: 12:07 AM}
//   //START UPDATE
//   import { useTheme } from "../context/ThemeContext";
//   //END UPDATE

//   const logout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");

//     window.location.href = "/login";
//   };

//   return (
//     <Navbar
//       bg={darkMode ? "dark" : "white"}
//       variant={darkMode ? "dark" : "light"}
//       expand="lg"
//       className="shadow-sm py-3"
//     >
//       <Container>
//         <Navbar.Brand>
//           <h3 className="fw-bold text-primary">Color Picker</h3>
//         </Navbar.Brand>

//         <Navbar.Toggle />

//         <Navbar.Collapse>
//           <Nav className="ms-auto">
//             <Nav.Link as={Link} to="/">
//               Home
//             </Nav.Link>

//             <Nav.Link as={Link} to="/">
//               Extract
//             </Nav.Link>

//             <Nav.Link as={Link} to="/my-palettes">
//               My Palettes
//             </Nav.Link>

//             <Nav.Link as={Link} to="/login">
//               Login
//             </Nav.Link>

//             {/* // 21/07/2026   {time: 12:11 AM} */}
//             <button className="btn btn-secondary me-2" onClick={toggleTheme}>
//               {darkMode ? "☀️ Light" : "🌙 Dark"}
//             </button>

//             <button className="btn btn-danger" onClick={logout}>
//               Logout
//             </button>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default NavbarComponent;

import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
// 🎯 ১. সব import সবসময় ফাইলের একদম ওপরে (ফাংশনের বাইরে) হতে হবে
import { useTheme } from "../context/ThemeContext";

function NavbarComponent() {
  // 🎯 ২. ফাংশনের ভেতরে useTheme কল করা হলো
  const { darkMode, toggleTheme } = useTheme();

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

            {/* //22/07/2026 {time: 10:58 PM} */}
            <Nav.Link as={Link} to="/extract-colors-from-image">
              Extract Colors
            </Nav.Link>

            <button className="btn btn-secondary me-2" onClick={toggleTheme}>
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
