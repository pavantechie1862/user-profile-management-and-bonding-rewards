import Header from "../Header";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import "./index.css";

//* declared an object with possible api's states. using this variable we can render different views
const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

//* this components return a list of records of all actions performed by current user.
const HistoryItem = (props) => {
  const { item } = props;
  const { action } = item;
  return (
    <li className="list-item">
      <p>{action}</p>
    </li>
  );
};

const History = () => {
  const [history, setHistory] = useState({
    apiStatus: apiStatusConstants.initial,
    data: [],
    error: "",
  });

  //* useEffect will call api's that will fetch the past records of curent account holder
  useEffect(() => {
    const getHistory = async () => {
      setHistory({
        apiStatus: apiStatusConstants.inProgress,
        data: [],
        error: "",
      });
      const jwtToken = Cookies.get("jwt_token");
      const url = "http://localhost:3000/history";
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-type": "application/json",
        },
      };
      const response = await fetch(url, options);
      const parsed = await response.json();
      if (response.status === 200) {
        //* if api status is ok. it will send a response as list of records.
        //* state variable is initialised with api response to use further
        setHistory({
          apiStatus: apiStatusConstants.success,
          data: parsed.data,
          error: "",
        });
      } else {
        setHistory({
          apiStatus: apiStatusConstants.failure,
          data: [],
          error: "Failed to fetch",
        });
      }
    };
    getHistory();
  }, []);

  //* if api is success it will render list of items. each item is a each record of current user.
  const renderSuccessView = () => (
    <ul>
      {history.data.map((each) => (
        <HistoryItem item={each} key={each._id} />
      ))}
    </ul>
  );

  //* this function returns a loading view
  const renderLoadingView = () => (
    <div className="loading-view">
      <Loader type="ThreeDots" color="#ea4c88" height="50" width="50" />
    </div>
  );

  //* renders failing view.
  const renderFailureView = () => (
    <div className="failue-view-container">
      <h1>Oops! Something Went Wrong</h1>
      <p className="highlight-text">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  );

  //* based on api's status view will be rendered
  const renderHistory = () => {
    switch (history.apiStatus) {
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  //* returns jsx of the component
  return (
    <div>
      <Header />
      <div className="history-container">
        <h1 className="history-heading">
          The following actions made from this account
        </h1>
        {renderHistory()}
      </div>
    </div>
  );
};

export default History;
