import { Helmet } from "react-helmet-async";
import NavbarComponent from "../components/Navbar";

function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Image Color Picker</title>

        <meta
          name="description"
          content="Read the Terms of Service for using Image Color Picker and its online color extraction and palette generation tools."
        />
      </Helmet>

      <NavbarComponent />

      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <h1 className="text-center mb-4">
              Terms of Service
            </h1>

            <p>
              <strong>Last Updated:</strong> July 2026
            </p>

            <p>
              By accessing or using Image Color Picker, you agree
              to comply with these Terms of Service. If you do not
              agree with these terms, please do not use the website.
            </p>

            <h2 className="mt-5">
              1. Use of Our Services
            </h2>

            <p>
              Image Color Picker provides online tools that allow
              users to extract colors from images and generate color
              palettes.
            </p>

            <p>
              You agree to use the website only for lawful purposes
              and in accordance with these Terms.
            </p>

            <h2 className="mt-5">
              2. User Accounts
            </h2>

            <p>
              Some features may require you to create an account.
              You are responsible for maintaining the confidentiality
              of your account information.
            </p>

            <p>
              You are responsible for activities performed through
              your account.
            </p>

            <h2 className="mt-5">
              3. Uploaded Content
            </h2>

            <p>
              You are responsible for any images or other content
              that you upload to the website.
            </p>

            <p>
              You must have the necessary rights or permissions to
              upload and process any content you submit.
            </p>

            <h2 className="mt-5">
              4. Prohibited Activities
            </h2>

            <p>
              You agree not to use the website to:
            </p>

            <ul>
              <li>Violate applicable laws or regulations</li>
              <li>Upload illegal or harmful content</li>
              <li>Attempt to compromise website security</li>
              <li>Abuse or disrupt our services</li>
              <li>Attempt unauthorized access to accounts or systems</li>
            </ul>

            <h2 className="mt-5">
              5. Intellectual Property
            </h2>

            <p>
              The website design, branding, software, and original
              content provided by Image Color Picker may be protected
              by applicable intellectual property laws.
            </p>

            <p>
              You may not copy, reproduce, or redistribute our
              website or its original content without permission.
            </p>

            <h2 className="mt-5">
              6. Third-Party Services
            </h2>

            <p>
              Our website may use third-party services for hosting,
              image processing, storage, authentication, analytics,
              or other functionality.
            </p>

            <p>
              We are not responsible for the policies or availability
              of third-party services.
            </p>

            <h2 className="mt-5">
              7. Disclaimer
            </h2>

            <p>
              Our services are provided on an "as is" and "as
              available" basis. We do not guarantee that the website
              will always be available, uninterrupted, or error-free.
            </p>

            <h2 className="mt-5">
              8. Limitation of Liability
            </h2>

            <p>
              To the extent permitted by applicable law, Image Color
              Picker will not be responsible for indirect, incidental,
              or consequential damages arising from the use of our
              services.
            </p>

            <h2 className="mt-5">
              9. Changes to These Terms
            </h2>

            <p>
              We may update these Terms of Service from time to time.
              Updated terms will be published on this page.
            </p>

            <h2 className="mt-5">
              10. Contact Us
            </h2>

            <p>
              If you have questions about these Terms of Service,
              please visit our Contact page.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default Terms;