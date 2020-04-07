window.onload = function () {
    createAllElementsOnPage();
    document.querySelector('html').addEventListener('keydown', keyDownUpMouseClickHandler);
    document.querySelector('html').addEventListener('keyup', keyDownUpMouseClickHandler);
    document.querySelector('html').addEventListener('click', keyDownUpMouseClickHandler);
}

// рендеринг основных нод и выгрузка темплейта
const createAllElementsOnPage = () => {
    let keyboardWrapper = createNode('div', 'container'),
        textarea = createNode('textarea', 'text-input'),
        keyboard = createNode('div', 'keyboard'),
        template = '';

    for (let i = 0; i < keysObj.ru.length; i++) {
        if (keysObj.keyCodes[i] == 'Backquote' || keysObj.keyCodes[i] == 'Tab' ||
            keysObj.keyCodes[i] == 'CapsLock' || keysObj.keyCodes[i] == 'ShiftLeft' ||
            keysObj.keyCodes[i] == 'ControlLeft') {
            template += '<div class="row">';
        }
        template += `
            <div class="key" data-key="${keysObj.keyCodes[i]}">
                <span class="ru ${languageInLocalStorage === 'ru' ? 'active' : 'inactive'}">
                    <span class="shift-on">
                        ${keysObj.ru[i]}
                    </span>
                    <span class="shift-off">
                        ${keysObj.ruShift[i]}
                    </span>
                </span>
                <span class="eng ${languageInLocalStorage === 'eng' ? 'active' : 'inactive'}">
                    <span class="shift-on">
                        ${keysObj.eng[i]}
                    </span>
                    <span class="shift-off">
                        ${keysObj.engShift[i]}
                    </span>
                </span>
            </div>
        `;
        if (keysObj.keyCodes[i] == 'Backspace' || keysObj.keyCodes[i] == 'Delete' ||
            keysObj.keyCodes[i] == 'Enter' || keysObj.keyCodes[i] == 'ShiftRight' ||
            keysObj.keyCodes[i] == 'ControlRight') {
            template += '</div>';
        }
    }

    keyboardWrapper.append(textarea);
    keyboardWrapper.append(keyboard);
    keyboard.innerHTML = template;
    document.body.append(keyboardWrapper);
}

// Функция для создания узлов (узел, классы)
const createNode = (node, ...classes) => {
    let createdElement = document.createElement(node);
    createdElement.classList.add(...classes);
    return createdElement;
}

const keyDownUpMouseClickHandler = (e) => {

}