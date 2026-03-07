import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { BASE_URL } from "../config";

function CreateProfile(){

const navigate=useNavigate();
const token=localStorage.getItem("token");

const [errorMessage,setErrorMessage]=useState("");
const [loading,setLoading]=useState(false);

const [formData,setFormData]=useState({
fullName:"",
gender:"",
course:"",
stream:"",
tenthPercentage:"",
twelfthPercentage:"",
graduationCgpa:"",
postGraduationCgpa:"",
hasActiveBacklog:false,
numberOfActiveBacklogs:0,
mobile:"",
resumeUrl:""
});

const streamsBE=[
"Computer Science and Engineering",
"Mechanical Engineering",
"Electrical Engineering",
"Civil Engineering",
"Chemical Engineering",
"Textile Engineering"
];

const streamsME=[...streamsBE,"Artificial Intelligence"];

const nameRegex=/^[A-Za-z ]+$/;
const digitsOnly=/^[0-9]*$/;
const mobileRegex=/^[1-9][0-9]{9}$/;

const percentageValid=(v)=>v>0 && v<=100;
const cgpaValid=(v)=>v>0 && v<=10;

const handleChange=(e)=>{

const {name,value,type,checked}=e.target;

if(type==="checkbox"){
setFormData(prev=>({
...prev,
hasActiveBacklog:checked,
numberOfActiveBacklogs:checked?prev.numberOfActiveBacklogs:0
}));
return;
}

setFormData(prev=>({...prev,[name]:value}));
};

const streamOptions=
formData.course==="Bachelor of Engineering"
?streamsBE
:formData.course==="Master of Engineering"
?streamsME
:[];

const formValid=
nameRegex.test(formData.fullName)&&
formData.gender&&
formData.course&&
formData.stream&&
percentageValid(parseFloat(formData.tenthPercentage))&&
percentageValid(parseFloat(formData.twelfthPercentage))&&
cgpaValid(parseFloat(formData.graduationCgpa))&&
(formData.postGraduationCgpa===""||cgpaValid(parseFloat(formData.postGraduationCgpa)))&&
(!formData.hasActiveBacklog||formData.numberOfActiveBacklogs>0)&&
mobileRegex.test(formData.mobile);

const handleSubmit=async(e)=>{

e.preventDefault();

if(!formValid){
setErrorMessage("Please correct invalid fields.");
return;
}

try{

setLoading(true);

await axios.post(`${BASE_URL}/students/profile`,
{
...formData,
tenthPercentage:parseFloat(formData.tenthPercentage),
twelfthPercentage:parseFloat(formData.twelfthPercentage),
graduationCgpa:parseFloat(formData.graduationCgpa),
postGraduationCgpa:
formData.postGraduationCgpa===""
?0
:parseFloat(formData.postGraduationCgpa),
numberOfActiveBacklogs:parseInt(formData.numberOfActiveBacklogs)
},
{
headers:{Authorization:`Bearer ${token}`}
});

localStorage.setItem("profileCreated","true");
navigate("/student");

}
catch(error){
setErrorMessage(error.response?.data?.message||"Failed to create profile");
}
finally{
setLoading(false);
}
};

return(
<>
<Navbar/>

<div className="container">

<h2>Create Profile</h2>

{errorMessage && <p className="error-text">{errorMessage}</p>}

<form onSubmit={handleSubmit} className="profile-form">

<div className="section-title">Personal Information</div>

<div>
<label>Full Name</label>
<input name="fullName" value={formData.fullName} onChange={handleChange}/>
{!nameRegex.test(formData.fullName)&&formData.fullName&&(
<p className="validation-text">Only alphabets allowed</p>
)}
</div>

<div>
<label>Gender</label>
<select name="gender" value={formData.gender} onChange={handleChange}>
<option value="">Select Gender</option>
<option>Male</option>
<option>Female</option>
<option>Transgender</option>
</select>
</div>

<div>
<label>Mobile Number</label>
<input
name="mobile"
value={formData.mobile}
onChange={handleChange}
autoComplete="off"
/>

{!digitsOnly.test(formData.mobile)&&(
<p className="validation-text">Only digits allowed</p>
)}

{digitsOnly.test(formData.mobile)&&formData.mobile.startsWith("0")&&(
<p className="validation-text">Mobile cannot start with 0</p>
)}

{digitsOnly.test(formData.mobile)&&
!formData.mobile.startsWith("0") &&
formData.mobile &&
formData.mobile.length!==10&&(
<p className="validation-text">Mobile must be exactly 10 digits</p>
)}

</div>

<div className="section-title">Academic Information</div>

<div>
<label>Course</label>
<select name="course" value={formData.course} onChange={handleChange}>
<option value="">Select Course</option>
<option>Bachelor of Engineering</option>
<option>Master of Engineering</option>
</select>
</div>

<div>
<label>Stream</label>
<select name="stream" value={formData.stream} onChange={handleChange} disabled={!formData.course}>
<option value="">Select Stream</option>
{streamOptions.map(s=><option key={s}>{s}</option>)}
</select>
</div>

<div>
<label>10th Percentage</label>
<input type="number" step="0.01" name="tenthPercentage" value={formData.tenthPercentage} onChange={handleChange}/>
{formData.tenthPercentage&&!percentageValid(parseFloat(formData.tenthPercentage))&&(
<p className="validation-text">1-100 allowed</p>
)}
</div>

<div>
<label>12th Percentage</label>
<input type="number" step="0.01" name="twelfthPercentage" value={formData.twelfthPercentage} onChange={handleChange}/>
{formData.twelfthPercentage&&!percentageValid(parseFloat(formData.twelfthPercentage))&&(
<p className="validation-text">1-100 allowed</p>
)}
</div>

<div>
<label>Graduation CGPA</label>
<input type="number" step="0.01" name="graduationCgpa" value={formData.graduationCgpa} onChange={handleChange}/>
{formData.graduationCgpa&&!cgpaValid(parseFloat(formData.graduationCgpa))&&(
<p className="validation-text">1-10 allowed</p>
)}
</div>

<div>
<label>Post Graduation CGPA (optional)</label>
<input type="number" step="0.01" name="postGraduationCgpa" value={formData.postGraduationCgpa} onChange={handleChange}/>
{formData.postGraduationCgpa&&!cgpaValid(parseFloat(formData.postGraduationCgpa))&&(
<p className="validation-text">1-10 allowed</p>
)}
</div>

<div className="section-title">Backlog</div>

<div className="profile-checkbox">
<input type="checkbox" name="hasActiveBacklog" checked={formData.hasActiveBacklog} onChange={handleChange}/>
<label>Active Backlog?</label>
</div>

<div>
<label>Number of Backlogs</label>
<input type="number" name="numberOfActiveBacklogs" disabled={!formData.hasActiveBacklog}
value={formData.numberOfActiveBacklogs} onChange={handleChange}/>
{formData.hasActiveBacklog && formData.numberOfActiveBacklogs<=0&&(
<p className="validation-text">Must be at least 1</p>
)}
</div>

<div className="section-title">Documents</div>

<div className="full-width">
<label>Resume URL</label>
<input name="resumeUrl" value={formData.resumeUrl} onChange={handleChange}/>
</div>

<button className={`btn btn-primary full-width ${!formValid?"btn-disabled":""}`}
disabled={!formValid||loading}>
{loading?"Creating Profile...":"Create Profile"}
</button>

</form>
</div>
</>
);
}

export default CreateProfile;