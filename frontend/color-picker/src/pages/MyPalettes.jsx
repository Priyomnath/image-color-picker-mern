import { useEffect, useState } from "react";
import api from "../api/api";

function MyPalettes() {
  const [palettes, setPalettes] = useState([]);

  const loadPalettes = async () => {
    try {
      const { data } = await api.get("/colors");
      setPalettes(data.palettes);
    } catch (err) {
      console.log(err);
    }
  };

  const deletePalette = async (id) => {
    try {
      await api.delete(`/colors/${id}`);
      loadPalettes();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPalettes();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Palettes</h2>

      <div className="row">
        {palettes.map((palette) => (
          <div className="col-md-4 mb-4" key={palette._id}>
            <div className="card shadow">

              <div
                style={{
                  height: "120px",
                  background: palette.dominantColor,
                }}
              />

              <div className="card-body">

                <h5>{palette.title}</h5>

                <p>{palette.dominantColor}</p>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {palette.colors.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        width: 25,
                        height: 25,
                        background: color,
                        borderRadius: 4,
                        border: "1px solid #ddd",
                      }}
                    />
                  ))}
                </div>

                <button
                  className="btn btn-danger w-100"
                  onClick={() => deletePalette(palette._id)}
                >
                  Delete
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPalettes;