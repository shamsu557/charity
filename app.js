const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const db = require("./mysql"); // Ensure mysql.js is configured correctly
const fs = require("fs");
const multer = require("multer");
const session = require("express-session");

const app = express();
const saltRounds = 10;

app.use(
  session({
    secret: "a45A7ZMpVby14qNkWxlSwYGaSUv1d64x",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour session expiration
    },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

function isAuthenticated(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/checkSession", (req, res) => {
  if (req.session && req.session.loggedin) {
    res.json({ loggedin: true, user: req.session.teacher });
  } else {
    res.json({ loggedin: false });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/login");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "1440shamsusabo@gmail.com", // Your Gmail address
    pass: "xgxw lgas frhh ugiq", // App password
  },
});

// Contact form submission route
app.post("/send-message", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: "1440shamsusabo@gmail.com",
    subject: `New Contact Form Submission from ${name}`,
    text: `You have a new message from your website contact form:

Name: ${name}
Email: ${email}
Message: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send your message. Please try again later." });
    }
    console.log("Email sent: " + info.response);
    return res.status(200).json({ message: "Your message has been sent successfully!" });
  });
});
app.post("/donate", (req, res) => {
  const { donorName, donorEmail, donorPhone, amount, country, state, reference } = req.body;

  // Ensure required fields are present (donorEmail and donorPhone are optional)
  if (!donorName || !amount || !country || !state || !reference) {
      return res.status(400).json({ message: "All required fields must be filled." });
  }

  // Use NULL if donorEmail or donorPhone are missing
  const emailToStore = donorEmail && donorEmail.trim() !== "" ? donorEmail : null;
  const phoneToStore = donorPhone && donorPhone.trim() !== "" ? donorPhone : null;

  const query = `
    INSERT INTO donations (donor_name, donor_email, donor_phone, amount, country, state, reference, date_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;

  db.query(query, [donorName, emailToStore, phoneToStore, amount, country, state, reference], (err, result) => {
      if (err) {
          console.error("Error inserting donation:", err);
          return res.status(500).json({ message: "Donation processing failed. Please try again." });
      }
      res.status(200).json({ message: "Donation successful. Thank you for your generosity!" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});