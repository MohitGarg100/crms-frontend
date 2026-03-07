import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const initialForm = {
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
        placementProcess: ""
    };

    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [drives, setDrives] = useState([]);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchDrives();
    }, []);

    const showMessage = (text, type) => {

        setMessage({ text, type });

        setTimeout(() => {
            setMessage(null);
        }, 3000);
    };

    const fetchDrives = async () => {

        try {

            const response = await axios.get(
                `${BASE_URL}/admin/drives/open`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setDrives(response.data);

        } catch {
            showMessage("Failed to fetch drives", "error");
        }
    };

    const validateField = (name, value) => {

        let error = "";

        if (!value.trim()) {
            error = "This field is required";
        }

        if (name === "batch") {
            if (!/^20[2-9][0-9]$/.test(value)) {
                error = "Enter valid year (2024-2050)";
            }
        }

        if (name === "payPackage") {
            if (!/^\d{1,2}(\.\d)?$/.test(value)) {
                error = "Enter valid package (e.g. 10 or 12.5)";
            }
        }

        if (name === "jobLocation") {
            if (!/^[A-Za-z ]{2,40}$/.test(value)) {
                error = "Only letters allowed";
            }
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        validateField(name, value);
    };

    const isFormValid = () => {

        for (let key in formData) {
            if (!formData[key]) return false;
        }

        for (let key in errors) {
            if (errors[key]) return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!isFormValid()) return;

        try {

            await axios.post(
                `${BASE_URL}/admin/drives`,
                { ...formData, status: "OPEN" },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            showMessage("Drive created successfully", "success");

            setFormData(initialForm);

            fetchDrives();

        } catch {
            showMessage("Failed to create drive", "error");
        }
    };

    const handleCloseDrive = async (driveId) => {

        try {

            await axios.put(
                `${BASE_URL}/admin/drives/${driveId}/close`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            showMessage("Drive closed", "success");

            fetchDrives();

        } catch {
            showMessage("Failed to close drive", "error");
        }
    };

    return (
        <>
            <Navbar />

            <div className="container">

                <h2>Admin Dashboard</h2>

                <p style={{ marginBottom: "20px", color: "#555" }}>
                    Manage placement drives and monitor applicants
                </p>

                {message && (
                    <p className={message.type === "success" ? "success-text" : "error-text"}>
                        {message.text}
                    </p>
                )}

                <div className="stat-card">
                    <h3>Total Active Drives</h3>
                    <div className="stat-number">{drives.length}</div>
                </div>

                <h3>Create Drive</h3>

                <form className="admin-drive-form" onSubmit={handleSubmit}>

                    <div>
                        <input
                            name="companyName"
                            placeholder="Company Name"
                            value={formData.companyName}
                            onChange={handleChange}
                        />
                        {errors.companyName && <small className="error-text">{errors.companyName}</small>}
                    </div>

                    <select name="driveType" value={formData.driveType} onChange={handleChange}>
                        <option value="">Drive Type</option>
                        <option value="ONLINE">On Campus</option>
                        <option value="OFFLINE">Off Campus</option>
                        <option value="HYBRID">Hybrid</option>
                    </select>

                    <select name="driveDateType" value={formData.driveDateType} onChange={handleChange}>
                        <option value="">Date Type</option>
                        <option value="SINGLE_DAY">Single Day</option>
                        <option value="DATE_RANGE">Date Range</option>
                        <option value="TO_BE_ANNOUNCED">TBA</option>
                    </select>

                    <input
                        name="driveDateNote"
                        placeholder="Drive Date Note"
                        value={formData.driveDateNote}
                        onChange={handleChange}
                    />

                    <select name="streamRequired" value={formData.streamRequired} onChange={handleChange}>
                        <option value="">Stream Required</option>
                        <option>CSE</option>
                        <option>Mechanical</option>
                        <option>Electrical</option>
                        <option>Civil</option>
                        <option>Chemical</option>
                        <option>Textile</option>
                        <option>AI</option>
                    </select>

                    <input
                        name="eligibilityCriteria"
                        placeholder="Eligibility Criteria"
                        value={formData.eligibilityCriteria}
                        onChange={handleChange}
                    />

                    <input
                        name="batch"
                        placeholder="Batch (e.g. 2026)"
                        value={formData.batch}
                        onChange={handleChange}
                    />
                    {errors.batch && <small className="error-text">{errors.batch}</small>}

                    <input
                        name="position"
                        placeholder="Position"
                        value={formData.position}
                        onChange={handleChange}
                    />

                    <input
                        name="jobProfile"
                        placeholder="Job Profile"
                        value={formData.jobProfile}
                        onChange={handleChange}
                    />

                    <input
                        name="jobLocation"
                        placeholder="Job Location"
                        value={formData.jobLocation}
                        onChange={handleChange}
                    />
                    {errors.jobLocation && <small className="error-text">{errors.jobLocation}</small>}

                    <input
                        name="payPackage"
                        placeholder="Pay Package"
                        value={formData.payPackage}
                        onChange={handleChange}
                    />
                    {errors.payPackage && <small className="error-text">{errors.payPackage}</small>}

                    <select name="bondOrFee" value={formData.bondOrFee} onChange={handleChange}>
                        <option value="">Bond / Fee</option>
                        <option>No Bond</option>
                        <option>1 Year Bond</option>
                        <option>2 Year Bond</option>
                        <option>Service Agreement</option>
                    </select>

                    <input
                        className="full-width"
                        name="placementProcess"
                        placeholder="Placement Process"
                        value={formData.placementProcess}
                        onChange={handleChange}
                    />

                    <button
                        className="btn btn-primary full-width"
                        disabled={!isFormValid()}
                    >
                        Create Drive
                    </button>

                </form>

                <h3 style={{ marginTop: "40px" }}>Manage Drives</h3>

                <div className="drive-grid">

                    {drives.map(drive => (

                        <div key={drive.id} className="drive-card">

                            <div>
                                <div className="drive-company">{drive.companyName}</div>
                                <div className="drive-detail">Position: {drive.position}</div>
                                <div className="drive-package">Package: {drive.payPackage} LPA</div>
                            </div>

                            <div className="drive-actions">

                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate(`/admin/applicants/${drive.id}`)}
                                >
                                    View Applicants
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleCloseDrive(drive.id)}
                                >
                                    Close Drive
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </div>
        </>
    );
}

export default AdminDashboard;