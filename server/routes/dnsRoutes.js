const express = require('express');
const app = express();
const router = express.Router();
const dnsRecord = require('../models/dnsRecord');
var fileupload = require("express-fileupload");
app.use(fileupload());



//Router to get all DNS record
router.get('/all-records', async(req,res) => {
  try{
    const records = await dnsRecord.find();
    const roleData = records.map(record => ({
      type: record.type,
      name: record.name,
      value: record.value,
    }));
    res.status(200).json({roleData});
  }
  catch(error){
    console.error(error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
})
router.get('/dns-records', async (req,res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const records = await dnsRecord.find()
        .skip((page - 1) * limit)
        .limit(+limit);  // Convert 'limit' to a number

        const roleData = records.map(record => ({
          id: record._id,
          type: record.type,
          name: record.name,
          value: record.value,
          created_at: record.created_at,
          updated_at: record.updated_at,
        }));
        const totalRecords = await dnsRecord.countDocuments();
        const response = {
          status: true,
          content: {
            data: roleData,
          },
          
        };
      
        res.json({response, totalPages: Math.ceil(totalRecords / limit),
        currentPage: +page});
       // console.log(response);
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: 'Internal Server Error' });
      }
})
//Route for bulk CSV upload
router.post('/dns-records/csvupload', async (req,res) => {
    try {
        const { data } = req.body;
        console.log(data);
        const insertMany = await dnsRecord.insertMany(data);
       res.status(200).json({ message: 'CSV data uploaded and saved successfully.' });
      } catch (error) {
        console.error('Error saving records to the database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})
// Route to add a DNS record
router.post('/dns-records', async (req, res) => {
    const { type, name, value } = req.body;
  
    try {
      // Save the record to the database
      const newRecord = new dnsRecord({ type, name, value });
      await newRecord.save();
  
      res.status(201).json({ message: 'DNS record added successfully' });
    } catch (error) {
      console.error('Error adding DNS record:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Route to update a DNS record
router.put('/dns-records/:id', async (req, res) => {
    const { id } = req.params;
    const { type, name, value } = req.body;
  
    try {
      // Validate type and perform type-specific logic (similar to the 'POST' route)
     
      // Update the record in the database
      const updatedRecord = await dnsRecord.findByIdAndUpdate(id, { type, name, value }, { new: true });
      
      if (!updatedRecord) {
        return res.status(404).json({ message: 'DNS record not found' });
      }
  
      res.json({ message: 'DNS record updated successfully' });
    } catch (error) {
      console.error('Error updating DNS record:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Route to delete a DNS record
  router.delete('/dns-records/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Delete the record from the database
      const deletedRecord = await dnsRecord.findByIdAndDelete(id);
  
      if (!deletedRecord) {
        return res.status(404).json({ message: 'DNS record not found' });
      }

      res.json({ message: 'DNS record deleted successfully' });
    } catch (error) {
      console.error('Error deleting DNS record:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.delete('/records', (req, res) => {
    // Filter records with any empty values
    const recordsToDelete = dnsRecord.filter(record => !record.type || !record.name || !record.value);
  
    // Perform the delete
    records = records.filter(record => !recordsToDelete.includes(record));
  
    return res.json({ message: 'Records with empty values deleted successfully' });
  });
  


module.exports = router;