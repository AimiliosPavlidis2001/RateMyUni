import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarRating } from '../starRating'; // import star Rating

function CreateReview({ isLoggedIn }) {
    const [overall, setOverall] = useState('');
    const [facilities, setFacilities] = useState('');
    const [accommodationFoodServices, setAccommodationFoodServices] = useState('');
    const [professors, setProfessors] = useState('');
    const [universityClubs, setUniversityClubs] = useState('');
    const [studentLife, setStudentLife] = useState('');
    const [careerProspects, setCareerProspects] = useState('');
    
    // Use the logged in user's academicEmail, universityID, and departmentID with localStorage.getItem
    // If student is logged in autofill the values, if student is not logged in leave them blank
    const academicEmail = isLoggedIn ? localStorage.getItem('academicEmail') : '';
    const universityID = isLoggedIn ? localStorage.getItem('universityID') : '';
    const departmentID = isLoggedIn ? localStorage.getItem('departmentID') : '';

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        fetch('https://ratemyuni.onrender.com/api/postReview', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                overall,
                facilities,
                accommodationFoodServices,
                professors,
                universityClubs,
                studentLife,
                careerProspects,
                academicEmail,
                universityID,
                departmentID
            }),
        })
        .then(response => {
            if (!response.ok && response.status !== 409) { // If response range is not 200-299 and not 409 then
                throw new Error('Network response was not ok'); // I throw an error to be caught by the catch block
            }
            return response.json(); // If the response is okay
        })
        .then(result => {
            if(result.message === "Review added successfully") {
                alert("Your review has been submitted!");
                navigate('/');
            } 
            else if (result.message === "You've already submitted a review") {
                alert("You've already submitted a review. You can't submit more than one.");
            }
            else {
                throw new Error(result.message); // If there's a specific error message from the server throw it to be caught
            }
        })
        .catch(error => { // To catch the error
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        });
    };

    return (
    <div className="border review-form-container">
        <h2 id="formName">Submit Your Review</h2>
        <form onSubmit={handleSubmit}>
            <div className="two-column-form">
                <div className="column-form">
                    <div className="input-container">
                        <label>Overall:</label>
                        {/* I pass the rating and setRating and interactive to true */}
                        <StarRating rating={overall} setRating={setOverall} interactive={true} />
                    </div>
                    <div className="input-container">
                        <label>Facilities:</label>
                        <input 
                            type="number" 
                            value={facilities} 
                            onChange={e => setFacilities(e.target.value)}
                            min="1"
                            max="5"
                            required 
                        />
                    </div>
                    <div className="input-container">
                        <label>Accommodation & Food Services:</label>
                        <input 
                            type="number" 
                            value={accommodationFoodServices} 
                            onChange={e => setAccommodationFoodServices(e.target.value)}
                            min="1"
                            max="5"
                            required 
                        />
                    </div>
                    <div className="input-container">
                        <label>Professors:</label>
                        <input 
                            type="number" 
                            value={professors} 
                            onChange={e => setProfessors(e.target.value)}
                            min="1"
                            max="5"
                            required 
                        />
                    </div>
                    <div className="input-container">
                        <label>University Clubs:</label>
                        <input 
                            type="number" 
                            value={universityClubs} 
                            onChange={e => setUniversityClubs(e.target.value)}
                            min="1"
                            max="5"
                            required 
                        />
                    </div>
                </div>
                <div className="column-form">
                    <div className="input-container">
                        <label>Student Life:</label>
                        <input 
                            type="number" 
                            value={studentLife} 
                            onChange={e => setStudentLife(e.target.value)}
                            min="1"
                            max="5"
                            required 
                        />
                    </div>
                    <div className="input-container">
                        <label>Career Prospects:</label>
                        <input 
                            type="number" 
                            value={careerProspects} 
                            onChange={e => setCareerProspects(e.target.value)}
                            min="1"
                            max="5"
                            required 
                        />
                    </div>
                    <div className="input-container">
                        <label>Academic Email:</label>
                        <input 
                            type="email" 
                            value={academicEmail} 
                            readOnly
                            required 
                        />
                    </div>
                    <div className="input-container">
                        <label>University ID:</label>
                        <input 
                            type="text" 
                            value={universityID} 
                            readOnly 
                            required 
                        />
                    </div>
                    <div className="input-container">
                        <label>Department ID:</label>
                        <input 
                            type="text" 
                            value={departmentID} 
                            readOnly 
                            required 
                        />
                    </div>
                </div>
            </div>
            <div className="submit-container">
                <button type="submit">Submit Review</button>
            </div>
        </form>
    </div>
    );
}

export default CreateReview;