const express = require('express');
const sqlite = require('sqlite');

const app = express();
const port = process.env.PORT || 5000;

const db = new sqlite.Database('aq.db');
let sql;

//1st run setup maybe
function createTable() {
  sql = `CREATE TABLE pollData(ID INTEGER PRIMARY KEY userEmail, city,
  aqi, particulatesData )`
}
// CREATE Table if user 
// sql = `CREATE TABLE users(ID INTEGER PRIMARY KEY, username, last_name,
//   first_name, email, data_date, data)`
// db.run(sql)

app.get('/api/data', (req, res) => {
  db.all('SELECT * FROM your_table WHERE userId=userId', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      createTable();
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});