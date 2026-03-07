import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BASE_URL } from "../config";

function ApplicantsPage() {

    const { driveId } = useParams();
    const token = localStorage.getItem("token");

    const [applicants, setApplicants] = useState([]);
    const [driveInfo, setDriveInfo] = useState(null);
    const [search, setSearch] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {

        try {

            const response = await axios.get(
                `${BASE_URL}/admin/drives/${driveId}/applicants`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = response.data;

            if (data.length > 0) {
                setDriveInfo(data[0].drive);
            }

            const sortedApplicants = data.sort(
                (a, b) => a.student.id - b.student.id
            );

            setApplicants(sortedApplicants);

        } catch {
            setErrorMessage("Failed to fetch applicants");
        }
    };

    const filteredApplicants = applicants.filter(app =>
        app.student.uid.toLowerCase().includes(search.toLowerCase()) ||
        app.student.email.toLowerCase().includes(search.toLowerCase())
    );

    const downloadCSV = () => {

        const header = ["StudentID", "UID", "Email", "AppliedAt"];

        const rows = filteredApplicants.map(app => [
            app.student.id,
            app.student.uid,
            app.student.email,
            new Date(app.appliedAt).toLocaleString()
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [header, ...rows].map(e => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute(
            "download",
            `${driveInfo?.companyName || "drive"}_applicants.csv`
        );

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <Navbar />

            <div className="container">

                <h2>Drive Applicants</h2>

                {driveInfo && (
                    <div className="drive-info-card">
                        <h3>{driveInfo.companyName}</h3>
                        <p><strong>Position:</strong> {driveInfo.position}</p>
                        <p><strong>Package:</strong> {driveInfo.payPackage} LPA</p>
                        <p><strong>Batch:</strong> {driveInfo.batch}</p>
                    </div>
                )}

                {errorMessage && (
                    <p className="error-text">{errorMessage}</p>
                )}

                <div className="applicants-toolbar">

                    <input
                        className="applicants-search"
                        placeholder="Search by UID or Email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                        className="btn btn-primary"
                        onClick={downloadCSV}
                    >
                        Download CSV
                    </button>

                </div>

                {filteredApplicants.length === 0 ? (
                    <p>No applicants found</p>
                ) : (

                    <div className="applicants-table-wrapper">

                        <table className="applicants-table">

                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>UID</th>
                                    <th>Email</th>
                                    <th>Applied At</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredApplicants.map(app => (

                                    <tr key={app.id}>

                                        <td>{app.student.id}</td>

                                        <td>{app.student.uid}</td>

                                        <td>{app.student.email}</td>

                                        <td>
                                            {new Date(app.appliedAt).toLocaleString()}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>
        </>
    );
}

export default ApplicantsPage;