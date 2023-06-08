import { Redirect } from "react-router-dom";
import { useState } from "react";
import Cookies from "js-cookie";
import Loader from "react-loader-spinner";
import "./index.css";

//* Authenticate user if user already exist or creates an account for the user
const Authentication = (props) => {
  //* initialising state variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [signup, toggleSignup] = useState(false);

  //* if user already logged in  and trying to access login Route user automatically redirects to home route
  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) {
    return <Redirect to="/" />;
  }

  //* updating state variables when corresponding events getting triggered
  const onChangeUsername = (event) => setUsername(event.target.value);
  const onChangePassword = (event) => setPassword(event.target.value);
  const onChangeEmail = (event) => setEmail(event.target.value);

  //* whenever user tries to navigate signup -> login or login->signup initializing to it's initial values.
  const toggleSignupState = () => {
    toggleSignup((prevState) => toggleSignup(!prevState));
    setUsername("");
    setPassword("");
    setEmail("");
    setError(false);
    setErrorMsg("");
    setLoading(false);
  };

  //* when api is failed state values will update renders error response.
  const onSubmitFailure = (errorMsg) => {
    setError(true);
    setErrorMsg(errorMsg);
  };

  //* when api is success jwt token will be stored using cookies. This token will be used to authorize users to make actions further
  //* after successfull login automatically redirects to home route
  const onSubmitSuccess = (jwtToken) => {
    const { history } = props;
    Cookies.set("jwt_token", jwtToken, {
      expires: 30,
    });
    history.replace("/");
  };

  //*this function will be triggered when user clicks on login or register button.
  const submitForm = async (event) => {
    event.preventDefault();
    const pattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    setLoading(true);

    //*username should not be null in case of signup.
    if (username === "" && signup) {
      setLoading(false);
      setError(true);
      setErrorMsg("Enter valid username");
      return;
    }

    //*validating email.email will be validate only when user enters correct string that matches corresponding regular expression.
    if (!email.match(pattern)) {
      setLoading(false);
      setError(true);
      setErrorMsg("Enter a valid Email");
      return;
    }
    //*password will be accepted only when the entered string length is >= 6
    if (password.length < 6) {
      setLoading(false);
      setError(true);
      setErrorMsg("Password should contain atleast 6 letters");
      return;
    }

    //*api will be made only after form succesfully validate all the input fields.
    setError(false);
    setErrorMsg("");
    let url, options, userDetails;
    if (signup) {
      userDetails = { username, password, email };
      url = "http://localhost:3000/register";
    } else {
      userDetails = { password, email };
      url = "http://localhost:3000/login";
    }
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    if (response.status === 200) {
      onSubmitSuccess(data.jwt_token);
    } else {
      onSubmitFailure(data.error_msg);
    }
    setLoading(false);
  };

  //*returns jsx element of username field
  const renderUsernameField = () => {
    return (
      <>
        <input
          type="text"
          id="username"
          className="auth-input-fields"
          value={username}
          onChange={onChangeUsername}
          placeholder="Username"
        />
      </>
    );
  };

  //*returns jsx element of email field
  const renderEmailField = () => {
    return (
      <>
        <input
          type="text"
          id="email"
          className="auth-input-fields"
          value={email}
          onChange={onChangeEmail}
          placeholder="Email"
        />
      </>
    );
  };

  //*returns jsx element of password field
  const renderPasswordField = () => {
    return (
      <>
        <input
          type="password"
          id="password"
          className="auth-input-fields"
          value={password}
          onChange={onChangePassword}
          placeholder="Password"
        />
      </>
    );
  };

  //*function returns loading view.this view renders when api is made.
  const renderLoadingView = () => (
    <Loader type="ThreeDots" color="#000" height="10" width="30" />
  );

  return (
    <div className="login-form-container">
      <form className="form-container" onSubmit={submitForm}>
        {/*//* username field has to be rendered in case of registration of  user and not in the case of  login so it is renderng conditionally */}
        {signup && (
          <div className="input-container">{renderUsernameField()}</div>
        )}
        <div className="input-container">{renderEmailField()}</div>

        <div className="input-container">{renderPasswordField()}</div>

        {/* //* based on the condition the view/text inside the button will be rendered */}
        <button type="submit" className="btn auth-Btn" disabled={loading}>
          {loading && <div>{renderLoadingView()}</div>}
          {signup && !loading && "Register"}
          {!signup && !loading && "Login"}
        </button>

        {/* //* togging the options login -> register and register -> login using conditional rendering */}
        {signup ? (
          <div className="toggling-auhentication">
            <span className="toggle-para">Already have an account ?</span>
            <button
              type="button"
              onClick={toggleSignupState}
              className="toggle-btn"
            >
              Login
            </button>
          </div>
        ) : (
          <div className="toggling-auhentication">
            <span className="toggle-para">Dont't have an account ?</span>
            <button
              type="button"
              onClick={toggleSignupState}
              className="toggle-btn"
            >
              Register
            </button>
          </div>
        )}
        {/* //*if api throws any error,that error will be displayed here */}
        {error && <p className="error-message">* {errorMsg}</p>}
      </form>
    </div>
  );
};

export default Authentication;
