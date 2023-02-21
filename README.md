## POC for generating fundraising campaigns funded with Ethereum

### Utilities

This repo has some additional tools already setup:

-   [Prettier](https://prettier.io) for code formatting
-   [Jest](https://jestjs.io) for testing
-   [Turborepo](https://turbo.build): a high-performance build system for JS and TS codebases

### Install dependencies

```
npm i --legacy-peer-deps
```

This will install TurboRepo (`turbo`) as a dev dependency to speed up the execution of scripts in `package.json` using caching

### Develop

For local development of the app with hot-reloading, run the following command:

```
turbo dev
```

### Lint Solidity

To lint the Campaign contracts, run the following command:

```
turbo lint:contracts
```

To fix linting errors:

```
turbo lint:contracts:fix
```

### Compile Solidity

To compile the Campaign contracts, run the following command:

```
turbo compile:contracts
```

### Run unit tests

```
turbo test
```

### Deploy Factory Contract

```
npm run deploy:factory
```

### Build

To build the app, run the following command:

```
turbo build
```
