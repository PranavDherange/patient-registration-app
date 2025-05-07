# Patient Registration App

A frontend-only application for registering patients, powered by **Pglite** for in-browser database storage.

## Getting Started

Follow these steps to set up and run the application locally.

### 1. Clone the Repository

```bash
git clone https://github.com/PranavDherange/patient-registration-app
cd patient-registration-app
```

### 2. Install Dependencies
```bash 
npm install
```

### 3. Copy WASM file in public directory.
This step is mandatory inorder to run the pglite db. Locate the pglite.wasm file from 
"node_modules/@electric-sql/pglite/dist/pglite.wasm" and copy it inside the public folder.

### 4. Start the Development Server
```bash
npm start
```

Please note that while loading the application for the first time, it might take some time to initialize.  