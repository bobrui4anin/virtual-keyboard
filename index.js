window.onload = function () {

    createAllElementsOnPage();

    document.querySelector('html').addEventListener('keydown', keyDownUpMouseClickHandler);
    document.querySelector('html').addEventListener('keyup', keyDownUpMouseClickHandler);
    document.querySelector('html').addEventListener('click', keyDownUpMouseClickHandler);
}

let languageInLocalStorage = 'ru',
    shiftEntered = false,
    capsLockEntered = false;

// проверяем язык в localstorage, если его нету устанавливаем дефолтный (ru)
if (!localStorage.getItem('language')) {
    localStorage.setItem('language', 'ru');
} else {
    languageInLocalStorage = localStorage.getItem('language');
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
    const keysBlock = document.querySelectorAll('.key');
    let textareaValue = document.querySelector('.text-input');

    // При нажатии на кнопку клавиатуры
    if (e.type === 'keydown') {
        keysBlock.forEach(keyBlock => {
            if (keyBlock.getAttribute('data-key') === e.code) {
                keyBlock.classList.add('clicked');
            }
        });
        e.preventDefault();

        // переключение языка
        if (e.altKey && e.ctrlKey) {
            let currentLanguageBlocks = document.querySelectorAll('.active'),
                offLanguageBlocks = document.querySelectorAll('.inactive');

            currentLanguageBlocks.forEach((currentBlock, indx) => {
                currentBlock.classList.remove('active');
                currentBlock.classList.add('inactive');
                offLanguageBlocks[indx].classList.remove('inactive');
                offLanguageBlocks[indx].classList.add('active');
            });

            if (localStorage.getItem('language') == 'ru') {
                localStorage.setItem('language', 'eng');
            } else {
                localStorage.setItem('language', 'ru');
            }
        }

        handleCases(e.code, 'keyboardBtn', textareaValue);
    }

    // При отжатии кнопки на клавиатуре
    if (e.type === 'keyup') {
        switch (e.code) {
            case 'ShiftRight':
            case 'ShiftLeft':
                if (shiftEntered) {
                    changeState();
                }
                shiftEntered = false;
                break;
        }

        for (let i = 0; i < keysBlock.length; i++) {
            if (keysBlock[i].getAttribute('data-key') === e.code) {
                // Обрабатываем нажатие capslock, если нажали 1ый раз, то оставляем его активным
                if (e.code == 'CapsLock' && capsLockEntered) {
                    continue;
                }
                keysBlock[i].classList.remove('clicked');
            }
        }
    }
}

// меняем классы у кнопок и прячем не активные
const changeState = () => {
    let currentState = document.querySelectorAll('.shift-on'),
        offState = document.querySelectorAll('.shift-off');

    currentState.forEach((key, indx) => {
        key.classList.remove('shift-on');
        key.classList.add('shift-off');
        offState[indx].classList.remove('shift-off');
        offState[indx].classList.add('shift-on');
    });
}

const keysObj = {
    ru: ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
        'Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\', 'Del',
        'CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter',
        'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ',', '↑', 'Shift',
        'Ctrl', 'Win', 'Alt', 'Space', 'Alt', '←', '↓', '→', 'Ctrl'
    ],
    ruShift: ['Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', 'Backspace',
        'Tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', '/', 'Del',
        'CapsLock', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'Enter',
        'Shift', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', '.', '↑', 'Shift',
        'Ctrl', 'Win', 'Alt', 'Space', 'Alt', '←', '↓', '→', 'Ctrl'
    ],
    eng: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace',
        'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'Del',
        'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter',
        'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '↑', 'Shift',
        'Ctrl', 'Win', 'Alt', 'Space', 'Alt', '←', '↓', '→', 'Ctrl'
    ],
    engShift: ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace',
        'Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|', 'Del',
        'CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Enter',
        'Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', '↑', 'Shift',
        'Ctrl', 'Win', 'Alt', 'Space', 'Alt', '←', '↓', '→', 'Ctrl'
    ],
    keyCodes: [
        'Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace',
        'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete',
        'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter',
        'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight',
        'ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight'
    ]
};