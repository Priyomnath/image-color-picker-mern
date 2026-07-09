import { Container } from "react-bootstrap";
import UploadBox from "./UploadBox";

function Hero() {

  return (

    <Container>

      <div className="text-center mt-5">

        <h1 className="fw-bold display-4">

          Extract Colors
          <br />
          From Any Image

        </h1>

        <p className="lead">

          Upload any image and get color palette instantly.

        </p>

      </div>

      <UploadBox />

    </Container>

  );

}

export default Hero;