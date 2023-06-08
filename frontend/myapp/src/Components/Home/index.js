import React from "react";
import Header from "../Header";
import { Link } from "react-router-dom";
import "./index.css";

//after succesfully logged automatically routes to home component.

//user can make following actions from here.
// 1.can view his account details
// 2.can make transactions
// 3.can make request for free amount
// 4.can bond money to get rewards upto certain duration
// 5.can claim the reward.
// 6.can Track his/her past activities

export default function Home() {
  return (
    <div>
      {/* Header contains company logo and important links for quick navigation within account */}
      <Header />
      <div className="home-container">
        <div className="options-container">
          {/* This card contains all the information about account */}
          <div className="option-card">
            <div className="option-card-content">
              <h1 className="option-tile">View Balance</h1>
              <p className="card-description">
                Simply click the button below to access a comprehensive view of
                your financial status, monitor your bounded amounts, and stay
                updated on your rewards progress
              </p>
              {/* on clicking below link user will navigate to view balance route */}
              <Link to="/balance" className="btn">
                View Details
              </Link>
            </div>
          </div>

          {/* this card helps user to make transactions */}
          <div className="option-card">
            <div className="option-card-content">
              <h1 className="option-tile">Send Money</h1>
              <p className="card-description">
                Seamlessly transfer funds to friends, family, or businesses with
                just a few clicks and without any amount restrictions.It's
                better to check your balance before proceeding :)
              </p>
              {/* on clicking below link user will navigate to transaction route */}
              <Link to="/transaction" className="btn">
                Make transactions
              </Link>
            </div>
          </div>

          {/* this card helps user to make request for free amount */}
          <div className="option-card">
            <div className="option-card-content">
              <h1 className="option-tile">Free Amount Request</h1>
              <p className="card-description">
                Need a little financial boost? Request a specific amount of
                money from Admin without any charges or obligations with just 3
                clicks.Why you are waiting ? let's go
              </p>
              {/* on clicking below link user will navigate to request route */}
              <Link to="/request" className="btn">
                Request
              </Link>
            </div>
          </div>

          {/* this card helps user to bond some amount from his account for some duration */}
          <div className="option-card">
            <div className="option-card-content">
              <h1 className="option-tile">Bonding Amount</h1>
              <p className="card-description">
                Take advantage of our bonding feature to earn attractive
                rewards. By choosing to lock a portion of your account balance
                for a set period, you can enjoy a fixed Annual Percentage Rate
                (APR) and watch your rewards grow.
              </p>

              {/* using this link user will navigate to bond route */}
              <Link to="/bond" className="btn">
                Bound amount
              </Link>
            </div>
          </div>

          {/* below card helps user to claim his rewards */}
          <div className="option-card">
            <div className="option-card-content">
              <h1 className="option-tile">Reward Withdrawal</h1>
              <p className="card-description">
                It's time to reap the benefits of your loyalty. Claim your
                hard-earned rewards and withdraw them to your account.Click the
                below button to claim the rewards
              </p>
              {/* below link is used to navigate to claim route */}
              <Link to="/claim" className="btn">
                Claim
              </Link>
            </div>
          </div>

          {/* this card used to track the actions from this account */}
          <div className="option-card">
            <div className="option-card-content">
              <h1 className="option-tile">History</h1>
              <p className="card-description">
                Stay informed and organized with a comprehensive view of your
                transaction history. Track your past activities, including
                payments sent and received, rewards earned, bonding periods, and
                withdrawals.
              </p>
              {/* below link is used to navigate to history route */}
              <Link to="/history" className="btn">
                View History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
