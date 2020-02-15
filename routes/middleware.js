module.exports = {
  preventCROS: function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept,DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Range"
    );
    res.header("Access-Control-Expose-Headers", "Content-Length,Content-Range");
    next();
  }
};
