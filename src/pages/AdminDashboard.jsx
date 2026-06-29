import { useState, useEffect } from "react";
import { useAuth, getUsersDB, saveUsersDB } from "../context/AuthContext";
import { aiTrustService } from "../services/aiTrustService";
import { C } from "../theme";

export default function AdminDashboard() {
  const { user, addNotification } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [tempRole, setTempRole] = useState("");
  
  // RAG Telemetry State
  const [ragLogs, setRagLogs] = useState([]);
  const [expandedLogId, setExpandedLogId] = useState(null);

  const [kpis, setKpis] = useState({
    citizens: 142,
    volunteers: 18,
    hubs: 6,
    health: "99.8%"
  });

  const loadData = () => {
    setUsers(getUsersDB());
    setRagLogs(aiTrustService.getLogs());
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update a user's role
  const handleRoleChange = (userId, newRole) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    });
    setUsers(updated);
    saveUsersDB(updated);
    
    if (user && user.id === userId) {
      addNotification("You updated your own role. Refresh or re-log to apply permissions.", "warning");
    } else {
      addNotification("User role updated successfully!", "success");
    }
    setEditingUserId(null);
  };

  // Export benchmark data
  const handleExportDataset = () => {
    aiTrustService.exportEvaluationDataset();
    addNotification("JSON evaluation dataset benchmark exported!", "success");
  };

  return (
    <div style={{ padding: "8px 0", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Top Welcome Widget */}
      <div style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 24
      }}>
        <h2 style={{ margin: 0, fontSize: 20, color: C.accent, fontWeight: 800 }}>
          ⚙️ Admin Console Dashboard
        </h2>
        <p style={{ margin: "4px 0 0 0", fontSize: 13, color: C.textMuted }}>
          Welcome back, {user?.name}. You hold complete administrative clearance across all hub routes, system roles, and cases.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16
      }}>
        {[
          { title: "Audited Citizens", value: kpis.citizens, icon: "👥", change: "+12 this week" },
          { title: "Active Volunteers", value: kpis.volunteers, icon: "🤝", change: "4 regions covered" },
          { title: "Integrated Hubs", value: kpis.hubs, icon: "🏢", change: "2 State, 4 District" },
          { title: "System Gateway Health", value: kpis.health, icon: "⚡", change: "Latency < 45ms" }
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
              <div style={{ fontSize: 10, color: C.green }}>
                {kpi.change}
              </div>
            </div>
            <div style={{ fontSize: 28 }}>{kpi.icon}</div>
          </div>
        ))}
      </div>

      {/* Split Roster and RAG Analytics Panels */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        
        {/* RAG Analytics and Trust Telemetry logs (55% width) */}
        <div style={{
          flex: "1.2 1 450px",
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 24
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, paddingBottom: 12, marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.white }}>
                🤖 RAG Observability & AI Trust Logs
              </h3>
              <p style={{ margin: "4px 0 0 0", fontSize: 11, color: C.textMuted }}>
                Observability logs tracking retrieved context chunks, response latencies, and user feedbacks.
              </p>
            </div>
            <button
              onClick={handleExportDataset}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: "transparent",
                border: `1px solid ${C.accent}`,
                color: C.accent,
                fontWeight: 700,
                fontSize: 11,
                cursor: "pointer",
                transition: "all 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.accentDim}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              📥 Export Dataset
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ragLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              let feedColor = C.textMuted;
              if (log.feedback === "HELPFUL") feedColor = C.green;
              else if (log.feedback === "NOT_HELPFUL") feedColor = C.red;

              return (
                <div key={log.id} style={{
                  background: C.bgInput,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: 16
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <strong style={{ fontSize: 13, color: C.white }}>Q: "{log.question}"</strong>
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${feedColor}`,
                      color: feedColor,
                      fontSize: 8,
                      fontWeight: 800
                    }}>
                      {log.feedback}
                    </span>
                  </div>

                  <p style={{ margin: "0 0 10px 0", fontSize: 12, color: C.text, lineHeight: 1.4 }}>
                    <strong>A:</strong> {log.answer}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: C.textMuted, borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: 8 }}>
                    <div>Latency: <strong style={{ color: C.accent }}>{log.latency}ms</strong> · Logged: {log.timestamp.split("T")[0]}</div>
                    <button
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: C.accent,
                        cursor: "pointer",
                        fontSize: 10,
                        fontWeight: 700
                      }}
                    >
                      {isExpanded ? "Collapse Chunks ▲" : "View Citations ▼"}
                    </button>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: 10, padding: 10, background: "rgba(0,0,0,0.2)", borderRadius: 6 }}>
                      <span style={{ fontSize: 8, color: C.textLabel, textTransform: "uppercase", fontWeight: 800, display: "block", marginBottom: 6 }}>
                        Retrieved Context Guidelines Chunks
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {(log.retrievedChunks || []).map((chunk, cIdx) => (
                          <div key={cIdx} style={{ fontSize: 10, color: C.textMuted, lineHeight: 1.3 }}>
                            📚 {chunk}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Identity access control roster (45% width) */}
        <div style={{
          flex: "1 1 350px",
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 24,
          alignSelf: "flex-start"
        }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 800, color: C.white }}>
            👥 Identity & Access Control Roster
          </h3>
          <p style={{ margin: "0 0 20px 0", fontSize: 12, color: C.textMuted }}>
            The active roster of registered system operators. Modify roles below to test dynamic route clearance changes.
          </p>

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
                  <th style={{ padding: 14, fontSize: 11, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Name</th>
                  <th style={{ padding: 14, fontSize: 11, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Role</th>
                  <th style={{ padding: 14, fontSize: 11, color: C.textLabel, textTransform: "uppercase", fontWeight: 700, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isEditing = editingUserId === u.id;
                  const isCurrentUser = user && user.id === u.id;

                  let roleColor = C.accent;
                  if (u.role === "ADMIN") roleColor = "#f59e0b";
                  else if (u.role === "VOLUNTEER") roleColor = C.green;
                  else if (u.role === "CITIZEN") roleColor = C.textLabel;
                  else if (u.role === "CENTRAL_HUB") roleColor = "#60a5fa";
                  else if (u.role === "LOCAL_HUB") roleColor = "#c084fc";

                  return (
                    <tr key={u.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: 14, fontSize: 13, color: C.white, fontWeight: 600 }}>
                        {u.name} {isCurrentUser && <span style={{ color: C.textMuted, fontWeight: 400, fontSize: 11 }}>(You)</span>}
                        <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 400, marginTop: 2 }}>{u.email}</div>
                      </td>
                      <td style={{ padding: 14 }}>
                        {isEditing ? (
                          <select
                            value={tempRole}
                            onChange={(e) => setTempRole(e.target.value)}
                            style={{
                              background: C.bgInput,
                              border: `1px solid ${C.accent}`,
                              borderRadius: 6,
                              color: C.text,
                              padding: "4px 8px",
                              fontSize: 12,
                              outline: "none"
                            }}
                          >
                            {["ADMIN", "CENTRAL_HUB", "LOCAL_HUB", "VOLUNTEER", "CITIZEN"].map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        ) : (
                          <span style={{
                            padding: "2px 8px",
                            borderRadius: 12,
                            background: `rgba(255,255,255,0.05)`,
                            border: `1px solid ${roleColor}`,
                            color: roleColor,
                            fontSize: 10,
                            fontWeight: 800,
                            display: "inline-block"
                          }}>
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: 14, textAlign: "right" }}>
                        {isEditing ? (
                          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                            <button
                              onClick={() => handleRoleChange(u.id, tempRole)}
                              style={{
                                padding: "4px 10px",
                                borderRadius: 4,
                                background: C.green,
                                border: "none",
                                color: C.bg,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: "pointer"
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              style={{
                                padding: "4px 10px",
                                borderRadius: 4,
                                background: "transparent",
                                border: `1px solid ${C.border}`,
                                color: C.textMuted,
                                fontSize: 11,
                                cursor: "pointer"
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingUserId(u.id);
                              setTempRole(u.role);
                            }}
                            style={{
                              padding: "4px 12px",
                              borderRadius: 4,
                              background: "transparent",
                              border: `1px solid ${C.border}`,
                              color: C.accent,
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer"
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
