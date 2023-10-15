// client/src/locationFilter.js

import React from 'react';

const locationFilter = ({ onSelectLocation }) => {
  return (
    <div className="location-filter">
      <h3>Filter by Location:</h3>
      <button onClick={() => onSelectLocation('North')}>North</button>
      <button onClick={() => onSelectLocation('Central')}>Central</button>
      <button onClick={() => onSelectLocation('South')}>South</button>
      <button onClick={() => onSelectLocation('')}>All</button>
    </div>
  );
};

export default locationFilter;