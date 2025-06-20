import React from "react";

function Footer() {
  return (
    <footer className="luxury-footer">
      <div className="container text-center">
        <p>© {new Date().getFullYear()} Walking Guide. All rights reserved.</p>
        <p style={{fontSize: '1rem', color: '#e3f0ff', margin: 0}}>
          Contact: <a href="mailto:info@walkingguide.com" style={{color: '#fff', textDecoration: 'underline'}}>info@walkingguide.com</a> | 
          Developed by <a href="https://github.com/yourteam" target="_blank" rel="noopener noreferrer" style={{color: '#fff', textDecoration: 'underline'}}>Walking Guide Team</a>
        </p>
        <p style={{fontSize: '0.95rem', color: '#b6e0fe', margin: 0}}>
          Follow us:
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{margin: '0 8px', color: '#fff'}}><i className="bi bi-facebook"></i></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{margin: '0 8px', color: '#fff'}}><i className="bi bi-instagram"></i></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{margin: '0 8px', color: '#fff'}}><i className="bi bi-twitter-x"></i></a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;