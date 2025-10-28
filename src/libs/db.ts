import {createConnection} from "mysql2/promise";
import type { Connection } from "mysql2/promise";
import type { APIContext } from "astro";
import type { ActionAPIContext } from "astro:actions";

export async function getConnection(
  context: APIContext | ActionAPIContext
): Promise<Connection> {
  const hyperdrive = context.locals.runtime.env.HYPERDRIVE;
  const connection = await createConnection({
    host: hyperdrive.host,
    user: hyperdrive.user,
    password: hyperdrive.password,
    database: hyperdrive.database,
    port: hyperdrive.port,
    disableEval: true,
  });

  return connection;
}
