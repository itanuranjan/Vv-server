require("dotenv").config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const router = require("./routes/router");
const CityModel = require('./models/City');
const TopRecommented = require('./models/TopRecommented');
const ThingsToDo = require('./models/ThingsToDo');
const HeroModel = require('./models/Hero');
const connectToDatabase = require('./database/db');
const Query = require('./models/queryModel');
const userSchema = require("./models/userSchema");
const VerifyModel = require("./models/VerifyModel");
const students = require('./studentsData');
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const port = 5000;

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO with custom path and CORS configuration
const io = new Server(server, {
  cors: {
    origin: "https://sunyape.com",  // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/khateraho/socket.io",  // Custom socket path
});

// Socket.IO Connection Logic
const quotes = [
  "The only way to do great work is to love what you do. – Steve Jobs",
  "The purpose of our lives is to be happy. – Dalai Lama",
  "In the end, we will remember not the words of our enemies, but the silence of our friends. – Martin Luther King Jr.",
  "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. – Ralph Waldo Emerson",
  "The best time to plant a tree was 20 years ago. The second best time is now. – Chinese Proverb",
  "It is never too late to be what you might have been. – George Eliot",
];

// Static token for authentication (replace with real authentication if needed)
const validToken = "12345";

io.on("connection", (socket) => {
  const { token } = socket.handshake.query;  // Get token from query parameters

  if (token !== validToken) {
    console.log("Invalid Token");
    socket.emit("error", "Invalid token. Authentication failed.");
    socket.disconnect();
    return;
  }

  console.log("User Connected", socket.id);

  // Handle incoming messages
  socket.on("message", ({ room, message }) => {
    console.log({ room, message });

    // Send a random quote with the message
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    // Emit the message along with a random quote
    socket.to(room).emit("receive-message", { message, quote: randomQuote });

    // Emit the quote to the user who sent the message as well
    socket.emit("receive-quote", randomQuote);
  });

  // Handle room joining
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined room ${room}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.use(cors());
app.use(express.json());
app.use(router);

// Connect to MongoDB
connectToDatabase();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Save all student data to the database
VerifyModel.insertMany(students)
  .then(() => console.log("All student data saved successfully"))
  .catch(error => console.error("Error saving student data:", error));

// API endpoints for data insertion
app.post('/api/query', async (req, res) => {
  try {
    const { name, email, phone, query } = req.body;
    const newQuery = new Query({ name, email, phone, query });
    await newQuery.save();
    res.json(newQuery);

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: 'New Query',
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Query: ${query}
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (error) {
    console.error('Error inserting/querying:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/cities', async (req, res) => {
  try {
    const { title, description, imageUrl, route } = req.body;
    const newCity = new CityModel({ title, description, imageUrl, route });
    await newCity.save();
    res.json(newCity);
  } catch (error) {
    console.error('Error inserting city:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Other API endpoints...

// API endpoint to retrieve data
app.get('/api/cities', async (req, res) => {
  try {
    const cities = await CityModel.find();
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).send('Internal Server Error');
  }
});

// More API routes...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Run Socket.IO server on the same port
server.listen(port, () => {
  console.log(`Server and Socket.IO are running on port ${port}`);
});
