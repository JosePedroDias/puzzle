export function intersection<T>(s1: Set<T>, s2: Set<T>): Set<T> {
    return new Set([...s1].filter((it: T) => s2.has(it)));
}

export function union<T>(s1: Set<T>, s2: Set<T>): Set<T> {
    const un = new Set([...s1]);
    for (const it of s2) un.add(it);
    return un;
}

export function difference<T>(s1: Set<T>, s2: Set<T>): Set<T> {
    const un = new Set([...s1]);
    for (const it of s2) un.delete(it);
    return un;
}
