const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/connection');
const routes = require('./routes');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./schemas/resolvers');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 4000;
const app = express();

// CORS configuration
const corsOptions = {
  origin: 'https://googlebooks-1-18ao.onrender.com',
  credentials: true, // if you need to pass cookies or other credentials
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions)); // Handle OPTIONS requests for all routes


// Connect to MongoDB
connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const startApolloServer = async () => {
  // Start Apollo Server
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // Middleware setup
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
    });
  }
  // Apply routes
  app.use(routes);

  // Start the server
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();

