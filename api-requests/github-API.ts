import { APIRequestContext } from '@playwright/test';

const GITHUB_API_URL = process.env.GITHUB_API_URL as string;

export class GitHubAPI {
    constructor(private request: APIRequestContext) { }

    async getListOfGists(authToken: string) {
        return this.request.get(GITHUB_API_URL, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${authToken}`,
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
    }

    async getGistByID(authToken: string, id: string) {
        return this.request.get(`${GITHUB_API_URL}/${id}`, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${authToken}`,
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });
    }

    async createGistSingleFile(authToken: string, gistDescription: string, publicBool: boolean, fileName: string, content: string) {
        return this.request.post(`${GITHUB_API_URL}`, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${authToken}`,
                'X-GitHub-Api-Version': '2022-11-28',
            },
            data: {
                description: `${gistDescription}`,
                public: `${publicBool}`,
                files: {
                    [fileName]: {
                        content: `${content}`
                    }
                }
            }
        });
    }
}