require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const { auth } = require('express-openid-connect');

const app = express();

app.set('view engine', 'ejs');

app.use(session({
  secret: 'secretkey',
  resave: true,
  saveUninitialized: false,
}));

// OIDC setup
const oidc = new ExpressOIDC({
  issuer: process.env.OKTA_ISSUER,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  redirect_uri: process.env.OKTA_REDIRECT_URI,
  appBaseUrl: 'http://localhost:3000',
  scope: 'openid profile email',
});





// Use OIDC with Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
app.use(oidc.router);

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.get('/login', oidc.ensureAuthenticated(), (req, res) => {
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});


// Auth0 Setup
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'j5vxYiqTJdukvYemmu6uUOONa9xIXPML',
  issuerBaseURL: 'https://dev-bhuvan.us.auth0.com',

};
app.use('/auth0',auth(config));

app.get('/', (req, res) => {
   const user = req.user || req.oidc?.user;

  res.render('index', {user});
});

// Start
oidc.on('ready', () => {
  app.listen(3000, () => console.log('App running on http://localhost:3000'));
});

oidc.on('error', err => {
  console.error('OIDC Error:', err);
});

