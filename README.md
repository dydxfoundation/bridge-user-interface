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

For "Environment Variables", configure according to what needs to be overwritten in `.env`. In particular,
- `VITE_ALCHEMY_API_KEY`: alchemy account API key ([docs](https://docs.alchemy.com/docs/alchemy-quickstart-guide#1key-create-an-alchemy-key))
- `VITE_WALLETCONNECT2_PROJECT_ID`: Project ID for Wallet Connect v2 (required for connecting to wallets / onboarding), found [here](https://cloud.walletconnect.com/app)
- `NPM_RC`: to npm packages, you'll also need an NPM token. The value of this variable should be `//registry.npmjs.org/:_authToken={TOKEN}`, replacing {TOKEN} with your npm token. More [here](https://docs.npmjs.com/creating-and-viewing-access-tokens)

For more details, check out Vercel's [official documentation](https://vercel.com/docs).
