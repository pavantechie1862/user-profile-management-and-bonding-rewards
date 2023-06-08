import { AiFillHome, AiOutlineHistory } from "react-icons/ai";
import { Link, withRouter } from "react-router-dom";
import { BiTransfer } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import Cookies from "js-cookie";
import "./index.css";

//* returns a navbar
const Header = (props) => {
  //* below function will be triggered when user hit's logout button.
  //* when the user logged out from device. login interface will be displayed using history prop
  //* also a record is also stored in the db that user has logged out. this helps user to have a track of his/her actions.
  const onClickLogout = () => {
    const data = { action: `Logged out from the device on ${new Date()}` };
    const jwtToken = Cookies.get("jwt_token");
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(data),
    };

    const url = "http://localhost:3000/record";
    fetch(url, options);
    const { history } = props;
    Cookies.remove("jwt_token");
    history.replace("/auth");
  };

  //* returns jsx of header mobile view and large screen view.
  return (
    <>
      <nav className="nav-header">
        <div className="nav-content">
          {/* //* below container element is the jsx of mobile view. */}
          <div className="nav-bar-mobile-logo-container">
            <Link to="/">
              <img
                className="website-logo"
                src="https://d3ml3b6vywsj0z.cloudfront.net/company_images/605db31910fce904a724b02c_images.png"
                alt="website logo"
              />
            </Link>

            <button type="button" onClick={onClickLogout}>
              <FiLogOut className="nav-bar-icon" />
            </button>
          </div>
          {/* //* below container is displayed when the screen size os large. */}
          <div className="nav-bar-large-container">
            <Link to="/">
              <img
                className="website-logo"
                src="/logo.png"
                alt="website logo"
              />
            </Link>
            {/* //* in large screen only home and logout buttons will be displayed.
            //* where home link isused to navigate to home from any component. */}
            <div className="navigations-link-fullscreen">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <button type="button" className="btn" onClick={onClickLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
        {/* //* in moile view additionally some important navigation links are added
        //* to provide a better user experience. */}
        <div className="nav-menu-mobile">
          <ul className="nav-menu-list-mobile">
            <li className="nav-menu-item-mobile">
              <Link to="/" className="nav-link">
                <AiFillHome className="nav-bar-icon" />
              </Link>
            </li>

            <li className="nav-menu-item-mobile">
              <Link to="/transaction" className="nav-link">
                <BiTransfer className="nav-bar-icon" />
              </Link>
            </li>
            <li className="nav-menu-item-mobile">
              <Link to="/history" className="nav-link">
                <AiOutlineHistory className="nav-bar-icon" />
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default withRouter(Header);
