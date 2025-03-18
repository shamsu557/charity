const mysql = require('mysql');
//MySQL database connection configuration
const dbConfig = {
    host: process.env.DB_HOST || '195.250.27.35',  // Use environment variable or default
    port: process.env.DB_PORT || 3306,                       // Default MySQL port or environment variable
    user: process.env.DB_USER || 'sekurefo_shamsu557',               // MySQL username from environment
    password: process.env.DB_PASSWORD || '@Shamsu1440',       // MySQL password from environment
    database: process.env.DB_NAME || 'sekurefo_dbase'            // Database name from environment
};


// // MySQL database connection configuration
// const dbConfig = {
//     host: process.env.DB_HOST || 'mysql-shamsu557.alwaysdata.net',  // Use environment variable or default
//     port: process.env.DB_PORT || 3306,                       // Default MySQL port or environment variable
//     user: process.env.DB_USER || 'shamsu557',               // MySQL username from environment
//     password: process.env.DB_PASSWORD || '@Shamsu1440',       // MySQL password from environment
//     database: process.env.DB_NAME || 'shamsu557_school_database'            // Database name from environment
// };



// Create MySQL connection
const db = mysql.createConnection(dbConfig);

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Export the database connection
module.exports = db;


// //
// CREATE TABLE admin (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     phone VARCHAR(20) NOT NULL,
//     username VARCHAR(100) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     role ENUM('Admin', 'Assistant Admin') NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE donations (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     donor_name VARCHAR(255) NOT NULL,
//     donor_email VARCHAR(255) NOT NULL,
//     donor_phone VARCHAR(20) NOT NULL,
//     amount DECIMAL(10,2) NOT NULL,
//     country VARCHAR(100) NOT NULL,
//     state VARCHAR(100) NOT NULL,
//     reference VARCHAR(255) UNIQUE NOT NULL,
//     date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

