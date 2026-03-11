import { useState } from "react";
import { BASE_URL } from "../config";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {

      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setMessage(
          "If an account with this email exists, a reset link has been sent."
        );
      } else {
        setMessage("Failed to send reset link.");
      }

    } catch {
      setMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={wrapper}>

      <div style={card}>

        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={input}
          />

          <button
            type="submit"
            disabled={loading}
            style={button}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        {message && <p style={messageStyle}>{message}</p>}

      </div>

    </div>
  );
}

const wrapper = {
  display: "flex",
  justifyContent: "center",
  marginTop: "100px"
};

const card = {
  width: "320px",
  padding: "30px",
  borderRadius: "10px",
  background: "#ffffff",
  boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
  textAlign: "center"
};

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  marginBottom: "15px"
};

const button = {
  width: "100%",
  padding: "10px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer"
};

const messageStyle = {
  marginTop: "15px"
};

export default ForgotPassword;