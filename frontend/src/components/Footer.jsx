import React from "react";

function Footer() {
  return (
    <footer className="luxury-footer">
      <div className="container">
        <div className="row text-center text-md-start gy-4 align-items-start">
          {/* About */}
          <div className="col-12 col-md-3 mb-3 mb-md-0">
            <h5 className="mb-3" style={{color:'#b6e0fe'}}>About</h5>
            <p style={{fontSize: '1rem', color: '#e3f0ff', margin: 0}}>
              Walking Guide là một trang web giúp bạn lên kế hoạch du lịch, và tìm kiếm các địa điểm du lịch gần bạn.
            </p>
          </div>
          {/* Quick Links */}
          <div className="col-12 col-md-3 mb-3 mb-md-0">
            <h5 className="mb-3" style={{color:'#b6e0fe'}}>Quick Links</h5>
            <ul className="list-unstyled" style={{fontSize: '1rem', color: '#e3f0ff', margin: 0}}>
              <li><a href="/" style={{color: '#fff', textDecoration: 'underline'}}>Home</a></li>
              <li><a href="/tours" style={{color: '#fff', textDecoration: 'underline'}}>Tours</a></li>
              <li><a href="/places" style={{color: '#fff', textDecoration: 'underline'}}>Places</a></li>
              <li><a href="/articles" style={{color: '#fff', textDecoration: 'underline'}}>Articles</a></li>
            </ul>
          </div>
          {/* Contact */}
          <div className="col-12 col-md-3 mb-3 mb-md-0">
            <h5 className="mb-3" style={{color:'#b6e0fe'}}>Contact</h5>
            <p style={{fontSize: '1rem', color: '#e3f0ff', margin: 0}}>
              Email: <a href="mailto:info@walkingguide.com" style={{color: '#fff', textDecoration: 'underline'}}>info@walkingguide.com</a><br/>
              Phone: <a href="tel:+1234567890" style={{color: '#fff', textDecoration: 'underline'}}>+1 234 567 890</a>
            </p>
          </div>
          {/* Social */}
          <div className="col-12 col-md-3 mb-3 mb-md-0">
            <h5 className="mb-3" style={{color:'#b6e0fe'}}>Follow Us</h5>
            <div style={{fontSize: '1.5rem'}}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{margin: '0 8px', color: '#fff'}}><i className="bi bi-facebook"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{margin: '0 8px', color: '#fff'}}><i className="bi bi-instagram"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{margin: '0 8px', color: '#fff'}}><i className="bi bi-twitter-x"></i></a>
            </div>
            <div style={{fontSize: '0.95rem', color: '#b6e0fe', marginTop: 8}}>
              Developed by <a href="https://github.com/yourteam" target="_blank" rel="noopener noreferrer" style={{color: '#fff', textDecoration: 'underline'}}>Walking Guide Team</a>
            </div>
          </div>
        </div>
        <hr style={{borderColor: '#b6e0fe', opacity: 0.3, margin: '1.5rem 0'}} />
        <div className="text-center" style={{fontSize: '1rem', color: '#e3f0ff'}}>
          © {new Date().getFullYear()} Walking Guide. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;