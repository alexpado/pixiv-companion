import Settings from "./Settings.js";

export default class Extension {

    constructor() {

        this.settings = new Settings();
    }

    /**
     * @returns {Promise<PixivQuery>}
     */
    static async queryBrowser() {
        const queryOptions = {
            active:        true,
            currentWindow: true
        };

        const tabs = await chrome.tabs.query(queryOptions);
        if (tabs.length === 0 || !tabs[0].url.includes("pixiv.net")) {
            throw new Error('Please open an artwork on Pixiv.');
        }
        const tab      = tabs[0];
        const response = await chrome.tabs.sendMessage(tab.id, {action: "getPixivData"});

        if (response) {
            return response;
        }
        throw new Error('Unable to retrieve pixiv data. Make sure you focused the document before clicking the extension.')
    }

    /**
     * @param {string} text
     * @returns {Promise<void>}
     */
    static async setClipboard(text) {
        const type = 'text/plain';
        const blob = new Blob([text], {type});
        const data = [new ClipboardItem({[type]: blob})]
        await navigator.clipboard.write(data);
    }

    /**
     * @param {string} data
     * @param {string} filename
     */
    static download(data, filename) {
        const a         = document.createElement('a');
        a.href          = data;
        a.download      = filename;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    /**
     * Convert a fetch response to a base64 string with the data url prefix.
     *
     * @param {Response} response   HTTP Response from a fetch request
     * @returns {Promise<string>}
     */
    static toBase64(response) {
        return new Promise((resolve, reject) => {
            const reader     = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror   = reject
            response.blob().then(blob => reader.readAsDataURL(blob));
        });
    }
}