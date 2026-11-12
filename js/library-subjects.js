/* Built-in subjects besides Math: Science, History & Social Studies, English, World Languages and
   Computer Science. Same format as js/library.js:
     @id|Name|Level|Icon|Short description   then   Term|Definition   lines.
   Card ids are positional (lib:<category>:<index>): append new concepts at the END of a category. */
(function (root) {
  'use strict';
  const Library = root.MSG.Library;

  Library.addSubject('Science', '🔬', ['Biology', 'Chemistry', 'Physics', 'Earth Science'], String.raw`
@bio-cells|Cells|Biology|🧫|Cell theory, organelles and how materials move in and out of cells.
Cell theory|All living things are made of cells; the cell is the basic unit of life; all cells come from existing cells.
Prokaryote|A cell with no nucleus or membrane-bound organelles, such as bacteria.
Eukaryote|A cell with a nucleus and membrane-bound organelles, such as plant, animal and fungus cells.
Nucleus|The organelle that holds the cell's DNA and controls the cell's activities.
Mitochondria|The organelles that release energy from food through cellular respiration ("powerhouse of the cell").
Ribosome|The structure that builds proteins.
Endoplasmic reticulum|A network of membranes that makes and transports proteins (rough ER, with ribosomes) and lipids (smooth ER).
Golgi apparatus|The organelle that packages and ships proteins.
Cell membrane|The flexible outer layer that controls what enters and leaves the cell.
Cell wall|A rigid layer outside the cell membrane of plants, fungi and bacteria that gives support.
Chloroplast|The organelle in plant cells where photosynthesis happens.
Vacuole|A sac that stores water, food and waste; plant cells have one large central vacuole.
Diffusion|The movement of particles from an area of high concentration to an area of low concentration.
Osmosis|The diffusion of water across a semipermeable membrane.
Active transport|Moving materials across a membrane against the concentration gradient, using energy (ATP).

@bio-genetics|Genetics & Evolution|Biology|🧬|DNA, inheritance, Punnett squares, cell division and natural selection.
DNA|Deoxyribonucleic acid: the molecule that carries genetic instructions, shaped like a double helix.
Gene|A section of DNA that codes for a trait.
Allele|One of the different forms of a gene.
Dominant allele|An allele that shows its trait whenever it is present (written with a capital letter, A).
Recessive allele|An allele whose trait shows only when two copies are present (written lowercase, a).
Genotype|The alleles an organism has, such as AA, Aa or aa.
Phenotype|The trait that shows, such as brown eyes.
Homozygous|Having two identical alleles for a gene (AA or aa).
Heterozygous|Having two different alleles for a gene (Aa).
Punnett square|A grid that predicts the possible genotypes of offspring from two parents.
Mitosis|Cell division that makes two identical body cells.
Meiosis|Cell division that makes four sex cells (gametes), each with half the chromosomes.
Mutation|A change in the DNA sequence.
Natural selection|Organisms with traits better suited to their environment survive and reproduce more, so those traits become more common.
Adaptation|An inherited trait that helps an organism survive in its environment.

@bio-ecology|Ecology & Energy|Biology|🌿|Ecosystems, food webs, photosynthesis, respiration and relationships between organisms.
Ecosystem|All the living and nonliving things in an area interacting together.
Biotic factor|A living part of an ecosystem (plants, animals, bacteria).
Abiotic factor|A nonliving part of an ecosystem (sunlight, water, temperature, soil).
Producer|An organism that makes its own food, usually by photosynthesis.
Consumer|An organism that gets energy by eating other organisms.
Decomposer|An organism that breaks down dead material and returns nutrients to the soil.
Food chain|One path of energy through an ecosystem, from producer to consumers.
Food web|All the connected food chains in an ecosystem.
10% rule|Only about 10% of the energy at one level of a food chain passes to the next level.
Photosynthesis|Plants use sunlight to turn carbon dioxide and water into glucose and oxygen: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.
Cellular respiration|Cells break down glucose with oxygen to release energy: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy (ATP).
Mutualism|A relationship where both organisms benefit.
Commensalism|A relationship where one organism benefits and the other is not affected.
Parasitism|A relationship where one organism benefits and the other is harmed.
Carrying capacity|The largest population an environment can support.

@chem-basics|Atoms & the Periodic Table|Chemistry|⚛️|Atomic structure, the periodic table, bonds, acids and bases.
Atom|The smallest unit of an element that keeps its properties.
Proton|A positive particle in the nucleus; the number of protons is the atomic number.
Neutron|A neutral particle in the nucleus.
Electron|A negative particle that moves around the nucleus.
Atomic number|The number of protons in an atom; it identifies the element.
Mass number|Protons + neutrons. Neutrons = mass number − atomic number.
Isotope|Atoms of the same element with different numbers of neutrons.
Ion|An atom that has gained electrons (negative ion) or lost electrons (positive ion).
Element|A pure substance made of only one kind of atom.
Compound|Two or more elements chemically bonded in a fixed ratio, such as H₂O.
Mixture|Substances combined physically, not chemically; they can be separated.
Group|A column of the periodic table; elements in a group have similar properties and the same number of valence electrons.
Period|A row of the periodic table.
Valence electrons|Electrons in the outermost shell; they take part in bonding.
Ionic bond|A bond formed when electrons are transferred, usually between a metal and a nonmetal.
Covalent bond|A bond formed when atoms share electrons, usually between nonmetals.
pH scale|Measures acidity from 0 to 14: below 7 is acidic, 7 is neutral, above 7 is basic.
Mole|6.022 × 10²³ particles (Avogadro's number); the mass of one mole in grams is the molar mass.

@physics-motion|Forces, Motion & Energy|Physics|🚀|Speed, Newton's laws, momentum, energy, work and electricity.
Speed|Distance divided by time: v = d ÷ t (meters per second).
Velocity|Speed in a given direction.
Acceleration|The change in velocity divided by time: a = Δv ÷ t (m/s²).
Newton's first law|An object stays at rest or keeps moving at the same velocity unless a net force acts on it (inertia).
Newton's second law|Force = mass × acceleration: F = ma (newtons).
Newton's third law|For every action force there is an equal and opposite reaction force.
Mass|The amount of matter in an object (kilograms); it does not change with location.
Weight|The force of gravity on an object: W = mg, with g ≈ 9.8 m/s² on Earth.
Momentum|Mass × velocity: p = mv.
Kinetic energy|Energy of motion: KE = ½mv² (joules).
Potential energy|Stored energy of position: PE = mgh.
Work|Force × distance moved in the direction of the force: W = Fd (joules).
Power|Work divided by time: P = W ÷ t (watts).
Law of conservation of energy|Energy cannot be created or destroyed, only changed from one form to another.
Ohm's law|Voltage = current × resistance: V = IR.

@earth-science|Earth & Space|Earth Science|🌋|Rocks, plate tectonics, weather, the water cycle and the solar system.
Igneous rock|Rock formed when magma or lava cools and hardens (granite, basalt).
Sedimentary rock|Rock formed when layers of sediment are pressed and cemented together (sandstone, limestone).
Metamorphic rock|Rock changed by heat and pressure (marble, slate).
Weathering|The breaking down of rock into smaller pieces.
Erosion|The moving of weathered rock and soil by water, wind or ice.
Deposition|The dropping of sediment in a new place.
Plate tectonics|Earth's outer layer is broken into plates that slowly move.
Convergent boundary|Where two plates push together, forming mountains or trenches.
Divergent boundary|Where two plates move apart, forming new crust.
Transform boundary|Where two plates slide past each other, causing earthquakes.
Magma vs lava|Magma is melted rock underground; lava is melted rock on the surface.
Water cycle|Evaporation, condensation, precipitation and collection move water around Earth.
Weather vs climate|Weather is the day-to-day conditions; climate is the average pattern over many years.
Troposphere|The lowest layer of the atmosphere, where weather happens.
Greenhouse effect|Gases such as carbon dioxide trap heat in the atmosphere and warm Earth.
Rotation vs revolution|Earth rotates on its axis once a day and revolves around the Sun once a year.
Seasons|Caused by the tilt of Earth's axis (about 23.5°), not by distance from the Sun.
`, 'Biology, chemistry, physics and earth science');

  Library.addSubject('History & Social Studies', '🏛️', ['History', 'Government', 'Geography', 'Economics'], String.raw`
@us-history|U.S. History|History|🇺🇸|From the Revolution to the civil rights era: key events, documents and dates.
Declaration of Independence|Adopted July 4, 1776; declared the 13 colonies independent from Britain. Mainly written by Thomas Jefferson.
American Revolution|The war for independence from Britain, 1775–1783.
U.S. Constitution|Written and signed in 1787 at the Constitutional Convention in Philadelphia; the supreme law of the United States.
Bill of Rights|The first 10 amendments to the Constitution, ratified in 1791.
Louisiana Purchase|1803: the U.S. bought the Louisiana Territory from France, about doubling the country's size.
Manifest Destiny|The 1800s belief that the U.S. was meant to expand across North America.
Civil War|1861–1865, between the Union (North) and the Confederacy (South), over slavery and states' rights.
Emancipation Proclamation|Issued by Abraham Lincoln in 1863; declared enslaved people in Confederate states free.
13th Amendment|Ratified in 1865; abolished slavery in the United States.
Reconstruction|1865–1877: rebuilding the South and bringing the Confederate states back into the Union.
19th Amendment|Ratified in 1920; gave women the right to vote.
Great Depression|A severe economic downturn that began with the stock market crash of 1929.
New Deal|Franklin D. Roosevelt's programs in the 1930s to bring relief, recovery and reform.
Pearl Harbor|Japan attacked the U.S. base on December 7, 1941, bringing the U.S. into World War II.
Brown v. Board of Education|1954 Supreme Court decision that racial segregation in public schools is unconstitutional.
Civil Rights Act of 1964|Outlawed discrimination based on race, color, religion, sex or national origin.

@world-history|World History|History|🌍|Major turning points from ancient Rome to the end of the Cold War.
Fall of the Western Roman Empire|476 CE, a common date for the end of ancient Rome in the west.
Magna Carta|1215: an English document that limited the king's power.
Renaissance|A rebirth of art and learning in Europe, beginning in Italy in the 1300s.
Protestant Reformation|Began in 1517 when Martin Luther posted his 95 Theses, challenging the Catholic Church.
Age of Exploration|1400s–1600s: European voyages to find new trade routes; Columbus reached the Americas in 1492.
Scientific Revolution|1500s–1700s: new ideas about science based on observation and experiment (Copernicus, Galileo, Newton).
Enlightenment|1700s movement that stressed reason and natural rights (Locke, Montesquieu, Rousseau).
French Revolution|Began in 1789; overthrew the French monarchy.
Industrial Revolution|The shift to machine and factory production, beginning in Britain in the late 1700s.
Imperialism|A stronger nation taking control of weaker lands, politically or economically.
World War I|1914–1918; the Allies defeated the Central Powers.
Treaty of Versailles|1919 treaty that ended World War I and blamed Germany for the war.
World War II|1939–1945; the Allies defeated the Axis powers (Germany, Italy, Japan).
Holocaust|The Nazi genocide of six million Jews and millions of others during World War II.
Cold War|About 1947–1991: rivalry between the U.S. and the Soviet Union without direct war between them.
Fall of the Berlin Wall|1989; a symbol of the end of the Cold War. The Soviet Union dissolved in 1991.

@government|Government & Civics|Government|⚖️|The Constitution, the three branches, rights and how laws are made.
Democracy|Government in which power belongs to the people.
Republic|A government in which citizens elect representatives to make laws.
Federalism|Power is divided between the national government and the state governments.
Separation of powers|Government power is split among the legislative, executive and judicial branches.
Checks and balances|Each branch can limit the power of the other branches.
Legislative branch|Congress (the Senate and the House of Representatives); makes laws.
Executive branch|The President, Vice President and cabinet; carries out and enforces laws.
Judicial branch|The Supreme Court and other federal courts; interprets laws.
Senate|100 senators, 2 per state, serving 6-year terms.
House of Representatives|435 members, based on state population, serving 2-year terms.
Veto|The President's power to reject a bill; Congress can override it with a two-thirds vote of both houses.
Judicial review|The power of courts to declare laws unconstitutional, established by Marbury v. Madison (1803).
Amendment|A change to the Constitution; there are 27.
First Amendment|Protects freedom of religion, speech, press, assembly and petition.
Electoral College|The system that elects the President; a candidate needs 270 of 538 electoral votes to win.

@geography|World Geography|Geography|🗺️|Map skills, continents, oceans and world capitals.
Latitude|Imaginary lines that run east–west and measure distance north or south of the equator.
Longitude|Imaginary lines that run north–south and measure distance east or west of the prime meridian.
Equator|0° latitude; divides Earth into the Northern and Southern Hemispheres.
Prime meridian|0° longitude; runs through Greenwich, England, and divides Earth into the Eastern and Western Hemispheres.
Continents|Asia, Africa, North America, South America, Antarctica, Europe and Australia (Oceania): seven in all.
Oceans|Pacific (the largest), Atlantic, Indian, Southern and Arctic (the smallest).
Physical map|A map that shows landforms and bodies of water.
Political map|A map that shows borders, countries, states and cities.
Climate map|A map that shows the usual weather patterns of regions.
Scale|Shows how a distance on the map compares to the real distance.
Relative location|Where a place is compared to other places.
Absolute location|The exact location, given by latitude and longitude.

@economics|Economics & Personal Finance|Economics|💵|Scarcity, supply and demand, markets, money and interest.
Scarcity|Wants are unlimited but resources are limited, so people must make choices.
Opportunity cost|The value of the next-best choice you give up when you make a decision.
Supply|The amount of a good producers are willing to sell at each price.
Demand|The amount of a good consumers are willing to buy at each price.
Law of demand|When the price goes up, the quantity demanded goes down (and the other way around).
Law of supply|When the price goes up, the quantity supplied goes up.
Equilibrium price|The price where the quantity supplied equals the quantity demanded.
Inflation|A general rise in prices over time, which lowers what money can buy.
Gross domestic product (GDP)|The total value of all final goods and services produced in a country in a year.
Recession|A significant decline in economic activity lasting months, often two quarters of falling GDP.
Monopoly|A market with only one seller.
Simple interest|I = P × r × t (principal × yearly rate × years).
Budget|A plan for how to spend and save money.
Entrepreneur|A person who starts and runs a business, taking on financial risk.
`, 'History, government, geography and economics');

  Library.addSubject('English', '📖', ['Grammar & Vocabulary', 'Reading & Writing'], String.raw`
@grammar|Grammar & Parts of Speech|Grammar & Vocabulary|✍️|Parts of speech, sentences, clauses and common errors.
Noun|A person, place, thing or idea.
Pronoun|A word that takes the place of a noun (he, she, it, they).
Verb|A word that shows action or a state of being.
Adjective|A word that describes a noun or pronoun.
Adverb|A word that describes a verb, adjective or another adverb; often ends in -ly.
Preposition|A word that shows the relationship between a noun and another word (in, on, under, before).
Conjunction|A word that joins words or groups of words (and, but, or, because).
Interjection|A word that shows strong feeling (Wow! Ouch!).
Subject|Who or what the sentence is about.
Predicate|The part of a sentence that tells what the subject does or is.
Independent clause|A group of words with a subject and verb that can stand alone as a sentence.
Dependent clause|A group of words with a subject and verb that cannot stand alone.
Sentence fragment|An incomplete sentence missing a subject, a verb or a complete thought.
Run-on sentence|Two or more independent clauses joined without correct punctuation.
Comma splice|Two independent clauses joined only by a comma.

@literary-devices|Literary Devices|Reading & Writing|🎭|Figurative language and the techniques authors use.
Simile|A comparison using "like" or "as": "brave as a lion."
Metaphor|A direct comparison without "like" or "as": "Time is a thief."
Personification|Giving human qualities to something that isn't human: "The wind whispered."
Hyperbole|Extreme exaggeration for effect: "I've told you a million times."
Alliteration|Repeating the same first consonant sound: "Peter Piper picked peppers."
Onomatopoeia|A word that imitates a sound: buzz, sizzle, boom.
Imagery|Language that appeals to the five senses.
Symbolism|An object, person or event that stands for a bigger idea.
Foreshadowing|Hints about what will happen later in the story.
Flashback|A scene that interrupts the story to show an earlier event.
Situational irony|When the opposite of what is expected happens.
Dramatic irony|When the audience knows something a character does not.
Verbal irony|Saying the opposite of what you mean, often as sarcasm.
Allusion|A reference to a well-known person, place, event or work.
Oxymoron|Two opposite words placed together: "jumbo shrimp."

@reading-writing|Reading & Writing Skills|Reading & Writing|📝|Plot, point of view, theme and argument writing.
Theme|The message or lesson about life in a story.
Main idea|The most important point of a text.
Inference|A conclusion based on evidence and reasoning rather than a direct statement.
Exposition|The beginning of a plot, which introduces characters and setting.
Rising action|Events that build tension toward the climax.
Climax|The turning point and moment of greatest tension.
Falling action|Events after the climax that lead to the ending.
Resolution|How the conflict is settled at the end.
Protagonist|The main character.
Antagonist|The character or force that opposes the protagonist.
First-person point of view|The narrator is a character and uses "I" or "we."
Third-person point of view|The narrator is outside the story and uses "he," "she" or "they."
Tone|The author's attitude toward the subject.
Mood|The feeling the reader gets from the text.
Claim|The main argument or position in an argumentative essay.
Evidence|Facts, quotes or data that support a claim.
Counterclaim|An opposing argument that the writer addresses and answers.
Thesis statement|One sentence, usually at the end of the introduction, that states the main point of an essay.

@word-roots|Word Roots, Prefixes & Suffixes|Grammar & Vocabulary|🌱|Greek and Latin word parts that unlock new vocabulary.
bio|life (biology, biography)
geo|earth (geography, geology)
graph / gram|write, draw (autograph, diagram)
tele|far (telephone, telescope)
photo|light (photograph, photosynthesis)
chron|time (chronological, synchronize)
port|carry (transport, portable)
scrib / script|write (describe, manuscript)
dict|say, speak (predict, dictionary)
aud|hear (audience, audio)
vis / vid|see (vision, video)
micro|small (microscope, microbe)
-ology|study of (biology, psychology)
pre-|before (preview, prehistoric)
anti-|against (antibiotic, antisocial)
sub-|under, below (submarine, subway)
inter-|between (international, interact)
trans-|across (transport, transatlantic)
un- / dis-|not, opposite of (unhappy, disagree)
-less|without (fearless, hopeless)
`, 'Grammar, vocabulary, literature and writing');

  Library.addSubject('World Languages', '🗣️', ['Spanish', 'French'], String.raw`
@spanish-basics|Spanish Basics|Spanish|🇪🇸|Greetings, everyday vocabulary and present-tense verbs.
Hola|Hello
Adiós|Goodbye
Por favor|Please
Gracias|Thank you
¿Cómo estás?|How are you?
Me llamo…|My name is…
Regular -ar verbs (hablar)|hablo, hablas, habla, hablamos, habláis, hablan
Regular -er verbs (comer)|como, comes, come, comemos, coméis, comen
Regular -ir verbs (vivir)|vivo, vives, vive, vivimos, vivís, viven
Ser|To be (permanent traits, identity, origin, time): soy, eres, es, somos, sois, son
Estar|To be (location, feelings, temporary conditions): estoy, estás, está, estamos, estáis, están
Gender of nouns|Most nouns ending in -o are masculine (el libro); most ending in -a are feminine (la casa).
Adjective agreement|Adjectives match the noun's gender and number and usually come after it: las casas blancas.
Tener|To have: tengo, tienes, tiene, tenemos, tenéis, tienen

@french-basics|French Basics|French|🇫🇷|Greetings, everyday vocabulary and key verbs.
Bonjour|Hello / Good morning
Au revoir|Goodbye
S'il vous plaît|Please (formal)
Merci|Thank you
Comment ça va ?|How are you?
Je m'appelle…|My name is…
Être|To be: je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont
Avoir|To have: j'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont
Regular -er verbs (parler)|parle, parles, parle, parlons, parlez, parlent
Gender of nouns|Every noun is masculine (le, un) or feminine (la, une).
Tu vs vous|Tu is informal and singular; vous is formal or plural.
Liaison|Linking a normally silent final consonant to a following vowel sound: les amis.
`, 'Spanish and French vocabulary and verbs');

  Library.addSubject('Computer Science', '💻', ['Computer Science'], String.raw`
@cs-basics|Programming & Computing|Computer Science|🖥️|Algorithms, programming basics, binary and efficiency.
Algorithm|A step-by-step set of instructions to solve a problem.
Variable|A named storage location for a value that can change.
Data type|The kind of value a variable holds: integer, float, string, Boolean.
Boolean|A value that is either true or false.
Conditional|An if/else statement that runs code only when a condition is true.
Loop|Code that repeats (for, while).
Function|A named, reusable block of code that can take inputs (parameters) and return a value.
Array (list)|An ordered collection of values, usually indexed starting at 0.
Recursion|When a function calls itself to solve smaller versions of a problem.
Bit|A binary digit, 0 or 1.
Byte|8 bits.
Binary|Base-2 number system using only 0 and 1.
Debugging|Finding and fixing errors in code.
Compiler|A program that translates source code into machine code before it runs.
Big-O notation|Describes how an algorithm's running time grows with input size: O(1), O(log n), O(n), O(n²).
`, 'Programming basics, binary and algorithms');
})(typeof window !== 'undefined' ? window : globalThis);
