# LinkNest - Project Ingest Guide

This guide provides detailed instructions for setting up and ingesting files into the LinkNest video conferencing application.

## Project Structure

```
LinkNest/
├── client/                 # Frontend React application
│   ├── public/            # Public assets
│   │   ├── pages/        # Page components
│   │   ├── sections/     # Reusable sections
│   │   ├── redux/        # Redux state management
│   │   └── utils/        # Utility functions
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
│
└── server/                # Backend Node.js application
    ├── server.js         # Main server file
    └── package.json      # Backend dependencies
```

## File Ingest Process

### 1. Frontend Files

#### React Components
Place your React components in the appropriate directories:
- Pages: `client/src/pages/`
- Sections: `client/src/sections/`
- Utils: `client/src/utils/`

#### Static Assets
1. Place all static assets (images, icons, etc.) in:
```bash
client/public/
```

2. Reference these assets in your code using the public URL:
```javascript
const imageUrl = '/path/to/asset.png';
```

### 2. Backend Files

1. Place all server-side files in the `server/` directory
2. Main application logic goes in `server.js`
3. Create new route files in `server/routes/` (create directory if needed)
4. Place middleware in `server/middleware/` (create directory if needed)

## Configuration Files

### 1. Environment Variables

Create the following `.env` files:

#### Server (.env)
```env
PORT=5000
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

#### Client (.env)
```env
VITE_API_URL=http://localhost:5000
```

### 2. Package Configuration

Ensure your `package.json` files have the correct dependencies:

#### Server Dependencies
```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "socket.io": "^4.8.1",
    "twilio": "^5.4.2",
    "uuid": "^11.0.5"
  }
}
```

#### Client Dependencies
```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "@mui/material": "^6.4.0",
    "@reduxjs/toolkit": "^2.5.0",
    "react": "^18.3.1",
    "socket.io-client": "^4.8.1"
    // ... other dependencies
  }
}
```

## Development Setup

1. Install dependencies for both client and server:
```bash
# Server setup
cd server
npm install

# Client setup
cd ../client
npm install
```

2. Start development servers:
```bash
# Terminal 1 - Server
cd server
npm start

# Terminal 2 - Client
cd client
npm run dev
```

## Build Process

### Client Build
```bash
cd client
npm run build
```
The built files will be in `client/dist/`

### Production Deployment
1. Build the client
2. Copy the `dist` folder to your production server
3. Set up the server with production environment variables
4. Start the server using a process manager like PM2

## Common Issues and Solutions

1. **WebRTC Connection Issues**
   - Ensure Twilio credentials are correctly set
   - Check browser permissions for camera and microphone

2. **Socket Connection Errors**
   - Verify the VITE_API_URL is correctly set
   - Check if the server is running

3. **Build Errors**
   - Clear node_modules and package-lock.json
   - Reinstall dependencies
   - Ensure Node.js version matches requirements

## Development Guidelines

1. Follow the existing project structure
2. Use consistent naming conventions
3. Add comments for complex logic
4. Update documentation when adding new features

## Testing

1. Test WebRTC functionality in different browsers
2. Verify socket connections
3. Test room creation and joining
4. Validate chat functionality
5. Check responsive design on different devices

For any additional questions or issues, please refer to the main README.md or create an issue in the repository. 
