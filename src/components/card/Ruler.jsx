// Ruler.js
import React from 'react';
import './Ruler.css';

const Ruler = ({ show }) => {
  const divisions = 1000; // сколько всего делений, например, 100

  return (
    show && (
      <div className="ruler">
        {Array.from({ length: divisions }).map((_, index) => (
          <div className="ruler__division" key={index}>
            <div className="ruler__mark" />
            {index % 1 === 0 && <span className="ruler__number">{index}</span>}
          </div>
        ))}
      </div>
    )
  );
};

export default Ruler;
