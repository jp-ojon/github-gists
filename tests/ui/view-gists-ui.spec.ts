import { test, expect, BrowserContext, Page } from '@playwright/test';
import { getAuthenticatedContext } from '../../utils/github-auth-util';
import { PageObjectsManager } from '../../page-objects/page-objects-manager'

//Tests run 1 by 1 for this set of tests, because of cookies being shared.
test.describe.configure({ mode: 'serial' }); //change to 'parallel' as needed

test.describe('Get/View Gist/s Tests', () => {

    let context: BrowserContext;
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        context = await getAuthenticatedContext(browser);
    });

    test.beforeEach(async () => {
        page = await context.newPage();
        await page.goto('https://gist.github.com/');
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('Test #1: View own Secret Gist - Happy Path', async () => {
        const pom = new PageObjectsManager(page);

        //Navigate to "Your Gists"
        await pom.mainPage.clickActionMenu();
        await pom.mainPage.clickYourGistsActionListItem();

        //Assert All Gists Span Title to be visible
        await expect(pom.profilePage.allGistsSpanTitle).toBeVisible();

        //Click on the first Secret Gist available, then wait for a certain element "Edit button" to appear ensuring we are on the Gist page.
        await pom.profilePage.clickFirstGistFromAllSecretGists();
        await pom.gistPage.editButton.waitFor({ state: 'visible' });

        //Assert attributes are present on the Gist view page
        //Assert that Gist is Secret
        await expect(pom.gistPage.secretSpan).toBeVisible();
        await expect(pom.gistPage.secretSpan).toHaveText('Secret');
        await expect(pom.gistPage.fileNames).toBeVisible();
        await expect(pom.gistPage.gistName).toBeVisible();
    });

    test('Test #2: View own Public Gist - Happy Path', async () => {
        const pom = new PageObjectsManager(page);

        //Navigate to "Your Gists"
        await pom.mainPage.clickActionMenu();
        await pom.mainPage.clickYourGistsActionListItem();

        //Redirected to a new page after clicking Your Gists Action List Item
        await page.waitForLoadState('load');

        //Assert All Gists Span Title to be visible
        await expect(pom.profilePage.allGistsSpanTitle).toBeVisible();

        //Click on the first Public Gist available, then wait for a certain element "Edit button" to appear ensuring we are on the Gist page.
        await pom.profilePage.clickFirstGistFromAllPublicGists();
        await pom.gistPage.editButton.waitFor({ state: 'visible' });

        //Assert attributes are present on the Gist view page
        //Assert that Gist is not Secret, but Public.
        await expect(pom.gistPage.secretSpan).not.toBeVisible();
        await expect(pom.gistPage.fileNames).toBeVisible();
        await expect(pom.gistPage.gistName).toBeVisible();
    });

    //#3. View any Public Gist of other users
    test.fixme('Test #3: View any Public Gist - Happy Path', async () => {
        const pom = new PageObjectsManager(page);
    });

    test('Test #4: View any Secret Gist of other users using a known URL - Happy Path', async () => {
        const pom = new PageObjectsManager(page);

        //Navigate to any Secret Gist where URL/link is known
        //Ex: https://gist.github.com/jp-ojon-test/d81890e31abe42c0477c33ad5bc83803
        await page.goto('https://gist.github.com/jp-ojon-test/d81890e31abe42c0477c33ad5bc83803');

        //Assert attributes are present on the Gist view page
        //Assert that Gist is Secret
        await expect(pom.gistPage.secretSpan).toBeVisible();
        await expect(pom.gistPage.secretSpan).toHaveText('Secret');
        await expect(pom.gistPage.fileNames).toBeVisible();
        await expect(pom.gistPage.gistName).toBeVisible();
    });

    test('Test #5: View a invalid or deleted Gist ID - Happy Path', async () => {
        let statusCode: number | null = null;

        // Listen for the specific API response
        page.on('response', async (response) => {
            if (response.url().includes('https://gist.github.com/jp-ojon-test/1234abc')) {
                console.log(`Response URL: ${response.url()}`);
                console.log(`Status Code: ${response.status()}`);
                statusCode = response.status();
            }
        });

        //Navigate to any invalid or deleted Gist ID
        await page.goto('https://gist.github.com/jp-ojon-test/1234abc');

        // Assert status code 404 Not found
        expect(statusCode).toBe(404);

    });
});
