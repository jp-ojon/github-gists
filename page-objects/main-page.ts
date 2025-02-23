import { Locator, Page } from "@playwright/test"

export class MainPage {
    page: Page;
    readonly gistDescriptionField: Locator;
    readonly fileNameField: Locator;
    readonly fileContentsField: Locator;
    readonly createGistButton: Locator;
    readonly createGistTypeDropdownButton: Locator;
    readonly flashAlert: Locator;
    readonly actionMenu: Locator;
    readonly yourGistsActionListItem: Locator;


    constructor(page: Page) {
        this.page = page;
        this.gistDescriptionField = this.page.locator('input[name="gist[description]"]');
        this.fileNameField = this.page.locator('input[name="gist[contents][][name]"]');
        this.fileContentsField = this.page.locator('pre.CodeMirror-line');
        this.createGistButton = this.page.locator('button[type="submit"][class*="hx_create-pr-button"]');
        this.createGistTypeDropdownButton = this.page.getByRole('button', { name: 'Select a type of Gist' });

        this.flashAlert = this.page.locator('div.js-flash-alert[role="alert"]');
        this.actionMenu = this.page.getByRole('button', { name: 'View profile and more' });
        this.yourGistsActionListItem = this.page.locator('span.ActionListItem-label', { hasText: 'Your gists' });
    }

    /**
     * This method fills the Gist Description field with a value
     * @param value 
     */
    async fillGistDescription(value: string) {
        await this.gistDescriptionField.fill(value);
    }

    /**
     * This method fills the File Name field with a value. Ex. Readme.md
     * @param value 
     */
    async fillFileName(value: string) {
        await this.fileNameField.fill(value);
    }

    /**
     * This method fills the File Contents field. Ex. Code snippet or blog post
     * @param value 
     */
    async fillFileContents(value: string) {
        await this.fileContentsField.fill(value);
        await this.page.waitForLoadState('load');
    }

    async clickCreateGistButton() {
        await this.createGistButton.click({delay: 1000});
        await this.page.waitForLoadState('load');
    }
    
    async clickCreateGistTypeDropdownButton() {
        await this.createGistTypeDropdownButton.click();
    }

    /**
     * Selects Gist Visibility Type based on the input value
     * @param value 
     * @returns element located and clicked
     */
    async selectGistVisibilityType(value: string){
        return this.page.locator('span.select-menu-item-heading', { hasText: value }).click();
    }

    async clickActionMenu() {
        await this.actionMenu.click();
    }

    async clickYourGistsActionListItem() {
        await this.yourGistsActionListItem.click();
        await this.page.waitForLoadState('load');
    }

}