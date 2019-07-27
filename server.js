let express = require('express');
let morgan = require('morgan');
let path = require('path');
let Pool = require('pg').Pool;
let bodyParser = require('body-parser');
let node_xj = require('xls-to-json');
let multer = require('multer');
let request = require('request');

let config = {
  user: 'venky_aws',
  database: 'modexcel_db',
  host: 'cinebase.cq5jqnq6kxwf.us-east-1.rds.amazonaws.com',
  password: 'venky123456'
};

let app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

let storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
  }
});
let upload = multer({ //multer settings
  storage: storage
}).single('file');


let pool = new Pool(config);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/:filename', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', req.params.filename));
});

app.get('/css/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'css', req.params.fileName));
});

app.get('/js/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'js', req.params.fileName));
});

function* iterate_object(o) {
  var keys = Object.keys(o);
  for (var i = 0; i < keys.length; i++) {
    yield [keys[i], o[keys[i]]];
  }
}

app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    let base_name = req.body.currency;
    if (err) {
      console.log(err.toString());
      res.status(200).send({'status': 0, 'msg': 'Error while uploading!! Please try again.'});
    } else {
      node_xj({
        input: req.file.path,
        output: null,
      }, function (err, result) {
        if (err) {
          console.log('Error while converting csv into json!!');
          console.log(err.toString());
          res.status(500).send(err.toString());
        } else {
          (async () => {
            try {
              let val = await populate_data(result, base_name);
              if (val) {
                let query = `
                SELECT 
                non_profit as "Non Profit", 
                count(non_profit) as "Number of Donations", 
                sum(donation_amount) as "Total Amount", 
                sum(fee) as "Total Fee"
                FROM "donation_details" as dd
                GROUP BY non_profit
                ORDER BY non_profit
              `;
                // Fetch the details using group by
                pool.query(query, [], function (err, results) {
                  if (err) {
                    console.log("Error while selecting(grouping)!");
                    console.log(err.toString());
                    res.status(500).send(err.toString());
                  } else {
                    let response = {};
                    response.status = 1;
                    response.list = results.rows;
                    response.msg = "File Generated Successfully! Download will begin shortly!";
                    res.status(200).send(response);
                  }
                });
              } else {
                console.log("Error while inserting or fetching currency details!!");
                res.status(500).send("Something went wrong!");
              }
            } catch (e) {
              console.error(e);
              res.status(500).send("Something went wrong!");
            }
          })();
        }
      });
    }
  })
});

app.listen(9090, function () {
  console.log('App listening on port 9090!');
});

async function populate_data(excel_data, base_currency) {

  let currency_details = await get_currency_details(base_currency);

  const client = await pool.connect();

  try {

    if (currency_details) {
      await client.query('BEGIN');

      // clear table first
      await client.query('TRUNCATE TABLE "donation_details"', []);

      // Fill in the table one entry at a time
      for (var [key, value] of iterate_object(excel_data)) {
        if (value["Order Id"] !== "" && value["Date"] !== "" && value["Nonprofit"] !== "" && value["Donation Currency"] !== "" && value["Donation Amount"] !== "" && value["Fee"] !== "") {
          await client.query('INSERT INTO "donation_details"(order_id, date, non_profit, donation_currency, donation_amount, fee, base_currency) VALUES($1, $2, $3, $4, $5, $6, $7)', [value["Order Id"], value["Date"], value["Nonprofit"], value["Donation Currency"], parseFloat(value["Donation Amount"]) / ((currency_details[value["Donation Currency"]] !== undefined) ? (currency_details[value["Donation Currency"]]) : 1), parseFloat(value["Fee"]) / ((currency_details[value["Donation Currency"]] !== undefined) ? (currency_details[value["Donation Currency"]]) : 1), base_currency]);
        }
      }

      await client.query('COMMIT');
      return 1;
    }
    else
      return 0;
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e.stack);
    return 0;
  } finally {
    client.release();
  }
}

function get_currency_details(base_currency) {
  return new Promise(function (resolve, reject) {
    request('https://api.exchangeratesapi.io/latest?base=' + base_currency, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log("Fetched currency details successfully!");
        resolve(JSON.parse(body).rates);
      } else {
        console.log("Error while fetching currency details!");
        resolve(null);
      }
    });
  });
}