window.FORMULAS = [
  {
    section: "Algebra — Lines & Systems",
    items: [
      `<b>Slope:</b> \\(m=\\dfrac{y_2-y_1}{x_2-x_1}.\\)`,
      `<b>Slope-intercept form:</b> \\(y=mx+b.\\)`,
      `<b>Point-slope form:</b> \\(y-y_1=m(x-x_1).\\)`,
      `<b>Standard form:</b> \\(Ax+By=C.\\)`,
      `<b>Parallel lines:</b> same slope, different intercepts ⇒ <i>no solution</i>.`,
      `<b>Same line (infinite solutions):</b> \\(\\dfrac{A_1}{A_2}=\\dfrac{B_1}{B_2}=\\dfrac{C_1}{C_2}.\\)`,
      `<b>No-solution criterion (systems):</b> \\(\\dfrac{A_1}{A_2}=\\dfrac{B_1}{B_2}\\ne\\dfrac{C_1}{C_2}.\\)`,
      `<b>Distance between two points:</b> \\(\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}.\\)`
    ]
  },
  {
    section: "Quadratics",
    items: [
      `<b>Standard:</b> \\(y=ax^2+bx+c.\\)`,
      `<b>Vertex form:</b> \\(y=a(x-h)^2+k\\) with vertex \\((h,k)\\).`,
      `<b>Factored form:</b> \\(y=a(x-r_1)(x-r_2)\\) where \\(r_1,r_2\\) are \\(x\\)-intercepts.`,
      `<b>Axis of symmetry:</b> \\(x=-\\dfrac{b}{2a}.\\)`,
      `<b>Discriminant:</b> \\(\\Delta=b^2-4ac\\) — sign of \\(\\Delta\\) tells you how many real roots.`,
      `<b>Quadratic formula:</b> \\(x=\\dfrac{-b\\pm\\sqrt{\\Delta}}{2a}.\\)`,
      `<b>Vieta's formulas:</b> sum \\(=-\\dfrac{b}{a},\\) product \\(=\\dfrac{c}{a}.\\)`,
      `<b>Sum of roots from symmetry:</b> \\(x_1+x_2=2\\cdot(\\text{axis}).\\)`,
      `<b>Handy plug-in values:</b> \\(f(0)=c,\\ f(1)=a+b+c,\\ f(-1)=a-b+c.\\)`
    ]
  },
  {
    section: "Exponentials & Logs",
    items: [
      `<b>General exponential:</b> \\(y=A\\cdot b^{x}.\\) Growth if \\(b>1\\), decay if \\(0<b<1.\\)`,
      `<b>Growth rate \\(r\\):</b> \\(y=A(1+r)^x,\\) where \\(r\\) is the fractional increase per unit.`,
      `<b>Decay rate \\(r\\):</b> \\(y=A(1-r)^x.\\)`,
      `<b>Exponent manipulation:</b> \\(b^{kx}=(b^k)^x,\\ (b^m)^n=b^{mn},\\ b^{m+n}=b^m b^n.\\)`,
      `<b>Finding the "per-\\(p\\)-unit" factor:</b> if \\(y=A\\cdot b^{x/p},\\) then \\(y(x+p)=b\\cdot y(x).\\)`,
      `<b>Equating bases:</b> if \\(b>0,\\ b\\ne 1,\\) then \\(b^m=b^n\\Rightarrow m=n.\\)`
    ]
  },
  {
    section: "Functions & Transformations",
    items: [
      `<b>Shift left by \\(h\\):</b> \\(f(x)\\to f(x+h).\\)`,
      `<b>Shift right by \\(h\\):</b> \\(f(x)\\to f(x-h).\\)`,
      `<b>Shift up by \\(k\\):</b> \\(f(x)\\to f(x)+k.\\)`,
      `<b>Shift down by \\(k\\):</b> \\(f(x)\\to f(x)-k.\\)`,
      `<b>Reflect over \\(x\\)-axis:</b> \\(f(x)\\to -f(x).\\)`,
      `<b>Reflect over \\(y\\)-axis:</b> \\(f(x)\\to f(-x).\\)`,
      `<b>Absolute value equation:</b> \\(|E|=R\\iff R\\ge 0\\) AND \\(E=\\pm R.\\)`
    ]
  },
  {
    section: "Geometry",
    items: [
      `<b>Triangle inequality:</b> for sides \\(a,b,c\\): \\(|a-b|<c<a+b.\\)`,
      `<b>Pythagorean theorem:</b> \\(a^2+b^2=c^2.\\)`,
      `<b>Common Pythagorean triples:</b> 3-4-5, 5-12-13, 7-24-25, 8-15-17, 9-40-41, 20-21-29, <b>28-45-53</b>.`,
      `<b>Triangle area:</b> \\(\\tfrac{1}{2}bh\\) or \\(\\tfrac{1}{2}ab\\sin C.\\)`,
      `<b>Equilateral side \\(s\\):</b> area \\(=\\tfrac{\\sqrt{3}}{4}s^2.\\)`,
      `<b>Equilateral inscribed in circle of radius \\(r\\):</b> side \\(=r\\sqrt{3},\\) area \\(=\\tfrac{3\\sqrt{3}}{4}r^2.\\)`,
      `<b>Circle:</b> \\((x-h)^2+(y-k)^2=r^2,\\) area \\(=\\pi r^2,\\) circumference \\(=2\\pi r.\\)`,
      `<b>Inscribed circle in a square:</b> side of square \\(=2r\\), area \\(=4r^2.\\)`,
      `<b>Similar figures:</b> lengths scale by \\(k\\), areas by \\(k^2\\), volumes by \\(k^3.\\)`,
      `<b>Similarity criteria:</b> AA, SAS (included angle), SSS.`
    ]
  },
  {
    section: "Trigonometry",
    items: [
      `<b>SOH-CAH-TOA:</b> \\(\\sin=\\tfrac{\\text{opp}}{\\text{hyp}},\\ \\cos=\\tfrac{\\text{adj}}{\\text{hyp}},\\ \\tan=\\tfrac{\\text{opp}}{\\text{adj}}.\\)`,
      `<b>Cofunction identity:</b> \\(\\sin\\theta=\\cos(90^\\circ-\\theta).\\)`,
      `<b>Pythagorean identity:</b> \\(\\sin^2\\theta+\\cos^2\\theta=1.\\)`,
      `<b>Angle sum in triangle:</b> \\(A+B+C=180^\\circ.\\)`,
      `<b>Unit circle reference values:</b> \\(\\sin 30^\\circ=\\tfrac12,\\ \\cos 30^\\circ=\\tfrac{\\sqrt{3}}{2},\\ \\sin 45^\\circ=\\tfrac{\\sqrt{2}}{2},\\ \\sin 60^\\circ=\\tfrac{\\sqrt{3}}{2}.\\)`,
      `<b>Dot product (for cosine of angle):</b> \\(\\cos\\theta=\\dfrac{\\vec u\\cdot\\vec v}{|\\vec u||\\vec v|}.\\)`
    ]
  },
  {
    section: "Statistics & Data",
    items: [
      `<b>Mean:</b> \\(\\bar x=\\dfrac{\\sum x_i}{n}.\\)`,
      `<b>Median:</b> middle value (average of two middle values if \\(n\\) is even).`,
      `<b>Range:</b> max − min.`,
      `<b>Standard deviation (conceptual):</b> larger when data is more spread out from the mean.`,
      `<b>Generalization:</b> conclusions apply only to the population that was <i>randomly sampled</i>.`,
      `<b>Causation:</b> requires <i>random assignment</i> to treatment/control.`,
      `<b>Random selection vs. random assignment:</b> the first makes results generalizable; the second makes them causal.`
    ]
  },
  {
    section: "Probability & Counting",
    items: [
      `<b>Basic:</b> \\(P(A)=\\dfrac{\\text{favorable}}{\\text{total}},\\ 0\\le P\\le 1.\\)`,
      `<b>Complement:</b> \\(P(A^c)=1-P(A).\\)`,
      `<b>Conditional:</b> \\(P(A|B)=\\dfrac{\\#(A\\cap B)}{\\#B}.\\)`,
      `<b>Independent events:</b> \\(P(A\\cap B)=P(A)\\cdot P(B).\\)`,
      `<b>Integers in \\([L,U]\\):</b> \\(U-L+1.\\)`,
      `<b>Multiples of \\(k\\) in \\([L,U]\\):</b> \\(\\lfloor U/k\\rfloor-\\lceil L/k\\rceil+1.\\)`
    ]
  },
  {
    section: "Unit Conversion",
    items: [
      `<b>Factor-label method:</b> multiply by "1" fractions that cancel unwanted units.`,
      `<b>Linear → area:</b> square the linear factor.`,
      `<b>Linear → volume:</b> cube the linear factor.`,
      `<b>Common time:</b> 1 min = 60 s; 1 hr = 3600 s; 1 day = 86400 s.`,
      `<b>Length (to memorize):</b> 1 in = 2.54 cm = 0.254 dm; 1 ft = 12 in = 0.3048 m; 1 mi ≈ 1.609 km.`
    ]
  }
];
