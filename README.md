# Playwright Test Suite for UI and API Automation Tests exercise for Github Gists by Jon Paulo Ojon
## Overview
This test suite includes UI and API automated tests for Creating and Viewing Gists on Github

## Author
Jon Paulo Ojon

## Prerequisites
* Node.js (v14 or later), find installer on https://nodejs.org/en/download/package-manager site
* Playwright

## Installation
1. Clone the repository and go to project directory
- git clone https://github.com/jp-ojon/github-gists.git
- change directory to root folder github-gists

2. Install the dependencies:
- npm install
- npx playwright install

* Libraries used
* Playwright
* dotenv

## Test Data
- Please update the testdata.csv file under testdata folder accordingly. 
- Test can also be used for verification of first esim package of any country name with only a single word

## Running Tests
Use the following commands in any terminal or cmd line to run tests in different browsers:
1. npm run test:chromium    : run all UI tests for chromium browser only, set to serial and will run 1 by 1 because of login cookies.
2. npm run test:firefox     : run all UI tests for firefox browser only, set to serial and will run 1 by 1 because of login cookies.
3. npm run test:webkit      : run all UI tests for webkit browser only, set to serial and will run 1 by 1 because of login cookies.
4. npm run test:api         : run all API tests only
5. npm run test:all         : run all tests across all browsers configured under playwright.config.ts -> projects (Not recommended)

## Configuration
Configuration can be changed under playwright.config.ts
- headless                  : can either be true or false, false means browser would show up when tests are run
- timeout                   : Global timeout for all tests
- expect: timeout           : Timeout for expect() assertions
- projects: use: viewport   : Screen size, adjust accordingly

## Recommendations
- **Note:** It is not recommended to use npx run test:all and run all tests across all browsers in parallel. Please run test for chromium, firefox and webkit separately to avoid flakiness, inconsistent browser behaviours, insufficient resources to support the run, etc.
- **Resource Management:** Consider running tests in individual browsers to manage resources effectively and reduce flakiness.
- **Debugging:** If encountering issues, review logs and screenshots to diagnose problems. Adjust test cases if needed to handle browser-specific behaviors.

## Links to Documentation
- Playwright: https://playwright.dev/docs/intro