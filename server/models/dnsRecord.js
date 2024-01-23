const mongoose = require('mongoose');

const dnsRecordSchema = new mongoose.Schema({
    type: { 
        type: String, 
        
         
      },
  name: { 
      type: String, 
      
    },
    value: { 
        type: String, 
         
      },
    created_at: { 
       type: Date,
       default: Date.now 
      },
    updated_at: { 
      type: Date, 
      default: Date.now 
    },
 
});

dnsRecordSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('dnsRecord', dnsRecordSchema);
