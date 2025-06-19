import React from "react";

function Footer() {
  return (
    <footer className="luxury-footer">
      <div className="container text-center">
        <p>© {new Date().getFullYear()} Walking Guide. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;