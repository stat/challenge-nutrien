// reqs
const express = require('express');
const path = require('path');

// authN
const authN = (req, res, next) => {
  const isAuthorized = true;

  // TODO: validate credentials

  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("unauthorized");
  }
};

// express
const app = express();
const appPort = process.env.APP_PORT || 3000;

// views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));

// route
app.get('/:commodity/histogram', authN, (req, res) => {
  const data = { }
  res.render('histogram', data);
});

// route
app.get('/:commodityType/histogram', authN, (req, res) => {
  const data = { }
  res.render('histogram', data);
});

// start
app.listen(appPort, () => {
  console.log(`[server]: Server is running at http://localhost:${appPort}`);
});
