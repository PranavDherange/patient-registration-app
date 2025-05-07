import { PGlite } from "@electric-sql/pglite";
import { worker } from "@electric-sql/pglite/worker";

worker({
  async init(options) {
    // Only the elected leader runs this once
    const db = new PGlite({
      dataDir:    options.dataDir,
      extensions: options.extensions,
    });
    return db;
  },
});
