import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { operationsService } from "../services/operationsService";
import { C } from "../theme";

export default function VolunteerDashboard() {
  const { user, addNotification } = useAuth();
  const navigate = useNavigate();

  // Workload state
  const [volunteer, setVolunteer] = useState(null);
  const [assignedCases, setAssignedCases] = useState([]);
  const [visits, setVisits] = useState([]);
  const [tasks, setTasks] = useState([]);

  const loadData = () => {
    // 1. Identify active volunteer profile
    const volunteers = JSON.parse(localStorage.getItem("sarathi_volunteers_db") || "[]");
    const matched = volunteers.find(v => 
      v.name.toLowerCase().includes(user?.name?.replace(" (Volunteer)", "").toLowerCase()) ||
      v.contact === "9900112233" // fallback default Srinivas Raju
    ) || volunteers[0];
    
    setVolunteer(matched);

    if (matched) {
      // 2. Fetch assigned cases
      const cases = JSON.parse(localStorage.getItem("sarathi_cases_db") || "[]");
      const assigned = cases.filter(c => c.volunteerId === matched.id);
      setAssignedCases(assigned);

      // 3. Fetch visits and tasks checklist
      const work = operationsService.getVolunteerWork(matched.id);
      setVisits(work.visits);
      setTasks(work.tasks);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Complete field visit log
  const handleCompleteVisit = (visitId, citizenName) => {
    operationsService.completeVisit(visitId);
    addNotification(`Field visit for ${citizenName} logged as COMPLETED.`, "success");
    loadData();
  };

  // Complete checklist task
  const handleCompleteTask = (taskId, desc) => {
    operationsService.completeTask(taskId);
    addNotification(`Task checked off: "${desc}"`, "success");
    loadData();
  };

  const handleStartSurvey = () => {
    navigate("/survey");
  };

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Welcome Panel */}
      <div style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, color: C.accent, fontWeight: 800 }}>
            🤝 Volunteer Field Operations
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, color: C.textMuted }}>
            Welcome, {volunteer?.name || user?.name}. Active Hub: <strong>{volunteer?.hub || "Anantapur Hub"}</strong> · Target District: <strong>{volunteer?.district || "Anantapur"}</strong>
          </p>
        </div>
        <button
          onClick={handleStartSurvey}
          style={{
            padding: "12px 24px",
            borderRadius: 8,
            border: "none",
            background: `linear-gradient(135deg, ${C.accent}, #f59e0b)`,
            color: C.bg,
            fontSize: 13,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(251,191,36,0.3)",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          📝 Start Household Survey Wizard
        </button>
      </div>

      {/* Field Work KPIs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 16,
        marginBottom: 28
      }}>
        {[
          { title: "Assigned Cases", value: assignedCases.length, icon: "📁", color: C.accent },
          { title: "Upcoming Visits", value: visits.filter(v => v.status === "SCHEDULED").length, icon: "📅", color: C.green },
          { title: "Follow-up Tasks Pending", value: tasks.filter(t => t.status === "PENDING").length, icon: "✅", color: C.red },
          { title: "Availability Status", value: volunteer?.availability || "AVAILABLE", icon: "🟢", color: C.green }
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
              <div style={{ fontSize: 22, fontWeight: 800, color: C.white, margin: "4px 0" }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: 10, color: kpi.color, fontWeight: 600 }}>
                Field Ops Parameter
              </div>
            </div>
            <div style={{ fontSize: 28 }}>{kpi.icon}</div>
          </div>
        ))}
      </div>

      {/* Split Grid for Tasks, Visits, and Cases */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 28 }}>
        
        {/* Left Column: Visits and Tasks (60% width) */}
        <div style={{ flex: "2 1 500px", display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Upcoming Field Visits Section */}
          <div style={{
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 24
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 15, fontWeight: 800, color: C.white, display: "flex", alignItems: "center", gap: 8 }}>
              📅 Upcoming Field Verification Visits
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {visits.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: C.textMuted, fontSize: 12 }}>
                  No scheduled field visits mapped to your profile.
                </div>
              ) : (
                visits.map((v) => {
                  const isScheduled = v.status === "SCHEDULED";
                  return (
                    <div key={v.id} style={{
                      padding: 16,
                      background: C.bgInput,
                      border: `1px solid ${isScheduled ? C.border : "rgba(52,211,153,0.3)"}`,
                      borderRadius: 10,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div>
                        <div style={{ fontSize: 13, color: C.white, fontWeight: 700 }}>{v.citizenName}</div>
                        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                          Date: <strong style={{ color: C.accent }}>{v.date}</strong> · {v.purpose}
                        </div>
                      </div>

                      {isScheduled ? (
                        <button
                          onClick={() => handleCompleteVisit(v.id, v.citizenName)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 6,
                            background: C.green,
                            border: "none",
                            color: C.bg,
                            fontWeight: 800,
                            fontSize: 11,
                            cursor: "pointer"
                          }}
                        >
                          Mark Completed
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>✓ COMPLETED</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Checklist Section */}
          <div style={{
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: 24
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 15, fontWeight: 800, color: C.white, display: "flex", alignItems: "center", gap: 8 }}>
              ✅ Last-Mile Document Checklist
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {tasks.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: C.textMuted, fontSize: 12 }}>
                  No pending action tasks assigned.
                </div>
              ) : (
                tasks.map((t) => {
                  const isPending = t.status === "PENDING";
                  return (
                    <div key={t.id} style={{
                      padding: 16,
                      background: C.bgInput,
                      border: `1px solid ${isPending ? C.border : "rgba(255,255,255,0.05)"}`,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <input
                          type="checkbox"
                          checked={!isPending}
                          disabled={!isPending}
                          onChange={() => handleCompleteTask(t.id, t.description)}
                          style={{
                            width: 18,
                            height: 18,
                            cursor: isPending ? "pointer" : "default",
                            accentColor: C.green
                          }}
                        />
                        <span style={{
                          fontSize: 13,
                          color: isPending ? C.text : C.textMuted,
                          textDecoration: isPending ? "none" : "line-through"
                        }}>
                          {t.description}
                        </span>
                      </div>
                      
                      <span style={{
                        fontSize: 9,
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: 12,
                        background: isPending ? "rgba(248,113,113,0.1)" : "rgba(52,211,153,0.1)",
                        border: `1px solid ${isPending ? C.red : C.green}`,
                        color: isPending ? C.red : C.green
                      }}>
                        {t.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Assigned Cases list (40% width) */}
        <div style={{
          flex: "1 1 320px",
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 24,
          alignSelf: "flex-start"
        }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: 15, fontWeight: 800, color: C.white }}>
            📁 Assigned Household Cases
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {assignedCases.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted, fontSize: 12 }}>
                No active beneficiary files assigned to you. Hub assignments will display here dynamically.
              </div>
            ) : (
              assignedCases.map((c) => {
                let col = C.accent;
                if (c.status === "APPROVED") col = C.green;
                else if (c.status === "REJECTED") col = C.red;

                return (
                  <div key={c.id} style={{
                    padding: 14,
                    background: C.bgInput,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: 13, color: C.white }}>{c.name}</strong>
                      <span style={{
                        padding: "1px 6px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.02)",
                        border: `1px solid ${col}`,
                        color: col,
                        fontSize: 8,
                        fontWeight: 800
                      }}>
                        {c.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                      Case Ref: {c.id.toUpperCase()} · District: {c.district}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
