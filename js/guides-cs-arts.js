/* Study guides for the Computer Science and Arts & Music topics (format: see js/guides.js). */
(function (root) {
  'use strict';
  const add = root.MSG.Guides.add;

  /* ---------- Computer Science ---------- */
  add(String.raw`
@@ digital-literacy
## Overview
Computers have **hardware** (the parts you can touch) and **software** (the programs that tell them what to do). Knowing how they work helps you use them well, and knowing the risks online (tricks, weak passwords, things you can't take back) helps you stay safe.

## Key ideas
- **Hardware:** physical parts (screen, keyboard, chips). **Software:** programs and apps.
- **Input devices** send information in (keyboard, mouse, microphone, camera). **Output devices** send it out (monitor, printer, speakers).
- The **CPU** is the "brain" that runs instructions. **RAM** is short-term working memory, cleared when the power goes off. **Storage** (hard drive, SSD, cloud) keeps files.
- The **operating system** (Windows, macOS, Android, iOS) runs the computer and the other programs.
- A **web browser** visits websites; a **URL** is a web address. Look for **https** and a padlock on sites where you type private information.
- A **strong password** is long and unique, mixing words, numbers and symbols. Never reuse one, and turn on two-step login where you can.
- **Phishing:** fake messages that try to trick you into giving away passwords. Check the sender, and don't click surprise links.
- Your **digital footprint** is everything you leave online; posts can last forever. **Cyberbullying** should be reported to a trusted adult.

## Worked examples
Example: Sort these into input and output: keyboard, printer, microphone, speakers.
Solution: Input sends information into the computer; output brings it out to you.
Answer: Input: keyboard, microphone. Output: printer, speakers.
Example: An email says "Your account is locked! Click here and enter your password within 1 hour." What should you do?
Solution: Urgency plus a request for your password are signs of phishing. Real companies don't ask for passwords by email.
Answer: Don't click. Go to the real website yourself, and report or delete the email.
Example: Which password is stronger: "fluffy2010" or "Purple!Tiger7Canoe"?
Solution: The first is short and guessable (a pet name and a year). The second is long and mixes words, a symbol and a number.
Answer: "Purple!Tiger7Canoe"

## Common mistakes
- **Thinking RAM keeps your files.** It's cleared when the power goes off; storage keeps them.
- **Reusing one password everywhere.** One leak then unlocks every account.
- **Trusting a message because it uses a real company's logo.** Logos are easy to copy.
- **Thinking deleted posts are gone.** Screenshots and copies can remain.

## Check yourself
Q: Is a monitor an input or output device?
A: Output
Q: What is the CPU?
A: The central processing unit, the "brain" that runs instructions.
Q: What is phishing?
A: A fake message that tries to trick you into giving away passwords or information.
Q: Name an operating system.
A: Windows, macOS, Linux, Android or iOS.
Q: What is a digital footprint?
A: The trail of information you leave online.

@@ cs-basics
## Overview
Programming means writing **algorithms** (exact step-by-step instructions) in a language a computer runs. Every language shares the same building blocks: variables, conditionals, loops and functions. Under the hood, computers store everything in **binary**, and **Big-O** describes how fast an algorithm is as inputs grow.

## Key ideas
- **Variables** store values. **Data types:** integer, float (decimal), string (text), Boolean (true/false).
- **Conditionals** (if/else) run code only when something is true.
- **Loops** repeat code: a *for* loop runs a set number of times; a *while* loop runs while a condition is true.
- **Functions** are reusable blocks that take **parameters** and can **return** a value.
- **Arrays / lists** store ordered items, usually **indexed from 0**.
- **Recursion:** a function that calls itself on a smaller problem, with a **base case** that stops it.
- **Binary:** base 2. A **bit** is 0 or 1; a **byte** is 8 bits. Each place value doubles: 1, 2, 4, 8, 16…
- **Debugging** finds and fixes errors. A **compiler** translates code to machine code before it runs.
- **Big-O:** O(1) constant, O(log n) (like binary search), O(n) (one pass), O(n²) (nested loops).

## Worked examples
Example: Convert binary 1011 to decimal, and 13 to binary.
Solution: 1011 = 8 + 0 + 2 + 1 = 11. For 13: 13 = 8 + 4 + 1, so the 8s, 4s and 1s places are on: 1101.
Answer: 1011 = 11; 13 = 1101
Example: What does this print? sum = 0; for i from 1 to 4: sum = sum + i; print(sum)
Solution: Trace it: 0 + 1 = 1, + 2 = 3, + 3 = 6, + 4 = 10.
Answer: 10
Example: About how many steps does binary search need to find an item among 1,000,000 sorted items?
Solution: Each step halves the list: \(2^{20} \approx 1{,}000{,}000\), so about 20 halvings.
Answer: About 20 steps (vs. up to 1,000,000 for a linear search)

## Common mistakes
- **Starting to count list positions at 1.** The first item is at index 0.
- **Off-by-one loops** that run one time too many or too few. Trace the first and last pass.
- **Recursion without a base case,** which never stops.
- **Mixing up = and ==.** = assigns a value; == compares.

## Check yourself
Q: What is a Boolean?
A: A value that is either true or false.
Q: How many bits are in a byte?
A: 8
Q: What is binary 110 in decimal?
A: 6
Q: What is the Big-O of a loop inside a loop over n items?
A: O(n²)
Q: What must every recursive function have?
A: A base case that stops the recursion.

@@ cs-java
## Overview
AP Computer Science A uses **Java**, a strongly typed, object-oriented language. Most exam questions ask you to **trace code**: predict exactly what it prints. Master integer math, Strings, loops, arrays and ArrayLists, classes and inheritance.

## Key ideas
- **Primitive types:** int, double, boolean. **Integer division** drops the remainder (7 / 2 is 3); **%** gives the remainder (7 % 2 is 1).
- **Casting:** (int) 3.9 is 3 (truncates); (double) 7 / 2 is 3.5.
- **Strings:** length(), substring(a, b) (from index a up to but not including b), indexOf(str) (−1 if not found), equals(other). Strings are **immutable**.
- **Compare Strings with equals**, not == (== compares references).
- **Short-circuit:** in a && b, b is skipped if a is false; in a || b, b is skipped if a is true.
- **Classes** define fields and methods; a **constructor** initializes a new object. Use **private** fields with public methods (encapsulation).
- **Arrays** have fixed size (a.length); **ArrayLists** grow (add, get, set, remove, size()). **2D arrays:** grid[row][col].
- **Inheritance:** class Dog extends Animal; a subclass can **override** methods and call super.
- **Recursion** needs a base case.

## Worked examples
Example: What are 17 / 5, 17 % 5 and (double) 17 / 5?
Solution: 17 / 5 with ints drops the remainder: 3. The remainder is 2. Casting first makes it decimal division.
Answer: 3, 2 and 3.4
Example: What does "computer".substring(3, 6) return?
Solution: Indexes: c0 o1 m2 p3 u4 t5 e6 r7. Take 3, 4, 5 (stop before 6).
Answer: "put"
Example: What does this print? for (int i = 0; i < 10; i += 3) System.out.print(i + " ");
Solution: i = 0, 3, 6, 9; then 12 fails the test i < 10.
Answer: 0 3 6 9

## Common mistakes
- **Expecting 7 / 2 to be 3.5.** With two ints, it's 3.
- **Using == on Strings.** Use s1.equals(s2).
- **Index out of bounds.** Valid indexes are 0 to length − 1.
- **Removing from an ArrayList while looping forward.** Later items shift left and one gets skipped; loop backward instead.
- **Mixing up length, length() and size().** Arrays: a.length. Strings: s.length(). ArrayLists: list.size().

## Check yourself
Q: What is 9 % 4?
A: 1
Q: What is (int) 5.99?
A: 5
Q: What does "hello".indexOf("z") return?
A: −1
Q: How do you get the number of items in an ArrayList named list?
A: list.size()
Q: In a && b, when is b not evaluated?
A: When a is false.

@@ internet-cybersecurity
## Overview
The internet is a **network of networks** that works because every device follows shared **protocols**. Data travels in small **packets** that can take different routes, which makes the internet fault tolerant. AP Computer Science Principles also covers how data is represented and compressed, and how encryption keeps it safe.

## Key ideas
- Every device has an **IP address**. **DNS** turns names like example.com into IP addresses.
- Data is split into **packets**; **routers** forward each one toward its destination, possibly by different paths, and they're reassembled at the end.
- **Fault tolerance:** redundant paths let the network keep working when parts fail.
- **HTTP** delivers web pages; **HTTPS** encrypts them. **Bandwidth** is the maximum data per second.
- **Bits:** n bits can represent \(2^n\) different values (8 bits → 256).
- **Compression:** **lossless** can be restored exactly (ZIP, PNG); **lossy** throws away detail for smaller files (JPEG, MP3).
- **Encryption:** **symmetric** uses one shared key; **public key** encryption lets anyone encrypt with a public key, but only the private key decrypts.
- **Security:** **multifactor authentication**, strong passwords, and watching for phishing and malware. **Metadata** is data about data (a photo's time and location).
- **Digital divide:** unequal access to technology.

## Worked examples
Example: How many different values can 4 bits represent?
Solution: \(2^4\).
Answer: 16 (0 to 15)
Example: Why does a photo site use JPEG but a code-sharing site uses ZIP?
Solution: Photos can lose tiny details nobody notices, so lossy compression saves space. Code must come back exactly, or it breaks.
Answer: Photos tolerate lossy compression; code needs lossless.
Example: How can you send a secret to someone you've never met, using public key encryption?
Solution: They publish a public key. You encrypt with it. Only their private key, which they keep secret, can decrypt it.
Answer: Encrypt with their public key; only their private key can read it.

## Common mistakes
- **Thinking packets all take the same path.** Each is routed independently.
- **Thinking HTTPS means a site is trustworthy.** It means the connection is encrypted, not that the site is honest.
- **Calling lossy compression reversible.** The lost detail is gone for good.
- **Sharing the private key.** Only the public key is shared.

## In order: What happens when you visit a website
- You type a web address (URL) into the browser
- DNS looks up the site's IP address
- Your request is split into packets and sent out
- Routers forward the packets across the internet
- The server sends back the page in packets
- Your browser reassembles them and shows the page

## Check yourself
Q: What does DNS do?
A: Turns domain names into IP addresses.
Q: How many values can 8 bits represent?
A: 256
Q: Is MP3 lossy or lossless?
A: Lossy
Q: What is multifactor authentication?
A: Logging in with two or more kinds of proof, like a password plus a code.
Q: Why is the internet fault tolerant?
A: There are redundant paths, so data can route around failures.

@@ data-structures
## Overview
A **data structure** organizes data so the operations you need are fast. An **algorithm** is a procedure that uses it. Choosing well can turn a program that takes hours into one that takes milliseconds; Big-O notation measures the difference.

## Key ideas
- **Stack:** last in, first out (LIFO), like a stack of plates: push and pop at the top. Used for undo and recursion.
- **Queue:** first in, first out (FIFO), like a line: enqueue at the back, dequeue at the front.
- **Linked list:** nodes linked one to the next; fast inserts, slow lookups by position.
- **Hash table:** key–value pairs with average O(1) lookup.
- **Trees:** a **binary search tree** keeps smaller values on the left and larger on the right (O(log n) search when balanced). A **heap** keeps the max (or min) at the root.
- **Graphs:** vertices connected by edges. **BFS** explores level by level with a queue (finds shortest paths in unweighted graphs); **DFS** goes deep first with a stack or recursion.
- **Searching:** linear O(n); **binary search** O(log n) but needs sorted data.
- **Sorting:** bubble sort O(n²); **merge sort** O(n log n).
- **Dynamic programming** stores answers to overlapping subproblems instead of recomputing them.

## Worked examples
Example: Push 1, 2, 3 onto a stack, then pop. Enqueue 1, 2, 3 into a queue, then dequeue. What comes out?
Solution: A stack returns the last item in; a queue returns the first.
Answer: Stack: 3. Queue: 1.
Example: Binary search for 23 in [2, 5, 8, 12, 16, 23, 38].
Solution: The middle is 12; 23 > 12, so search [16, 23, 38]. The middle is 23: found.
Answer: Found in 2 comparisons.
Example: Insert 8, 3, 10, 1, 6 into a binary search tree. What does an in-order traversal give?
Solution: 8 is the root; 3 goes left, 10 right; 1 left of 3, 6 right of 3. In-order visits left, node, right.
Answer: 1, 3, 6, 8, 10 (sorted order)

## Common mistakes
- **Using binary search on unsorted data.** It gives wrong answers.
- **Mixing up LIFO and FIFO.** Stack = LIFO; queue = FIFO.
- **Assuming a BST is always O(log n).** An unbalanced tree can degrade to O(n).
- **Using DFS to find the shortest path** in an unweighted graph. BFS does that.

## In order: Merge sort
- Split the list in half
- Keep splitting until each piece has one item
- Merge pairs of pieces back together in sorted order
- Keep merging until one sorted list remains

## Check yourself
Q: Which structure is first in, first out?
A: A queue
Q: What is the Big-O of binary search?
A: O(log n)
Q: Which search uses a queue?
A: Breadth-first search (BFS)
Q: What is the average lookup time of a hash table?
A: O(1)
Q: Which is faster on large lists, bubble sort or merge sort?
A: Merge sort, O(n log n) vs O(n²).
`);

  /* ---------- Arts & Music ---------- */
  add(String.raw`
@@ art-basics
## Overview
Artists and musicians use simple building blocks. In art: **colors**, **shapes** and **patterns**. In music: the **beat**, **rhythm** and the sounds of different **instruments**. Once you know the blocks, you can describe any painting or song.

## Key ideas
- **Primary colors:** red, yellow and blue. They can't be made by mixing other colors.
- **Secondary colors** come from mixing two primaries: red + yellow = **orange**, yellow + blue = **green**, blue + red = **purple**.
- **Warm colors** (red, orange, yellow) feel energetic; **cool colors** (blue, green, purple) feel calm.
- A **shape** is flat (circle, square, triangle). A **pattern** repeats.
- The **beat** is the steady pulse you can clap to. **Rhythm** is the pattern of long and short sounds on top of it.
- **Instrument families:** **strings** (violin, guitar, cello), **woodwinds** (flute, clarinet, saxophone), **brass** (trumpet, trombone, tuba), **percussion** (drums, xylophone, tambourine).

## Worked examples
Example: What color do you get mixing blue and yellow?
Solution: Blue and yellow are primaries; together they make a secondary color.
Answer: Green
Example: A painting uses mostly blues and purples. How might it feel?
Solution: Blue and purple are cool colors.
Answer: Calm, quiet or cool
Example: Which family does the trumpet belong to?
Solution: You buzz your lips into its mouthpiece.
Answer: Brass

## Common mistakes
- **Calling green a primary color** (in painting). It's mixed from blue and yellow.
- **Mixing up beat and rhythm.** The beat stays steady; the rhythm changes.
- **Putting the saxophone in brass.** It's made of brass, but it uses a reed, so it's a woodwind.

## In order: Colors of the rainbow
- Red
- Orange
- Yellow
- Green
- Blue
- Indigo
- Violet

## Check yourself
Q: Name the three primary colors.
A: Red, yellow and blue.
Q: Is orange warm or cool?
A: Warm
Q: Which family does the drum belong to?
A: Percussion
Q: What do you get mixing red and blue?
A: Purple
Q: What is a pattern?
A: A design that repeats.

@@ music-theory
## Overview
Music theory is the grammar of music. It explains how notes are written on a **staff**, how long they last, how **scales** and **keys** are built, and how notes stack into **chords**. Being able to read and name these lets you understand and play any piece of written music.

## Key ideas
- The **staff** has five lines and four spaces. **Treble clef** lines: E G B D F ("Every Good Boy Does Fine"); spaces: F A C E. **Bass clef** lines: G B D F A; spaces: A C E G.
- **Note values in 4/4:** whole = 4 beats, half = 2, quarter = 1, eighth = ½.
- **Time signature:** the top number is beats per measure; the bottom says which note gets the beat (4 = quarter note).
- A **sharp** (♯) raises a note a half step; a **flat** (♭) lowers it.
- **Major scale** pattern: W W H W W W H (C D E F G A B C).
- A **key signature** lists the sharps or flats for the whole piece. G major has one sharp (F♯); F major has one flat (B♭).
- **Octave:** the same note name eight notes up.
- **Triads:** **major** = root, major third, perfect fifth (C–E–G); **minor** = root, minor third, perfect fifth (A–C–E).
- **Dynamics:** p (piano) soft, f (forte) loud. **Tempo:** largo very slow, andante walking, allegro fast.

## Worked examples
Example: In 4/4, does a measure with a half note, a quarter note and two eighth notes have the right number of beats?
Solution: 2 + 1 + ½ + ½ = 4.
Answer: Yes, 4 beats.
Example: Build the G major scale.
Solution: Start on G and follow W W H W W W H: G, A, B, C, D, E, then a whole step to F♯, then a half step to G.
Answer: G A B C D E F♯ G
Example: What notes are in a G major triad?
Solution: Root G, a major third up (B), a perfect fifth up (D).
Answer: G–B–D

## Common mistakes
- **Reading bass clef like treble clef.** The same line means a different note.
- **Counting an eighth note as one beat** in 4/4. It's half a beat.
- **Thinking a time signature is a fraction.** 4/4 means four quarter-note beats per measure.
- **Forgetting the key signature** applies to every note of that name in the piece.

## In order: Tempo markings, slowest to fastest
- Largo
- Adagio
- Andante
- Moderato
- Allegro
- Presto

## In order: Dynamics, softest to loudest
- pp (pianissimo)
- p (piano)
- mp (mezzo-piano)
- mf (mezzo-forte)
- f (forte)
- ff (fortissimo)

## Check yourself
Q: What are the treble clef spaces?
A: F, A, C, E
Q: How many beats does a half note get in 4/4?
A: 2
Q: What does a flat do?
A: Lowers a note by a half step.
Q: What are the notes of an A minor triad?
A: A–C–E
Q: What does allegro mean?
A: Fast

@@ art-history
## Overview
Art history studies how art changes across time and cultures, and **why**: new ideas, technologies and events shape what artists make. Learn the **elements** and **principles** of art to describe any work, then the major movements, their key artists and how to recognize them.

## Key ideas
- **Elements of art:** line, shape, form, color, value, texture, space. **Principles of design:** balance, contrast, emphasis, movement, pattern, rhythm, unity.
- **Renaissance** (1300s–1500s): classical ideals, linear perspective, realistic anatomy (Leonardo, Michelangelo, Raphael). **Contrapposto** gives statues a natural stance; **fresco** paints onto wet plaster.
- **Baroque** (1600s): drama, motion and **chiaroscuro**, strong light and dark (Caravaggio, Bernini, Rembrandt).
- **Impressionism** (late 1800s): light, color and quick brushstrokes, often outdoors (Monet, Renoir).
- **Post-Impressionism:** bolder color and form (Van Gogh, Cézanne, Gauguin).
- **Cubism** (early 1900s): many viewpoints at once, geometric shapes (Picasso, Braque).
- **Surrealism:** dreamlike images from the unconscious (Dalí, Magritte).
- **Abstract Expressionism** (1940s–50s): large gestural abstract paintings (Pollock, Rothko). **Pop Art** (1960s): advertising and popular culture (Warhol, Lichtenstein).
- **Analyze a work:** describe it (elements), analyze it (principles), interpret it (meaning and context), then judge it.

## Worked examples
Example: A painting shows a dark room with one bright beam of light hitting the figures. Which movement and technique does it suggest?
Solution: Strong light-and-dark contrast and drama point to the Baroque.
Answer: Baroque chiaroscuro (for example, Caravaggio)
Example: How do you recognize Impressionism?
Solution: Look for visible, quick brushstrokes, bright natural light and everyday or outdoor scenes rather than crisp detail.
Answer: Loose brushwork capturing a moment of light (for example, Monet's water lilies).
Example: Why does Michelangelo's *David* look relaxed even though it's marble?
Solution: Its weight rests on one leg, so the hips and shoulders tilt naturally.
Answer: Contrapposto

## Common mistakes
- **Mixing up Impressionism and Post-Impressionism.** Van Gogh is Post-Impressionist.
- **Calling every unusual image Surrealism.** Surrealism is dreamlike and irrational; Cubism breaks objects into geometric views.
- **Describing without analyzing.** Say how the elements create meaning.
- **Mixing up form and shape.** Shape is flat (2-D); form is 3-D.

## Timeline
- c. 1503: Leonardo begins the Mona Lisa
- 1504: Michelangelo completes David
- 1512: Michelangelo finishes the Sistine Chapel ceiling
- 1600: Caravaggio paints The Calling of Saint Matthew
- 1642: Rembrandt paints The Night Watch
- 1872: Monet paints Impression, Sunrise
- 1889: Van Gogh paints The Starry Night
- 1907: Picasso paints Les Demoiselles d'Avignon
- 1931: Dalí paints The Persistence of Memory
- 1950: Pollock paints Autumn Rhythm
- 1962: Warhol makes Campbell's Soup Cans

## Check yourself
Q: What is chiaroscuro?
A: Strong contrast between light and dark to model form.
Q: Which movement did Monet help start?
A: Impressionism
Q: Who co-founded Cubism with Picasso?
A: Georges Braque
Q: What is a fresco?
A: Painting on wet plaster so the paint becomes part of the wall.
Q: Name one Pop Art artist.
A: Andy Warhol or Roy Lichtenstein.
`);
})(typeof window !== 'undefined' ? window : globalThis);
