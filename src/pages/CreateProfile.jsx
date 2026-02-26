import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BASE_URL } from "../config";

function CreateProfile() {

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        gender: "",
        course: "",
        stream: "",
        tenthPercentage: "",
        twelfthPercentage: "",
        graduationCgpa: "",
        postGraduationCgpa: "",
        hasActiveBacklog: false,
        numberOfActiveBacklogs: "",
        mobile: "",
        resumeUrl: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            await axios.post(`${BASE_URL}/students/${userId}/profile`, {
                ...formData,
                tenthPercentage: parseFloat(formData.tenthPercentage),
                twelfthPercentage: parseFloat(formData.twelfthPercentage),
                graduationCgpa: parseFloat(formData.graduationCgpa),
                postGraduationCgpa: parseFloat(formData.postGraduationCgpa),
                numberOfActiveBacklogs: parseInt(formData.numberOfActiveBacklogs)
            });

            localStorage.setItem("profileCreated", "true");
            navigate("/student");

        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to create profile");
        }
    };

    return (
        <>
            <Navbar />

            <div className="container">
                <h2>Create Profile</h2>

                {errorMessage && <p className="error-text">{errorMessage}</p>}

                <form onSubmit={handleSubmit} className="profile-form">
                    <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
                    <input name="gender" placeholder="Gender" onChange={handleChange} required />
                    <input name="course" placeholder="Course" onChange={handleChange} required />
                    <input name="stream" placeholder="Stream" onChange={handleChange} required />
                    <input name="tenthPercentage" placeholder="10th %" onChange={handleChange} required />
                    <input name="twelfthPercentage" placeholder="12th %" onChange={handleChange} required />
                    <input name="graduationCgpa" placeholder="Graduation CGPA" onChange={handleChange} />
                    <input name="postGraduationCgpa" placeholder="Post Graduation CGPA" onChange={handleChange} />

                    <div className="profile-checkbox">
                        <input type="checkbox" name="hasActiveBacklog" onChange={handleChange} />
                        <label>Active Backlog?</label>
                    </div>

                    <input name="numberOfActiveBacklogs" placeholder="Number of Backlogs" onChange={handleChange} />
                    <input name="mobile" placeholder="Mobile Number" onChange={handleChange} required />
                    <input className="full-width" name="resumeUrl" placeholder="Resume URL" onChange={handleChange} />

                    <button className="btn btn-primary full-width" type="submit">
                        Submit Profile
                    </button>
                </form>
            </div>
        </>
    );
}

export default CreateProfile;