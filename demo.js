(() => {
  const records = [
    { id: "SIM-01", key: "A|01|leave", group: "A", activity: "Leave", automated: false },
    { id: "SIM-02", key: "A|01|leave", group: "A", activity: "Leave", automated: false },
    { id: "SIM-03", key: "A|02|attendance", group: "A", activity: "Attendance", automated: true },
    { id: "SIM-04", key: "A|03|attendance", group: "A", activity: "Attendance", automated: false },
    { id: "SIM-05", key: "B|04|leave", group: "B", activity: "Leave", automated: false },
    { id: "SIM-06", key: "B|05|attendance", group: "B", activity: "Attendance", automated: true },
  ];

  function classify(entries) {
    const seen = new Set();
    return entries.map((entry) => {
      if (entry.automated) return { ...entry, decision: "Automated · excluded", review: false };
      if (seen.has(entry.key)) return { ...entry, decision: "Duplicate · excluded", review: false };
      seen.add(entry.key);
      return { ...entry, decision: "Review", review: true };
    });
  }

  const team = document.querySelector("#team");
  const queue = document.querySelector("#queue");
  const count = document.querySelector("#queue-count");
  const classified = classify(records);

  function render() {
    const visible = classified.filter((entry) => team.value === "all" || entry.group === team.value);
    const reviewCount = visible.filter((entry) => entry.review).length;
    const rows = visible.map((entry) => {
      const row = document.createElement("tr");
      for (const value of [entry.id, entry.group, entry.activity, entry.decision]) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      }
      if (entry.review) row.lastElementChild.classList.add("review");
      return row;
    });
    queue.replaceChildren(...rows);
    count.textContent = reviewCount + " of " + visible.length + " require review";
  }

  team.addEventListener("change", render);
  render();
})();
