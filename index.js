require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const tagRoutes = require("./routes/tags");
const messagesRoutes = require("./routes/messages");

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use("/tags", tagRoutes);
app.use("/messages", messagesRoutes);

// catch 404 and forward to error handler
if (app.get("env") === "development") {
  app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    return next(err);
  });
}

// development error handler
// will print stacktrace

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.json({
    message: err.message,
    error: err,
  });
});

if (process.env.NODE_ENV === "production") {
  // Exprees will serve up production assets
  app.use(express.static("client/build"));

  // Express serve up index.html file if it doesn't recognize route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(process.env.PORT || 3000, () => {
  console.log("Getting started on port 3000!");
});
