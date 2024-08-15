const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// Import the book schema
const bookSchema = require('./Book'); // Import the Book model

// Define the user schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // Store savedBooks as an array of ObjectIds referencing the Book model
    savedBooks: [bookSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash user password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Method to compare and validate password
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Virtual field to get the number of saved books
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

// Create the User model
const User = model('User', userSchema);

module.exports = User;
