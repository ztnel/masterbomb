import dotenv from "dotenv";
import fs from "fs-extra";
import { Client } from "pg";

// reset the database by re-initializing
const init = async () => {
    // read db config environment variables
    dotenv.config();
    // create a postgreSQL client
    const client = new Client();
    try {
        await client.connect();
        /* Add custom psql triggers in seperate query to reduce parsing complexity */
        // create automatic timestamp generation for updated_at and created_at fields
        await client.query(`
            CREATE OR REPLACE FUNCTION trigger_set_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;`
        );
        // read in sql
        const sql = await fs.readFile("./tools/initdb.sql", { encoding: "UTF-8" });
        // parse the sql file and execute statements one at a time
        const statements = sql.split( /;\s*$/m );
        for ( const statement of statements ) {
            if ( statement.length > 3 ){
                // execute each of the statements and log sql queries
                console.log(statement);
                await client.query(statement);
            }
        }
    } catch ( err ) {
        console.log(err);
        throw err;
    } finally {
        // close db client
        await client.end();
    }
};

// run db init and catch outgoing errors
init().then(() => {
    console.log("Database initialization complete.");
}).catch(() =>{
    console.log("Database initialization encountered errors");
});