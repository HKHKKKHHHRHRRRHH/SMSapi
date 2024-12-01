const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Webhook to receive SMS data
app.post("/sms-webhook", async (req, res) => {
  try {
    const { from, message } = req.body; // Extract sender and message from the request

    console.log(`Received SMS from: ${from}, Message: ${message}`);

    // Dummy processing (e.g., extracting NPK values)
    const recommendedFertilizer = `Recommended Fertilizer: NPK-20:20:20 based on your input`;

    // Send the response back to the farmer via Traccar API
    const traccarUrl = "http://192.168.1.33:8082/"; // Replace with your Traccar endpoint
    const token = "c951526d-fb5f-438b-ae05-8c9060fcceaa"; // Replace with your token

    const response = await axios.post(
      traccarUrl,
      {
        to: from, // Farmer's phone number
        message: recommendedFertilizer,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(`Message sent back to farmer: ${response.data}`);
    res.status(200).json({ success: true, message: "Response sent back to farmer" });
  } catch (error) {
    console.error("Error processing SMS:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`SMS backend listening on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
    res.send("SMS Backend is running!");
});