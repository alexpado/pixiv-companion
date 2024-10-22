import HomeTab from "./HomeTab.js";
import AppTab from "../AppTab.js";
import Interface from "../Interface.js";

// Feather Icons — Eye Off
const eyeOffIcon = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off" version="1.1" id="svg1" sodipodi:docname="eye-off.svg" inkscape:version="1.4 (e7c3feb100, 2024-10-09)" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"> <defs id="defs1" /> <sodipodi:namedview id="namedview1" pagecolor="#ffffff" bordercolor="#000000" borderopacity="0.25" inkscape:showpageshadow="2" inkscape:pageopacity="0.0" inkscape:pagecheckerboard="0" inkscape:deskcolor="#d1d1d1" inkscape:zoom="33.625" inkscape:cx="12" inkscape:cy="12" inkscape:window-width="1920" inkscape:window-height="1016" inkscape:window-x="0" inkscape:window-y="0" inkscape:window-maximized="1" inkscape:current-layer="svg1" /> <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" id="path1" style="stroke:#ffffff;stroke-opacity:1" /><line x1="1" y1="1" x2="23" y2="23" id="line1" style="stroke:#ffffff;stroke-opacity:1" /></svg>'

/**
 * Share tab — Tab used to send artwork links to predefined share targets.
 */
export class ShareTab extends AppTab {

    /**
     * Retrieve the tab name, that will be used as identifier.
     *
     * @returns {string}
     *  This tab name
     */
    static getName() {
        return 'share'
    }

    /**
     * Create an application tab.
     *
     * @param {Application} application
     *  The application to which this tab will be associated.
     */
    constructor(application) {
        super(application, ShareTab.getName());

        this.artworkInfo = document.createElement('h2');
        this.btnBack     = Interface.createButton('Back');

        Interface.handleButtonClickSync(this.btnBack, () => this.showTab(HomeTab.getName()));
    }

    /**
     * Called right before the content of this tab is inserted into the DOM.
     *
     * @param {any} args
     *  Optional argument that can be provided to initialize the tab's UI.
     */
    async onShow(args) {

        const validShares = this.application.settings.shares
                                .filter(share => share.url !== null && share.url.length > 0);

        const shares = validShares.map(share => {

            const container = document.createElement('div');
            container.classList.add('flex', 'flex-row');

            const shareName       = share.name.length > 0 ? share.name : '< unnamed >';
            const normalShareBtn  = Interface.createButton(shareName);
            const spoilerShareBtn = Interface.createButton('');

            spoilerShareBtn.innerHTML = eyeOffIcon;

            normalShareBtn.classList.add('grow');
            spoilerShareBtn.classList.add('flex', 'f-center');

            container.appendChild(normalShareBtn);
            container.appendChild(spoilerShareBtn);

            Interface.handleButtonClickAsync(
                normalShareBtn,
                async () => await this.application.shareArtwork(share.id, false),
                'lock'
            );

            Interface.handleButtonClickAsync(
                spoilerShareBtn,
                async () => await this.application.shareArtwork(share.id, true),
                'lock'
            );

            return container;
        });

        this.children = [
            this.artworkInfo,
            Interface.createFiller(),
            ...shares,
            Interface.createSeparator(),
            this.btnBack
        ];
    }

    /**
     * Called whenever a UI refresh is needed. This can be done from anywhere in the code as long a CustomEvent 'tick'
     * is being dispatched on the body.
     *
     * This method get also called right after onShow() automatically.
     */
    async onTick() {
        if (this.application.isPixivAvailable()) {
            this.artworkInfo.innerText = `Art by ${this.application.getPixiv().getAuthorName()}`;
        } else {
            this.showTab(HomeTab.getName());
        }
    }

}
