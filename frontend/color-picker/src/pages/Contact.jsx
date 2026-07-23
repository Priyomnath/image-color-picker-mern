import { Helmet } from "react-helmet-async";
import NavbarComponent from "../components/Navbar";

function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us | Image Color Picker</title>

        <meta
          name="description"
          content="Contact the Image Color Picker team for questions, feedback, suggestions, or support."
        />
      </Helmet>

      <NavbarComponent />

      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <h1 className="text-center mb-4">
              Contact Us
            </h1>

            <p className="text-center">
              Have a question, suggestion, or feedback?
              We'd love to hear from you.
            </p>

            <div className="card shadow-sm p-4 mt-4">
              <form
                action="https://formspree.io/f/YOUR_FORM_ID"
                method="POST"
              >
                <div className="mb-3">
                  <label className="form-label">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Your email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Message
                  </label>

                  <textarea
                    name="message"
                    className="form-control"
                    rows="5"
                    placeholder="Write your message..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Contact;