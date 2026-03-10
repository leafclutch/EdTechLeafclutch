const enrollPerks = [
  {
    icon: "fas fa-star",
    title: "Lifetime Udemy Course",
    desc: "Get a premium Udemy course related to your chosen training track — yours to keep forever.",
    highlight: true,
  },
  {
    icon: "fas fa-user-tie",
    title: "Dedicated Mentor Support",
    desc: "Get assigned a personal mentor who guides you through every step of your learning journey.",
  },
  {
    icon: "fas fa-building",
    title: "Real Company Workflow Experience",
    desc: "Understand how companies operate — from project planning to delivery using industry tools.",
  },
  {
    icon: "fas fa-calendar-alt",
    title: "1 Month Training + 2 Months Internship",
    desc: "Intensive training in month 1, followed by hands-on internship opportunity in months 2 & 3.",
  },
  {
    icon: "fas fa-network-wired",
    title: "Connections & Exposure",
    desc: "Build your professional network, meet industry mentors, and gain real-world exposure.",
  },
  {
    icon: "fas fa-award",
    title: "Job Offer for Top Performers",
    desc: "Best-performing candidates receive direct job offers — no external interview required.",
  },
];

export function EnrollBenefits() {
  return (
    <section className="py-20">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-14 items-start">
          <div className="reveal-left">
            <span className="inline-block px-5 py-1.5 rounded-full text-[13px] font-bold tracking-[1.5px] uppercase bg-(--color-primary-very-light) text-(--color-primary) mb-4">
              AFTER YOU ENROLL
            </span>
            <h2 className="font-heading text-[48px] max-md:text-[32px] font-extrabold text-(--color-dark) mb-4">
              What You Get From Day 1
            </h2>
            <p className="text-[18px] text-(--color-text) max-w-[420px]">
              The moment you enroll, you unlock everything you need to kickstart
              your tech career — no waiting.
            </p>
          </div>
          <div className="flex flex-col gap-4 reveal-right">
            {enrollPerks.map((perk) => (
              <div
                key={perk.title}
                className={`flex items-start gap-4 p-5 rounded-xl border transition-all hover:shadow-md hover:border-transparent ${
                  perk.highlight
                    ? "bg-gradient-to-r from-[#fef9c3] to-[#fef3c7] border-[#f59e0b]"
                    : "bg-white border-(--color-border)"
                }`}
              >
                <div
                  className={`shrink-0 w-11 h-11 rounded-[10px] flex items-center justify-center text-[18px] ${
                    perk.highlight
                      ? "bg-[#f59e0b] text-white"
                      : "bg-(--color-primary-very-light) text-(--color-primary)"
                  }`}
                >
                  <i className={perk.icon} />
                </div>
                <div>
                  <h4 className="font-heading text-[17px] font-bold text-(--color-dark) mb-1">
                    {perk.title}
                  </h4>
                  <p className="text-[15px] text-(--color-text) leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
