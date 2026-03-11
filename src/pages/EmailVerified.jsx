import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EmailVerified() {

  const navigate = useNavigate();

  useEffect(() => {

    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);

  }, [navigate]);

  return (
    <div style={wrapper}>

      <div style={card}>

        <h2>Email Verified Successfully ✅</h2>

        <p>You can now login to your account.</p>

        <p style={{ fontSize: "14px", color: "#666" }}>
          Redirecting to login...
        </p>

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

export default EmailVerified;