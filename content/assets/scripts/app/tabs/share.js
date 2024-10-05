import {ExtensionTab, Interface} from "../../popup.ui.js";
import HomeTab from "./home.js";

export class ShareTab extends ExtensionTab {

    static get name() {
        return 'share'
    }


    constructor(companion, name) {
        super(companion, name);

        this.artworkInfo = document.createElement('h2');
        this.btnBack     = Interface.createButton('Back');

        this.btnBack.addEventListener('click', () => {
            this.companion.showTab(HomeTab.name)
        });
    }

    tick() {
        if (this.companion.pixiv.isAvailable()) {
            this.artworkInfo.innerText = `Art by ${this.companion.pixiv.getAuthorName()}`;
        } else {
            this.companion.showTab(HomeTab.name)
        }
    }


    beforeShow(args) {

        this.shares = this.companion.extension.settings.shares
                          .filter(share => share.url !== null && share.url.length > 0)
                          .map(share => {
                              const btn = Interface.createButton(share.name.length > 0 ? share.name : '< unnamed >');

                              btn.addEventListener('click', () => {
                                  Interface.handleButton(btn, async () => {
                                      await this.companion.shareArtwork(share.id);
                                  }, true).then();
                              });

                              return btn;
                          });

        this.children = [
            this.artworkInfo,
            Interface.createFiller(),
            ...this.shares,
            Interface.createSeparator(),
            this.btnBack
        ];
    }
}