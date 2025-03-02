const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");  
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON requests
// app.use(cors({ origin: ["http://localhost:5173","https://knh-frontend.vercel.app/"], credentials: true })); 
app.use(cors()); 
app.use(cookieParser()); // Parse cookies
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { dbName: "ecomm" }) // Ensure correct database name
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });
  app.get("/", (req, res) => {
    res.send("Backend is running successfully on Render! 🚀");
  });
  
  // Start the server
  app.use(cors({
    origin: ["http://localhost:5173","https://knh-frontend.vercel.app"],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email (set in .env)
    pass: process.env.EMAIL_PASS, // Your email password (set in .env)
  },
});

// API Route to Handle Form Submission
app.post("/send-email", async (req, res) => {
  const { name, email, phone, communication, service, date } = req.body;

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "aryansahu7000@gmail.com", // Change to your receiving email
    subject: "New Consultation Form Submission",
    text: `You have a new consultation request:\n\n
    Name: ${name}\n
    Email: ${email}\n
    Phone: ${phone}\n
    Communication Method: ${communication}\n
    Service: ${service}\n
    Date: ${date}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
});

// Import Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);
// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
