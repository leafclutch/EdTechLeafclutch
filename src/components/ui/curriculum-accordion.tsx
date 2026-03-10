"use client";

import { useState } from "react";

interface Section {
  title: string;
  lectures: string[];
}

export function CurriculumAccordion({ sections }: { sections: Section[] }) {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));
  const [allOpen, setAllOpen] = useState(false);

  const totalLectures = sections.reduce((acc, s) => acc + s.lectures.length, 0);

  function toggle(index: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function toggleAll() {
    if (allOpen) {
      setOpenSections(new Set());
    } else {
      setOpenSections(new Set(sections.map((_, i) => i)));
    }
    setAllOpen(!allOpen);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 text-[14px] text-(--color-text)">
        <span>
          <strong>{sections.length} sections</strong> &bull; {totalLectures}{" "}
          lectures &bull; 3 months total length
        </span>
        <button
          onClick={toggleAll}
          className="text-(--color-primary) font-semibold hover:underline"
        >
          {allOpen ? "Collapse all" : "Expand all sections"}
        </button>
      </div>
      <div className="border border-(--color-border) rounded-xl overflow-hidden divide-y divide-(--color-border)">
        {sections.map((section, i) => {
          const isOpen = openSections.has(i);
          return (
            <div key={i}>
              <button
                onClick={() => toggle(i)}
                className="flex items-center gap-3 w-full p-4 text-left bg-(--color-light-bg) hover:bg-[#eef1f8] transition-colors"
              >
                <i
                  className={`fas fa-chevron-right text-[12px] text-(--color-primary) transition-transform ${isOpen ? "rotate-90" : ""}`}
                />
                <span className="flex-1 font-heading font-semibold text-[16px] text-(--color-dark)">
                  {section.title}
                </span>
                <span className="text-[13px] text-(--color-text-light)">
                  {section.lectures.length} lectures
                </span>
              </button>
              {isOpen && (
                <ul className="bg-white">
                  {section.lectures.map((lecture, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-3 px-6 py-3 text-[15px] text-(--color-text) border-t border-(--color-border) first:border-t-0"
                    >
                      <i className="fas fa-play-circle text-(--color-text-light) text-[14px]" />
                      {lecture}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
