const completionPerks = [
  {
    num: "01",
    icon: "fas fa-certificate",
    title: "Completion Certificate",
    desc: "Official program completion certificate recognizing your training and skills.",
  },
  {
    num: "02",
    icon: "fas fa-file-alt",
    title: "Training & Internship Certificates",
    desc: "Separate training certificate and internship certificate for your professional portfolio.",
  },
  {
    num: "03",
    icon: "fas fa-cogs",
    title: "Company Tools & Workflow Knowledge",
    desc: "Know how real companies run — from Git, Jira, and Slack to agile methodologies and deployment.",
  },
  {
    num: "04",
    icon: "fas fa-briefcase",
    title: "Professional Experience",
    desc: "Walk away with verifiable work experience and projects to showcase to any employer.",
  },
  {
    num: "05",
    icon: "fas fa-hands-helping",
    title: "Ongoing Team Support",
    desc: "Even after the program ends, our team stays connected to support your career growth.",
  },
  {
    num: "06",
    icon: "fas fa-handshake",
    title: "Direct Job Offer",
    desc: "If a vacancy is open, you can receive a direct job offer — no interview needed.",
  },
];

export function CompletionBenefits() {
  return (
    <section className="py-20 bg-(--color-light-bg)">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-5 py-1.5 rounded-full text-[13px] font-bold tracking-[1.5px] uppercase bg-(--color-primary-very-light) text-(--color-primary) mb-4">
            AFTER COMPLETION
          </span>
          <h2 className="font-heading text-[48px] max-md:text-[32px] font-extrabold text-(--color-dark) mb-4">
            What You Walk Away With
          </h2>
          <p className="text-[18px] text-(--color-text) max-w-[600px] mx-auto">
            Complete the program and leave with certificates, experience, and
            career-ready skills.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {completionPerks.map((perk) => (
            <div
              key={perk.num}
              className="reveal relative bg-white p-9 pt-10 rounded-xl border border-(--color-border) text-center transition-all hover:-translate-y-1 hover:shadow-lg hover:border-transparent overflow-hidden group"
            >
              <span className="absolute top-2.5 right-4 font-heading text-[48px] font-extrabold text-(--color-primary-very-light) leading-none pointer-events-none">
                {perk.num}
              </span>
              <div className="w-13 h-13 rounded-xl bg-(--color-primary-very-light) flex items-center justify-center mx-auto mb-4 text-[20px] text-(--color-primary) transition-all group-hover:bg-(--color-primary) group-hover:text-white">
                <i className={perk.icon} />
              </div>
              <h3 className="font-heading text-[18px] font-bold text-(--color-dark) mb-2">
                {perk.title}
              </h3>
              <p className="text-[15px] text-(--color-text) leading-relaxed">
                {perk.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
