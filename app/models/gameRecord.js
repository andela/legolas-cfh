const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const gameRecordSchema = new Schema({
  gameOwner: String,
  gamePlayDate: [],
  gameID: String,
  gamePlayers: [],
  gameRounds: Number,
  gameWinner: String
});
module.exports = mongoose.model('Record', gameRecordSchema);
