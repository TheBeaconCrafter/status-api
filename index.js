const pinger = require("./pinger.js");
const api = require("./api.js");
const db = require("./db.js");

api.app.listen(api.port, () => {
  console.log(`App listening at http://localhost:${api.port}`);
  db.initializeTables(() => {
    console.log('Database is ready for queries.');
    pinger.schedule();
  });
});