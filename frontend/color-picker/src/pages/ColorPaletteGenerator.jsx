import { Helmet } from "react-helmet-async";
import NavbarComponent from "../components/Navbar";
import UploadBox from "../components/UploadBox";

function ColorPaletteGenerator() {
  return (
    <>
      {/* ========================================= */}
      {/* SEO */}
      {/* ========================================= */}

      <Helmet>
        <title>
          Color Palette Generator From Image | Free Online Tool
        </title>

        <meta
          name="description"
          content="Generate a beautiful color palette from any image for free. Upload an image and instantly extract dominant colors with HEX, RGB, and HSL color codes."
        />

        <meta
          name="keywords"
          content="color palette generator, color palette generator from image, image palette generator, photo color palette, HEX color palette, color scheme generator"
        />

        <link
          rel="canonical"
          href="https://image-color-picker-mern-z72c-lilac.vercel.app/color-palette-generator"
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
              🌈 Free Online Color Palette Generator
            </span>

            {/* Heading */}

            <h1
              className="display-4 fw-bold mb-4 text-body"
              style={{
                lineHeight: "1.15",
              }}
            >
              Generate a Beautiful
              <br />

              <span className="text-primary">
                Color Palette From Any Image
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
              Upload any image and instantly discover its
              dominant and beautiful colors. Generate a
              complete color palette with HEX, RGB, and HSL
              values for your next design project.
            </p>

            {/* Benefits */}

            <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">

              <span className="badge bg-white text-dark border shadow-sm px-3 py-2">
                ⚡ Instant Palette Generation
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
                  IMAGE COLOR PALETTE GENERATOR
                </span>

                <h2 className="fw-bold mt-2">
                  Generate a Color Palette From Any Image
                </h2>

              </div>

              <p>
                Our free color palette generator helps you create
                beautiful and useful color palettes from your
                favorite images. Simply upload a photo and our
                tool will automatically analyze the image and
                extract a collection of colors.
              </p>

              <p>
                Each generated palette contains useful color
                values that can be copied and used in websites,
                mobile applications, graphic designs, branding
                projects, UI designs, and other creative work.
              </p>

              <p>
                Whether you are a web designer, developer, artist,
                photographer, or content creator, this image color
                palette generator makes it easy to discover
                matching colors and build a consistent visual
                style.
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
              How to Generate a Color Palette
            </h2>

            <p className="text-muted mx-auto">
              Create your image-based color palette in three
              simple steps.
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
                  Upload Your Image
                </h3>

                <p className="text-muted mb-0">
                  Choose a photo or image from your device
                  and upload it to the color palette generator.
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
                  Generate Your Palette
                </h3>

                <p className="text-muted mb-0">
                  Our tool analyzes your image and extracts
                  dominant and beautiful colors automatically.
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
        {/* USE CASES */}
        {/* ========================================= */}

        <section className="container py-5">

          <div className="text-center mb-5">

            <span className="text-primary fw-semibold">
              DESIGN INSPIRATION
            </span>

            <h2 className="fw-bold mt-2">
              What Can You Use a Color Palette For?
            </h2>

          </div>


          <div className="row g-4">

            {/* Website */}

            <div className="col-md-6">

              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">

                <div className="d-flex gap-3">

                  <div style={{ fontSize: "32px" }}>
                    🌐
                  </div>

                  <div>

                    <h3 className="h5 fw-bold">
                      Website Design
                    </h3>

                    <p className="text-muted mb-0">
                      Create a consistent color scheme for your
                      website based on colors extracted from
                      your favorite images.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* UI UX */}

            <div className="col-md-6">

              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">

                <div className="d-flex gap-3">

                  <div style={{ fontSize: "32px" }}>
                    📱
                  </div>

                  <div>

                    <h3 className="h5 fw-bold">
                      UI/UX Design
                    </h3>

                    <p className="text-muted mb-0">
                      Find matching colors for mobile apps,
                      dashboards, interfaces, and digital
                      products.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* Graphic Design */}

            <div className="col-md-6">

              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">

                <div className="d-flex gap-3">

                  <div style={{ fontSize: "32px" }}>
                    🎨
                  </div>

                  <div>

                    <h3 className="h5 fw-bold">
                      Graphic Design
                    </h3>

                    <p className="text-muted mb-0">
                      Generate color combinations for posters,
                      social media graphics, presentations,
                      and creative projects.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* Branding */}

            <div className="col-md-6">

              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">

                <div className="d-flex gap-3">

                  <div style={{ fontSize: "32px" }}>
                    🏷️
                  </div>

                  <div>

                    <h3 className="h5 fw-bold">
                      Branding
                    </h3>

                    <p className="text-muted mb-0">
                      Get inspiration for brand colors and
                      create a consistent visual identity for
                      your business or project.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ========================================= */}
        {/* WHY USE OUR TOOL */}
        {/* ========================================= */}

        <section className="container py-5">

          <div className="row justify-content-center">

            <div className="col-lg-9">

              <div className="text-center mb-5">

                <span className="text-primary fw-semibold">
                  WHY CHOOSE OUR TOOL
                </span>

                <h2 className="fw-bold mt-2">
                  Why Use Our Color Palette Generator?
                </h2>

              </div>


              <div className="row g-3">

                <div className="col-md-6">

                  <div className="border rounded-4 p-3 h-100">
                    ⚡ Free online color palette generator
                  </div>

                </div>

                <div className="col-md-6">

                  <div className="border rounded-4 p-3 h-100">
                    🎨 Extract colors directly from images
                  </div>

                </div>

                <div className="col-md-6">

                  <div className="border rounded-4 p-3 h-100">
                    📋 Get HEX, RGB, and HSL color values
                  </div>

                </div>

                <div className="col-md-6">

                  <div className="border rounded-4 p-3 h-100">
                    💾 Save your favorite color palettes
                  </div>

                </div>

                <div className="col-md-6">

                  <div className="border rounded-4 p-3 h-100">
                    📥 Download your palette as JSON
                  </div>

                </div>

                <div className="col-md-6">

                  <div className="border rounded-4 p-3 h-100">
                    📱 Easy to use on desktop and mobile
                  </div>

                </div>

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
                id="paletteFAQ"
              >

                {/* FAQ 1 */}

                <div className="accordion-item">

                  <h3 className="accordion-header">

                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#paletteFaq1"
                    >
                      What is a color palette generator?
                    </button>

                  </h3>

                  <div
                    id="paletteFaq1"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#paletteFAQ"
                  >

                    <div className="accordion-body">

                      A color palette generator is a tool that
                      creates a collection of matching colors.
                      Our tool analyzes colors found in an
                      uploaded image and creates a useful
                      color palette.

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
                      data-bs-target="#paletteFaq2"
                    >
                      Can I generate a palette from a photo?
                    </button>

                  </h3>

                  <div
                    id="paletteFaq2"
                    className="accordion-collapse collapse"
                    data-bs-parent="#paletteFAQ"
                  >

                    <div className="accordion-body">

                      Yes. Upload a supported image and the
                      tool will analyze it to generate a
                      color palette based on the colors
                      found in the image.

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
                      data-bs-target="#paletteFaq3"
                    >
                      Can I use the generated HEX colors?

                    </button>

                  </h3>

                  <div
                    id="paletteFaq3"
                    className="accordion-collapse collapse"
                    data-bs-parent="#paletteFAQ"
                  >

                    <div className="accordion-body">

                      Yes. You can copy the HEX color codes
                      and use them in websites, apps, CSS,
                      UI designs, branding projects, and
                      other digital work.

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
                      data-bs-target="#paletteFaq4"
                    >
                      Can I download my generated palette?

                    </button>

                  </h3>

                  <div
                    id="paletteFaq4"
                    className="accordion-collapse collapse"
                    data-bs-parent="#paletteFAQ"
                  >

                    <div className="accordion-body">

                      Yes. After generating your palette, you
                      can download the extracted colors as
                      a JSON file for use in your projects.

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

export default ColorPaletteGenerator;