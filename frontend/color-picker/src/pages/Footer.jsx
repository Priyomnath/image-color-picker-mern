import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container text-center text-md-start">
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5>Image Color Picker</h5>
            <p className="small text-muted mb-0">
              Free online tool to extract colors and generate palettes from images.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item me-3">
                <Link to="/about" className="text-light text-decoration-none small">
                  About
                </Link>
              </li>
              <li className="list-inline-item me-3">
                <Link to="/contact" className="text-light text-decoration-none small">
                  Contact
                </Link>
              </li>
              <li className="list-inline-item me-3">
                <Link to="/privacy-policy" className="text-light text-decoration-none small">
                  Privacy Policy
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/terms" className="text-light text-decoration-none small">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-3 bg-secondary" />
        <div className="text-center small text-muted">
          © {new Date().getFullYear()} Image Color Picker. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;