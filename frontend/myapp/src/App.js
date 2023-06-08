import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Authentication from "./Components/Authentication";
// import Header from "./Components/Header";
import Home from "./Components/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import History from "./Components/History";
import Transaction from "./Components/Transaction";
import ViewBalance from "./Components/ViewBalance";
import Requestmount from "./Components/RequestAmount";
import BondingAmount from "./Components/BondingAmount";
import ClaimReward from "./Components/ClaimReward";
import "./App.css";

const App = () => (
  <div className="app-container">
    <BrowserRouter>
      <Switch>
        <Route exact path="/auth" component={Authentication} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/history" component={History} />
        <ProtectedRoute exact path="/transaction" component={Transaction} />
        <ProtectedRoute exact path="/balance" component={ViewBalance} />
        <ProtectedRoute exact path="/request" component={Requestmount} />
        <ProtectedRoute exact path="/bond" component={BondingAmount} />
        <ProtectedRoute exact path="/claim" component={ClaimReward} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;
