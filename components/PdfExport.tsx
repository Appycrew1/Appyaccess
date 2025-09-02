"use client";

import { jsPDF } from "jspdf";
import type { AIResult, AnalysisPayload } from "@/types";
import { formatDistance, formatDuration } from "@/lib/utils";

export default function PdfExport({ ai, payload }: { ai: AIResult | null, payload: AnalysisPayload | null }) {
  const handlePdf = () => {
    const doc = new jsPDF();
    let y = 10;

    const addLine = (text: string, size = 12, bold = false) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, 15, y);
      y += (lines.length * (size * 0.45)) + 4;
    };

    addLine("Access Viewer Pro — Pre‑Survey Report", 16, true);
    if (payload) {
      addLine(`Depot: ${payload.depot.description}`);
      addLine(`Customer: ${payload.customer.description}`);
      if (payload.route) {
        addLine(`Route: ${formatDistance(payload.route.distance_m)} / ${formatDuration(payload.route.duration_s)}`);
      }
      if (payload.weather) {
        addLine(`Weather: ${payload.weather.temperature}°C, wind ${payload.weather.windspeed} km/h`);
      }
    }

    doc.line(15, y, 195, y); y += 6;

    if (ai) {
      addLine("Summary", 14, true);
      addLine(ai.summary);
      addLine("Crew Recommendation", 14, true);
      addLine(ai.crewRecommendation);
      addLine("Equipment", 14, true);
      addLine(ai.equipment.join(", ") || "—");
      addLine("Risk Level", 14, true);
      addLine(ai.riskLevel);
      addLine("Key Risks", 14, true);
      addLine(ai.keyRisks.join("; ") || "—");
      addLine("Parking Notes", 14, true);
      addLine(ai.parkingNotes || "—");
      addLine("Compliance Checklist", 14, true);
      ai.complianceChecklist.forEach((item, idx) => addLine(`${idx + 1}. ${item}`));
    } else {
      addLine("No AI analysis yet.", 12, false);
    }

    doc.save("access-viewer-report.pdf");
  };

  return (
    <button onClick={handlePdf} className="btn btn-ghost">Export PDF</button>
  );
}
