import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { handleLogOut, isLoggedIn, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo & Brand */}
        <Link to="/" className="navbar-brand">
          <img
            src="/src/assets/Samlogo.png"
            alt="MicroLearn"
            className="brand-logo-img"
          />
          <span className="brand-name">MicroLearn</span>
        </Link>

        {/* Navigation Links */}
        {isLoggedIn ? (
          <div className="navbar-menu">
            <Link to="/topics" className="nav-link">
              Topics to learn
            </Link>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <div className="navbar-user">
              <Link to="/profile">
                <div className="user-avatar">
                  {currentUser?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              </Link>
              <button onClick={handleLogOut} className="btn-logout">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="navbar-menu">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup">
              <button className="btn-signup">Get Started</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
