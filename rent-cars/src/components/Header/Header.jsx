import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from "../../context/UserContext";
import css from "./Header.module.css";
import IconCar from "../../images/car.svg";

const Header = () => {
  
  const { user, setUser } = useContext(UserContext); // Get user state and setUser function
  const navigate = useNavigate(); // For navigation after logout

  const handleLogout = () => {
    setUser(null); // Clear the user context
    // Optionally, clear any other relevant data, such as localStorage or sessionStorage
    navigate("/"); // Redirect to home after logout
  };

  return (
    <header className={css.header}>
      <nav className={css.nav}>
        <ul className={css.menu}>
          <li className={css.menuItem}>
            <Link className={css.menuLink} to="/">
              <div className={css.logo}>
                <img src={IconCar} width="40" height="40" alt="Logo" />
                <span className={css.logoText}>ExpressWheels</span>
              </div>
            </Link>
          </li>
          <li>
            <NavLink className={css.menuLink} to="/catalog">
              Catalog
            </NavLink>
          </li>
          <li>
            <NavLink className={css.menuLink} to="/favorites">
              Favorite
            </NavLink>
          </li>
          {user ? ( // Check if user is logged in
            <>
              <li>
                <NavLink className={css.menuLink} to="/owner/profile">
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink className={css.menuLink} onClick={handleLogout}>
                  Logout
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink className={css.menuLink} to="/owner/login">
                  Owner Login
                </NavLink>
              </li>
              <li>
                <NavLink className={css.menuLink} to="/owner/create">
                  Owner Sign Up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;