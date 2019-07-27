# Modexcel

Modexcel is a web-app which takes in a XLS/CSV file containing donation details consisting of fields - (Date, Order Id, Nonprofit, Donation Currency, Donation Amount, Fee) and generates an XLSX file where in donations are grouped by Nonprofit aggregating information for each Nonprofit consisting of fields - (Nonprofit, Total amount, Total Fee, Number of Donations). 

## Getting Started

### Prerequisites

Make sure that you have Node.js installed your system. If you have not already installed, refer the links -

* For Windows Users - https://tinyurl.com/y4k9xj4y

* For Non-Windows Users - https://tinyurl.com/y35fknnw

Finally, check the version of Node.js with (I've used v8.11.3) - 
```
node -v
```

I've used PostgreSQL as my DBMS. You can go ahead and install PostgreSQL using the link - https://tinyurl.com/yyfhhlms or you can use any other relational DBMS.

### Setup and Installation

Once you have installed Node.js, 90% of the job is done. Open terminal/cmd and go to the desired location for project creation.
Clone this repository, go into the project folder and run the following command -

```
npm install
```

This will install all the modules listed as dependencies in the **package.json** file.

After that, fill in the appropriate database connection details in the **server.js** file - 

```
let config = {
  user: 'username',
  database: 'database_name',
  host: 'host_name',
  password: 'password'
};
```

To get the database ready, import the SQL script present in this repository (modexcel.sql)

## Running the Server

Now that we have completed the setup, it's time to get the server running. Use the following command to start the server - 

```
node server.js
```

Once the server starts, it will log the following in console - 

```
App listening on port 9090!
```

**Note**: Since we set port number to 9090, our application runs at port 9090.

**Tip**: Use the following command which automatically restarts the server upon any changes in the **server.js** file.

```
nodemon server.js
```

```
[nodemon] 1.18.9
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node server.js`
App listening on port 9090!
```

## Additional Details

* **Schema**: Check out the database schema present in the repository.

* **Resume**: Please find my latest resume present in the repository. 


## Built With

* [Node.js](https://nodejs.org/en/docs/) - Server-side scripting language used
* [PostgreSQL](https://www.postgresql.org/docs/) - RDBMS used

### Other library/frameworks/plugins used

* [jQuery](https://api.jquery.com/) - Javascript made easy
* [Bootstrap 3](https://api.jquery.com/) - powerful front-end framework
* [iziToast](http://izitoast.marcelodolza.com/) - Elegant, responsive notification plugin used 
* [JHXLSX](https://www.jqueryscript.net/other/JavaScript-JSON-Data-Excel-XLSX.html) - A jQuery plugin to convert JSON into Excel(XLSX)
* [exchangeratesapi](https://exchangeratesapi.io/) - Used for currency conversion

## Authors

* **Venkatesh Naidu** - [Venky-GH](https://github.com/Venky-GH)
