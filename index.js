const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Kafka client
const kafka = new Kafka({
  clientId: 'express-kafka-app',
  brokers: ['localhost:9092']
});

// Create Kafka admin client
const admin = kafka.admin();

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Kafka Express Server is running',
    endpoints: {
      createTopic: 'POST /topics',
      listTopics: 'GET /topics',
      deleteTopic: 'DELETE /topics/:topicName'
    }
  });
});

// Create a new Kafka topic
app.post('/topics', async (req, res) => {
  try {
    const { topicName, numPartitions = 1, replicationFactor = 1 } = req.body;

    if (!topicName) {
      return res.status(400).json({ error: 'topicName is required' });
    }

    // Connect to Kafka admin
    await admin.connect();

    // Create the topic
    await admin.createTopics({
      topics: [
        {
          topic: topicName,
          numPartitions: numPartitions,
          replicationFactor: replicationFactor
        }
      ]
    });

    await admin.disconnect();

    res.status(201).json({
      success: true,
      message: `Topic '${topicName}' created successfully`,
      topic: {
        name: topicName,
        numPartitions,
        replicationFactor
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// List all Kafka topics
app.get('/topics', async (req, res) => {
  try {
    await admin.connect();
    const topics = await admin.listTopics();
    await admin.disconnect();

    res.json({
      success: true,
      topics: topics,
      count: topics.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete a Kafka topic
app.delete('/topics/:topicName', async (req, res) => {
  try {
    const { topicName } = req.params;

    await admin.connect();
    await admin.deleteTopics({
      topics: [topicName]
    });
    await admin.disconnect();

    res.json({
      success: true,
      message: `Topic '${topicName}' deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Kafka broker configured at: localhost:9092`);
});
