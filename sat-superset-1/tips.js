window.TIPS = [
  {
    section: "Strategy Before You Even Touch a Problem",
    items: [
      `<b>Read the question last.</b> Skim the setup, jot knowns, then re-read the final sentence to know exactly what's being asked (units, rounding, "first reaches", "positive difference", etc.).`,
      `<b>Underline the ask.</b> Many SAT "trick" answers are for a different quantity than the one requested — it's 100% avoidable by circling the noun in the final sentence.`,
      `<b>Note the units early.</b> If the answer needs months or square decimeters per hour, plan the conversion before arithmetic.`,
      `<b>Spot the shape of the problem.</b> System? Quadratic? Exponential? Probability? The right tool saves 80% of the time.`
    ]
  },
  {
    section: "Linear Systems",
    items: [
      `<b>Always convert to \\(Ax+By=C\\) form</b> for "no solution / infinite solutions" questions — slope comparisons go wrong with mixed forms.`,
      `<b>Infinite solutions checklist:</b> all three ratios \\(A_1/A_2,\\ B_1/B_2,\\ C_1/C_2\\) equal.`,
      `<b>No solution checklist:</b> the ratio of coefficients is equal, but the constant ratio is different.`,
      `<b>Parametrize cleverly:</b> when every answer choice has "\\(r\\)", let the variable that matches that slot equal \\(r\\) and solve for the other.`
    ]
  },
  {
    section: "Quadratics",
    items: [
      `<b>\\(f(1)=a+b+c,\\ f(-1)=a-b+c,\\ f(0)=c.\\)</b> Use these as shortcuts whenever the question asks for one of these combinations.`,
      `<b>Symmetry trick:</b> If \\(f(x_1)=f(x_2)\\), the axis is at \\(\\tfrac{x_1+x_2}{2}.\\)`,
      `<b>Vieta over quadratic formula:</b> if only sum or product of roots is asked, use \\(-b/a\\) and \\(c/a\\). No roots needed.`,
      `<b>Discriminant sign shortcuts:</b> if \\(a\\) and \\(c\\) have <i>opposite signs</i>, \\(\\Delta>0\\) automatically. If both negative (or both positive) with small \\(|b|\\), \\(\\Delta\\) tends to be negative.`,
      `<b>Projectile on Earth:</b> height model often reduces to \\(h(t)=-16(t-t_v)^2+h_{\\max}\\) in feet.`
    ]
  },
  {
    section: "Exponentials",
    items: [
      `<b>Rewrite \\(b^{kx}=(b^k)^x\\)</b> whenever the SAT asks for "per-unit" rate.`,
      `<b>Match the exponent form \\(x/p\\)</b> when asked for the factor per \\(p\\)-unit increase.`,
      `<b>Bases equal ⇒ exponents equal:</b> check if both sides can be written with the same base before reaching for logs.`,
      `<b>"Percent change form"</b> \\(y=A(1\\pm r)^{x}\\): the sign of \\(r\\) tells you growth vs decay, and \\(r\\) is directly the proportional change per unit.`
    ]
  },
  {
    section: "Geometry",
    items: [
      `<b>Recognize triples on sight:</b> 3-4-5, 5-12-13, 7-24-25, 8-15-17, 9-40-41, 28-45-53. All common SAT setups.`,
      `<b>Draw it!</b> Even simple diagrams catch sign / orientation errors.`,
      `<b>Similar triangles from parallel lines:</b> a line parallel to one side cuts the other two sides proportionally (AA similarity).`,
      `<b>Perimeter scales as \\(k\\), area as \\(k^2\\), volume as \\(k^3.\\)</b> This single fact solves many "two similar solids" problems.`,
      `<b>Inscribed equilateral triangle:</b> side \\(=r\\sqrt{3}\\), area \\(=\\tfrac{3\\sqrt{3}}{4}r^2.\\)`
    ]
  },
  {
    section: "Trig",
    items: [
      `<b>\\(\\sin(x)=\\cos(y)\\Rightarrow x+y=90.\\)</b> Reflex this instantly on the SAT.`,
      `<b>SOH-CAH-TOA</b> with a labeled right triangle beats "guessing from a unit circle" almost every time.`,
      `<b>Dot product for angle cosine</b> when you have coordinates: \\(\\cos\\theta=\\tfrac{\\vec u\\cdot\\vec v}{|\\vec u||\\vec v|}.\\)`
    ]
  },
  {
    section: "Statistics",
    items: [
      `<b>Random selection → generalization.</b> Without random selection, you can't generalize beyond the sample.`,
      `<b>Random assignment → causation.</b> Without random assignment, the most you can say is "associated with", never "causes".`,
      `<b>Confounders</b> live in between-group differences that weren't randomized away.`
    ]
  },
  {
    section: "Probability",
    items: [
      `<b>Bounds check:</b> \\(0\\le P\\le 1\\). Eliminate choices that violate this.`,
      `<b>Conditional probability:</b> the given event <i>restricts</i> the sample space. Divide by the conditioned count, not the total.`,
      `<b>Complement shortcut:</b> if "at least one" or "not in region III" is asked, compute \\(1-\\text{easier event}.\\)`
    ]
  },
  {
    section: "Algebraic Setups",
    items: [
      `<b>"One variable" no-solution:</b> \\(Ax=C\\) has no solution iff \\(A=0\\) and \\(C\\ne 0\\). Great trick for questions with parameters.`,
      `<b>Mixture problems:</b> write BOTH conservation equations (total volume + total solute).`,
      `<b>"Percent less" / "percent greater":</b> translate to a multiplicative equation. "a is p% less than b" ⇒ \\(a=b(1-p/100).\\)`
    ]
  },
  {
    section: "Radical & Absolute Value",
    items: [
      `<b>Check the non-radical side is non-negative</b> before squaring. Otherwise extraneous roots sneak in.`,
      `<b>"One real solution"</b> for a radical equation = double root OR only one root in the domain. Both cases are worth exploring.`,
      `<b>Absolute value equation \\(|E|=R\\):</b> set \\(R\\ge 0\\) first, then split into \\(E=\\pm R.\\) Discard any root that makes \\(R<0.\\)`
    ]
  },
  {
    section: "Time & Test-Taking",
    items: [
      `<b>Skip aggressively.</b> If a problem takes more than 90 seconds to set up, flag it, move on, come back at the end.`,
      `<b>Use the calculator for arithmetic</b> — but set up the expression on paper first so you don't compound typing errors.`,
      `<b>Back-solve</b> multiple choice when a direct approach stalls: plug each choice into the condition.`,
      `<b>Estimate</b> before computing: knowing the answer should be "a small positive number" eliminates most traps.`,
      `<b>Re-check units & rounding</b> in the last 10 seconds of every problem. Two of the easiest point losses on the SAT.`
    ]
  }
];
