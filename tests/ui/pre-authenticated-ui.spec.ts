import { test, expect, BrowserContext, Page } from '@playwright/test';
import { getAuthenticatedContext } from '../../utils/github-auth-util';

//Tests run 1 by 1 for this set of tests, because of cookies being shared.
test.describe.configure({ mode: 'serial' }); //change to 'parallel' as needed
test.describe('Github Pre Authenticated browser Test', () => {

    let context: BrowserContext;
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        context = await getAuthenticatedContext(browser);
    });

    test.beforeEach(async () => {
        page = await context.newPage();
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('Access UI with Authenticated Session', async () => {
        await page.goto('https://github.com/siopao-test-01');
        const userProfile = page.locator('span[itemprop="additionalName"]');
        await expect(userProfile).toHaveText('siopao-test-01');
    });

    test('Access UI with Authenticated Session 2', async () => {
        await page.goto('https://github.com/siopao-test-01');
        const userProfile = page.locator('span[itemprop="additionalName"]');
        await expect(userProfile).toHaveText('siopao-test-01');
    });
});