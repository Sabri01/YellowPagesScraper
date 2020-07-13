var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/scraper');
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});
var ListingsSchema = new mongoose.Schema({
  title: String,
  email: {type: String, lowercase: true},
  cell: Array,
  telephone: Array,
  fax: Array,
  website: {type: String, default: '', lowercase: true},
  postalAddress: Array,
  address: Array,
  url: String
});
module.exports = mongoose.model('Listings', ListingsSchema);