import { Helmet } from "react-helmet-async";
import NavbarComponent from "../components/Navbar";
import UploadBox from "../components/UploadBox";

function ExtractColors() {
  return (
    <>
      <Helmet>
        <title>Extract Colors From Image Online | Free Color Extractor</title>

        <meta
          name="description"
          content="Extract colors from any image online for free. Upload an image and instantly generate a beautiful color palette with HEX color codes."
        />

        <link
          rel="canonical"
          href="https://image-color-picker-mern-z72c-lilac.vercel.app/extract-colors-from-image"
        />
      </Helmet>

      <NavbarComponent />

      <main>
        {/* Hero */}
        <section className="container py-5">
          <div className="text-center">
            <h1 className="display-4 fw-bold">
              Extract Colors From Image
            </h1>

            <p className="lead mt-3">
              Easily extract colors from any image with our free online
              image color extractor. Upload your photo and instantly
              generate a beautiful color palette with HEX color codes.
            </p>
          </div>

          {/* Tool */}
          <div className="mt-5">
            <UploadBox />
          </div>
        </section>

        {/* About */}
        <section className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <h2 className="text-center mb-4">
                Extract Colors From Any Image
              </h2>

              <p>
                Looking for an easy way to extract colors from an image?
                Our free image color extractor helps you find the most
                important colors in your photos and images.
              </p>

              <p>
                Simply upload an image and our tool automatically analyzes
                it to generate a beautiful color palette. You can view
                dominant colors, copy HEX color codes, and save your
                favorite palettes.
              </p>

              <p>
                This tool is useful for web designers, graphic designers,
                developers, photographers, artists, and anyone who wants
                to find matching colors from an image.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container py-5">
          <h2 className="text-center mb-5">
            How to Extract Colors From an Image
          </h2>

          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="p-4">
                <h3 className="h5">1. Upload an Image</h3>

                <p>
                  Select an image from your device or drag and drop it
                  into the color extraction tool.
                </p>
              </div>
            </div>

            <div className="col-md-4 text-center">
              <div className="p-4">
                <h3 className="h5">2. Extract Colors</h3>

                <p>
                  Our image color extractor analyzes your image and
                  automatically identifies beautiful colors.
                </p>
              </div>
            </div>

            <div className="col-md-4 text-center">
              <div className="p-4">
                <h3 className="h5">3. Use Your Colors</h3>

                <p>
                  Copy HEX color codes or save your generated color
                  palette for your future design projects.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="container py-5">
          <h2 className="text-center mb-4">
            Who Can Use This Image Color Extractor?
          </h2>

          <div className="row g-4">
            <div className="col-md-6">
              <h3 className="h5">🎨 Designers</h3>

              <p>
                Find matching colors from photos and use them in
                branding, UI design, posters, and creative projects.
              </p>
            </div>

            <div className="col-md-6">
              <h3 className="h5">💻 Developers</h3>

              <p>
                Quickly extract HEX colors from images and use them
                in websites, applications, and CSS designs.
              </p>
            </div>

            <div className="col-md-6">
              <h3 className="h5">📸 Photographers</h3>

              <p>
                Discover the dominant colors and visual style of your
                favorite photographs.
              </p>
            </div>

            <div className="col-md-6">
              <h3 className="h5">🖌️ Artists</h3>

              <p>
                Create color palettes and find inspiration from
                images and artwork.
              </p>
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
                <div className="accordion-item">
                  <h3 className="accordion-header">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq1"
                    >
                      How can I extract colors from an image?
                    </button>
                  </h3>

                  <div
                    id="faq1"
                    className="accordion-collapse collapse show"
                  >
                    <div className="accordion-body">
                      Upload your image to our free image color extractor.
                      The tool will automatically analyze the image and
                      generate a color palette with HEX color codes.
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h3 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq2"
                    >
                      Is this image color extractor free?
                    </button>
                  </h3>

                  <div
                    id="faq2"
                    className="accordion-collapse collapse"
                  >
                    <div className="accordion-body">
                      Yes. You can use the image color extraction tool
                      for free.
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h3 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#faq3"
                    >
                      What color codes can I get?
                    </button>
                  </h3>

                  <div
                    id="faq3"
                    className="accordion-collapse collapse"
                  >
                    <div className="accordion-body">
                      The tool generates HEX color codes that you can
                      copy and use in websites, applications, and design
                      projects.
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