import { test, expect, BrowserContext, Page } from '@playwright/test';
import { getAuthenticatedContext } from '../../utils/github-auth-util';
import { readJSONTestData } from '../../utils/json-reader'
import { PageObjectsManager } from '../../page-objects/page-objects-manager'

//Tests run 1 by 1 for this set of tests, because of cookies being shared.
test.describe.configure({ mode: 'serial' }); //change to 'parallel' as needed

test.describe('Create Gist/s Tests', () => {

    let context: BrowserContext;
    let page: Page;
    let testData: any; //for storing data from json files.

    test.beforeAll(async ({ browser }) => {
        context = await getAuthenticatedContext(browser);
        testData = await readJSONTestData('test-data-file.json')
    });

    test.beforeEach(async () => {
        page = await context.newPage();
        await page.goto('https://gist.github.com/');
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('Test #1: Create Secret Gist with one file - Happy Path', async () => {
        const pom = new PageObjectsManager(page);
        const rowNumber = 0; //Change according to the rowNumber to select the input test data file json row

        //Fill out the required fields within the homepage where one can create a gist, then click Create Gist Button
        await pom.mainPage.fillGistDescription(testData[rowNumber].gistDescription);
        await pom.mainPage.fillFileName(testData[rowNumber].filename + testData[rowNumber].fileExtension);
        await pom.mainPage.fillFileContents(testData[rowNumber].content);
        await pom.mainPage.clickCreateGistButton();

        //Assert that displayed Gist Name/Title is based on the first file
        await expect(pom.gistPage.gistName).toHaveText(testData[rowNumber].filename + testData[rowNumber].fileExtension);

        //Assert that Gist is Secret
        await expect(pom.gistPage.secretSpan).toBeVisible();
        await expect(pom.gistPage.secretSpan).toHaveText('Secret');

        //Assert the filename of the first displayed file
        await expect(pom.gistPage.fileNames.first()).toHaveText(testData[rowNumber].filename + testData[rowNumber].fileExtension);

        //Assert the content of the first displayed file
        await expect(await pom.gistPage.getDynamicElementContent(testData[rowNumber].filename + testData[rowNumber].fileExtension)).toContainText(testData[rowNumber].content);
    });

    test('Test #2: Create Public Gist with one file - Happy Path', async () => {
        const pom = new PageObjectsManager(page);
        const rowNumber = 1; //Change according to the rowNumber to select the input test data file json row

        //Fill out the required fields within the homepage where one can create a gist, select visibility type 'Create Public Gist' and then click Create Gist Button
        await pom.mainPage.fillGistDescription(testData[rowNumber].gistDescription);
        await pom.mainPage.fillFileName(testData[rowNumber].filename + testData[rowNumber].fileExtension);
        await pom.mainPage.fillFileContents(testData[rowNumber].content);
        await pom.mainPage.clickCreateGistTypeDropdownButton();
        await pom.mainPage.selectGistVisibilityType('Create Public gist');
        await pom.mainPage.clickCreateGistButton();

        //Assert that displayed Gist Name/Title is based on the first file
        await expect(pom.gistPage.gistName).toHaveText(testData[rowNumber].filename + testData[rowNumber].fileExtension);

        //Assert that Gist is not Secret, but Public.
        await expect(pom.gistPage.secretSpan).not.toBeVisible();

        //Assert the filename of the first displayed file
        await expect(pom.gistPage.fileNames.first()).toHaveText(testData[rowNumber].filename + testData[rowNumber].fileExtension);

        //Assert the content of the first displayed file
        await expect(await pom.gistPage.getDynamicElementContent(testData[rowNumber].filename + testData[rowNumber].fileExtension)).toContainText(testData[rowNumber].content);
    });

    test('Test #3: Create Public or Secret Gist with one file but empty contents - Unhappy Path', async () => {
        const pom = new PageObjectsManager(page);
        const rowNumber = 0; //Change according to the rowNumber to select the input test data file json row

        //Fill out the required fields within the homepage where one can create a gist, select visibility type 'Create Public Gist' and then click Create Gist Button
        await pom.mainPage.fillGistDescription(testData[rowNumber].gistDescription);
        await pom.mainPage.fillFileName(testData[rowNumber].filename + testData[rowNumber].fileExtension);
        await pom.mainPage.fillFileContents(''); //empty file contents
        await pom.mainPage.clickCreateGistTypeDropdownButton();
        await pom.mainPage.selectGistVisibilityType('Create Secret gist');
        await pom.mainPage.clickCreateGistButton();

        //Assert that alert appears containing the text "Contents can't be empty"
        await expect(pom.mainPage.flashAlert).toBeVisible();
        await expect(pom.mainPage.flashAlert).toContainText("Contents can't be empty");

        await pom.mainPage.clickCreateGistTypeDropdownButton();
        await pom.mainPage.selectGistVisibilityType('Create Public gist');
        await pom.mainPage.clickCreateGistButton();

        //Assert that alert appears containing the text "Contents can't be empty"
        await expect(pom.mainPage.flashAlert).toBeVisible();
        await expect(pom.mainPage.flashAlert).toContainText("Contents can't be empty");

    });

    // Add more tests here...
    /*
    Test scenarios to consider
    1. Create gist with multiple files
    2. Really large file - edge case
    3. Non-Standard File Extensions - edge case
    4. Extremely long description or content - edge case
    5. Special characters - edge case
    6. Rate Limiting
    */
});
