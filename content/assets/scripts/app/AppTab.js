export default class AppTab {

    /**
     * Retrieve the tab name, that will be used as identifier.
     *
     * @returns {string}
     *      This tab name
     */
    static getName() {
        return '';
    }

    /**
     * Create an application tab.
     *
     * @param {Application} application
     *      The application to which this tab will be associated.
     * @param {string} name
     *      The name of this tab, that will be used as identifier.
     */
    constructor(application, name) {

        this.application = application;
        this.name        = name;

        /**
         * @type {HTMLElement[]}
         */
        this.children = [];
    }

    /**
     * Called right before the content of this tab is inserted into the DOM.
     *
     * @param {any} args
     *      Optional argument that can be provided to initialize the tab's UI.
     */
    async onShow(args) {

    }

    /**
     * Called right before the content of this tab is removed from the DOM.
     */
    async onHide() {

    }

    /**
     * Called whenever a UI refresh is needed. This can be done from anywhere in the code as long a CustomEvent 'tick'
     * is being dispatched on the body.
     *
     * This method get also called right after onShow() automatically.
     */
    async onTick() {

    }

    /**
     * Convenience method for Application#showTab.
     *
     * Display a tab in the extension container. If the tab name send is the same as the one currently active, the tab
     * will still be destroyed then rebuilt, just like it was a different tab.
     *
     * @param {string} name
     *      The name of the tab to display.
     * @param {any=} args
     *      Optional arguments to send to the tab when displaying.
     * @returns {boolean}
     *      Returns true when a tab change occurred, false otherwise.
     */
    showTab(name, args) {
        this.application.showTab(name, args).then();
    }

}