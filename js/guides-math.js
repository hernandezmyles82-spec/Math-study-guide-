/* Study guides for the Math topics (format: see js/guides.js). Derivatives is in js/guides-content.js. */
(function (root) {
  'use strict';
  const add = root.MSG.Guides.add;

  /* ---------- Foundations ---------- */
  add(String.raw`
@@ early-math
## Overview
Numbers are built from **digits** (0 to 9), and where a digit sits tells you what it is worth. This guide covers place value, comparing and rounding numbers, even and odd, counting money and telling time: the tools you use every day.

## Key ideas
- **Place value:** in 352, the 3 is in the hundreds place (300), the 5 is in the tens place (50) and the 2 is in the ones place (2). So 352 = 300 + 50 + 2.
- **Groups of ten:** 10 ones make 1 ten, 10 tens make 1 hundred, and 10 hundreds make 1 thousand.
- **Comparing:** compare the biggest place first. 7 > 3 means "7 is greater than 3"; 3 < 7 means "3 is less than 7". The open side of the sign faces the bigger number.
- **Even numbers** end in 0, 2, 4, 6 or 8 and split into two equal groups. **Odd numbers** end in 1, 3, 5, 7 or 9.
- **Rounding:** look at the digit just to the right of the place you're rounding to. 5 or more rounds up; 4 or less rounds down.
- **Skip counting:** count by the same amount each time: 2, 4, 6, 8… or 5, 10, 15, 20…
- **Fact families:** 3 + 4 = 7, 4 + 3 = 7, 7 − 3 = 4 and 7 − 4 = 3 all use the same three numbers.
- **Coins:** penny 1¢, nickel 5¢, dime 10¢, quarter 25¢. One dollar = 100¢.
- **Time:** the short hand points to the hour and the long hand to the minutes. 1 hour = 60 minutes. **Elapsed time** is how much time passes from start to end.

## Worked examples
Example: Round 46 to the nearest ten.
Solution: The tens digit is 4, so 46 is between 40 and 50. Look at the ones digit: 6 is 5 or more, so round up.
Answer: 50
Example: How much money is 2 quarters, 1 dime and 3 pennies?
Solution: Quarters: 25 + 25 = 50¢. Dime: 10¢. Pennies: 3¢. Add them: 50 + 10 + 3.
Answer: 63¢
Example: A movie starts at 2:15 and ends at 3:45. How long is it?
Solution: From 2:15 to 3:15 is 1 hour. From 3:15 to 3:45 is 30 more minutes.
Answer: 1 hour 30 minutes

## Common mistakes
- **Reading the sign backwards.** The "mouth" of > or < opens toward the **bigger** number: 9 > 4.
- **Rounding by the wrong digit.** To round to the nearest ten, look at the **ones** digit, not the tens digit.
- **Mixing up nickels and dimes.** A dime is smaller but worth more: 10¢. A nickel is 5¢.
- **Swapping the clock hands.** The short hand is the hour; the long hand is the minutes.
- **Forgetting zeros as placeholders.** 305 means 3 hundreds, 0 tens and 5 ones, not 35.

## Check yourself
Q: What is the value of the 4 in 472?
A: 400 (it's in the hundreds place)
Q: Is 58 even or odd?
A: Even, because it ends in 8.
Q: Round 83 to the nearest ten.
A: 80 (the ones digit 3 is 4 or less, so round down)
Q: How many cents are 3 dimes and 1 nickel?
A: 35¢
Q: What time is it 45 minutes after 1:30?
A: 2:15

@@ arithmetic
## Overview
Arithmetic is the four basic operations: **adding**, **subtracting**, **multiplying** and **dividing**. Each answer has a name: a **sum**, a **difference**, a **product** and a **quotient**. The properties and the order of operations below make long problems quick and correct.

## Key ideas
- **Sum:** \(7 + 5 = 12\). **Difference:** \(12 - 5 = 7\). **Product:** \(6 \times 4 = 24\). **Quotient:** \(24 \div 4 = 6\).
- Addition and subtraction undo each other, and so do multiplication and division. Use this to check: if \(24 \div 4 = 6\), then \(6 \times 4\) should be 24.
- **Commutative property:** order doesn't matter for adding or multiplying: \(a + b = b + a\) and \(ab = ba\). It does matter for subtracting and dividing.
- **Associative property:** grouping doesn't matter for adding or multiplying: \((a + b) + c = a + (b + c)\).
- **Distributive property:** \(a(b + c) = ab + ac\). Handy for mental math: \(7 \times 23 = 7 \times 20 + 7 \times 3 = 140 + 21 = 161\).
- **Order of operations (PEMDAS):** Parentheses, Exponents, then Multiplication and Division **left to right**, then Addition and Subtraction **left to right**.
- **Remainder:** what's left over after dividing. \(17 \div 5 = 3\) remainder \(2\), because \(5 \times 3 = 15\) and \(17 - 15 = 2\).

## Worked examples
Example: Find \(3 + 4 \times 5\).
Solution: Multiplication comes before addition: \(4 \times 5 = 20\). Then \(3 + 20\).
Answer: \(23\)
Example: Find \(20 - 12 \div 4 + 2\).
Solution: Division first: \(12 \div 4 = 3\). Then left to right: \(20 - 3 = 17\), and \(17 + 2 = 19\).
Answer: \(19\)
Example: 50 students ride in vans that hold 8 each. How many vans are needed?
Solution: \(50 \div 8 = 6\) remainder \(2\). Six vans hold 48 students, and 2 students still need a ride.
Answer: 7 vans

## Common mistakes
- **Going strictly left to right.** \(3 + 4 \times 5\) is 23, not 35. Multiply first.
- **Thinking M always comes before D.** Multiplication and division are done together, **left to right**. Same for addition and subtraction: \(10 - 3 + 2 = 9\), not 5.
- **Using the commutative property on subtraction.** \(9 - 4\) is not the same as \(4 - 9\).
- **Ignoring the remainder in word problems.** Decide whether to round up (vans needed) or drop it (full boxes made).
- **Distributing to only one term.** \(3(x + 4) = 3x + 12\), not \(3x + 4\).

## In order: Order of operations
- Parentheses (and other grouping)
- Exponents
- Multiplication and division, left to right
- Addition and subtraction, left to right

## Check yourself
Q: What is the product of 9 and 7?
A: 63
Q: Find \(8 + 2 \times 3\).
A: 14
Q: Find \((8 + 2) \times 3\).
A: 30
Q: What is \(29 \div 4\)?
A: 7 remainder 1
Q: Which property says \(5 \times 8 = 8 \times 5\)?
A: The commutative property.

@@ fractions
## Overview
A fraction names **part of a whole**. The **denominator** (bottom) tells how many equal parts make the whole; the **numerator** (top) tells how many of those parts you have. So \(\frac{3}{4}\) means 3 of 4 equal parts.

## Key ideas
- **Equivalent fractions:** multiply or divide the top and bottom by the same number: \(\frac{1}{2} = \frac{2}{4} = \frac{4}{8}\).
- **Simplest form:** divide the top and bottom by their greatest common factor: \(\frac{12}{18} = \frac{2}{3}\) (divide by 6).
- **Adding and subtracting:** you need a **common denominator** first, then add or subtract only the numerators: \(\frac{1}{4} + \frac{2}{4} = \frac{3}{4}\).
- **Multiplying:** multiply straight across: \(\frac{a}{b} \cdot \frac{c}{d} = \frac{ac}{bd}\). No common denominator needed.
- **Dividing:** keep the first fraction, flip the second (its **reciprocal**), and multiply: \(\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \cdot \frac{d}{c}\).
- **Reciprocal:** the fraction flipped. A number times its reciprocal is 1: \(\frac{2}{5} \cdot \frac{5}{2} = 1\).
- **Mixed numbers and improper fractions:** \(2\tfrac{1}{3} = \frac{7}{3}\), because \(2 \times 3 + 1 = 7\). Change mixed numbers to improper fractions before multiplying or dividing.

## Worked examples
Example: Add \(\frac{2}{3} + \frac{1}{4}\).
Solution: The least common denominator of 3 and 4 is 12. \(\frac{2}{3} = \frac{8}{12}\) and \(\frac{1}{4} = \frac{3}{12}\).
\(\frac{8}{12} + \frac{3}{12} = \frac{11}{12}\).
Answer: \(\frac{11}{12}\)
Example: Multiply \(\frac{3}{4} \cdot \frac{2}{9}\).
Solution: Straight across: \(\frac{3 \cdot 2}{4 \cdot 9} = \frac{6}{36}\). Simplify by dividing by 6.
Answer: \(\frac{1}{6}\)
Example: Divide \(1\tfrac{1}{2} \div \frac{3}{4}\).
Solution: Change to an improper fraction: \(1\tfrac{1}{2} = \frac{3}{2}\). Flip the second fraction and multiply: \(\frac{3}{2} \cdot \frac{4}{3} = \frac{12}{6}\).
Answer: \(2\)

## Common mistakes
- **Adding denominators.** \(\frac{1}{2} + \frac{1}{3}\) is **not** \(\frac{2}{5}\). Use a common denominator: \(\frac{3}{6} + \frac{2}{6} = \frac{5}{6}\).
- **Flipping the wrong fraction.** When dividing, flip the **second** fraction only.
- **Finding a common denominator to multiply.** You don't need one; just multiply across.
- **Forgetting to simplify.** Most answers are expected in simplest form.
- **Multiplying a mixed number piece by piece.** \(2\tfrac{1}{2} \times 2\) is 5, not \(4\tfrac{1}{2}\). Convert to \(\frac{5}{2}\) first.

## In order: Adding fractions with different denominators
- Find a common denominator (the least common multiple of the denominators)
- Rewrite each fraction with that denominator
- Add the numerators and keep the denominator
- Simplify the answer

## Check yourself
Q: Simplify \(\frac{10}{15}\).
A: \(\frac{2}{3}\)
Q: What is \(\frac{1}{2} + \frac{1}{6}\)?
A: \(\frac{3}{6} + \frac{1}{6} = \frac{4}{6} = \frac{2}{3}\)
Q: What is \(\frac{2}{5} \cdot \frac{5}{8}\)?
A: \(\frac{10}{40} = \frac{1}{4}\)
Q: What is \(\frac{3}{5} \div \frac{1}{2}\)?
A: \(\frac{3}{5} \cdot \frac{2}{1} = \frac{6}{5}\) (or \(1\tfrac{1}{5}\))
Q: Write \(3\tfrac{2}{5}\) as an improper fraction.
A: \(\frac{17}{5}\)

@@ decimals-percents
## Overview
Fractions, decimals and percents are three ways to write the same amount: \(\frac{1}{2} = 0.5 = 50\%\). **Percent** means "per hundred", so 50% is 50 out of 100. Being able to switch between them is the key to discounts, tips, grades and test scores.

## Key ideas
- **Decimal place value:** after the decimal point come tenths, hundredths, thousandths. In 0.375, the 3 is 3 tenths.
- **Fraction → decimal:** divide the top by the bottom: \(\frac{3}{8} = 3 \div 8 = 0.375\).
- **Decimal → percent:** multiply by 100 (move the point 2 places right): \(0.42 = 42\%\).
- **Percent → decimal:** divide by 100 (move the point 2 places left): \(7\% = 0.07\).
- **Percent of a number:** \(p\%\) of \(N\) is \(\frac{p}{100} \times N\). 20% of 60 is \(0.2 \times 60 = 12\).
- **Percent change:** \(\frac{\text{new} - \text{old}}{\text{old}} \times 100\%\). Positive means an increase; negative means a decrease.
- **Benchmarks to memorize:** \(\frac{1}{4} = 0.25 = 25\%\), \(\frac{1}{5} = 0.2 = 20\%\), \(\frac{1}{10} = 0.1 = 10\%\), \(\frac{3}{4} = 0.75 = 75\%\).

## Worked examples
Example: A jacket costs 80 dollars and is 25% off. What is the sale price?
Solution: Discount: \(0.25 \times 80 = 20\) dollars. Sale price: \(80 - 20 = 60\).
Answer: 60 dollars
Example: A town grew from 2,000 to 2,300 people. What is the percent change?
Solution: \(\frac{2300 - 2000}{2000} \times 100\% = \frac{300}{2000} \times 100\% = 15\%\).
Answer: a 15% increase
Example: Write \(\frac{7}{20}\) as a decimal and a percent.
Solution: \(7 \div 20 = 0.35\). Multiply by 100 for the percent.
Answer: \(0.35 = 35\%\)

## Common mistakes
- **Moving the decimal the wrong way.** Percent to decimal moves **left**: 5% = 0.05, not 0.5.
- **Dividing by the new value in percent change.** Always divide by the **original** (old) value.
- **Adding percents of different amounts.** 10% off and then another 10% off is 19% off in total, not 20%: \(0.9 \times 0.9 = 0.81\).
- **Lining up digits instead of decimal points.** When adding 2.5 + 0.35, line up the points: 2.50 + 0.35 = 2.85.

## Check yourself
Q: Write 0.6 as a percent.
A: 60%
Q: What is 15% of 40?
A: \(0.15 \times 40 = 6\)
Q: Write 3% as a decimal.
A: 0.03
Q: A price goes from 50 to 40 dollars. What is the percent change?
A: \(\frac{40 - 50}{50} \times 100\% = -20\%\), a 20% decrease.
Q: Write \(\frac{3}{8}\) as a percent.
A: \(0.375 = 37.5\%\)

@@ integers-exponents
## Overview
**Integers** are the whole numbers and their opposites: …, −2, −1, 0, 1, 2, …. **Exponents** are shorthand for repeated multiplication, and **roots** undo them. Together they let you work with temperatures below zero, debts, and very large or very small numbers.

## Key ideas
- **Absolute value** is distance from zero, so it's never negative: \(|-5| = 5\) and \(|5| = 5\).
- **Adding integers:** same signs, add and keep the sign (\(-3 + -4 = -7\)). Different signs, subtract and keep the sign of the larger absolute value (\(-9 + 4 = -5\)).
- **Subtracting:** add the opposite: \(5 - (-3) = 5 + 3 = 8\).
- **Multiplying and dividing:** same signs give a positive answer; different signs give a negative answer.
- **Exponents:** \(2^3 = 2 \cdot 2 \cdot 2 = 8\). The **base** is 2 and the **exponent** is 3.
- **Exponent rules:** \(a^m \cdot a^n = a^{m+n}\), \(\frac{a^m}{a^n} = a^{m-n}\), \((a^m)^n = a^{mn}\), \(a^0 = 1\) (for \(a \neq 0\)), and \(a^{-n} = \frac{1}{a^n}\).
- **Square root:** \(\sqrt{49} = 7\) because \(7^2 = 49\). Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100.
- **Scientific notation:** \(a \times 10^n\) with \(1 \le |a| < 10\). \(5{,}200 = 5.2 \times 10^3\) and \(0.004 = 4 \times 10^{-3}\).

## Worked examples
Example: Find \(-6 - (-10)\).
Solution: Subtracting a negative is adding: \(-6 + 10\). Different signs: \(10 - 6 = 4\), and 10 has the larger absolute value, so the answer is positive.
Answer: \(4\)
Example: Simplify \(\frac{x^7 \cdot x^2}{x^4}\).
Solution: Multiply: add exponents, \(x^{7+2} = x^9\). Divide: subtract exponents, \(x^{9-4}\).
Answer: \(x^5\)
Example: Write 0.00031 in scientific notation.
Solution: Move the decimal 4 places right to get 3.1. Moving right means a negative exponent.
Answer: \(3.1 \times 10^{-4}\)

## Common mistakes
- **\(-3^2\) vs. \((-3)^2\).** \(-3^2 = -9\) (square first, then the minus), but \((-3)^2 = 9\).
- **Thinking a negative exponent makes a negative number.** \(2^{-3} = \frac{1}{8}\), which is positive.
- **Multiplying the base by the exponent.** \(4^3 = 64\), not 12.
- **Adding exponents when adding terms.** \(x^2 + x^3\) can't be combined; only \(x^2 \cdot x^3 = x^5\).
- **Scientific notation with a front number of 10 or more.** \(52 \times 10^2\) should be \(5.2 \times 10^3\).

## Check yourself
Q: What is \(|-12|\)?
A: 12
Q: Find \((-4)(-6)\).
A: 24
Q: What is \(5^0\)?
A: 1
Q: Write \(10^{-2}\) as a fraction.
A: \(\frac{1}{100}\)
Q: Write 72,000 in scientific notation.
A: \(7.2 \times 10^4\)

@@ ratios
## Overview
A **ratio** compares two amounts, like 3 boys to 4 girls (written 3:4 or \(\frac{3}{4}\)). A **proportion** says two ratios are equal. Ratios power recipes, maps, unit prices, speed and scale drawings.

## Key ideas
- **Writing ratios:** "3 to 4", \(3:4\) and \(\frac{3}{4}\) all mean the same comparison. Order matters: boys to girls is not girls to boys.
- **Equivalent ratios:** multiply or divide both parts by the same number: \(3:4 = 6:8 = 9:12\).
- **Unit rate:** a rate per 1 unit, like 60 miles per hour or 2 dollars per pound. Divide to find it.
- **Proportion:** \(\frac{a}{b} = \frac{c}{d}\). Solve it with **cross multiplication**: \(ad = bc\).
- **Direct variation:** \(y = kx\). When \(x\) doubles, \(y\) doubles. \(k\) is the constant of proportionality (the unit rate).
- **Part-to-whole:** if the ratio is 3:4, there are \(3 + 4 = 7\) parts in all, so the first group is \(\frac{3}{7}\) of the total.

## Worked examples
Example: Solve \(\frac{x}{12} = \frac{5}{8}\).
Solution: Cross multiply: \(8x = 12 \cdot 5 = 60\). Divide by 8.
Answer: \(x = 7.5\)
Example: Which is the better buy: 12 ounces for 3 dollars, or 20 ounces for 4.40 dollars?
Solution: Unit prices: \(3 \div 12 = 0.25\) dollars per ounce, and \(4.40 \div 20 = 0.22\) dollars per ounce.
Answer: 20 ounces for 4.40 dollars (cheaper per ounce)
Example: A class has a boy-to-girl ratio of 2:3 and 30 students. How many are girls?
Solution: There are \(2 + 3 = 5\) parts, so each part is \(30 \div 5 = 6\) students. Girls are 3 parts.
Answer: 18 girls

## Common mistakes
- **Flipping the order.** If the question asks for girls to boys, write girls first.
- **Cross multiplying the wrong pairs.** Multiply diagonally: the top of one by the bottom of the other.
- **Using part-to-part as part-to-whole.** In a 2:3 ratio, the first group is \(\frac{2}{5}\) of the total, not \(\frac{2}{3}\).
- **Mixing units.** Convert to the same units (minutes vs. hours, inches vs. feet) before comparing.

## Check yourself
Q: Simplify the ratio 18:24.
A: 3:4
Q: A car goes 150 miles in 3 hours. What is its unit rate?
A: 50 miles per hour
Q: Solve \(\frac{4}{10} = \frac{x}{25}\).
A: \(10x = 100\), so \(x = 10\)
Q: If \(y = kx\) and \(y = 12\) when \(x = 4\), what is \(k\)?
A: 3
Q: A recipe uses 2 cups of flour for 3 cups of milk. How much flour for 9 cups of milk?
A: 6 cups
`);
  /* ---------- Algebra ---------- */
  add(String.raw`
@@ linear-equations
## Overview
A **linear equation** like \(3x + 4 = 19\) has a variable to the first power. Solving it means finding the value that makes it true. The idea is balance: whatever you do to one side, you do to the other, using **inverse operations** to get the variable alone.

## Key ideas
- A **variable** is a letter standing for an unknown number. A **solution** makes the equation true.
- **Inverse operations** undo each other: addition and subtraction, multiplication and division.
- **Undo in reverse order:** in \(3x + 4\), the \(x\) was multiplied by 3 and then 4 was added, so subtract 4 first, then divide by 3.
- **Like terms** have the same variable and power (\(3x\) and \(-5x\)). Combine them before solving.
- **Distribute** first if there are parentheses: \(5(x - 2) = 5x - 10\).
- **Variables on both sides:** move them to one side by adding or subtracting.
- **Inequalities** (\(<, >, \le, \ge\)) are solved the same way, except: **multiplying or dividing by a negative flips the sign**.
- **Check** your answer by plugging it back in.

## Worked examples
Example: Solve \(3x + 4 = 19\).
Solution: Subtract 4: \(3x = 15\). Divide by 3: \(x = 5\). Check: \(3(5) + 4 = 19\). ✓
Answer: \(x = 5\)
Example: Solve \(5(x - 2) = 3x + 8\).
Solution: Distribute: \(5x - 10 = 3x + 8\). Subtract \(3x\): \(2x - 10 = 8\). Add 10: \(2x = 18\).
Answer: \(x = 9\)
Example: Solve \(-2x + 5 > 11\).
Solution: Subtract 5: \(-2x > 6\). Divide by \(-2\) and **flip** the sign: \(x < -3\).
Answer: \(x < -3\)

## Common mistakes
- **Forgetting to flip the inequality** when multiplying or dividing by a negative.
- **Doing an operation to only one side.** Every step must happen on both sides.
- **Distributing to only the first term.** \(5(x - 2)\) is \(5x - 10\), not \(5x - 2\).
- **Sign errors when moving terms.** Subtracting \(3x\) from \(-3x\) gives \(-6x\), not 0.
- **Combining unlike terms.** \(3x + 4\) is not \(7x\).

## In order: Solving a linear equation
- Distribute to clear parentheses
- Combine like terms on each side
- Move the variable terms to one side
- Undo addition or subtraction
- Undo multiplication or division
- Check by substituting the answer

## Check yourself
Q: Solve \(x - 7 = 12\).
A: \(x = 19\)
Q: Solve \(4x = -28\).
A: \(x = -7\)
Q: Solve \(2x + 3 = x - 5\).
A: \(x = -8\)
Q: Solve \(-3x \le 12\).
A: \(x \ge -4\) (the sign flips)
Q: Are \(4x^2\) and \(4x\) like terms?
A: No, the powers are different.

@@ lines-slope
## Overview
Every straight line has a **slope** (how steep it is) and an equation that describes it. Slope is "rise over run": how much \(y\) changes when \(x\) increases by 1. Once you know the slope and one point, you can write the line's equation.

## Key ideas
- **Slope:** \(m = \frac{y_2 - y_1}{x_2 - x_1}\). Subtract in the same order on top and bottom.
- Positive slope rises left to right, negative falls, **horizontal** lines \(y = c\) have slope 0, and **vertical** lines \(x = c\) have an undefined slope.
- **Slope-intercept form:** \(y = mx + b\). \(m\) is the slope and \(b\) is the **y-intercept** (where the line crosses the y-axis).
- **Point-slope form:** \(y - y_1 = m(x - x_1)\). Use it when you know a point and the slope.
- **Standard form:** \(Ax + By = C\). Find intercepts by setting \(x = 0\), then \(y = 0\).
- **Parallel lines** have equal slopes. **Perpendicular lines** have slopes that are negative reciprocals: \(m_1 m_2 = -1\) (for example 2 and \(-\frac{1}{2}\)).

## Worked examples
Example: Find the slope through \((1, 2)\) and \((4, 11)\), then the equation of the line.
Solution: \(m = \frac{11 - 2}{4 - 1} = \frac{9}{3} = 3\). Point-slope: \(y - 2 = 3(x - 1)\), so \(y = 3x - 3 + 2\).
Answer: \(m = 3\), \(y = 3x - 1\)
Example: Write the line perpendicular to \(y = 2x + 1\) through \((4, 1)\).
Solution: The perpendicular slope is \(-\frac{1}{2}\). \(y - 1 = -\frac{1}{2}(x - 4)\), so \(y = -\frac{1}{2}x + 2 + 1\).
Answer: \(y = -\frac{1}{2}x + 3\)
Example: Find the intercepts of \(2x + 5y = 10\).
Solution: \(x = 0\): \(5y = 10\), \(y = 2\). \(y = 0\): \(2x = 10\), \(x = 5\).
Answer: y-intercept \((0, 2)\), x-intercept \((5, 0)\)

## Common mistakes
- **Run over rise.** Slope is change in \(y\) **over** change in \(x\).
- **Subtracting in different orders.** If you do \(y_2 - y_1\) on top, do \(x_2 - x_1\) on the bottom.
- **Mixing up horizontal and vertical.** \(y = 4\) is horizontal (slope 0); \(x = 4\) is vertical (undefined).
- **Perpendicular slope with only the sign changed.** The negative reciprocal of \(\frac{2}{3}\) is \(-\frac{3}{2}\), not \(-\frac{2}{3}\).

## Check yourself
Q: What is the slope of \(y = -4x + 7\)?
A: \(-4\)
Q: What is the slope through \((2, 5)\) and \((6, 5)\)?
A: 0 (a horizontal line)
Q: A line is parallel to \(y = \frac{1}{3}x - 2\). What is its slope?
A: \(\frac{1}{3}\)
Q: What slope is perpendicular to \(-4\)?
A: \(\frac{1}{4}\)
Q: What is the y-intercept of \(y = 5x - 8\)?
A: \(-8\), the point \((0, -8)\)

@@ systems
## Overview
A **system of equations** is two (or more) equations that must be true at the same time. For two lines, the solution is the point where they cross. You can find it by graphing, by **substitution**, or by **elimination**.

## Key ideas
- The solution is an ordered pair \((x, y)\) that works in **both** equations.
- **Substitution:** solve one equation for a variable, then plug that expression into the other equation.
- **Elimination:** add or subtract the equations (after multiplying one or both if needed) so one variable cancels.
- **One solution:** the lines have different slopes and cross once.
- **No solution:** the lines are parallel (same slope, different intercepts). Algebra gives a false statement like \(0 = 5\).
- **Infinitely many solutions:** the equations are the same line. Algebra gives a true statement like \(0 = 0\).
- **Word problems:** name two unknowns, write one equation for each fact, then solve.

## Worked examples
Example: Solve \(2x + y = 7\) and \(x - y = 2\).
Solution: Add the equations to eliminate \(y\): \(3x = 9\), so \(x = 3\). Then \(3 - y = 2\), so \(y = 1\).
Answer: \((3, 1)\)
Example: Solve \(y = 2x + 1\) and \(3x + y = 11\).
Solution: Substitute: \(3x + (2x + 1) = 11\), so \(5x = 10\) and \(x = 2\). Then \(y = 2(2) + 1 = 5\).
Answer: \((2, 5)\)
Example: Tickets cost 5 dollars for students and 8 for adults. 20 tickets sold for 127 dollars. How many of each?
Solution: \(s + a = 20\) and \(5s + 8a = 127\). From the first, \(s = 20 - a\). Substitute: \(5(20 - a) + 8a = 127\), so \(100 + 3a = 127\) and \(a = 9\).
Answer: 11 student tickets and 9 adult tickets

## Common mistakes
- **Stopping after one variable.** A solution needs both \(x\) and \(y\).
- **Multiplying only one term** when scaling an equation for elimination. Multiply every term.
- **Subtracting equations with sign errors.** Subtracting \(-y\) is adding \(y\).
- **Reading \(0 = 0\) as "no solution".** \(0 = 0\) means infinitely many; a false statement means none.

## Check yourself
Q: Is \((1, 4)\) a solution of \(y = x + 3\) and \(y = 2x + 2\)?
A: Yes: \(4 = 1 + 3\) and \(4 = 2(1) + 2\).
Q: Solve \(x + y = 10\) and \(x - y = 4\).
A: \((7, 3)\)
Q: How many solutions do \(y = 3x + 1\) and \(y = 3x - 2\) have?
A: None; the lines are parallel.
Q: Solving a system gives \(0 = 0\). What does that mean?
A: Infinitely many solutions (the same line).
Q: Which method is easiest for \(y = x - 1\) and \(2x + y = 8\)?
A: Substitution; \(y\) is already alone. The solution is \((3, 2)\).

@@ polynomials
## Overview
A **polynomial** is a sum of terms like \(3x^2 - 5x + 7\), where the exponents are whole numbers. You'll **expand** polynomials (multiply them out) and **factor** them (write them as a product), which is the key to solving equations later.

## Key ideas
- The **degree** is the highest exponent: \(4x^3 - x + 2\) has degree 3.
- **Exponent rules:** \(x^a \cdot x^b = x^{a+b}\), \(\frac{x^a}{x^b} = x^{a-b}\), \((x^a)^b = x^{ab}\).
- **Add or subtract** by combining like terms.
- **Multiply** with the distributive property. For two binomials, **FOIL**: First, Outer, Inner, Last.
- **Factor out the GCF first:** \(6x^3 + 9x^2 = 3x^2(2x + 3)\).
- **Trinomials** \(x^2 + bx + c\): find two numbers that multiply to \(c\) and add to \(b\).
- **Difference of squares:** \(a^2 - b^2 = (a - b)(a + b)\).
- **Perfect square trinomial:** \(a^2 + 2ab + b^2 = (a + b)^2\).

## Worked examples
Example: Expand \((x + 3)(x - 5)\).
Solution: First \(x^2\), Outer \(-5x\), Inner \(3x\), Last \(-15\). Combine \(-5x + 3x = -2x\).
Answer: \(x^2 - 2x - 15\)
Example: Factor \(x^2 + 7x + 12\).
Solution: Two numbers that multiply to 12 and add to 7: 3 and 4.
Answer: \((x + 3)(x + 4)\)
Example: Factor \(4x^2 - 9\).
Solution: It's a difference of squares: \((2x)^2 - 3^2\).
Answer: \((2x - 3)(2x + 3)\)

## Common mistakes
- **\((a + b)^2 = a^2 + b^2\).** Wrong: \((a + b)^2 = a^2 + 2ab + b^2\). Don't forget the middle term.
- **Multiplying exponents when multiplying powers.** \(x^2 \cdot x^3 = x^5\), not \(x^6\).
- **Skipping the GCF.** Always factor out common factors first, or the rest won't factor nicely.
- **Trying to factor a sum of squares.** \(x^2 + 9\) doesn't factor over the real numbers.
- **Sign errors in factors.** Check by multiplying your factors back out.

## Check yourself
Q: What is the degree of \(5x^4 - 2x^2 + 1\)?
A: 4
Q: Simplify \((x^3)^4\).
A: \(x^{12}\)
Q: Expand \((x + 4)^2\).
A: \(x^2 + 8x + 16\)
Q: Factor \(x^2 - 5x + 6\).
A: \((x - 2)(x - 3)\)
Q: Factor \(x^2 - 49\).
A: \((x - 7)(x + 7)\)

@@ quadratics
## Overview
A **quadratic** has an \(x^2\) term: \(ax^2 + bx + c = 0\) with \(a \neq 0\). Its graph is a U-shaped **parabola**. Solving it finds where the parabola crosses the x-axis; there can be 2, 1 or 0 real solutions.

## Key ideas
- **Factoring** plus the **zero product property** (if \(ab = 0\), then \(a = 0\) or \(b = 0\)) is the fastest method when it works.
- **Quadratic formula** works every time: \(x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}\).
- **Discriminant** \(b^2 - 4ac\): positive → 2 real roots, zero → 1 real root, negative → no real roots (two complex ones).
- **Vertex:** the turning point, at \(x = -\frac{b}{2a}\). Plug that \(x\) back in to get the \(y\).
- **Axis of symmetry:** the vertical line \(x = -\frac{b}{2a}\).
- **Vertex form:** \(y = a(x - h)^2 + k\) has vertex \((h, k)\).
- If \(a > 0\) the parabola opens up (the vertex is a minimum); if \(a < 0\) it opens down (a maximum).

## Worked examples
Example: Solve \(x^2 - 5x + 6 = 0\).
Solution: Factor: \((x - 2)(x - 3) = 0\). Zero product property: \(x - 2 = 0\) or \(x - 3 = 0\).
Answer: \(x = 2\) or \(x = 3\)
Example: Solve \(2x^2 + 3x - 2 = 0\) with the quadratic formula.
Solution: \(a = 2\), \(b = 3\), \(c = -2\). Discriminant: \(9 - 4(2)(-2) = 25\).
\(x = \frac{-3 \pm 5}{4}\), so \(x = \frac{2}{4}\) or \(x = \frac{-8}{4}\).
Answer: \(x = \frac{1}{2}\) or \(x = -2\)
Example: Find the vertex of \(y = x^2 - 4x + 1\).
Solution: \(x = -\frac{-4}{2(1)} = 2\). Then \(y = 4 - 8 + 1 = -3\).
Answer: \((2, -3)\)

## Common mistakes
- **Not setting the equation to 0 first.** Rewrite \(x^2 = 3x + 4\) as \(x^2 - 3x - 4 = 0\) before factoring.
- **Dividing only part of the numerator by \(2a\).** The whole \(-b \pm \sqrt{\ldots}\) goes over \(2a\).
- **Squaring a negative \(b\) wrong.** If \(b = -4\), then \(b^2 = 16\), not \(-16\).
- **Dropping a solution.** \(x^2 = 9\) has two solutions: \(x = 3\) and \(x = -3\).
- **Vertex form signs.** \(y = (x + 2)^2 - 1\) has vertex \((-2, -1)\).

## In order: Solving with the quadratic formula
- Write the equation as \(ax^2 + bx + c = 0\)
- Identify \(a\), \(b\) and \(c\)
- Compute the discriminant \(b^2 - 4ac\)
- Substitute into \(x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}\)
- Simplify both the plus and the minus answers

## Check yourself
Q: Solve \(x^2 - 16 = 0\).
A: \(x = 4\) or \(x = -4\)
Q: How many real roots does \(x^2 + 2x + 5 = 0\) have?
A: None; the discriminant is \(4 - 20 = -16\).
Q: Solve \(x^2 + 6x + 9 = 0\).
A: \(x = -3\) (a double root)
Q: What is the vertex of \(y = 2(x - 1)^2 + 4\)?
A: \((1, 4)\)
Q: Does \(y = -x^2 + 3\) open up or down?
A: Down, because \(a = -1 < 0\).

@@ exponents-logs
## Overview
**Exponential functions** like \(2^x\) grow (or shrink) by the same factor each step, which is how populations, money and radioactive decay behave. **Logarithms** are the reverse: \(\log_b x\) asks "what power of \(b\) gives \(x\)?" Logs let you solve for an unknown exponent.

## Key ideas
- **Definition:** \(\log_b x = y\) means \(b^y = x\). So \(\log_2 8 = 3\) because \(2^3 = 8\).
- \(\log_b 1 = 0\) and \(\log_b b = 1\). You can't take the log of 0 or a negative number.
- **Common log** \(\log x\) is base 10; **natural log** \(\ln x\) is base \(e \approx 2.718\).
- **Product rule:** \(\log_b(MN) = \log_b M + \log_b N\).
- **Quotient rule:** \(\log_b\left(\frac{M}{N}\right) = \log_b M - \log_b N\).
- **Power rule:** \(\log_b(M^k) = k \log_b M\). This is how you bring an exponent down to solve for it.
- **Change of base:** \(\log_b x = \frac{\ln x}{\ln b}\).
- **Growth and decay:** \(A = A_0 e^{kt}\) (growth if \(k > 0\), decay if \(k < 0\)). **Compound interest:** \(A = P\left(1 + \frac{r}{n}\right)^{nt}\).

## Worked examples
Example: Solve \(3^x = 81\).
Solution: Write 81 as a power of 3: \(81 = 3^4\). So \(3^x = 3^4\).
Answer: \(x = 4\)
Example: Solve \(2^x = 10\).
Solution: Take ln of both sides: \(\ln 2^x = \ln 10\). Power rule: \(x \ln 2 = \ln 10\), so \(x = \frac{\ln 10}{\ln 2}\).
Answer: \(x \approx 3.32\)
Example: 1,000 dollars is invested at 5% interest compounded monthly. How much is there after 2 years?
Solution: \(A = 1000\left(1 + \frac{0.05}{12}\right)^{12 \cdot 2} = 1000(1.0041\overline{6})^{24}\).
Answer: about 1,104.94 dollars

## Common mistakes
- **\(\log(M + N) = \log M + \log N\).** Wrong. The product rule is for \(\log(MN)\); a log of a sum doesn't split.
- **Dividing logs instead of subtracting.** \(\log\frac{M}{N} = \log M - \log N\), not \(\frac{\log M}{\log N}\).
- **Forgetting the exponent's base.** \(\log_2 8\) asks "2 to what power is 8?", not "8 to what power".
- **Using the percent as a whole number.** In formulas, 5% is \(r = 0.05\).

## Check yourself
Q: What is \(\log_5 25\)?
A: 2
Q: What is \(\log 1000\)?
A: 3 (base 10)
Q: Write \(\log_b x + \log_b y\) as one log.
A: \(\log_b(xy)\)
Q: Write \(\log_4 64 = 3\) in exponential form.
A: \(4^3 = 64\)
Q: Solve \(e^x = 5\).
A: \(x = \ln 5 \approx 1.61\)

@@ functions
## Overview
A **function** is a rule that gives each input exactly one output, written \(f(x)\). Functions let you describe how one quantity depends on another. You'll evaluate them, find their **domain** and **range**, combine them, and undo them with **inverses**.

## Key ideas
- **Evaluate** by substituting: if \(f(x) = 2x + 3\), then \(f(4) = 11\).
- **Domain:** all allowed inputs. Watch for dividing by zero and square roots of negatives.
- **Range:** all possible outputs.
- **Vertical line test:** a graph is a function if no vertical line hits it more than once.
- **Composition:** \((f \circ g)(x) = f(g(x))\). Do the inside function first.
- **Inverse:** \(f^{-1}\) undoes \(f\). To find it, swap \(x\) and \(y\) and solve for \(y\). Its graph is \(f\) reflected over \(y = x\).
- **Even functions:** \(f(-x) = f(x)\), symmetric about the y-axis (like \(x^2\)). **Odd functions:** \(f(-x) = -f(x)\), symmetric about the origin (like \(x^3\)).
- **Transformations:** \(f(x) + k\) shifts up, \(f(x - h)\) shifts right, \(-f(x)\) flips over the x-axis.

## Worked examples
Example: If \(f(x) = 2x + 3\) and \(g(x) = x^2\), find \(f(g(2))\) and \(g(f(2))\).
Solution: \(g(2) = 4\), so \(f(g(2)) = f(4) = 11\). \(f(2) = 7\), so \(g(f(2)) = g(7) = 49\).
Answer: \(f(g(2)) = 11\) and \(g(f(2)) = 49\)
Example: Find the inverse of \(f(x) = 2x + 3\).
Solution: Write \(y = 2x + 3\). Swap: \(x = 2y + 3\). Solve: \(y = \frac{x - 3}{2}\).
Answer: \(f^{-1}(x) = \frac{x - 3}{2}\)
Example: Find the domain of \(f(x) = \sqrt{x - 4}\) and of \(g(x) = \frac{1}{x - 3}\).
Solution: A square root needs \(x - 4 \ge 0\). A fraction needs \(x - 3 \neq 0\).
Answer: \(f\): \(x \ge 4\); \(g\): all real numbers except \(x = 3\)

## Common mistakes
- **Reading \(f(x)\) as "f times x".** It means "f of x", the output for input \(x\).
- **Composing in the wrong order.** \(f(g(x))\) means do \(g\) first.
- **Writing \(f^{-1}(x) = \frac{1}{f(x)}\).** The inverse undoes \(f\); it is not the reciprocal.
- **Shifting the wrong way.** \(f(x - 2)\) moves the graph 2 to the **right**.

## Check yourself
Q: If \(f(x) = x^2 - 1\), what is \(f(-3)\)?
A: 8
Q: Is a circle the graph of a function?
A: No; a vertical line crosses it twice.
Q: What is the domain of \(f(x) = \frac{5}{x}\)?
A: All real numbers except 0.
Q: Is \(f(x) = x^3\) even, odd or neither?
A: Odd: \((-x)^3 = -x^3\).
Q: What is the inverse of \(f(x) = x + 7\)?
A: \(f^{-1}(x) = x - 7\)

@@ alg2-ch2
## Overview
This guide follows Algebra 2 sections 2.1 to 2.3. **2.1 Relations and functions:** what makes a relation a function, with domain and range. **2.2 Slope and rate of change:** how steep a line is. **2.3 Graphing lines:** from slope-intercept form and standard form.

## Key ideas
### 2.1 Relations and functions
- A **relation** pairs inputs with outputs. You can show it as ordered pairs, a table, a graph or a mapping diagram.
- **Domain** = the inputs (x-values), **range** = the outputs (y-values). List each value once, smallest to largest.
- A **function** gives each input exactly **one** output. Outputs can repeat; inputs can't.
- **Vertical line test:** a graph is a function if no vertical line crosses it more than once.
- A **linear function** can be written \(y = mx + b\). If you see \(x^2\), \(x^3\) or \(x\) in a denominator, it is not linear.
### 2.2 Slope and rate of change
- **Slope** \(m = \frac{y_2 - y_1}{x_2 - x_1}\) (rise over run). Positive rises, negative falls, zero is horizontal, undefined is vertical.
- **Parallel** lines have equal slopes. **Perpendicular** lines have negative reciprocal slopes: flip and change the sign (\(\frac{3}{4} \to -\frac{4}{3}\)).
- **Rate of change** is slope in a real situation: miles per hour, dollars per month.
### 2.3 Graphing lines
- **Slope-intercept form** \(y = mx + b\): plot \((0, b)\), then use the slope to find another point.
- **Standard form** \(Ax + By = C\): find the intercepts (set \(x = 0\), then \(y = 0\)) and connect them.
- \(y = c\) is horizontal; \(x = c\) is vertical. The **parent function** is \(y = x\).

## Worked examples
Example: Is \(\{(-2, 3), (0, 1), (1, 3), (4, 5)\}\) a function? Give its domain and range.
Solution: Each input \(-2, 0, 1, 4\) appears once, so yes. The output 3 repeats, which is allowed.
Answer: A function; domain \(\{-2, 0, 1, 4\}\), range \(\{1, 3, 5\}\)
Example: Find the slope through \((-1, 4)\) and \((3, -4)\).
Solution: \(m = \frac{-4 - 4}{3 - (-1)} = \frac{-8}{4}\).
Answer: \(m = -2\) (the line falls)
Example: Graph \(3x + 2y = 12\) using intercepts.
Solution: \(x = 0\): \(2y = 12\), so \(y = 6\). \(y = 0\): \(3x = 12\), so \(x = 4\). Plot \((0, 6)\) and \((4, 0)\) and draw the line.
Answer: Intercepts \((0, 6)\) and \((4, 0)\); slope \(-\frac{3}{2}\)

## Common mistakes
- **Thinking repeated outputs break a function.** Only a repeated **input** with different outputs does.
- **Listing a domain value twice.** Write each value once, in order.
- **Subtracting coordinates in different orders** when finding slope.
- **Plotting the slope as run over rise.** Go up (rise) first, then over (run).
- **Calling \(y = \frac{3}{x}\) linear.** An \(x\) in the denominator makes it not linear.

## Check yourself
Q: Is \(\{(1, 2), (1, 5), (3, 4)\}\) a function?
A: No; the input 1 has two outputs.
Q: What is the slope of a vertical line?
A: Undefined.
Q: What is the negative reciprocal of \(-5\)?
A: \(\frac{1}{5}\)
Q: What are the slope and y-intercept of \(y = -\frac{2}{3}x + 4\)?
A: Slope \(-\frac{2}{3}\), y-intercept 4
Q: Find the x-intercept of \(2x - 5y = 10\).
A: Set \(y = 0\): \(2x = 10\), so \(x = 5\).
`);
  /* ---------- Geometry & Trigonometry, Precalculus ---------- */
  add(String.raw`
@@ geometry-area
## Overview
**Perimeter** is the distance around a shape (a length, like feet). **Area** is the space inside it (square units, like square feet). Every formula here comes from the rectangle: a triangle is half a rectangle, and a parallelogram is a rectangle with one end moved.

## Key ideas
- **Rectangle:** \(A = lw\), perimeter \(P = 2l + 2w\).
- **Parallelogram:** \(A = bh\), where \(h\) is the **perpendicular** height, not the slanted side.
- **Triangle:** \(A = \frac{1}{2}bh\).
- **Trapezoid:** \(A = \frac{1}{2}(b_1 + b_2)h\): the average of the two parallel sides times the height.
- **Circle:** area \(A = \pi r^2\); circumference (its perimeter) \(C = 2\pi r = \pi d\). The diameter is twice the radius.
- **Composite shapes:** split them into rectangles, triangles and circles; add the pieces (or subtract a cut-out).
- **Units:** perimeter is in units (cm), area in square units (cm²).

## Worked examples
Example: Find the area of a trapezoid with bases 6 and 10 and height 4.
Solution: \(A = \frac{1}{2}(6 + 10)(4) = \frac{1}{2}(16)(4)\).
Answer: 32 square units
Example: A circle has radius 5 cm. Find its area and circumference.
Solution: \(A = \pi(5)^2 = 25\pi\). \(C = 2\pi(5) = 10\pi\).
Answer: \(A = 25\pi \approx 78.54\) cm², \(C = 10\pi \approx 31.42\) cm
Example: A window is an 8-by-6 rectangle with a half circle on top of the 6-wide side. Find its area.
Solution: Rectangle: \(8 \times 6 = 48\). The half circle has diameter 6, so \(r = 3\): \(\frac{1}{2}\pi(3)^2 = 4.5\pi\).
Answer: \(48 + 4.5\pi \approx 62.14\) square units

## Common mistakes
- **Using the diameter as the radius.** If \(d = 10\), then \(r = 5\).
- **Using the slanted side as the height.** The height is always perpendicular to the base.
- **Forgetting the \(\frac{1}{2}\)** in triangle and trapezoid formulas.
- **Mixing up area and perimeter units.** Area is squared.
- **Squaring \(\pi r\) instead of \(r\).** \(\pi r^2\) means \(\pi \times r \times r\).

## Check yourself
Q: Find the area of a triangle with base 10 and height 7.
A: 35 square units
Q: What is the perimeter of a 9-by-4 rectangle?
A: 26 units
Q: A circle has diameter 12. What is its area?
A: \(36\pi \approx 113.1\) square units
Q: A parallelogram has base 8 and height 5. What is its area?
A: 40 square units
Q: What is the circumference of a circle with radius 7?
A: \(14\pi \approx 43.98\)

@@ pythagorean
## Overview
In any **right triangle**, the two shorter sides (the **legs**) and the longest side (the **hypotenuse**) are linked by \(a^2 + b^2 = c^2\). This lets you find a missing side, check whether a triangle is right, and find distances on a coordinate grid.

## Key ideas
- **Pythagorean theorem:** \(a^2 + b^2 = c^2\), where \(c\) is the **hypotenuse**, the side across from the right angle.
- **Missing hypotenuse:** \(c = \sqrt{a^2 + b^2}\). **Missing leg:** \(a = \sqrt{c^2 - b^2}\).
- **Converse:** if \(a^2 + b^2 = c^2\) for a triangle's sides, it is a right triangle.
- **Pythagorean triples:** 3-4-5, 5-12-13, 8-15-17, 7-24-25, and their multiples (6-8-10).
- **Distance formula:** \(d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}\). It's the Pythagorean theorem on a grid.
- **Midpoint formula:** \(\left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right)\), the average of the coordinates.

## Worked examples
Example: A right triangle has legs 6 and 8. Find the hypotenuse.
Solution: \(c^2 = 36 + 64 = 100\), so \(c = \sqrt{100}\).
Answer: 10
Example: A 13-foot ladder reaches 12 feet up a wall. How far is its base from the wall?
Solution: \(a^2 + 12^2 = 13^2\), so \(a^2 = 169 - 144 = 25\).
Answer: 5 feet
Example: Find the distance and midpoint between \((1, 2)\) and \((7, 10)\).
Solution: \(d = \sqrt{(7 - 1)^2 + (10 - 2)^2} = \sqrt{36 + 64} = 10\). Midpoint: \(\left(\frac{1 + 7}{2}, \frac{2 + 10}{2}\right)\).
Answer: distance 10, midpoint \((4, 6)\)

## Common mistakes
- **Adding when you need a leg.** To find a leg, **subtract**: \(c^2 - b^2\).
- **Putting the hypotenuse in the wrong place.** \(c\) is always the longest side.
- **Writing \(\sqrt{a^2 + b^2} = a + b\).** \(\sqrt{9 + 16} = 5\), not 7.
- **Using it on triangles that aren't right triangles.** It only works with a 90° angle.

## Check yourself
Q: Find the hypotenuse with legs 5 and 12.
A: 13
Q: Is a triangle with sides 7, 24, 25 a right triangle?
A: Yes: \(49 + 576 = 625\).
Q: Find the missing leg if \(c = 10\) and \(a = 6\).
A: 8
Q: Find the distance between \((0, 0)\) and \((3, 4)\).
A: 5
Q: Find the midpoint of \((-2, 5)\) and \((4, 1)\).
A: \((1, 3)\)

@@ angles
## Overview
Angles are measured in degrees. Many geometry problems come down to a few facts: what pairs of angles add up to, what the angles of a triangle add up to, and how to find the angles of any polygon.

## Key ideas
- **Complementary** angles add to \(90^\circ\). **Supplementary** angles add to \(180^\circ\).
- **Vertical angles** (across from each other where two lines cross) are equal.
- Angles on a straight line add to \(180^\circ\); angles around a point add to \(360^\circ\).
- **Parallel lines cut by a transversal:** corresponding and alternate interior angles are equal; same-side interior angles add to \(180^\circ\).
- **Triangle:** the three angles add to \(180^\circ\). An **exterior angle** equals the sum of the two far interior angles.
- **Polygon interior angle sum:** \((n - 2) \cdot 180^\circ\). For a **regular** polygon, divide by \(n\) for each angle.
- **Exterior angles** of any convex polygon add to \(360^\circ\).
- **Congruent** figures: same shape and size. **Similar** figures: same shape, equal angles, proportional sides.

## Worked examples
Example: Find the complement and the supplement of \(35^\circ\).
Solution: Complement: \(90 - 35\). Supplement: \(180 - 35\).
Answer: \(55^\circ\) and \(145^\circ\)
Example: Find each interior angle of a regular hexagon.
Solution: Sum: \((6 - 2) \cdot 180^\circ = 720^\circ\). Divide by 6 equal angles.
Answer: \(120^\circ\)
Example: A triangle has angles \(50^\circ\) and \(65^\circ\). Find the third angle.
Solution: \(180 - 50 - 65\).
Answer: \(65^\circ\)

## Common mistakes
- **Mixing up complementary and supplementary.** "C" comes before "S", and 90 comes before 180.
- **Using \(n \cdot 180\)** for the interior sum. It's \((n - 2) \cdot 180\).
- **Assuming angles are equal because they look equal.** Use a stated fact (vertical angles, parallel lines).
- **Confusing similar and congruent.** Similar shapes can be different sizes.

## Check yourself
Q: Two vertical angles: one is \(72^\circ\). What is the other?
A: \(72^\circ\)
Q: What is the interior angle sum of a pentagon?
A: \(540^\circ\)
Q: What is each exterior angle of a regular octagon?
A: \(360^\circ \div 8 = 45^\circ\)
Q: An angle is \(3x\) and its supplement is \(x\). Find \(x\).
A: \(4x = 180\), so \(x = 45\)
Q: Two triangles have equal angles but different sizes. Are they similar or congruent?
A: Similar.

@@ volume
## Overview
**Volume** is the space inside a 3-D solid (cubic units). **Surface area** is the total area of its outside (square units), like the wrapping paper needed to cover it. Most volume formulas are "base area times height", and pointed solids take one third of that.

## Key ideas
- **Prism or cylinder:** \(V = Bh\), where \(B\) is the area of the base. Box: \(V = lwh\). Cylinder: \(V = \pi r^2 h\).
- **Pyramid or cone:** \(V = \frac{1}{3}Bh\). Cone: \(V = \frac{1}{3}\pi r^2 h\).
- **Sphere:** \(V = \frac{4}{3}\pi r^3\) and \(SA = 4\pi r^2\).
- **Surface area of a box:** \(SA = 2lw + 2lh + 2wh\). **Cube:** \(SA = 6s^2\), \(V = s^3\).
- **Surface area of a cylinder:** \(SA = 2\pi r^2 + 2\pi rh\) (two circles plus the label).
- **Scaling:** if every length is multiplied by \(k\), area is multiplied by \(k^2\) and volume by \(k^3\).

## Worked examples
Example: Find the volume of a cylinder with radius 3 and height 10.
Solution: \(V = \pi(3)^2(10) = 90\pi\).
Answer: \(90\pi \approx 282.74\) cubic units
Example: Find the volume of a cone with radius 3 and height 4.
Solution: \(V = \frac{1}{3}\pi(3)^2(4) = \frac{1}{3}\pi(36)\).
Answer: \(12\pi \approx 37.70\) cubic units
Example: Find the surface area of a 2-by-3-by-4 box.
Solution: \(2(2 \cdot 3) + 2(2 \cdot 4) + 2(3 \cdot 4) = 12 + 16 + 24\).
Answer: 52 square units

## Common mistakes
- **Forgetting the \(\frac{1}{3}\)** for cones and pyramids.
- **Cubing the diameter** in the sphere formula. Use the radius.
- **Mixing up volume and surface area.** Volume is cubic units; surface area is square units.
- **Doubling the volume when lengths double.** Doubling every length multiplies volume by 8.

## Check yourself
Q: What is the volume of a cube with side 5?
A: 125 cubic units
Q: What is the volume of a sphere with radius 3?
A: \(36\pi \approx 113.1\) cubic units
Q: A pyramid has base area 30 and height 9. What is its volume?
A: 90 cubic units
Q: What is the surface area of a cube with side 4?
A: 96 square units
Q: A cone and a cylinder have the same radius and height. How do their volumes compare?
A: The cone has \(\frac{1}{3}\) the volume of the cylinder.

@@ trig-unit-circle
## Overview
The **unit circle** has radius 1 and is centered at the origin. The point at angle \(\theta\) is \((\cos\theta, \sin\theta)\), so cosine is the x-coordinate and sine is the y-coordinate. This extends trig to every angle, including angles past \(90^\circ\) and negative angles. Angles are often measured in **radians**.

## Key ideas
- **Radians:** \(\pi\) radians \(= 180^\circ\). Degrees → radians: multiply by \(\frac{\pi}{180}\). Radians → degrees: multiply by \(\frac{180}{\pi}\).
- **Key angles:** \(30^\circ = \frac{\pi}{6}\), \(45^\circ = \frac{\pi}{4}\), \(60^\circ = \frac{\pi}{3}\), \(90^\circ = \frac{\pi}{2}\).
- **Exact values:** \(\sin 30^\circ = \frac{1}{2}\), \(\sin 45^\circ = \frac{\sqrt{2}}{2}\), \(\sin 60^\circ = \frac{\sqrt{3}}{2}\). Cosine is the same list in reverse.
- \(\tan\theta = \frac{\sin\theta}{\cos\theta}\).
- **Pythagorean identity:** \(\sin^2\theta + \cos^2\theta = 1\).
- **Signs by quadrant (ASTC, "All Students Take Calculus"):** I all positive, II sine, III tangent, IV cosine.
- **Reference angle:** the acute angle to the x-axis. Find the value for the reference angle, then attach the quadrant's sign.

## Worked examples
Example: Convert \(150^\circ\) to radians and find its sine and cosine.
Solution: \(150 \cdot \frac{\pi}{180} = \frac{5\pi}{6}\). It's in quadrant II with reference angle \(30^\circ\): sine positive, cosine negative.
Answer: \(\frac{5\pi}{6}\); \(\sin = \frac{1}{2}\), \(\cos = -\frac{\sqrt{3}}{2}\)
Example: Find \(\sin 225^\circ\).
Solution: \(225^\circ\) is in quadrant III, reference angle \(45^\circ\). Sine is negative there.
Answer: \(-\frac{\sqrt{2}}{2}\)
Example: If \(\sin\theta = \frac{3}{5}\) and \(\theta\) is in quadrant II, find \(\cos\theta\).
Solution: \(\cos^2\theta = 1 - \frac{9}{25} = \frac{16}{25}\), so \(\cos\theta = \pm\frac{4}{5}\). Cosine is negative in quadrant II.
Answer: \(-\frac{4}{5}\)

## Common mistakes
- **Swapping sine and cosine.** On the unit circle, cosine is \(x\) (first) and sine is \(y\).
- **Forgetting the quadrant's sign.** \(\cos 120^\circ = -\frac{1}{2}\), not \(\frac{1}{2}\).
- **Calculator in the wrong mode.** Check degrees vs. radians.
- **Mixing up \(\frac{\sqrt{3}}{2}\) and \(\frac{1}{2}\).** \(\sin 30^\circ = \frac{1}{2}\) (small angle, small height).

## Check yourself
Q: Convert \(\frac{3\pi}{4}\) to degrees.
A: \(135^\circ\)
Q: What is \(\tan\frac{\pi}{3}\)?
A: \(\sqrt{3}\)
Q: In which quadrant are sine and cosine both negative?
A: Quadrant III.
Q: What is \(\cos\pi\)?
A: \(-1\)
Q: What is the reference angle of \(300^\circ\)?
A: \(60^\circ\)

@@ trig-right-triangles
## Overview
In a right triangle, the ratios of the sides depend only on the angle. **SOH-CAH-TOA** names those ratios. For triangles without a right angle, the **law of sines** and **law of cosines** do the same job.

## Key ideas
- **SOH-CAH-TOA:** \(\sin = \frac{\text{opp}}{\text{hyp}}\), \(\cos = \frac{\text{adj}}{\text{hyp}}\), \(\tan = \frac{\text{opp}}{\text{adj}}\). "Opposite" and "adjacent" depend on which angle you're using.
- **Finding a side:** set up the ratio and solve. **Finding an angle:** use the inverse: \(\theta = \sin^{-1}\left(\frac{\text{opp}}{\text{hyp}}\right)\).
- **Law of sines:** \(\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C}\). Use it when you know an angle and its opposite side.
- **Law of cosines:** \(c^2 = a^2 + b^2 - 2ab\cos C\). Use it with two sides and the angle between them, or all three sides.
- **Reciprocal identities:** \(\csc\theta = \frac{1}{\sin\theta}\), \(\sec\theta = \frac{1}{\cos\theta}\), \(\cot\theta = \frac{1}{\tan\theta}\).
- **Double angles:** \(\sin 2\theta = 2\sin\theta\cos\theta\) and \(\cos 2\theta = \cos^2\theta - \sin^2\theta\).

## Worked examples
Example: A right triangle has hypotenuse 10 and an angle of \(30^\circ\). Find the side opposite that angle.
Solution: \(\sin 30^\circ = \frac{\text{opp}}{10}\), so \(\text{opp} = 10 \cdot \frac{1}{2}\).
Answer: 5
Example: The legs of a right triangle are both 7. Find the angles.
Solution: \(\tan\theta = \frac{7}{7} = 1\), so \(\theta = \tan^{-1}(1) = 45^\circ\). The other acute angle is also \(45^\circ\).
Answer: \(45^\circ\), \(45^\circ\), \(90^\circ\)
Example: Two sides are 5 and 7 with a \(60^\circ\) angle between them. Find the third side.
Solution: \(c^2 = 25 + 49 - 2(5)(7)\cos 60^\circ = 74 - 35 = 39\).
Answer: \(c = \sqrt{39} \approx 6.24\)

## Common mistakes
- **Labeling opposite and adjacent from the wrong angle.** Always label from the angle you're working with.
- **Using SOH-CAH-TOA on a non-right triangle.** Use the law of sines or cosines instead.
- **Thinking \(\sin^{-1}x = \frac{1}{\sin x}\).** \(\sin^{-1}\) is the inverse (gives an angle); \(\csc\) is the reciprocal.
- **Calculator in radian mode** when the angle is in degrees.

## Check yourself
Q: In a right triangle, opp = 3, adj = 4, hyp = 5. What is \(\cos\theta\)?
A: \(\frac{4}{5}\)
Q: What is \(\sec\theta\) if \(\cos\theta = \frac{2}{3}\)?
A: \(\frac{3}{2}\)
Q: Which law do you use with all three sides known?
A: The law of cosines.
Q: Simplify \(2\sin\theta\cos\theta\).
A: \(\sin 2\theta\)
Q: A ramp rises 3 m over a 6 m length of ramp. What angle does it make with the ground?
A: \(\sin^{-1}(0.5) = 30^\circ\)

@@ sequences
## Overview
A **sequence** is a list of numbers that follows a pattern; a **series** is the sum of a sequence. **Arithmetic** sequences add the same amount each time; **geometric** sequences multiply by the same amount. Each has a formula for any term and for the sum.

## Key ideas
- **Arithmetic:** common difference \(d\). \(n\)th term: \(a_n = a_1 + (n - 1)d\). Sum: \(S_n = \frac{n}{2}(a_1 + a_n)\).
- **Geometric:** common ratio \(r\). \(n\)th term: \(a_n = a_1 r^{n-1}\). Sum: \(S_n = a_1\frac{1 - r^n}{1 - r}\).
- **Infinite geometric series:** if \(|r| < 1\), \(S = \frac{a_1}{1 - r}\). If \(|r| \ge 1\), the sum doesn't settle.
- **Tell them apart:** subtract neighbors (same difference → arithmetic) or divide them (same ratio → geometric).
- **Sigma notation:** \(\sum_{k=1}^{n} a_k\) means add \(a_1 + a_2 + \dots + a_n\).

## Worked examples
Example: For 3, 7, 11, 15, …, find the 20th term and the sum of the first 20 terms.
Solution: \(d = 4\). \(a_{20} = 3 + 19(4) = 79\). \(S_{20} = \frac{20}{2}(3 + 79) = 10(82)\).
Answer: \(a_{20} = 79\), \(S_{20} = 820\)
Example: For 2, 6, 18, …, find the 6th term and the sum of the first 6 terms.
Solution: \(r = 3\). \(a_6 = 2 \cdot 3^5 = 486\). \(S_6 = 2 \cdot \frac{1 - 3^6}{1 - 3} = 2 \cdot \frac{-728}{-2}\).
Answer: \(a_6 = 486\), \(S_6 = 728\)
Example: Find \(8 + 4 + 2 + 1 + \dots\)
Solution: \(a_1 = 8\), \(r = \frac{1}{2}\), and \(|r| < 1\). \(S = \frac{8}{1 - \frac{1}{2}}\).
Answer: 16

## Common mistakes
- **Using \(n\) instead of \(n - 1\)** in the term formulas.
- **Calling a sequence arithmetic without checking.** 2, 4, 8 has differences 2 and 4, so it's geometric.
- **Using the infinite-sum formula when \(|r| \ge 1\).** That series has no finite sum.
- **Getting the ratio upside down.** \(r = \frac{a_2}{a_1}\), the later term over the earlier one.

## Check yourself
Q: What is the common difference of 10, 7, 4, 1, …?
A: \(-3\)
Q: Find the 10th term of 5, 10, 20, …
A: \(5 \cdot 2^9 = 2560\)
Q: Find \(1 + 2 + 3 + \dots + 100\).
A: \(\frac{100}{2}(1 + 100) = 5050\)
Q: Does \(1 + 2 + 4 + 8 + \dots\) have a finite sum?
A: No, because \(r = 2\).
Q: Write \(0.333\ldots\) as a fraction using a geometric series.
A: \(\frac{0.3}{1 - 0.1} = \frac{1}{3}\)

@@ complex-numbers
## Overview
Real numbers can't square to a negative. **Complex numbers** fix that with the **imaginary unit** \(i\), where \(i^2 = -1\). Every complex number is \(a + bi\): a real part \(a\) and an imaginary part \(b\). With them, every quadratic equation has solutions.

## Key ideas
- \(i = \sqrt{-1}\), so \(i^2 = -1\). Powers of \(i\) repeat every 4: \(i, -1, -i, 1\).
- \(\sqrt{-16} = 4i\).
- **Add and subtract:** combine real parts and imaginary parts separately.
- **Multiply:** like FOIL, then replace \(i^2\) with \(-1\): \((a + bi)(c + di) = (ac - bd) + (ad + bc)i\).
- **Conjugate:** the conjugate of \(a + bi\) is \(a - bi\). Their product is real: \(a^2 + b^2\).
- **Divide:** multiply the top and bottom by the conjugate of the bottom.
- **Modulus:** \(|a + bi| = \sqrt{a^2 + b^2}\), the distance from 0 in the complex plane.
- **Euler's formula:** \(e^{i\theta} = \cos\theta + i\sin\theta\).

## Worked examples
Example: Multiply \((2 + 3i)(4 - i)\).
Solution: \(8 - 2i + 12i - 3i^2 = 8 + 10i - 3(-1)\).
Answer: \(11 + 10i\)
Example: Divide \(\frac{5 + i}{1 - i}\).
Solution: Multiply by \(\frac{1 + i}{1 + i}\): top \((5 + i)(1 + i) = 5 + 6i + i^2 = 4 + 6i\); bottom \(1 + 1 = 2\).
Answer: \(2 + 3i\)
Example: Solve \(x^2 + 4x + 13 = 0\).
Solution: \(x = \frac{-4 \pm \sqrt{16 - 52}}{2} = \frac{-4 \pm \sqrt{-36}}{2} = \frac{-4 \pm 6i}{2}\).
Answer: \(x = -2 \pm 3i\)

## Common mistakes
- **Leaving \(i^2\) in the answer.** Always replace \(i^2\) with \(-1\).
- **\(\sqrt{-4} \cdot \sqrt{-9} = \sqrt{36} = 6\).** Wrong: it's \(2i \cdot 3i = 6i^2 = -6\). Pull out \(i\) first.
- **Changing both signs for the conjugate.** The conjugate of \(3 + 4i\) is \(3 - 4i\), not \(-3 - 4i\).
- **Forgetting to divide every term.** \(\frac{4 + 6i}{2} = 2 + 3i\).

## Check yourself
Q: Simplify \((3 + 2i) + (1 - 5i)\).
A: \(4 - 3i\)
Q: What is \(i^{23}\)?
A: \(-i\) (23 leaves remainder 3 when divided by 4)
Q: What is \(|3 - 4i|\)?
A: 5
Q: What is \((1 + i)(1 - i)\)?
A: 2
Q: Write \(\sqrt{-25}\) using \(i\).
A: \(5i\)
`);
  /* ---------- Calculus, statistics, linear algebra ---------- */
  add(String.raw`
@@ limits
## Overview
A **limit** asks what value \(f(x)\) heads toward as \(x\) gets close to some number, even if the function isn't defined there. Limits are the foundation of calculus: derivatives and integrals are both defined with them. **Continuity** means a graph has no breaks, holes or jumps.

## Key ideas
- \(\lim_{x\to a} f(x) = L\) means \(f(x)\) gets as close to \(L\) as you like when \(x\) is close enough to \(a\).
- **Direct substitution:** if \(f\) is continuous at \(a\), just plug in: \(\lim_{x\to a} f(x) = f(a)\).
- **\(\frac{0}{0}\) means "do more work":** factor and cancel, rationalize, or use L'Hôpital's rule.
- **One-sided limits:** the limit exists only if the left and right limits are equal.
- **Continuity at \(a\):** \(f(a)\) exists, the limit exists, and they are equal.
- **Limits at infinity** of rational functions: compare degrees. Top smaller → 0; equal → ratio of leading coefficients; top bigger → \(\pm\infty\).
- **Special limit:** \(\lim_{x\to 0}\frac{\sin x}{x} = 1\).
- **L'Hôpital's rule:** for \(\frac{0}{0}\) or \(\frac{\infty}{\infty}\), \(\lim\frac{f}{g} = \lim\frac{f'}{g'}\).
- **Squeeze theorem** and the **intermediate value theorem** (a continuous function hits every value between \(f(a)\) and \(f(b)\)).

## Worked examples
Example: Find \(\lim_{x\to 2}\frac{x^2 - 4}{x - 2}\).
Solution: Substituting gives \(\frac{0}{0}\). Factor: \(\frac{(x - 2)(x + 2)}{x - 2} = x + 2\). Now substitute: \(2 + 2\).
Answer: 4
Example: Find \(\lim_{x\to\infty}\frac{3x^2 + 1}{5x^2 - x}\).
Solution: The degrees are equal (2 and 2), so the limit is the ratio of the leading coefficients.
Answer: \(\frac{3}{5}\)
Example: Find \(\lim_{x\to 0}\frac{e^x - 1}{x}\).
Solution: It's \(\frac{0}{0}\), so use L'Hôpital's rule: \(\lim_{x\to 0}\frac{e^x}{1} = e^0\).
Answer: 1

## Common mistakes
- **Saying \(\frac{0}{0}\) means the limit doesn't exist.** It means you need another method.
- **Using L'Hôpital's rule on limits that aren't \(\frac{0}{0}\) or \(\frac{\infty}{\infty}\).** Check first.
- **Using the quotient rule in L'Hôpital.** Differentiate the top and bottom **separately**.
- **Thinking \(f(a)\) must exist for the limit to exist.** A hole at \(a\) can still have a limit.
- **Ignoring one-sided limits** at jumps and vertical asymptotes.

## Check yourself
Q: Find \(\lim_{x\to 3}(2x + 1)\).
A: 7
Q: Find \(\lim_{x\to 0}\frac{\sin 3x}{x}\).
A: 3
Q: Find \(\lim_{x\to\infty}\frac{4x + 1}{x^2}\).
A: 0 (the top has the smaller degree)
Q: The left limit at 1 is 2 and the right limit is 5. Does the limit exist?
A: No; the one-sided limits differ.
Q: What three things does continuity at \(a\) need?
A: \(f(a)\) defined, the limit exists, and the limit equals \(f(a)\).

@@ integrals
## Overview
**Integration** is the reverse of differentiation. An **antiderivative** of \(f\) is a function whose derivative is \(f\). A **definite integral** \(\int_a^b f(x)\,dx\) adds up a quantity over an interval; on a graph it's the signed area under the curve. The **Fundamental Theorem of Calculus** connects the two.

## Key ideas
- **Indefinite integral:** \(\int f(x)\,dx = F(x) + C\), where \(F' = f\). Don't forget the **\(+C\)**.
- **Power rule:** \(\int x^n\,dx = \frac{x^{n+1}}{n+1} + C\) (for \(n \neq -1\)). Add 1 to the power, then divide by the new power.
- **Basic integrals:** \(\int\frac{1}{x}\,dx = \ln|x| + C\), \(\int e^x\,dx = e^x + C\), \(\int\cos x\,dx = \sin x + C\), \(\int\sin x\,dx = -\cos x + C\).
- **Fundamental Theorem:** \(\int_a^b f(x)\,dx = F(b) - F(a)\).
- **Signed area:** area below the x-axis counts as negative.
- **u-substitution** (reverse chain rule): let \(u = g(x)\), \(du = g'(x)\,dx\).
- **Integration by parts:** \(\int u\,dv = uv - \int v\,du\).

## Worked examples
Example: Find \(\int(3x^2 + 4x)\,dx\).
Solution: Power rule on each term: \(3 \cdot \frac{x^3}{3} + 4 \cdot \frac{x^2}{2}\).
Answer: \(x^3 + 2x^2 + C\)
Example: Find the area under \(y = 4 - x^2\) from \(x = -2\) to \(x = 2\).
Solution: \(F(x) = 4x - \frac{x^3}{3}\). \(F(2) - F(-2) = \left(8 - \frac{8}{3}\right) - \left(-8 + \frac{8}{3}\right) = 16 - \frac{16}{3}\).
Answer: \(\frac{32}{3}\)
Example: Find \(\int 2x\cos(x^2)\,dx\).
Solution: Let \(u = x^2\), so \(du = 2x\,dx\). The integral becomes \(\int\cos u\,du = \sin u + C\).
Answer: \(\sin(x^2) + C\)

## Common mistakes
- **Forgetting \(+C\)** on indefinite integrals.
- **Using the power rule on \(x^{-1}\).** \(\int\frac{1}{x}\,dx = \ln|x| + C\).
- **Getting the sign of \(\int\sin x\,dx\) wrong.** It's \(-\cos x + C\).
- **Not changing the limits** after a u-substitution in a definite integral (or switching back to \(x\)).
- **Computing \(F(a) - F(b)\).** It's top minus bottom: \(F(b) - F(a)\).

## Check yourself
Q: Find \(\int x^5\,dx\).
A: \(\frac{x^6}{6} + C\)
Q: Evaluate \(\int_0^2 x^2\,dx\).
A: \(\frac{8}{3}\)
Q: Find \(\int\frac{3}{x}\,dx\).
A: \(3\ln|x| + C\)
Q: Find \(\int x e^x\,dx\).
A: \(xe^x - e^x + C\) (by parts)
Q: If \(\int_0^5 f(x)\,dx = 8\), what is \(\int_5^0 f(x)\,dx\)?
A: \(-8\)

@@ series
## Overview
An **infinite series** adds infinitely many terms. Some **converge** (the sum settles on a number) and some **diverge**. Calc II is about telling which is which, and about **power series** such as Taylor series, which write functions like \(e^x\) and \(\sin x\) as never-ending polynomials.

## Key ideas
- **nth-term test:** if \(a_n \not\to 0\), the series diverges. (If \(a_n \to 0\), you still need another test.)
- **Geometric series:** \(\sum ar^n\) converges to \(\frac{a}{1 - r}\) when \(|r| < 1\).
- **p-series:** \(\sum\frac{1}{n^p}\) converges if \(p > 1\), diverges if \(p \le 1\). The **harmonic series** \(\sum\frac{1}{n}\) diverges.
- **Ratio test:** \(L = \lim\left|\frac{a_{n+1}}{a_n}\right|\). \(L < 1\) converges absolutely, \(L > 1\) diverges, \(L = 1\) is inconclusive.
- **Alternating series test:** if the terms alternate in sign, shrink, and go to 0, the series converges.
- **Comparison tests:** compare to a series you already know.
- **Taylor series:** \(f(x) = \sum\frac{f^{(n)}(a)}{n!}(x - a)^n\). At \(a = 0\) it's a **Maclaurin series**: \(e^x = \sum\frac{x^n}{n!}\), \(\sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \dots\), \(\cos x = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \dots\)
- **Radius of convergence:** a power series converges for \(|x - a| < R\). Find \(R\) with the ratio test, then check the endpoints separately.

## Worked examples
Example: Does \(\sum\frac{n}{n + 1}\) converge?
Solution: \(\lim\frac{n}{n + 1} = 1 \neq 0\). By the nth-term test it diverges.
Answer: Diverges
Example: Does \(\sum\frac{2^n}{n!}\) converge?
Solution: Ratio test: \(\frac{2^{n+1}/(n+1)!}{2^n/n!} = \frac{2}{n + 1} \to 0 < 1\).
Answer: Converges (absolutely)
Example: Find the radius of convergence of \(\sum\frac{x^n}{3^n}\).
Solution: Ratio test: \(\left|\frac{x^{n+1}/3^{n+1}}{x^n/3^n}\right| = \frac{|x|}{3} < 1\) when \(|x| < 3\).
Answer: \(R = 3\)

## Common mistakes
- **Thinking \(a_n \to 0\) proves convergence.** The harmonic series has \(a_n \to 0\) and diverges.
- **Reading the ratio test's \(L = 1\) as "converges".** It means the test doesn't decide.
- **Forgetting to test the endpoints** of an interval of convergence.
- **Dropping the factorials** in Taylor series coefficients.

## Check yourself
Q: Does \(\sum\frac{1}{n^2}\) converge?
A: Yes; it's a p-series with \(p = 2 > 1\).
Q: Does \(\sum\frac{1}{\sqrt{n}}\) converge?
A: No; \(p = \frac{1}{2} \le 1\).
Q: Does \(\sum\frac{(-1)^n}{n}\) converge?
A: Yes, by the alternating series test (but not absolutely).
Q: Write the first three nonzero terms of the Maclaurin series for \(\cos x\).
A: \(1 - \frac{x^2}{2} + \frac{x^4}{24}\)
Q: What is \(\sum_{n=0}^{\infty}\left(\frac{1}{3}\right)^n\)?
A: \(\frac{1}{1 - \frac{1}{3}} = \frac{3}{2}\)

@@ multivariable
## Overview
Multivariable calculus extends derivatives and integrals to functions of several variables, like \(f(x, y)\) giving the height of a surface. **Partial derivatives** and the **gradient** describe how it changes; **double and triple integrals** add up quantities over regions. Vectors tie it all together.

## Key ideas
- **Partial derivative** \(\frac{\partial f}{\partial x}\): differentiate with respect to \(x\), treating every other variable as a constant.
- **Gradient** \(\nabla f = \left(f_x, f_y, f_z\right)\) points in the direction of steepest increase; its length is that steepest rate.
- **Directional derivative:** \(D_{\mathbf{u}}f = \nabla f \cdot \mathbf{u}\) for a **unit** vector \(\mathbf{u}\).
- **Dot product:** \(\mathbf{u}\cdot\mathbf{v} = u_1v_1 + u_2v_2 + u_3v_3 = |\mathbf{u}||\mathbf{v}|\cos\theta\). Zero means perpendicular.
- **Cross product** \(\mathbf{u}\times\mathbf{v}\): perpendicular to both, with length \(|\mathbf{u}||\mathbf{v}|\sin\theta\) (the area of their parallelogram).
- **Critical points** are where \(\nabla f = \mathbf{0}\); classify them with the second derivative test (\(D = f_{xx}f_{yy} - f_{xy}^2\)).
- **Double integral** \(\iint_R f\,dA\): volume under a surface. Integrate one variable at a time (iterated integrals).
- **Big theorems:** Green's theorem, Stokes' theorem and the divergence theorem relate an integral over a boundary to one over the region inside.

## Worked examples
Example: For \(f(x, y) = x^2y + 3y^2\), find \(f_x\), \(f_y\) and \(\nabla f(1, 2)\).
Solution: \(f_x = 2xy\) (\(y\) is a constant). \(f_y = x^2 + 6y\). At \((1, 2)\): \(f_x = 4\), \(f_y = 1 + 12 = 13\).
Answer: \(\nabla f(1, 2) = (4, 13)\)
Example: Find \((1, 2, 3)\cdot(4, -5, 6)\).
Solution: \(1 \cdot 4 + 2 \cdot (-5) + 3 \cdot 6 = 4 - 10 + 18\).
Answer: 12
Example: Evaluate \(\int_0^1\int_0^2 xy\,dy\,dx\).
Solution: Inner: \(\int_0^2 xy\,dy = x\left[\frac{y^2}{2}\right]_0^2 = 2x\). Outer: \(\int_0^1 2x\,dx = 1\).
Answer: 1

## Common mistakes
- **Not treating the other variables as constants** in a partial derivative.
- **Using a vector that isn't a unit vector** for a directional derivative. Divide by its length first.
- **Thinking the cross product is a number.** It's a vector; the dot product is a number.
- **Mixing up the limits** of an iterated integral. The inner limits go with the inner variable.

## Check yourself
Q: Find \(\frac{\partial}{\partial y}(x^3 + xy^2)\).
A: \(2xy\)
Q: What does a dot product of 0 tell you?
A: The vectors are perpendicular.
Q: What is \((1, 0, 0)\times(0, 1, 0)\)?
A: \((0, 0, 1)\)
Q: In which direction does \(f\) increase fastest?
A: The direction of the gradient \(\nabla f\).
Q: Find the directional derivative of \(f\) at \((1, 2)\) toward \(\mathbf{u} = \left(\frac{3}{5}, \frac{4}{5}\right)\) if \(\nabla f = (4, 13)\).
A: \(4(0.6) + 13(0.8) = 12.8\)

@@ statistics
## Overview
Statistics describes data; probability measures how likely things are. You'll summarize data with the **mean**, **median**, **mode** and measures of **spread**, then find probabilities, count outcomes and work out **expected value**.

## Key ideas
- **Mean:** add the values and divide by how many. **Median:** the middle value in order (average the two middle values if there's an even count). **Mode:** the most common value.
- **Range:** max − min. **Standard deviation:** typical distance from the mean (bigger means more spread out).
- **Outliers** pull the mean but barely move the median, so use the median for skewed data.
- **z-score:** \(z = \frac{x - \mu}{\sigma}\), how many standard deviations a value is from the mean.
- **Probability:** \(P(E) = \frac{\text{favorable}}{\text{total}}\), always between 0 and 1.
- **Complement:** \(P(\text{not } A) = 1 - P(A)\).
- **And (independent events):** \(P(A \text{ and } B) = P(A)P(B)\). **Or:** \(P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)\).
- **Counting:** permutations (order matters) \(_nP_r = \frac{n!}{(n - r)!}\); combinations (order doesn't) \(_nC_r = \frac{n!}{r!(n - r)!}\).
- **Expected value:** \(E[X] = \sum x\,P(x)\), the long-run average.

## Worked examples
Example: Find the mean, median, mode and range of 2, 4, 4, 5, 7, 8.
Solution: Mean: \(30 \div 6 = 5\). Median: average of 4 and 5. Mode: 4 appears twice. Range: \(8 - 2\).
Answer: mean 5, median 4.5, mode 4, range 6
Example: Draw one card from a standard deck. Find P(red or king).
Solution: \(P(\text{red}) = \frac{26}{52}\), \(P(\text{king}) = \frac{4}{52}\), \(P(\text{red king}) = \frac{2}{52}\). \(\frac{26 + 4 - 2}{52} = \frac{28}{52}\).
Answer: \(\frac{7}{13}\)
Example: Find the expected value of one roll of a fair die.
Solution: \(\frac{1 + 2 + 3 + 4 + 5 + 6}{6} = \frac{21}{6}\).
Answer: 3.5

## Common mistakes
- **Finding the median without sorting** the data first.
- **Double-counting in "or" problems.** Subtract the overlap.
- **Multiplying probabilities for events that aren't independent.** Drawing without replacement changes the second probability.
- **Using permutations when order doesn't matter** (choosing a team is a combination).

## Check yourself
Q: What is the median of 3, 9, 1, 7, 5?
A: 5 (in order: 1, 3, 5, 7, 9)
Q: P(rain) = 0.3. What is P(no rain)?
A: 0.7
Q: What is the probability of two heads in two coin flips?
A: \(\frac{1}{4}\)
Q: How many ways can you choose 2 people from 5?
A: \(_5C_2 = 10\)
Q: A score of 85 with mean 70 and standard deviation 10 has what z-score?
A: 1.5

@@ inferential-statistics
## Overview
Inferential statistics uses a **sample** to draw conclusions about a whole **population**. The two main tools are **confidence intervals** (estimating a value with a margin of error) and **hypothesis tests** (deciding whether data is strong evidence against a claim). Both rest on the normal distribution and sampling distributions.

## Key ideas
- **Normal distribution:** bell-shaped, set by its mean \(\mu\) and standard deviation \(\sigma\).
- **Empirical rule:** about 68% of values fall within \(1\sigma\) of the mean, 95% within \(2\sigma\), 99.7% within \(3\sigma\).
- **Parameter** (population: \(\mu\), \(p\)) vs. **statistic** (sample: \(\bar{x}\), \(\hat{p}\)).
- **Sampling distribution:** the distribution of a statistic over all samples of size \(n\). **Standard error:** \(\frac{\sigma}{\sqrt{n}}\).
- **Central limit theorem:** for large \(n\) (often \(n \ge 30\)), the sample mean is approximately normal, whatever the population looks like.
- **Confidence interval:** estimate ± margin of error, e.g. \(\bar{x} \pm z^*\frac{\sigma}{\sqrt{n}}\), with \(z^* \approx 1.96\) for 95%.
- **Hypothesis test:** \(H_0\) is "no effect". The **p-value** is the chance of results this extreme if \(H_0\) were true. If \(p < \alpha\) (often 0.05), reject \(H_0\).
- **Errors:** Type I = rejecting a true \(H_0\); Type II = failing to reject a false \(H_0\).
- **Only experiments** (with random assignment) show cause and effect; observational studies show association. Correlation \(r\) runs from \(-1\) to 1.

## Worked examples
Example: IQ scores are normal with mean 100 and standard deviation 15. What range holds the middle 95%?
Solution: 95% is within 2 standard deviations: \(100 \pm 2(15)\).
Answer: 70 to 130
Example: A sample of 25 has \(\bar{x} = 50\) and \(\sigma = 10\). Find a 95% confidence interval for \(\mu\).
Solution: Standard error: \(\frac{10}{\sqrt{25}} = 2\). Margin: \(1.96 \times 2 = 3.92\).
Answer: \(50 \pm 3.92\), or about 46.08 to 53.92
Example: A test of \(H_0\) gives \(p = 0.03\) with \(\alpha = 0.05\). What do you conclude?
Solution: \(0.03 < 0.05\), so the result is statistically significant.
Answer: Reject \(H_0\); there is convincing evidence against it.

## Common mistakes
- **"95% chance \(\mu\) is in this interval."** The 95% describes the method: 95% of intervals built this way capture \(\mu\).
- **Saying "accept \(H_0\)".** You "fail to reject" it; a big p-value isn't proof that \(H_0\) is true.
- **Reading the p-value as the probability \(H_0\) is true.** It assumes \(H_0\) is true.
- **Claiming cause and effect from an observational study.**
- **Mixing up Type I and Type II errors.** Type I is a false alarm.

## Check yourself
Q: About what percent of a normal distribution is within 1 standard deviation of the mean?
A: About 68%
Q: Is \(\bar{x}\) a parameter or a statistic?
A: A statistic (it describes a sample).
Q: What happens to the standard error when \(n\) gets bigger?
A: It gets smaller, because it's \(\frac{\sigma}{\sqrt{n}}\).
Q: With \(\alpha = 0.05\) and \(p = 0.20\), what do you conclude?
A: Fail to reject \(H_0\); there isn't enough evidence.
Q: What is a Type II error?
A: Failing to reject \(H_0\) when it is actually false.

@@ linear-algebra
## Overview
Linear algebra studies **vectors** and **matrices**: grids of numbers that represent systems of equations and transformations like rotations and stretches. Key questions are whether a matrix can be undone (its **inverse**), what it does to space (its **determinant**), and which directions it only stretches (**eigenvectors**).

## Key ideas
- **Matrix multiplication:** entry \((i, j)\) of \(AB\) is row \(i\) of \(A\) dotted with column \(j\) of \(B\). Order matters: \(AB \neq BA\) in general.
- **Determinant of a 2×2:** \(\det\begin{pmatrix}a & b\\ c & d\end{pmatrix} = ad - bc\). It scales area; 0 means the matrix squashes space flat.
- **Inverse of a 2×2:** \(\frac{1}{ad - bc}\begin{pmatrix}d & -b\\ -c & a\end{pmatrix}\). A matrix is **invertible** exactly when its determinant isn't 0.
- **Systems:** \(A\mathbf{x} = \mathbf{b}\). Solve by row reduction, or \(\mathbf{x} = A^{-1}\mathbf{b}\) if \(A\) is invertible.
- **Linear independence:** no vector is a combination of the others. **Rank:** the number of independent rows or columns. **Rank–nullity:** rank + nullity = number of columns.
- **Eigenvalues and eigenvectors:** \(A\mathbf{v} = \lambda\mathbf{v}\). Find \(\lambda\) from the **characteristic equation** \(\det(A - \lambda I) = 0\).
- The **trace** (sum of the diagonal) equals the sum of the eigenvalues; the determinant equals their product.

## Worked examples
Example: Multiply \(\begin{pmatrix}1 & 2\\ 3 & 4\end{pmatrix}\begin{pmatrix}5 & 6\\ 7 & 8\end{pmatrix}\).
Solution: Row 1 · columns: \(5 + 14 = 19\), \(6 + 16 = 22\). Row 2 · columns: \(15 + 28 = 43\), \(18 + 32 = 50\).
Answer: \(\begin{pmatrix}19 & 22\\ 43 & 50\end{pmatrix}\)
Example: Find the determinant and inverse of \(\begin{pmatrix}2 & 3\\ 1 & 4\end{pmatrix}\).
Solution: \(\det = 8 - 3 = 5\). Swap the diagonal, negate the others, divide by 5.
Answer: \(\det = 5\), inverse \(\frac{1}{5}\begin{pmatrix}4 & -3\\ -1 & 2\end{pmatrix}\)
Example: Find the eigenvalues of \(\begin{pmatrix}4 & 1\\ 2 & 3\end{pmatrix}\).
Solution: \(\det\begin{pmatrix}4 - \lambda & 1\\ 2 & 3 - \lambda\end{pmatrix} = (4 - \lambda)(3 - \lambda) - 2 = \lambda^2 - 7\lambda + 10 = (\lambda - 2)(\lambda - 5)\).
Answer: \(\lambda = 2\) and \(\lambda = 5\) (check: they add to the trace 7 and multiply to the determinant 10)

## Common mistakes
- **Assuming \(AB = BA\).** Matrix multiplication is usually not commutative.
- **Multiplying matrices entry by entry.** Use rows times columns.
- **Mismatched sizes.** An \(m \times n\) matrix times an \(n \times p\) matrix gives \(m \times p\); the inner sizes must match.
- **Inverting a matrix with determinant 0.** It has no inverse.
- **Forgetting to subtract \(\lambda\) only on the diagonal** in \(A - \lambda I\).

## Check yourself
Q: What is the determinant of \(\begin{pmatrix}3 & 1\\ 6 & 2\end{pmatrix}\)?
A: 0, so it has no inverse.
Q: What size is a 2×3 matrix times a 3×4 matrix?
A: 2×4
Q: What are the eigenvalues of \(\begin{pmatrix}2 & 0\\ 0 & 7\end{pmatrix}\)?
A: 2 and 7 (the diagonal entries of a diagonal matrix)
Q: A 3×5 matrix has rank 3. What is its nullity?
A: \(5 - 3 = 2\)
Q: What does \(A\mathbf{v} = \lambda\mathbf{v}\) say about \(\mathbf{v}\)?
A: \(A\) only stretches \(\mathbf{v}\) (by \(\lambda\)); it doesn't change its direction line.
`);
  /* ---------- Advanced & College ---------- */
  add(String.raw`
@@ differential-equations
## Overview
A **differential equation** links a function to its derivatives, like \(y' = ky\) for anything that grows at a rate proportional to its size. Solving one means finding the function. This guide covers first-order equations (separable, growth and decay), second-order linear equations with constant coefficients, and Euler's method for approximating solutions.

## Key ideas
- The **order** is the highest derivative in the equation.
- A **general solution** has constants \(C\); an **initial condition** like \(y(0) = 5\) picks one particular solution.
- **Growth/decay:** \(y' = ky\) has solution \(y = Ce^{kt}\).
- **Separable:** \(\frac{dy}{dx} = g(x)h(y)\). Move the \(y\)'s to one side and integrate: \(\int\frac{dy}{h(y)} = \int g(x)\,dx\).
- **Second-order linear** \(ay'' + by' + cy = 0\): solve the **characteristic equation** \(ar^2 + br + c = 0\).
  - Distinct real roots: \(y = C_1e^{r_1t} + C_2e^{r_2t}\).
  - Repeated root: \(y = (C_1 + C_2t)e^{rt}\).
  - Complex roots \(\alpha \pm \beta i\): \(y = e^{\alpha t}(C_1\cos\beta t + C_2\sin\beta t)\).
- **Euler's method:** step along the slope: \(y_{n+1} = y_n + h\,f(x_n, y_n)\).
- **Slope fields** sketch solutions by drawing the slope \(y'\) at many points.

## Worked examples
Example: Solve \(y' = 3y\) with \(y(0) = 5\).
Solution: General solution \(y = Ce^{3t}\). At \(t = 0\): \(5 = C\).
Answer: \(y = 5e^{3t}\)
Example: Solve \(\frac{dy}{dx} = xy\).
Solution: Separate: \(\frac{dy}{y} = x\,dx\). Integrate: \(\ln|y| = \frac{x^2}{2} + C\). Exponentiate.
Answer: \(y = Ce^{x^2/2}\)
Example: Solve \(y'' - 5y' + 6y = 0\).
Solution: Characteristic equation \(r^2 - 5r + 6 = 0\), so \((r - 2)(r - 3) = 0\) and \(r = 2, 3\).
Answer: \(y = C_1e^{2t} + C_2e^{3t}\)

## Common mistakes
- **Forgetting the constant** when integrating, or adding it on only one side and then losing it.
- **Applying the initial condition before integrating.** Find the general solution first.
- **Using \(y = (C_1 + C_2)e^{rt}\) for a repeated root.** The second solution needs a factor of \(t\).
- **Mixing up \(\alpha\) and \(\beta\)** with complex roots: the real part goes in the exponential, the imaginary part in the sine and cosine.

## Check yourself
Q: What is the order of \(y''' + y = 0\)?
A: Third order.
Q: Solve \(y' = -2y\).
A: \(y = Ce^{-2t}\)
Q: Solve \(y'' + 4y = 0\).
A: \(r = \pm 2i\), so \(y = C_1\cos 2t + C_2\sin 2t\)
Q: Solve \(y'' - 6y' + 9y = 0\).
A: \(r = 3\) (repeated), so \(y = (C_1 + C_2t)e^{3t}\)
Q: Use one step of Euler's method (\(h = 0.1\)) on \(y' = x + y\), \(y(0) = 1\).
A: \(y_1 = 1 + 0.1(0 + 1) = 1.1\)

@@ discrete-math
## Overview
Discrete math deals with countable things: arrangements, logical statements, sets and proofs. It's the math behind computer science, probability and puzzles. The core skills are **counting** carefully, reasoning with **logic**, and **proof by induction**.

## Key ideas
- **Factorial:** \(n! = n(n - 1)\cdots 1\), with \(0! = 1\). There are \(n!\) ways to order \(n\) things.
- **Permutations** (order matters): \(P(n, r) = \frac{n!}{(n - r)!}\). **Combinations** (order doesn't): \(\binom{n}{r} = \frac{n!}{r!(n - r)!}\).
- **Multiplication principle:** if one choice has \(m\) options and the next has \(n\), together there are \(mn\).
- **Implication** \(p \to q\) is false only when \(p\) is true and \(q\) is false.
- The **contrapositive** \(\neg q \to \neg p\) is equivalent to \(p \to q\). The **converse** \(q \to p\) is not.
- **Sets:** union \(\cup\), intersection \(\cap\), complement. A set with \(n\) elements has \(2^n\) subsets (its **power set**).
- **Pigeonhole principle:** more than \(n\) objects in \(n\) boxes means some box holds at least two.
- **Induction:** prove the base case, then show that if it's true for \(k\), it's true for \(k + 1\).

## Worked examples
Example: How many ways can first, second and third prize go to 10 people?
Solution: Order matters: \(P(10, 3) = 10 \cdot 9 \cdot 8\).
Answer: 720
Example: How many 3-person committees can be chosen from 10 people?
Solution: Order doesn't matter: \(\binom{10}{3} = \frac{720}{3!} = \frac{720}{6}\).
Answer: 120
Example: Prove \(1 + 2 + \dots + n = \frac{n(n + 1)}{2}\) by induction.
Solution: Base case \(n = 1\): \(1 = \frac{1 \cdot 2}{2}\). ✓ Inductive step: assume it holds for \(k\). Then \(1 + \dots + k + (k + 1) = \frac{k(k + 1)}{2} + (k + 1) = \frac{(k + 1)(k + 2)}{2}\), which is the formula for \(k + 1\).
Answer: True for all \(n \ge 1\)

## Common mistakes
- **Using permutations for a committee** (order doesn't matter, so use combinations).
- **Thinking the converse is equivalent.** "If it's a square, it's a rectangle" is true; its converse is false.
- **Skipping the base case** in induction.
- **Assuming the statement for \(k + 1\)** in the inductive step, instead of proving it.

## Check yourself
Q: How many ways can 5 books be arranged on a shelf?
A: \(5! = 120\)
Q: How many subsets does \(\{a, b, c\}\) have?
A: \(2^3 = 8\)
Q: What is the contrapositive of "If it rains, the ground is wet"?
A: "If the ground is not wet, it didn't rain."
Q: When is \(p \to q\) false?
A: Only when \(p\) is true and \(q\) is false.
Q: Why must two of any 13 people share a birth month?
A: Pigeonhole principle: 13 people, 12 months.

@@ number-theory
## Overview
Number theory studies whole numbers: **primes**, **divisibility**, and remainders. Primes are the building blocks of every whole number, and **modular arithmetic** (clock arithmetic) is the math behind check digits and internet encryption.

## Key ideas
- A **prime** has exactly two positive divisors: 1 and itself. 2 is the only even prime; 1 is not prime.
- **Fundamental theorem of arithmetic:** every integer above 1 factors into primes in exactly one way.
- **GCD** (greatest common divisor) and **LCM** (least common multiple). From prime factorizations: GCD takes the lowest powers, LCM the highest. And \(\gcd(a, b)\cdot\text{lcm}(a, b) = ab\).
- **Euclidean algorithm:** \(\gcd(a, b) = \gcd(b, a \bmod b)\); repeat until the remainder is 0.
- **Modular arithmetic:** \(a \equiv b \pmod n\) means \(n\) divides \(a - b\) (same remainder). You can add and multiply mod \(n\).
- **Fermat's little theorem:** if \(p\) is prime and doesn't divide \(a\), then \(a^{p-1} \equiv 1 \pmod p\).
- **Euler's totient** \(\varphi(n)\) counts the numbers from 1 to \(n\) sharing no factor with \(n\). For a prime, \(\varphi(p) = p - 1\).

## Worked examples
Example: Find \(\gcd(48, 180)\) with the Euclidean algorithm, then the LCM.
Solution: \(180 = 3 \cdot 48 + 36\); \(48 = 1 \cdot 36 + 12\); \(36 = 3 \cdot 12 + 0\). So the GCD is 12. LCM \(= \frac{48 \cdot 180}{12}\).
Answer: GCD 12, LCM 720
Example: Find \(3^{100} \bmod 7\).
Solution: By Fermat, \(3^6 \equiv 1 \pmod 7\). \(100 = 6 \cdot 16 + 4\), so \(3^{100} \equiv 3^4 = 81\), and \(81 = 7 \cdot 11 + 4\).
Answer: 4
Example: Find \(\varphi(12)\).
Solution: Numbers from 1 to 12 sharing no factor with 12: 1, 5, 7, 11.
Answer: 4

## Common mistakes
- **Calling 1 a prime.** It has only one divisor.
- **Mixing up GCD and LCM.** The GCD is at most the smaller number; the LCM is at least the larger.
- **Reducing an exponent mod \(p\) instead of mod \(p - 1\)** with Fermat's theorem.
- **Negative remainders.** \(-3 \bmod 5\) is 2, not \(-3\).

## Check yourself
Q: Is 91 prime?
A: No: \(91 = 7 \times 13\).
Q: Write 360 as a product of primes.
A: \(2^3 \cdot 3^2 \cdot 5\)
Q: What is \(17 \bmod 5\)?
A: 2
Q: What is \(2^{10} \bmod 11\)?
A: 1 (Fermat's little theorem)
Q: If \(\gcd(a, b) = 6\) and \(ab = 432\), what is \(\text{lcm}(a, b)\)?
A: \(432 \div 6 = 72\)

@@ abstract-algebra
## Overview
Abstract algebra studies **structure**: what's true about any system with an operation that follows a few rules. A **group** captures symmetry (rotations of a square, adding integers, shuffling cards). Rings and fields add a second operation, like the integers and the rational numbers.

## Key ideas
- A **group** is a set with an operation that is **associative**, has an **identity** \(e\), and gives every element an **inverse**. It must also be **closed**: combining two elements stays in the set.
- **Abelian** groups are commutative (\(ab = ba\)).
- The **order of a group** is its number of elements. The **order of an element** \(g\) is the smallest \(n\) with \(g^n = e\).
- **Lagrange's theorem:** the order of a subgroup divides the order of the group.
- A **cyclic group** is generated by one element, like \(\mathbb{Z}_n\) generated by 1.
- A **homomorphism** keeps the operation: \(\varphi(ab) = \varphi(a)\varphi(b)\). An **isomorphism** is a homomorphism that's one-to-one and onto (the groups are the same in structure).
- A **normal subgroup** satisfies \(gNg^{-1} = N\); you can form a quotient group from it. Kernels of homomorphisms are normal.
- A **field** is a commutative ring where every nonzero element has a multiplicative inverse (\(\mathbb{Q}\), \(\mathbb{R}\), \(\mathbb{Z}_p\) for prime \(p\)).

## Worked examples
Example: In \(\mathbb{Z}_6\) (addition mod 6), what is the order of 2?
Solution: \(2, 2 + 2 = 4, 4 + 2 = 6 \equiv 0\). It takes 3 steps to reach the identity 0.
Answer: 3
Example: Is the set of integers under multiplication a group?
Solution: It's closed and associative with identity 1, but 2 has no integer inverse (\(\frac{1}{2}\) isn't an integer).
Answer: No; most elements have no inverse.
Example: A group has order 12. What orders can its subgroups have?
Solution: By Lagrange's theorem, a subgroup's order must divide 12.
Answer: 1, 2, 3, 4, 6 or 12 (Lagrange allows only these; it doesn't promise each one exists)

## Common mistakes
- **Forgetting closure** when checking the group rules.
- **Assuming every group is abelian.** Symmetries of a triangle form a non-abelian group.
- **Reading Lagrange backwards.** A divisor of the order need not be the order of a subgroup.
- **Calling \(\mathbb{Z}_6\) a field.** 2 has no multiplicative inverse mod 6.

## Check yourself
Q: What is the identity of the integers under addition?
A: 0
Q: Is \(\mathbb{Z}_7\) a field?
A: Yes, because 7 is prime.
Q: Can a group of order 10 have a subgroup of order 4?
A: No; 4 doesn't divide 10.
Q: What does it mean for two groups to be isomorphic?
A: There's a one-to-one, onto map between them that preserves the operation.
Q: What is the order of an element \(g\) with \(g^5 = e\) and \(g \neq e\) (\(5\) prime)?
A: 5

@@ real-analysis
## Overview
Real analysis rebuilds calculus with complete rigor. Instead of "gets close to", it uses precise \(\varepsilon\)–\(N\) and \(\varepsilon\)–\(\delta\) definitions, and it proves the facts calculus takes for granted. It all rests on the **completeness** of the real numbers.

## Key ideas
- **Supremum** (least upper bound) and **infimum** (greatest lower bound). They need not be in the set.
- **Completeness axiom:** every nonempty set of reals that's bounded above has a supremum. (The rationals fail this.)
- **Convergence:** \(a_n \to L\) if for every \(\varepsilon > 0\) there's an \(N\) with \(|a_n - L| < \varepsilon\) for all \(n > N\).
- **Monotone convergence theorem:** a bounded, monotone sequence converges.
- **Cauchy sequences:** terms get close to **each other**; in \(\mathbb{R}\), Cauchy ⇔ convergent.
- **Bolzano–Weierstrass:** every bounded sequence has a convergent subsequence.
- **Continuity** (\(\varepsilon\)–\(\delta\)) vs. **uniform continuity** (one \(\delta\) works everywhere).
- **Heine–Borel:** in \(\mathbb{R}^n\), compact ⇔ closed and bounded. Continuous functions on compact sets reach a max and min.

## Worked examples
Example: Find the supremum of \(\left\{1 - \frac{1}{n} : n \ge 1\right\}\). Is it in the set?
Solution: The values are \(0, \frac{1}{2}, \frac{2}{3}, \dots\), increasing toward 1. Every value is below 1, and nothing smaller than 1 is an upper bound.
Answer: \(\sup = 1\), which is not in the set
Example: Prove \(\frac{1}{n} \to 0\).
Solution: Let \(\varepsilon > 0\). Choose \(N > \frac{1}{\varepsilon}\). Then for \(n > N\), \(\left|\frac{1}{n} - 0\right| = \frac{1}{n} < \frac{1}{N} < \varepsilon\).
Answer: By the definition, \(\frac{1}{n} \to 0\).
Example: Is \((0, 1)\) compact?
Solution: It's bounded but not closed (it doesn't contain 0 or 1), so Heine–Borel says no.
Answer: No; but \([0, 1]\) is compact.

## Common mistakes
- **Choosing \(N\) before \(\varepsilon\).** \(N\) may depend on \(\varepsilon\), so pick it after.
- **Assuming the supremum is the maximum.** A max must be in the set; a sup need not be.
- **Confusing continuity with uniform continuity.** \(f(x) = x^2\) is continuous on \(\mathbb{R}\) but not uniformly.
- **Using Heine–Borel outside \(\mathbb{R}^n\)** (it can fail in other spaces).

## Check yourself
Q: Does every bounded sequence converge?
A: No; \((-1)^n\) is bounded and diverges. But it has a convergent subsequence.
Q: What is \(\inf\{x : x > 2\}\)?
A: 2
Q: Is \([0, \infty)\) compact?
A: No; it isn't bounded.
Q: Is \(f(x) = \frac{1}{x}\) uniformly continuous on \((0, 1)\)?
A: No; it gets arbitrarily steep near 0.
Q: What does the monotone convergence theorem say?
A: A bounded, monotone sequence converges.

@@ complex-analysis
## Overview
Complex analysis is calculus for functions of a complex variable \(z = x + iy\). Being complex-differentiable (**analytic**) is a very strong condition with surprising results: integrals around loops are often zero, and many real integrals can be computed with **residues**.

## Key ideas
- Write \(f(z) = u(x, y) + iv(x, y)\).
- **Analytic (holomorphic):** complex-differentiable at every point of a neighborhood.
- **Cauchy–Riemann equations:** \(u_x = v_y\) and \(u_y = -v_x\). They must hold for \(f\) to be analytic.
- **Cauchy's integral theorem:** if \(f\) is analytic inside and on a closed contour \(C\), then \(\oint_C f(z)\,dz = 0\).
- **Cauchy's integral formula:** \(f(a) = \frac{1}{2\pi i}\oint_C\frac{f(z)}{z - a}\,dz\) for \(a\) inside \(C\).
- **Residue theorem:** \(\oint_C f(z)\,dz = 2\pi i\sum\text{Res}(f, a_k)\), summing over the poles inside \(C\).
- **Residue at a simple pole:** \(\text{Res}(f, a) = \lim_{z\to a}(z - a)f(z)\).
- **Liouville's theorem:** a bounded entire function is constant. (This proves the fundamental theorem of algebra.)

## Worked examples
Example: Check that \(f(z) = z^2\) satisfies the Cauchy–Riemann equations.
Solution: \(z^2 = (x^2 - y^2) + i(2xy)\), so \(u = x^2 - y^2\), \(v = 2xy\). \(u_x = 2x = v_y\) ✓ and \(u_y = -2y = -v_x\) ✓.
Answer: Yes; \(z^2\) is analytic everywhere.
Example: Evaluate \(\oint_{|z| = 1}\frac{e^z}{z}\,dz\).
Solution: Cauchy's integral formula with \(f(z) = e^z\) and \(a = 0\): the integral is \(2\pi i \cdot f(0) = 2\pi i \cdot e^0\).
Answer: \(2\pi i\)
Example: Find the residue of \(\frac{1}{z(z - 2)}\) at \(z = 0\).
Solution: Simple pole: \(\lim_{z\to 0} z \cdot \frac{1}{z(z - 2)} = \frac{1}{0 - 2}\).
Answer: \(-\frac{1}{2}\)

## Common mistakes
- **Including poles outside the contour** in the residue sum. Only poles inside count.
- **Forgetting the \(2\pi i\).**
- **Assuming any smooth-looking function is analytic.** \(f(z) = \bar{z}\) fails Cauchy–Riemann (\(u_x = 1\), \(v_y = -1\)).
- **Using the simple-pole formula on a higher-order pole.** It needs a derivative formula.

## Check yourself
Q: Is \(f(z) = \bar{z}\) analytic?
A: No; it fails the Cauchy–Riemann equations.
Q: What is \(\oint_{|z| = 1} z^3\,dz\)?
A: 0 (\(z^3\) is analytic everywhere)
Q: What is \(\oint_{|z| = 2}\frac{1}{z - 1}\,dz\)?
A: \(2\pi i\) (residue 1 at \(z = 1\), inside the circle)
Q: What does Liouville's theorem say?
A: A bounded entire function is constant.
Q: Write the Cauchy–Riemann equations.
A: \(u_x = v_y\) and \(u_y = -v_x\)

@@ topology
## Overview
Topology studies the properties of shapes that survive stretching and bending (but not tearing or gluing). To a topologist a coffee mug and a donut are the same: each has one hole. Precisely, it studies **open sets**, and properties like **compactness** and **connectedness** that continuous maps preserve.

## Key ideas
- A **topology** on \(X\) is a collection of "open" sets that includes \(\varnothing\) and \(X\), and is closed under any unions and finite intersections.
- **Discrete topology:** every subset is open. **Indiscrete topology:** only \(\varnothing\) and \(X\) are open.
- **Continuous map:** the preimage of every open set is open.
- **Homeomorphism:** a continuous bijection with a continuous inverse. Homeomorphic spaces are "the same shape".
- **Compact:** every open cover has a finite subcover. In \(\mathbb{R}^n\): closed and bounded.
- **Connected:** can't be split into two disjoint nonempty open sets.
- **Hausdorff:** any two distinct points have disjoint open neighborhoods.
- **Euler characteristic:** \(\chi = V - E + F\). A sphere has \(\chi = 2\); a closed orientable surface with \(g\) holes has \(\chi = 2 - 2g\).

## Worked examples
Example: Find \(V - E + F\) for a cube.
Solution: A cube has 8 vertices, 12 edges and 6 faces: \(8 - 12 + 6\).
Answer: 2, the same as a sphere (a cube is homeomorphic to a sphere)
Example: Is a coffee mug homeomorphic to a donut (torus)?
Solution: Both have exactly one hole (the handle), and you can deform one into the other without tearing or gluing.
Answer: Yes; both have \(\chi = 0\) (\(g = 1\)).
Example: Is \(\mathbb{R}\setminus\{0\}\) connected?
Solution: It splits into \((-\infty, 0)\) and \((0, \infty)\), two disjoint nonempty open sets.
Answer: No

## Common mistakes
- **Thinking "open" means the same in every topology.** Open sets are whatever the topology says they are.
- **Treating a bijective continuous map as a homeomorphism.** The inverse must be continuous too.
- **Thinking any intersection of open sets is open.** Any union of open sets is open, but only finite intersections must be (the intervals \((-\frac{1}{n}, \frac{1}{n})\) intersect to the single point \(\{0\}\), which isn't open).
- **Counting a mug as having two holes.** The inside of the cup isn't a hole that goes through.

## Check yourself
Q: In the discrete topology, which sets are open?
A: Every subset.
Q: What is the Euler characteristic of a torus?
A: 0
Q: Is \([0, 1]\) compact?
A: Yes; it's closed and bounded.
Q: Is \((0, 1)\) homeomorphic to \(\mathbb{R}\)?
A: Yes (for example, by a stretched tangent function).
Q: What is \(\chi\) for a surface with 2 holes?
A: \(2 - 2(2) = -2\)
`);
})(typeof window !== 'undefined' ? window : globalThis);
