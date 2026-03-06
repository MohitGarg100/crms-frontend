import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BASE_URL } from "../config";

function AdminDashboard() {

    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        companyName: "",
        driveType: "",
        driveDateType: "",
        driveDateNote: "",
        streamRequired: "",
        eligibilityCriteria: "",
        batch: "",
        position: "",
        jobProfile: "",
        jobLocation: "",
        payPackage: "",
        bondOrFee: "",
        placementProcess: "",
    });

    const [drives, setDrives] = useState([]);
    const [applicants, setApplicants] = useState({});
    const [selectedDrive, setSelectedDrive] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const response = await axios.get(
                `${BASE_URL}/admin/drives/open`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setDrives(response.data);

        } catch {
            setErrorMessage("Failed to fetch drives");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await axios.post(
                `${BASE_URL}/admin/drives`,
                {
                    ...formData,
                    status: "OPEN"
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccessMessage("Drive created successfully");

            setFormData({
                companyName: "",
                driveType: "",
                driveDateType: "",
                driveDateNote: "",
                streamRequired: "",
                eligibilityCriteria: "",
                batch: "",
                position: "",
                jobProfile: "",
                jobLocation: "",
                payPackage: "",
                bondOrFee: "",
                placementProcess: "",
            });

            fetchDrives();

        } catch {
            setErrorMessage("Failed to create drive");
        }
    };

    const handleViewApplicant = async (driveId) => {
        try {
            const response = await axios.get(
                `${BASE_URL}/admin/drives/${driveId}/applicants`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setApplicants(prev => ({
                ...prev,
                [driveId]: response.data
            }));

            setSelectedDrive(driveId);

        } catch {
            setErrorMessage("Failed to fetch applicants");
        }
    };

    const handleCloseDrive = async (driveId) => {
        try {
            await axios.put(
                `${BASE_URL}/admin/drives/${driveId}/close`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSuccessMessage("Drive closed successfully");
            fetchDrives();

        } catch {
            setErrorMessage("Failed to close drive");
        }
    };

    return (
        <>
            <Navbar />

            <div className="container">

                <div className="page-section">
                    <h2>Admin Dashboard</h2>
                    <p style={{ color: "#555" }}>
                        Manage placement drives and monitor applicants.
                    </p>
                </div>

                {successMessage && <p className="success-text">{successMessage}</p>}
                {errorMessage && <p className="error-text">{errorMessage}</p>}

                <div className="card">
                    <h3>Total Active Drives</h3>
                    <p className="dashboard-count">{drives.length}</p>
                </div>

                <div className="page-section">
                    <h3>Create Drive</h3>

                    <form onSubmit={handleSubmit}>
                        <input name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required />

                        <select name="driveType" value={formData.driveType} onChange={handleChange} required>
                            <option value="">Select Drive Type</option>
                            <option value="ONLINE">On Campus</option>
                            <option value="OFFLINE">Off Campus</option>
                            <option value="HYBRID">Hybrid</option>
                        </select>

                        <select name="driveDateType" value={formData.driveDateType} onChange={handleChange} required>
                            <option value="">Select Date Type</option>
                            <option value="SINGLE_DAY">Single Date</option>
                            <option value="DATE_RANGE">Date Range</option>
                            <option value="TO_BE_ANNOUNCED">To Be Announced</option>
                        </select>

                        <input name="driveDateNote" placeholder="Drive Date Note" value={formData.driveDateNote} onChange={handleChange} required />
                        <input name="streamRequired" placeholder="Stream Required" value={formData.streamRequired} onChange={handleChange} required />
                        <input name="eligibilityCriteria" placeholder="Eligibility Criteria" value={formData.eligibilityCriteria} onChange={handleChange} required />
                        <input name="batch" placeholder="Batch" value={formData.batch} onChange={handleChange} required />
                        <input name="position" placeholder="Position" value={formData.position} onChange={handleChange} required />
                        <input name="jobProfile" placeholder="Job Profile" value={formData.jobProfile} onChange={handleChange} />
                        <input name="jobLocation" placeholder="Job Location" value={formData.jobLocation} onChange={handleChange} required />
                        <input name="payPackage" placeholder="Pay Package" value={formData.payPackage} onChange={handleChange} required />
                        <input name="bondOrFee" placeholder="Bond or Fee" value={formData.bondOrFee} onChange={handleChange} required />
                        <input name="placementProcess" placeholder="Placement Process" value={formData.placementProcess} onChange={handleChange} required />

                        <button className="btn btn-primary" type="submit">
                            Create Drive
                        </button>
                    </form>
                </div>

                <div className="page-section">
                    <h3>Manage Drives</h3>

                    {drives.map(drive => (
                        <div key={drive.id} className="card">
                            <h4>{drive.companyName}</h4>
                            <p><strong>Position:</strong> {drive.position}</p>
                            <p><strong>Package:</strong> {drive.payPackage}</p>

                            <button className="btn btn-primary" onClick={() => handleViewApplicant(drive.id)}>
                                View Applicants
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={() => handleCloseDrive(drive.id)}
                                style={{ marginLeft: "10px" }}
                            >
                                Close Drive
                            </button>

                            {selectedDrive === drive.id && applicants[drive.id] && (
                                <div className="page-section">
                                    <h5>Applicants</h5>

                                    {applicants[drive.id].length === 0 ? (
                                        <p>No applicants yet</p>
                                    ) : (
                                        applicants[drive.id].map(app => (
                                            <div key={app.id}>
                                                <p><strong>ID:</strong> {app.student.id}</p>
                                                <p><strong>Email:</strong> {app.student.email}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                </div>

            </div>
        </>
    );
}

export default AdminDashboard;