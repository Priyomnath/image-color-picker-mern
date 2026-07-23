import { Helmet } from "react-helmet-async";
import NavbarComponent from "../components/Navbar";

function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Image Color Picker</title>
        <meta
          name="description"
          content="Privacy Policy for Image Color Picker. Learn how we collect, use, and protect your data."
        />
        <link
          rel="canonical"
          href="https://image-color-picker-mern-z72c-lilac.vercel.app/privacy-policy"
        />
      </Helmet>

      <NavbarComponent />

      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <h1 className="mb-4">Privacy Policy</h1>
            <p className="text-muted">Last updated: July 2026</p>

            <p>
              At Image Color Picker, accessible from
              https://image-color-picker-mern-z72c-lilac.vercel.app, one of our main
              priorities is the privacy of our visitors. This Privacy Policy
              document contains types of information that is collected and recorded
              by Image Color Picker and how we use it.
            </p>

            <h2 className="mt-4 mb-3">Information We Collect</h2>
            <p>
              When you use our service, we may collect minimal information such as
              account information (name, email) if you register, and uploaded images
              to extract color palettes. We do not sell or share your personal data with
              third parties.
            </p>

            <h2 className="mt-4 mb-3">Cookies and Web Beacons</h2>
            <p>
              Like any other website, Image Color Picker uses 'cookies'. These
              cookies are used to store information including visitors'
              preferences, and the pages on the website that the visitor accessed
              or visited.
            </p>

            <h2 className="mt-4 mb-3">Google DoubleClick DART Cookie</h2>
            <p>
              Google is one of a third-party vendor on our site. It also uses
              cookies, known as DART cookies, to serve ads to our site visitors
              based upon their visit to our site and other sites on the internet.
            </p>

            <h2 className="mt-4 mb-3">Third Party Privacy Policies</h2>
            <p>
              Image Color Picker's Privacy Policy does not apply to other
              advertisers or websites. Thus, we are advising you to consult the
              respective Privacy Policies of these third-party ad servers for more
              detailed information.
            </p>

            <h2 className="mt-4 mb-3">Consent</h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and
              agree to its terms.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default PrivacyPolicy;