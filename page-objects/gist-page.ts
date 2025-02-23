import { Locator, Page } from "@playwright/test"

export class GistPage {
    page: Page;
    readonly secretSpan: Locator
    readonly gistName: Locator;
    readonly fileNames: Locator;
    readonly editButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.gistName = this.page.locator('strong[itemprop="name"]');
        this.secretSpan = this.page.locator('span[title="Only those with the link can see this gist."]');
        this.fileNames = this.page.locator('a.wb-break-all'); // expected to return multiple elements based on number of files
        this.editButton = this.page.locator('span.Button-label',{ hasText: 'Edit' }); // expected to return multiple elements based on number of files
    }

    /**
     * ID Attribute of file is dynamic based on the file name.
     * @param dynamicId 
     * @returns element locator
     */
    async getDynamicElementContent(dynamicId: string) {
        // Convert filename to lowercase, replace '.' with '-', and add 'file-' and '-readme'
        const formattedId = `file-${dynamicId.toLowerCase().replace('.', '-')}`;
        return this.page.locator(`div[id*="${formattedId}"]`);
    }

}