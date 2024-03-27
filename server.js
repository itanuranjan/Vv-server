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
const userSchema = require ("./models/userSchema")
const app = express();
const port = 5000;

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


// API endpoint to insert data

// API endpoint to handle query submission
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

app.post('/api/thingstodo', async (req, res) => {
  try {
    const { title, city, imageUrl, route } = req.body;
    const newThingToDo = new ThingsToDo({ title, city, imageUrl, route });
    await newThingToDo.save();
    res.json(newThingToDo);
  } catch (error) {
    console.error('Error inserting ThingsToDo:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/hero', async (req, res) => {
  try {
    const { src, alt } = req.body;
    const newHero = new HeroModel({ src, alt });
    await newHero.save();
    res.json(newHero);
  } catch (error) {
    console.error('Error inserting Hero:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/toprecommented', async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrl,
      route,
      rating,
      price,
    } = req.body;
    const newTopRecommented = new TopRecommented({
      title,
      description,
      imageUrl,
      route,
      rating,
      price,
    });
    await newTopRecommented.save();
    res.json(newTopRecommented);
  } catch (error) {
    console.error('Error inserting TopRecommented:', error);
    res.status(500).send('Internal Server Error');
  }
});





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

app.get('/api/toprecommented', async (req, res) => {
  try {
    const toprecommented = await TopRecommented.find();
    res.json(toprecommented);
  } catch (error) {
    console.error('Error fetching TopRecommented:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/hero', async (req, res) => {
  try {
    const hero = await HeroModel.find();
    res.json(hero);
  } catch (error) {
    console.error('Error fetching hero:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/thingstodo', async (req, res) => {
  try {
    const thingstodo = await ThingsToDo.find();
    res.json(thingstodo);
  } catch (error) {
    console.error('Error fetching Things to do:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/api/user', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await userSchema.findOne({ email }, { fname: 1, email: 1, _id: 0 }); // Include only name and email fields, exclude _id
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Internal Server Error');
  }
});





app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
