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
     * Try to define the artwork data from the provided object.
     *
     * @param {PixivQuery|null} data
     *      The data to load into this instance
     * @returns {boolean}
     *      True if the data has been loaded, false otherwise.
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
     * Retrieve the filename under which this artwork should be downloaded.
     *
     * @returns {string}
     *      The filename
     */
    getFilename() {
        return this.sources.full.split('/').pop();
    }

    /**
     * Retrieve the original artwork url from which the data has been extracted.
     *
     * @returns {string|null}
     *      The artwork URL.
     */
    getUrl() {
        return this.url;
    }

    /**
     * Retrieve the share link for the artwork.
     *
     * @returns {string|null}
     *      The share URL.
     */
    getPhixivUrl() {
        return this.getUrl()?.replace('pixiv.net', 'phixiv.net');
    }

    /**
     * Retrieve the direct link to one of the artwork image.
     *
     * @param {'full'|'preview'} resolution
     *      The image from which the link should be retrieved, 'full' being the full resolution artwork and 'preview'
     *      being the regular one.
     * @returns {string|null}
     *      The artwork image URL.
     */
    getSource(resolution) {
        return this.sources[resolution];
    }

    /**
     * Retrieve the description that the artwork's author defined.
     *
     * @returns {string|null}
     *      The artwork description.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Retrieve the author's username.
     *
     * @returns {string|null}
     *      The author's username
     */
    getAuthorName() {
        return this.author.name;
    }

    /**
     * Check whether this artwork instance contains valid data.
     *
     * @returns {boolean}
     *      True if artwork data can be safely accessed, false otherwise.
     */
    isAvailable() {
        return this.available;
    }
}
