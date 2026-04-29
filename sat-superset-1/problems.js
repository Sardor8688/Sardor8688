// All 40 problems from "Super Set 1 [SAT Math]" with full walkthroughs.
// Per the user's instruction, final numerical answers are hidden behind a
// "Reveal final answer" button so the student does the final computation.
window.PROBLEMS = [
{
  id: 1,
  topic: "Linear Systems — Dependent Equations",
  statement: String.raw`$$5x - 3y = 8 \\ -40x + 24y = -64$$
For each real number \(r\), which of the following points lies on the graph of <b>each</b> equation for the given system?
<ul class="choices">
<li>A) \(\left(-\dfrac{r}{8}-8,\ \dfrac{r}{8}+64\right)\)</li>
<li>B) \(\left(-\dfrac{3r}{5}+8,\ \dfrac{3r}{5}-64\right)\)</li>
<li>C) \(\left(\dfrac{3r}{5}+\dfrac{8}{5},\ r\right)\)</li>
<li>D) \(\left(r,\ \dfrac{5r}{3}+\dfrac{8}{3}\right)\)</li>
</ul>`,
  concepts: String.raw`<b>Dependent system:</b> Two linear equations describe the <i>same line</i> when one is a scalar multiple of the other. Every point on that one line is a solution.
<br><br><b>Parametrization:</b> For a single linear equation in two variables, you can let one variable equal a parameter (like \(r\)) and solve for the other. This produces an infinite family of points, all on the line.`,
  walkthrough: String.raw`<ol>
<li>Test whether the two equations are proportional. Multiply the first equation by \(-8\): \(-8(5x-3y)=-8(8)\) gives \(-40x+24y=-64\), which is <b>identical</b> to the second equation.</li>
<li>So the system has infinitely many solutions — every point on \(5x-3y=8\) satisfies both.</li>
<li>To match the choices, parametrize. Let \(y=r\) and solve for \(x\): \(5x=8+3r\Rightarrow x=\dfrac{3r+8}{5}=\dfrac{3r}{5}+\dfrac{8}{5}.\)</li>
<li>Compare \(\left(\dfrac{3r}{5}+\dfrac{8}{5},\ r\right)\) with the answer choices.</li>
<li><b>Verification tip:</b> Pick any other answer choice and plug into \(5x-3y=8\). If both sides don't match for all \(r\), that choice is wrong.</li>
</ol>`,
  formulas: String.raw`• Two lines \(a_1x+b_1y=c_1\) and \(a_2x+b_2y=c_2\) are the <b>same line</b> iff \(\dfrac{a_1}{a_2}=\dfrac{b_1}{b_2}=\dfrac{c_1}{c_2}\).`,
  tip: String.raw`Always scan a two-equation system first: are the left-hand coefficients proportional? If yes, check the constants. If the full ratio matches → same line (infinite solutions); if only the coefficients match → parallel (no solution).`,
  answer: "C"
},
{
  id: 2,
  topic: "Linear Systems — No Solution Conditions",
  statement: String.raw`$$\tfrac{5}{2}x-\tfrac{19}{4}y=x-6 \\ \tfrac{89}{9}y+px=5r-\tfrac{2}{3}y$$
If the system has no solution, which must be true?<br>
I) \(p=\tfrac{19}{4}\) &nbsp; II) \(p=-\tfrac{10}{3}\) &nbsp; III) \(r=-30\) &nbsp; IV) \(3r\ne 8\)<br>
A) I and III &nbsp; B) II and IV &nbsp; C) III and IV &nbsp; D) I and IV`,
  concepts: String.raw`<b>No solution = parallel lines:</b> Two lines in \(Ax+By=C\) form are parallel (no intersection) when the coefficients of \(x\) and \(y\) are proportional <b>but the constants are not</b> in the same ratio:
$$\frac{A_1}{A_2}=\frac{B_1}{B_2}\ne\frac{C_1}{C_2}.$$`,
  walkthrough: String.raw`<ol>
<li>Rewrite Equation 1 in \(Ax+By=C\) form. Move \(x\) left: \(\left(\tfrac52-1\right)x-\tfrac{19}{4}y=-6\Rightarrow \tfrac{3}{2}x-\tfrac{19}{4}y=-6.\)</li>
<li>Rewrite Equation 2. Move \(-\tfrac23 y\) left: \(px+\left(\tfrac{89}{9}+\tfrac{2}{3}\right)y=5r\Rightarrow px+\tfrac{95}{9}y=5r.\)</li>
<li>Set the \(x\) and \(y\) coefficient ratios equal to pin down \(p\):
$$\dfrac{3/2}{p}=\dfrac{-19/4}{95/9}.$$
Simplify the right side: \(\tfrac{-19}{4}\cdot\tfrac{9}{95}=-\tfrac{9}{20}\). Solve \(\tfrac{3}{2p}=-\tfrac{9}{20}\) to get a clean value of \(p\). Which statement (I or II) matches?</li>
<li>Now enforce that the <b>constant ratio differs</b>: \(\dfrac{3/2}{p}\ne \dfrac{-6}{5r}\). Substitute the value of \(p\) you just found. Clear fractions and you will get an inequality of the form \(3r\ne\text{(something)}\).</li>
<li>Match the inequality on \(r\) to III or IV.</li>
</ol>`,
  formulas: String.raw`• Parallel lines condition: \(\dfrac{A_1}{A_2}=\dfrac{B_1}{B_2}\ne\dfrac{C_1}{C_2}\).
<br>• Same line (infinite solutions): all three ratios equal.`,
  tip: String.raw`Always push both equations into \(Ax+By=C\) form first. Don't try to compare slopes directly when the equations are in mixed forms — it invites sign errors.`,
  answer: "B (II and IV)"
},
{
  id: 3,
  topic: "Unit Conversion (Rates)",
  statement: String.raw`An artist shades drawings at 1.3 square inches per second. Convert this rate to <b>square decimeters per hour</b> (1 in = 0.254 dm). Round to the nearest tenth.`,
  concepts: String.raw`<b>Dimensional analysis (factor-label method):</b> multiply by fractions equal to 1 so the unwanted units cancel. For <i>areas</i>, you square the linear conversion. For <i>time</i>, multiply by \(\tfrac{60\text{ s}}{1\text{ min}}\cdot\tfrac{60\text{ min}}{1\text{ hr}}=3600\) seconds per hour.`,
  walkthrough: String.raw`<ol>
<li>Linear conversion: \(1\text{ in}=0.254\text{ dm}\).</li>
<li>Area conversion (square the linear factor): \(1\text{ in}^2 = (0.254)^2\text{ dm}^2\).</li>
<li>Time conversion: \(1\text{ hr}=3600\text{ s}\).</li>
<li>Chain them:
$$1.3\ \tfrac{\text{in}^2}{\text{s}}\times(0.254)^2\ \tfrac{\text{dm}^2}{\text{in}^2}\times 3600\ \tfrac{\text{s}}{\text{hr}}.$$</li>
<li>Multiply numerically and round to one decimal place.</li>
</ol>`,
  formulas: String.raw`• Area scaling: if linear factor is \(k\), area factor is \(k^2\), volume factor is \(k^3\).<br>
• 1 hour = 3600 seconds.`,
  tip: String.raw`Write units <i>as fractions</i> and cross them out visually. If your final unit string isn't \(\tfrac{\text{dm}^2}{\text{hr}}\), you made a setup error before touching any arithmetic.`,
  answer: "≈ 301.8 dm²/hr"
},
{
  id: 4,
  topic: "Exponential Growth — Solving for Time",
  statement: String.raw`$$A(t)=2400(1.75)^{\frac{6}{5}t}$$
\(A(t)\) models the account balance after \(t\) years. How long, in <b>months</b>, until \(A=4200\)?`,
  concepts: String.raw`<b>Exponential equation strategy:</b> To solve \(A\cdot b^{kt}=N\), isolate the exponential first: \(b^{kt}=\tfrac{N}{A}\). If \(\tfrac{N}{A}\) is itself a power of \(b\), equate exponents directly (no logs needed).
<br><br>\(1\text{ year}=12\text{ months}\).`,
  walkthrough: String.raw`<ol>
<li>Divide both sides by 2400: \((1.75)^{\frac{6}{5}t}=\dfrac{4200}{2400}=1.75.\)</li>
<li>Recognize the right side as \(1.75^{1}\). Since the bases match, set the exponents equal: \(\dfrac{6}{5}t=1.\)</li>
<li>Solve for \(t\) (in years).</li>
<li>Convert years to months by multiplying by 12.</li>
</ol>`,
  formulas: String.raw`• \(b^{m}=b^{n}\Rightarrow m=n\) (for \(b>0,\ b\ne 1\)).<br>
• 1 year = 12 months.`,
  tip: String.raw`Before reaching for logarithms, always check whether \(N/A\) is a <i>clean power</i> of the base. SAT favors setups where this works out nicely.`,
  answer: "10 months"
},
{
  id: 5,
  topic: "Piecewise Pricing — Linear Equation",
  statement: String.raw`An arcade charges &#36;9 per person for the first 28 people, then &#36;15 for each additional person. A group paid &#36;447. How many people attended?`,
  concepts: String.raw`<b>Piecewise cost model:</b> \(\text{Total}=(\text{base cost for first } n_0)+(\text{per-extra rate})\cdot(\text{extras})\). Solve for "extras", then add back \(n_0\).`,
  walkthrough: String.raw`<ol>
<li>Cost of the first 28 people: \(28\times 9\).</li>
<li>Let \(x\) be the number of extra people beyond 28. Total paid:
$$9(28)+15x=447.$$</li>
<li>Solve this linear equation for \(x\).</li>
<li>Total people = \(28+x\).</li>
</ol>`,
  formulas: String.raw`• Linear model: \(C=C_0+m\cdot(\text{extras})\).`,
  tip: String.raw`Always define your variable carefully — "extras beyond 28" vs. "total people". Mis-defining it causes off-by-28 errors.`,
  answer: "41 people"
},
{
  id: 6,
  topic: "Quadratics — Discriminant",
  statement: String.raw`Which quadratic has <b>no real solution</b>?<br>
A) \(49x^2-182x+169=0\) &nbsp; B) \(-4x^2-9x-11=0\) &nbsp; C) \(10x^2+7x-12=0\) &nbsp; D) \(57x^2-115x-42=0\)`,
  concepts: String.raw`<b>Discriminant</b> \(\Delta=b^2-4ac\) of \(ax^2+bx+c=0\):<br>
• \(\Delta>0\): two distinct real roots.<br>• \(\Delta=0\): one repeated real root.<br>• \(\Delta<0\): no real roots (two complex).`,
  walkthrough: String.raw`<ol>
<li>Compute \(b^2-4ac\) for each choice (signs matter — be careful with negatives).</li>
<li>A) \((-182)^2-4(49)(169)\). This is actually a perfect square: recognize \(49x^2-182x+169=(7x-13)^2\).</li>
<li>B) \((-9)^2-4(-4)(-11)=81-176\). Both \(a\) and \(c\) are negative so \(-4ac\) is negative — this is a classic way to force \(\Delta<0\).</li>
<li>C) \(7^2-4(10)(-12)=49+480\), clearly positive.</li>
<li>D) \((-115)^2-4(57)(-42)\), also clearly positive (the \(-4ac\) term adds to \(b^2\)).</li>
<li>Pick the one with \(\Delta<0\).</li>
</ol>`,
  formulas: String.raw`• Discriminant: \(\Delta=b^2-4ac\).<br>• Quadratic formula: \(x=\dfrac{-b\pm\sqrt{\Delta}}{2a}\).`,
  tip: String.raw`Shortcut: if \(a\) and \(c\) have the <i>same sign</i> and \(|b^2|\) is small, \(\Delta\) is likely negative. If \(a\) and \(c\) have <i>opposite signs</i>, \(\Delta\) is automatically positive (two real roots), so that option cannot be the answer.`,
  answer: "B"
},
{
  id: 7,
  topic: "Trig — Complementary Angle Identity",
  statement: String.raw`\(\sin(a^\circ)=\cos(b^\circ)\) where \(a,b>0\). The number \(a\) is 70% greater than \(b\). Find \(a\).`,
  concepts: String.raw`<b>Cofunction identity:</b> \(\sin(\theta)=\cos(90^\circ-\theta)\). So \(\sin(a^\circ)=\cos(b^\circ)\) implies \(a+b=90\) (when both are acute).
<br><br><b>Percent increase:</b> "\(a\) is 70% greater than \(b\)" means \(a=1.70\,b\).`,
  walkthrough: String.raw`<ol>
<li>From the cofunction identity: \(a+b=90.\)</li>
<li>From the percent phrasing: \(a=1.7\,b.\)</li>
<li>Substitute: \(1.7b+b=90\Rightarrow 2.7b=90.\)</li>
<li>Solve for \(b\), then compute \(a=1.7b\) (keep exact fractions for precision).</li>
</ol>`,
  formulas: String.raw`• \(\sin\theta=\cos(90^\circ-\theta)\).<br>• "\(p\%\) greater than \(b\)": \(a=\left(1+\tfrac{p}{100}\right)b\).`,
  tip: String.raw`Whenever you see \(\sin(x)=\cos(y)\) on the SAT, your first reflex should be \(x+y=90\). It appears almost every test.`,
  answer: "a = 170/3 ≈ 56.67"
},
{
  id: 8,
  topic: "Absolute Value Equations",
  statement: String.raw`$$f(x)=|8-5x|$$
For what value of \(k\) does \(f(k)=6k+3\)?`,
  concepts: String.raw`<b>Absolute value equation</b> \(|E|=R\): has solutions only when \(R\ge 0\); then split into \(E=R\) or \(E=-R\). Every candidate solution must be <b>checked</b> against the non-negativity requirement on \(R\).`,
  walkthrough: String.raw`<ol>
<li>Set up: \(|8-5k|=6k+3\).</li>
<li>Domain constraint: the right side must be non-negative, so \(6k+3\ge 0\Rightarrow k\ge-\tfrac{1}{2}.\)</li>
<li>Case 1: \(8-5k=6k+3\). Solve for \(k\); check it satisfies \(k\ge-\tfrac{1}{2}\).</li>
<li>Case 2: \(8-5k=-(6k+3)\). Solve for \(k\); check the constraint.</li>
<li>Discard any candidate that fails the domain check.</li>
</ol>`,
  formulas: String.raw`• \(|E|=R\Leftrightarrow (R\ge 0)\land(E=R\text{ or }E=-R).\)`,
  tip: String.raw`Always impose \(R\ge 0\) before you split into cases. Many students split first and accept an extraneous root. Write the constraint at the top of the work so you don't forget.`,
  answer: "k = 5/11"
},
{
  id: 9,
  topic: "Experimental Design — Random Assignment",
  statement: String.raw`Two schools (76 students each) are compared: one school gets Tutorllini videos, the other doesn't. How should the experiment be changed so we can conclude whether the videos <b>cause</b> score improvement?<br>
A) All 152 should use the videos.<br>
B) One school should study without a calculator.<br>
C) Half of the students from <b>each school</b> should be randomly assigned to each study plan.<br>
D) No changes needed.`,
  concepts: String.raw`<b>Causal conclusions</b> require <b>random assignment</b> of individuals to treatment and control groups. Assigning treatment by <i>school</i> introduces <b>confounding</b>: the two schools could differ in teacher quality, resources, baseline scores, etc.
<br><br><b>Random selection</b> ≠ <b>random assignment</b>. The first supports generalization to a population; the second supports causal inference.`,
  walkthrough: String.raw`<ol>
<li>A) gives everyone treatment, leaving no control group — you can't compare.</li>
<li>B) introduces a new confounding variable (calculator) that has nothing to do with the research question.</li>
<li>C) randomly assigns individuals to treatment/control <i>within each school</i>, neutralizing school-level confounding.</li>
<li>D) keeps the confounded design — causal claims would be invalid.</li>
<li>Choose the option that implements random assignment at the individual level.</li>
</ol>`,
  formulas: String.raw`• Generalization requires random <i>selection</i>.<br>• Causation requires random <i>assignment</i>.`,
  tip: String.raw`When an SAT question asks "how do we conclude the treatment <i>causes</i> the outcome?", search the choices for the words "randomly assigned".`,
  answer: "C"
},
{
  id: 10,
  topic: "Circle Equation — Complete the Square",
  statement: String.raw`$$3x^2+18x+3y^2-6y-15=0$$
The circle is inscribed in a square. Find the area of the square.`,
  concepts: String.raw`<b>Standard form of a circle:</b> \((x-h)^2+(y-k)^2=r^2\) with center \((h,k)\) and radius \(r\).
<br><br><b>Inscribed circle in a square:</b> the circle's <b>diameter equals the square's side</b>. Area of square \(=(2r)^2=4r^2.\)`,
  walkthrough: String.raw`<ol>
<li>Divide the entire equation by 3 to normalize the \(x^2\) and \(y^2\) coefficients: \(x^2+6x+y^2-2y-5=0.\)</li>
<li>Complete the square on \(x\): \(x^2+6x=(x+3)^2-9.\)</li>
<li>Complete the square on \(y\): \(y^2-2y=(y-1)^2-1.\)</li>
<li>Combine: \((x+3)^2+(y-1)^2=5+9+1=15.\) So \(r^2=15.\)</li>
<li>Area of the square \(=(2r)^2=4r^2.\) Plug in.</li>
</ol>`,
  formulas: String.raw`• Circle: \((x-h)^2+(y-k)^2=r^2\).<br>• Square with inscribed circle of radius \(r\): side \(=2r\), area \(=4r^2\).`,
  tip: String.raw`If the equation has coefficients bigger than 1 on \(x^2\) and \(y^2\) (and they're equal), <i>divide first</i>. Never try to complete the square without a leading coefficient of 1.`,
  answer: "60"
},
{
  id: 11,
  topic: "Quadratic Motion — Vertex Form",
  statement: String.raw`An object is launched from an elevated surface. It hits the ground at \(t=16\) s and reaches its max height of 1296 ft at \(t=7\) s. At what time does it <b>first</b> reach 972 ft?`,
  concepts: String.raw`<b>Vertex form of a parabola:</b> \(h(t)=a(t-t_v)^2+h_{\max}\). The vertex \((t_v,h_{\max})\) is the maximum for downward-opening parabolas.
<br><br><b>Symmetry:</b> A parabola is symmetric about its axis \(t=t_v\). If it hits a value once at \(t_1\), it hits the same value again at \(t_2=2t_v-t_1\).`,
  walkthrough: String.raw`<ol>
<li>Write \(h(t)=a(t-7)^2+1296.\)</li>
<li>Use the condition \(h(16)=0\) to solve for \(a\): \(a(16-7)^2+1296=0\Rightarrow 81a=-1296\Rightarrow a=-16.\)</li>
<li>So \(h(t)=-16(t-7)^2+1296.\)</li>
<li>Set \(h(t)=972\): \(-16(t-7)^2=972-1296=-324\Rightarrow (t-7)^2=\dfrac{324}{16}.\)</li>
<li>Take the square root (both \(\pm\)): \(t-7=\pm\tfrac{18}{4}=\pm 4.5.\)</li>
<li>"First reach" means the <b>smaller</b> \(t\): \(t=7-4.5.\)</li>
</ol>`,
  formulas: String.raw`• Vertex form: \(y=a(x-h)^2+k\).<br>• Projectile often modeled as \(h(t)=-16(t-t_v)^2+h_{\max}\) in feet.`,
  tip: String.raw`Remember: "first reaches height \(H\) on the way up" = smaller root; "reaches \(H\) on the way down" = larger root. Use the \(\pm\) and pick the right sign.`,
  answer: "t = 2.5 seconds"
},
{
  id: 12,
  topic: "Line Transformations & Intercepts",
  statement: String.raw`$$\frac{5x}{8}=-\frac{3y}{2}-\frac{11}{6}$$
The line is shifted 4 units <b>left</b> and 5 units <b>up</b>. What is the \(x\)-coordinate of the \(x\)-intercept of the new line?`,
  concepts: String.raw`<b>Horizontal shift</b> \(h\) to the left: replace \(x\) with \(x+h\).<br>
<b>Vertical shift</b> \(k\) up: replace \(y\) with \(y-k\).<br>
<b>\(x\)-intercept:</b> set \(y=0\) and solve for \(x\).`,
  walkthrough: String.raw`<ol>
<li>Clear fractions: multiply both sides by 24 (LCM of 8, 2, 6):
$$15x=-36y-44\Rightarrow 15x+36y=-44.$$</li>
<li>Shift 4 units left: replace \(x\) with \(x+4\). Shift 5 units up: replace \(y\) with \(y-5\).
$$15(x+4)+36(y-5)=-44.$$</li>
<li>Distribute and collect constants: \(15x+60+36y-180=-44\Rightarrow 15x+36y=76.\)</li>
<li>Set \(y=0\) to find the \(x\)-intercept: \(15x=76\).</li>
<li>Solve for \(x\).</li>
</ol>`,
  formulas: String.raw`• Shift transformations: \(y=f(x)\to y-k=f(x+h)\) shifts left \(h\), up \(k\).`,
  tip: String.raw`Most students forget to reverse the sign when shifting: "left 4" ⇒ \(x\to x+4\), not \(x-4\). Write the rule at the top of your work as a reminder.`,
  answer: "x = 76/15"
},
{
  id: 13,
  topic: "No-Solution System + Percent Decrease",
  statement: String.raw`$$\frac{3a}{8}x=\frac{3}{2}+\frac{15}{8}y \\ \frac{18}{7}y-4=\frac{4b}{7}x-9$$
\(a,b>0\), system has no solution, and \(b\) is \(p\%\) less than \(a\). Find \(p\).`,
  concepts: String.raw`<b>Parallel-line condition</b> again: coefficient ratios equal, constants differ.
<br><br><b>Percent decrease:</b> "\(b\) is \(p\%\) less than \(a\)" means \(b=a\left(1-\tfrac{p}{100}\right)\), equivalently \(\tfrac{b}{a}=1-\tfrac{p}{100}.\)`,
  walkthrough: String.raw`<ol>
<li>Put both equations in slope form \(y=mx+d\).
<br>Equation 1: \(\tfrac{3a}{8}x-\tfrac{15}{8}y=\tfrac{3}{2}\). Isolate \(y\): \(y=\tfrac{a}{5}x-\tfrac{4}{5}\). Slope \(=\tfrac{a}{5}\).
<br>Equation 2: \(\tfrac{18}{7}y=\tfrac{4b}{7}x-5\Rightarrow y=\tfrac{4b}{18}x-\tfrac{35}{18}=\tfrac{2b}{9}x-\tfrac{35}{18}\). Slope \(=\tfrac{2b}{9}\).</li>
<li>Parallel ⇒ \(\tfrac{a}{5}=\tfrac{2b}{9}\Rightarrow 9a=10b\Rightarrow b=\tfrac{9a}{10}.\)</li>
<li>So \(\tfrac{b}{a}=0.9\), meaning \(b\) is \((1-0.9)\cdot 100\%\) less than \(a\).</li>
<li>(Quickly verify the \(y\)-intercepts differ so the system is truly inconsistent, not the same line.)</li>
</ol>`,
  formulas: String.raw`• Parallel lines ⇔ same slope, different intercepts.<br>• Percent less: \(p=100\left(1-\tfrac{b}{a}\right)\).`,
  tip: String.raw`Slope-intercept form is fastest for "no solution" problems when both equations can be easily solved for \(y\). Standard form is better when they can't.`,
  answer: "p = 10"
},
{
  id: 14,
  topic: "Triangle Inequality",
  statement: String.raw`Sides of a triangle are \(4x+20\), \(2x+8\), \(7x-11\). Which inequality gives all valid \(x\)?<br>
A) \(x<39\) &nbsp; B) \(8<2x<78\) &nbsp; C) \(3<x<38\) &nbsp; D) \(23<5x<195\)`,
  concepts: String.raw`<b>Triangle Inequality Theorem:</b> for sides \(A,B,C\), all three of \(A+B>C,\ A+C>B,\ B+C>A\) must hold. Equivalently: <i>the largest side is less than the sum of the other two</i>.
<br><br>Also each side must be <b>positive</b>.`,
  walkthrough: String.raw`<ol>
<li>Write all three inequalities:
<br>(a) \((4x+20)+(2x+8)>(7x-11)\Rightarrow 6x+28>7x-11\Rightarrow x<39.\)
<br>(b) \((4x+20)+(7x-11)>(2x+8)\Rightarrow 11x+9>2x+8\Rightarrow 9x>-1\) (trivial for positive side lengths).
<br>(c) \((2x+8)+(7x-11)>(4x+20)\Rightarrow 9x-3>4x+20\Rightarrow 5x>23.\)</li>
<li>Combine the binding inequalities: \(5x>23\) and \(x<39\) ⇒ \(23<5x<195.\)</li>
<li>Match to the answer choice that has both bounds.</li>
</ol>`,
  formulas: String.raw`• Triangle inequality: \(|a-b|<c<a+b\) (the shortcut form).`,
  tip: String.raw`You don't need to check the positivity conditions separately if your final bounds already force all three sides to be positive — just verify at the end.`,
  answer: "D"
},
{
  id: 15,
  topic: "Circle Geometry + Cosine of an Angle",
  statement: String.raw`Circle centered at \(O(0,0)\). \(A=(25,0)\) is on the circle; \(B=(k,24)\) is on the circle with \(k<0\). Find \(\cos(\angle AOB)\).`,
  concepts: String.raw`<b>Circle radius:</b> every point on the circle is distance \(r\) from the center.
<br><br><b>Dot-product formula for angles:</b> \(\cos(\angle AOB)=\dfrac{\vec{OA}\cdot\vec{OB}}{|\vec{OA}|\,|\vec{OB}|}.\)`,
  walkthrough: String.raw`<ol>
<li>Radius: \(|OA|=25\). So every point on the circle satisfies \(x^2+y^2=625.\)</li>
<li>For \(B=(k,24)\): \(k^2+576=625\Rightarrow k^2=49\Rightarrow k=\pm7.\) Because \(k<0\), pick \(k=-7.\)</li>
<li>Vectors: \(\vec{OA}=\langle 25,0\rangle,\ \vec{OB}=\langle -7,24\rangle.\)</li>
<li>Dot product: \(\vec{OA}\cdot\vec{OB}=25(-7)+0(24)=-175.\)</li>
<li>Magnitudes: \(|\vec{OA}|=25,\ |\vec{OB}|=25.\)</li>
<li>\(\cos(\angle AOB)=\dfrac{-175}{25\cdot 25}=\dfrac{-175}{625}.\) Simplify the fraction.</li>
</ol>`,
  formulas: String.raw`• \(\vec{u}\cdot\vec{v}=u_xv_x+u_yv_y.\)<br>• \(|\vec{u}|=\sqrt{u_x^2+u_y^2}.\)`,
  tip: String.raw`When a point has a known \(y\)-coordinate on a circle \(x^2+y^2=r^2\), the \(x\)-coordinate is \(\pm\sqrt{r^2-y^2}\). Use the problem constraint (here \(k<0\)) to pick the sign.`,
  answer: "cos(∠AOB) = −7/25"
},
{
  id: 16,
  topic: "Geometric Probability",
  statement: String.raw`A circle is split into three non-overlapping regions: \(I=3\pi,\ II=15\pi,\ III=24\pi\) (square cm). If a point is selected uniformly at random, what is the probability it is <b>not</b> in region III?`,
  concepts: String.raw`<b>Geometric probability:</b> \(P=\dfrac{\text{favorable area}}{\text{total area}}.\)
<br><br><b>Complement rule:</b> \(P(\text{not }III)=1-P(III).\)`,
  walkthrough: String.raw`<ol>
<li>Total area \(=3\pi+15\pi+24\pi=42\pi.\)</li>
<li>Favorable area (not in III) \(=3\pi+15\pi=18\pi.\)</li>
<li>Probability \(=\dfrac{18\pi}{42\pi}.\) The \(\pi\) cancels — simplify the fraction.</li>
</ol>`,
  formulas: String.raw`• \(P(A)=\dfrac{\text{favorable}}{\text{total}}\). \(P(A^c)=1-P(A).\)`,
  tip: String.raw`Whenever π appears in both numerator and denominator, cancel it immediately — the SAT wants an exact fraction or decimal.`,
  answer: "3/7"
},
{
  id: 17,
  topic: "Conditional Probability",
  statement: String.raw`8 rows of apple trees (12 trees per row: 7 healthy, 5 unhealthy) and 6 rows of orange trees (12 trees per row: 3 healthy, 9 unhealthy). Pick a tree at random. Find \(P(\text{healthy}\mid \text{apple}).\)`,
  concepts: String.raw`<b>Conditional probability:</b> \(P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}=\dfrac{\#(A\cap B)}{\#B}.\) The condition <b>restricts the sample space</b> to \(B\).`,
  walkthrough: String.raw`<ol>
<li>Restrict attention to apple trees only (the condition \(B=\) "apple").</li>
<li>Total apple trees: \(8\times 12=96.\)</li>
<li>Healthy apple trees: \(8\times 7=56.\)</li>
<li>\(P(\text{healthy}\mid\text{apple})=\dfrac{56}{96}.\) Simplify.</li>
</ol>`,
  formulas: String.raw`• \(P(A\mid B)=\dfrac{\#(A\cap B)}{\#B}.\)`,
  tip: String.raw`When you see "given that…", <b>ignore</b> the counts from the other category. Don't be tempted to divide by the whole population.`,
  answer: "7/12"
},
{
  id: 18,
  topic: "Volume, Ratios, Concentration",
  statement: String.raw`Concentration = moles ÷ volume. Two cubic containers; the larger edge is 4× the smaller edge. Each contains 144 mol. The larger has concentration 3 mol/cm³. Find the positive difference in their volumes, in cm³.`,
  concepts: String.raw`<b>Concentration</b> \(=\dfrac{\text{moles}}{\text{volume}},\) so \(\text{volume}=\dfrac{\text{moles}}{\text{concentration}}.\)
<br><br><b>Volume scaling by linear factor \(k\):</b> volumes scale by \(k^3\).`,
  walkthrough: String.raw`<ol>
<li>Volume of the larger container: \(V_L=\dfrac{144}{3}=48\text{ cm}^3.\)</li>
<li>If the smaller edge is \(s\), then the larger edge is \(4s\). Volumes: \(V_S=s^3,\ V_L=(4s)^3=64s^3.\)</li>
<li>From \(V_L=48\): \(64s^3=48\Rightarrow s^3=\dfrac{48}{64}=\dfrac{3}{4}.\)</li>
<li>So \(V_S=\dfrac{3}{4}\text{ cm}^3.\)</li>
<li>Difference: \(V_L-V_S=48-\tfrac{3}{4}.\)</li>
</ol>`,
  formulas: String.raw`• Cube volume: \(V=s^3\).<br>• Linear factor \(k\) ⇒ area factor \(k^2\), volume factor \(k^3\).`,
  tip: String.raw`Concentration problems look chemistry-heavy but reduce to a single division. Identify the direct quantity first (here, \(V_L\)), then use the scaling to get the rest.`,
  answer: "47.25 cm³"
},
{
  id: 19,
  topic: "Parabolas — Axis of Symmetry",
  statement: String.raw`\(f(x)=ax^2+bx+c\). Given \(f(-11)=f(-1)\) and \(b\) is an integer with \(b<-3\), find the <b>greatest possible value</b> of \(a+b\).`,
  concepts: String.raw`<b>Symmetric values ⇒ axis of symmetry:</b> if \(f(x_1)=f(x_2)\), the axis of symmetry is \(x=\dfrac{x_1+x_2}{2}.\)
<br><br>For \(f(x)=ax^2+bx+c\), the axis is \(x=-\dfrac{b}{2a}.\)`,
  walkthrough: String.raw`<ol>
<li>Axis of symmetry: \(\dfrac{-11+(-1)}{2}=-6.\)</li>
<li>Set \(-\dfrac{b}{2a}=-6\Rightarrow b=12a.\)</li>
<li>Then \(a+b=a+12a=13a.\) To maximize, we want \(a\) as <b>large</b> as possible (closest to 0 from the negative side, since \(b=12a\) must be negative-and-less-than-\(-3\)).</li>
<li>\(b\) is an integer with \(b<-3\), so the largest allowed integer value of \(b\) is \(b=-4.\)</li>
<li>Then \(a=\tfrac{b}{12}=\tfrac{-4}{12}=-\tfrac{1}{3},\) and \(a+b=-\tfrac{1}{3}-4.\)</li>
</ol>`,
  formulas: String.raw`• Axis of symmetry of parabola: \(x=-\dfrac{b}{2a}.\)<br>• Equal outputs ⇒ symmetric about the average of the inputs.`,
  tip: String.raw`"Integer with \(b<-3\)" ≠ "\(b\le -4\)" with any small offset — it means the max integer is \(-4\). Always write the inequality out before guessing.`,
  answer: "a + b = −13/3"
},
{
  id: 20,
  topic: "Equilateral Triangle in a Circle",
  statement: String.raw`An equilateral triangle is inscribed in a circle of radius 8 in. Find the area <b>inside the circle but outside the triangle</b> (nearest tenth).`,
  concepts: String.raw`<b>Inscribed equilateral triangle:</b> side length \(s=r\sqrt{3}\) (where \(r\) is the circumradius).
<br><br><b>Area of equilateral triangle:</b> \(A=\dfrac{\sqrt{3}}{4}s^2.\)
<br><br><b>Area of circle:</b> \(A=\pi r^2.\)`,
  walkthrough: String.raw`<ol>
<li>Side \(s=8\sqrt{3}\).</li>
<li>Area of triangle: \(\dfrac{\sqrt{3}}{4}(8\sqrt{3})^2=\dfrac{\sqrt{3}}{4}(192)=48\sqrt{3}.\)</li>
<li>Area of circle: \(\pi(8)^2=64\pi.\)</li>
<li>Desired area \(=64\pi-48\sqrt{3}.\) Plug into a calculator.</li>
<li>Round to the nearest tenth.</li>
</ol>`,
  formulas: String.raw`• Inscribed equilateral: \(s=r\sqrt{3},\ A_\triangle=\tfrac{\sqrt{3}}{4}s^2=\tfrac{3\sqrt{3}}{4}r^2.\)<br>• Circle area: \(\pi r^2.\)`,
  tip: String.raw`Memorize \(\tfrac{3\sqrt{3}}{4}r^2\) as the direct formula for the area of an inscribed equilateral — saves a step.`,
  answer: "≈ 117.9 sq in"
},
{
  id: 21,
  topic: "Exponential Rewriting — Decay Rate",
  statement: String.raw`\(f(x)=5(0.92)^{3x}\) can be rewritten as \(f(x)=5\left(1-\tfrac{p}{100}\right)^{x}\). Which is closest to \(p\)?<br>
A) 8 &nbsp; B) 12 &nbsp; C) 22 &nbsp; D) 24`,
  concepts: String.raw`<b>Exponential equivalence:</b> \(b^{kx}=(b^k)^{x}.\) So "per \(x\)" decay rate = \(1-b^k\) (as a proportion).`,
  walkthrough: String.raw`<ol>
<li>Rewrite: \(5(0.92)^{3x}=5\bigl((0.92)^{3}\bigr)^{x}.\)</li>
<li>Compute \((0.92)^3\) (a quick calculator step).</li>
<li>Match: \(1-\tfrac{p}{100}=(0.92)^3\Rightarrow \tfrac{p}{100}=1-(0.92)^3.\)</li>
<li>Multiply by 100 and pick the nearest choice.</li>
</ol>`,
  formulas: String.raw`• \(b^{kx}=(b^k)^x.\)<br>• Decay rate over one unit of \(x\): \(1-(\text{base}).\)`,
  tip: String.raw`Watch carefully for "3x" vs "x": a factor of 3 in the exponent means the per-unit base is <b>cubed</b>, not tripled.`,
  answer: "C (≈ 22)"
},
{
  id: 22,
  topic: "Parabola Sign of \(a+b+c\)",
  statement: String.raw`A parabola has vertex \((-5,-12)\) and <b>no \(x\)-intercepts</b>. Written as \(y=ax^2+bx+c\), which could equal \(a+b+c\)?<br>
A) \(-19\) &nbsp; B) \(-12\) &nbsp; C) \(-10\) &nbsp; D) \(-5\)`,
  concepts: String.raw`<b>Vertex form:</b> \(y=a(x-h)^2+k\).
<br><br><b>No \(x\)-intercepts</b> combined with a vertex <i>below</i> the \(x\)-axis (i.e., \(k<0\)): the parabola must open <b>downward</b>, so \(a<0.\)
<br><br><b>Trick:</b> \(a+b+c=f(1)\) (plug \(x=1\) into the standard form).`,
  walkthrough: String.raw`<ol>
<li>Write in vertex form: \(y=a(x+5)^2-12.\)</li>
<li>\(k=-12<0\) and no \(x\)-intercepts ⇒ \(a<0.\)</li>
<li>Compute \(f(1)=a(6)^2-12=36a-12.\)</li>
<li>Since \(a<0\), \(36a<0\), so \(f(1)=36a-12<-12.\)</li>
<li>Pick the choice strictly less than \(-12\).</li>
</ol>`,
  formulas: String.raw`• \(f(1)=a+b+c\) for \(f(x)=ax^2+bx+c.\)<br>• \(f(-1)=a-b+c.\)<br>• \(f(0)=c.\)`,
  tip: String.raw`"Evaluate at \(x=1\)" is a classic SAT shortcut whenever you see \(a+b+c\), \(a-b+c\), or \(c\).`,
  answer: "A (−19)"
},
{
  id: 23,
  topic: "Projectile — First Time at a Height",
  statement: String.raw`A projectile starts at height 311 ft, reaches max 567 ft at \(t=4\) s. At what time does it <b>first</b> reach 518 ft?`,
  concepts: String.raw`Same as #11. Use vertex form. Solve the quadratic for \(t\); pick the smaller root for "first reach".`,
  walkthrough: String.raw`<ol>
<li>Vertex form: \(h(t)=a(t-4)^2+567\), with \(h(0)=311.\)</li>
<li>From \(a(16)+567=311\): \(a=\dfrac{311-567}{16}=\dfrac{-256}{16}=-16.\)</li>
<li>Set \(h(t)=518\): \(-16(t-4)^2+567=518\Rightarrow (t-4)^2=\dfrac{49}{16}.\)</li>
<li>\(t-4=\pm\tfrac{7}{4}.\) Take the smaller root (minus sign) for "first reach".</li>
<li>\(t=4-\tfrac{7}{4}.\)</li>
</ol>`,
  formulas: String.raw`• Vertex form: \(h(t)=a(t-t_v)^2+h_{\max}\).`,
  tip: String.raw`\(a=-16\) (ft/s² with a factor of \(\tfrac12\)) shows up repeatedly in Earth-based projectile questions on the SAT — recognize it and save setup time.`,
  answer: "t = 2.25 seconds"
},
{
  id: 24,
  topic: "Function Translation + Intercepts",
  statement: String.raw`$$f(x)=-ax+b$$
\(g\) is \(f\) translated 6 units left and 2 units down. The \(x\)-intercept of \(g\) is at \(x=-3\) and \(g(-6)=\dfrac{61}{64}.\) Find \(a\).`,
  concepts: String.raw`<b>Translations on a function \(f(x)\):</b>
<ul><li>Left \(h\): \(f(x+h)\)</li><li>Right \(h\): \(f(x-h)\)</li><li>Up \(k\): \(f(x)+k\)</li><li>Down \(k\): \(f(x)-k\)</li></ul>
<b>Intercept condition:</b> \(x\)-intercept at \(x_0\) ⇒ \(g(x_0)=0.\)`,
  walkthrough: String.raw`<ol>
<li>\(g(x)=f(x+6)-2=-a(x+6)+b-2=-ax-6a+b-2.\)</li>
<li>Use \(g(-3)=0\): \(3a-6a+b-2=0\Rightarrow -3a+b=2.\) <b>(Eq A)</b></li>
<li>Use \(g(-6)=\tfrac{61}{64}\): \(6a-6a+b-2=b-2=\tfrac{61}{64}\Rightarrow b=2+\tfrac{61}{64}=\tfrac{189}{64}.\)</li>
<li>Substitute \(b\) into (Eq A): \(-3a+\tfrac{189}{64}=2\Rightarrow 3a=\tfrac{189}{64}-\tfrac{128}{64}=\tfrac{61}{64}.\)</li>
<li>Solve for \(a\).</li>
</ol>`,
  formulas: String.raw`• Shift identities (see Concepts).<br>• A linear function has exactly one \(x\)-intercept when the slope ≠ 0.`,
  tip: String.raw`When translation shifts are applied, <b>first write the new function explicitly</b> before plugging in the intercept/value conditions. It avoids sign errors.`,
  answer: "a = 61/192"
},
{
  id: 25,
  topic: "Scope of Generalization",
  statement: String.raw`800 Nepalese SAT Math students were surveyed (randomly selected). What is the largest population the results can be generalized to?<br>
A) The 800 in the sample &nbsp; B) All Nepalese students &nbsp; C) All SAT Math students &nbsp; D) All Nepalese SAT Math students`,
  concepts: String.raw`<b>Generalization rule:</b> The conclusions of a study apply only to the <b>population from which the sample was randomly selected</b> — no wider.`,
  walkthrough: String.raw`<ol>
<li>Identify the population the sample was drawn from: <i>Nepalese SAT Math students</i>.</li>
<li>You cannot extrapolate to "all Nepalese students" (not all of them are SAT takers) or "all SAT Math students" (not all of them are Nepalese).</li>
<li>A) is too narrow — we can always generalize back to the sample; the question asks for the <i>largest</i> valid population.</li>
<li>The correct answer is the population in step 1.</li>
</ol>`,
  formulas: String.raw`• Scope of inference = the population randomly sampled.`,
  tip: String.raw`If the phrase describing the sampling frame is, e.g., "Nepalese SAT Math students", that exact phrase will appear in the right answer choice — mirror it.`,
  answer: "D"
},
{
  id: 26,
  topic: "No Solution in One Variable",
  statement: String.raw`$$a(x-5)+4b=7(b-5x)$$
If this has <b>no solution</b>, \(b\) cannot equal \(m\). Find \(m\).`,
  concepts: String.raw`A single linear equation in \(x\), \((\text{coef})x=(\text{const})\), has:
<ul><li><b>no solution</b> ⇔ coefficient \(=0\) AND constant \(\ne 0\),</li><li><b>infinite solutions</b> ⇔ both zero,</li><li><b>one solution</b> otherwise.</li></ul>`,
  walkthrough: String.raw`<ol>
<li>Expand: \(ax-5a+4b=7b-35x.\)</li>
<li>Collect \(x\) terms: \((a+35)x=7b-4b+5a=3b+5a.\)</li>
<li>No solution ⇒ \(a+35=0\) AND \(3b+5a\ne 0.\) So \(a=-35.\)</li>
<li>Substitute back: \(3b+5(-35)=3b-175\ne 0\Rightarrow b\ne \dfrac{175}{3}.\)</li>
<li>The forbidden value of \(b\) is therefore \(m=\dfrac{175}{3}.\)</li>
</ol>`,
  formulas: String.raw`• No solution for \(Ax=C\): \(A=0,\ C\ne 0.\)`,
  tip: String.raw`Whenever a one-variable equation has parameters, collect everything to the form \((\text{coef})x=(\text{const})\) first. The two cases (coef zero or not) become obvious.`,
  answer: "m = 175/3"
},
{
  id: 27,
  topic: "Min Value of Exponential on an Interval",
  statement: String.raw`$$I)\ f(x)=6.25(5.76)(0.4)^x \qquad II)\ g(x)=75(3.75)^{x-5}$$
where \(2\le x\le 5\). Which form displays, as a constant or coefficient, the <b>minimum</b> value of the function it defines on this interval?<br>
A) I only &nbsp; B) II only &nbsp; C) I and II &nbsp; D) Neither I nor II`,
  concepts: String.raw`For an exponential \(y=A\cdot b^{x}\):
<ul><li>If \(b>1\), the function is <b>increasing</b>: min at the left endpoint, max at the right.</li><li>If \(0<b<1\), the function is <b>decreasing</b>: min at the right endpoint, max at the left.</li></ul>
The form \(y=C\cdot b^{x-x_0}\) <i>displays</i> the value \(C\) at \(x=x_0\) (because \(b^0=1\)).`,
  walkthrough: String.raw`<ol>
<li>\(f(x)=6.25(5.76)(0.4)^x.\) Base \(0.4<1\) ⇒ decreasing ⇒ min at \(x=5.\) The form only displays \(6.25\cdot 5.76\) (which is \(f(0)\), the <b>max</b> on this interval, but this interval doesn't include 0 — and in any case \(x=0\) isn't on display either). There's no exponent like \(x-5\) to reveal the minimum.</li>
<li>\(g(x)=75(3.75)^{x-5}.\) Base \(3.75>1\) ⇒ increasing ⇒ min at \(x=2\), <b>max</b> at \(x=5.\) The "75" coefficient is \(g(5)\) (plug in: exponent becomes 0) — that's the maximum, not the minimum.</li>
<li>Neither form has a coefficient/constant equal to the interval minimum. Pick the "Neither" choice.</li>
</ol>`,
  formulas: String.raw`• Monotonicity of \(b^x\): increasing if \(b>1\), decreasing if \(0<b<1\).<br>• \(C\cdot b^{x-x_0}\) equals \(C\) when \(x=x_0.\)`,
  tip: String.raw`On "which form displays..." questions, ask: "which displayed number equals the function value at an <b>endpoint</b>?" Then check whether that endpoint is the min or the max.`,
  answer: "D (Neither)"
},
{
  id: 28,
  topic: "Mixture Problems",
  statement: String.raw`125 L mixture is 45% juice. Solution A is 24% juice, Solution B is 64% juice. Let \(a,b\) be the liters of juice from A and B respectively. If \(a\) is \(p\%\) less than \(b\), find \(p\) (to nearest hundredth).`,
  concepts: String.raw`<b>Conservation of "juice":</b> total juice from A plus total juice from B equals total juice in the mixture.
<br><br><b>Conservation of volume:</b> volumes add.
<br><br><b>Percent less:</b> \(a=b\left(1-\tfrac{p}{100}\right).\)`,
  walkthrough: String.raw`<ol>
<li>Let \(V_A,V_B\) = volumes of solutions A and B. \(V_A+V_B=125.\)</li>
<li>Total juice: \(0.24V_A+0.64V_B=0.45(125)=56.25.\)</li>
<li>Solve the 2×2 system for \(V_A,V_B\). Then \(a=0.24V_A\) and \(b=0.64V_B.\)</li>
<li>Compute \(\dfrac{a}{b}=1-\dfrac{p}{100}\Rightarrow p=100\left(1-\dfrac{a}{b}\right).\)</li>
<li>Round to 2 decimal places.</li>
</ol>`,
  formulas: String.raw`• Mixture: \(c_1V_1+c_2V_2=c_{\text{mix}}(V_1+V_2).\)`,
  tip: String.raw`Set up mixture problems with two equations — volume and concentration — even when only one unknown is asked about. It prevents confusion about what each variable means.`,
  answer: "p ≈ 66.07"
},
{
  id: 29,
  topic: "Similar Triangles in a Right Triangle",
  statement: String.raw`Right triangle \(DEF\) with right angle at \(F\). \(Q\) on \(DE\), \(J\) on \(EF\), \(QJ\parallel DF\). \(EF=45\), \(FJ=24\), area \(=630\). Find the perimeter of \(\triangle QEJ\).`,
  concepts: String.raw`<b>Parallel line inside a triangle ⇒ similar triangles</b> (AA similarity). \(QJ\parallel DF\Rightarrow \triangle QEJ\sim\triangle DEF.\)
<br><br><b>Scale factor:</b> the ratio of corresponding sides is the same for every pair. Perimeter scales by the same factor; area scales by the square of that factor.`,
  walkthrough: String.raw`<ol>
<li>Find \(DF\) using the area: \(\tfrac{1}{2}(EF)(DF)=630\Rightarrow DF=\dfrac{2\cdot 630}{45}=28.\)</li>
<li>Hypotenuse \(DE=\sqrt{EF^2+DF^2}=\sqrt{45^2+28^2}=\sqrt{2025+784}=\sqrt{2809}=53.\)</li>
<li>Perimeter of \(DEF=45+28+53=126.\)</li>
<li>\(EJ=EF-FJ=45-24=21.\) Scale factor \(k=\dfrac{EJ}{EF}=\dfrac{21}{45}=\dfrac{7}{15}.\)</li>
<li>Perimeter of \(QEJ=126\cdot\dfrac{7}{15}.\)</li>
</ol>`,
  formulas: String.raw`• Pythagorean: \(a^2+b^2=c^2.\)<br>• Similar figures: perimeters scale by \(k\); areas by \(k^2\).`,
  tip: String.raw`Memorize common Pythagorean triples like (28, 45, 53) and (7, 24, 25). Recognizing them on sight saves 30+ seconds.`,
  answer: "58.8"
},
{
  id: 30,
  topic: "Axis of Symmetry and Vertex of a Quadratic",
  statement: String.raw`$$f(x)=ax^2-7x+c,\quad c>0,\ f(-9)=f(-2).$$
Which must be true?<br>I) \(a<-\tfrac{3}{4}\) &nbsp; II) \(k>16\) (where \(k\) is the vertex \(y\)-coordinate)<br>
A) I only &nbsp; B) II only &nbsp; C) I and II &nbsp; D) Neither`,
  concepts: String.raw`Equal outputs ⇒ axis \(x=\dfrac{-9+(-2)}{2}=-\dfrac{11}{2}.\)
<br>Axis formula: \(x=-\dfrac{b}{2a}.\)
<br>Vertex \(y\)-coordinate: \(k=f\!\left(-\dfrac{b}{2a}\right).\)`,
  walkthrough: String.raw`<ol>
<li>Set \(-\dfrac{-7}{2a}=-\dfrac{11}{2}\Rightarrow \dfrac{7}{2a}=-\dfrac{11}{2}\Rightarrow 2a\cdot(-11)=14\Rightarrow a=-\dfrac{7}{11}.\)</li>
<li>Check I: is \(-\tfrac{7}{11}<-\tfrac{3}{4}\)? Convert to decimals: \(-0.636\) vs \(-0.75\). Since \(-0.636>-0.75,\) I is <b>false</b>.</li>
<li>Compute \(k=f(-\tfrac{11}{2})=a\cdot\tfrac{121}{4}-7\cdot(-\tfrac{11}{2})+c.\) Simplify: \(\tfrac{121a}{4}+\tfrac{77}{2}+c.\)</li>
<li>Plug \(a=-\tfrac{7}{11}\): \(\tfrac{121(-7/11)}{4}+\tfrac{77}{2}+c=-\tfrac{77}{4}+\tfrac{154}{4}+c=\tfrac{77}{4}+c.\) That's \(19.25+c.\)</li>
<li>Since \(c>0,\) \(k>19.25>16\). II is <b>true</b>.</li>
</ol>`,
  formulas: String.raw`• Axis: \(x=-\dfrac{b}{2a}.\)<br>• Symmetry: \(f(x_1)=f(x_2)\Rightarrow\) axis at \(\dfrac{x_1+x_2}{2}.\)`,
  tip: String.raw`Converting fractions to decimals is the safest way to compare magnitudes with negatives — a common SAT trap.`,
  answer: "B (II only)"
},
{
  id: 31,
  topic: "Counting + Probability",
  statement: String.raw`\(W\) = positive integers \(\le 180\). A number is selected at random. Find \(P(\text{even and}\le 40).\)`,
  concepts: String.raw`<b>Uniform probability on a finite set:</b> \(P=\dfrac{|\text{favorable}|}{|\text{total}|}.\)
<br>Even positive integers up to \(N\) number \(\lfloor N/2\rfloor.\)`,
  walkthrough: String.raw`<ol>
<li>Total \(|W|=180.\)</li>
<li>Count even positive integers \(\le 40\): \(2,4,6,\dots,40\). That's \(40/2=20\) numbers.</li>
<li>\(P=\dfrac{20}{180}.\) Simplify.</li>
</ol>`,
  formulas: String.raw`• Even integers in \([1,N]\): \(\lfloor N/2\rfloor.\)`,
  tip: String.raw`Reduce fractions in one step by dividing numerator and denominator by their GCD (here 20).`,
  answer: "1/9"
},
{
  id: 32,
  topic: "Exponential Growth Factor",
  statement: String.raw`For a function \(f\), each increase in \(x\) by 8 multiplies \(f\) by a factor \(r\). Which form <b>displays \(r\)</b> as a constant or coefficient?<br>
A) \(f(x)=16\bigl(4^{3/7}\bigr)^{7x/24}\)<br>
B) \(f(x)=16(64)^{x/24}\)<br>
C) \(f(x)=16\bigl(32^{7/2}\bigr)^{x/70}\)<br>
D) \(f(x)=16\bigl(512^{13x/9}\bigr)^{1/52}\)`,
  concepts: String.raw`We want the form \(f(x)=A\cdot r^{x/8},\) where \(r\) is the growth factor per 8-unit increase (because then \(f(x+8)/f(x)=r\)).
<br>Simplify each choice to that shape by combining the exponents.`,
  walkthrough: String.raw`<ol>
<li>Use the rule \((b^m)^n=b^{mn}\) to collapse each expression into \(16\cdot b^{(\text{exp in }x)}.\)</li>
<li>A) \(\bigl(4^{3/7}\bigr)^{7x/24}=4^{(3/7)(7/24)x}=4^{x/8}.\) So \(f(x)=16\cdot 4^{x/8}\) — this is exactly \(A\cdot r^{x/8}\) with the displayed base \(4\) serving as \(r.\)</li>
<li>B) \(64^{x/24}=(64^{1/3})^{x/8}=4^{x/8}.\) Same \(r=4\), but <i>displayed</i> base is 64, not \(r\).</li>
<li>C) \(\bigl(32^{7/2}\bigr)^{x/70}=32^{x/20}=(32^{2/5})^{x/8}=4^{x/8}.\) Displayed is 32, not \(r\).</li>
<li>D) \(\bigl(512^{13x/9}\bigr)^{1/52}=512^{x/36}=(512^{2/9})^{x/8}=4^{x/8}.\) Displayed is 512, not \(r\).</li>
<li>Pick the option where the <b>displayed base IS \(r\)</b>.</li>
</ol>`,
  formulas: String.raw`• \((b^m)^n=b^{mn}.\)<br>• If \(f(x)=A\cdot r^{x/p}\), then \(f(x+p)=r\cdot f(x).\)`,
  tip: String.raw`For "displays as a constant" questions, always convert every choice into the canonical \(A\cdot r^{x/p}\) form with the target period \(p\) in the denominator. The winning choice is the one whose displayed base equals \(r\) once the exponent reduces to \(x/p\).`,
  answer: "A"
},
{
  id: 33,
  topic: "Vieta's Formulas",
  statement: String.raw`$$-13x^2-(15b+7a)x+(20a+16b)=0$$
\(a,b>0.\) The product of the solutions is \(k(5a+4b)\). Find \(k\).`,
  concepts: String.raw`<b>Vieta's formulas for \(Ax^2+Bx+C=0\):</b>
<ul><li>Sum of roots: \(-\dfrac{B}{A}\)</li><li>Product of roots: \(\dfrac{C}{A}\)</li></ul>`,
  walkthrough: String.raw`<ol>
<li>Here \(A=-13,\ C=20a+16b.\)</li>
<li>Product of roots \(=\dfrac{C}{A}=\dfrac{20a+16b}{-13}.\)</li>
<li>Factor the numerator: \(20a+16b=4(5a+4b).\) So product \(=\dfrac{4(5a+4b)}{-13}=-\dfrac{4}{13}(5a+4b).\)</li>
<li>Identify \(k=-\dfrac{4}{13}.\)</li>
</ol>`,
  formulas: String.raw`• Vieta: product \(=\tfrac{C}{A},\) sum \(=-\tfrac{B}{A}.\)`,
  tip: String.raw`Don't solve for the roots with the quadratic formula if the problem only asks for sum or product — Vieta is instant.`,
  answer: "k = −4/13"
},
{
  id: 34,
  topic: "Counting — Probability of a Range",
  statement: String.raw`1000 four-digit numbers from 3000 to 3999 are in a bag. Find \(P(\text{number}>3499).\)`,
  concepts: String.raw`<b>Integer counting in \([L,U]\):</b> there are \(U-L+1\) integers.`,
  walkthrough: String.raw`<ol>
<li>Numbers greater than 3499 in the range 3000–3999 are \(3500,3501,\dots,3999.\)</li>
<li>Count: \(3999-3500+1=500.\)</li>
<li>\(P=\dfrac{500}{1000}.\) Simplify.</li>
</ol>`,
  formulas: String.raw`• \(|\{L,L+1,\dots,U\}|=U-L+1.\)`,
  tip: String.raw`"Greater than 3499" excludes 3499 but <b>includes 3500</b>. Always double-check your endpoint when translating English into a count.`,
  answer: "1/2"
},
{
  id: 35,
  topic: "Triangle Similarity Criteria",
  statement: String.raw`Triangles \(PQR\) and \(XYZ\): \(\angle R=\angle Z=38^\circ\), \(QR=11\), \(YZ=27.5\). Which extra info proves \(\triangle PQR\sim\triangle XYZ\)?<br>
A) \(\angle P=46^\circ\)<br>
B) \(PR=14\) and \(XZ=35\)<br>
C) \(\angle Q=49^\circ\) and \(\angle Y=94^\circ\)<br>
D) No additional information is necessary`,
  concepts: String.raw`<b>Triangle similarity criteria:</b> AA (two angles), SAS (two proportional sides with the <i>included angle</i> congruent), SSS (all three sides proportional).`,
  walkthrough: String.raw`<ol>
<li>We already have \(\angle R\cong\angle Z.\) Two sides given: \(QR\) is adjacent to \(\angle R\); \(YZ\) is adjacent to \(\angle Z.\) Their ratio: \(\dfrac{11}{27.5}=\dfrac{2}{5}.\)</li>
<li>A) Extra angle in just one triangle — doesn't force similarity (we'd need a matching angle in the other).</li>
<li>B) \(PR\) is also adjacent to \(\angle R\), and \(XZ\) is adjacent to \(\angle Z.\) The angle \(\angle R\) is <b>included</b> between \(PR\) and \(QR\); same for \(XZ\) and \(YZ.\) Check the ratio: \(\dfrac{14}{35}=\dfrac{2}{5}.\) Match with \(\dfrac{QR}{YZ}=\dfrac{2}{5}.\) SAS similarity ✓</li>
<li>C) \(\angle P=180-38-49=93^\circ,\ \angle X=180-38-94=48^\circ.\) Not equal ⇒ triangles are <b>not</b> similar.</li>
<li>D) The info given is only one pair of angles and one ratio of sides — not enough.</li>
</ol>`,
  formulas: String.raw`• AA, SAS, SSS similarity criteria.<br>• Angle sum in a triangle \(=180^\circ.\)`,
  tip: String.raw`"Included angle" is the angle <b>between</b> the two sides being compared. SAS similarity fails if the angle isn't between the two proportional sides.`,
  answer: "B"
},
{
  id: 36,
  topic: "Probability — Multiples in a Range",
  statement: String.raw`Whole numbers 7 to 28 (inclusive) on 22 slips. A slip is drawn at random. What's the probability its number is a multiple of 13?`,
  concepts: String.raw`<b>Multiples of \(k\) in \([L,U]\):</b> count \(=\lfloor U/k\rfloor-\lceil L/k\rceil+1.\)`,
  walkthrough: String.raw`<ol>
<li>Multiples of 13 between 7 and 28: \(13\) and \(26.\) Count \(=2.\)</li>
<li>Total slips \(=22.\)</li>
<li>\(P=\dfrac{2}{22}.\) Simplify.</li>
</ol>`,
  formulas: String.raw`• Multiples counting formula above.`,
  tip: String.raw`For small ranges, just list the multiples mentally — don't over-engineer with the formula.`,
  answer: "1/11"
},
{
  id: 37,
  topic: "Probability — Fundamental Axiom",
  statement: String.raw`Which of the following <b>cannot</b> be a probability?<br>
A) \(-0.3\) &nbsp; B) 0.25 &nbsp; C) 0.99 &nbsp; D) 1`,
  concepts: String.raw`<b>Axiom of probability:</b> for any event \(E\), \(0\le P(E)\le 1.\) Negative numbers and numbers greater than 1 are invalid.`,
  walkthrough: String.raw`<ol>
<li>Scan each option for violations of \(0\le P\le 1.\)</li>
<li>A negative number is out immediately.</li>
<li>\(P=1\) is a valid probability (the event is certain).</li>
</ol>`,
  formulas: String.raw`• \(P(\emptyset)=0,\ P(\Omega)=1,\ 0\le P(E)\le 1.\)`,
  tip: String.raw`The only two ways a "value" can be invalid as a probability on the SAT are (i) negative, or (ii) greater than 1.`,
  answer: "A"
},
{
  id: 38,
  topic: "Radical Equations — One Real Solution",
  statement: String.raw`$$9+x=\sqrt{5x-4k+3}$$
Exactly one real solution. Find the <b>maximum</b> possible value of \(48k\).`,
  concepts: String.raw`<b>Squaring to solve radical equations:</b> introduces possible extraneous roots. Always enforce \(9+x\ge 0\) (because the right side is a principal square root).
<br><br>After squaring, you get a quadratic. "Exactly one solution" of the original can come from two scenarios:
<ol type="i"><li>The quadratic has a <b>double root</b> that satisfies \(x\ge-9\);</li>
<li>The quadratic has <b>two distinct roots</b>, but only one satisfies \(x\ge-9\).</li></ol>`,
  walkthrough: String.raw`<ol>
<li>Square: \((9+x)^2=5x-4k+3\Rightarrow x^2+18x+81=5x-4k+3\Rightarrow x^2+13x+(78+4k)=0.\)</li>
<li>Discriminant: \(\Delta=169-4(78+4k)=-143-16k.\)</li>
<li><b>Case (i): \(\Delta=0.\)</b> Then \(k=-\tfrac{143}{16}.\) Double root \(x=-\tfrac{13}{2}.\) Check \(x\ge -9\): \(-6.5\ge -9\) ✓. So \(48k=48\cdot\left(-\tfrac{143}{16}\right)=3\cdot(-143).\)</li>
<li><b>Case (ii): \(\Delta>0\)</b> but only one root satisfies \(x\ge -9.\) Roots: \(x=\tfrac{-13\pm\sqrt{\Delta}}{2}.\) The larger one is \(\ge -9\) automatically (for \(\Delta\ge 0\)); the smaller one fails when \(\tfrac{-13-\sqrt{\Delta}}{2}<-9\iff \sqrt{\Delta}>5\iff\Delta>25.\) That requires \(-143-16k>25\Rightarrow k<-10.5,\) so \(48k<48(-10.5)=-504.\)</li>
<li>Compare cases for the max of \(48k\): case (i) gives \(-429\), case (ii) gives values less than \(-504.\) Maximum is case (i).</li>
</ol>`,
  formulas: String.raw`• Quadratic discriminant \(\Delta=b^2-4ac.\)<br>• Domain constraint on radical equations: the side equated to \(\sqrt{\cdot}\) must be \(\ge 0.\)`,
  tip: String.raw`Never forget the non-negativity constraint on the non-radical side. Forgetting it is the #1 reason people "lose" correct answers on radical equation problems.`,
  answer: "48k = −429"
},
{
  id: 39,
  topic: "Radical Simplification",
  statement: String.raw`$$\sqrt{48}\cdot\sqrt[5]{81}$$
Rewrite as \(a\sqrt[b]{c}\) where \(a,b,c\) are positive integers. Find the smallest possible value of \(a+b+c\).`,
  concepts: String.raw`<b>Convert radicals to fractional exponents:</b> \(\sqrt[n]{x^m}=x^{m/n}.\)
<br><b>Common denominator:</b> Combine \(\sqrt{}\) and \(\sqrt[5]{}\) using a common denominator of 10.`,
  walkthrough: String.raw`<ol>
<li>Simplify each: \(\sqrt{48}=\sqrt{16\cdot 3}=4\sqrt{3}=4\cdot 3^{1/2}.\) And \(\sqrt[5]{81}=81^{1/5}=3^{4/5}.\)</li>
<li>Combine: \(4\cdot 3^{1/2}\cdot 3^{4/5}=4\cdot 3^{1/2+4/5}=4\cdot 3^{13/10}.\)</li>
<li>Split the exponent into integer and fractional parts: \(3^{13/10}=3^1\cdot 3^{3/10}.\) So the expression equals \(4\cdot 3\cdot 3^{3/10}=12\cdot 3^{3/10}.\)</li>
<li>Rewrite \(3^{3/10}=(3^3)^{1/10}=\sqrt[10]{27}.\) Therefore the expression is \(12\sqrt[10]{27}.\)</li>
<li>Identify \(a=12,\ b=10,\ c=27.\) Compute \(a+b+c.\)</li>
<li>Check minimality: since \(\gcd(13,10)=1,\) the root index cannot drop below 10, so this is optimal.</li>
</ol>`,
  formulas: String.raw`• \(\sqrt[n]{x^m}=x^{m/n}.\)<br>• \(x^{a+b}=x^a\cdot x^b.\)`,
  tip: String.raw`To get a clean \(a\sqrt[b]{c}\), always first reduce the fractional exponent to lowest terms — the denominator becomes \(b\), and the rest goes into \(c\) and \(a\).`,
  answer: "a + b + c = 49"
},
{
  id: 40,
  topic: "Linear Function — Rate of Change",
  statement: String.raw`$$T(x)=\tfrac{3}{4}\left(\tfrac{26}{7}x-800\right)+15.50$$
The temperature on the Tutorllini scale \(T\) as a function of Celsius \(x\). If \(T\) rises by 3.3 °Torte, by how many °Celsius did temperature rise? (To nearest tenth.)`,
  concepts: String.raw`<b>Linear function:</b> \(T(x)=mx+b\Rightarrow \Delta T=m\cdot\Delta x.\) Only the slope matters for changes — the constant part cancels out.`,
  walkthrough: String.raw`<ol>
<li>Expand \(T(x)\) to find the slope: \(T(x)=\tfrac{3}{4}\cdot\tfrac{26}{7}x+(\text{constants})=\tfrac{78}{28}x+\ldots=\tfrac{39}{14}x+\ldots\)</li>
<li>Slope \(m=\dfrac{39}{14}\) °Torte per °Celsius.</li>
<li>\(\Delta T=m\cdot\Delta x\Rightarrow 3.3=\dfrac{39}{14}\Delta x\Rightarrow \Delta x=3.3\cdot\dfrac{14}{39}.\)</li>
<li>Compute and round to one decimal.</li>
</ol>`,
  formulas: String.raw`• \(\Delta T=m\Delta x\) for linear \(T=mx+b.\)`,
  tip: String.raw`For any "change in output" question on a linear function, ignore the \(b\) term — only the slope matters.`,
  answer: "Δx ≈ 1.2 °C"
}
];
