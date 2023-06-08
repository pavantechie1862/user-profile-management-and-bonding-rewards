import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Loader from "react-loader-spinner";
import Header from "../Header";
import "./index.css";

//*User can have an overview about his account balace bonded amount and period.
const ViewBalance = () => {
  //*initialising required states
  //*initially loading is set to true. whenever the component renders api will be called.
  //*when api is in progress ViewBalance component displays loading view
  const [userData, setUserData] = useState(null);
  const [Loading, setLoading] = useState(true);

  const renderLoadingView = () => (
    <Loader type="ThreeDots" color="#ea4c88" height="10" width="30" />
  );

  //*after component renders useEffect will execuit and api will be called.
  //*this api returns current user data and displays on screen
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
        setUserData(userData);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  //* function to calculate final date to claim bond amount
  const calculateFinalDate = () => {
    const date = new Date(userData.bonded_on.substring(0, 15));
    date.setMonth(userData.bonded_duration + date.getMonth());
    return `${date}`.substring(0, 15);
  };

  //*conditionally returns loading view when api is in progress and returns api success view when api is success
  return (
    <>
      <Header />
      <div className="view-balance-container">
        <div className="user-data-container">
          {!Loading ? (
            <>
              <h1 className="user-details-title">User Details</h1>
              <div className="properties-values">
                <div className="user-data-row">
                  <span className="data-label">Username</span>
                  {/*//* userData contains different different properties and values this data will be initialized when api is success */}
                  <span className="data-value">{userData.user_name}</span>
                </div>
                <div className="user-data-row">
                  <span className="data-label">Email</span>
                  <span className="data-value">{userData.email}</span>
                </div>
                <div className="user-data-row">
                  <span className="data-label">Account Balance</span>
                  <span className="data-value">{userData.account_balance}</span>
                </div>
                <div className="user-data-row">
                  <span className="data-label">Free amount status</span>
                  <span className="data-value">
                    {userData.money_requested
                      ? "Already Requested"
                      : "Not Yet Requested"}
                  </span>
                </div>
                <div className="user-data-row">
                  <span className="data-label">Account created on</span>
                  <span className="data-value">
                    {/* //*userData.created_on is acutally a date object which is stored as string in db.  Extracting exact date fromdate string using substring method*/}
                    {userData.created_on.substring(0, 15)}
                  </span>
                </div>
                <div className="user-data-row">
                  <span className="data-label">Bonded Amount</span>
                  {/* //*If user was bonded amount,the status is stored as 1 else stored as 0 in DB. Below line is conditionally rendering bonded amount. if user haven't bounded yet it will show NA */}
                  <span className="data-value">
                    {userData.bond_status === 0 ? "NA" : userData.bonded_amount}
                  </span>
                </div>
                <div className="user-data-row">
                  <span className="data-label">Bonded on</span>
                  <span className="data-value">
                    {userData.bond_status === 0
                      ? "NA"
                      : userData.bonded_on.substring(0, 15)}
                  </span>
                </div>

                <div className="user-data-row">
                  <span className="data-label">Bonded Duration</span>
                  <span className="data-value">
                    {userData.bond_status === 0
                      ? "NA"
                      : `${userData.bonded_duration} Month(s)`}
                  </span>
                </div>

                <div className="user-data-row">
                  <span className="data-label">Bonded Till</span>
                  <span className="data-value">
                    {userData.bond_status === 0 ? "NA" : calculateFinalDate()}
                  </span>
                </div>
              </div>
            </>
          ) : (
            renderLoadingView()
          )}
        </div>
      </div>
    </>
  );
};

export default ViewBalance;
