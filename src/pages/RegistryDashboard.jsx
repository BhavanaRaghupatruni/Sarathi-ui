import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { crmService } from "../services/crmService";
import { C, inputStyle, labelStyle } from "../theme";

export default function RegistryDashboard() {
  const { user, addNotification } = useAuth();
  const navigate = useNavigate();

  // CRM State
  const [citizens, setCitizens] = useState([]);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPoverty, setFilterPoverty] = useState("ALL");
  const [filterDistrict, setFilterDistrict] = useState("ALL");

  // Tabs inside detail view
  const [activeTab, setActiveTab] = useState("profile");

  // Edit Mode state for Household Profiles
  const [editMode, setEditMode] = useState(false);
  const [editIncome, setEditIncome] = useState("");
  const [editHousing, setEditHousing] = useState("");
  const [editLand, setEditLand] = useState("");
  const [editOccupation, setEditOccupation] = useState("");
  const [editPoverty, setEditPoverty] = useState("");

  // Timeline logging form state
  const [logType, setLogType] = useState("VOLUNTEER_VISIT");
  const [logTitle, setLogTitle] = useState("");
  const [logDesc, setLogDesc] = useState("");
  const [submittingLog, setSubmittingLog] = useState(false);

  // Load citizens from localStorage
  const loadRegistry = () => {
    const list = crmService.getCitizens();
    setCitizens(list);
    if (list.length > 0) {
      // Keep selection or default to first
      setSelectedCitizen(prev => {
        if (prev) {
          const fresh = list.find(c => c.id === prev.id);
          return fresh || list[0];
        }
        return list[0];
      });
    }
  };

  useEffect(() => {
    loadRegistry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync edit form fields when selection changes
  useEffect(() => {
    if (selectedCitizen) {
      setEditIncome(selectedCitizen.household.income);
      setEditHousing(selectedCitizen.household.housingStatus);
      setEditLand(selectedCitizen.household.landOwnership);
      setEditOccupation(selectedCitizen.household.occupation);
      setEditPoverty(selectedCitizen.household.povertyClassification);
      setEditMode(false); // Reset edit state
    }
  }, [selectedCitizen]);

  // Handle saving household profile edits
  const handleSaveHousehold = (e) => {
    e.preventDefault();
    if (!selectedCitizen) return;

    const updated = {
      ...selectedCitizen,
      household: {
        income: Number(editIncome),
        housingStatus: editHousing,
        landOwnership: editLand,
        occupation: editOccupation,
        povertyClassification: editPoverty
      }
    };

    crmService.saveCitizen(updated);
    addNotification("Household profile updated successfully!", "success");
    setEditMode(false);
    loadRegistry();
  };

  // Handle logging new timeline event
  const handleLogTimeline = (e) => {
    e.preventDefault();
    if (!selectedCitizen || !logTitle || !logDesc) {
      addNotification("Please fill out event title and description.", "error");
      return;
    }

    setSubmittingLog(true);

    const event = {
      type: logType,
      title: logTitle,
      description: logDesc,
      operator: `${user?.name || "Hub Operator"}`
    };

    crmService.addTimelineEvent(selectedCitizen.id, event);
    addNotification(`${logType.replace("_", " ")} logged successfully in history timeline!`, "success");
    
    // Clear log form
    setLogTitle("");
    setLogDesc("");
    setSubmittingLog(false);
    loadRegistry();
  };

  // Filters logic
  const filteredCitizens = citizens.filter(c => {
    const matchesStatus = filterPoverty === "ALL" || c.household.povertyClassification === filterPoverty;
    const matchesDistrict = filterDistrict === "ALL" || c.address.district === filterDistrict;
    
    const term = searchQuery.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(term) ||
                          c.phone.includes(term) ||
                          c.id.toLowerCase().includes(term) ||
                          c.address.village.toLowerCase().includes(term);

    return matchesStatus && matchesDistrict && matchesSearch;
  });

  // Extract unique districts for dropdown
  const uniqueDistricts = ["ALL", ...new Set(citizens.map(c => c.address.district).filter(Boolean))];

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Header Panel */}
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
            📇 Beneficiary CRM & Citizen Registry
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, color: C.textMuted }}>
            Audits, household classifications, family directories, and activity verification timelines.
          </p>
        </div>
        <button
          onClick={() => navigate("/survey")}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: `linear-gradient(135deg, ${C.accent}, #f59e0b)`,
            color: C.bg,
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
        >
          ➕ Register New Citizen
        </button>
      </div>

      {/* Main Split Grid */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        
        {/* LEFT COLUMN: Citizen List Search Roster (35% width desktop) */}
        <div style={{
          flex: "1 1 320px",
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          maxHeight: "calc(100vh - 180px)",
          overflowY: "auto"
        }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.white, borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
            👥 Beneficiary Roster ({filteredCitizens.length})
          </h3>

          {/* Search Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
              type="text"
              placeholder="Search by name, ID, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: C.bgInput,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "8px 12px",
                color: C.text,
                fontSize: 12,
                outline: "none"
              }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <span style={{ fontSize: 9, color: C.textLabel, fontWeight: 700, display: "block", marginBottom: 3 }}>Poverty</span>
                <select
                  value={filterPoverty}
                  onChange={(e) => setFilterPoverty(e.target.value)}
                  style={{
                    background: C.bgInput,
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    color: C.text,
                    padding: "6px 8px",
                    fontSize: 11,
                    width: "100%",
                    outline: "none"
                  }}
                >
                  <option value="ALL">All Groups</option>
                  <option value="APL">APL</option>
                  <option value="BPL">BPL</option>
                  <option value="Antyodaya">Antyodaya</option>
                </select>
              </div>

              <div>
                <span style={{ fontSize: 9, color: C.textLabel, fontWeight: 700, display: "block", marginBottom: 3 }}>District</span>
                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  style={{
                    background: C.bgInput,
                    border: `1px solid ${C.border}`,
                    borderRadius: 6,
                    color: C.text,
                    padding: "6px 8px",
                    fontSize: 11,
                    width: "100%",
                    outline: "none"
                  }}
                >
                  {uniqueDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* List Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredCitizens.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted, fontSize: 12 }}>
                No records match filter parameters.
              </div>
            ) : (
              filteredCitizens.map((c) => {
                const isActive = selectedCitizen && selectedCitizen.id === c.id;
                let povColor = C.green;
                if (c.household.povertyClassification === "APL") povColor = "#60a5fa"; // Blue
                else if (c.household.povertyClassification === "Antyodaya") povColor = C.red; // Red

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCitizen(c)}
                    style={{
                      padding: 14,
                      background: isActive ? "rgba(251,191,36,0.06)" : C.bgInput,
                      border: `1px solid ${isActive ? C.accent : C.border}`,
                      borderRadius: 10,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      boxShadow: isActive ? "0 4px 12px rgba(251,191,36,0.08)" : "none"
                    }}
                    onMouseEnter={e => {
                      if (!isActive) e.currentTarget.style.borderColor = C.borderHov;
                    }}
                    onMouseLeave={e => {
                      if (!isActive) e.currentTarget.style.borderColor = C.border;
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <strong style={{ fontSize: 13, color: isActive ? C.accent : C.white }}>
                        {c.name}
                      </strong>
                      <span style={{
                        padding: "1px 6px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${povColor}`,
                        color: povColor,
                        fontSize: 8,
                        fontWeight: 800
                      }}>
                        {c.household.povertyClassification}
                      </span>
                    </div>

                    <div style={{ fontSize: 11, color: C.textMuted, display: "flex", justifyContent: "space-between" }}>
                      <span>Ref ID: {c.id.toUpperCase()}</span>
                      <span>📍 {c.address.village}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Citizen Explorer Detail View (65% width desktop) */}
        <div style={{
          flex: "2 1 450px",
          background: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 24,
          minHeight: 480
        }}>
          {selectedCitizen ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              
              {/* Profile Card Header */}
              <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.white }}>
                      {selectedCitizen.name}
                    </h3>
                    <p style={{ margin: "4px 0 0 0", fontSize: 12, color: C.textMuted }}>
                      Phone: <strong>{selectedCitizen.phone}</strong> · Gender: <strong>{selectedCitizen.gender}</strong> · Age: <strong>{selectedCitizen.age} yrs</strong>
                    </p>
                  </div>
                  
                  {/* Address Badge block */}
                  <div style={{ textAlign: "right", fontSize: 11, color: C.textLabel }}>
                    <div>🏡 {selectedCitizen.address.houseNo}, {selectedCitizen.address.street}</div>
                    <div>{selectedCitizen.address.village}, {selectedCitizen.address.mandal}</div>
                    <div style={{ color: C.accent, fontWeight: 600 }}>{selectedCitizen.address.district}, {selectedCitizen.address.state}</div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", gap: 8 }}>
                {[
                  { key: "profile", label: "🏡 Household Profile" },
                  { key: "family", label: "👨‍👩‍👧 Family Members" },
                  { key: "timeline", label: "⏳ Activity Timeline" }
                ].map(tab => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => { setActiveTab(tab.key); setEditMode(false); }}
                      style={{
                        padding: "8px 16px",
                        border: "none",
                        borderBottom: `2px solid ${isActive ? C.accent : "transparent"}`,
                        background: "transparent",
                        color: isActive ? C.accent : C.textMuted,
                        cursor: "pointer",
                        fontWeight: isActive ? 700 : 500,
                        fontSize: 13,
                        transition: "all 0.15s"
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* TAB CONTENT: Profile & Household */}
              {activeTab === "profile" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ margin: 0, fontSize: 14, color: C.accent, fontWeight: 700 }}>
                      📊 Socio-Economic Household Classification
                    </h4>
                    {editMode ? (
                      <span style={{ fontSize: 11, color: C.accent }}>Editing mode active</span>
                    ) : (
                      <button
                        onClick={() => setEditMode(true)}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 6,
                          background: "transparent",
                          border: `1px solid ${C.border}`,
                          color: C.accent,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        Modify Profile
                      </button>
                    )}
                  </div>

                  {editMode ? (
                    <form onSubmit={handleSaveHousehold} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                          <label style={labelStyle}>Annual Income (INR)</label>
                          <input
                            type="number"
                            value={editIncome}
                            onChange={(e) => setEditIncome(e.target.value)}
                            style={inputStyle}
                            required
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Poverty Classification</label>
                          <select
                            value={editPoverty}
                            onChange={(e) => setEditPoverty(e.target.value)}
                            style={inputStyle}
                          >
                            <option value="APL">APL (Above Poverty Line)</option>
                            <option value="BPL">BPL (Below Poverty Line)</option>
                            <option value="Antyodaya">Antyodaya (AAY - Poorest of Poor)</option>
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Housing Status</label>
                          <select
                            value={editHousing}
                            onChange={(e) => setEditHousing(e.target.value)}
                            style={inputStyle}
                          >
                            <option value="Kutcha">Kutcha (Mud/Thatch)</option>
                            <option value="Semi-Pucca">Semi-Pucca</option>
                            <option value="Pucca">Pucca (Brick/Concrete)</option>
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Land Ownership</label>
                          <select
                            value={editLand}
                            onChange={(e) => setEditLand(e.target.value)}
                            style={inputStyle}
                          >
                            <option value="Landless">Landless</option>
                            <option value="Marginal (< 1 acre)">Marginal (&lt; 1 acre)</option>
                            <option value="Small (1-2 acres)">Small (1-2 acres)</option>
                            <option value="Medium (2-5 acres)">Medium (2-5 acres)</option>
                          </select>
                        </div>
                        <div style={{ gridColumn: "span 2" }}>
                          <label style={labelStyle}>Main Occupation</label>
                          <input
                            type="text"
                            value={editOccupation}
                            onChange={(e) => setEditOccupation(e.target.value)}
                            style={inputStyle}
                            required
                          />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                          type="submit"
                          style={{
                            padding: "8px 16px",
                            borderRadius: 6,
                            background: C.green,
                            border: "none",
                            color: C.bg,
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: "pointer"
                          }}
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: 6,
                            background: "transparent",
                            border: `1px solid ${C.border}`,
                            color: C.textMuted,
                            fontSize: 12,
                            cursor: "pointer"
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {[
                        { label: "Annual Income", value: `₹${selectedCitizen.household.income.toLocaleString()}` },
                        { label: "Poverty Category", value: selectedCitizen.household.povertyClassification },
                        { label: "Housing Type", value: selectedCitizen.household.housingStatus },
                        { label: "Agri Land Owned", value: selectedCitizen.household.landOwnership },
                        { label: "Primary Occupation", value: selectedCitizen.household.occupation },
                        { label: "Aadhaar status", value: selectedCitizen.aadhaarRef }
                      ].map((item, i) => (
                        <div key={i} style={{ padding: 12, background: C.bgInput, borderRadius: 8, border: "1px solid rgba(255,255,255,0.03)" }}>
                          <div style={{ fontSize: 9, color: C.textLabel, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.03em", marginBottom: 4 }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>
                            {item.value || "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: Family Members */}
              {activeTab === "family" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <h4 style={{ margin: 0, fontSize: 14, color: C.accent, fontWeight: 700 }}>
                    👨‍👩‍👧 Roster of Household Members
                  </h4>
                  {selectedCitizen.familyMembers.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted, fontSize: 12 }}>
                      No separate family members logged for this citizen.
                    </div>
                  ) : (
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
                            <th style={{ padding: 10, fontSize: 10, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Name</th>
                            <th style={{ padding: 10, fontSize: 10, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Relation</th>
                            <th style={{ padding: 10, fontSize: 10, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Age</th>
                            <th style={{ padding: 10, fontSize: 10, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Education</th>
                            <th style={{ padding: 10, fontSize: 10, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Occupation</th>
                            <th style={{ padding: 10, fontSize: 10, color: C.textLabel, textTransform: "uppercase", fontWeight: 700 }}>Disability</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCitizen.familyMembers.map((m, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                              <td style={{ padding: 10, fontSize: 12, color: C.white, fontWeight: 600 }}>{m.name}</td>
                              <td style={{ padding: 10, fontSize: 12, color: C.accent }}>{m.relationship}</td>
                              <td style={{ padding: 10, fontSize: 12, color: C.text }}>{m.age}</td>
                              <td style={{ padding: 10, fontSize: 12, color: C.textMuted }}>{m.education}</td>
                              <td style={{ padding: 10, fontSize: 12, color: C.textMuted }}>{m.occupation}</td>
                              <td style={{ padding: 10, fontSize: 12, color: m.disability === "None" ? C.textMuted : C.red }}>{m.disability}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT: Activity Timeline */}
              {activeTab === "timeline" && (
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, flexWrap: "wrap" }}>
                  {/* Timeline Listing */}
                  <div>
                    <h4 style={{ margin: "0 0 16px 0", fontSize: 14, color: C.accent, fontWeight: 700 }}>
                      ⏳ Citizen History Timeline
                    </h4>

                    <div style={{
                      position: "relative",
                      paddingLeft: 24,
                      display: "flex",
                      flexDirection: "column",
                      gap: 20
                    }}>
                      {/* Vertical line connector */}
                      <div style={{
                        position: "absolute",
                        left: 8,
                        top: 4,
                        bottom: 4,
                        width: 2,
                        background: C.border
                      }} />

                      {selectedCitizen.timeline.map((event, idx) => {
                        let dotColor = C.border;
                        let dotText = "•";
                        if (event.type === "CREATION") { dotColor = "#60a5fa"; dotText = "📋"; }
                        else if (event.type === "ELIGIBILITY") { dotColor = C.accent; dotText = "⚙️"; }
                        else if (event.type === "CASE_CREATED") { dotColor = "#c084fc"; dotText = "📁"; }
                        else if (event.type === "VOLUNTEER_VISIT") { dotColor = C.green; dotText = "🤝"; }
                        else if (event.type === "RESOLUTION") { dotColor = "#34d399"; dotText = "✅"; }

                        return (
                          <div key={event.id} style={{ position: "relative" }}>
                            {/* Dot icon indicator */}
                            <span style={{
                              position: "absolute",
                              left: -24,
                              top: 0,
                              transform: "translateX(-45%)",
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background: C.bgCard,
                              border: `2px solid ${dotColor}`,
                              fontSize: 10,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              zIndex: 2
                            }}>
                              {dotText}
                            </span>

                            <div style={{ fontSize: 12, color: C.textLabel, fontWeight: 700 }}>
                              {event.date} · <span style={{ color: dotColor }}>{event.title}</span>
                            </div>
                            <p style={{ margin: "4px 0", fontSize: 12, color: C.text, lineHeight: 1.4 }}>
                              {event.description}
                            </p>
                            <div style={{ fontSize: 10, color: C.textMuted }}>
                              Logged by: <em>{event.operator}</em>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Event Log Form */}
                  <div style={{
                    padding: 16,
                    background: C.bgInput,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    alignSelf: "flex-start"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: 12, color: C.white, fontWeight: 800 }}>
                      📝 Log Audit activity
                    </h4>
                    <form onSubmit={handleLogTimeline} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <label style={{ ...labelStyle, fontSize: 9 }}>Event Category</label>
                        <select
                          value={logType}
                          onChange={(e) => setLogType(e.target.value)}
                          style={{ ...inputStyle, padding: "8px 10px", fontSize: 12 }}
                        >
                          <option value="VOLUNTEER_VISIT">🤝 Volunteer Visit</option>
                          <option value="RESOLUTION">✅ Case Resolution</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ ...labelStyle, fontSize: 9 }}>Event Header</label>
                        <input
                          type="text"
                          placeholder="e.g. Document Collection"
                          value={logTitle}
                          onChange={(e) => setLogTitle(e.target.value)}
                          style={{ ...inputStyle, padding: "8px 10px", fontSize: 12 }}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ ...labelStyle, fontSize: 9 }}>Audit Notes</label>
                        <textarea
                          placeholder="Describe field logs or verification results..."
                          value={logDesc}
                          onChange={(e) => setLogDesc(e.target.value)}
                          style={{
                            ...inputStyle,
                            padding: "8px 10px",
                            fontSize: 12,
                            height: 70,
                            resize: "none"
                          }}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingLog}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "none",
                          background: `linear-gradient(135deg, ${C.accent}, #f59e0b)`,
                          color: C.bg,
                          fontSize: 11,
                          fontWeight: 800,
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                      >
                        {submittingLog ? "Logging..." : "Append to History"}
                      </button>
                    </form>
                  </div>

                </div>
              )}

            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", color: C.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div>Select a citizen profile to display household audit parameters.</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
