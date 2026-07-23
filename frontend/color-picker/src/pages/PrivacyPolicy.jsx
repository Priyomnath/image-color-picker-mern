import { Helmet } from "react-helmet-async";
import NavbarComponent from "../components/Navbar";

function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Image Color Picker</title>

        <meta
          name="description"
          content="Read the Privacy Policy of Image Color Picker to learn how we collect, use, and protect information when you use our website."
        />
      </Helmet>

      <NavbarComponent />

      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <h1 className="text-center mb-4">
              Privacy Policy
            </h1>

            <p>
              <strong>Last Updated:</strong> July 2026
            </p>

            <p>
              Welcome to Image Color Picker. Your privacy is important
              to us. This Privacy Policy explains how information may
              be collected, used, and protected when you use our website.
            </p>

            <h2 className="mt-5">1. Information We Collect</h2>

            <p>
              When you use our website, we may collect information
              that you voluntarily provide, such as your name and
              email address when you create an account or contact us.
            </p>

            <p>
              We may also collect technical information such as
              browser type, device information, IP address, and
              general usage information for security and analytics
              purposes.
            </p>

            <h2 className="mt-5">2. Uploaded Images</h2>

            <p>
              Images uploaded to our color extraction tools may be
              processed to generate color palettes and color information.
              Uploaded images may be stored when you choose to save
              a palette to your account.
            </p>

            <h2 className="mt-5">3. How We Use Information</h2>

            <p>
              We may use collected information to:
            </p>

            <ul>
              <li>Provide and operate our services</li>
              <li>Manage user accounts</li>
              <li>Save user color palettes</li>
              <li>Improve website performance</li>
              <li>Respond to support requests</li>
              <li>Prevent fraud and abuse</li>
            </ul>

            <h2 className="mt-5">4. Cookies</h2>

            <p>
              We may use cookies and similar technologies to provide
              authentication and improve the functionality of our
              website.
            </p>

            <p>
              Our authentication system may use cookies to securely
              maintain your login session.
            </p>

            <h2 className="mt-5">5. Third-Party Services</h2>

            <p>
              We may use third-party services such as hosting,
              cloud storage, database, analytics, and advertising
              providers to operate our website.
            </p>

            <p>
              These third-party services may process information
              according to their own privacy policies.
            </p>

            <h2 className="mt-5">6. Advertising</h2>

            <p>
              We may display advertisements from third-party advertising
              providers in the future. These providers may use cookies
              or similar technologies to provide relevant advertisements.
            </p>

            <h2 className="mt-5">7. Data Security</h2>

            <p>
              We take reasonable measures to protect information
              associated with our services. However, no online service
              can guarantee complete security of information.
            </p>

            <h2 className="mt-5">8. Your Choices</h2>

            <p>
              You may contact us if you have questions about your
              personal information or wish to request assistance
              regarding your account.
            </p>

            <h2 className="mt-5">9. Children's Privacy</h2>

            <p>
              Our services are not intended to knowingly collect
              personal information from children without appropriate
              consent.
            </p>

            <h2 className="mt-5">10. Changes to This Policy</h2>

            <p>
              We may update this Privacy Policy from time to time.
              Any changes will be posted on this page with an updated
              revision date.
            </p>

            <h2 className="mt-5">11. Contact Us</h2>

            <p>
              If you have questions about this Privacy Policy, please
              visit our Contact page.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default PrivacyPolicy;