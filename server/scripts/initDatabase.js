const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });

    try {
        console.log('📊 Initializing database...');

        // Read schema file
        const schemaPath = path.join(__dirname, '../sql/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon and execute each statement
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        for (const statement of statements) {
            console.log(`Executing: ${statement.substring(0, 50)}...`);
            try {
                // Use query() instead of execute() for DDL statements
                await connection.query(statement);
            } catch (err) {
                // Skip USE statements that fail
                if (err.code === 'ER_SYNTAX_ERROR' || statement.includes('USE ')) {
                    console.log(`Skipping: ${statement.substring(0, 30)}...`);
                } else {
                    throw err;
                }
            }
        }

        console.log('✅ Database initialized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

initDatabase();
