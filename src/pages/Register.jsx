import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

function Register() {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        uid: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            await axios.post(`${BASE_URL}/auth/register`, formData);
            navigate("/", { state: { message: "Registration successful. Please login." } });
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Registration failed";
            setErrorMessage(message);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">

                <div className="login-card-left">
                    <h1>Create Account</h1>
                    <p>Join Campus Recruitment Management System</p>
                </div>

                <div className="login-card-right">
                    <div className="login-form">
                        <h2>Register</h2>

                        {errorMessage && (
                            <p className="error-text">{errorMessage}</p>
                        )}

                        <form onSubmit={handleSubmit}>
                            <input name="uid" placeholder="UID" value={formData.uid} onChange={handleChange} required />
                            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                            <button type="submit">Register</button>
                        </form>

                        <p className="login-register-text">
                            Already have an account? <Link to="/">Login</Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Register;