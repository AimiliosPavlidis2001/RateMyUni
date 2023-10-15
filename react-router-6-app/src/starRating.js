import React, { useState } from 'react';

// Star Rating System
export const StarRating = ({ rating, setRating, interactive = true }) => { // I use rating and setRating here to pass it later on wherever I want
    const [hover, setHover] = useState(0);
    return (
      <div className="overall-rating">
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
            <button
              type="button"
              key={index}
              className={index <= (hover || rating) ? "on" : "off"}
              onClick={interactive ? () => setRating(index) : undefined} // if true set to index, if false undefined (it does nothing)
              onMouseEnter={interactive ? () => setHover(index) : undefined}
              onMouseLeave={interactive ? () => setHover(rating) : undefined}
            >
              <span className="star">&#9733;</span> {/* For the star icon */}
            </button>
          );
        })}
      </div>
    );
  };