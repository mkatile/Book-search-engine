const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        try {
          // Retrieve user data, populate fields if needed
          const user = await User.findById(context.user._id).populate('savedBooks');
          if (!user) {
            throw new Error('User not found');
          }
          return user;
        } catch (err) {
          console.error(err);
          throw new Error('Failed to fetch user data');
        }
      }
    },
  },
  
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    
    saveBook: async (parent, { newBook }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id, // Use _id instead of id
          { $addToSet: { savedBooks: newBook } },
          { new: true } // Return the updated document
        ).populate('savedBooks'); // Populate savedBooks if needed
        return updatedUser; // Return the entire updated User object
      }
      throw new AuthenticationError('Not logged in');
    },
    
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id, // Use _id instead of id
          { $pull: { savedBooks: { bookId } } },
          { new: true } // Return the updated document
        ).populate('savedBooks'); // Populate savedBooks if needed
        return updatedUser; // Return the entire updated User object
      }
      throw new AuthenticationError('Not logged in');
    },
  },
};

module.exports = resolvers;
