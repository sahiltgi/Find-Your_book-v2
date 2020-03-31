const ObjectID = require("mongodb").ObjectID;
const AUTHENTICATION = "authenticate-user";
const BOOKDATA = "book-database";
const WISHLIST = "user-wishlist";

module.exports = function(app, db) {
  /*--------------------------------------------------------AUTHENTICATION-----------------------------------------------------------*/
  //login
  // app.post("/api/login", (req, res) => {
  //   const { email, password } = req.body;
  //   const collection = db.collection(AUTHENTICATION);
  //   collection.findOne({ email: email, password: password }, (err, user) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).send(err);
  //     }
  //     if (!user) {
  //       return res.status(404).send("please register first");
  //     }
  //     req.session.user = user;
  //     return res.status(200).send({
  //       user_obj: user,
  //       status: "success",
  //       message: "successfully logged in"
  //     });
  //   });
  // });
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
      return res.status(200).send({
        user_obj: user,
        status: "success",
        message: "successfully logged in"
      });
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
        // console.log(result);
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
      }
    });
  });

  // app.get("/api/v2/bookdata", function(req, res) {
  //   const myData = db.collection(BOOKDATA);
  //   myData
  //     .find({})
  //     .skip(10)
  //     .limit(10);
  //   console.log(myData);
  // });

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

  /*---------------------------------------------USER SPECIFIC WISHLIST------------------------------------------*/
  db.createCollection("user-wishlist", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["bagpack"],
        properties: {
          // user_id: {
          //   bsonType: "string",
          //   description: "must be a string and is required"
          // },
          bagpack: {
            bsonType: "array",
            description: "must be a object",
            uniqueItems: true
          }
        }
      }
    },
    validationAction: "error" // "warn" to allow wrong entries with warning
  });

  app.put("/api/wishlist", (req, res) => {
    const body = req.body;
    const userId = body.user_id;
    const bookId = body.book.id;
    const bookName = body.book.name;
    const bookAuthor = body.book.author;
    const bookImg = body.book.img;
    if (body) {
      const collection = db.collection(WISHLIST);
      console.log("user wishlist", collection);
      collection
        .updateOne(
          { _id: userId }, // filter
          {
            $push: {
              bagpack: {
                bookId: bookId,
                bookName: bookName,
                bookAuthor: bookAuthor,
                bookImg: bookImg
              }
            }
          },
          { upsert: true }
        )
        .then(result => {
          res.status(200).send({
            message: "new book added sucessfully",
            data: result
          });
        })
        .catch(error => {
          console.log("update error", error);
          res.status(400).send({
            message: "update failed",
            error: error
          });
        });
    }
  });

  app.get("/api/wishlist/display", function(req, res) {
    const wishlistData = db.collection(WISHLIST);
    console.log(wishlistData);
    wishlistData.find({}).toArray(function(err, result) {
      let obj = JSON.parse(JSON.stringify(result));
      if (err) {
        throw err;
      } else {
        console.log(obj);
        res.send(obj);
      }
    });
  });
};
