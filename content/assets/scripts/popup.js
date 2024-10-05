import Extension from "./app/Extension.js";
import PixivCompanion from "./app/PixivCompanion.js";
import PixivArtwork from "./app/PixivArtwork.js";
import HomeTab from "./app/tabs/home.js";

document.addEventListener('DOMContentLoaded', () => {
    (async () => {
        const extension = new Extension();
        const pixiv     = new PixivArtwork();
        const companion = new PixivCompanion(extension, pixiv);

        document.body.addEventListener('tick', () => {
            if(companion.currentTab) {
                console.log('[Event] Received tick event. Ticking UI.');
                companion.currentTab.tick();
            }
        })

        await extension.settings.load()
        companion.showTab(HomeTab.name);

        if (await pixiv.query()) {
            await companion.defineBackgroundImage();
        }

        window.companion = companion;
    })();
});