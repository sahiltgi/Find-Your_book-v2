const AUTHENTICATION = "authenticate-user";
const RATING = "rating-books";
const BOOKDATA = "book-database";

module.exports = function(app, db) {
  /*--------------------------------------------------------AUTHENTICATION-----------------------------------------------------------*/
  //login
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const collection = db.collection(AUTHENTICATION);
    collection.findOne({ email: email, password: password }, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      if (!user) {
        return res.status(404).send("please register first");
      }
      req.session.user = user;
      return res.status(200).send("Successful login");
    });
  });

  //logout
  app.get("/api/user/logout/", (req, res) => {
    req.session.destroy();
    return res.status(200).send("user session killed");
  });

  //register
  app.post("/api/signup", (req, res) => {
    const { username, email, password } = req.body;
    const collection = db.collection(AUTHENTICATION);
    collection
      .insertOne({
        username: username,
        email: email,
        password: password
      })
      .then(result => {
        res.send({
          status: "success",
          message: "new user added"
        });
        console.log(result);
      })
      .catch(err => {
        res.status(400).send({
          status: "db_error",
          message: err
        });
      });
  });

  //dashboard
  app.get("/api/user/dashboard", (req, res) => {
    if (!req.session.user) {
      return res.status(401).send("Session Expired");
    }
    return res.status(200).send(req.session.user);
  });

  /*-----------------------------------------FETCHING DATA FROM MONGO-----------------------------------------------*/

  //Get data in frontend
  app.get("/api/bookdata", (req, res) => {
    const mydara = db.collection(BOOKDATA);
    mydara.find({}).toArray(function(err, result) {
      var obj = JSON.parse(JSON.stringify(result));
      if (err) {
        throw err;
      } else {
        res.send(obj);
      }
    });
  });

  // var schema = new mongoose.schema({
  //   _id = String,
  //   authors = String,
  //   title = String
  // })

  // app.get("/app/bookdata",function(req,res){

  // })

  // app.get("/api/bookdata", (req, res) => {
  //   const collection = db.collection(BOOKDATA);
  //   collection.find({}, (err, result) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).send(err);
  //     } else {
  //       // return res.status(200).send(JSON.stringify(result));
  //       console.log(JSON.stringify(result));
  //     }
  //   });
  // });
};
