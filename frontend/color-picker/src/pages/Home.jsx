import NavbarComponent from "../components/Navbar";
import UploadBox from "../components/UploadBox";

function Home() {
  return (
    <>
      <NavbarComponent />

      <main>

        {/* ========================================= */}
        {/* PREMIUM HERO SECTION */}
        {/* ========================================= */}

        <section className="container py-5">

          <div
            className="rounded-4 p-4 p-md-5 text-center shadow-sm"
            style={{
              background:
                "linear-gradient(135deg, #f8f9ff, #eef5ff, #f8f0ff)",
              border: "1px solid rgba(13, 110, 253, 0.08)",
            }}
          >

            {/* Badge */}

            <div className="mb-4">

              <span
                className="badge rounded-pill px-3 py-2"
                style={{
                  background:
                    "rgba(13, 110, 253, 0.1)",
                  color: "#0d6efd",
                  fontSize: "14px",
                }}
              >
                🎨 Free Online Color Extraction Tool
              </span>

            </div>

            {/* Main Heading */}

            <h1
              className="display-4 fw-bold mb-4"
              style={{
                lineHeight: "1.15",
                color: "#212529" // 👈 Light mode dark color fix
              }}
            >
              Extract Beautiful Colors
              <br />

              <span className="text-primary">
                From Any Image
              </span>
            </h1>

            {/* Description */}

            <p
              className="lead text-muted mx-auto mb-4"
              style={{
                maxWidth: "750px",
                lineHeight: "1.7",
              }}
            >
              Upload an image and instantly discover its
              dominant colors, HEX, RGB, and HSL color
              codes. Create beautiful color palettes for
              your websites, apps, branding, and design
              projects.
            </p>

            {/* Feature Highlights */}

            <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">

              <span className="badge bg-white text-dark border shadow-sm px-3 py-2">
                ⚡ Instant Color Extraction
              </span>

              <span className="badge bg-white text-dark border shadow-sm px-3 py-2">
                🎨 HEX • RGB • HSL
              </span>

              <span className="badge bg-white text-dark border shadow-sm px-3 py-2">
                💾 Save Your Palettes
              </span>

              <span className="badge bg-white text-dark border shadow-sm px-3 py-2">
                📥 Download JSON
              </span>

            </div>

            {/* Main Tool */}

            <div className="mt-5 text-start">
              <UploadBox />
            </div>

          </div>

        </section>


        {/* ========================================= */}
        {/* FEATURES SECTION */}
        {/* ========================================= */}

        <section className="container py-5">

          <div className="text-center mb-5">

            <span className="text-primary fw-semibold">
              POWERFUL FEATURES
            </span>

            <h2 className="fw-bold mt-2">
              Everything You Need to Work With Colors
            </h2>

            <p className="text-muted mx-auto" style={{ maxWidth: "650px" }}>
              Quickly extract, explore, copy, download,
              and save beautiful colors from your favorite
              images.
            </p>

          </div>


          <div className="row g-4">

            {/* Feature 1 */}

            <div className="col-md-4">

              <div
                className="card h-100 border-0 shadow-sm rounded-4 p-4"
              >

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "60px",
                    height: "60px",
                    background:
                      "rgba(13, 110, 253, 0.1)",
                    fontSize: "28px",
                  }}
                >
                  🎨
                </div>

                <h3 className="h5 fw-bold">
                  Extract Colors from Images
                </h3>

                <p className="text-muted mb-0">
                  Upload any image and automatically
                  discover its most beautiful and dominant
                  colors in seconds.
                </p>

              </div>

            </div>


            {/* Feature 2 */}

            <div className="col-md-4">

              <div
                className="card h-100 border-0 shadow-sm rounded-4 p-4"
              >

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "60px",
                    height: "60px",
                    background:
                      "rgba(111, 66, 193, 0.1)",
                    fontSize: "28px",
                  }}
                >
                  🌈
                </div>

                <h3 className="h5 fw-bold">
                  Generate Color Palettes
                </h3>

                <p className="text-muted mb-0">
                  Turn your favorite photos into beautiful
                  color palettes for websites, apps,
                  branding, and creative projects.
                </p>

              </div>

            </div>


            {/* Feature 3 */}

            <div className="col-md-4">

              <div
                className="card h-100 border-0 shadow-sm rounded-4 p-4"
              >

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "60px",
                    height: "60px",
                    background:
                      "rgba(25, 135, 84, 0.1)",
                    fontSize: "28px",
                  }}
                >
                  📋
                </div>

                <h3 className="h5 fw-bold">
                  Copy HEX, RGB & HSL
                </h3>

                <p className="text-muted mb-0">
                  Easily copy HEX, RGB, and HSL color
                  values and use them directly in your
                  design and development projects.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ========================================= */}
        {/* HOW IT WORKS */}
        {/* ========================================= */}

        <section className="container py-5">

          <div className="text-center mb-5">

            <span className="text-primary fw-semibold">
              SIMPLE PROCESS
            </span>

            <h2 className="fw-bold mt-2">
              How to Extract Colors from an Image
            </h2>

          </div>


          <div className="row g-4 text-center">

            {/* Step 1 */}

            <div className="col-md-4">

              <div className="p-4">

                <div
                  className="mx-auto mb-3 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  1
                </div>

                <h3 className="h5 fw-bold">
                  Upload Your Image
                </h3>

                <p className="text-muted">
                  Select an image from your device or
                  drag and drop it into the color picker.
                </p>

              </div>

            </div>


            {/* Step 2 */}

            <div className="col-md-4">

              <div className="p-4">

                <div
                  className="mx-auto mb-3 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  2
                </div>

                <h3 className="h5 fw-bold">
                  Extract Colors
                </h3>

                <p className="text-muted">
                  Our color extraction tool analyzes your
                  image and generates a beautiful palette.
                </p>

              </div>

            </div>


            {/* Step 3 */}

            <div className="col-md-4">

              <div className="p-4">

                <div
                  className="mx-auto mb-3 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  3
                </div>

                <h3 className="h5 fw-bold">
                  Copy or Save Your Palette
                </h3>

                <p className="text-muted">
                  Copy your color codes, download the
                  palette as JSON, or save it to your account.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ========================================= */}
        {/* ABOUT / SEO SECTION */}
        {/* ========================================= */}

        <section className="container py-5">

          <div className="row justify-content-center">

            <div className="col-lg-9">

              <h2 className="text-center fw-bold mb-4">
                Free Online Image Color Picker
              </h2>

              <p>
                Our image color picker is a free online
                tool designed to help designers, developers,
                artists, and creators extract colors from
                images. Whether you are creating a website,
                mobile application, branding project, or
                graphic design, you can quickly generate a
                color palette from any image.
              </p>

              <p>
                Simply upload your image and our color
                extraction tool will identify dominant
                colors and generate HEX, RGB, and HSL
                color values. You can then copy these
                colors, download your palette, or save your
                favorite palettes for future projects.
              </p>

            </div>

          </div>

        </section>


        {/* ========================================= */}
        {/* FAQ SECTION */}
        {/* ========================================= */}

        <section className="container py-5">

          <div className="text-center mb-5">

            <span className="text-primary fw-semibold">
              FAQ
            </span>

            <h2 className="fw-bold mt-2">
              Frequently Asked Questions
            </h2>

          </div>


          <div
            className="accordion"
            id="faqAccordion"
          >

            {/* FAQ 1 */}

            <div className="accordion-item">

              <h3 className="accordion-header">

                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq1"
                >
                  What is an image color picker?
                </button>

              </h3>

              <div
                id="faq1"
                className="accordion-collapse collapse show"
                data-bs-parent="#faqAccordion"
              >

                <div className="accordion-body">

                  An image color picker is an online tool
                  that extracts colors from an image and
                  generates a color palette with HEX, RGB,
                  and HSL color values.

                </div>

              </div>

            </div>


            {/* FAQ 2 */}

            <div className="accordion-item">

              <h3 className="accordion-header">

                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq2"
                >
                  Can I extract colors from any image?
                </button>

              </h3>

              <div
                id="faq2"
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
              >

                <div className="accordion-body">

                  Yes. You can upload supported image
                  formats such as JPG, JPEG, PNG, and WEBP.
                  The tool analyzes your image and generates
                  a color palette.

                </div>

              </div>

            </div>


            {/* FAQ 3 */}

            <div className="accordion-item">

              <h3 className="accordion-header">

                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq3"
                >
                  What are HEX color codes?
                </button>

              </h3>

              <div
                id="faq3"
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
              >

                <div className="accordion-body">

                  HEX color codes are six-digit hexadecimal
                  values used to represent colors in websites,
                  applications, and digital design projects.

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>
    </>
  );
}

export default Home;