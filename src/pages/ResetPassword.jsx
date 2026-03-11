import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

function ResetPassword() {

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const rules = {
    length: password.length >= 8 && password.length <= 15,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@_$]/.test(password)
  };

  const valid =
    rules.length &&
    rules.upper &&
    rules.lower &&
    rules.number &&
    rules.special;

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or expired reset link.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!valid) return;

    setLoading(true);

    try {

      const res = await fetch(
        `${BASE_URL}/auth/reset-password?token=${encodeURIComponent(
          token
        )}&newPassword=${encodeURIComponent(password)}`,
        { method: "POST" }
      );

      const text = await res.text();
      setMessage(text);

      if (res.ok) {
        setTimeout(() => {
          navigate("/");
        }, 2500);
      }

    } catch {
      setMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={wrapper}>
      <div style={card}>

        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit}>

          <div style={passwordBox}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={input}
              required
            />

            <span
              style={toggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <div style={rulesBox}>
            <p style={rules.length ? green : red}>8–15 characters</p>
            <p style={rules.upper ? green : red}>At least one uppercase letter</p>
            <p style={rules.lower ? green : red}>At least one lowercase letter</p>
            <p style={rules.number ? green : red}>At least one number</p>
            <p style={rules.special ? green : red}>One special character (@ _ $)</p>
          </div>

          <button
            type="submit"
            disabled={!valid || loading}
            style={{
              ...button,
              backgroundColor: valid ? "#2563eb" : "#9ca3af"
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
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
  border: "1px solid #ccc",
  borderRadius: "5px"
};

const passwordBox = {
  position: "relative",
  marginBottom: "10px"
};

const toggle = {
  position: "absolute",
  right: "10px",
  top: "10px",
  cursor: "pointer",
  fontSize: "12px",
  color: "#2563eb"
};

const rulesBox = {
  textAlign: "left",
  fontSize: "12px",
  marginBottom: "10px"
};

const red = { color: "red" };
const green = { color: "green" };

const button = {
  width: "100%",
  padding: "10px",
  border: "none",
  color: "white",
  borderRadius: "5px",
  cursor: "pointer"
};

const messageStyle = {
  marginTop: "15px"
};

export default ResetPassword;