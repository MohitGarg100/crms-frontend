import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BASE_URL } from "../config";

function StudentDashboard() {

    const [drives, setDrives] = useState([]);
    const [message, setMessage] = useState(null);
    const [appliedDrives, setAppliedDrives] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchOpenDrives();
    }, []);

    const showMessage = (text, type) => {

        setMessage({ text, type });

        setTimeout(() => {
            setMessage(null);
        }, 3000);
    };

    const fetchOpenDrives = async () => {

        try {

            const response = await axios.get(
                `${BASE_URL}/students/drives/open`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Sort drives by highest package
            const sortedDrives = response.data.sort(
                (a, b) => parseFloat(b.payPackage) - parseFloat(a.payPackage)
            );

            setDrives(sortedDrives);

        } catch {
            showMessage("Failed to fetch drives", "error");
        }
    };

    const handleApply = async (drive) => {

        try {

            await axios.post(
                `${BASE_URL}/students/drives/${drive.id}/apply`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAppliedDrives(prev => [...prev, drive.id]);

            showMessage(
                `Applied to ${drive.companyName} successfully`,
                "success"
            );

        } catch (error) {

            const msg =
                error.response?.data?.message ||
                "Failed to apply";

            showMessage(msg, "error");
        }
    };

    return (
        <>
            <Navbar />

            <div className="container">

                <div className="dashboard-header">
                    <h2>Student Dashboard</h2>
                </div>

                {message && (
                    <p className={message.type === "success" ? "success-text" : "error-text"}>
                        {message.text}
                    </p>
                )}

                <div className="dashboard-stats">

                    <div className="stat-card">
                        <h3>Total Open Drives</h3>
                        <div className="stat-number">{drives.length}</div>
                    </div>

                </div>

                <h3>Open Drives</h3>

                <div className="drive-grid">

                    {drives.map(drive => {

                        const applied = appliedDrives.includes(drive.id);

                        return (
                            <div key={drive.id} className="drive-card">

                                <div>

                                    <div className="drive-company">
                                        {drive.companyName}
                                    </div>

                                    <div className="drive-detail">
                                        Position: {drive.position}
                                    </div>

                                    <div className="drive-package">
                                        Package: {drive.payPackage} LPA
                                    </div>

                                </div>

                                <button
                                    className={`btn ${applied ? "btn-disabled" : "btn-primary"}`}
                                    disabled={applied}
                                    onClick={() => handleApply(drive)}
                                >
                                    {applied ? "Applied ✓" : "Apply"}
                                </button>

                            </div>
                        );
                    })}

                </div>

            </div>
        </>
    );
}

export default StudentDashboard;