export default function useOptimizer() {
    const metalIncrements = [1000, 800, 600, 400, 200, 100, 50];
    const ceramicsIncrements = [800, 640, 480, 320, 160, 80, 40];
    const resinIncrements = [800, 640, 480, 320, 160, 80, 40];
    const chemicalsIncrements = [600, 480, 360, 240, 120, 60, 30];
    const alloysIncrements = [1200, 960, 720, 480, 240, 120, 60];

    const solve = (needed, increments) => {
        if (needed <= 0) {
            return { total: 0, packs: [], overflow: 0 };
        }

        const packs = [];
        let remaining = needed;

        // Greedy algorithm: use largest packs first
        for (const size of increments) {
            while (remaining >= size) {
                packs.push(size);
                remaining -= size;
            }
        }

        const total = packs.reduce((sum, p) => sum + p, 0);

        return {
            total,
            packs,
            overflow: total - needed,
        };
    };

    return {
        metalIncrements,
        ceramicsIncrements,
        resinIncrements,
        chemicalsIncrements,
        alloysIncrements,
        solve,
    };
};
