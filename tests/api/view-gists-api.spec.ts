import { test, expect } from '@playwright/test';
import { GitHubAPI } from '../../api-requests/github-API';
import { readJSONAPIResponseSample } from '../../utils/json-reader'

interface GistFile {
	filename: string;
	type: string;
	language: string;
	raw_url: string;
	content: string;
}

test.describe('GitHub GET/View Gist/s API', () => {

	const GITHUB_TOKEN = process.env.GITHUB_TOKEN as string;
	let responseSample: any; //for storing data from json files.
	let responseSampleOtherUser: any; //for storing data from json files.

	test.beforeAll(async () => {
		//Read data from .json files to be used for verification
		responseSample = await readJSONAPIResponseSample('get-listofgists-sample.json')
		responseSampleOtherUser = await readJSONAPIResponseSample('get-gist-sample-otheruser.json')
	});

	test('Test Case #1: Get List of Gists - Happy Path', async ({ request }) => {
		const githubAPI = new GitHubAPI(request);
		const rowNumber = 0; //Change according to the rowNumber to test against
		const response = await githubAPI.getListOfGists(GITHUB_TOKEN);

		//Assert that status code of response is 200 OK
		expect(response.status()).toBe(200);

		//Assert that response is an array and is not empty
		const responseBody = await response.json();
		expect(Array.isArray(responseBody)).toBeTruthy(); // Get List of Gists, returns an array of gists
		expect(responseBody.length).toBeGreaterThan(0); // Ensure it's not empty


		//Assert important attributes and properties to ensure that the profile accessed is correct
		const gist = responseBody[rowNumber];
		const sampleGist = responseSample[rowNumber];
		expect(gist.public).toBe(sampleGist.public); // Assert public setting is correct
		expect(gist.owner).toHaveProperty("login", sampleGist.owner.login);
		expect(gist.owner).toHaveProperty("id", sampleGist.owner.id);
		expect(gist.owner).toHaveProperty("html_url", sampleGist.owner.html_url);

		//Define structure and apply the correct type using interface GistFile[]
		const files: GistFile[] = Object.values(gist.files);
		const responseSampleFirstFiles: GistFile[] = Object.values(sampleGist.files);
		expect(files.length).toBeGreaterThan(0);

		//Assert properties of at least 1 file on the gist
		const firstFile = files[0];
		const responseSampleFirstFile = responseSampleFirstFiles[0];
		expect(firstFile).toHaveProperty("filename", responseSampleFirstFile.filename);
		expect(firstFile).toHaveProperty("type", responseSampleFirstFile.type);
		expect(firstFile).toHaveProperty("language", responseSampleFirstFile.language);
		expect(firstFile.raw_url).toContain(responseSampleFirstFile.filename);
		expect(firstFile.raw_url).toContain(sampleGist.owner.login);
	});

	test('Test Case #2: Get List of Gists Unhappy Path Invalid Token', async ({ request }) => {
		const githubAPI = new GitHubAPI(request);
		const response = await githubAPI.getListOfGists("INVALID_TOKEN");

		//Assert that status code of response is 401 Unauthorized
		expect(response.status()).toBe(401);
	});

	test('Test Case #3: Get Gist by ID - Happy Path', async ({ request }) => {
		const githubAPI = new GitHubAPI(request);
		const rowNumber = 2; //Change according to the rowNumber to test against
		const response = await githubAPI.getGistByID(GITHUB_TOKEN, responseSample[rowNumber].id);

		//Assert that status code of response is 200 Ok
		expect(response.status()).toBe(200);

		//Assert that response is an object
		const responseBody = await response.json();
		expect(responseBody).toBeInstanceOf(Object); // Get Gist by ID, returns a single gist object

		//Assert important attributes and properties to ensure that the profile accessed is correct
		const gist = responseBody;
		const sampleGist = responseSample[rowNumber];
		expect(gist.public).toBe(sampleGist.public); // Assert public setting is correct
		expect(gist.owner).toHaveProperty("login", sampleGist.owner.login);
		expect(gist.owner).toHaveProperty("id", sampleGist.owner.id);
		expect(gist.owner).toHaveProperty("html_url", sampleGist.owner.html_url);

		//Define structure and apply the correct type using interface GistFile[]
		const files: GistFile[] = Object.values(gist.files);
		const responseSampleFirstFiles: GistFile[] = Object.values(sampleGist.files);
		expect(files.length).toBeGreaterThan(0);

		//Assert properties of at least 1 file on the gist
		const firstFile = files[0];
		const responseSampleFirstFile = responseSampleFirstFiles[0];
		expect(firstFile).toHaveProperty("filename", responseSampleFirstFile.filename);
		expect(firstFile).toHaveProperty("type", responseSampleFirstFile.type);
		expect(firstFile).toHaveProperty("language", responseSampleFirstFile.language);
		expect(firstFile.raw_url).toContain(responseSampleFirstFile.filename);
		expect(firstFile.raw_url).toContain(sampleGist.owner.login);
	});

	test('Test Case #4: Get Gist by ID of another user (public or secret) with a single file - Happy Path', async ({ request }) => {
		const githubAPI = new GitHubAPI(request);
		const rowNumber = 0; //Change according to the rowNumber to test against
		const response = await githubAPI.getGistByID(GITHUB_TOKEN, "d913b3931e844ad8ad9a758a4aca4b63");
		//https://gist.github.com/Minionguyjpro/d913b3931e844ad8ad9a758a4aca4b63

		//Assert that status code of response is 200 Ok
		expect(response.status()).toBe(200);

		//Assert that response is an object
		const responseBody = await response.json();
		expect(responseBody).toBeInstanceOf(Object); // Get Gist by ID, returns a single gist object

		//Assert important attributes and properties to ensure that the profile accessed is correct
		const gist = responseBody;
		const sampleGist = responseSampleOtherUser;
		expect(gist.public).toBe(sampleGist.public); // Assert public setting is correct
		expect(gist.owner).toHaveProperty("login", sampleGist.owner.login);
		expect(gist.owner).toHaveProperty("id", sampleGist.owner.id);
		expect(gist.owner).toHaveProperty("html_url", sampleGist.owner.html_url);

		//Define structure and apply the correct type using interface GistFile[]
		const files: GistFile[] = Object.values(gist.files);
		const responseSampleFirstFiles: GistFile[] = Object.values(sampleGist.files);
		expect(files.length).toBeGreaterThan(0);

		//Assert properties of at least 1 file on the gist
		const firstFile = files[0];
		const responseSampleFirstFile = responseSampleFirstFiles[0];
		expect(firstFile).toHaveProperty("filename", responseSampleFirstFile.filename);
		expect(firstFile).toHaveProperty("type", responseSampleFirstFile.type);
		expect(firstFile).toHaveProperty("language", responseSampleFirstFile.language);
		expect(firstFile.raw_url).toContain(responseSampleFirstFile.filename);
		expect(firstFile.raw_url).toContain(sampleGist.owner.login);
	});

	test('Test Case #5: Get Gist by ID but Invalid Token - Unhappy Path', async ({ request }) => {
		const githubAPI = new GitHubAPI(request);
		const rowNumber = 2; //Change according to the rowNumber to test against
		const response = await githubAPI.getGistByID('INVALID_TOKEN', responseSample[rowNumber].id);

		//Assert that status code of response is 401 Unauthorized
		expect(response.status()).toBe(401);
	});

	test('Test Case #6: Get Gist by ID but Invalid ID - Unhappy path', async ({ request }) => {
		const githubAPI = new GitHubAPI(request);
		const response = await githubAPI.getGistByID(GITHUB_TOKEN, "INVALID_GIST_ID_001");

		//Assert that status code of response is 404 Not found
		expect(response.status()).toBe(404);
	});

	/*
	Test scenarios to consider
	1. List of Gists, query parameters 
	since string - Only show results that were last updated after the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
	per_page integer - The number of results per page (max 100). For more information, see "Using pagination in the REST API." Default: 30
	page integer - The page number of the results to fetch. For more information, see "Using pagination in the REST API." Default: 1
	2. List of Gists, http status codes 304 and 403
	3. Verification for multiple gists from a list of gists
	4. Get Gist, status codes 304 and 403
    5. Rate Limiting
    6. Get Gist, extremely long description and/or content
	*/
});
