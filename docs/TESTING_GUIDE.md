# Automated Testing Guide

This project uses **Jest** for all automated tests. There are four test suites
covering basic utilities, PWA functionality, and advanced offline features.

## Running the Tests

Install dependencies and execute:

```bash
npm install
npm test
```

## Coverage Report

To generate a coverage report:

```bash
npm run test:coverage
```

The coverage summary will appear in the terminal and a detailed report is placed
under the `coverage/` directory.

## Test Structure

```
tests/
├── placeholder.test.js      # basic sanity checks
├── sample.test.js           # utility tests
├── pwa.test.js              # PWA functionality
└── pwa-advanced.test.js     # advanced PWA features
```

See the individual files for further documentation and example usage of mocks
and utilities.
