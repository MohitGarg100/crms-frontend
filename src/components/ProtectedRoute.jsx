import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
    
    const role = localStorage.getItem("role");
    const profileCreated = localStorage.getItem("profileCreated") === "true";
    const location = useLocation();

    if (!role) {
        return <Navigate to="/" />;
    }

    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/" />;
    }

    if (
        role === "STUDENT" &&
        !profileCreated &&
        location.pathname !== "/create-profile"
    ) {
        return <Navigate to="/create-profile" />;
    }

    return children;
}

export default ProtectedRoute;