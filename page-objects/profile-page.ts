import { Locator, Page } from "@playwright/test"

export class ProfilePage {
    page: Page;
    readonly allGistsSpanTitle: Locator;
    readonly allSecretGists: Locator;
    readonly allPublicGists: Locator;

    constructor(page: Page) {
        this.page = page;
        this.allGistsSpanTitle = this.page.locator('span', { hasText: 'All gists' });
        this.allSecretGists = this.page.locator('a[href]:has(+ span.Label) > .css-truncate-target'); // expected to return multiple elements based on number of Gists available
        this.allPublicGists = this.page.locator('a[href]:not(:has(+ span.Label)) > .css-truncate-target'); // expected to return multiple elements based on number of Gists available
    }

    async clickFirstGistFromAllSecretGists(){
        await this.allSecretGists.first().click();
        await this.page.waitForLoadState('load');
    }

    async clickFirstGistFromAllPublicGists(){
        await this.allPublicGists.first().click();
        await this.page.waitForLoadState('load');
    }
}