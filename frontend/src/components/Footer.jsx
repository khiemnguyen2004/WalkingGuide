import React, { useEffect, useState } from "react";

function getSettings() {
  const saved = localStorage.getItem('adminSettings');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  }
  return {};
}

function Footer() {
  const [settings, setSettings] = useState(getSettings());

  // Listen for localStorage changes (other tabs/windows)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'adminSettings') {
        setSettings(getSettings());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Also refresh settings when the page regains focus (for same-tab updates)
  useEffect(() => {
    const handleFocus = () => setSettings(getSettings());
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Helper to manually refresh settings (can be called after save in admin)
  Footer.refreshSettings = () => setSettings(getSettings());

  const about = settings.footerDescription || "Walking Guide là một trang web giúp bạn lên kế hoạch du lịch, và tìm kiếm các địa điểm du lịch gần bạn.";
  const copyright = settings.footerCopyright || `© ${new Date().getFullYear()} Walking Guide. All rights reserved.`;
  const contactEmail = settings.contactEmail || "info@walkingguide.com";
  const contactPhone = settings.contactPhone || "+1 234 567 890";
  const contactAddress = settings.contactAddress || "";
  const facebookUrl = settings.facebookUrl || "https://facebook.com";
  const instagramUrl = settings.instagramUrl || "https://instagram.com";
  const twitterUrl = settings.twitterUrl || "https://twitter.com";
  const youtubeUrl = settings.youtubeUrl || "";

  return (
    <footer className="luxury-footer">
      <div className="container">
        <div className="row text-center text-md-start gy-4 align-items-start">
          {/* About */}
          <div className="col-12 col-md-3 mb-3 mb-md-0">
            <h5 className="mb-3" style={{color:'#b6e0fe'}}>About</h5>
            <p style={{fontSize: '1rem', color: '#e3f0ff', margin: 0}}>
              {about}
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
              Email: <a href={`mailto:${contactEmail}`} style={{color: '#fff', textDecoration: 'underline'}}>{contactEmail}</a><br/>
              Phone: <a href={`tel:${contactPhone}`} style={{color: '#fff', textDecoration: 'underline'}}>{contactPhone}</a>
              {contactAddress && <><br/>Address: <span style={{color: '#fff'}}>{contactAddress}</span></>}
            </p>
          </div>
          {/* Social */}
          <div className="col-12 col-md-3 mb-3 mb-md-0">
            <h5 className="mb-3" style={{color:'#b6e0fe'}}>Follow Us</h5>
            <div style={{fontSize: '1.5rem'}}>
              {facebookUrl && <a href={facebookUrl} target="_blank" rel="noopener noreferrer" style={{margin: '0 8px', color: '#fff'}}><i className="bi bi-facebook"></i></a>}
              {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{margin: '0 8px', color: '#fff'}}><i className="bi bi-instagram"></i></a>}
              {twitterUrl && <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={{margin: '0 8px', color: '#fff'}}><i className="bi bi-twitter-x"></i></a>}
              {youtubeUrl && <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" style={{margin: '0 8px', color: '#fff'}}><i className="bi bi-youtube"></i></a>}
            </div>
            <div style={{fontSize: '0.95rem', color: '#b6e0fe', marginTop: 8}}>
              Developed by <a href="https://github.com/yourteam" target="_blank" rel="noopener noreferrer" style={{color: '#fff', textDecoration: 'underline'}}>Walking Guide Team</a>
            </div>
          </div>
        </div>
        <hr style={{borderColor: '#b6e0fe', opacity: 0.3, margin: '1.5rem 0'}} />
        <div className="text-center" style={{fontSize: '1rem', color: '#e3f0ff'}}>
          {copyright}
        </div>
      </div>
    </footer>
  );
}

export default Footer;