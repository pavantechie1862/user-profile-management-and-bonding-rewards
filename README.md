This is a sample README file of user profile management and bonding rewards to provide an overview of the all the funtionalities

# 1.Authentication

## Register

To register as a new user, user has to follow this setps

1. On the registration page, you will see three input fields: username, email, and password.
2. Fill in all three fields with the required information.
3. Ensure that the provided email is valid and the password meets the specified criteria(should contains atleast 6 letters).
4. Click on the "Register" button.
5. The client-side form validation will check if all fields are properly filled and meet the criteria.
6. Once the validation is successful, the client will make an API call to register the user.
   7.if email is not registered before your registration will be successful and the API will respond with a JWT (JSON Web Token).
7. The client will securely store this token (e.g., in cookies) for further operations.
8. After storing the token, the client will automatically navigate to the home page of the application.

## Login

To log in to the application, follow these steps:

1. If you are already a registered user and tries to log in, you will see two input fields: one for the email and another for the password.
2. Enter your email and password in the respective fields.
3. Once you have filled in the details, click on the "Login" button.
4. The client-side form validation will ensure that all fields are properly filled.
5. After validation, the front-end will make an API call to authenticate the user.
6. If the credentials are correct, the API will respond with a JWT (JSON Web Token).
7. The client will store this token securely (in Cookies) to perform further operations.
8. Upon successful token retrieval, the client will automatically navigate to the home page of the application.

# 2.Options

Once the user successfully logs in, they will be redirected to the home page. The home page provides various options for the user to explore and manage their account. Here are the available options:

1.  Check Accounts:

    - By selecting this option, the user can view their account details, including the current balance, history, bonded information etc..

2.  Send Money:

    - This option allows the user to initiate a money transfer to another user. The user will need to provide the recipient's email by selecting from the dropdown, and specify the amount to send.
    - if user want to send amount
      - user should have enough balance to make transaction.
      - user has to fill all the required fields with valid data.

3.  Request Amount:

    - User can request fixed amount of money to make transactions.once user utilised this opportunity they no loner eligible make free amount request further.

4.  Bonding Amount:

    - This option enables the user to bond a certain amount of money for a specific period. The user will need to enter the amount to be bonded and the desired bonding period. Upon confirmation, the bonded amount will be deducted from the user's account balance.
      - user can not bond money if he already bonded some amount which is not withdrawn.
      - user should have enough money to make bond

5.  Withdraw Rewards:

    - By selecting this option, the user can withdraw any accumulated rewards from their bonded amount. The user will receive a portion of the rewards based on the completion of the bonding period.

    - few possible cases
      - if user haven't bond any amount before,still trying to claim the reward
        - in this case it suggest user to make bond of some amount upto certain perios.
      - user has bonded amount upto certain period but want'sto claim before
        - in this case user can claim 10% on bonded amount for each month passed will be added to user's account.
      - user has bonded amount and served bond period
        - in this case user can get 10% on bonded amount for bonded duration

6.  Transaction History:
    - This option allows the user to view all the history of operations they have performed within the application. This includes details of transactions, account activities, reward withdrawals, and more.

The user can navigate between these options by selecting the corresponding menu item buttons provided on the home page. Each option will lead the user to a dedicated page or form to perform the desired action.

Feel free to explore and utilize the various functionalities of the application to manage your accounts, perform transactions, and track your history conveniently.

# 3.Enviroinment setup

- Make sure you have Node.js and npm installed on your system.

        - https://nodejs.org visit and download then
        - open cmd and type  node -v
        - open cmd and type npm -v to make sure they installed correctly.

- Follow this instructions to install sqlite3.<br> - <a href="https://www.youtube.com/watch?v=L3FwRRx6bqo">
  <img src="https://img.youtube.com/vi/L3FwRRx6bqo/0.jpg" alt="YouTube Video" width="100" height="100">
  </a>

- open vs code and install the following sql related extensions to see how the data being stored in tables
  - 1.SQLite
  - 2.SQLite3 Editor
  - SQLTools

# 4. Dependencies setup.

- To install the dependencies in a React JS project, you can use the npm package manager. Open your project's terminal or command prompt and navigate to the project directory. Then run the following command:

        - npm install js-cookie@3.0.5
        - npm install react@18.2.0 react-dom@18.2.0
        - npm install react-icons@4.9.0
        - npm install react-loader-spinner@4.0.0
        - npm install react-router-dom@4.2.2

  once all the dependencies installed run **npm start** to start the server

- For the backend dependencies, you can install them in a similar way. Open the terminal or command prompt in your backend project directory and run the following command:

        - npm install bcrypt@5.1.0
        - npm install express@4.18.2
        - npm install jsonwebtoken@9.0.0
        - npm install sqlite@4.2.1
        - npm install sqlite3@5.1.6
        - npm install uuid@9.0.0

  once all the dependencies installed run **nodemon app.js** to run programme

# Explore the application :)

- At any point of time if you have any issues feel free to ping me
  - pavanmarapalli171862@gmail.com
