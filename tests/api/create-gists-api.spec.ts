import { test, expect } from '@playwright/test';
import { GitHubAPI } from '../../api-requests/github-API';
import { readJSONTestData } from '../../utils/json-reader'

interface GistFile {
    filename: string;
    type: string;
    language: string;
    raw_url: string;
    content: string;
}

test.describe('GitHub POST/Create Gist/s API', () => {

    const GITHUB_TOKEN_2 = process.env.GITHUB_TOKEN_2 as string;
    const GITHUB_TOKEN_2_NONGIST = process.env.GITHUB_TOKEN_2_NONGIST as string;
    let testData: any; //for storing data from json files.

    test.beforeAll(async () => {
        testData = await readJSONTestData('test-data-file.json')
    });

    test('Test Case #1: Create Gist Single File - Happy Path', async ({ request }) => {
        const githubAPI = new GitHubAPI(request);
        const response = await githubAPI.createGistSingleFile(GITHUB_TOKEN_2, testData[0].gistDescription, testData[0].public, testData[0].filename + testData[0].fileExtension, testData[0].content);

        //Assert that status code of response is 201 Created
        expect(response.status()).toBe(201);

        //Assert that response is an object
        const responseBody = await response.json();
        expect(responseBody).toBeInstanceOf(Object); // Returns a single gist object

        //Assert properties of the created gist are entered successfully
        expect(responseBody.public).toBe(testData[0].public); // Assert public setting is correct
        expect(responseBody.description).toBe(testData[0].gistDescription);

        const files: GistFile[] = Object.values(responseBody.files);
        expect(files.length).toBeGreaterThan(0);

        //Assert properties of at least 1 file on the gist
        const firstFile = files[0];
        expect(firstFile.filename).toBe(testData[0].filename + testData[0].fileExtension);
        expect(firstFile.content).toBe(testData[0].content);
    });

    test('Test Case #2: Create Gist Single File Happy Path, empty description  - Happy Path', async ({ request }) => {
        const githubAPI = new GitHubAPI(request);
        const response = await githubAPI.createGistSingleFile(GITHUB_TOKEN_2, '', testData[0].public, testData[0].filename + testData[0].fileExtension, testData[0].content);

        //Assert that status code of response is 201 Created
        expect(response.status()).toBe(201);

        //Assert that response is an object
        const responseBody = await response.json();
        expect(responseBody).toBeInstanceOf(Object); // Returns a single gist object

        //Assert properties of the created gist are entered successfully
        expect(responseBody.public).toBe(testData[0].public); // Assert public setting is correct
        expect(responseBody.description).toBe('');

        const files: GistFile[] = Object.values(responseBody.files);
        expect(files.length).toBeGreaterThan(0);

        //Assert properties of at least 1 file on the gist
        const firstFile = files[0];
        expect(firstFile.filename).toBe(testData[0].filename + testData[0].fileExtension);
        expect(firstFile.content).toBe(testData[0].content);
    });

    test('Test Case #3: Create Gist Single File but empty content - Unhappy Path', async ({ request }) => {
        const githubAPI = new GitHubAPI(request);
        const response = await githubAPI.createGistSingleFile(GITHUB_TOKEN_2, testData[0].gistDescription, testData[0].public, testData[0].filename + testData[0].fileExtension, '');

        //Assert that status code of response is 422 Unprocessable Entry
        expect(response.status()).toBe(422); //Invalid request. Invalid input: data cannot be null
    });

    test('Test Case #4: Create Gist Single File but content is just white spaces - Unhappy Path', async ({ request }) => {
        const githubAPI = new GitHubAPI(request);
        const response = await githubAPI.createGistSingleFile(GITHUB_TOKEN_2, testData[0].gistDescription, testData[0].public, testData[0].filename + testData[0].fileExtension, '                              ');

        //Assert that status code of response is 422 Unprocessable Entry
        expect(response.status()).toBe(422); //Invalid request. Invalid input: data cannot be null
    });

    test('Test Case #5: Create Gist Single File but invalid token - Unhappy Path', async ({ request }) => {
        const githubAPI = new GitHubAPI(request);
        const response = await githubAPI.createGistSingleFile("INVALID TOKEN", testData[0].gistDescription, testData[0].public, testData[0].filename + testData[0].fileExtension, testData[0].content);

        //Assert that status code of response is 401 Unauthorized
        expect(response.status()).toBe(401); //Bad credentials
    });

    test('Test Case #6: Create Gist Single File but Token does not have permission to create Gists - Unhappy Path', async ({ request }) => {
        const githubAPI = new GitHubAPI(request);
        const response = await githubAPI.createGistSingleFile(GITHUB_TOKEN_2_NONGIST, testData[0].gistDescription, testData[0].public, testData[0].filename + testData[0].fileExtension, testData[0].content);

        //Assert that status code of response is 404 Not Found
        expect(response.status()).toBe(404);
    });

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