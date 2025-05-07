// src/App.js
import React, { useEffect, useState } from "react";
import { PGliteProvider }  from "@electric-sql/pglite-react";
import { live } from "@electric-sql/pglite/live";
import { PGliteWorker }  from "@electric-sql/pglite/worker";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

function App() {
  const [db, setDb] = useState(null);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
        (async () => {
            try {
              // 1) Fetch the WASM blob from public/
              const wasmUrl = `${process.env.PUBLIC_URL}/pglite.wasm`;
              const resp = await fetch(wasmUrl);
              if (!resp.ok) throw new Error(`WASM load failed: ${resp.statusText}`);
              console.log("fetched WASM")
      
              // 1) Get raw bytes and wrap in Uint8Array
              const raw = await resp.arrayBuffer();
              const bytes = new Uint8Array(raw);                       
      
              const module = await WebAssembly.compile(bytes);        
      
              console.log("compiled module")

              const worker = new Worker(
                new URL("./pglite-worker.js", import.meta.url),
                { type: "module" }
              );
              console.log("✅ Shared worker created");
      
              const pglite = new PGliteWorker(worker, {
                dataDir:    'idb://medblocks-patients',
                extensions: { live },
                wasmModule: module
              });

              // 3) Pass the compiled module to PGlite (it will use instantiate under the hood)
              // const client = await PGlite.create({
              //   dataDir:    'idb://medblocks-patients',
              //   extensions: { live },
              //   wasmModule: module,
              //   worker
              // });

              console.log("created client:")
      
              // 3) Setup schema once
              await pglite.query(`
                CREATE TABLE IF NOT EXISTS patients (
                  id          SERIAL PRIMARY KEY,
                  name        TEXT    NOT NULL,
                  dob         TEXT,
                  gender      TEXT,
                  contact     TEXT,
                  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
              `);
      
              // 4) Store it so we can provide it
              setDb(pglite);

              console.log("setDb about to run")

            } catch (err) {
              setInitError(err);
            }
          })();
  }, []);

  if (initError) {
    return (
      <Box p={3} textAlign="center">
        <Alert severity="error" sx={{ mb: 2 }}>
          Fatal Error: Could not initialize database.
        </Alert>
        <Typography variant="body2" color="error">
          {initError.message}
        </Typography>
      </Box>
    );
  }

  if (!db) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress />
        <Typography>Initializing Database…</Typography>
      </Box>
    );
  }

  return (
    <PGliteProvider db={db}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </Router>
    </PGliteProvider>
  );
}

export default App;
