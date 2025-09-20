export const dashboardMock = {
  days: Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(Date.now() - (13 - i) * 24 * 3600_000);
    const date = d.toISOString().slice(0, 10);
    return {
      date,
      count: Math.floor(10 + Math.random() * 20),
      avgReliability: Math.floor(50 + Math.random() * 40)
    };
  })
};


