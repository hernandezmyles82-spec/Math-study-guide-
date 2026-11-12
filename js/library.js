/* Built-in study library, grouped by subject. This file holds Math (beginner to advanced);
   js/library-subjects.js adds the other subjects through Library.addSubject().
   Each category has a reference sheet of key concepts; practice-question generators live in
   generators.js and generators-subjects.js (same category ids).
   Format:  @id|Name|Level|Icon|Short description   followed by   Term|Definition   lines.
   Card ids are positional (lib:<category>:<index>): append new concepts at the END of a category. */
(function (root) {
  'use strict';

  const LEVELS = ['Foundations', 'Algebra', 'Geometry & Trigonometry', 'Precalculus', 'Calculus', 'Advanced & College'];

  const RAW = String.raw`
@arithmetic|Arithmetic|Foundations|🔢|Add, subtract, multiply and divide whole numbers.
Sum|The result of adding numbers. \(7 + 5 = 12\)
Difference|The result of subtracting one number from another. \(12 - 5 = 7\)
Product|The result of multiplying numbers. \(6 \times 4 = 24\)
Quotient|The result of dividing one number by another. \(24 \div 4 = 6\)
Commutative property|Order doesn't matter for addition and multiplication: \(a + b = b + a\), \(ab = ba\)
Associative property|Grouping doesn't matter for addition and multiplication: \((a+b)+c = a+(b+c)\)
Distributive property|\(a(b + c) = ab + ac\)
Order of operations (PEMDAS)|Parentheses, Exponents, Multiplication/Division (left to right), Addition/Subtraction (left to right)
Remainder|What is left over after division. \(17 \div 5 = 3\) remainder \(2\)

@fractions|Fractions|Foundations|🍕|Simplify, add, subtract, multiply and divide fractions.
Numerator|The top number of a fraction; how many parts you have.
Denominator|The bottom number of a fraction; how many equal parts make a whole.
Simplest form|A fraction whose numerator and denominator share no common factor except 1.
Adding fractions|Rewrite with a common denominator, then add numerators: \(\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd}\)
Multiplying fractions|Multiply straight across: \(\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}\)
Dividing fractions|Multiply by the reciprocal: \(\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \cdot \frac{d}{c}\)
Reciprocal|The fraction flipped upside down; a number times its reciprocal is 1.
Mixed number|A whole number plus a proper fraction, like \(2\tfrac{1}{3}\)
Improper fraction|A fraction whose numerator is greater than or equal to its denominator, like \(\frac{7}{3}\)

@decimals-percents|Decimals & Percents|Foundations|💯|Convert between fractions, decimals and percents; percent of a number and percent change.
Percent|"Per hundred": \(p\% = \frac{p}{100}\)
Percent of a number|\(p\%\) of \(N\) is \(\frac{p}{100} \times N\)
Percent change|\(\frac{\text{new} - \text{old}}{\text{old}} \times 100\%\)
Fraction to decimal|Divide the numerator by the denominator: \(\frac{3}{8} = 0.375\)
Decimal to percent|Multiply by 100: \(0.42 = 42\%\)
Place value|The value of a digit based on its position (ones, tenths, hundredths, ...).

@integers-exponents|Integers, Exponents & Roots|Foundations|⚡|Negative numbers, powers, square roots and scientific notation.
Integer|A whole number that can be positive, negative or zero: \(\dots,-2,-1,0,1,2,\dots\)
Absolute value|Distance from zero on the number line: \(|-5| = 5\)
Multiplying signs|Same signs give a positive product; different signs give a negative product.
Exponent|Tells how many times to multiply the base by itself: \(2^3 = 2\cdot2\cdot2 = 8\)
Zero exponent|Any nonzero number to the zero power is 1: \(a^0 = 1\)
Negative exponent|\(a^{-n} = \frac{1}{a^n}\)
Square root|A number that, multiplied by itself, gives the original: \(\sqrt{49} = 7\)
Scientific notation|A number written as \(a \times 10^n\) with \(1 \le |a| < 10\)

@ratios|Ratios & Proportions|Foundations|⚖️|Ratios, unit rates and solving proportions.
Ratio|A comparison of two quantities, written \(a:b\) or \(\frac{a}{b}\)
Proportion|An equation saying two ratios are equal: \(\frac{a}{b} = \frac{c}{d}\)
Cross multiplication|If \(\frac{a}{b} = \frac{c}{d}\) then \(ad = bc\)
Unit rate|A rate with a denominator of 1, like miles per hour or price per item.
Direct variation|\(y = kx\); \(y\) changes by the same factor as \(x\)

@linear-equations|Linear Equations & Inequalities|Algebra|✏️|Solve one- and two-step equations and inequalities.
Variable|A letter that stands for an unknown number.
Linear equation|An equation whose variable has power 1, like \(3x + 4 = 19\)
Inverse operations|Operations that undo each other (add/subtract, multiply/divide); used to isolate the variable.
Solution|A value that makes the equation true.
Flipping an inequality|When you multiply or divide both sides of an inequality by a negative number, reverse the inequality sign.
Like terms|Terms with the same variable raised to the same power, e.g. \(3x\) and \(-5x\)

@lines-slope|Lines & Slope|Algebra|📈|Slope, intercepts and equations of lines.
Slope|Rise over run: \(m = \frac{y_2 - y_1}{x_2 - x_1}\)
Slope-intercept form|\(y = mx + b\), where \(m\) is the slope and \(b\) is the y-intercept
Point-slope form|\(y - y_1 = m(x - x_1)\)
Standard form|\(Ax + By = C\)
y-intercept|Where the line crosses the y-axis (the value of y when \(x = 0\))
Parallel lines|Lines with equal slopes.
Perpendicular lines|Lines whose slopes are negative reciprocals: \(m_1 m_2 = -1\)
Horizontal line|\(y = c\); slope 0
Vertical line|\(x = c\); slope undefined

@systems|Systems of Equations|Algebra|🔀|Solve two equations with two unknowns.
System of equations|Two or more equations with the same variables, solved together.
Substitution method|Solve one equation for a variable and substitute into the other.
Elimination method|Add or subtract equations (after scaling) to cancel one variable.
One solution|The lines intersect at exactly one point (different slopes).
No solution|The lines are parallel (same slope, different intercepts).
Infinitely many solutions|The equations describe the same line.

@polynomials|Polynomials & Factoring|Algebra|🧩|Exponent rules, expanding and factoring polynomials.
Polynomial|A sum of terms \(a_n x^n + \dots + a_1 x + a_0\) with whole-number exponents.
Degree|The highest exponent of the variable in a polynomial.
Product of powers|\(x^a \cdot x^b = x^{a+b}\)
Power of a power|\((x^a)^b = x^{ab}\)
Quotient of powers|\(\frac{x^a}{x^b} = x^{a-b}\)
FOIL|First, Outer, Inner, Last: \((a+b)(c+d) = ac + ad + bc + bd\)
Difference of squares|\(a^2 - b^2 = (a - b)(a + b)\)
Perfect square trinomial|\(a^2 + 2ab + b^2 = (a + b)^2\)
Greatest common factor (GCF)|The largest factor that divides every term; factor it out first.

@quadratics|Quadratic Equations|Algebra|🎯|Solve quadratics, discriminant, vertex and parabolas.
Quadratic equation|An equation of the form \(ax^2 + bx + c = 0\) with \(a \neq 0\)
Quadratic formula|\(x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}\)
Discriminant|\(b^2 - 4ac\): positive → 2 real roots, zero → 1 real root, negative → no real roots
Vertex|The turning point of a parabola; its x-coordinate is \(x = -\frac{b}{2a}\)
Vertex form|\(y = a(x - h)^2 + k\) with vertex \((h, k)\)
Axis of symmetry|The vertical line \(x = -\frac{b}{2a}\) through the vertex.
Zero product property|If \(ab = 0\) then \(a = 0\) or \(b = 0\)

@exponents-logs|Exponentials & Logarithms|Algebra|🌱|Exponential functions, logarithms and their rules.
Logarithm|\(\log_b x = y\) means \(b^y = x\)
Natural log|\(\ln x = \log_e x\), where \(e \approx 2.718\)
Product rule for logs|\(\log_b(MN) = \log_b M + \log_b N\)
Quotient rule for logs|\(\log_b\left(\frac{M}{N}\right) = \log_b M - \log_b N\)
Power rule for logs|\(\log_b(M^k) = k \log_b M\)
Change of base|\(\log_b x = \frac{\ln x}{\ln b}\)
Exponential growth|\(A = A_0 e^{kt}\) with \(k > 0\) (decay if \(k < 0\))
Compound interest|\(A = P\left(1 + \frac{r}{n}\right)^{nt}\)

@functions|Functions|Algebra|🔁|Evaluate, compose and invert functions; domain and range.
Function|A rule that assigns each input exactly one output.
Domain|The set of all allowed inputs of a function.
Range|The set of all outputs of a function.
Composition|\((f \circ g)(x) = f(g(x))\)
Inverse function|\(f^{-1}\) undoes \(f\): \(f(f^{-1}(x)) = x\)
Vertical line test|A graph is a function if no vertical line crosses it more than once.
Even function|\(f(-x) = f(x)\); symmetric about the y-axis.
Odd function|\(f(-x) = -f(x)\); symmetric about the origin.

@alg2-ch2|Algebra 2: Functions, Slope & Lines|Algebra|📘|Algebra 2 sections 2.1–2.3: relations and functions, slope and rate of change, and graphing lines.
Relation|A mapping, or pairing, of input values with output values.
Domain|The set of input values (x-values) in a relation. List each value once, smallest to largest.
Range|The set of output values (y-values) in a relation.
Function|A relation for which each input has exactly one output. Outputs can repeat; inputs can't.
Equation in two variables|An equation with an independent (input) variable and a dependent (output) variable that depends on the value of the input.
Linear function|A function that can be written as \(y = mx + b\), where \(m\) and \(b\) are constants. Any \(x^2\), \(x^3\) or \(x\) in a denominator means it is not linear.
Vertical line test|A relation is a function if and only if no vertical line intersects its graph at more than one point.
Four ways to show a relation|Ordered pairs, a table, a graph, or a mapping diagram (inputs in one oval, outputs in another, an arrow from each input to its output).
Graphing an equation in two variables|Make a table of values, plot enough points to see a pattern, then connect them with a line or curve.
Slope|The ratio of vertical change (rise) to horizontal change (run): \(m = \frac{y_2 - y_1}{x_2 - x_1}\). Subtract in the same order on top and bottom.
Positive slope|The line rises from left to right.
Negative slope|The line falls from left to right.
Zero slope|The line is horizontal (flat).
Undefined slope|The line is vertical: \(x_2 - x_1 = 0\), and you can't divide by 0.
Parallel lines|Two lines in a plane that do not intersect; their slopes are equal: \(m_1 = m_2\).
Perpendicular lines|Two lines that intersect to form a right angle; their slopes are negative reciprocals: \(m_1 \cdot m_2 = -1\).
Negative reciprocal|Flip the fraction and change the sign: \(\frac{3}{4} \to -\frac{4}{3}\), \(-5 \to \frac{1}{5}\).
Rate of change|How much one quantity changes, on average, relative to the change in another quantity.
Parent function|The most basic function in a family; for linear functions it is \(y = x\) (through the origin, slope 1).
y-intercept|The y-coordinate of the point where a graph crosses the y-axis. Set \(x = 0\) to find it.
x-intercept|The x-coordinate of the point where a graph crosses the x-axis. Set \(y = 0\) to find it.
Slope-intercept form|\(y = mx + b\): \(m\) is the slope and \(b\) is the y-intercept. Plot \((0, b)\), then use the slope to find a second point.
Standard form of a linear equation|\(Ax + By = C\), where \(A\) and \(B\) are not both zero. Graph it from its two intercepts.
Horizontal line|\(y = c\): passes through \((0, c)\), slope 0.
Vertical line|\(x = c\): passes through \((c, 0)\), slope undefined.

@geometry-area|Area & Perimeter|Geometry & Trigonometry|📐|Areas and perimeters of rectangles, triangles, circles and more.
Area of a rectangle|\(A = lw\)
Area of a triangle|\(A = \frac{1}{2}bh\)
Area of a circle|\(A = \pi r^2\)
Circumference|\(C = 2\pi r = \pi d\)
Area of a trapezoid|\(A = \frac{1}{2}(b_1 + b_2)h\)
Area of a parallelogram|\(A = bh\)
Perimeter|The total distance around a shape.

@pythagorean|Pythagorean Theorem & Distance|Geometry & Trigonometry|📏|Right triangles, the distance formula and midpoints.
Pythagorean theorem|In a right triangle, \(a^2 + b^2 = c^2\) where \(c\) is the hypotenuse.
Hypotenuse|The longest side of a right triangle, opposite the right angle.
Distance formula|\(d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}\)
Midpoint formula|\(\left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right)\)
Pythagorean triple|Whole numbers that satisfy \(a^2+b^2=c^2\), e.g. 3-4-5, 5-12-13, 8-15-17.

@angles|Angles & Polygons|Geometry & Trigonometry|📌|Angle relationships, triangles and polygons.
Complementary angles|Two angles that add to \(90^\circ\)
Supplementary angles|Two angles that add to \(180^\circ\)
Vertical angles|Opposite angles formed by two intersecting lines; they are equal.
Triangle angle sum|The angles of a triangle add to \(180^\circ\)
Polygon interior angle sum|\((n - 2) \cdot 180^\circ\) for an \(n\)-sided polygon
Exterior angle sum|The exterior angles of any convex polygon add to \(360^\circ\)
Similar figures|Same shape, proportional sides, equal angles.
Congruent figures|Same shape and same size.

@volume|Volume & Surface Area|Geometry & Trigonometry|🧊|Volume and surface area of 3-D solids.
Volume of a rectangular prism|\(V = lwh\)
Volume of a cylinder|\(V = \pi r^2 h\)
Volume of a cone|\(V = \frac{1}{3}\pi r^2 h\)
Volume of a sphere|\(V = \frac{4}{3}\pi r^3\)
Volume of a pyramid|\(V = \frac{1}{3}Bh\) where \(B\) is the base area
Surface area of a cube|\(SA = 6s^2\)
Surface area of a sphere|\(SA = 4\pi r^2\)

@trig-unit-circle|Unit Circle & Radians|Geometry & Trigonometry|⭕|Exact trig values, radians and the unit circle.
Unit circle|A circle of radius 1 centered at the origin; the point at angle \(\theta\) is \((\cos\theta, \sin\theta)\)
Radian|The angle that cuts off an arc equal to the radius; \(\pi \text{ rad} = 180^\circ\)
Degrees to radians|Multiply by \(\frac{\pi}{180}\)
Radians to degrees|Multiply by \(\frac{180}{\pi}\)
Pythagorean identity|\(\sin^2\theta + \cos^2\theta = 1\)
Tangent|\(\tan\theta = \frac{\sin\theta}{\cos\theta}\)
ASTC (All Students Take Calculus)|Quadrant I: all positive; II: sine; III: tangent; IV: cosine
Reference angle|The acute angle a terminal side makes with the x-axis.

@trig-right-triangles|Right-Triangle Trig & Identities|Geometry & Trigonometry|🔺|SOH-CAH-TOA, solving triangles, law of sines/cosines.
SOH-CAH-TOA|\(\sin = \frac{\text{opp}}{\text{hyp}}\), \(\cos = \frac{\text{adj}}{\text{hyp}}\), \(\tan = \frac{\text{opp}}{\text{adj}}\)
Law of sines|\(\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C}\)
Law of cosines|\(c^2 = a^2 + b^2 - 2ab\cos C\)
Reciprocal identities|\(\csc\theta = \frac{1}{\sin\theta}\), \(\sec\theta = \frac{1}{\cos\theta}\), \(\cot\theta = \frac{1}{\tan\theta}\)
Double-angle formula for sine|\(\sin 2\theta = 2\sin\theta\cos\theta\)
Double-angle formula for cosine|\(\cos 2\theta = \cos^2\theta - \sin^2\theta\)

@sequences|Sequences & Series|Precalculus|🔗|Arithmetic and geometric sequences and their sums.
Arithmetic sequence|Each term adds a common difference \(d\): \(a_n = a_1 + (n - 1)d\)
Arithmetic series sum|\(S_n = \frac{n}{2}(a_1 + a_n)\)
Geometric sequence|Each term multiplies by a common ratio \(r\): \(a_n = a_1 r^{n-1}\)
Geometric series sum|\(S_n = a_1\frac{1 - r^n}{1 - r}\)
Infinite geometric series|If \(|r| < 1\): \(S = \frac{a_1}{1 - r}\)
Sigma notation|\(\sum_{k=1}^{n} a_k = a_1 + a_2 + \dots + a_n\)

@complex-numbers|Complex Numbers|Precalculus|🌀|Imaginary unit, arithmetic with complex numbers and modulus.
Imaginary unit|\(i = \sqrt{-1}\), so \(i^2 = -1\)
Powers of i|Cycle every 4: \(i, -1, -i, 1\)
Complex number|\(a + bi\) with real part \(a\) and imaginary part \(b\)
Complex conjugate|The conjugate of \(a + bi\) is \(a - bi\)
Modulus|\(|a + bi| = \sqrt{a^2 + b^2}\)
Multiplying complex numbers|\((a+bi)(c+di) = (ac - bd) + (ad + bc)i\)
Euler's formula|\(e^{i\theta} = \cos\theta + i\sin\theta\)

@limits|Limits & Continuity|Calculus|🚧|Evaluate limits algebraically and understand continuity.
Limit|\(\lim_{x\to a} f(x) = L\) means \(f(x)\) gets arbitrarily close to \(L\) as \(x\) approaches \(a\)
Direct substitution|If \(f\) is continuous at \(a\), then \(\lim_{x\to a} f(x) = f(a)\)
Continuity at a point|\(f\) is continuous at \(a\) if \(\lim_{x\to a} f(x) = f(a)\)
Special trig limit|\(\lim_{x\to 0}\frac{\sin x}{x} = 1\)
Limits at infinity of rational functions|Compare degrees: top smaller → 0; equal → ratio of leading coefficients; top bigger → \(\pm\infty\)
L'Hôpital's rule|If a limit is \(\frac{0}{0}\) or \(\frac{\infty}{\infty}\), then \(\lim \frac{f}{g} = \lim \frac{f'}{g'}\)
Squeeze theorem|If \(g \le f \le h\) and \(g, h \to L\), then \(f \to L\)
Intermediate value theorem|A continuous function on \([a,b]\) takes every value between \(f(a)\) and \(f(b)\)

@derivatives|Derivatives|Calculus|📉|Derivative rules, slopes of tangent lines and rates of change.
Derivative|The instantaneous rate of change: \(f'(x) = \lim_{h\to0}\frac{f(x+h) - f(x)}{h}\)
Power rule|\(\frac{d}{dx}x^n = nx^{n-1}\)
Product rule|\((fg)' = f'g + fg'\)
Quotient rule|\(\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}\)
Chain rule|\(\frac{d}{dx}f(g(x)) = f'(g(x))\,g'(x)\)
Derivative of sin x|\(\cos x\)
Derivative of cos x|\(-\sin x\)
Derivative of e^x|\(e^x\)
Derivative of ln x|\(\frac{1}{x}\)
Critical point|Where \(f'(x) = 0\) or \(f'(x)\) is undefined; candidates for max/min.
Mean value theorem|If \(f\) is continuous on \([a,b]\) and differentiable on \((a,b)\), some \(c\) has \(f'(c) = \frac{f(b)-f(a)}{b-a}\)

@integrals|Integrals|Calculus|∫|Antiderivatives, definite integrals and the Fundamental Theorem.
Antiderivative|A function \(F\) with \(F'(x) = f(x)\)
Power rule for integrals|\(\int x^n\,dx = \frac{x^{n+1}}{n+1} + C\) for \(n \neq -1\)
Integral of 1/x|\(\int \frac{1}{x}\,dx = \ln|x| + C\)
Integral of e^x|\(\int e^x\,dx = e^x + C\)
Fundamental Theorem of Calculus|\(\int_a^b f(x)\,dx = F(b) - F(a)\) where \(F' = f\)
Definite integral|The signed area between the curve and the x-axis from \(a\) to \(b\)
u-substitution|Reverse chain rule: let \(u = g(x)\), \(du = g'(x)dx\)
Integration by parts|\(\int u\,dv = uv - \int v\,du\)

@series|Infinite Series (Calc II)|Calculus|♾️|Convergence tests, Taylor series and radius of convergence.
p-series|\(\sum \frac{1}{n^p}\) converges if \(p > 1\) and diverges if \(p \le 1\)
Harmonic series|\(\sum \frac{1}{n}\) diverges.
nth-term test|If \(\lim a_n \neq 0\), then \(\sum a_n\) diverges.
Ratio test|If \(\lim\left|\frac{a_{n+1}}{a_n}\right| < 1\) the series converges absolutely; \(>1\) diverges.
Taylor series|\(f(x) = \sum \frac{f^{(n)}(a)}{n!}(x - a)^n\)
Maclaurin series for e^x|\(e^x = \sum_{n=0}^{\infty}\frac{x^n}{n!}\)
Maclaurin series for sin x|\(\sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \dots\)
Radius of convergence|The \(R\) such that a power series converges for \(|x - a| < R\)

@multivariable|Multivariable Calculus|Calculus|🗺️|Partial derivatives, gradients, vectors and multiple integrals.
Partial derivative|Derivative with respect to one variable while holding the others constant: \(\frac{\partial f}{\partial x}\)
Gradient|\(\nabla f = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \frac{\partial f}{\partial z}\right)\); points in the direction of steepest increase
Dot product|\(\mathbf{u}\cdot\mathbf{v} = u_1v_1 + u_2v_2 + u_3v_3 = |\mathbf{u}||\mathbf{v}|\cos\theta\)
Cross product|A vector perpendicular to both \(\mathbf{u}\) and \(\mathbf{v}\) with length \(|\mathbf{u}||\mathbf{v}|\sin\theta\)
Double integral|\(\iint_R f(x,y)\,dA\): volume under a surface over region \(R\)
Directional derivative|\(D_{\mathbf{u}}f = \nabla f \cdot \mathbf{u}\) for a unit vector \(\mathbf{u}\)
Divergence theorem|\(\iint_S \mathbf{F}\cdot d\mathbf{S} = \iiint_E \nabla\cdot\mathbf{F}\,dV\)
Green's theorem|\(\oint_C P\,dx + Q\,dy = \iint_D \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right)dA\)

@linear-algebra|Linear Algebra|Advanced & College|🧮|Matrices, determinants, vectors, eigenvalues.
Matrix multiplication|Entry \((i,j)\) of \(AB\) is row \(i\) of \(A\) dotted with column \(j\) of \(B\)
Determinant of a 2×2|\(\det\begin{pmatrix}a&b\\c&d\end{pmatrix} = ad - bc\)
Invertible matrix|A square matrix with nonzero determinant.
Eigenvalue|A scalar \(\lambda\) with \(A\mathbf{v} = \lambda\mathbf{v}\) for some nonzero vector \(\mathbf{v}\)
Characteristic equation|\(\det(A - \lambda I) = 0\)
Rank|The number of linearly independent rows (or columns).
Linear independence|No vector in the set is a linear combination of the others.
Trace|The sum of the diagonal entries; equals the sum of the eigenvalues.
Rank–nullity theorem|\(\text{rank}(A) + \text{nullity}(A) = \) number of columns

@differential-equations|Differential Equations|Advanced & College|🌊|First-order, separable and second-order linear ODEs.
Differential equation|An equation involving a function and its derivatives.
Order of an ODE|The highest derivative that appears.
Separable equation|\(\frac{dy}{dx} = g(x)h(y)\); solve by \(\int \frac{dy}{h(y)} = \int g(x)\,dx\)
Exponential growth/decay ODE|\(y' = ky\) has solution \(y = Ce^{kt}\)
Characteristic equation (2nd order)|For \(ay'' + by' + cy = 0\), solve \(ar^2 + br + c = 0\)
Distinct real roots|\(y = C_1e^{r_1t} + C_2e^{r_2t}\)
Repeated root|\(y = (C_1 + C_2t)e^{rt}\)
Complex roots α ± βi|\(y = e^{\alpha t}(C_1\cos\beta t + C_2\sin\beta t)\)
Euler's method|\(y_{n+1} = y_n + h\,f(x_n, y_n)\)

@statistics|Statistics & Probability|Advanced & College|🎲|Mean, median, probability, counting and expected value.
Mean|The sum of the values divided by how many values there are.
Median|The middle value when the data is in order (average the two middle values if even).
Mode|The value that appears most often.
Range|Maximum minus minimum.
Standard deviation|A measure of how spread out data is from the mean.
z-score|\(z = \frac{x - \mu}{\sigma}\)
Probability|\(P(E) = \frac{\text{favorable outcomes}}{\text{total outcomes}}\)
Independent events|\(P(A \text{ and } B) = P(A)P(B)\)
Complement rule|\(P(\text{not } A) = 1 - P(A)\)
Expected value|\(E[X] = \sum x\,P(x)\)

@discrete-math|Discrete Math & Counting|Advanced & College|🔣|Counting, logic, sets and number bases.
Factorial|\(n! = n(n-1)(n-2)\cdots 1\), with \(0! = 1\)
Permutations|Ordered arrangements: \(P(n,r) = \frac{n!}{(n-r)!}\)
Combinations|Unordered selections: \(\binom{n}{r} = \frac{n!}{r!(n-r)!}\)
Implication|\(p \to q\) is false only when \(p\) is true and \(q\) is false.
Contrapositive|The contrapositive of \(p \to q\) is \(\neg q \to \neg p\); it is logically equivalent.
Power set|The set of all subsets; a set with \(n\) elements has \(2^n\) subsets.
Pigeonhole principle|If more than \(n\) objects go into \(n\) boxes, some box holds at least two.
Proof by induction|Prove a base case, then show case \(k\) implies case \(k+1\).

@number-theory|Number Theory|Advanced & College|🔐|Primes, divisibility, GCD/LCM and modular arithmetic.
Prime number|A whole number greater than 1 whose only positive divisors are 1 and itself.
GCD|The greatest common divisor: the largest number dividing both numbers.
LCM|The least common multiple: the smallest positive number both numbers divide.
GCD–LCM relation|\(\gcd(a,b)\cdot\text{lcm}(a,b) = ab\)
Modular arithmetic|\(a \equiv b \pmod n\) means \(n\) divides \(a - b\)
Fundamental theorem of arithmetic|Every integer \(> 1\) factors uniquely into primes.
Fermat's little theorem|If \(p\) is prime and \(p \nmid a\), then \(a^{p-1} \equiv 1 \pmod p\)
Euler's totient|\(\varphi(n)\) counts integers from 1 to \(n\) that are relatively prime to \(n\)

@abstract-algebra|Abstract Algebra|Advanced & College|🔷|Groups, subgroups, homomorphisms, rings and fields.
Group|A set with an associative operation, an identity element, and inverses for every element.
Abelian group|A group whose operation is commutative.
Order of a group|The number of elements in the group.
Order of an element|The smallest positive \(n\) with \(g^n = e\)
Lagrange's theorem|The order of a subgroup divides the order of the group.
Cyclic group|A group generated by a single element.
Homomorphism|A map with \(\varphi(ab) = \varphi(a)\varphi(b)\)
Isomorphism|A bijective homomorphism; the groups are structurally identical.
Normal subgroup|A subgroup \(N\) with \(gNg^{-1} = N\) for all \(g\)
Field|A commutative ring where every nonzero element has a multiplicative inverse.

@real-analysis|Real Analysis|Advanced & College|🔬|Sequences, completeness, continuity and rigor.
Supremum|The least upper bound of a set.
Infimum|The greatest lower bound of a set.
Completeness axiom|Every nonempty set of reals that is bounded above has a supremum.
Convergent sequence|\(a_n \to L\) if for every \(\varepsilon > 0\) there is \(N\) with \(|a_n - L| < \varepsilon\) for all \(n > N\)
Cauchy sequence|For every \(\varepsilon > 0\) there is \(N\) with \(|a_m - a_n| < \varepsilon\) for all \(m, n > N\)
Bolzano–Weierstrass theorem|Every bounded sequence in \(\mathbb{R}\) has a convergent subsequence.
Uniform continuity|For every \(\varepsilon\) there is one \(\delta\) that works for all points of the domain.
Heine–Borel theorem|A subset of \(\mathbb{R}^n\) is compact iff it is closed and bounded.
Monotone convergence theorem|A bounded monotone sequence converges.

@complex-analysis|Complex Analysis|Advanced & College|🌌|Analytic functions, contour integrals and residues.
Analytic (holomorphic)|Complex differentiable in a neighborhood of every point.
Cauchy–Riemann equations|\(u_x = v_y\) and \(u_y = -v_x\) for \(f = u + iv\)
Cauchy's integral theorem|If \(f\) is analytic inside and on a closed contour \(C\), then \(\oint_C f(z)\,dz = 0\)
Cauchy's integral formula|\(f(a) = \frac{1}{2\pi i}\oint_C \frac{f(z)}{z - a}\,dz\)
Residue theorem|\(\oint_C f(z)\,dz = 2\pi i \sum \text{Res}(f, a_k)\)
Residue at a simple pole|\(\text{Res}(f, a) = \lim_{z\to a}(z - a)f(z)\)
Liouville's theorem|A bounded entire function is constant.

@topology|Topology|Advanced & College|🍩|Open sets, compactness, connectedness and surfaces.
Topology|A collection of "open" subsets containing \(\varnothing\) and \(X\), closed under arbitrary unions and finite intersections.
Discrete topology|Every subset is open.
Indiscrete topology|Only \(\varnothing\) and \(X\) are open.
Compact|Every open cover has a finite subcover.
Connected|Cannot be split into two disjoint nonempty open sets.
Homeomorphism|A continuous bijection with a continuous inverse.
Hausdorff space|Any two distinct points have disjoint open neighborhoods.
Euler characteristic|\(\chi = V - E + F\); for a closed orientable surface of genus \(g\), \(\chi = 2 - 2g\)
`;

  const categories = [];
  const SUBJECTS = [];

  function parse(subject, raw) {
    let cur = null;
    raw.split('\n').forEach((line) => {
      line = line.trim();
      if (!line) return;
      if (line[0] === '@') {
        const [id, name, level, icon, blurb] = line.slice(1).split('|');
        cur = { id, name, level, icon, blurb, subject, concepts: [] };
        categories.push(cur);
      } else if (cur) {
        const k = line.indexOf('|');
        cur.concepts.push({ term: line.slice(0, k).trim(), def: line.slice(k + 1).trim(), topic: cur.name });
      }
    });
  }

  const Library = {
    SUBJECTS,
    categories,
    get(id) { return categories.find((c) => c.id === id); },
    /* Register a subject: its display name, icon, the order of its levels, and its categories. */
    addSubject(name, icon, levels, raw, blurb) {
      SUBJECTS.push({ name, icon, levels, blurb: blurb || '' });
      parse(name, raw);
    },
    /* Subjects in order, each with its levels in order and the categories in each level. */
    groups() {
      return SUBJECTS.map((s) => ({
        subject: s.name, icon: s.icon, blurb: s.blurb,
        levels: s.levels.map((level) => ({ level, cats: categories.filter((c) => c.subject === s.name && c.level === level) })).filter((l) => l.cats.length)
      }));
    }
  };
  Library.addSubject('Math', '🔢', LEVELS, RAW, 'Arithmetic through calculus and college math');

  root.MSG = root.MSG || {};
  root.MSG.Library = Library;
})(typeof window !== 'undefined' ? window : globalThis);
