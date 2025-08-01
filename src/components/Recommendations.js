import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Recommendations.css';

const Recommendations = ({ recommendations }) => {
  if (!recommendations?.length) return null;

  return (
    <div className="recommendations-container">
      <h3>Recommended</h3>
      <div className="recommendations-list">
        {recommendations.map((movie) => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="recommendation-card"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                  : 'https://via.placeholder.com/185x278?text=No+Image'
              }
              alt={movie.title}
            />
            <p>{movie.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
