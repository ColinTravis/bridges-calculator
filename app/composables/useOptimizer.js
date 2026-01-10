export default function useOptimizer() {
    // Sorted descending is often helpful for greedy, but DP doesn't strictly care.
    // We keep them sorted for display or logic consistency.
    const metalIncrements = [1000, 800, 600, 400, 200, 100, 50];
    const ceramicsIncrements = [800, 640, 480, 320, 160, 80, 40];
    const resinIncrements = [800, 640, 480, 320, 160, 80, 40];
    const chemicalsIncrements = [600, 480, 360, 240, 120, 60, 30];
    const alloysIncrements = [1200, 960, 720, 480, 240, 120, 60];

    const solve = (needed, increments) => {
        // 1. Determine the minimal target sum >= needed
        if (needed <= 0) {
            return { total: 0, packs: [], overflow: 0 };
        }

        const minStep = increments[increments.length - 1];
        // Ensure we hit a multiple of the smallest unit (which divides all others in this specific dataset)
        const adjustedTarget = Math.ceil(needed / minStep) * minStep;

        // 2. Optimization Strategy
        // For very large numbers, naive DP is too slow and memory heavy.
        // We peel off the largest denomination until we have a manageable remainder.
        // However, we must ensure we don't break optimality. Usually keeping
        // a "buffer" that is a multiple of the LCM of the largest coins is safe.
        // Here, just keeping a modest buffer (e.g., 5000) is plenty for these small coin sets.

        const maxCoin = increments[0];
        const safeBuffer = 5000;

        const resultPacks = [];
        let currentTarget = adjustedTarget;

        if (currentTarget > safeBuffer) {
            const reduceAmount = currentTarget - safeBuffer;
            // We can greedily take maxCoins as long as we stay above safeBuffer
            // actually: how many maxCoins can we take while `remaining >= buffer`?
            // remaining = current - k * max >= buffer  =>  current - buffer >= k * max
            const k = Math.floor((currentTarget - safeBuffer) / maxCoin);

            if (k > 0) {
                for (let i = 0; i < k; i++) {
                    resultPacks.push(maxCoin);
                }
                currentTarget -= k * maxCoin;
            }
        }

        // 3. Dynamic Programming for the remainder (currentTarget)
        // dp[i] = minimum number of coins to sum to i
        const dp = new Array(currentTarget + 1).fill(Infinity);
        const firstCoin = new Array(currentTarget + 1).fill(0);

        dp[0] = 0;

        for (let i = 1; i <= currentTarget; i++) {
            for (const coin of increments) {
                if (i >= coin && dp[i - coin] !== Infinity) {
                    if (dp[i - coin] + 1 < dp[i]) {
                        dp[i] = dp[i - coin] + 1;
                        firstCoin[i] = coin;
                    }
                }
            }
        }

        // 4. Traceback
        if (dp[currentTarget] === Infinity) {
            console.error("Failed to find solution for", currentTarget, increments);
            return { total: 0, packs: [], overflow: 0 };
        }

        let temp = currentTarget;
        while (temp > 0) {
            const coin = firstCoin[temp];
            resultPacks.push(coin);
            temp -= coin;
        }

        // Sort packs for tidy display
        resultPacks.sort((a, b) => b - a);

        const totalSum = resultPacks.reduce((sum, p) => sum + p, 0);

        return {
            total: totalSum,
            packs: resultPacks,
            overflow: totalSum - needed,
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
