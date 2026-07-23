import { Helmet } from "react-helmet-async";
import NavbarComponent from "../components/Navbar";

function TermsOfService() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Image Color Picker</title>
        <meta
          name="description"
          content="Terms of Service for Image Color Picker. Read our rules and guidelines for using our website."
        />
        <link
          rel="canonical"
          href="https://image-color-picker-mern-z72c-lilac.vercel.app/terms"
        />
      </Helmet>

      <NavbarComponent />

      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <h1 className="mb-4">Terms of Service</h1>
            <p className="text-muted">Last updated: July 2026</p>

            <h2 className="mt-4 mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing our website, you agree to be bound by these Terms of
              Service and to comply with all applicable laws and regulations.
            </p>

            <h2 className="mt-4 mb-3">2. Use License</h2>
            <p>
              Permission is granted to temporarily use Image Color Picker for
              personal, non-commercial or commercial color extraction and palette
              generation.
            </p>

            <h2 className="mt-4 mb-3">3. Disclaimer</h2>
            <p>
              The materials on Image Color Picker are provided on an 'as is' basis.
              We make no warranties, expressed or implied, regarding the continuous
              availability or complete accuracy of extracted color codes.
            </p>

            <h2 className="mt-4 mb-3">4. Limitations</h2>
            <p>
              In no event shall Image Color Picker or its suppliers be liable for
              any damages arising out of the use or inability to use the tools on
              this website.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default TermsOfService;