const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const log = require("./utils/logs");
const app = express();

// Constants
const {
  HOST,
  PORT,
  SESS_SECRET,
  NODE_ENV,
  IS_PROD,
  COOKIE_NAME,
} = require("./config/config");

// console.log = function() {} // remove logs from all over projects
let { dbConnection } = require("./utils/connection");

const MAX_AGE = 1000 * 60 * 60 * 3; // Three hours

dbConnection()
  .then(() => log("Connected to Database", "green"))
  .catch((err) => {
    console.log("error in connection", err);
    log(`Data Base Connection Failed, ${err.message}`, "red");
  });

// setting up connect-mongodb-session store
const mongoDBstore = new MongoDBStore({
  uri: process.env.mongoUri,
  collection: "mySessions",
});

// Express Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Morgan setup
app.use(morgan("dev"));

// app.use(cookieParser())
app.use(
  session({
    name: COOKIE_NAME, //name to be put in "key" field in postman etc
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoDBstore,
    cookie: {
      maxAge: MAX_AGE,
      sameSite: false,
      secure: IS_PROD,
    },
  })
);

app.use(helmet());

// Below corsOptions are for Local development
const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  console.log("Port ", PORT);
  res.send("Api Running");
});

// API / Routes;
require("./routes")(app);

let server = require("http").createServer(app);

server.listen(PORT, () =>
  console.log(`Server started on http://${HOST}:${PORT}`)
);
