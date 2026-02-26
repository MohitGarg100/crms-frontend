import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BASE_URL } from "../config";

function StudentDashboard() {

    const [drives, setDrives] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const studentId = localStorage.getItem("userId");

    useEffect(() => {
        fetchOpenDrives();
    }, []);

    const fetchOpenDrives = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/students/drives/open`);
            setDrives(response.data);
        } catch {
            setErrorMessage("Failed to fetch drives");
        }
    };

    const handleApply = async (driveId) => {
        try {
            await axios.post(`${BASE_URL}/students/drives/${driveId}/apply/${studentId}`);
            setSuccessMessage("Applied Successfully");
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to apply");
        }
    };

    return (
        <>
            <Navbar />

            <div className="container">

                <h2>Student Dashboard</h2>

                {successMessage && <p className="success-text">{successMessage}</p>}
                {errorMessage && <p className="error-text">{errorMessage}</p>}

                <div className="card">
                    <h3>Total Open Drives</h3>
                    <p className="dashboard-count">{drives.length}</p>
                </div>

                <div className="page-section">
                    <h3>Open Drives</h3>

                    {drives.map(drive => (
                        <div key={drive.id} className="card">
                            <h4>{drive.companyName}</h4>
                            <p><strong>Position:</strong> {drive.position}</p>
                            <p><strong>Package:</strong> {drive.payPackage}</p>

                            <button
                                className="btn btn-primary"
                                onClick={() => handleApply(drive.id)}
                            >
                                Apply
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}

export default StudentDashboard;