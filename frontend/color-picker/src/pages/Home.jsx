// 14/07/2026
import NavbarComponent from "../components/Navbar";
import UploadBox from "../components/UploadBox";

function Home() {
  return (
    <>
      <NavbarComponent />

      <div className="container">
        <h1 className="text-center mt-5">
          Image Color Picker
        </h1>

        <UploadBox />
      </div>
    </>
  );
}

export default Home;