import { useNavigate, Link } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">
                    CRMS
                </Link>
            </div>

            <div className="navbar-right">
                <span className="role-badge">
                    {role}
                </span>

                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;