export interface KeyCommand {
  keyCode: number,
  modifiers?: number[],
}

const ShiftLeftCode = 0xe1;

const keyMap: { [key: string]: KeyCommand } = {
  "AltLeft": { keyCode: 0xe2 },
  "AltRight": { keyCode: 0xe6 },
  "ArrowDown": { keyCode: 0x51 },
  "ArrowLeft": { keyCode: 0x50 },
  "ArrowRight": { keyCode: 0x4f },
  "ArrowUp": { keyCode: 0x52 },

  "Backspace": { keyCode: 0x2a },
  "-": { keyCode: 0x2d },
  "_": { keyCode: 0x2d, modifiers: [ShiftLeftCode] },
  "=": { keyCode: 0x2e },
  "+": { keyCode: 0x2e, modifiers: [ShiftLeftCode] },
  "[": { keyCode: 0x2f },
  "{": { keyCode: 0x2f, modifiers: [ShiftLeftCode] },
  "]": { keyCode: 0x30 },
  "}": { keyCode: 0x30, modifiers: [ShiftLeftCode] },
  "\\": { keyCode: 0x31 },
  "|": { keyCode: 0x31, modifiers: [ShiftLeftCode] },
  ";": { keyCode: 0x33 },
  ":": { keyCode: 0x33, modifiers: [ShiftLeftCode] },
  "'": { keyCode: 0x34 },
  "\"": { keyCode: 0x34, modifiers: [ShiftLeftCode] },
  // also map "smart" quotes
  "”": { keyCode: 0x34, modifiers: [ShiftLeftCode] },
  "“": { keyCode: 0x34, modifiers: [ShiftLeftCode] },
  "`": { keyCode: 0x35 },
  "~": { keyCode: 0x35, modifiers: [ShiftLeftCode] },
  ",": { keyCode: 0x36 },
  "<": { keyCode: 0x36, modifiers: [ShiftLeftCode] },
  ".": { keyCode: 0x37 },
  ">": { keyCode: 0x37, modifiers: [ShiftLeftCode] },
  "/": { keyCode: 0x38 },
  "?": { keyCode: 0x38, modifiers: [ShiftLeftCode] },
  "CapsLock": { keyCode: 0x39 },
  "ControlLeft": { keyCode: 0xe0 },
  "Delete": { keyCode: 0x4c },
  "0": { keyCode: 0x27 },
  "1": { keyCode: 0x1e },
  "2": { keyCode: 0x1f },
  "3": { keyCode: 0x20 },
  "4": { keyCode: 0x21 },
  "5": { keyCode: 0x22 },
  "6": { keyCode: 0x23 },
  "7": { keyCode: 0x24 },
  "8": { keyCode: 0x25 },
  "9": { keyCode: 0x26 },
  ")": { keyCode: 0x27, modifiers: [ShiftLeftCode] },
  "!": { keyCode: 0x1e, modifiers: [ShiftLeftCode] },
  "@": { keyCode: 0x1f, modifiers: [ShiftLeftCode] },
  "#": { keyCode: 0x20, modifiers: [ShiftLeftCode] },
  "$": { keyCode: 0x21, modifiers: [ShiftLeftCode] },
  "%": { keyCode: 0x22, modifiers: [ShiftLeftCode] },
  "^": { keyCode: 0x23, modifiers: [ShiftLeftCode] },
  "&": { keyCode: 0x24, modifiers: [ShiftLeftCode] },
  "*": { keyCode: 0x25, modifiers: [ShiftLeftCode] },
  "(": { keyCode: 0x26, modifiers: [ShiftLeftCode] },
  "End": { keyCode: 0x4d },
  "Enter": { keyCode: 0x28 },
  "Equal": { keyCode: 0x2e },
  "Escape": { keyCode: 0x29 },
  "F1": { keyCode: 0x3a },
  "F2": { keyCode: 0x3b },
  "F3": { keyCode: 0x3c },
  "F4": { keyCode: 0x3d },
  "F5": { keyCode: 0x3e },
  "F6": { keyCode: 0x3f },
  "F7": { keyCode: 0x40 },
  "F8": { keyCode: 0x41 },
  "F9": { keyCode: 0x42 },
  "F10": { keyCode: 0x43 },
  "F11": { keyCode: 0x44 },
  "F12": { keyCode: 0x45 },
  "Home": { keyCode: 0x4a },
  "IntlBackslash": { keyCode: 0x31 },
  "A": { keyCode: 0x04, modifiers: [ShiftLeftCode] },
  "a": { keyCode: 0x04 },
  "MetaLeft": { keyCode: 0xe3 },
  "MetaRight": { keyCode: 0xe7 },
  "NumpadEnter": { keyCode: 0x58 },
  "PageDown": { keyCode: 0x4e },
  "PageUp": { keyCode: 0x4b },
  "ShiftLeft": { keyCode: ShiftLeftCode },
  "ShiftRight": { keyCode: 0xe5 },
  " ": { keyCode: 0x2c },
  "Tab": { keyCode: 0x2b }
}

export function mapKey(key: string): KeyCommand | null {
  let jsCode = -1;
  if (key.length == 1) {
    jsCode = key.charCodeAt(0);
  }
  console.log(`in: ${key} jsCode: ${jsCode}`)
  // A-Z
  if (jsCode >= 65 && jsCode <= 90) {
    const keyCommand = Object.assign({}, keyMap["A"])
    keyCommand.keyCode += (jsCode - 65)
    return keyCommand
  }
  // a-z
  if (jsCode >= 97 && jsCode <= 122) {
    const keyCommand = Object.assign({}, keyMap["a"])
    keyCommand.keyCode += (jsCode - 97)
    return keyCommand
  }
  const keyMapRes = keyMap[key];
  if (!keyMapRes) {
    return null;
  }
  return keyMapRes
}