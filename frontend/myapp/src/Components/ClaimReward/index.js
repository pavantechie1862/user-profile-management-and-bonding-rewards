import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Header from "../Header";
import Loader from "react-loader-spinner";
import "./index.css";

const ClaimReward = (props) => {
  const [accountDetails, setAccountDetails] = useState(null);
  const [claimTriggered, setClaimTriggered] = useState(false);
  const [once, setOnce] = useState(false);
  const [creditAmountApi, setCreditApi] = useState({
    fetching: false,
    response: "",
  });

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

  const creditAmount = async () => {
    setCreditApi((prevState) => ({ ...prevState, fetching: true }));
    const jwtToken = Cookies.get("jwt_token");
    const url = `http://localhost:3000/claim-reward`;
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-type": "application/json",
      },
    };
    const response = await fetch(url, options);
    if (response.status === 200) {
      const parsed = await response.json();
      setCreditApi({ response: parsed.message, fetching: false });
    }
  };

  const claimwithLessRewardEventTriggered = () => {
    setOnce(true);
    creditAmount();
  };

  const backEventTriggered = () => {
    const { history } = props;
    history.push("/");
  };

  const claimWithFullReward = () => {
    setOnce(true);
    creditAmount();
  };

  const noBoundedAmountView = () => (
    <div className="no-bonded-amount-view">
      <h1>OOPS..! </h1>
      <p>
        It looks like you haven't bonded any amount yet, which means you're
        currently unable to claim a reward.In order to unlock the exciting
        rewards and benefits, simply head over to the Bonding section and choose
        the amount you want to bond for a specified period. Once you've
        completed the bonding process, you'll be eligible to claim your
        well-deserved rewards. Take this opportunity to maximize your earnings
        and enjoy the perks of being a valued member. Start bonding today and
        let your investments work for you!
      </p>
      <Link to="/bond" className="btn">
        Bond Amount
      </Link>
    </div>
  );

  //* this function returns jsx when user claim reward after the bonded priod has finished.
  const claimReward = () => {
    const { bonded_amount, bonded_duration } = accountDetails;

    return (
      <div className="claiming-full-reward">
        <h1>Aww...!</h1>

        <p>
          Congratulations! You have successfully completed your bond period. As
          a result, you are now eligible to claim your full reward amount. This
          is the perfect time to reap the benefits of your wise financial
          decision. By clicking the "Claim Reward" button below, the reward
          amount will be credited to your account balance. You can now use this
          additional amount to fulfill your dreams and aspirations. Enjoy the
          fruits of your patience and financial planning.
        </p>
        <p>
          You can claim a reward of Rupees
          <span className="highlight-text">
            {(10 / 100) * bonded_amount * bonded_duration}
          </span>
        </p>

        <button
          disabled={once}
          type="button"
          className="btn"
          onClick={claimWithFullReward}
        >
          {creditAmountApi.fetching ? renderLoadingView() : "Claim Reward"}
        </button>

        <>
          {creditAmountApi.response !== "" ? (
            <>
              <p>{creditAmountApi.response}</p>
              <Link to="/balance" className="btn">
                Check balance
              </Link>
            </>
          ) : null}
        </>
      </div>
    );
  };

  //* when user tries to claim rewards before his bond period completed.
  //* this component contains information about
  //* 1.No.of days left to finish bond period
  //* 2.The amount user loose if he still want to proceed to withdraw amount
  const claimWithLessReward = () => {
    //* calculations
    const today = new Date();
    const bondedDuration = accountDetails.bonded_duration;
    const bondedDate = accountDetails.bonded_on;

    const bondedDateObj = new Date(bondedDate.substring(0, 15));
    const finalDate = new Date(bondedDate.substring(0, 15));

    const bondedMonth = bondedDateObj.getMonth();
    const claimMonth = bondedMonth + bondedDuration;
    finalDate.setMonth(claimMonth);

    //* calculating number of days left to gain full reward.
    const timeDifferenceInMilliseconds = finalDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(
      timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    return (
      <div className="claim-less-reward">
        <h1>Claim with less reward ?</h1>
        <p className="days-left-text">
          {differenceInDays} Days left to get full reward.
        </p>

        <p>
          Hey user, it seems like your bond period has not yet been completed.
          If you choose to claim your reward before the bond ends, please note
          that you will miss out on the full reward amount that would have been
          generated if you had waited until the bond period completion.
        </p>
        <p>
          However By clicking the "Continue" button below to claim
          <span className="highlight-text">
            {" "}
            10% of your bonded amount till last month
          </span>{" "}
          , you acknowledge that you will receive a reduced reward.
        </p>
        <p>
          By clicking the "Back" button, you can choose to wait and stop the
          withdrawal process. This will allow you to continue with the bond
          period and receive the full reward amount when it completes.
        </p>

        <button
          disabled={once}
          className="btn"
          onClick={claimwithLessRewardEventTriggered}
        >
          {creditAmountApi.fetching ? renderLoadingView() : "Continue"}
        </button>
        <button
          disabled={creditAmountApi.fetching}
          className="btn"
          onClick={backEventTriggered}
        >
          Back
        </button>

        <>
          {creditAmountApi.response !== "" ? (
            <>
              <p className="green-text">{creditAmountApi.response}</p>
              <Link to="/balance" className="btn">
                Check balance
              </Link>
            </>
          ) : null}
        </>
      </div>
    );
  };

  const renderElegibleNotEligibleView = () => {
    const { bonded_duration, bonded_on, bond_status } = accountDetails;
    if (bond_status === 0) {
      return noBoundedAmountView();
    }

    let dateString = bonded_on.substring(0, 15); //extracting exact date from date string
    let noOfMonths = bonded_duration; // no of bonded months (assigning to a different variables)
    let date = new Date(dateString); //creating a date object from date string.
    let bondedMonth = date.getMonth(); // extracting month from date object
    let newMonth = bondedMonth + noOfMonths; // adding duration(months) to extracted month.
    date.setMonth(newMonth); //calculated  final date.
    let modifiedDateString = date.toDateString();
    const claimDate = new Date(modifiedDateString); // creating a fianal date object. from final date string
    const today = new Date(); //creating a new current date object

    if (claimDate > today) {
      //comparing dates
      return claimWithLessReward();
    } else {
      return claimReward();
    }
  };

  const handleClaimReward = () => setClaimTriggered(true);

  const renderBeforeClaim = () => {
    if (claimTriggered) {
      return renderElegibleNotEligibleView();
    }
    return (
      <div className="before-claim-view">
        <h1 className="claim-reward-heading">Claim Reward</h1>
        <p>
          Are you excited to claim your reward? Click the button below to start
          the process and unlock the rewards you've earned. Once claimed, the
          credited amount will be seamlessly added to your account balance,
          giving you the freedom to spend and fulfill your dreams. With this
          additional financial boost, you can confidently pursue your goals and
          make your aspirations a reality. Don't miss out on this opportunity to
          enjoy the fruits of your efforts. Claim your reward now and embrace
          the possibilities that await!
        </p>
        <button className="btn" onClick={handleClaimReward}>
          Claim Reward
        </button>
      </div>
    );
  };

  const renderLoadingView = () => (
    <Loader type="ThreeDots" color="#000" height="10" width="30" />
  );

  return (
    <div>
      <Header />
      <div className="claim-reward-container">
        {accountDetails === null ? renderLoadingView() : renderBeforeClaim()}
      </div>
    </div>
  );
};

export default ClaimReward;
