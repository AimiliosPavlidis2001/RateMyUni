import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
    const [academicEmail, setAcademicEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [nationality, setNationality] = useState('');
    const [universityID, setUniversityID] = useState('');
    const [departmentID, setDepartmentID] = useState('');
    const [admissionYear, setAdmissionYear] = useState('');
    const [degreeLevel, setDegreeLevel] = useState('');

    const [universities, setUniversities] = useState([]);
    const [departments, setDepartments] = useState([]);
    
    const allUniversities = [];
    const allDepartments = [];

    const navigate = useNavigate();

    // to fetch all the Universities from all the pages and add them all together
    async function fetchAllUniversities(currentPage = 1) {
        const response = await fetch(`https://ratemyuni.onrender.com/getAllUniversities?page=${currentPage}`);
        const data = await response.json();
    
        // If the data the data.universities is undefined/null or it's not an array, stop the function
        if (!data.universities || !Array.isArray(data.universities)) {
            console.log("No more universities to fetch!");
            return;
        }
    
        allUniversities.push(...data.universities); // add all data to a single array
    
        // If the returned universities are less than 3, stop the recursion
        if (data.universities.length < 3) {
            console.log("All universities fetched!");
            setUniversities(allUniversities);
            return;
        }
    
        // Continue to the next page
        await fetchAllUniversities(currentPage + 1);
    }
    
    useEffect(() => {
        fetchAllUniversities();
    }, []);

    // to fetch all the Departments of a university from all the pages and add them all together
    async function fetchAllDepartments(universityId, currentPage = 1) {
        const response = await fetch(`https://ratemyuni.onrender.com/getDepartmentsByUniversity/${universityId}?page=${currentPage}`);
        const data = await response.json();
    
        // If the data or the data.departments is undefined/null or it's not an array, stop the function
        if (!data.departments || !Array.isArray(data.departments)) {
            console.log("No more departments to fetch!");
            return;
        }
    
        allDepartments.push(...data.departments); 
    
        // If the returned departments are less than 3, stop the recursion
        if (data.departments.length < 3) {
            console.log("All departments fetched!");
            setDepartments(allDepartments);
            return;
        }
    
        // Continue to the next page
        await fetchAllDepartments(universityId, currentPage + 1);
    }

    
    const handleUniversityChange = (e) => {
        const selectedUniversityID = e.target.value;
        setUniversityID(selectedUniversityID);
    
        // Clear the previous departments and fetch the new ones
        setDepartments([]);
        fetchAllDepartments(selectedUniversityID);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // all the important data for the signup
        const signupData = {
            academicEmail,
            password,
            fullName,
            nationality,
            universityID,
            departmentID,
            admissionYear,
            degreeLevel
        };
        
        try {
            const response = await fetch('https://ratemyuni.onrender.com/auth/signup', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupData),
            });
    
            const result = await response.json();
    
            if (result.message === "Account created successfully!") {
                alert("You are signed up.");
                navigate('/login');
            }

        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while signing up. Please try again.");
        }
    };

    return (
        <div className="border login-form-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label>Academic Email:</label>
                    <input 
                        type="email" 
                        value={academicEmail} 
                        onChange={e => setAcademicEmail(e.target.value)}
                        required 
                    />
                </div>
                <div className="input-container">
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        required 
                    />
                </div>
                <div className="input-container">
                    <label>Full Name:</label>
                    <input 
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-container">
                    <label>Nationality:</label>
                    <input 
                        type="text"
                        value={nationality}
                        onChange={e => setNationality(e.target.value)}
                        required
                    />
                </div>
                <div className="input-container">
                    <label>University:</label>
                    <select value={universityID} onChange={handleUniversityChange}>
                        <option value="">Select a University</option>
                        {Array.isArray(universities) && universities.map(university => (
                            <option key={university._id} value={university._id}>
                                {university.universityName}
                                </option>
                        ))}
                    </select>
                </div>
                <div className="input-container">
                    <label>Department:</label>
                    <select value={departmentID} onChange={e => setDepartmentID(e.target.value)}>
                        <option value="">Select a Department</option>
                        {Array.isArray(departments) && departments.map(department => (
                            <option key={department._id} value={department._id}>
                                {department.departmentName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-container">
                    <label>Admission Year:</label>
                    <input 
                        type="number"
                        value={admissionYear}
                        onChange={e => setAdmissionYear(e.target.value)}
                        required
                    />
                </div>
                <div className="input-container">
                    <label>Degree Level:</label>
                    <input 
                        type="text"
                        value={degreeLevel}
                        onChange={e => setDegreeLevel(e.target.value)}
                        required
                    />
                </div>

                <div className="submit-container">
                    <button type="submit">Sign Up</button>
                </div>
            </form>
        </div>
    );
}

export default SignUpPage;