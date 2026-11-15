import React, { useState } from "react";
import {
  ShieldAlert,
  Compass,
  ExternalLink
} from "lucide-react";

export const MissionScenarioPage: React.FC = () => {
  const [missionType, setMissionType] = useState("lunar_base");
  const [o2Percent, setO2Percent] = useState("32");
  const [pressureKpa, setPressureKpa] = useState("56.5");
  const [airflow, setAirflow] = useState("15");

  const scenarios: Record<string, any> = {
    lunar_base: {
      title: "Pressurized Lunar Habitat (Artemis Exploration Atmosphere)",
      gravity: "Lunar Surface Gravity (1/6 g ~ 0.166 g)",
      description: "Proposed exploration atmosphere with 32-34% O2 at 56.5 kPa (8.2 psia) to minimize EVA pre-breathe times. Stagnant pockets exist behind equipment racks with 10-20 cm/s environmental control airflow.",
      relevantLeads: [
        {
          investigation: "FLEX (PSI-69)",
          insight: "FLEX evaluated elevated oxygen fractions (up to 30% O2). Higher ambient oxygen dramatically increases burning rates and reduces extinction diameters, indicating that flames persist down to smaller fuel quantities.",
          doi: "10.60555/mbq8-0451",
          sourceUrl: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-69"
        },
        {
          investigation: "SAFFIRE-I (PSI-98)",
          insight: "SAFFIRE-I proved that forced low-speed airflow (~20 cm/s) provides continuous oxygen supply while imparting minimal cooling, allowing solid fabric fires to reach steady spreading velocities.",
          doi: "10.60555/0t15-1z43",
          sourceUrl: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-98"
        }
      ],
      gaps: [
        "GRAVITY MISMATCH: The indexed investigations were conducted in orbital microgravity (~10^-6 g), not lunar 1/6 g. Buoyancy is not zero on the Moon; partial gravity induces upward plume tilting not captured in 0-g data.",
        "PRESSURE REGIME: FLEX and SAFFIRE-I operated primarily at 70-101.3 kPa. Testing at 56.5 kPa with elevated O2 requires specialized partial-pressure combustion scaling."
      ]
    },
    mars_transit: {
      title: "Crewed Mars Transit Vehicle (Deep Space Long Duration)",
      gravity: "Microgravity (~10^-5 g on trajectory)",
      description: "Months of zero-gravity transit inside enclosed habitation modules with forced ventilation loops and standard cabin air (21% O2, 101.3 kPa).",
      relevantLeads: [
        {
          investigation: "SAFFIRE-I (PSI-98)",
          insight: "Directly models large-scale fire dynamics in an uncrewed space vehicle flow duct. Demonstrated that peak gas temperatures exceed 900 °C and radiant heat flux exceeds 6 kW/m² in microgravity.",
          doi: "10.60555/0t15-1z43",
          sourceUrl: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-98"
        },
        {
          investigation: "SPICE (PSI-107)",
          insight: "Soot agglomerates grow larger in microgravity due to longer residence times. Smoke detectors tuned for terrestrial ceiling plumes will experience delayed or altered detection thresholds.",
          doi: "10.60555/9kbh-e962",
          sourceUrl: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-107"
        }
      ],
      gaps: [
        "SUPPRESSION TOTAL FLOODING: While FLEX tested small-scale CO2 and He suppression of droplet flames, full-scale vehicle compartment depressurization or flooding dynamics are not in the current indexed subset."
      ]
    },
    iss_wiring: {
      title: "ISS Electronics Standoff & Wire Harness Overheat",
      gravity: "Orbital Microgravity (~10^-6 g aboard ISS)",
      description: "Potential electrical overload or arc fault in tightly bundled wiring behind rack standoffs with standard cabin atmosphere (21% O2, 101.3 kPa) and stagnant ventilation dead zones (< 5 cm/s).",
      relevantLeads: [
        {
          investigation: "SPICE (PSI-107)",
          insight: "Shows soot agglomeration in microgravity leads to larger particle sizes and delayed detection thresholds for standard optical obscuration smoke detectors in low-flow pockets.",
          doi: "10.60555/9kbh-e962",
          sourceUrl: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-107"
        },
        {
          investigation: "FLEX (PSI-69)",
          insight: "In microgravity with near-zero flow, pyrolyzed fuel vapors pool around ignition sites, creating potential for low-temperature cool flame resurgence when air circulation restarts.",
          doi: "10.60555/mbq8-0451",
          sourceUrl: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-69"
        },
        {
          investigation: "SAFFIRE-I (PSI-98)",
          insight: "Demonstrated that low-speed forced ventilation (~20 cm/s) can transition quiescent smoldering into active, high-temperature downstream flame spread.",
          doi: "10.60555/0t15-1z43",
          sourceUrl: "https://psi.nasa.gov/physci/repo/data/investigations/PSI-98"
        }
      ],
      gaps: [
        "MATERIAL GAP: The indexed corpus contains SIBAL fabric, n-heptane, ethanol, methane, and ethylene. Polymeric electrical wire insulation (PTFE, ETFE, Kapton) is not indexed in the current microgravity combustion database.",
        "CONFINEMENT GEOMETRY: Tests inside open flow ducts (SAFFIRE) or spherical combustion chambers (FLEX) do not model narrow wire-loom standoffs between avionics chassis."
      ]
    }
  };

  const currentScen = scenarios[missionType];

  return (
    <div>
      {/* Header Form */}
      <div className="card card-elevated">
        <div className="card-header">
          <div className="card-title">
            <ShieldAlert size={18} color="var(--accent-cyan)" />
            <span>Mission Scenario Evidence Explorer (Hypothetical Architecture)</span>
          </div>
          <span className="badge badge-purple">Research Synthesis Lead Engine</span>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "14px", lineHeight: 1.5 }}>
          Select a hypothetical space exploration architecture. IGNIS retrieves relevant microgravity combustion research leads, identifies aerothermal condition mismatches, and highlights empirical evidence gaps in the indexed corpus.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "12px" }}>
          <div>
            <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
              Mission Architecture Scenario
            </label>
            <select
              className="select-box"
              style={{ width: "100%" }}
              value={missionType}
              onChange={(e) => setMissionType(e.target.value)}
            >
              <option value="lunar_base">Artemis Pressurized Lunar Habitat</option>
              <option value="mars_transit">Mars Long-Duration Transit Vehicle</option>
              <option value="iss_wiring">ISS Rack Standoff & Wire Harness Overheat</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
              Target Oxygen Fraction (% O2)
            </label>
            <input
              type="text"
              className="input-text"
              value={o2Percent}
              onChange={(e) => setO2Percent(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
              Total Pressure (kPa)
            </label>
            <input
              type="text"
              className="input-text"
              value={pressureKpa}
              onChange={(e) => setPressureKpa(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
              Ventilation Flow Velocity (cm/s)
            </label>
            <input
              type="text"
              className="input-text"
              value={airflow}
              onChange={(e) => setAirflow(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Scenario Evaluation Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Compass size={18} color="var(--accent-purple)" />
            <span>{currentScen.title}</span>
          </div>
          <span className="badge badge-cyan">{currentScen.gravity}</span>
        </div>

        <p style={{ fontSize: "0.88rem", color: "var(--text-main)", lineHeight: 1.5, marginBottom: "16px" }}>
          {currentScen.description}
        </p>

        {/* Relevant Research Leads */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-success)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
            Relevant NASA Research Leads
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {currentScen.relevantLeads.map((lead: any, i: number) => (
              <div
                key={i}
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderRadius: "6px",
                  border: "1px solid var(--border-color)",
                  padding: "14px",
                  borderLeft: "3px solid var(--color-success)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontWeight: 600, color: "var(--accent-cyan)", fontSize: "0.9rem" }}>
                    {lead.investigation}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-dim)" }}>
                    DOI: {lead.doi}
                  </span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.45, marginBottom: "8px" }}>
                  {lead.insight}
                </div>
                <a
                  href={lead.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ fontSize: "0.72rem", padding: "3px 8px" }}
                >
                  <ExternalLink size={12} />
                  <span>Verify at NASA PSI</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Identified Gaps & Unknowns */}
        <div
          style={{
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            borderLeft: "4px solid var(--color-caution)",
            borderRadius: "6px",
            padding: "14px 18px"
          }}
        >
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-caution)", marginBottom: "6px" }}>
            CRITICAL EMPIRICAL GAPS & AVOIDABLE PITFALLS:
          </div>
          {currentScen.gaps.map((gap: string, i: number) => (
            <div key={i} style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.45, marginBottom: "4px" }}>
              • {gap}
            </div>
          ))}
          <div style={{ marginTop: "8px", fontSize: "0.75rem", color: "var(--text-dim)" }}>
            * Note: These gaps indicate areas where additional experiments or aerothermal models are required before flight certification.
          </div>
        </div>
      </div>
    </div>
  );
};
