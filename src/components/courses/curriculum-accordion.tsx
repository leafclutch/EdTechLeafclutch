"use client";

import { useState } from "react";

interface Section {
  title: string;
  lectures: string[];
}

export function CurriculumAccordion({ sections }: { sections: Section[] }) {
  const [activeIndexes, setActiveIndexes] = useState<Set<number>>(new Set([0]));

  const toggleSection = (index: number) => {
    setActiveIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const expandAll = () => {
    if (activeIndexes.size === sections.length) {
      setActiveIndexes(new Set());
    } else {
      setActiveIndexes(new Set(sections.map((_, i) => i)));
    }
  };
const totalLectures = sections.reduce((acc, s) => acc + s.lectures.length, 0);

  return (
    <div className="curriculum-accordion-wrapper">
      <div className="curriculum-stats">
        <span className="curriculum-stats-text">
          <strong>{sections.length} sections</strong> • {totalLectures} lectures • 3 months total length
        </span>
        <button className="curriculum-expand-btn" onClick={expandAll}>
          {activeIndexes.size === sections.length ? "Collapse all sections" : "Expand all sections"}
        </button>
      </div>

      {sections.map((section, index) => (
        <div
          key={index}
          className={`curriculum-section-item${activeIndexes.has(index) ? " active" : ""}`}
        >
          <button className="curriculum-section-header-btn" onClick={() => toggleSection(index)}>
            <i className="fas fa-chevron-right curriculum-section-chevron"></i>
            <span className="curriculum-section-title">{section.title}</span>
            <span className="curriculum-section-meta">{section.lectures.length} lectures</span>
          </button>
          <div className="curriculum-section-body">
            <ul className="curriculum-lecture-list">
              {section.lectures.map((lecture, li) => (
                <li className="curriculum-lecture-item" key={li}>
                  <i className="fas fa-play-circle curriculum-lecture-icon"></i>
                  <span className="curriculum-lecture-name">{lecture}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
