export class Interface {
    /**
     * @param {string} text
     * @returns {HTMLButtonElement}
     */
    static createButton(text) {
        const button = document.createElement('button');
        button.classList.add('bordered');
        button.innerText = text;
        return button;
    };

    /**
     * @returns {HTMLElement}
     */
    static createTab() {
        const tab = document.createElement('section');
        tab.classList.add('actions', 'grow');
        return tab;
    }

    /**
     * @param {string} text
     * @returns {{value: string, input: HTMLInputElement, element: HTMLLabelElement}}
     */
    static createInput(text) {
        const label = document.createElement('label');
        const input = document.createElement('input');
        const p     = document.createElement('p');

        label.classList.add('input-group');
        input.classList.add('text-input', 'bordered');
        p.classList.add('label');

        p.innerText = text;

        label.appendChild(p);
        label.appendChild(input);

        return {
            element: label,
            input:   input,
            get value() {
                return input.value;
            },
            set value(value) {
                input.value = value;
            }
        }
    }

    /**
     * @returns {HTMLDivElement}
     */
    static createFiller() {
        const div = document.createElement('div');
        div.classList.add('grow', 'filler');
        return div;
    }

    /**
     * @returns {HTMLHRElement}
     */
    static createSeparator() {
        const hr = document.createElement('hr');
        hr.classList.add('separator');
        return hr;
    }

    /**
     * @param {HTMLButtonElement} btn
     * @param {function(): Promise<*>} action
     * @param {boolean} temporarySuccess
     */
    static async handleButton(btn, action, temporarySuccess) {
        btn.disabled = true;
        await action();
        btn.disabled = false;
        btn.classList.add('shared');
        if (temporarySuccess) {
            const text    = btn.innerText;
            btn.innerText = 'Success';
            setTimeout(() => {
                btn.classList.remove('shared');
                btn.innerText = text;
            }, 2000);
        }
    }
}

/**
 * Class representing a tab in the extension
 */
export class ExtensionTab {

    /**
     * The name of the tab.
     * @returns {string}
     */
    static get name() {
        return 'default'
    }

    /**
     * @param {PixivCompanion} companion
     * @param {string} name
     */
    constructor(companion, name) {
        this.companion = companion;
        this.name      = name;
        this.children  = [];
    }

    /**
     * Called before showing the tab content
     * @param {*} args
     */
    beforeShow(args) {

    }

    beforeHide() {

    }

    tick() {

    }
}