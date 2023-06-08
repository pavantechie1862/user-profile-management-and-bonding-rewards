import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Header from "../Header";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import "./index.css";

const Transaction = () => {
  const [listOfUsers, setListOfUsers] = useState([]);
  const [transerTo, setTransferTo] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");
  const [error, setError] = useState(false);
  const [transactionInfo, setTransactionInfo] = useState("");

  useEffect(() => {
    const getUserList = async () => {
      const jwtToken = Cookies.get("jwt_token");
      const url = "http://localhost:3000/getList";
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };

      const response = await fetch(url, options);
      if (response.status === 200) {
        const users = await response.json();
        setListOfUsers(users);
      }
    };

    getUserList();
  }, []);

  const onChangeSelectField = (event) => {
    setTransferTo(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(parseFloat(event.target.value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTransactionInfo("");
    setLoading(true);
    if (transerTo === "" || amount <= 0) {
      setError(true);
      setDisplayMessage(
        "* Please fill the required fields to make a transaction."
      );
      setLoading(false);
      return;
    }
    setError(false);
    const action = `Amount Rupees ${amount} has been transferred to ${transerTo} on ${new Date()}`;
    const jwtToken = Cookies.get("jwt_token");

    const tranferDetails = { to: transerTo, amount: amount, action: action };
    const url = `http://localhost:3000/transfer`;
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(tranferDetails),
    };
    const response = await fetch(url, options);
    const parsedResponse = await response.json();
    if (response.status === 200) {
      setTransactionInfo(`Amount of ${amount} to ${transerTo} is successfull`);
      setTransferTo("");
      setAmount(0);
    } else {
      setTransactionInfo(parsedResponse.error_msg);
    }
    setLoading(false);
  };

  const renderToField = () => {
    return (
      <select
        value={transerTo}
        className="transaction-username-input-field"
        onChange={onChangeSelectField}
      >
        <option value="">Select User</option>
        {listOfUsers.map((user) => (
          <option key={user.email} value={user.email} className="user-name">
            {user.email}
          </option>
        ))}
      </select>
    );
  };

  const renderLoadingView = () => (
    <Loader type="ThreeDots" color="#000" height="10" width="30" />
  );

  return (
    <div>
      <Header />
      <div className="transaction-container">
        <p>
          Send money effortlessly with just a few clicks! Our user-friendly
          transaction component ensures a smooth experience by simplifying the
          process. To ensure accuracy, both fields for recipient and amount are
          required, preventing any empty entries. This guarantees that every
          transaction is completed successfully without any missing information.
          Enjoy the convenience of a simple and hassle-free money transfer
          process, making your transactions quick and easy.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="transaction-input-container">
            {renderToField()}
            <input
              type="number"
              value={amount}
              className="transaction-amount-input-field"
              onChange={handleAmountChange}
              inputMode="numeric"
            />
            <button
              type="submit"
              className="transaction-submit-button"
              disabled={loading}
            >
              {loading ? renderLoadingView() : "Send"}
            </button>
            {error && <p className="error-msg">{displayMessage}</p>}
            {transactionInfo !== "" && (
              <>
                <p className="transaction-info-text">{transactionInfo}</p>
                <Link to="/balance" className="btn auto-width">
                  Check Balance
                </Link>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Transaction;
