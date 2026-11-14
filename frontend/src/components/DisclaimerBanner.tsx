import React from "react";
import { AlertTriangle } from "lucide-react";

interface DisclaimerProps {
  text?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerProps> = ({ text }) => {
  const defaultText =
    "ARCHIVED NASA RESEARCH PROTOTYPE — NOT OPERATIONAL SAFETY ADVICE: IGNIS is an independent research prototype developed for the NASA Space Apps Challenge 2026 ('Flame in Freefall'). All data is derived from NASA Physical Sciences Informatics (PSI) and NTRS public archives. IGNIS does not provide operational spacecraft fire suppression instructions, material certifications, or safety guarantees.";

  return (
    <div className="disclaimer-banner">
      <AlertTriangle size={20} color="var(--color-caution)" style={{ flexShrink: 0, marginTop: "2px" }} />
      <div>
        <div className="disclaimer-title">Scientific & Operational Safety Disclaimer</div>
        <div className="disclaimer-text">{text || defaultText}</div>
      </div>
    </div>
  );
};
