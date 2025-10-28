type ENV = {
  SESSION: KVNamespace;
  HYPERDRIVE: Hyperdrive
};

type Runtime = import("@astrojs/cloudflare").Runtime<ENV>;
declare namespace App {
  interface Locals extends Runtime {}
}