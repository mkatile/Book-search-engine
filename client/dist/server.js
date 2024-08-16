const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const db = require('./config/connection'); 
const typeDefs = require('./schemas/typeDefs'); 
const resolvers = require('./schemas/resolvers'); 
const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Apollo Server with typeDefs and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Apply Apollo Server middleware to Express app
server.applyMiddleware({ app, path: '/graphql' });

// Middleware for parsing application/x-www-form-urlencoded and JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
}

// Serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});


// Use custom routes
app.use(routes);

// Connect to MongoDB and start the server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`);
  });
});
