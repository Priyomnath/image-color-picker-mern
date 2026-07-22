import { Helmet } from "react-helmet-async";
import NavbarComponent from "../components/Navbar";
import UploadBox from "../components/UploadBox";

function ColorPaletteGenerator() {
  return (
    <>
      <Helmet>
        <title>
          Color Palette Generator From Image | Free Online Tool
        </title>

        <meta
          name="description"
          content="Generate a beautiful color palette from any image for free. Upload an image and instantly extract dominant colors and HEX color codes."
        />

        <link
          rel="canonical"
          href="https://image-color-picker-mern-z72c-lilac.vercel.app/color-palette-generator"
        />
      </Helmet>

      <NavbarComponent />

      <main>
        {/* Hero Section */}
        <section className="container py-5">
          <div className="text-center">
            <h1 className="display-4 fw-bold">
              Color Palette Generator From Image
            </h1>

            <p className="lead mt-3">
              Create a beautiful color palette from any image with our
              free online color palette generator. Upload your image
              and instantly discover dominant colors and HEX codes.
            </p>
          </div>

          {/* Color Palette Tool */}
          <div className="mt-5">
            <UploadBox />
          </div>
        </section>

        {/* About Section */}
        <section className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <h2 className="text-center mb-4">
                Generate a Color Palette From Any Image
              </h2>

              <p>
                Our free color palette generator helps you create
                beautiful color palettes from your favorite images.
                Simply upload a photo and our tool will automatically
                analyze the image and extract a collection of colors.
              </p>

              <p>
                Each generated palette includes HEX color codes that
                can be copied and used in websites, mobile applications,
                graphic designs, branding projects, and other creative
                work.
              </p>

              <p>
                Whether you are a web designer, developer, artist, or
                content creator, this image color palette generator
                makes it easy to find matching colors for your projects.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container py-5">
          <h2 className="text-center mb-5">
            How to Generate a Color Palette
          </h2>

          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="p-4">
                <h3 className="h5">
                  1. Upload Your Image
                </h3>

                <p>
                  Choose a photo or image from your device and upload
                  it to our color palette generator.
                </p>
              </div>
            </div>

            <div className="col-md-4 text-center">
              <div className="p-4">
                <h3 className="h5">
                  2. Generate Your Palette
                </h3>

                <p>
                  Our tool analyzes your image and automatically
                  extracts the dominant and complementary colors.
                </p>
              </div>
            </div>

            <div className="col-md-4 text-center">
              <div className="p-4">
                <h3 className="h5">
                  3. Copy or Save Colors
                </h3>

                <p>
                  Copy HEX color codes, download your palette, or
                  save your favorite palettes for later.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="container py-5">
          <h2 className="text-center mb-4">
            What Can You Use a Color Palette For?
          </h2>

          <div className="row g-4">
            <div className="col-md-6">
              <h3 className="h5">
                🌐 Website Design
              </h3>

              <p>
                Create a consistent color scheme for your website
                based on colors from your favorite images.
              </p>
            </div>

            <div className="col-md-6">
              <h3 className="h5">
                📱 UI/UX Design
              </h3>

              <p>
                Find matching colors for mobile apps, dashboards,
                interfaces, and digital products.
              </p>
            </div>

            <div className="col-md-6">
              <h3 className="h5">
                🎨 Graphic Design
              </h3>

              <p>
                Generate color combinations for posters, social media
                graphics, presentations, and creative projects.
              </p>
            </div>

            <div className="col-md-6">
              <h3 className="h5">
                🏷️ Branding
              </h3>

              <p>
                Get inspiration for brand colors and create a
                consistent visual identity.
              </p>
            </div>
          </div>
        </section>

        {/* Why Use Our Tool */}
        <section className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <h2 className="text-center mb-4">
                Why Use Our Color Palette Generator?
              </h2>

              <ul>
                <li className="mb-2">
                  Free online color palette generator
                </li>

                <li className="mb-2">
                  Extract colors directly from images
                </li>

                <li className="mb-2">
                  Get HEX color codes instantly
                </li>

                <li className="mb-2">
                  Save your favorite color palettes
                </li>

                <li className="mb-2">
                  Download your palette as JSON
                </li>

                <li className="mb-2">
                  Easy to use for designers and developers
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <h2 className="text-center mb-4">
                Frequently Asked Questions
              </h2>

              <div className="accordion">
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
                  >
                    <div className="accordion-body">
                      A color palette generator is a tool that creates
                      a collection of matching colors. Our tool can
                      automatically generate a palette by analyzing
                      colors found in an uploaded image.
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
                  >
                    <div className="accordion-body">
                      Yes. Upload any supported image and the tool
                      will analyze it to generate a color palette.
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
                  >
                    <div className="accordion-body">
                      Yes. You can copy the HEX color codes and use
                      them in your websites, apps, CSS, UI designs,
                      and other digital projects.
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