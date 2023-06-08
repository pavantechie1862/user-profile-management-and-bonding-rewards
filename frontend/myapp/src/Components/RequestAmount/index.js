import { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import Cookies from "js-cookie";
import Header from "../Header";
import "./index.css";

// * About this component:

// * is user accout balance is 0.he/she is eligible to request a free amount.
// * if their is already some amount in user's account he/she is not eligible to make a request.

const Requestmount = () => {
  const [transactionStatus, setTransactionStatus] = useState(""); //* this state iniialised with response from backend after api is called.
  const [requestDone, setRequestDone] = useState(false); //* helps to make only one request
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  //* after component is rendered an api is made to fetch the current user account details to find weather he/she has amount in their account
  useEffect(() => {
    const fetchUserData = async () => {
      const jwtToken = Cookies.get("jwt_token");
      const url = "http://localhost:3000/getUserData";
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };

      const response = await fetch(url, options);
      if (response.status === 200) {
        const userData = await response.json();
        setAccountDetails(userData);
      }
    };

    fetchUserData();
  }, []);

  const renderLoadingView = () => (
    <Loader type="ThreeDots" color="white" height="10" width="30" />
  );

  //* once the user entered required amount and hit request button below finction is execuited.
  //* an api is made to update the account balance
  const handleRequestSubmit = async (event) => {
    event.preventDefault(); //*preventing the default behaviour of form
    setLoading(true);

    const jwtToken = Cookies.get("jwt_token");
    const url = "http://localhost:3000/request";
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    const response = await fetch(url, options);
    if (response.status === 200) {
      //* after successfully credited the amount in user's account the state variables will be updated accordingly.
      const parsedMesage = await response.json();
      setLoading(false);
      setTransactionStatus(parsedMesage.message);
      setRequestDone(true);
    }
  };

  return (
    <div>
      <Header />
      <div className="free-amount-request-container">
        <>
          {accountDetails === null ? (
            renderLoadingView()
          ) : (
            <>
              <h1 className="request-money-heading">Free Amount Request</h1>
              <p>
                Hey..user have the opportunity to request a fixed amount of
                money to be added to your account, without any obligations.To
                request a free amount, simply enter the desired amount in the
                field provided.if you use the service{" "}
                <span className="highlight-text">10000/-</span> will be credited
                to your account,after you no longer able to request again
              </p>
              <form
                className="request-form-container"
                onSubmit={handleRequestSubmit}
              >
                <input
                  className="amount-input-field"
                  type="number"
                  defaultValue={10000}
                  readOnly
                />
                {/* //* handling the different cases. like the user have only 1 chance to  request money and button will be disabled when api is in progress */}
                <button
                  className="btn"
                  type="submit"
                  disabled={
                    accountDetails.money_requested === 1 ||
                    loading ||
                    requestDone
                  }
                >
                  {loading ? renderLoadingView() : "Request"}
                </button>
                {/* //*if the user already have some amount in his account that warning will be displayed here */}
                {accountDetails.money_requested === 1 && (
                  <p className="note-text">
                    You are already requested amount. You no longer eligible to
                    request again
                  </p>
                )}
                <p className="green-text">{transactionStatus}</p>
              </form>
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default Requestmount;
