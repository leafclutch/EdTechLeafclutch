import Link from "next/link";
import { createPublicSupabase } from "@/lib/supabase/server";
import type { PricingPlan } from "@/lib/supabase/types";

function formatNPR(amount: number) {
  return `NPR ${amount.toLocaleString()}`;
}

export async function PricingSection() {
  const supabase = createPublicSupabase();
  const { data: plans } = await supabase
    .from("pricing_plans")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .returns<PricingPlan[]>();

  return (
    <section className="membership" id="membership">
      <div className="container">
        <div className="membership-header">
          <span className="section-badge">INTERNSHIP PLANS</span>
          <h2 className="section-title">Choose Your Learning Path</h2>
          <p className="section-desc">
            Flexible internship and training programs designed for students and
            professionals at every level.
          </p>
        </div>
        <div className="pricing-grid">
          {(plans ?? []).map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card${plan.is_featured ? " pricing-card--featured" : ""}`}
            >
              {plan.is_featured && (
                <div className="pricing-featured-badge">Most Popular</div>
              )}
              <div className="pricing-top">
                <h3 className="pricing-plan-name">{plan.title}</h3>
                <div className="pricing-price">
                  {formatNPR(plan.total_fee)}{" "}
                  <span className="pricing-price-note">Total Fee</span>
                </div>
                <p className="pricing-plan-desc">
                  Enroll with just{" "}
                  <strong>{formatNPR(plan.initial_fee)}</strong> &middot; Choose
                  any one course
                </p>
              </div>
              <div className="pricing-body">
                <h4 className="pricing-benefit-title">Available Courses</h4>
                <ul className="pricing-features">
                  {(plan.courses_included ?? []).map((c: string) => (
                    <li key={c}>
                      <i className="fas fa-check-circle"></i> {c}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/enroll"
                className={`btn ${plan.is_featured ? "btn-primary" : "btn-outline-dark"} btn-block`}
              >
                Enroll Now
              </Link>
            </div>
          ))}
        </div>
        <p className="pricing-installment-note">
          Remaining fee payable in 5 easy installments
        </p>
      </div>
    </section>
  );
}
