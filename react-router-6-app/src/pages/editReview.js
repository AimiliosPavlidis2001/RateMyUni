import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarRating } from '../starRating'; // Import star Rating

function EditReview({ isLoggedIn }) {
    const [overall, setOverall] = useState(''); // I pass empty values
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

    const { reviewId } = useParams(); // Get the id of the review
    const navigate = useNavigate();

    const [review, setReview] = useState({});

    useEffect(() => {
        fetch(`http://localhost:3000/api/getReviewsByDepartment/${reviewId}`)
            .then(response => response.json())
            .then(data => {
                setReview(data);
            })
            .catch(error => {
                console.error("Error fetching the review:", error);
            });
    }, [reviewId]);

    const handleUpdateReview = (e) => {
        e.preventDefault();

        fetch(`http://localhost:3000/api/updateReview/${reviewId}`, {
            method: "PATCH",
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
        .then(response => response.json())
        .then(result => {
            if (result.message === "Review updated successfully") {
                alert("Review updated successfully!");
                navigate('/');
            } else {
                throw new Error(result.message);
            }
        })
        .catch(error => {
            console.error("Error updating the review:", error);
            alert("An error occurred. Please try again.");
        });
    };

    return (
        <div className="border review-form-container">
            <h2 id="formName">Edit Your Review</h2>
            <form onSubmit={handleUpdateReview}>
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
                            value={review.facilities} 
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
                            value={review.accommodationFoodServices} 
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
                            value={review.professors} 
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
                            value={review.universityClubs} 
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
                            value={review.studentLife} 
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
                            value={review.careerProspects} 
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
                <button type="submit">Update Review</button>
            </div>
            </form>
        </div>
    );
}

export default EditReview;