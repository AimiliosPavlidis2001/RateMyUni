// DepartmentDetails.js
import React from 'react';
import { Link } from 'react-router-dom';


function DepartmentDetails({ department }) {
  // Get the student's department ID from localStorage
  const studentDepartmentID = localStorage.getItem('departmentID');
  // Check if the student's department matches the department
  const canReview = department._id === studentDepartmentID;

  return (
    <div key={department._id}>
      <div className="leave-space-university"></div>
        <div className="border">
            <div className="container">
                <div className="university">
                    <div className="university-details">
                        <div className="department-Button">
                            <h2 id="departmentName">
                                <Link to={`/departmentReviews/${department._id}`} className="department-link">
                                    {department.departmentName}
                                </Link>
                            </h2>
                            <Link to="/createReview">
                                {/* When the student's department doesn't match the department, disable the button */}
                                <button className="review-button" disabled={!canReview}>
                                    Make Review
                                </button>
                            </Link>
                        </div>
                        <div className="info-box">
                            <div className="university-row1">
                                {/* If the AverageRating = 0 (no reviews), then show N/A. If it's not 0, then show the value of the AverageRating */}
                                <p className="row-att">Review Score: <strong id="rat">{department.departmentAverageRating === 0 ? "N/A" : department.departmentAverageRating}</strong></p>
                                <p className="row-att">Founded Year: {department.departmentFoundedYear}</p>
                            </div>
                            <div className="department-row2">
                                <p className="row-att">Field of Study: {department.fieldOfStudy}</p>
                                <p className="row-att">Academic Years: {department.academicYears}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default DepartmentDetails;