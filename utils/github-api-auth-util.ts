import { request, APIRequestContext, BrowserContext } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_STATE_FILE = path.join(__dirname, 'github-api-token.json');

export async function authenticateAndStoreAuthState(token: string) {
    const apiContext: APIRequestContext = await request.newContext();
    const response = await apiContext.get('https://api.github.com/octocat', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    if (!response.ok()) {
        throw new Error(`GitHub authentication failed: ${response.status()} ${response.statusText()}`);
    }
    console.log('GitHub API authentication successful.');
    
    const userData = await response.json();
    console.log(userData);
    fs.writeFileSync(AUTH_STATE_FILE, JSON.stringify({ token, user: userData }, null, 2));
    console.log('GitHub API authentication state stored.');

}

export function loadAuthState(): { token: string; user: any } | null {
    if (fs.existsSync(AUTH_STATE_FILE)) {
        return JSON.parse(fs.readFileSync(AUTH_STATE_FILE, 'utf-8'));
    } else {
        console.warn('No stored authentication state found.');
        return null;
    }
}
