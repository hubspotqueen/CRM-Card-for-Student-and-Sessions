require('dotenv').config();

const express = require('express');
const { Client } = require('@hubspot/api-client');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('HubSpot CRM Card API is running!');
});

// Initialize the HubSpot client once
const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_API_KEY });

// Route for Check-In
app.post('/check-in', async (req, res) => {
  const { studentId, sessionId } = req.body;

  try {
    // Logic to check in the session and create a session record if needed
    const sessionData = {
      properties: {
        studentId,
        sessionId,
        status: 'Checked-In',
      }
    };

    // Update the session status in HubSpot
    const apiResponse = await hubspotClient.crm.objects.basicApi.update(  
      'sessions', // your custom object type
      sessionId,   
      sessionData 
    );
        
    res.status(200).json({ message: 'Check-in successful', data: apiResponse });
  } catch (error) {
    res.status(500).json({ message: 'Error during check-in', error: error.message });
  }
});

// Route for Check-Out
app.post('/check-out', async (req, res) => {
  const { studentId, sessionId } = req.body;

  try {
    // Logic to check out the session and update its status
    const sessionData = {
      properties: {
        studentId,
        sessionId,
        status: 'Checked-Out',
      }
    };

    // Update the session status in HubSpot
    const apiResponse = await hubspotClient.crm.objects.basicApi.update(
      'sessions', // your custom object type
      sessionId,   
      sessionData 
    );
    
    res.status(200).json({ message: 'Check-out successful', data: apiResponse });
  } catch (error) {
    res.status(500).json({ message: 'Error during check-out', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

