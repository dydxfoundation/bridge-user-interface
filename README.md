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
- `VITE_WALLETCONNECT1_BRIDGE`: If you want to continue supporting Wallet Connect v1, you will need to run your own bridge server. Docs [here](https://github.com/WalletConnect/node-walletconnect-bridge/blob/master/OLD-README.md).

To configure network (e.g. staging or mainnet),

- Update variables starting with `VITE_NETWORK_`, replace with the indexer and validator hosts of your choosing pointing to the desired network
- Update the rest of the variables (e.g. token / contract addresses) to go from staging to prod environment.

For more details, check out Vercel's [official documentation](https://vercel.com/docs).
