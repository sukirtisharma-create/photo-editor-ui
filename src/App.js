import { useState } from "react";

function App() {
  const [token, setToken] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  // CHANGE THIS depending on where auth is running
  const AUTH_URL = "https://auth-service-production-0326.up.railway.app/auth/login";
  const IMAGE_URL = "https://image-service-production-1c85.up.railway.app/image/grayscale";

  const login = async () => {
    const res = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "test", password: "test" })
    });

    const data = await res.json();
    setToken(data.token);
    alert("Logged in successfully");
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch(IMAGE_URL, {
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
    <div style={{ padding: 30 }}>
      <h2>Photo Editor</h2>

      <button onClick={login}>Login</button>

      <hr />

      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <br /><br />

      <button onClick={uploadImage} disabled={!token}>
        Convert to Grayscale
      </button>

      <hr />

      {result && <img src={result} alt="result" />}
    </div>
  );
}

export default App;