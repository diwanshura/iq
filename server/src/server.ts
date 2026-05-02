import { createApp, initializeApp } from './app.js';
import { connectDB } from './config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize app (load datasets, etc.)
    await initializeApp();

    // Create Express app
    const app = createApp();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
