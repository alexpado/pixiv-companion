export default class Interface {

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
     * @param {string} text
     * @returns {{value: string, input: HTMLInputElement, element: HTMLLabelElement}}
     */
    static createInput(text) {
        const label = document.createElement('label');
        const input = document.createElement('input');
        const p     = document.createElement('p');

        label.classList.add('input-group');
        input.classList.add('bordered');
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
        div.classList.add('grow');
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
     * @param {HTMLButtonElement} button
     * @param {'none'|'lock'|'temporary'} type
     * @param {boolean} isSuccessful
     */
    static enableButton(button, type, isSuccessful) {
        button.disabled     = false;
        const cssClass      = isSuccessful ? 'success' : 'error';
        const temporaryText = isSuccessful ? 'Done !' : 'Error !'

        switch (type) {
            case "temporary": {
                const content    = button.innerHTML;
                button.innerHTML = temporaryText
                button.classList.add(cssClass);
                setTimeout(() => {
                    button.classList.remove(cssClass);
                    button.innerHTML = content;
                }, 2000);
                break;
            }
            case "lock": {
                const content    = button.innerHTML;
                button.innerHTML = temporaryText;
                button.classList.add(cssClass);
                setTimeout(() => {
                    button.innerHTML = content;
                }, 2000);
                break;
            }
        }
    }

    /**
     * @param {HTMLButtonElement} button
     * @param {function(): any} func
     * @param {'none'|'lock'|'temporary'} type
     */
    static handleButtonClickSync(button, func, type = 'none') {
        button.addEventListener('click', () => {
            button.disabled = true;

            let isSuccessful = false;
            try {
                func();
                isSuccessful = true;
            } catch (e) {
            }

            Interface.enableButton(button, type, isSuccessful)
        });
    }

    /**
     * @param {HTMLButtonElement} button
     * @param {function(): Promise<any>} func
     * @param {'none'|'lock'|'temporary'} type
     */
    static handleButtonClickAsync(button, func, type = 'none') {
        button.addEventListener('click', () => {
            button.disabled = true;
            func()
                .then(() => Interface.enableButton(button, type, true))
                .catch(() => Interface.enableButton(button, type, false))
        })
    }
}