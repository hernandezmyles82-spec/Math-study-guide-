/* Study guide text for the built-in topics (format: see js/guides.js). */
(function (root) {
  'use strict';
  root.MSG.Guides.add(String.raw`
@@ derivatives
## Overview
A **derivative** tells you how fast a function is changing at one exact point. On a graph, it is the **slope of the tangent line**: the line that just touches the curve there. If \(f(x)\) is your position, \(f'(x)\) is your speed.

You'll see it written as \(f'(x)\), \(y'\), or \(\frac{dy}{dx}\). They all mean the same thing.

## Key ideas
- **Definition:** \(f'(x) = \lim_{h\to0}\frac{f(x+h) - f(x)}{h}\), the slope between two points as they squeeze together.
- **Constant rule:** the derivative of a constant is \(0\). A flat line has no slope.
- **Power rule:** \(\frac{d}{dx}x^n = nx^{n-1}\). Bring the power down in front, then lower the power by 1. It works for negative and fraction powers too: \(\frac{d}{dx}x^{-1} = -x^{-2}\).
- **Constant multiple and sum rules:** \((cf)' = cf'\) and \((f + g)' = f' + g'\). Take the derivative one term at a time.
- **Product rule:** \((fg)' = f'g + fg'\).
- **Quotient rule:** \(\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}\). Memory trick: "low d-high minus high d-low, over low squared."
- **Chain rule:** \(\frac{d}{dx}f(g(x)) = f'(g(x))\,g'(x)\). Take the derivative of the outside, keep the inside, then multiply by the derivative of the inside.
- **Derivatives to memorize:** \((\sin x)' = \cos x\), \((\cos x)' = -\sin x\), \((e^x)' = e^x\), \((\ln x)' = \frac{1}{x}\).
- **What the sign tells you:** if \(f'(x) > 0\), \(f\) is increasing; if \(f'(x) < 0\), it is decreasing.
- **Critical points** are where \(f'(x) = 0\) or \(f'(x)\) is undefined. Maximums and minimums can only happen there (or at the ends of an interval).
- **Second derivative:** \(f''(x) > 0\) means the graph curves up (concave up); \(f''(x) < 0\) means it curves down.
- **Tangent line at** \(x = a\): \(y - f(a) = f'(a)(x - a)\).

## Worked examples
Example: Find the derivative of \(f(x) = 3x^4 - 5x^2 + 7\).
Solution: Use the power rule on each term: \(3 \cdot 4x^3 = 12x^3\), \(-5 \cdot 2x = -10x\), and the constant 7 becomes 0.
Answer: \(f'(x) = 12x^3 - 10x\)
Example: Differentiate \(y = x^2 \sin x\).
Solution: It's a product, so use \(f'g + fg'\) with \(f = x^2\) and \(g = \sin x\).
\(f' = 2x\) and \(g' = \cos x\).
Answer: \(y' = 2x\sin x + x^2\cos x\)
Example: Differentiate \(y = (3x^2 + 1)^5\).
Solution: Chain rule. The outside is \((\ )^5\), the inside is \(3x^2 + 1\).
Outside's derivative: \(5(3x^2 + 1)^4\). Inside's derivative: \(6x\).
Multiply: \(5(3x^2 + 1)^4 \cdot 6x\).
Answer: \(y' = 30x(3x^2 + 1)^4\)
Example: Find the tangent line to \(f(x) = x^3\) at \(x = 2\).
Solution: The point: \(f(2) = 8\). The slope: \(f'(x) = 3x^2\), so \(f'(2) = 12\).
Point-slope form: \(y - 8 = 12(x - 2)\).
Answer: \(y = 12x - 16\)
Example: Find and classify the critical points of \(f(x) = x^3 - 3x\).
Solution: \(f'(x) = 3x^2 - 3 = 0\) gives \(x^2 = 1\), so \(x = 1\) or \(x = -1\).
\(f''(x) = 6x\): \(f''(1) = 6 > 0\) (curves up, a minimum); \(f''(-1) = -6 < 0\) (curves down, a maximum).
Answer: local minimum at \((1, -2)\), local maximum at \((-1, 2)\)

## Common mistakes
- **Forgetting the chain rule.** \(\frac{d}{dx}\sin(3x)\) is \(3\cos(3x)\), not \(\cos(3x)\). Whenever there's something other than plain \(x\) inside, multiply by its derivative.
- **Multiplying derivatives for a product.** \((fg)'\) is **not** \(f'g'\). Use \(f'g + fg'\).
- **Mixing up the quotient rule order.** It's \(f'g - fg'\) on top (the minus makes order matter), and don't forget to square the bottom.
- **Saying a constant's derivative is 1.** The derivative of 7 is 0. The derivative of \(7x\) is 7.
- **Dropping the inside of \(e\) and \(\ln\).** \((e^{2x})' = 2e^{2x}\) and \((\ln(x^2 + 1))' = \frac{2x}{x^2 + 1}\).
- **Missing critical points.** Also check where \(f'\) is undefined, like \(x = 0\) for \(f(x) = |x|\).
- **Rewriting fractions badly.** Write \(\frac{1}{x^2}\) as \(x^{-2}\) first; its derivative is \(-2x^{-3}\).

## In order: Finding the absolute max and min on \([a, b]\)
- Find the derivative \(f'(x)\)
- Find the critical points inside \((a, b)\): where \(f'(x) = 0\) or is undefined
- Plug the critical points and both endpoints \(a\) and \(b\) into \(f\)
- The largest value is the absolute maximum and the smallest is the absolute minimum

## Check yourself
Q: What is \(\frac{d}{dx}x^7\)?
A: \(7x^6\)
Q: What is \(\frac{d}{dx}\sin(3x)\)?
A: \(3\cos(3x)\) (chain rule)
Q: What is the derivative of \(\frac{x}{x + 1}\)?
A: \(\frac{(1)(x + 1) - x(1)}{(x + 1)^2} = \frac{1}{(x + 1)^2}\)
Q: What is the derivative of \(e^{x^2}\)?
A: \(2xe^{x^2}\)
Q: If \(f'(x) > 0\) on an interval, what is \(f\) doing there?
A: Increasing.
Q: What is the slope of the tangent line to \(y = \ln x\) at \(x = 1\)?
A: \(1\), because \(y' = \frac{1}{x}\) and \(\frac{1}{1} = 1\).

@@ us-history
## Overview
U.S. history tests usually ask three kinds of questions: **when** something happened, **why** it happened (causes), and **what changed** because of it (effects). This guide follows the country from the Revolution to the civil rights movement. Learn the big eras in order first, then the key dates inside each one.

## Key ideas
### Founding a nation (1765–1791)
- Britain taxed the colonies to pay for the French and Indian War (Stamp Act, 1765). Colonists protested **"no taxation without representation"** because they had no vote in Parliament.
- The **American Revolution** (1775–1783) won independence. The **Declaration of Independence** (July 4, 1776), mainly written by Thomas Jefferson, explained why the colonies were breaking away.
- The first government, the **Articles of Confederation**, was too weak (no power to tax or raise an army), so leaders wrote the **U.S. Constitution** in 1787. It created three branches and checks and balances.
- The **Bill of Rights** (1791) is the first 10 amendments. It protects rights like free speech, religion and a fair trial.

### Growth and division (1800–1877)
- The **Louisiana Purchase** (1803) bought land from France and about doubled the country's size.
- **Manifest Destiny** was the belief that the U.S. should spread across North America. Expansion raised a hard question: would new states allow slavery?
- The **Civil War** (1861–1865) was fought between the Union (North) and the Confederacy (South) over slavery and states' rights. The Union won.
- Lincoln's **Emancipation Proclamation** (1863) declared enslaved people in the Confederate states free. The **13th Amendment** (1865) ended slavery everywhere in the U.S.
- During **Reconstruction** (1865–1877) the South was rebuilt and rejoined the Union. The 14th Amendment (citizenship and equal protection) and 15th Amendment (voting regardless of race) were added, but many of these rights were taken away in the South after it ended.

### A modern power (1900–1945)
- The **19th Amendment** (1920) gave women the right to vote.
- The **Great Depression** began with the stock market crash of 1929. Franklin D. Roosevelt's **New Deal** (1930s) created programs for relief, recovery and reform.
- Japan's attack on **Pearl Harbor** (December 7, 1941) brought the U.S. into World War II, which ended in 1945.

### Civil rights (1954–1965)
- **Brown v. Board of Education** (1954) ruled that segregated public schools are unconstitutional, overturning "separate but equal."
- Rosa Parks and the **Montgomery Bus Boycott** (1955–1956) and Dr. Martin Luther King Jr.'s **March on Washington** (1963) built support for change.
- The **Civil Rights Act of 1964** outlawed discrimination based on race, color, religion, sex or national origin. The **Voting Rights Act of 1965** protected the right to vote.

## Worked examples
Example: Why did many colonists oppose the Stamp Act?
Solution: Find the cause: Britain taxed the colonies directly. Then the colonists' reason: they had no representatives in Parliament, so they had not agreed to the tax.
Answer: They believed Parliament had no right to tax them without representation ("no taxation without representation").
Example: The Emancipation Proclamation (1863) and the 13th Amendment (1865) are both about slavery. What is the difference?
Solution: Check who each one applied to. The Proclamation was a wartime order that covered only the states in rebellion. The amendment changed the Constitution for the whole country.
Answer: The Proclamation freed enslaved people only in Confederate states; the 13th Amendment abolished slavery everywhere in the U.S.
Example: Put these in order: Bill of Rights, Declaration of Independence, U.S. Constitution.
Solution: Declaration 1776, Constitution 1787, Bill of Rights 1791.
Answer: Declaration of Independence → Constitution → Bill of Rights

## Common mistakes
- **Mixing up the Declaration and the Constitution.** The Declaration (1776) announced independence. The Constitution (1787) set up the government.
- **Thinking the Emancipation Proclamation ended all slavery.** It applied only to Confederate states. The 13th Amendment ended slavery nationwide.
- **Saying the Louisiana Purchase was from Spain or Britain.** It was bought from **France** (Napoleon), in 1803.
- **Forgetting what the Bill of Rights is.** It's the first **10 amendments** to the Constitution, ratified in 1791.
- **Confusing the 13th, 14th and 15th Amendments.** 13th: ended slavery. 14th: citizenship and equal protection. 15th: voting rights regardless of race. (19th: women's right to vote.)
- **Dating the Great Depression to the 1940s.** It began in 1929 and lasted through the 1930s.

## Timeline
- 1765: Stamp Act taxes the colonies
- 1775–1783: American Revolution
- 1776: Declaration of Independence adopted
- 1787: U.S. Constitution written
- 1791: Bill of Rights ratified
- 1803: Louisiana Purchase
- 1861–1865: Civil War
- 1863: Emancipation Proclamation
- 1865: 13th Amendment abolishes slavery
- 1877: Reconstruction ends
- 1920: 19th Amendment gives women the vote
- 1929: Stock market crash starts the Great Depression
- 1941: Attack on Pearl Harbor
- 1945: World War II ends
- 1954: Brown v. Board of Education
- 1963: March on Washington
- 1964: Civil Rights Act
- 1965: Voting Rights Act

## Check yourself
Q: What did the Declaration of Independence do, and when?
A: It declared the 13 colonies independent from Britain, on July 4, 1776.
Q: Why was the Articles of Confederation replaced?
A: It made the national government too weak; it couldn't tax or raise an army, so the Constitution (1787) replaced it.
Q: Which amendment abolished slavery?
A: The 13th Amendment (1865).
Q: What event brought the U.S. into World War II?
A: Japan's attack on Pearl Harbor, December 7, 1941.
Q: What did Brown v. Board of Education decide?
A: That segregated public schools are unconstitutional (1954).
Q: What was the New Deal?
A: Franklin D. Roosevelt's programs in the 1930s for relief, recovery and reform during the Great Depression.
`);
})(typeof window !== 'undefined' ? window : globalThis);
