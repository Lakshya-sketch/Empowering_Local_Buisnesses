import React, { useEffect } from 'react';
import '../css/Shared.css';

function Stars() {
  useEffect(() => {
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
      starsContainer.innerHTML = '';
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
      }
    }
  }, []);

  return <div className="stars"></div>;
}

export default Stars;
