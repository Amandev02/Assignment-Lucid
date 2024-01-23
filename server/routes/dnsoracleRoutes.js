const express = require('express');
const oracledb = require('oracledb');
const app = express();
const router = express.Router();
const dnsRecord = require('../models/dnsRecord');
const fileupload = require("express-fileupload");
app.use(fileupload());

// Configure OracleDB Connection
const dbConfig = {
  user: 'your_username',
  password: 'your_password',
  connectString: 'your_connection_string',
};

oracledb.createPool(dbConfig);

// Existing route to get all DNS records
router.get('/all-records', async (req, res) => {
  try {
    const connection = await oracledb.getConnection();
    const result = await connection.execute('SELECT * FROM your_table');
    const roleData = result.rows.map(record => ({
      type: record.type,
      name: record.name,
      value: record.value,
    }));
    res.status(200).json({ roleData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
});

// Existing route to get paginated DNS records
router.get('/dns-records', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT * FROM your_table OFFSET :page ROWS FETCH NEXT :limit ROWS ONLY`,
      [+(page - 1) * +limit, +limit]
    );

    const roleData = result.rows.map(record => ({
      id: record.id,
      type: record.type,
      name: record.name,
      value: record.value,
      created_at: record.created_at,
      updated_at: record.updated_at,
    }));

    const totalRecords = await connection.execute('SELECT COUNT(*) FROM your_table');
    const totalRows = totalRecords.rows[0][0];

    res.json({
      response: {
        status: true,
        content: { data: roleData },
      },
      totalPages: Math.ceil(totalRows / limit),
      currentPage: +page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
});

// Existing route for bulk CSV upload
router.post('/dns-records/csvupload', async (req, res) => {
  try {
    const { data } = req.body;
    const connection = await oracledb.getConnection();
    const sql = `INSERT INTO your_table (type, name, value) VALUES (:type, :name, :value)`;
    
    const options = {
      autoCommit: true,
      bindDefs: {
        type: { type: oracledb.STRING },
        name: { type: oracledb.STRING },
        value: { type: oracledb.STRING },
      },
    };

    const bindVars = data.map(record => ({
      type: record.type,
      name: record.name,
      value: record.value,
    }));

    const result = await connection.executeMany(sql, bindVars, options);

    res.status(200).json({ message: 'CSV data uploaded and saved successfully.' });
  } catch (error) {
    console.error('Error saving records to the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to add a DNS record
router.post('/dns-records', async (req, res) => {
    const { type, name, value } = req.body;
  
    try {
      const connection = await oracledb.getConnection();
      const sql = `INSERT INTO your_table (type, name, value) VALUES (:type, :name, :value)`;
      const bindVars = { type, name, value };
  
      await connection.execute(sql, bindVars, { autoCommit: true });
  
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
      const connection = await oracledb.getConnection();
      const sql = `UPDATE your_table SET type = :type, name = :name, value = :value WHERE id = :id`;
      const bindVars = { id, type, name, value };
  
      const result = await connection.execute(sql, bindVars, { autoCommit: true });
  
      if (result.rowsAffected === 0) {
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
      const connection = await oracledb.getConnection();
      const sql = `DELETE FROM your_table WHERE id = :id`;
      const bindVars = { id };
  
      const result = await connection.execute(sql, bindVars, { autoCommit: true });
  
      if (result.rowsAffected === 0) {
        return res.status(404).json({ message: 'DNS record not found' });
      }
  
      res.json({ message: 'DNS record deleted successfully' });
    } catch (error) {
      console.error('Error deleting DNS record:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Route to delete records with empty values
  router.delete('/records', async (req, res) => {
    try {
      const connection = await oracledb.getConnection();
      const sql = `DELETE FROM your_table WHERE type IS NULL OR name IS NULL OR value IS NULL`;
      
      const result = await connection.execute(sql, [], { autoCommit: true });
  
      res.json({ message: 'Records with empty values deleted successfully' });
    } catch (error) {
      console.error('Error deleting records with empty values:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // ... (existing code)
  
  module.exports = router;
  