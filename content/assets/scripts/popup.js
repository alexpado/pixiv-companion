import HomeTab from "./app/tabs/HomeTab.js";
import Application from "./app/Application.js";
import Logger from "./app/Logger.js";

document.addEventListener('DOMContentLoaded', () => {
    (async () => {
        Logger.log('popup', '()', 'Loading application...')
        const application = new Application();
        Logger.log('popup', '()', 'Loading settings...')
        await application.settings.load();


        Logger.log('popup', '()', 'Showing application tab...')
        await application.showTab(HomeTab.getName());

        try {
            Logger.log('popup', '()', 'Querying browser...')
            const response              = await Application.queryBrowser('get-data');
            Logger.log('popup', '()', 'Applying data...')
            application.content.success = response.success;
            application.content.message = response.message;
            application.content.data.setData(response.data);
        } catch (e) {
            Logger.log('popup', '()', 'Applying exception...')
            application.content.success = false;
            application.content.message = 'Query Error: ' + e.message;
            application.content.data.setData(null);
        }

        if (application.isPixivAvailable()) {
            Logger.log('popup', '()', 'Loading background...')
            await application.loadBackgroundImage();
        }

        window.application = application;
    })();
});