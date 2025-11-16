const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'LocalBiz',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('✅ MySQL connected successfully!');
        console.log(`📊 Database: ${process.env.DB_NAME || 'LocalBiz'}`);
        connection.release();
    })
    .catch(err => {
        console.error('❌ MySQL connection error:', err.message);
    });

// Helper function to execute queries
async function query(sql, values) {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(sql, values || []);
        connection.release();
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Helper function to get single row
async function getRow(sql, values) {
    const results = await query(sql, values);
    return results.length > 0 ? results[0] : null;
}

// Helper function to get all rows
async function getRows(sql, values) {
    return await query(sql, values);
}

// Helper function to insert
async function insert(table, data) {
    const columns = Object.keys(data).filter(key => data[key] !== undefined);
    const values = columns.map(key => data[key]);
    const placeholders = columns.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    const result = await query(sql, values);
    return result.insertId;
}

// Helper function to update
async function update(table, data, where) {
    const updates = Object.keys(data).filter(key => data[key] !== undefined).map(key => `${key} = ?`).join(', ');
    const values = [...Object.keys(data).filter(key => data[key] !== undefined).map(key => data[key]), ...Object.values(where)];
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    
    const sql = `UPDATE ${table} SET ${updates} WHERE ${whereClause}`;
    return await query(sql, values);
}

// Helper function to delete
async function deleteRow(table, where) {
    const whereClause = Object.keys(where).map(key => `${key} = ?`).join(' AND ');
    const values = Object.values(where);
    
    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    return await query(sql, values);
}

module.exports = {
    pool,
    query,
    getRow,
    getRows,
    insert,
    update,
    deleteRow
};
