import {Page} from '@playwright/test'
import {MainPage} from '../page-objects/main-page'
import {ProfilePage} from '../page-objects/profile-page'
import {GistPage} from '../page-objects/gist-page'

export class PageObjectsManager{
    page: Page;
    mainPage: MainPage;
    profilePage: ProfilePage;
    gistPage: GistPage;

    constructor(page: Page){
        this.page = page;
        this.mainPage = new MainPage(page);
        this.profilePage = new ProfilePage(page)
        this.gistPage = new GistPage(page)
    }
}