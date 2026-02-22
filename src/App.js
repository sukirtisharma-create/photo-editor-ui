import { useState } from "react";

function App() {
  const [token, setToken] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  // filters
  const [grayscale, setGrayscale] = useState(false);
  const [resize, setResize] = useState(false);
  const [blur, setBlur] = useState(false);
  const [rotate, setRotate] = useState(false);

  // params
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [angle, setAngle] = useState(90);

  const AUTH_URL =
    "https://auth-service-production-0326.up.railway.app/auth/login";

  const IMAGE_PROCESS_URL =
    "https://image-service-production-1c85.up.railway.app/image/process";

  const login = async () => {
    const res = await fetch(AUTH_URL, { method: "POST" });
    const data = await res.json();
    setToken(data.token);
    alert("Logged in");
  };

  const processImage = async () => {
    const steps = [];
    if (grayscale) steps.push("grayscale");
    if (resize) steps.push("resize");
    if (blur) steps.push("blur");
    if (rotate) steps.push("rotate");

    if (steps.length === 0) {
      alert("Select at least one filter");
      return;
    }

    const params = new URLSearchParams({
      steps: steps.join(","),
      width,
      height,
      angle
    });

    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch(`${IMAGE_PROCESS_URL}?${params.toString()}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const blob = await res.blob();
    setResult(URL.createObjectURL(blob));
  };

  return (
    <div style={{ padding: 30, maxWidth: 600 }}>
      <h2>Photo Editor (Pipeline)</h2>

      <button onClick={login}>Login</button>

      <hr />

      <input type="file" onChange={e => setImage(e.target.files[0])} />

      <h3>Filters</h3>

      {/* Grayscale */}
      <label>
        <input
          type="checkbox"
          checked={grayscale}
          onChange={e => setGrayscale(e.target.checked)}
        />
        Grayscale
      </label>

      <br />

      {/* Resize */}
      <label>
        <input
          type="checkbox"
          checked={resize}
          onChange={e => setResize(e.target.checked)}
        />
        Resize
      </label>

      {resize && (
        <div>
          Width:
          <input
            type="number"
            value={width}
            onChange={e => setWidth(e.target.value)}
          />
          Height:
          <input
            type="number"
            value={height}
            onChange={e => setHeight(e.target.value)}
          />
        </div>
      )}

      <br />

      {/* Blur */}
      <label>
        <input
          type="checkbox"
          checked={blur}
          onChange={e => setBlur(e.target.checked)}
        />
        Blur
      </label>

      <br />

      {/* Rotate */}
      <label>
        <input
          type="checkbox"
          checked={rotate}
          onChange={e => setRotate(e.target.checked)}
        />
        Rotate
      </label>

      {rotate && (
        <div>
          Angle:
          <input
            type="number"
            value={angle}
            onChange={e => setAngle(e.target.value)}
          />
        </div>
      )}

      <br /><br />

      <button onClick={processImage} disabled={!token || !image}>
        Process Image
      </button>

      <hr />

      {result && <img src={result} alt="result" />}
    </div>
  );
}

export default App;