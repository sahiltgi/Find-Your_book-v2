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
  //api/v1/bookdata
  //api/v2/bookdata
  app.get("/api/v1/bookdata", (req, res) => {
    const mydara = db.collection(BOOKDATA);
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < mydara.length) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    mydara.find({}).toArray(function(err, result) {
      var obj = JSON.parse(JSON.stringify(result));
      if (err) {
        throw err;
      } else {
        results.results = obj.slice(startIndex, endIndex);
        res.send(results);
        // console.log(results);
      }
    });
  });

  // app.get("/api/v2/bookdata"){};
  // app.get("/api/bookdata/:page/:perPage", function(req, res) {
  //   const mydata = db.collection(BOOKDATA);
  //   console.log("page number : " + req.params.page);
  //   console.log("per page : " + req.params.perPage);
  //   var pageNo = req.params.page; // parseInt(req.query.pageNo)
  //   var size = req.params.perPage;
  //   var query = {};
  //   if (pageNo < 0 || pageNo === 0) {
  //     response = {
  //       error: true,
  //       message: "invalid page number, should start with 1"
  //     };
  //     return res.json(response);
  //   }
  //   query.skip = size * (pageNo - 1);
  //   query.limit = parseInt(size);
  //   // Find some documents
  //   mydata.find({}, query, function(err, data) {
  //     // Mongo command to fetch all data from collection.
  //     let obj = JSON.parse(JSON.stringify(data));
  //     if (err) {
  //       response = { error: true, message: "Error fetching data" };
  //     } else {
  //       response = { error: false, message: obj };
  //       res.send(obj);
  //     }
  //   });
  // });
};
