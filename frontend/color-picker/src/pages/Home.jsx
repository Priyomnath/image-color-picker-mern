// // 14/07/2026
// import NavbarComponent from "../components/Navbar"; //one change now
// import UploadBox from "../components/UploadBox";

// //this my bad
// function Home() {
//   return (
//     <>
//       <NavbarComponent />

//       <div className="container">
//         <h1 className="text-center mt-5">
//           Image Color Picker
//         </h1>

//         <UploadBox />
//       </div>
//     </>
//   );
// }

// export default Home;











import NavbarComponent from "../components/Navbar";
import UploadBox from "../components/UploadBox";

function Home() {
  return (
    <>
      <NavbarComponent />

      <main>
        {/* Hero Section */}
        <section className="container py-5">
          <div className="text-center">
            <h1 className="display-4 fw-bold">
              Image Color Picker & Color Palette Generator
            </h1>

            <p className="lead mt-3">
              Extract beautiful colors from any image instantly with our free
              online image color picker. Upload an image and generate a
              stunning color palette with HEX color codes.
            </p>
          </div>

          {/* Color Picker Tool */}
          <div className="mt-5">
            <UploadBox />
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-5">
          <h2 className="text-center mb-4">
            Powerful Image Color Picker Features
          </h2>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 shadow-sm p-4">
                <h3 className="h5">🎨 Extract Colors from Images</h3>

                <p>
                  Upload any image and automatically extract the most
                  beautiful and dominant colors from it.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm p-4">
                <h3 className="h5">🌈 Generate Color Palettes</h3>

                <p>
                  Create beautiful color palettes from your favorite photos
                  and images for your next design project.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 shadow-sm p-4">
                <h3 className="h5">📋 Copy HEX Color Codes</h3>

                <p>
                  Easily copy HEX color codes and use them in your websites,
                  apps, graphic designs, and UI projects.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container py-5">
          <h2 className="text-center mb-4">
            How to Extract Colors from an Image
          </h2>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4">
                <h3 className="h5">1. Upload Your Image</h3>

                <p>
                  Select or drag and drop an image into the image color picker
                  tool.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4">
                <h3 className="h5">2. Extract Colors</h3>

                <p>
                  Our tool analyzes your image and automatically generates
                  beautiful colors from it.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4">
                <h3 className="h5">3. Save Your Palette</h3>

                <p>
                  Copy your HEX colors, download your palette, or save it to
                  your account for later.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <h2 className="text-center mb-4">
                Free Online Image Color Picker
              </h2>

              <p>
                Our image color picker is a free online tool that helps
                designers, developers, artists, and creators extract colors
                from images. Whether you are working on a website, mobile app,
                branding project, or graphic design, you can quickly generate
                a color palette from any image.
              </p>

              <p>
                Simply upload your image and our color extraction tool will
                identify the dominant colors and generate HEX color codes.
                You can then use these colors in your design projects or save
                your favorite palettes for future use.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container py-5">
          <h2 className="text-center mb-4">
            Frequently Asked Questions
          </h2>

          <div className="accordion" id="faqAccordion">
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
                  An image color picker is an online tool that extracts
                  colors from an image and generates a color palette with
                  HEX color codes.
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
                  Can I extract colors from any image?
                </button>
              </h3>

              <div
                id="faq2"
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  Yes. You can upload an image and our tool will analyze it
                  to generate a color palette.
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
                  What are HEX color codes?
                </button>
              </h3>

              <div
                id="faq3"
                className="accordion-collapse collapse"
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  HEX color codes are hexadecimal values used to represent
                  colors in websites, apps, and digital design projects.
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