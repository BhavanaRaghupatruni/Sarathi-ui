import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { operationsService } from "../services/operationsService";
import { C, inputStyle, labelStyle } from "../theme";

export default function CasesDashboard() {
  const { user, addNotification } = useAuth();
  const [cases, setCases] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);

  // Assignment states
  const [selectedVolId, setSelectedVolId] = useState("");
  
  // Note and Attachment logging states
  const [noteText, setNoteText] = useState("");
  const [docName, setDocName] = useState("Ration Card");
  const [trustLevel, setTrustLevel] = useState("Official Government");

  const loadData = () => {
    const parsedCases = JSON.parse(localStorage.getItem("sarathi_cases_db") || "[]");
    setCases(parsedCases);
    setVolunteers(operationsService.getVolunteers());

    // Sync selected case details view if it is open
    if (selectedCase) {
      const freshCase = parsedCases.find(c => c.id === selectedCase.id);
      setSelectedCase(freshCase || null);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateStatus = (caseId, newStatus) => {
    operationsService.updateCaseStatus(caseId, newStatus, user?.name || "Hub Operator");
    addNotification(`Case status updated to ${newStatus}`, "success");
    loadData();
  };

  const handleAutoAssign = (caseId) => {
    const result = operationsService.runAssignmentEngine(caseId);
    if (result.success) {
      addNotification(`Auto-assigned case to volunteer ${result.volunteer.name} based on matching district.`, "success");
      loadData();
    } else {
      addNotification(result.error || "Failed to auto-assign case.", "error");
    }
  };

  const handleManualAssign = (caseId) => {
    if (!selectedVolId) {
      addNotification("Please select a volunteer from the list.", "warning");
      return;
    }
    const result = operationsService.assignCase(caseId, selectedVolId);
    if (result.success) {
      addNotification(`Successfully assigned case to volunteer ${result.volunteer.name}.`, "success");
      setSelectedVolId("");
      loadData();
    } else {
      addNotification(result.error || "Failed to assign case.", "error");
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!selectedCase || !noteText.trim()) return;

    operationsService.addCaseNote(selectedCase.id, noteText, user?.name || "Hub Operator");
    addNotification("Case audit note added successfully!", "success");
    setNoteText("");
    loadData();
  };

  const handleAttachDocument = (e) => {
    e.preventDefault();
    if (!selectedCase) return;

    operationsService.attachCaseDocument(selectedCase.id, docName, trustLevel, user?.name || "Hub Operator");
    addNotification(`Attached document: "${docName}" verified as "${trustLevel}"!`, "success");
    loadData();
  };

  const filteredCases = cases.filter(c => {
    const matchesStatus = filterStatus === "ALL" || c.status === filterStatus;
    const matchesQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (c.scheme || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const getMatchingVolunteers = (district) => {
    return volunteers.filter(v => v.district.toLowerCase() === (district || "").toLowerCase());
  };

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Welcome Panel */}
      <div style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 24
      }}>
        <h2 style={{ margin: 0, fontSize: 20, color: C.accent, fontWeight: 800 }}>
          📁 Case Management Systems Dashboard
        </h2>
        <p style={{ margin: "4px 0 0 0", fontSize: 13, color: C.textMuted }}>
          Logged in as: {user?.name} ({user?.role}). Manage submitted welfare case files, verify documentation gaps, and sign off resolutions.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 28
      }}>
        {[
          { title: "Total Cases Received", value: cases.length, icon: "📁", color: C.white },
          { title: "New Cases (OPEN)", value: cases.filter(c => c.status === "OPEN").length, icon: "⏳", color: C.red },
          { title: "In Progress Reviews", value: cases.filter(c => c.status === "ASSIGNED" || c.status === "IN_PROGRESS").length, icon: "⚡", color: C.accent },
          { title: "Resolved Cases", value: cases.filter(c => c.status === "RESOLVED").length, icon: "✅", color: C.green }
        ].map((kpi, idx) => (
          <div key={idx} style={{
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div>
              <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                {kpi.title}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.white, margin: "4px 0" }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: 10, color: kpi.color, fontWeight: 600 }}>
                Operations Telemetry
              </div>
            </div>
            <div style={{ fontSize: 28 }}>{kpi.icon}</div>
          </div>
        ))}
      </div>

      {/* Split pane for case roster and detailed panel */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        
        {/* Left Side: Cases Directory Table (55% width) */}
        <div style={{
          flex: "2 1 450px",
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 24
        }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: 15, fontWeight: 800, color: C.white }}>
            📋 Beneficiary Cases Audit list
          </h3>

          {/* Search/Filter Roster */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Search by name, case ID, scheme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                minWidth: 200,
                background: C.bgInput,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "8px 12px",
                color: C.text,
                fontSize: 13,
                outline: "none"
              }}
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                background: C.bgInput,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                color: C.text,
                padding: "8px 16px",
                fontSize: 13,
                outline: "none"
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              background: C.bgTable,
              borderRadius: 8,
              overflow: "hidden"
            }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}`, textAlign: "left" }}>
                  <th style={{ padding: 14, fontSize: 11, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Case ID</th>
                  <th style={{ padding: 14, fontSize: 11, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Citizen</th>
                  <th style={{ padding: 14, fontSize: 11, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>District</th>
                  <th style={{ padding: 14, fontSize: 11, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Scheme</th>
                  <th style={{ padding: 14, fontSize: 11, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Status</th>
                  <th style={{ padding: 14, fontSize: 11, color: C.textLabel, textTransform: "uppercase", fontWeight: 700, textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((c) => {
                  let statusColor = C.accent;
                  if (c.status === "RESOLVED") statusColor = C.green;
                  else if (c.status === "OPEN") statusColor = C.red;

                  return (
                    <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: 14, fontSize: 12, color: C.accent, fontWeight: 700 }}>{c.id.toUpperCase()}</td>
                      <td style={{ padding: 14, fontSize: 13, color: C.white, fontWeight: 600 }}>{c.name}</td>
                      <td style={{ padding: 14, fontSize: 13, color: C.textMuted }}>{c.district}</td>
                      <td style={{ padding: 14, fontSize: 13, color: C.text }}>{c.scheme}</td>
                      <td style={{ padding: 14 }}>
                        <span style={{
                          padding: "2px 8px",
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.03)",
                          border: `1px solid ${statusColor}`,
                          color: statusColor,
                          fontSize: 9,
                          fontWeight: 800,
                          display: "inline-block"
                        }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: 14, textAlign: "right" }}>
                        <button
                          onClick={() => setSelectedCase(c)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: 4,
                            background: "transparent",
                            border: `1px solid ${C.border}`,
                            color: C.accent,
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = C.accent;
                            e.currentTarget.style.background = C.accentDim;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = C.border;
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          Audit File
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Detailed Audit pane (45% width) */}
        <div style={{
          flex: "1.2 1 350px",
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 24,
          alignSelf: "flex-start",
          display: "flex",
          flexDirection: "column",
          gap: 20
        }}>
          <h3 style={{ margin: "0 0 4px 0", fontSize: 16, fontWeight: 800, color: C.white }}>
            🔍 Case Auditing & Verification Workspace
          </h3>

          {selectedCase ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              
              {/* Case Stats Block */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.accent }}>{selectedCase.name}</span>
                  <span style={{
                    padding: "2px 8px",
                    borderRadius: 12,
                    border: `1px solid ${selectedCase.status === "RESOLVED" ? C.green : C.accent}`,
                    color: selectedCase.status === "RESOLVED" ? C.green : C.accent,
                    fontSize: 9,
                    fontWeight: 800
                  }}>{selectedCase.status}</span>
                </div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>
                  Case ID: <strong>{selectedCase.id.toUpperCase()}</strong> · Phone: {selectedCase.phone}
                </div>
                <div style={{ fontSize: 12, color: C.textLabel, marginTop: 4 }}>
                  Scheme: <strong>{selectedCase.scheme}</strong> · Location: <strong>{selectedCase.district}</strong>
                </div>
              </div>

              {/* Status transition controls */}
              <div style={{ padding: 12, background: C.bgInput, borderRadius: 8, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 10, color: C.accent, fontWeight: 700, display: "block", marginBottom: 6 }}>
                  ⚙️ Case Status Workflow
                </span>
                
                {selectedCase.status === "OPEN" && (
                  <div style={{ fontSize: 12, color: C.textMuted }}>
                    File is currently open. Please assign a volunteer below to initiate audits.
                  </div>
                )}

                {selectedCase.status === "ASSIGNED" && (
                  <div>
                    <p style={{ margin: "0 0 8px 0", fontSize: 11, color: C.textMuted }}>
                      Volunteer assigned. Transition status to start active document reviews:
                    </p>
                    <button
                      onClick={() => handleUpdateStatus(selectedCase.id, "IN_PROGRESS")}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: 6,
                        background: C.accent,
                        border: "none",
                        color: C.bg,
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: "pointer"
                      }}
                    >
                      Commence Review (IN_PROGRESS)
                    </button>
                  </div>
                )}

                {selectedCase.status === "IN_PROGRESS" && (
                  <div>
                    <p style={{ margin: "0 0 8px 0", fontSize: 11, color: C.textMuted }}>
                      Audits in progress. Transition status to resolve files upon successful checks:
                    </p>
                    <button
                      onClick={() => handleUpdateStatus(selectedCase.id, "RESOLVED")}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: 6,
                        background: C.green,
                        border: "none",
                        color: C.bg,
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: "pointer"
                      }}
                    >
                      Verify & Resolve Case (RESOLVED)
                    </button>
                  </div>
                )}

                {selectedCase.status === "RESOLVED" && (
                  <div style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>
                    ✓ Case resolved. Verification complete.
                  </div>
                )}
              </div>

              {/* Volunteer Assignment block */}
              {!selectedCase.volunteerId && (
                <div style={{ padding: 12, background: C.bgInput, borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 10, color: C.accent, fontWeight: 700, display: "block", marginBottom: 6 }}>
                    🤝 Volunteer Field Assignment
                  </span>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <select
                        value={selectedVolId}
                        onChange={(e) => setSelectedVolId(e.target.value)}
                        style={{
                          flex: 1,
                          background: C.bgCard,
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          color: C.text,
                          padding: "6px 10px",
                          fontSize: 11,
                          outline: "none"
                        }}
                      >
                        <option value="">Choose Volunteer...</option>
                        {getMatchingVolunteers(selectedCase.district).map(v => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.availability})
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleManualAssign(selectedCase.id)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 6,
                          background: C.accent,
                          border: "none",
                          color: C.bg,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        Assign
                      </button>
                    </div>

                    <button
                      onClick={() => handleAutoAssign(selectedCase.id)}
                      style={{
                        width: "100%",
                        padding: "6px",
                        borderRadius: 6,
                        background: "transparent",
                        border: `1px solid ${C.accent}`,
                        color: C.accent,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.15s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = C.accentDim}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      ⚡ Auto-Assign Best Match
                    </button>
                  </div>
                </div>
              )}

              {/* Log Timeline Note & Attachments */}
              {selectedCase.status !== "RESOLVED" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 12, background: C.bgInput, borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 10, color: C.accent, fontWeight: 700 }}>
                    ✍️ Log Case Action Activity
                  </span>

                  {/* Note logging form */}
                  <form onSubmit={handleAddNote} style={{ display: "flex", gap: 6 }}>
                    <input
                      type="text"
                      placeholder="Add case audit note..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      style={{
                        flex: 1,
                        background: C.bgCard,
                        border: `1px solid ${C.border}`,
                        borderRadius: 6,
                        padding: "6px 10px",
                        color: C.text,
                        fontSize: 11,
                        outline: "none"
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        background: C.accent,
                        border: "none",
                        color: C.bg,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      Note
                    </button>
                  </form>

                  {/* Document Attachment Simulation form */}
                  <form onSubmit={handleAttachDocument} style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 8 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      <div>
                        <span style={{ fontSize: 8, color: C.textMuted }}>Document Copy</span>
                        <select
                          value={docName}
                          onChange={(e) => setDocName(e.target.value)}
                          style={{
                            background: C.bgCard,
                            border: `1px solid ${C.border}`,
                            borderRadius: 6,
                            color: C.text,
                            padding: "4px 6px",
                            fontSize: 10,
                            width: "100%",
                            outline: "none"
                          }}
                        >
                          <option value="Aadhaar Physical Card">Aadhaar Card</option>
                          <option value="Ration Card Copy">Ration Card</option>
                          <option value="Income Certificate File">Income Certificate</option>
                          <option value="Disability Certificate Copy">Disability Certificate</option>
                          <option value="Land Revenue Records">Land Records</option>
                        </select>
                      </div>

                      <div>
                        <span style={{ fontSize: 8, color: C.textMuted }}>Trust Level</span>
                        <select
                          value={trustLevel}
                          onChange={(e) => setTrustLevel(e.target.value)}
                          style={{
                            background: C.bgCard,
                            border: `1px solid ${C.border}`,
                            borderRadius: 6,
                            color: C.text,
                            padding: "4px 6px",
                            fontSize: 10,
                            width: "100%",
                            outline: "none"
                          }}
                        >
                          <option value="Official Government">Official Gov</option>
                          <option value="Trusted Institution">Trusted Inst</option>
                          <option value="NGO Verified">NGO Verified</option>
                          <option value="Community Source">Community Src</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{
                        padding: "6px",
                        borderRadius: 6,
                        background: C.accentDim,
                        border: `1px solid ${C.accent}`,
                        color: C.accent,
                        fontSize: 10,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      📎 Attach Verified Document
                    </button>
                  </form>
                </div>
              )}

              {/* Case Action Timeline Listing */}
              <div>
                <span style={{ fontSize: 10, color: C.textLabel, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 10 }}>
                  ⏳ Case Audit History Timeline
                </span>
                
                <div style={{
                  position: "relative",
                  paddingLeft: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  maxHeight: 250,
                  overflowY: "auto"
                }}>
                  {/* Vertical Connector */}
                  <div style={{
                    position: "absolute",
                    left: 6,
                    top: 4,
                    bottom: 4,
                    width: 2,
                    background: C.border
                  }} />

                  {(selectedCase.timeline || []).map((evt) => {
                    let dotColor = C.border;
                    if (evt.type === "STATUS_CHANGE") {
                      dotColor = evt.title.includes("Resolved") || evt.title.includes("RESOLVED") ? C.green : C.accent;
                    } else if (evt.type === "NOTE") {
                      dotColor = "#60a5fa";
                    } else if (evt.type === "ATTACHMENT") {
                      dotColor = "#c084fc";
                    }

                    return (
                      <div key={evt.id} style={{ position: "relative" }}>
                        <span style={{
                          position: "absolute",
                          left: -20,
                          top: 2,
                          transform: "translateX(-45%)",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: dotColor,
                          zIndex: 2
                        }} />

                        <div style={{ fontSize: 11, color: C.textLabel, fontWeight: 700 }}>
                          {evt.date} · <span style={{ color: dotColor }}>{evt.title}</span>
                        </div>
                        <p style={{ margin: "2px 0", fontSize: 11, color: C.text, lineHeight: 1.3 }}>
                          {evt.description}
                        </p>
                        <div style={{ fontSize: 9, color: C.textMuted }}>
                          Logged by: <em>{evt.operator}</em>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setSelectedCase(null)}
                style={{
                  padding: "8px",
                  borderRadius: 6,
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  color: C.textMuted,
                  fontSize: 11,
                  cursor: "pointer"
                }}
              >
                Close Audit View
              </button>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "48px 0", color: C.textMuted, fontSize: 12 }}>
              Select a citizen case from the auditing roster to perform verification actions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
