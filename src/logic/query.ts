export type HashOfStrings = { [key: string]: string };

let params = new URLSearchParams(location.search);

export function parseParams() {
    params = new URLSearchParams(location.search);
}

export function getParam(key: string): string {
    return params.get(key) || '';
}

export function setParams(newParams: HashOfStrings) {
    for (const [k, v] of Object.entries(newParams)) {
        params.set(k, v);
    }
    location.search = params.toString();
}
