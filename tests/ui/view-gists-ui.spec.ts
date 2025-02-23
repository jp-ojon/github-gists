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

    //#3. View any Public Gist
    //#4. View any Secret Gist using a known URL
});
