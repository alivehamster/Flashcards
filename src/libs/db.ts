import mysql from "mysql2/promise";

export async function getPool(): Promise<mysql.Connection> {
  // Can't be bothered to change function name to getConnection in all the files
  // Assume database is already initialized

  const connection = await mysql.createConnection({
     host: env.HYPERDRIVE.host,
     user: env.HYPERDRIVE.user,
     password: env.HYPERDRIVE.password,
     database: env.HYPERDRIVE.database,
     port: env.HYPERDRIVE.port,

     disableEval: true
  });

  return connection;
}
