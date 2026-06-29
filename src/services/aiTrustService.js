const DEFAULT_RAG_LOGS = [
  {
    id: "rag-101",
    question: "What are the eligibility rules for Aasara Pension?",
    answer: "Aasara Pension requires the citizen to be a senior citizen (60+), widow, or disabled person. The rural household annual income ceiling must not exceed ₹1,50,000, and urban must not exceed ₹2,00,000. Verified matching guidelines indicate land holdings must be less than 3 acres wet or 10 acres dry.",
    retrievedChunks: [
      "Telangana Pension guidelines, Page 12, Clause 4.2 - Rules on age and category limits.",
      "AP Pension guidelines database, Page 8, Section 3 - Rules on land dry/wet limits."
    ],
    latency: 245,
    timestamp: "2026-06-25T10:14:22Z",
    feedback: "HELPFUL"
  },
  {
    id: "rag-102",
    question: "What documents are missing for Amma Vodi?",
    answer: "To evaluate Amma Vodi eligibility, the citizen must submit a White Ration Card and mother's active bank passbook. Verification tags show these are Official Government and Trusted Institution documents. If missing, verify status in Section I.",
    retrievedChunks: [
      "AP School Education Dept guidelines, Page 4, Clause 1.1 - Documentation prerequisites."
    ],
    latency: 185,
    timestamp: "2026-06-26T11:42:05Z",
    feedback: "NOT_HELPFUL"
  }
];

const getDB = () => {
  const data = localStorage.getItem("sarathi_rag_analytics_db");
  if (!data) {
    localStorage.setItem("sarathi_rag_analytics_db", JSON.stringify(DEFAULT_RAG_LOGS));
    return DEFAULT_RAG_LOGS;
  }
  return JSON.parse(data);
};

const saveDB = (logs) => {
  localStorage.setItem("sarathi_rag_analytics_db", JSON.stringify(logs));
};

export const aiTrustService = {
  getLogs: () => {
    return getDB();
  },

  logQuery: (question, answer, retrievedChunks = [], latency = 200) => {
    const db = getDB();
    const newLog = {
      id: "rag-" + Date.now(),
      question,
      answer,
      retrievedChunks,
      latency,
      timestamp: new Date().toISOString(),
      feedback: "PENDING"
    };
    db.unshift(newLog); // Put newest first
    saveDB(db);
    return newLog;
  },

  logFeedback: (logId, isHelpful) => {
    const db = getDB();
    const updated = db.map(log => {
      if (log.id === logId) {
        return { ...log, feedback: isHelpful ? "HELPFUL" : "NOT_HELPFUL" };
      }
      return log;
    });
    saveDB(updated);
    return updated;
  },

  exportEvaluationDataset: () => {
    const db = getDB();
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(db, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "sarathi_rag_benchmark_dataset.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};
