/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const config = require('../../config/config');

const Schema = mongoose.Schema;

/**
 * Answer Schema
 */
const AnswerSchema = new Schema({
  id: {
    type: Number
  },
  text: {
    type: String,
    default: '',
    trim: true
  },
  official: {
    type: Boolean
  },
  expansion: {
    type: String,
    default: '',
    trim: true
  },
  region: {
    type: String,
    default: 'all'
  }
});

/**
 * Statics
 */
AnswerSchema.statics = {
  load: (id, cb) => {
    this.findOne({
      id
    }).select('-_id').exec(cb);
  }
};

mongoose.model('Answer', AnswerSchema);
