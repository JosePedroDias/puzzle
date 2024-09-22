export function combinations2(n: number): [number, number][] {
    const pairs: [number, number][] = [];
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < i; ++j) {
            if (i !== j) pairs.push([i, j]);
        }
    }
    return pairs;
}
