# Fillout Takehome

This is a simple Express.js server for handling requests to the Fillout API. It demonstrates fetching form submissions from the Fillout API and applying additional server-side filtering.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (Recommended version: 14.x or higher)
- npm (Node Package Manager)

## Installation

To install the necessary dependencies, run the following command:

```bash
npm install
```

### Configuration
Create a .env file in the root directory of your project and add the following environment variable:
```
FILLOUT_API_KEY=your_api_key_here
```

### Running the Server
To start the server, run:

```bash
node app.js
```

### Example Request
```
http://localhost:3000/{formId}/filteredResponses?filters=[{"id":"questionId","condition":"equals","value":"value"}]
```
