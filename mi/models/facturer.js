var mongoose = require('mongoose');

var FacturerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Facturer', FacturerSchema);
