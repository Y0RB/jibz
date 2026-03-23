import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5231/api/Health")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.status);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Jibz App</h1>
      <p>API Status: {message}</p>
    </div>
  );
}

export default App;