import { Helmet } from "react-helmet-async";
import NavbarComponent from "../components/Navbar";

function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Image Color Picker</title>

        <meta
          name="description"
          content="Learn more about Image Color Picker, a free online tool for extracting colors and generating color palettes from images."
        />
      </Helmet>

      <NavbarComponent />

      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="text-center mb-4">
              About Image Color Picker
            </h1>

            <p>
              Image Color Picker is a free online tool that helps
              designers, developers, artists, and creators extract
              colors from images and create beautiful color palettes.
            </p>

            <p>
              Simply upload an image and our tool analyzes it to
              identify important colors and generate HEX color codes.
              You can also save your favorite palettes and download
              your color data.
            </p>

            <h2 className="mt-5 mb-3">
              Our Mission
            </h2>

            <p>
              Our mission is to make color discovery simple, fast,
              and accessible to everyone. Whether you are designing
              a website, creating a brand identity, or looking for
              color inspiration, Image Color Picker can help.
            </p>

            <h2 className="mt-5 mb-3">
              Who Is It For?
            </h2>

            <ul>
              <li>Web Designers</li>
              <li>Graphic Designers</li>
              <li>Developers</li>
              <li>Photographers</li>
              <li>Artists</li>
              <li>Content Creators</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}

export default About;