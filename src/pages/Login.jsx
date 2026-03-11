import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { BASE_URL } from "../config";

function Login() {

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.message;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {

            const response = await axios.post(
                `${BASE_URL}/auth/login`,
                { identifier, password }
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("profileCreated", response.data.profileCreated);

            navigate(response.data.role === "ADMIN" ? "/admin" : "/student");

        } catch (error) {

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Invalid Credentials";

            setErrorMessage(message);
        }
    };

    return (
        <div className="login-wrapper">

            <div className="login-card">

                <div className="login-card-left">
                    <h1>Welcome to CRMS</h1>
                    <p>Campus Recruitment Management System</p>
                    <p>✔ Manage placement drives efficiently</p>
                    <p>✔ Apply to opportunities seamlessly</p>
                    <p>✔ Track your recruitment progress</p>
                </div>

                <div className="login-card-right">

                    <div className="login-form">

                        <div className="mobile-crms">CRMS</div>

                        <h2>Login</h2>

                        {successMessage && (
                            <p className="success-text">{successMessage}</p>
                        )}

                        {errorMessage && (
                            <p className="error-text">{errorMessage}</p>
                        )}

                        <form onSubmit={handleSubmit}>

                            <input
                                placeholder="Email"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />

                            <div className="password-field">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <span
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </span>

                            </div>

                            <button type="submit">
                                Login
                            </button>

                        </form>

                        <p className="login-register-text">
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </p>

                        <p className="login-register-text">
                            Don't have an account? <Link to="/register">Register</Link>
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;