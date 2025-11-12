# test-for-rtc

A simple Express.js server for creating and managing Kafka topics using JavaScript.

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start Kafka and Zookeeper using Docker Compose:
```bash
cd setup
docker-compose up -d
```

3. Wait for Kafka to be ready (around 30 seconds)

4. Start the Express server:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- **GET** `/`
- Returns server status and available endpoints

### Create a Topic
- **POST** `/topics`
- Body:
  ```json
  {
    "topicName": "my-topic",
    "numPartitions": 1,
    "replicationFactor": 1
  }
  ```
- Creates a new Kafka topic

### List All Topics
- **GET** `/topics`
- Returns a list of all Kafka topics

### Delete a Topic
- **DELETE** `/topics/:topicName`
- Deletes the specified Kafka topic

## Example Usage

### Create a topic:
```bash
curl -X POST http://localhost:3000/topics \
  -H "Content-Type: application/json" \
  -d '{"topicName": "test-topic", "numPartitions": 3, "replicationFactor": 1}'
```

### List topics:
```bash
curl http://localhost:3000/topics
```

### Delete a topic:
```bash
curl -X DELETE http://localhost:3000/topics/test-topic
```

## Stopping the Services

```bash
cd setup
docker-compose down
```