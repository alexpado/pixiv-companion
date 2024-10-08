/**
 * @typedef {Object} PixivQuery
 * @property {string} artwork.sources.full      The link pointing to the full resolution artwork
 * @property {string} artwork.sources.preview   The link pointing to the preview resolution artwork
 * @property {string} artwork.description       The description given to the artwork by its author
 * @property {string} author.name               The author profile name
 * @property {string} author.profile            The author profile picture
 * @property {string} url                       The original pixiv artwork link
 */
import Logger from "./Logger.js";

export default class PixivArtwork {

    constructor() {

        this.sources     = {
            full:    null,
            preview: null
        }
        this.description = null;
        this.author      = {
            name:    null,
            profile: null,
        }
        this.url         = null;

        this.available = false;
    }

    /**
     * @param {PixivQuery|null} data
     * @returns {boolean}
     */
    setData(data) {

        if (data) {
            this.sources.full    = data.artwork.sources.full;
            this.sources.preview = data.artwork.sources.preview;
            this.description     = data.artwork.description;
            this.author.name     = data.author.name;
            this.author.profile  = data.author.profile;
            this.url             = data.url;

            this.available = true;


            Logger.log('PixivArtwork', 'setData()', 'Artwork is available.');
            document.body.dispatchEvent(new CustomEvent("tick"));
        } else {
            this.sources.full    = null;
            this.sources.preview = null;
            this.description     = null;
            this.author.name     = null;
            this.author.profile  = null;
            this.url             = null;

            this.available = false;

            Logger.log('PixivArtwork', 'setData()', 'Artwork is not available.');
            document.body.dispatchEvent(new CustomEvent("tick"));
        }
    }

    /**
     * @returns {string}
     */
    getFilename() {
        return this.sources.full.split('/').pop();
    }

    /**
     * @returns {string|null}
     */
    getUrl() {
        return this.url;
    }

    /**
     * @returns {string|null}
     */
    getPhixivUrl() {
        return this.getUrl()?.replace('pixiv.net', 'phixiv.net');
    }

    /**
     * @param {'full'|'preview'} resolution
     * @returns {string|null}
     */
    getSource(resolution) {
        return this.sources[resolution];
    }

    /**
     * @returns {string|null}
     */
    getDescription() {
        return this.description;
    }

    /**
     * @returns {string|null}
     */
    getAuthorName() {
        return this.author.name;
    }

    /**
     * @returns {boolean}
     */
    isAvailable() {
        return this.available;
    }
}
