const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const db = require("./mysql"); // Ensure mysql.js is configured correctly
const fs = require("fs");
const multer = require("multer");
const session = require("express-session");
const PDFDocument = require('pdfkit');

const app = express();

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
// Admin login route
app.post("/admin_login", (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password are correct
  if (username === 'Admin' && password === 'Admin') {
      req.session.isAdminLoggedIn = true;
      return res.status(200).send('Logged in');
  } else {
      return res.status(401).send('Invalid credentials');
  }
});

// Middleware to check if admin is logged in
function authMiddleware(req, res, next) {
  if (req.session.isAdminLoggedIn) {
      return next();
  }
  return res.status(401).send('You must log in first');
}

// Admin dashboard route (Protected)
app.get("/monitor", authMiddleware, (req, res) => {
  res.sendFile(__dirname + '/admin_dashboard.html'); // Send the Admin Dashboard HTML
});

// Check if admin is logged in (for checking session state)
app.get("/check-admin-login", (req, res) => {
  if (req.session.isAdminLoggedIn) {
      return res.status(200).send('Logged in');
  }
  return res.status(401).send('Not authenticated');
});

// Admin logout route
app.post("/adminLogout", (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).send('Logout failed');
      }
      return res.status(200).send('Logged out');
  });
});

// Fetch Donations Report (Protected Route)
app.get("/fetch-donations", authMiddleware, (req, res) => {
  let { startDate, endDate, sortBy } = req.query;
  let query = "SELECT * FROM donations WHERE 1";
  let queryParams = [];

  if (startDate && endDate) {
      query += " AND date_time BETWEEN ? AND ?";
      queryParams.push(startDate, endDate);
  }
  
  if (sortBy) {
      query += ` ORDER BY ${sortBy}`;
  }

  db.query(query, queryParams, (err, results) => {
      if (err) {
          console.error("Error fetching donations:", err);
          return res.status(500).json({ message: "Error fetching donations" });
      }

      // If "download" parameter is passed, generate and send the PDF
      if (req.query.download === 'true') {
          const doc = new PDFDocument();

          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=donations-report.pdf');

          doc.pipe(res); // Pipe the PDF output to the response stream

          doc.fontSize(20).text('Donations Report', { align: 'center' });
          doc.moveDown();

          // Table header
          doc.fontSize(12).text('Donor Name     Date          Amount');
          doc.moveDown(0.5);

          // Table rows
          results.forEach(donation => {
              doc.text(`${donation.donor_name}     ${donation.date_time}     ${donation.amount}`);
          });

          doc.end(); // Finish the PDF generation
          return; // End the response
      }

      // Return data as JSON if not downloading
      res.json(results);
  });
});

// Admin Logout (Redirect to Login Page)
app.get("/admin-logout", (req, res) => {
  req.session.destroy(() => {
      res.redirect("/admin_login.html");
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});