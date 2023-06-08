import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import Cookies from "js-cookie";
import Header from "../Header";
import { Link } from "react-router-dom";
import "./index.css";

//* this component enables user to bond some amount upto certain period.
//* With our Bonding option, user can choose to invest a portion of their account balance for a specific duration, and in return, we will generate rewarding amounts for the user.
//* user can bond amount only once. if they already bonded some amount they have to wait/ withdraw their past bonded amount to make new bond

//* different possible cases when user tries to bond amount
//* 1. if user already bonded amount before. it will not allow user to bond again untill he withdraw previous bonded amount
//* 2. if user wants to bond amount they have to fill the required fields then hit Bound Amount btuuon.
//* from this component user can navigate to home route or balance route

//* this object have different phases of transaction.using transactionInfoStatus we can handle different cases easily
const transactionInfoStatus = {
  initial: "INITIAL",
  invalidFields: "FIELDS_ERROR",
  processing: "PROCESSING",
  inSufficientFunds: "IN_SUFFICIENT_FUNDS",
  success: "SUCCESS",
};

//* component returns corresponding JSX
const BondingAmount = () => {
  const [bondedAmount, setBondedAmount] = useState(0);
  const [bondingPeriod, setBondingPeriod] = useState(0);
  const [accountDetails, setAccountDetails] = useState(null);
  const [bonded, setBonded] = useState(false); //* allows user to bond only once.
  const [bondedInfo, setBondedInfo] = useState(""); //* it is a variable that carries bond status of user.
  const [transactionInfo, settransactionInfo] = useState(
    transactionInfoStatus.initial
  ); //* this state stores various phases of a transation

  //* as soon as component renders useEffect will made an api to know's about current user bond status
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
        //* using this condition disbale or enable  Bond Amount button
        if (userData.bond_status === 1) {
          setBonded(true);
          setBondedInfo(
            `You have already bounded  ${
              userData.bonded_amount
            } on ${userData.bonded_on.substring(0, 15)} for ${
              userData.bonded_duration
            } month`
          );
        }
        setAccountDetails(userData);
      }
    };

    fetchUserData();
  }, []);

  //* handiling events when user is filling input fields
  const handleBondingPeriod = (event) =>
    setBondingPeriod(Number(event.target.value));

  const handleBondedAmount = (event) =>
    setBondedAmount(Number(event.target.value));

  //* this function will execuit when user hits bond amount button
  const handleClickEvent = async () => {
    settransactionInfo(transactionInfoStatus.initial);

    //* validating input fields
    if (bondedAmount <= 0 || bondingPeriod <= 0) {
      settransactionInfo(transactionInfoStatus.invalidFields);
      return;
    }
    if (accountDetails.account_balance < bondedAmount) {
      settransactionInfo(transactionInfoStatus.inSufficientFunds);
      return;
    } else {
      //* after successfull validation. an api is made to update DB.
      const jwtToken = Cookies.get("jwt_token");
      const data = { bondedAmount, bondingPeriod };
      const url = "http://localhost:3000/bond-amount";
      const options = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(url, options).catch((e) => {
        console.log(e);
      });

      console.log(await response.json());
      if (response.status === 200) {
        //* after DB updated successfully handiling states to disable button and displays appropriate message
        setBonded(true);
        setAccountDetails((prevState) => ({ ...prevState, bond_status: 1 }));
        settransactionInfo(transactionInfoStatus.success);
        setBondedInfo("Bonded successfull");
      }
    }
  };

  //* renders loading view when api in progress.
  const renderLoadingView = () => (
    <Loader type="ThreeDots" color="#c0396b" height="10" width="30" />
  );

  return (
    <div>
      <Header />
      {/* //* checking the condition to render loading view or form view */}
      {accountDetails !== null ? (
        <div className="BondingAmount-container">
          <h1>Fill these fields to bound amount</h1>
          <p>
            We are excited to offer you the opportunity to maximize your
            earnings through our innovative platform. With our Bonding option,
            you can choose to invest a portion of your account balance for a
            specific duration, and in return, we will generate rewarding amounts
            for you. By opting to bond your funds, you open the door to
            increased financial growth.
            <span className="highlight-text">
              The reward amounts are calculated based on a fixed Annual
              Percentage Rate (APR) percentage, ensuring a predictable and
              lucrative return on your investment.
            </span>
            The more money you bond and the longer the duration, the higher your
            rewards will be.
          </p>
          <div className="BondingAmount-input-container">
            <label htmlFor="bondedAmount">
              Bonded Amount <span className="required-icon">*</span>
            </label>
            <input
              type="number"
              id="bondedAmount"
              value={bondedAmount}
              onChange={handleBondedAmount}
            />
          </div>
          <div className="BondingAmount-input-container">
            <label htmlFor="bondingPeriod">
              Bonding Period (in months){" "}
              <span className="required-icon">*</span>
            </label>

            <input
              type="number"
              id="bondingPeriod"
              value={bondingPeriod}
              onChange={handleBondingPeriod}
            />
          </div>
          {/* //* handiling different cases to enable or disable the button */}
          <button
            className="btn"
            onClick={handleClickEvent}
            disabled={accountDetails.bond_status && bonded}
          >
            Bond Amount
          </button>

          {/* //*showing appropriate messages bases on the conditions using conditional rendering */}
          {transactionInfo === transactionInfoStatus.processing ? (
            <p className="green-text">In Progress...</p>
          ) : null}

          {transactionInfo === transactionInfoStatus.invalidFields ? (
            <p className="error-text">* Enter a valid inputs</p>
          ) : null}

          {transactionInfo === transactionInfoStatus.inSufficientFunds ? (
            <p className="error-text">* Insufficient funds</p>
          ) : null}

          {accountDetails.bond_status ? (
            <>
              <p className="error-text">{bondedInfo}</p>
              <Link to="/balance" className="btn">
                View info
              </Link>
            </>
          ) : null}
        </div>
      ) : (
        <div className="BondingAmount-container loader">
          {renderLoadingView()}
        </div>
      )}
    </div>
  );
};

export default BondingAmount;
