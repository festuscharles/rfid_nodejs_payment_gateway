const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const WebSocket = require('ws')
const { Customer } = require("./models/customers.js")
require('dotenv').config()

const app = express()
const PORT = process.env.PORT

//database connection
mongoose.connect(process.env.DB_URL)
mongoose.set('strictQuery', false);
 
//mIddleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
   

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({server})


// Register a new Customer
app.post('/api/customers', async (req, res) => {
  try {
    const { fullname, email, tagId } = req.body
    const customer = { fullname, email, tagId }
    await Customer.create( customer )
    res.status(201).json({ message: 'Customer created successfully' })
  } catch (err) {
    res.status(500).send(err);
  }
})  


// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected')

  // Handle incoming messages
  ws.on('message', async (message) => {
    console.log(`Received tag Id: ${message}`)
    global.message = message
  })

  ws.on('close', () => {
    console.log('Client disconnected.');
  });
})


// Get customer when RFID is scanned
app.get("/api/customers/scanid", async (req, res) => {
  try {
    console.log("Waiting for you to scan the RFID...")
    tagId = await global.message
    if (!tagId) {
      return res.status(200).json({ message: "Please scan your RFID card"})
    }
    const customerDetails = await Customer.findOne({tagId})
    console.log(customerDetails)
    res.status(200).json(customerDetails)

  } catch (err) {
    console.error(`Error occurred: ${err}`)
    res.status(500).json({ message: 'Error occurred' })
  }
})
 
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`)
})
