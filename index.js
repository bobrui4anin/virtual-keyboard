let shiftEntered = false;
let capsLockEntered = false;

// проверяем язык в localstorage, если его нету, то устанавливаем дефолтный
// Возможные языки ru / eng
// Добавляем body активный класс
if (localStorage.getItem("language") === null) {
  localStorage.setItem("language", "ru");
  document.body.classList.add(`lng-${localStorage.getItem("language")}`);
} else {
  document.body.classList.add(`lng-${localStorage.getItem("language")}`);
}

const keysObj = {
  ru: ["ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
    "Tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "\\", "Del",
    "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "Enter",
    "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ",", "↑", "Shift",
    "Ctrl", "Win", "Alt", "Space", "Alt", "←", "↓", "→", "Ctrl",
  ],
  ruShift: ["Ё", "!", "\"", "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "Backspace",
    "Tab", "Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ", "/", "Del",
    "CapsLock", "Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э", "Enter",
    "Shift", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", ".", "↑", "Shift",
    "Ctrl", "Win", "Alt", "Space", "Alt", "←", "↓", "→", "Ctrl",
  ],
  eng: ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
    "Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\", "Del",
    "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter",
    "Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "↑", "Shift",
    "Ctrl", "Win", "Alt", "Space", "Alt", "←", "↓", "→", "Ctrl",
  ],
  engShift: ["~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "Backspace",
    "Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}", "|", "Del",
    "CapsLock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\"", "Enter",
    "Shift", "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?", "↑", "Shift",
    "Ctrl", "Win", "Alt", "Space", "Alt", "←", "↓", "→", "Ctrl",
  ],
  keyCodes: [
    "Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace",
    "Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash", "Delete",
    "CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter",
    "ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ArrowUp", "ShiftRight",
    "ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "ArrowLeft", "ArrowDown", "ArrowRight", "ControlRight",
  ],
};

// Функция для создания узлов (узел, классы)
const createNode = (node, ...classes) => {
  const createdElement = document.createElement(node);
  createdElement.classList.add(...classes);
  return createdElement;
};

// рендеринг основных нод и выгрузка темплейта
const createAllElementsOnPage = () => {
  const keyboardWrapper = createNode("div", "container");
  const textarea = createNode("textarea", "text-input");
  const keyboard = createNode("div", "keyboard");
  let template = "";

  for (let i = 0; i < keysObj.ru.length; i += 1) {
    if (["Backquote", "Tab", "CapsLock", "ShiftLeft", "ControlLeft"].includes(keysObj.keyCodes[i])) {
      template += "<div class=\"row\">";
    }
    template += `
            <div class="key" data-key="${keysObj.keyCodes[i]}">
                <span class="ru">
                    <span class="shift-on">
                        ${keysObj.ru[i]}
                    </span>
                    <span class="shift-off">
                        ${keysObj.ruShift[i]}
                    </span>
                </span>
                <span class="eng">
                    <span class="shift-on">
                        ${keysObj.eng[i]}
                    </span>
                    <span class="shift-off">
                        ${keysObj.engShift[i]}
                    </span>
                </span>
            </div>
        `;
    if (["Backspace", "Delete", "Enter", "ShiftRight", "ControlRight"].includes(keysObj.keyCodes[i])) {
      template += "</div>";
    }
  }

  keyboardWrapper.append(textarea);
  keyboardWrapper.append(keyboard);
  keyboard.innerHTML = template;
  document.body.append(keyboardWrapper);
};

// меняем у body класс в зависимости от нажатого шифта или CL
const changeBodyClass = () => {
  document.body.classList.toggle("off");
};

/* обработка всех кейсов для нажатой клавиши на клавиатуре и при клике на мышке
(key - событие, setup - мышь или клава) */
const handleKey = (key, setup, textarea) => {
  // позиция каретки
  let currentPosition = 0;
  if (document.selection) {
    textarea.focus();
    const selectionRng = document.selection.createRange();
    selectionRng.moveStart("character", -textarea.value.length);
    currentPosition = selectionRng.text.length;
  } else if (textarea.selectionStart || textarea.selectionStart === 0) {
    currentPosition = textarea.selectionStart;
  }

  // обрабатываем функциональные кнопки
  switch (key) {
    case "CapsLock":
      changeBodyClass();
      capsLockEntered = !capsLockEntered;

      if (setup === "mouseCLick") {
        if (capsLockEntered) {
          document.querySelector(`[data-key="${key}"`).classList.add("clicked");
        } else {
          document.querySelector(`[data-key="${key}"`).classList.remove("clicked");
        }
      }
      break;
    case "Space":
      textarea.value += " ";
      break;
    case "Tab":
      textarea.value += "\t";
      break;
    case "ShiftRight":
    case "ShiftLeft":
      if (shiftEntered) {
        return;
      }
      // обработка шифта по клику мышью
      if (setup === "mouseCLick") {
        shiftEntered = true;
        setTimeout(() => {
          changeBodyClass();
        }, 10);
        setTimeout(() => {
          changeBodyClass();
        }, 100);
        shiftEntered = false;
        return;
      }

      shiftEntered = true;
      changeBodyClass();
      break;
    case "Backspace":
      if (textarea.value.length > 0 && currentPosition !== 0) {
        let res = "";
        for (let i = 0; i < textarea.value.length; i += 1) {
          if (currentPosition - 1 === i) {
            res += "";
          } else {
            res += textarea.value[i];
          }
        }
        textarea.value = res;
        currentPosition -= 1;
        textarea.setSelectionRange(currentPosition, currentPosition);
      }
      break;
    case "Enter":
      textarea.value += "\n";
      break;
    case "Delete":
      if (textarea.value.length > 0 && currentPosition !== textarea.value.length) {
        let res = "";
        for (let i = 0; i < textarea.value.length; i += 1) {
          if (currentPosition !== i) {
            res += textarea.value[i];
          }
        }
        textarea.value = res;
        textarea.setSelectionRange(currentPosition, currentPosition);
      }
      break;
    case "ArrowLeft":
      textarea.focus();
      if (currentPosition !== 0) {
        currentPosition -= 1;
      }
      textarea.setSelectionRange(currentPosition, currentPosition);
      break;
    case "ArrowRight":
      textarea.focus();
      if (currentPosition !== textarea.value.length) {
        currentPosition += 1;
      }
      textarea.setSelectionRange(currentPosition, currentPosition);
      break;
    case "NumpadDivide":
      textarea.value += "/";
      break;
    case "NumpadMultiply":
      textarea.value += "*";
      break;
    case "NumpadSubtract":
      textarea.value += "-";
      break;
    case "NumpadAdd":
      textarea.value += "+";
      break;
    case "NumpadEnter":
      textarea.value += "\n";
      break;
    case "NumpadDecimal":
      textarea.value += ".";
      break;
    case "NumLock":
    case "ControlLeft":
    case "ControlRight":
    case "AltLeft":
    case "AltRight":
    case "Escape":
    case "Insert":
    case "MetaLeft":
    case "Home":
    case "End":
    case "PageUp":
    case "PageDown":
    case "IntlBackslash":
    case "ContextMenu":
      break;
    default:
      // Отключаем F1-F12, и выводим numpad
      for (let i = 0; i <= 12; i += 1) {
        if (key === `F${i}`) {
          return;
        }
        if (i >= 0 && i <= 9 && key === `Numpad${i}`) {
          textarea.value += i;
          return;
        }
      }
      if (document.body.classList.contains("off")) {
        textarea.value += document.querySelector(`[data-key="${key}"] .${localStorage.getItem("language")} .shift-off`).innerText;
      } else {
        textarea.value += document.querySelector(`[data-key="${key}"] .${localStorage.getItem("language")} .shift-on`).innerText;
      }
  }
};

const keyDownHandler = (keysBlock, event, textarea) => {
  if (event.type === "keydown") {
    keysBlock.forEach((keyBlock) => {
      if (keyBlock.getAttribute("data-key") === event.code) {
        setTimeout(() => {
          keyBlock.classList.add("clicked");
        }, 10);
      }
    });
    // переключение языка и перерендеринг элементов
    if (event.altKey && event.ctrlKey) {
      if (localStorage.getItem("language") === "ru") {
        localStorage.setItem("language", "eng");
        document.body.classList.add("lng-eng");
        document.body.classList.remove("lng-ru");
      } else {
        localStorage.setItem("language", "ru");
        document.body.classList.add("lng-ru");
        document.body.classList.remove("lng-eng");
      }
    }

    handleKey(event.code, "keyboardBtn", textarea);
  }
};

const keyUpHandler = (keysBlock, event) => {
  if (event.type === "keyup") {
    switch (event.code) {
      case "ShiftRight":
      case "ShiftLeft":
        if (shiftEntered) {
          changeBodyClass();
        }
        shiftEntered = false;
        break;
      default:
    }

    for (let i = 0; i < keysBlock.length; i += 1) {
      if (keysBlock[i].getAttribute("data-key") === event.code) {
        // Обрабатываем нажатие capslock, если нажали 1ый раз, то оставляем его активным
        if (!(event.code === "CapsLock" && capsLockEntered)) {
          setTimeout(() => {
            keysBlock[i].classList.remove("clicked");
          }, 150);
        }
      }
    }
  }
};

const mouseClickHandler = (event, textarea) => {
  if (event.type === "click" && event.target.tagName === "SPAN") {
    event.target.closest(".key").classList.add("clicked");
    setTimeout(() => {
      event.target.closest(".key").classList.remove("clicked");
      handleKey(event.target.closest(".key").getAttribute("data-key"), "mouseCLick", textarea);
    }, 100);
  }
};

const keyDownUpMouseClickHandler = (e) => {
  const keysBlock = document.querySelectorAll(".key");
  const textarea = document.querySelector(".text-input");
  e.preventDefault();
  // При нажатии на кнопку клавиатуры
  keyDownHandler(keysBlock, e, textarea);
  // При отжатии кнопки на клавиатуре
  keyUpHandler(keysBlock, e);
  // Клик мыши
  mouseClickHandler(e, textarea);
};

const onLoadState = () => {
  createAllElementsOnPage();

  document.querySelector("html").addEventListener("keydown", keyDownUpMouseClickHandler);
  document.querySelector("html").addEventListener("keyup", keyDownUpMouseClickHandler);
  document.querySelector("html").addEventListener("click", keyDownUpMouseClickHandler);
};

document.addEventListener("DOMContentLoaded", () => {
  onLoadState();
});
