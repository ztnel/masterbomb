import pgPromise from "pg-promise";

const pgp = pgPromise();

let db:pgPromise.IDatabase<any,any>;

export function connect_db(database:string, host:string, port:string, user:string):void {
    // configure postgres with types that pgp accepts
    const config = {
        database: database || "postgres",
        host: host || "localhost",
        port: parseInt( port || "5432", 10),
        user: user || "postgres"
    } as Parameters<typeof pgp>[0];
    // rename pgp
    db = pgp(config);
}

export function get_db():pgPromise.IDatabase<any,any> {
    // should ensure database exist first
    return db;
}