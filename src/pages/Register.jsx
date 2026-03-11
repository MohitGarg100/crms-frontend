import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        uid: "",
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const uidRegex = /^[a-zA-Z0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [validation, setValidation] = useState({
        uidValid: false,
        emailValid: false
    });

    const passwordRules = {
        length: formData.password.length >= 8 && formData.password.length <= 15,
        upper: /[A-Z]/.test(formData.password),
        lower: /[a-z]/.test(formData.password),
        digit: /\d/.test(formData.password),
        special: /[@_$]/.test(formData.password)
    };

    const passwordValid =
        passwordRules.length &&
        passwordRules.upper &&
        passwordRules.lower &&
        passwordRules.digit &&
        passwordRules.special;

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "uid") {
            setValidation(prev => ({
                ...prev,
                uidValid: uidRegex.test(value)
            }));
        }

        if (name === "email") {
            setValidation(prev => ({
                ...prev,
                emailValid: emailRegex.test(value)
            }));
        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setErrorMessage("");

        if (!validation.uidValid || !validation.emailValid || !passwordValid) {
            setErrorMessage("Please correct the highlighted fields.");
            return;
        }

        try {

            setLoading(true);

            await axios.post(`${BASE_URL}/auth/register`, formData);

            navigate("/", {
                state: { message: "Your account has been created successfully. Please check your email to verify your account before logging in." }
            });

        } catch (error) {

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Registration failed";

            setErrorMessage(message);

        } finally {
            setLoading(false);
        }

    };

    const formValid =
        validation.uidValid &&
        validation.emailValid &&
        passwordValid;

    return (

        <div className="login-wrapper">

            <div className="login-card">

                <div className="login-card-left">
                    <h1>Create Account</h1>
                    <p>Join the Campus Recruitment Management System</p>
                    <p>✔ Access placement opportunities</p>
                    <p>✔ Apply to company drives</p>
                    <p>✔ Track your recruitment progress</p>
                    <p>✔ Manage your professional profile</p>
                </div>

                <div className="login-card-right">

                    <div className="login-form">

                        <div className="mobile-crms">CRMS</div>

                        <h2>Register</h2>

                        {errorMessage && (
                            <p className="error-text">{errorMessage}</p>
                        )}

                        <form onSubmit={handleSubmit}>

                            <input
                                name="uid"
                                placeholder="UID"
                                value={formData.uid}
                                onChange={handleChange}
                                required
                            />

                            {!validation.uidValid && formData.uid.length > 0 && (
                                <p className="validation-text">
                                    UID can contain only letters and numbers.
                                </p>
                            )}

                            <input
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            {!validation.emailValid && formData.email.length > 0 && (
                                <p className="validation-text">
                                    Enter a valid email address.
                                </p>
                            )}

                            <div className="password-field">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                <span
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </span>

                            </div>

                            <div className="password-rules">

                                <p className={passwordRules.length ? "rule-valid" : "rule-invalid"}>
                                    8–15 characters
                                </p>

                                <p className={passwordRules.upper ? "rule-valid" : "rule-invalid"}>
                                    At least one uppercase letter
                                </p>

                                <p className={passwordRules.lower ? "rule-valid" : "rule-invalid"}>
                                    At least one lowercase letter
                                </p>

                                <p className={passwordRules.digit ? "rule-valid" : "rule-invalid"}>
                                    At least one number
                                </p>

                                <p className={passwordRules.special ? "rule-valid" : "rule-invalid"}>
                                    One special character (@ _ $)
                                </p>

                            </div>

                            <button
                                type="submit"
                                className={!formValid ? "btn-disabled" : ""}
                                disabled={!formValid || loading}
                            >
                                {loading ? "Registering..." : "Register"}
                            </button>

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