export default class Interface {

    /**
     * Create a theme button with the provided text.
     *
     * @param {string} text
     *      The text that will be used as the button's text.
     * @returns {HTMLButtonElement}
     *      The button element
     */
    static createButton(text) {
        const button = document.createElement('button');
        button.classList.add('bordered');
        button.innerText = text;
        return button;
    };

    /**
     * Create a themed input with the provided text.
     *
     * @param {string} text
     *      The text that will be used as the input label text.
     * @returns {{value: string, input: HTMLInputElement, element: HTMLLabelElement}}
     *      An object giving access to the containing element, the input and a quick getter/setter for the input value.
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
     * Create a div that will expand in a flex container.
     *
     * @returns {HTMLDivElement}
     *      The div element
     */
    static createFiller() {
        const div = document.createElement('div');
        div.classList.add('grow');
        return div;
    }

    /**
     * Create an HR that will act as a visual separator.
     *
     * @returns {HTMLHRElement}
     *      The HR element
     */
    static createSeparator() {
        const hr = document.createElement('hr');
        hr.classList.add('separator');
        return hr;
    }

    /**
     * Enable a button with a success state.
     *
     * @param {HTMLButtonElement} button
     *      The button to enable.
     * @param {'none'|'lock'|'temporary'} type
     *      Type for the state display. `lock` will keep the state even after two seconds, whereas `temporary` will
     *      remove the state after 2 seconds. Both modes will display the state text within the button for 2 seconds.
     * @param {boolean} isSuccessful
     *      If the action that preceded the button activation was successful or not.
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
     * Add a special click listener to the button which will disable it while the associated action is being executed.
     * The action is synchronous, and the button will always be enabled instantly if an asynchronous action is used. For
     * asynchronous actions, please use `handleButtonClickAsync`.
     *
     * Once the action is executed, the button will be enabled automatically with either a success state or an error
     * state, if the action threw an exception.
     *
     * @param {HTMLButtonElement} button
     *      The button on which the click listener will be attached.
     * @param {function(): any} func
     *      The synchronous action to execute within the click listener.
     * @param {'none'|'lock'|'temporary'} type
     *      Type for the state display. `lock` will keep the state even after two seconds, whereas `temporary` will
     *      remove the state after 2 seconds. Both modes will display the state text within the button for 2 seconds.
     */
    static handleButtonClickSync(button, func, type = 'none') {
        button.addEventListener('click', () => {
            button.disabled = true;

            try {
                func();
                Interface.enableButton(button, type, true);
            } catch (e) {
                Interface.enableButton(button, type, false);
            }
        });
    }

    /**
     * Add a special click listener to the button which will disable it while the associated action is being executed.
     * The action is asynchronous. For synchronous action, you can use `handleButtonClickSync` instead.
     *
     * Once the action is executed, the button will be enabled automatically with either a success state or an error
     * state, if the action threw an exception.
     *
     * @param {HTMLButtonElement} button
     *      The button on which the click listener will be attached.
     * @param {function(): Promise<any>} func
     *      The asynchronous action to execute within the click listener.
     * @param {'none'|'lock'|'temporary'} type
     *      Type for the state display. `lock` will keep the state even after two seconds, whereas `temporary` will
     *      remove the state after 2 seconds. Both modes will display the state text within the button for 2 seconds.
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