//* importing the required modules
const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

//* creating an instance of express
const app = express();

//* built in middle wares to check wether the data format,methods,headers are valid.
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//* declaring and initialising the path to DB file.
const dbPath = path.join(__dirname, "database.db");
let db = null;

//* initializing and starting server
const initializeDBAndServer = async () => {
  try {
    //* creating a connection object(db) to use further
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    //* once the connection is established directing express instance to listen 3000 port.
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    //* their is a chance to fail initialising db and staring the server. in that case the error occurred will  be logged in to console.
    //* and forcefully stopping the process.
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//* costum middle ware function to validate user's jwt token.
//* if token is valid control flow to goes to next() else response will goes to client.
const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    //* if client failed to send token. client is not eligible to interact with db
    response.status(400).send({ jwt_token: "Invalid JWT Token" });
  } else {
    //* comparin jwt token
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        //* if jwt token not matches,the same status will be sent to client
        response.status(400).response.send({ jwt_token: "Invalid JWT Token" });
      } else {
        //* this block will execuit only when provided jwt token is valid
        request.email = payload.email; //* middleware functions can share information using request object. here am sending current user identity(email) to next middleware/handler function
        next();
      }
    });
  }
};

//* updating every action in history table in DB.
const recordHistory = async (email, action) => {
  const insertQuery = `
  INSERT INTO history (_id,email,action,timestamp)
  VALUES 
  (
    '${uuidv4()}',
    '${email}',
    '${action}',
    '${new Date()}'
  )
  `;
  await db.run(insertQuery);
};

//* api to record action
app.post("/record/", authenticateToken, async (request, response) => {
  recordHistory(request.email, request.body.action); //* function will be called with parameters
  response.status(200).send("updated successfully");
});

//* api to create a user
app.post("/register/", async (request, response) => {
  const { username, password, email } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE email = '${email}'`;
  const dbUser = await db.get(selectUserQuery);
  //* every user will be asigned a unique id generated by uuid.
  const _id = uuidv4();
  //* before registering user, logic will ensure that user will be registered when he enter unique email.
  if (dbUser === undefined) {
    //* Password will be encripted using bcrypt and stored in DB to avoid miss use of user identity.
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUserQuery = `
        INSERT INTO 
          user (_id, user_name, email,password, created_on,account_balance,bonded_amount,bonded_on,bonded_duration,bond_status,money_requested) 
        VALUES 
          (
            '${_id}', 
            '${username}',
            '${email}', 
            '${hashedPassword}',
            '${new Date()}',
            '${0}', 
            '${0}',
            '${null}', 
            '${null}',
            '${0}',
            '${0}'
          )`;
    await db.run(createUserQuery);

    const payload = {
      email: email,
    };
    const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
    //* after successfully registering, a generated token will be sent to client.
    //* client will store that token to perform further actions.
    response.status(200).send({ jwt_token: jwtToken });
    const action = `Account is created on ${new Date()} with username : ${username} and the regestered email is ${email}`;
    recordHistory(email, action);
  } else {
    response.status(400).send({ error_msg: "Email already exists" });
  }
});

//* user will be logged in only when he provides accurate credentials (email and password).
//* if user logged in successfully the generated token will be sent to client as response to perform further actions.
app.post("/login", async (request, response) => {
  const { email, password } = request.body;
  const selectUserQuery = `SELECT * FROM user WHERE email = '${email}'`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    //* checking weather the entered user exist or not
    response.status(400).send({ error_msg: "Invalid User" });
  } else {
    //* comparing passwords.
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      const payload = {
        email: email,
      };
      //* generating a token from payload.
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      response.status(200).send({ jwt_token: jwtToken }); //* sending response to client
      const action = `Your Account is logged into the device at ${new Date()}`;
      recordHistory(email, action); //* logged in info will be stored in history table.
    } else {
      response.status(400).send({ error_msg: "Invalid Password" });
    }
  }
});

//* api will be triggered when user hits on history btn from application.
//* it will validate the user using token provided before proceeding further.
app.get("/history", authenticateToken, async (request, response) => {
  const { email } = request;
  const getHistoryQuery = `
  SELECT 
    *
  FROM
    history
  WHERE
    email = '${email}'
  
  ORDER BY  timestamp DESC
  `;
  const dbResponse = await db.all(getHistoryQuery);
  response.status(200).send({ data: dbResponse }); //* sending a list of records to client
});

//* Authenticated user can make transactions only with registered users.
//* this api will be triggered when transaction route matches.
app.get("/getList", authenticateToken, async (request, response) => {
  const getUsersListQuery = `
  SELECT email FROM user WHERE email <> "${request.email}" ORDER BY email ASC
  `;
  const dbResponse = await db.all(getUsersListQuery);
  response.status(200).send(dbResponse);
  //* will send all the users except current requested user.
});

//*  This api will be triggered after successfully filled the required field and hits send button whilemaking transactions.
app.put("/transfer", authenticateToken, async (request, response) => {
  const { to, amount } = request.body;

  //* before transaction it is validating that sender has enough money to make transaction.
  const eligibleToTransferQuery = `
  SELECT
    account_balance
  FROM
    user
  WHERE
    email = "${request.email}"
  `;
  const currentUser = await db.get(eligibleToTransferQuery);
  if (currentUser.account_balance < amount) {
    //* if sender does not have enough balance.The same response will be sent to client.
    response.status(400).send({ error_msg: "Insufficient funds" });
  } else {
    //* query to deduct amount from sender's account.
    const amountDebit = `
    UPDATE
      user
    SET
      account_balance =${currentUser.account_balance - amount}
    WHERE 
      email = "${request.email}"
    `;
    //* query to find receiver's details
    const toUserDetailsQuery = `
    SELECT
      *
    FROM
      user
    WHERE
      email = "${request.body.to}"
    `;
    const toUser = await db.get(toUserDetailsQuery); //* toUser contains receiver's data.

    //* updating amount to receiver's account
    const amountCredit = `
    UPDATE
      user
    SET
      account_balance = ${toUser.account_balance + amount}
    WHERE
      email = "${to}"
    `;

    await db.run(amountDebit);
    await db.run(amountCredit);
    //* storing this actions to have a track of payments.
    const action = `Amount(${amount}) that you have sent is successfully credited to ${to} on ${new Date()}`;
    recordHistory(request.email, action); //* this action will be sent by client in request.body.
    recordHistory(request.email, request.body.action);
    const creditedAction = `${
      request.email
    } sent you Rupees ${amount} on ${new Date()}`;
    recordHistory(to, creditedAction);
    response.status(200).send({ msg: `Transaction Successfull` }); //* success response will be sent after successfully transfered.
  }
});

//* api to get complete details about current user
app.get("/getUserData", authenticateToken, async (request, response) => {
  const { email } = request;
  const getBalanceQuery = `
  SELECT * FROM user WHERE email = '${email}'
  `;
  const userData = await db.get(getBalanceQuery);
  response.status(200).send(userData);
});

//* api to request free amount.
//* user can request only once.
app.put("/request", authenticateToken, async (request, response) => {
  const requestQuery = `
  UPDATE 
    user 
  SET 
    account_balance = ${10000},
    money_requested = ${1}
  WHERE 
    email = "${request.email}"`;
  await db.run(requestQuery);
  //* this action will also be stored in db to have a track of all operations
  const action = `Requested amount 10000 is credited into your account on ${new Date()}`;
  await recordHistory(request.email, action);
  response.status(200).json({
    message: `Requested amount 10000 is credited successfully`,
  });
});

//* api to bond amount.
app.put("/bond-amount", authenticateToken, async (request, response) => {
  //* client will send amount to be bonded and duration in months.
  const { bondedAmount, bondingPeriod } = request.body;
  //* query to get current user details
  const userdetailsQuery = `
  SELECT 
    *
  FROM 
    user
  WHERE
    email = "${request.email}"
  `;
  const userDetails = await db.get(userdetailsQuery); //* current user data will be fetched from db and stored in userDetails

  //* query to update bond status of curent user,if bond_status = 1 indicates he already bonded some amount. using this we can restrict him to bond again and again untill he withdraws previously bonded amount
  const updateBondStatusQuery = `
  UPDATE 
    user 
  SET 
    bonded_amount = ${bondedAmount}, 
    bonded_duration= ${bondingPeriod} ,
    bonded_on = "${new Date()}" , 
    bond_status = ${1} 
  WHERE 
    email = "${request.email}"
  `;
  //* query to deduct amount from account balance.
  const amountDetuctQuery = `
  UPDATE 
    user 
  SET 
    account_balance =  ${Number(userDetails.account_balance - bondedAmount)}
  WHERE 
    email = "${request.email}"
  `;

  await db.run(amountDetuctQuery);
  await db.run(updateBondStatusQuery);
  const requestAction = `Request to bound amount of ${bondedAmount} for ${bondingPeriod} months is successfull on ${new Date()}`;
  recordHistory(request.email, requestAction);
  const amountDebitAction = `${bondedAmount} is debited from your account and bonded`;
  recordHistory(request.email, amountDebitAction); //* storing this action to have a track of operations.
  response.status(200).send({ message: "bonded successfull" }); //* after the amount is bonnded the same response will be sent to client.
});

//* api to claim reward
app.put("/claim-reward", authenticateToken, async (request, response) => {
  //* calculating reward
  //* if user has successfully finished bond period they will get 10% reward on bonded amount
  //* other case user will get a reward of 10% on bonded amount for each passed months

  const userDetailsQuery = `
  SELECT 
    *
  FROM
    user
  WHERE 
    email = "${request.email}"
  `;
  const userDetails = await db.get(userDetailsQuery); //storing the details of current account user

  const today = new Date(); //today date object.
  const bondedAmount = userDetails.bonded_amount; //amount that he bounded
  const bondedDuration = userDetails.bonded_duration; //no.of months to bound amount
  const bondedDate = userDetails.bonded_on; //bonded on (date)
  const currentAccountBalace = userDetails.account_balance; //current user balance

  const bondedDateObj = new Date(bondedDate.substring(0, 15)); //converting date string to date object.
  const finalDate = new Date(bondedDate.substring(0, 15)); //using this object we will calculated finaldate
  const bondedMonth = bondedDateObj.getMonth(); //extracyting month from bonded date.
  const claimMonth = bondedMonth + bondedDuration; //adding extracted month from bonded date and bonded duration.
  finalDate.setMonth(claimMonth); //added to date to get final date to withdraw reward.
  let reward;
  let action;

  if (today >= finalDate) {
    //if user withdraws after bonded period passes, user will claim 10% on bonded amount.
    reward = (10 / 100) * bondedAmount * bondedDuration;
    action = `Reward of Rupees ${reward} (10% of ${bondedAmount}) and bonded amount of ${bondedAmount} till ${finalDate} is credited in your account on ${new Date()}`;
  } else {
    //if user withdraw before bonded period finished,user will not get complete reward instead they get 8% on bonded amount
    var monthDiff =
      (today.getFullYear() - bondedDateObj.getFullYear()) * 12 +
      (today.getMonth() - bondedDateObj.getMonth());
    reward = (10 / 100) * bondedAmount * monthDiff;
    action = `Reward of Rupees ${reward} (10% of ${bondedAmount}) and bonded amount of ${bondedAmount} for ${monthDiff}month(s) is credited in your account on ${new Date()}`;
  }
  //* resetting bond status
  const creditRewardQuery = `
  UPDATE 
    user
  SET
    bonded_amount = ${0},
    bonded_on = ${null},
    bonded_duration = ${null},
    bond_status = ${0},
    account_balance = ${currentAccountBalace + bondedAmount + reward}
  WHERE
    email = "${request.email}"
  `;
  await db.run(creditRewardQuery);
  recordHistory(request.email, action); // storing this actions to have a track
  response.status(200).send({
    message: `Reward of Rupees ${reward} is credited to your account`,
  }); //after succesfully execuiting all instructions the same response has been sent to client
});
