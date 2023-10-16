import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarRating } from '../starRating'; // import star Rating
import { Link } from 'react-router-dom';

function DepartmentReviews({ isLoggedIn }) {
  const { departmentId } = useParams();
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();

  // This will be used to show first the student's review
  const studentAcademicEmail = localStorage.getItem('academicEmail');
  // Find the review made by the logged-in student
  const studentReview = reviews.find(review => review.academicEmail === studentAcademicEmail); // "=>" To examine each review
  // Get all other reviews except the one made by the student
  const otherReviews = reviews.filter(review => review.academicEmail !== studentAcademicEmail);

  useEffect(() => {
    const fetchReviews = async () => {
        try {
            const response = await fetch(`https://ratemyuni.onrender.com/api/getReviewsByDepartment/${departmentId}`);
            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                alert('This department does not have any reviews.');
                navigate(-1); // Go back to the departments of the specific university
                setReviews([]);  // Set reviews to an empty array
                return;
            }

            setReviews(data);
        } 
        catch (error) {
            console.error("Error:", error);
        }
    };
    fetchReviews();
  }, [departmentId]);

  // For the delete of the review
  const handleDeleteReview = async (reviewId) => { // Here we are passing to the reviewId, the studentReview._id
    try {
        const response = await fetch(`https://ratemyuni.onrender.com/api/deleteReview/${reviewId}`, {
            method: 'DELETE'
        });
        const data = await response.json();

        if (response.ok) {
          alert(data.message);
          // If the review's id is not the same with the student's review id, store the review in an array
          setReviews(clearedReviews => clearedReviews.filter(review => review._id !== reviewId));
        } 
        else {
          throw new Error('Error deleting the review');
        }
    } catch (error) {
        console.error("Error:", error);
        alert('Failed to delete the review. Please try again.');
    } 
  };

  if (reviews.length > 0) { // Go inside this return only if the reviews are > 0
    return (
      <>
        <h2 id="reviewTitle">Department Reviews</h2>
        {/* For the student's review */}
        {studentReview && ( //If student Review exists (not null), then go inside
          <>
            <div key={studentReview._id} className="border">
              <div className="center-reviews two-column-form">
                  <div className="column-form">
                    <div className="overall-rating-container">
                      <p id="reviewOverallTitle">Overall Rating:</p>
                      <StarRating rating={studentReview.overall} interactive={false} />{/* Set interactive to false */}
                    </div>
                    <div className="bottom-overall-info">
                      <p><strong>Facilities:</strong> {studentReview.facilities}</p>
                      <p><strong>Accommodation & Food Services:</strong> {studentReview.accommodationFoodServices}</p>
                      <p><strong>Professors:</strong> {studentReview.professors}</p>
                    </div>
                  </div>
                  <div className="column-form department-reviews-right-column">
                    <p><strong>University Clubs:</strong> {studentReview.universityClubs}</p>
                    <p><strong>Student Life:</strong> {studentReview.studentLife}</p>
                    <p><strong>Career Prospects:</strong> {studentReview.careerProspects}</p>
                  </div>
              </div>
              {isLoggedIn && ( // Student has to be logged in to review and delete his review
                <div className="review-edit-delete-buttons">
                  <Link to={`/editReview/${studentReview._id}`}>
                    <button className="edit-review-button">Edit</button>
                  </Link>
                  <Link onClick={() => handleDeleteReview(studentReview._id)}>{/* Pass the student's review id */}
                    <button className="delete-review-button">Delete</button>
                  </Link>
                </div>
              )}
            </div>
            <div className="leave-space-reviews"></div>
          </>
        )}
        {/* For the other reviews */}
        {otherReviews.map(review => ( // using map, because we have an array
          <>
            <div key={review._id} className="border">
              <div className="center-reviews two-column-form">
                  <div className="column-form">
                    <div className="overall-rating-container">
                      <p id="reviewOverallTitle">Overall Rating:</p>
                      <StarRating rating={review.overall} interactive={false} />{/* Set interactive to false */}
                    </div>
                    <div className="bottom-overall-info">
                      <p><strong>Facilities:</strong> {review.facilities}</p>
                      <p><strong>Accommodation & Food Services:</strong> {review.accommodationFoodServices}</p>
                      <p><strong>Professors:</strong> {review.professors}</p>
                    </div>
                  </div>
                  <div className="column-form department-reviews-right-column">
                    <p><strong>University Clubs:</strong> {review.universityClubs}</p>
                    <p><strong>Student Life:</strong> {review.studentLife}</p>
                    <p><strong>Career Prospects:</strong> {review.careerProspects}</p>
                  </div>
              </div>
            </div>
            <div className="leave-space-reviews"></div>
          </>
        ))}
      </>
    );
  }

  return null; // If there are no reviews, return null
}

export default DepartmentReviews;