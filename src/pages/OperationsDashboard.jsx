import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { operationsService } from "../services/operationsService";
import { C } from "../theme";

export default function OperationsDashboard() {
  const { user, addNotification } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [hubs, setHubs] = useState([]);

  const loadData = () => {
    setVolunteers(operationsService.getVolunteers());
    setHubs(operationsService.getHubs());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleAvailability = (volunteerId, newAvailability) => {
    const list = volunteers.map(v => {
      if (v.id === volunteerId) {
        return { ...v, availability: newAvailability };
      }
      return v;
    });
    setVolunteers(list);
    operationsService.saveVolunteers(list);
    addNotification(`Availability for volunteer updated to ${newAvailability}!`, "success");
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
          ⚙️ Field Operations & Hub Management
        </h2>
        <p style={{ margin: "4px 0 0 0", fontSize: 13, color: C.textMuted }}>
          Logged in as: {user?.name} ({user?.role}). Manage district hubs, volunteer profiles, and toggle availability bounds.
        </p>
      </div>

      {/* Hubs Grid */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 15, fontWeight: 800, color: C.white }}>
          🏢 Active State & District Hubs
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16
        }}>
          {hubs.map((hub) => {
            const volCount = volunteers.filter(v => v.hub === hub.name).length;
            const cases = JSON.parse(localStorage.getItem("sarathi_cases_db") || "[]");
            const loadCount = cases.filter(c => c.district.toLowerCase() === hub.district.toLowerCase() && c.status === "PENDING").length;

            let badgeColor = "#60a5fa"; // blue
            if (hub.type === "CENTRAL") badgeColor = "#f59e0b"; // gold

            return (
              <div key={hub.id} style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: 20,
                position: "relative"
              }}>
                <span style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  padding: "2px 8px",
                  borderRadius: 10,
                  border: `1px solid ${badgeColor}`,
                  color: badgeColor,
                  fontSize: 8,
                  fontWeight: 800
                }}>
                  {hub.type}
                </span>

                <h4 style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 800, color: C.white }}>
                  {hub.name}
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: C.textMuted }}>
                  <div>📍 District coverage: <strong style={{ color: C.text }}>{hub.district}</strong></div>
                  <div>👥 Connected volunteers: <strong style={{ color: C.accent }}>{volCount} operators</strong></div>
                  <div>⏳ Unassigned case queue: <strong style={{ color: loadCount > 0 ? C.red : C.green }}>{loadCount} files pending</strong></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Volunteer Directory Table */}
      <div style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 24
      }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 800, color: C.white }}>
          🤝 Last-Mile Field Volunteers Directory
        </h3>
        <p style={{ margin: "0 0 20px 0", fontSize: 12, color: C.textMuted }}>
          Update availability parameters to toggle volunteer routing rules inside the Auto-Assignment engine.
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
                <th style={{ padding: 14, fontSize: 11, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Contact Details</th>
                <th style={{ padding: 14, fontSize: 11, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Assigned Hub</th>
                <th style={{ padding: 14, fontSize: 11, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Coverage District</th>
                <th style={{ padding: 14, fontSize: 11, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Active Cases Load</th>
                <th style={{ padding: 14, fontSize: 11, color: C.textLabel, textTransform: "uppercase", fontWeight: 700, textAlign: "right" }}>Availability State</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v) => {
                let loadColor = C.green;
                if (v.activeCases >= 2) loadColor = C.red;
                else if (v.activeCases === 1) loadColor = C.accent;

                return (
                  <tr key={v.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: 14, fontSize: 13, color: C.white, fontWeight: 600 }}>{v.name}</td>
                    <td style={{ padding: 14, fontSize: 13, color: C.textMuted }}>{v.contact}</td>
                    <td style={{ padding: 14, fontSize: 13, color: C.text }}>{v.hub}</td>
                    <td style={{ padding: 14, fontSize: 13, color: C.accent, fontWeight: 600 }}>{v.district}</td>
                    <td style={{ padding: 14 }}>
                      <strong style={{ color: loadColor, fontSize: 14 }}>{v.activeCases}</strong>
                      <span style={{ fontSize: 11, color: C.textMuted }}> cases</span>
                    </td>
                    <td style={{ padding: 14, textAlign: "right" }}>
                      <select
                        value={v.availability}
                        onChange={(e) => handleToggleAvailability(v.id, e.target.value)}
                        style={{
                          background: C.bgInput,
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          color: C.text,
                          padding: "6px 12px",
                          fontSize: 12,
                          outline: "none"
                        }}
                      >
                        <option value="AVAILABLE">🟢 AVAILABLE</option>
                        <option value="BUSY">🔴 BUSY</option>
                        <option value="ON_LEAVE">⚪ ON LEAVE</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
