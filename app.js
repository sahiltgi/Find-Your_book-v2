const express = require("express");
const middleware = require("./routes/middleware");
const routes = require("./routes/routes.js");
const session = require("express-session");
const mongodb = require("mongodb");
// var $ = require("jquery");
// var dt = require("datatables.net")();
const DB_URI =
  "mongodb+srv://sahil00:sahil123@cluster1-f6fqs.mongodb.net/test?retryWrites=true&w=majority";

const app = express();
const port = process.env.PORT || 8080;

//use sessions for tracking logins
app.use(
  session({
    secret: "g36sf465b4fs6b84s364af368g4fb",
    resave: true,
    saveUninitialized: false
  })
);

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

// defining middlewares
app.use(express.json());
app.use(middleware.preventCROS);

console.log("connecting to database...");
mongodb.MongoClient.connect(DB_URI, (error, dbClient) => {
  if (error) {
    console.log("error while connecting to dbClient", error);
    return;
  }
  // on successful connection
  console.log("Successfully connected to Database");
  const database = dbClient.db("authentication");
  routes(app, database);
  app.listen(port, () => {
    console.log(`Server started at ${port}`);
  });
});
