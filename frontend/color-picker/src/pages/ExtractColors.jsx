import { Helmet } from "react-helmet-async";
import NavbarComponent from "../components/Navbar";
import UploadBox from "../components/UploadBox";

function ExtractColors() {
  return (
    <>
      {/* ========================================= */}
      {/* SEO */}
      {/* ========================================= */}

      <Helmet>
        <title>
          Extract Colors From Image Online | Free Color Extractor
        </title>

        <meta
          name="description"
          content="Extract colors from any image online for free. Upload an image and instantly generate a beautiful color palette with HEX, RGB, and HSL color codes."
        />

        <meta
          name="keywords"
          content="extract colors from image, image color extractor, color picker from image, extract HEX colors, image palette generator"
        />

        <link
          rel="canonical"
          href="https://image-color-picker-mern-z72c-lilac.vercel.app/extract-colors-from-image"
        />
      </Helmet>

      <NavbarComponent />

      <main>

        {/* ========================================= */}
        {/* PREMIUM HERO */}
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

            <span
              className="badge rounded-pill px-3 py-2 mb-4"
              style={{
                background: "rgba(13, 110, 253, 0.1)",
                color: "#0d6efd",
                fontSize: "14px",
              }}
            >
              🎨 Free Image Color Extractor
            </span>

            {/* Heading */}

            <h1
              className="display-4 fw-bold mb-4 text-body"
              style={{ lineHeight: "1.15" }}
            >
              Extract Colors From
              <br />

              <span className="text-primary">
                Any Image
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
              Upload an image and instantly extract beautiful
              colors from it. Discover dominant colors and get
              HEX, RGB, and HSL color values for your next
              design project.
            </p>

            {/* Benefits */}

            <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">

              <span className="badge bg-white text-dark border shadow-sm px-3 py-2">
                ⚡ Instant Extraction
              </span>

              <span className="badge bg-white text-dark border shadow-sm px-3 py-2">
                🎨 HEX • RGB • HSL
              </span>

              <span className="badge bg-white text-dark border shadow-sm px-3 py-2">
                💾 Save Palettes
              </span>

              <span className="badge bg-white text-dark border shadow-sm px-3 py-2">
                📥 Download JSON
              </span>

            </div>

            {/* Tool */}

            <div className="mt-5 text-start">
              <UploadBox />
            </div>

          </div>

        </section>


        {/* ========================================= */}
        {/* ABOUT */}
        {/* ========================================= */}

        <section className="container py-5">

          <div className="row justify-content-center">

            <div className="col-lg-9">

              <div className="text-center mb-5">

                <span className="text-primary fw-semibold">
                  IMAGE COLOR EXTRACTION
                </span>

                <h2 className="fw-bold mt-2">
                  Extract Colors From Any Image
                </h2>

              </div>

              <p>
                Looking for an easy way to extract colors from
                an image? Our free image color extractor helps
                you discover the most important and visually
                appealing colors from your photos and images.
              </p>

              <p>
                Simply upload an image and our color extraction
                tool automatically analyzes it to generate a
                beautiful color palette. You can identify the
                dominant color, view extracted colors, and copy
                color values for your projects.
              </p>

              <p>
                This image color extractor is useful for web
                designers, graphic designers, developers,
                photographers, artists, and creators who want
                to find matching colors and build consistent
                visual designs.
              </p>

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
              How to Extract Colors From an Image
            </h2>

            <p className="text-muted mx-auto">
              Get your image colors in just three simple steps.
            </p>

          </div>


          <div className="row g-4">

            {/* Step 1 */}

            <div className="col-md-4">

              <div className="card border-0 shadow-sm rounded-4 h-100 p-4 text-center">

                <div
                  className="mx-auto mb-4 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "65px",
                    height: "65px",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  1
                </div>

                <h3 className="h5 fw-bold">
                  Upload an Image
                </h3>

                <p className="text-muted mb-0">
                  Select an image from your device or drag and
                  drop it into the image color extraction tool.
                </p>

              </div>

            </div>


            {/* Step 2 */}

            <div className="col-md-4">

              <div className="card border-0 shadow-sm rounded-4 h-100 p-4 text-center">

                <div
                  className="mx-auto mb-4 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "65px",
                    height: "65px",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  2
                </div>

                <h3 className="h5 fw-bold">
                  Extract Colors
                </h3>

                <p className="text-muted mb-0">
                  Our image color extractor analyzes your image
                  and automatically identifies beautiful colors
                  and the dominant color.
                </p>

              </div>

            </div>


            {/* Step 3 */}

            <div className="col-md-4">

              <div className="card border-0 shadow-sm rounded-4 h-100 p-4 text-center">

                <div
                  className="mx-auto mb-4 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "65px",
                    height: "65px",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  3
                </div>

                <h3 className="h5 fw-bold">
                  Copy or Save Colors
                </h3>

                <p className="text-muted mb-0">
                  Copy HEX, RGB, or HSL values, download your
                  palette as JSON, or save it to your account.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ========================================= */}
        {/* BENEFITS */}
        {/* ========================================= */}

        <section className="container py-5">

          <div className="text-center mb-5">

            <span className="text-primary fw-semibold">
              BUILT FOR CREATORS
            </span>

            <h2 className="fw-bold mt-2">
              Who Can Use This Image Color Extractor?
            </h2>

          </div>


          <div className="row g-4">

            {/* Designers */}

            <div className="col-md-6">

              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">

                <div className="d-flex gap-3">

                  <div style={{ fontSize: "32px" }}>
                    🎨
                  </div>

                  <div>

                    <h3 className="h5 fw-bold">
                      Designers
                    </h3>

                    <p className="text-muted mb-0">
                      Find matching colors from photos and use
                      them in branding, UI design, posters,
                      websites, and creative projects.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* Developers */}

            <div className="col-md-6">

              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">

                <div className="d-flex gap-3">

                  <div style={{ fontSize: "32px" }}>
                    💻
                  </div>

                  <div>

                    <h3 className="h5 fw-bold">
                      Developers
                    </h3>

                    <p className="text-muted mb-0">
                      Quickly extract HEX, RGB, and HSL colors
                      from images and use them in websites,
                      applications, and CSS designs.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* Photographers */}

            <div className="col-md-6">

              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">

                <div className="d-flex gap-3">

                  <div style={{ fontSize: "32px" }}>
                    📸
                  </div>

                  <div>

                    <h3 className="h5 fw-bold">
                      Photographers
                    </h3>

                    <p className="text-muted mb-0">
                      Discover dominant colors and understand
                      the visual style and color balance of your
                      favorite photographs.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* Artists */}

            <div className="col-md-6">

              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">

                <div className="d-flex gap-3">

                  <div style={{ fontSize: "32px" }}>
                    🖌️
                  </div>

                  <div>

                    <h3 className="h5 fw-bold">
                      Artists & Creators
                    </h3>

                    <p className="text-muted mb-0">
                      Create inspiring color palettes from
                      images, artwork, illustrations, and
                      creative references.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ========================================= */}
        {/* COLOR FORMATS */}
        {/* ========================================= */}

        <section className="container py-5">

          <div className="text-center mb-5">

            <h2 className="fw-bold">
              Get Useful Color Values From Your Image
            </h2>

            <p className="text-muted">
              Use extracted colors across your digital design
              and development projects.
            </p>

          </div>


          <div className="row g-4">

            <div className="col-md-4">

              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">

                <h3 className="h5 fw-bold">
                  HEX Colors
                </h3>

                <p className="text-muted mb-0">
                  Copy hexadecimal color values and use them
                  directly in CSS, websites, and digital
                  design tools.
                </p>

              </div>

            </div>


            <div className="col-md-4">

              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">

                <h3 className="h5 fw-bold">
                  RGB Colors
                </h3>

                <p className="text-muted mb-0">
                  Use RGB values when working with web
                  development, digital interfaces, and
                  application designs.
                </p>

              </div>

            </div>


            <div className="col-md-4">

              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">

                <h3 className="h5 fw-bold">
                  HSL Colors
                </h3>

                <p className="text-muted mb-0">
                  Work with hue, saturation, and lightness
                  values for flexible color adjustments and
                  modern UI design.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ========================================= */}
        {/* FAQ */}
        {/* ========================================= */}

        <section className="container py-5">

          <div className="row justify-content-center">

            <div className="col-lg-9">

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
                id="extractColorFAQ"
              >

                {/* FAQ 1 */}

                <div className="accordion-item">

                  <h3 className="accordion-header">

                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#extractFaq1"
                    >
                      How can I extract colors from an image?
                    </button>

                  </h3>

                  <div
                    id="extractFaq1"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#extractColorFAQ"
                  >

                    <div className="accordion-body">

                      Upload your image to our free image color
                      extractor. The tool will automatically
                      analyze the image and generate a color
                      palette with extracted color values.

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
                      data-bs-target="#extractFaq2"
                    >
                      Is this image color extractor free?
                    </button>

                  </h3>

                  <div
                    id="extractFaq2"
                    className="accordion-collapse collapse"
                    data-bs-parent="#extractColorFAQ"
                  >

                    <div className="accordion-body">

                      Yes. You can use the image color extraction
                      tool to analyze your images and generate
                      color palettes for free.

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
                      data-bs-target="#extractFaq3"
                    >
                      What color formats can I get?

                    </button>

                  </h3>

                  <div
                    id="extractFaq3"
                    className="accordion-collapse collapse"
                    data-bs-parent="#extractColorFAQ"
                  >

                    <div className="accordion-body">

                      You can view and copy HEX, RGB, and HSL
                      color values from the extracted colors.
                      You can also download your color palette
                      as a JSON file.

                    </div>

                  </div>

                </div>


                {/* FAQ 4 */}

                <div className="accordion-item">

                  <h3 className="accordion-header">

                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#extractFaq4"
                    >
                      What image formats are supported?

                    </button>

                  </h3>

                  <div
                    id="extractFaq4"
                    className="accordion-collapse collapse"
                    data-bs-parent="#extractColorFAQ"
                  >

                    <div className="accordion-body">

                      The tool supports common image formats
                      including JPG, JPEG, PNG, and WEBP.

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>
    </>
  );
}

export default ExtractColors;