const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session')

const authRouter = require('./auth/auth-router')
const userRouter = require('./users/users-router')

const logger = (req, res, next) => {
  const timestamp = new Date().toLocaleString()
  const method = req.method
  const url = req.originalUrl
  console.log(`[${timestamp}] ${method} to ${url}`)
  next()
}

/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".

  The session can be persisted in memory (would not be adecuate for production)
  or you can use a session store like `connect-session-knex`.
 */
const sessionConfig = {
  name: 'chocolatechip',
  secret: 'no one can know', // should be set with an environment variable
  cookie: {
    maxAge: 1000 * 600, // after x milliseconds, cookie expires
    secure: false, // true in production
    httpOnly: true
  },
  resave: false, // if session hasn't been changed, create new session?
  saveUninitialized: false, // by law, do not set cookies automatically
}

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(logger)
server.use(session(sessionConfig))

server.use('/api/auth', authRouter)
server.use('/api/users', userRouter)

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
