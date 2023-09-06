## Prerequisites

- Node.js version 18 and `pnpm` installed on your system

## Part 1: Setting up your local environment

### Step 1: Clone the repo

Clone the repository and navigate to its directory:

```bash
git clone https://github.com/dydxfoundation/bridge.git
cd bridge
```

### Step 2: Install pnpm and dependencies

Install pnpm and the project dependencies:

```bash
npm i -g pnpm
pnpm i
```

## Part 2: Running the project locally

Run the following command in the project directory to start the development server:

```bash
pnpm dev
```

The development server will be running at `http://localhost:5173` (or the port number displayed in the terminal). Visit this URL to interact with the web app and see your changes in real-time.

## Part 3: Deploying with Vercel

### Step 1: Connect your repository to Vercel

Select "Import Git Repository" from your dashboard, and provide the URL of this repository or your forked repository.

### Step 2: Configure your project

For the "Build & Development Settings", we recommend the following:
- Framework Preset: `Vite`
- Build Command (override): `pnpm run build`

For more details, check out Vercel's [official documentation](https://vercel.com/docs).
