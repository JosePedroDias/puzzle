const downKeys:Set<string> = new Set();

type KeyHandler = (isDown: boolean, key: string) => void;

const keyHandlers:Map<string, KeyHandler[]> = new Map();

export function isKeyDown(key: string) {
    return downKeys.has(key);
}

function notifyHandlers(isDown: boolean, key: string): boolean {
    const bag = keyHandlers.get(key);
    if (!bag) return false;
    for (const handler of bag) handler(isDown, key);
    return true;
}

export function setupKeyListening() {
    document.addEventListener('keydown', (ev) => {
        const key = ev.code;
        // console.log(`down: ${key}`);
        downKeys.add(key);
        if (notifyHandlers(true, key)) {
            ev.preventDefault();
            ev.stopPropagation();
        }
    });

    document.addEventListener('keyup', (ev) => {
        const key = ev.code;
        // console.log(`up: ${key}`);
        downKeys.delete(key);
        if (notifyHandlers(false, key)) {
            ev.preventDefault();
            ev.stopPropagation();
        }
    });
}

export function onKeyChange(key: string, handler: KeyHandler) {
    let bag = keyHandlers.get(key);
    if (!bag) {
        bag = [];
        keyHandlers.set(key, bag);
    }
    bag.push(handler);
}
