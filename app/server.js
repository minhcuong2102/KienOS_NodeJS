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
const express        = require('express');
const http           = require('http');               // ⬅️ thêm
const socketIO       = require('socket.io');          // ⬅️ thêm
const cookieParser   = require('cookie-parser');
const bodyParser     = require('body-parser');
const initApiRouter  = require('./controller/index');
const initChatSocket = require('./socket/chat.socket'); // ⬅️ thêm
const handleErrors   = require('./middleware/global-error.middleware');
const cors = require('cors');
const port = process.env.PORT || 8888;
const app  = express();
// app.use(cors({
//   origin: ['https://kienos-frontend-z1ie.onrender.com', 'https://kienos-backend-4w2a.onrender.com'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true,
// }));

// app.options('*', cors());
/* --------------------------  MIDDLEWARE CŨ  -------------------------- */
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

/* --------------------------  ROUTER CŨ  -------------------------- */
initApiRouter(app);


app.all('*', (req, res) => {
  res.send(
    'Message From Nodejs: This route doesnt exist, maybe check for the request type (GET/POST/PUT/DELETE) or the route itself'
  );
});

/* --------------------------  GLOBAL ERROR  -------------------------- */
handleErrors(app);

/* --------------------------  SOCKET.IO  -------------------------- */
// bọc app Express vào http.Server rồi gắn socket
const server = http.createServer(app);
const io     = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// khởi tạo logic socket (phòng chat, v.v.)
initChatSocket(io);

// cho phép controller/service truy cập io qua req.app.get('io')
app.set('io', io);

/* --------------------------  KHỞI CHẠY  -------------------------- */
server.listen(port, () => {
  console.log(`Server + WebSocket listening on port ${port}`);
});
