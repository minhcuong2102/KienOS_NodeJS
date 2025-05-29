// require('dotenv').config();
// const express = require('express');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const initApiController = require('./controller/index');
// const port = process.env.PORT || 8888;
// const app = express();

// const handleGlobalError = require('./middleware/global-error.middleware');

// app.use("/secret", express.Router().get('/', (req, res, next) => {
//     res.status(200).json({ message: "Secret path" });
// }));

// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next();
// });

// app.set('trust proxy', true)
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(cookieParser());

// app.use(bodyParser.urlencoded({extended: false}));

// initApiController(app);

// app.all('*', (req, res) => {
//     res.send('Message From Nodejs: This route doesnt exist, maybe check for the request type (GET/POST/PUT/DELETE) or the route itself');  
// });

// handleGlobalError(app);

// app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);  
// });
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const initApiRouter = require('./controller/index');
const initChatSocket = require('./socket/chat.socket');
const handleErrors = require('./middleware/global-error.middleware');

const port = process.env.PORT || 8888;
const app = express();

/* -------------------------- CORS CONFIGURATION -------------------------- */
const allowedOrigins = ['https://kienos-frontend-z1ie.onrender.com',
                        'capacitor://localhost',
                        'http://localhost',
                        'http://localhost:3000',
                        undefined
                       ];          

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Nếu FE sử dụng cookie
}));

// Xử lý preflight request cho mọi route
app.options('*', cors());

/* -------------------------- MIDDLEWARE -------------------------- */
app.use('/secret', express.Router().get('/', (req, res) => {
  res.status(200).json({ message: 'Secret path' });
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.set('trust proxy', true);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

/* -------------------------- ROUTER -------------------------- */
initApiRouter(app);

// Catch-all nếu route không tồn tại
app.all('*', (req, res) => {
  res.status(404).send(
    'Message From Nodejs: This route doesn’t exist. Maybe check the request type or route.'
  );
});

/* -------------------------- GLOBAL ERROR HANDLER -------------------------- */
handleErrors(app);

/* -------------------------- SOCKET.IO SETUP -------------------------- */
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

initChatSocket(io);
app.set('io', io);

/* -------------------------- START SERVER -------------------------- */
server.listen(port, () => {
  console.log(`Server + WebSocket listening on port ${port}`);
});
