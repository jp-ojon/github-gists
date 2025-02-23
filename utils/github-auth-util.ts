import { BrowserContext } from '@playwright/test';
import fs from 'fs';

const AUTH_STORAGE = 'auth.json';
const GITHUB_LOGIN_URL = 'https://github.com/login';
const GITHUB_TEST_URL = process.env.GITHUB_TEST_URL as string;

/**
 * Perform UI-based login and save authenticated session to auth.json
 * @param context 
 */
export async function setupGitHubAuth(context: BrowserContext) {
    const page = await context.newPage();

    // Perform a UI-based login using the token (GitHub allows token-based login for automation)
    await page.goto(GITHUB_LOGIN_URL);

    // Enter token via the login form (simulate a personal access token login flow)
    await page.fill('input[name="login"]', process.env.USER as string); // GitHub requires username for UI login
    await page.fill('input[name="password"]', process.env.PASSWORD as string);
    await page.click('input[type="submit"]');

    // Wait for the user profile dashboard to load as a confirmation of successful login
    await page.waitForSelector('span[class="AppHeader-context-item-label  "]'); //Dashboard
    await page.waitForLoadState('load');

    // Save authenticated session cookies to auth.json
    const storage = await context.storageState();
    fs.writeFileSync(AUTH_STORAGE, JSON.stringify(storage, null, 2));

    console.log('Authenticated session saved to auth.json');
    await page.close();
}

/**
 * Ensure valid authenticated session exists. Re-authenticates if expired.
 * @param browser - Playwright Browser instance
 * @returns BrowserContext with valid session
 */
export async function getAuthenticatedContext(browser: any): Promise<BrowserContext> {
    let context: BrowserContext;

    if (fs.existsSync(AUTH_STORAGE)) {
        // Load existing session
        context = await browser.newContext({ storageState: AUTH_STORAGE });
        const page = await context.newPage();
        await page.goto(GITHUB_TEST_URL);

        const isLoggedIn = await page.locator('span[class="AppHeader-context-item-label  "]').count();
        await page.close();

        if (isLoggedIn === 0) {
            console.log('Session expired. Re-authenticating...');
            context = await browser.newContext();
            await setupGitHubAuth(context);
        } else {
            console.log('Session is still valid.');
        }
    } else {
        // No session exists, perform initial login
        console.log('No session found. Performing initial login...');
        context = await browser.newContext();
        await setupGitHubAuth(context);
    }
    
    return context;
}