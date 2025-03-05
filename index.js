// const express = require('express');
// const app = express();
// const cors = require('cors');
// const bodyParser = require("body-parser");

// // ✅ Import Routes
// const AuthRouter = require('./Routes/AuthRouter');
// const ExpenseRouter = require('./Routes/ExpenseRouter');
// const CategoryRouter = require("./Routes/CategoryRouter");
// const IncomeRouter = require("./Routes/IncomeRouter");
// const DashboardRouter = require("./Routes/DashboardRouter");
// const transactionRoutes = require("./Routes/TransactionRouter");
// const billRoutes = require("./Routes/billRoutes");
// const goalRoutes = require("./Routes/goalRouter"); // ✅ Goals Route (Authentication Removed)
// const ensureAuthenticated = require('./Middlewares/Auth');
// const notificationRoutes = require("./Routes/notificationRoutes"); // ✅ Import notification routes


// require("./cronJobs/dueBillNotifier"); // ✅ Load Due Bill Notification Cron Job
// require('dotenv').config();
// require('./Models/db');
// app.use(express.json()); // ✅ Allows parsing JSON request body
// const PORT = process.env.PORT || 8080;


// app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: "https://f1-euwb.onrender.com", credentials: true })); // ✅ Allow frontend requests
// app.use(bodyParser.json());

// app.get('/ping', (req, res) => {
//     res.send('PONG');
// });





// // ✅ Routes (Authorization Applied Where Needed)
// app.use('/auth', AuthRouter);
// app.use('/expenses', ensureAuthenticated, ExpenseRouter);
// app.use('/categories', CategoryRouter);
// app.use('/incomes', ensureAuthenticated, IncomeRouter);
// app.use("/dashboard", DashboardRouter);
// app.use("/transactions", transactionRoutes);
// app.use("/api/bills", billRoutes);
// app.use("/api/notifications", notificationRoutes); // ✅ Add notification routes

// // ✅ 🚀 Goals Route (Authentication Removed)
// app.use("/goals", goalRoutes);

// app.listen(PORT, () => {
//     console.log(`✅ Server is running on ${PORT}`);
// });



const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./Models/db');

// ✅ Import Routes
const AuthRouter = require('./Routes/AuthRouter');
const ExpenseRouter = require('./Routes/ExpenseRouter');
const CategoryRouter = require('./Routes/CategoryRouter');
const IncomeRouter = require('./Routes/IncomeRouter');
const DashboardRouter = require('./Routes/DashboardRouter');
const transactionRoutes = require('./Routes/TransactionRouter');
const billRoutes = require('./Routes/billRoutes');
const goalRoutes = require('./Routes/goalRouter');
const notificationRoutes = require('./Routes/notificationRoutes');
const ensureAuthenticated = require('./Middlewares/Auth');

require('./cronJobs/dueBillNotifier');

const PORT = process.env.PORT || 8080;

// ✅ Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ CORS Setup
app.use(cors({
    origin: ['http://localhost:5176', 'https://f1-euwb.onrender.com'],
    credentials: true,
}));

// ✅ Health Check Route
app.get('/ping', (req, res) => {
    res.send('PONG');
});

// ✅ Routes Setup
app.use('/auth', AuthRouter);
app.use('/expenses', ensureAuthenticated, ExpenseRouter);
app.use('/categories', CategoryRouter);
app.use('/incomes', ensureAuthenticated, IncomeRouter);
app.use('/dashboard', DashboardRouter);
app.use('/transactions', transactionRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/goals', goalRoutes);

// ✅ 404 Error Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// ✅ Global Error Handler (500 Errors)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
