const AUTHENTICATION = "authenticate-user";
const RATING = "rating-books";

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
};
