/* More topics so every subject runs from beginner to advanced (elementary → AP/IB → college),
   a new Arts & Music subject, and the grade band of every topic.
   Format as in js/library.js:  @id|Name|Level|Icon|Short description   then   Term|Definition.
   Card ids are positional (lib:<category>:<index>): append new concepts at the END of a category. */
(function (root) {
  'use strict';
  const Library = root.MSG.Library;

  /* ---------------- Math: lowest and highest ---------------- */
  Library.addCategories('Math', String.raw`
@early-math|Early Math: Place Value, Time & Money|Foundations|🧮|Counting, place value, rounding, even and odd, telling time and counting money.
Place value|The value of a digit depends on its place: in 352, the 3 means 300, the 5 means 50 and the 2 means 2.
Ones, tens, hundreds|Ten ones make a ten, ten tens make a hundred, and ten hundreds make a thousand.
Even number|A number that splits into two equal groups; it ends in 0, 2, 4, 6 or 8.
Odd number|A number that does not split into two equal groups; it ends in 1, 3, 5, 7 or 9.
Rounding|Look at the digit to the right of the place you round to: 5 or more rounds up, 4 or less rounds down.
Skip counting|Counting by the same amount each time: 5, 10, 15, 20, …
Coins|Penny 1¢, nickel 5¢, dime 10¢, quarter 25¢. One dollar is 100¢.
Telling time|The short hand shows the hour and the long hand shows the minutes. One hour is 60 minutes.
Elapsed time|How much time passes between a start time and an end time.
Greater than and less than|> means greater than and < means less than: 7 > 3 and 3 < 7.
Fact family|Related facts from the same three numbers: 3 + 4 = 7, 4 + 3 = 7, 7 − 3 = 4, 7 − 4 = 3.

@inferential-statistics|Statistics: Distributions & Inference|Advanced & College|📊|Normal distributions, sampling, confidence intervals and hypothesis tests (AP Statistics, IB Math).
Normal distribution|A symmetric, bell-shaped distribution described by its mean μ and standard deviation σ.
Empirical rule|About 68% of values lie within 1σ of the mean, 95% within 2σ and 99.7% within 3σ.
Population vs sample|The population is the whole group of interest; a sample is the part you collect data from.
Parameter vs statistic|A parameter describes a population (μ, p); a statistic describes a sample (x̄, p̂).
Sampling distribution|The distribution of a statistic over all possible samples of the same size.
Central limit theorem|For large samples (often n ≥ 30) the sampling distribution of the sample mean is approximately normal.
Standard error of the mean|\(\frac{\sigma}{\sqrt{n}}\)
Confidence interval|An estimate ± margin of error, such as \(\bar{x} \pm z^* \frac{\sigma}{\sqrt{n}}\); for 95% confidence, \(z^* \approx 1.96\).
Null hypothesis|H₀: the claim of no effect or no difference that a test looks for evidence against.
p-value|The probability of results at least as extreme as those observed, assuming H₀ is true.
Significance level|The cutoff α, often 0.05: if p < α, reject H₀.
Type I error|Rejecting H₀ when it is actually true.
Type II error|Failing to reject H₀ when it is actually false.
Correlation coefficient|r measures the strength and direction of a linear relationship, from −1 to 1.
Experiment vs observational study|An experiment assigns treatments and can show cause and effect; an observational study only observes.
`);

  /* ---------------- Science ---------------- */
  Library.addCategories('Science', String.raw`
@early-science|Science Explorers|General Science|🌱|States of matter, plants, animals, the senses and forces for young scientists.
Solid|Matter with a fixed shape and volume, like ice or a rock.
Liquid|Matter with a fixed volume that takes the shape of its container, like water.
Gas|Matter that spreads out to fill its container, like steam or air.
Melting|A solid changing into a liquid when it is heated.
Freezing|A liquid changing into a solid when it is cooled.
Five senses|Sight, hearing, smell, taste and touch.
What plants need|Sunlight, water, air and nutrients from the soil.
Parts of a plant|Roots take in water, the stem holds the plant up, leaves make food and flowers make seeds.
Butterfly life cycle|Egg → caterpillar (larva) → chrysalis (pupa) → adult butterfly.
Mammal|An animal with hair or fur that feeds its babies milk (dog, whale, human).
Reptile|A cold-blooded animal with dry, scaly skin (snake, lizard, turtle).
Amphibian|An animal that lives in water when young and on land as an adult (frog, salamander).
Insect|An animal with six legs and three body parts (ant, bee, beetle).
Magnet|An object that pulls iron and steel; opposite poles attract and like poles repel.
Push and pull|A force is a push or a pull that can change how something moves.
Habitat|The place where a plant or animal lives and finds what it needs.

@chem-reactions|Chemical Reactions & Stoichiometry|Chemistry|⚗️|Balancing equations, reaction types, moles, solutions and gas laws.
Law of conservation of mass|Matter is not created or destroyed in a reaction, so a chemical equation must be balanced.
Coefficient|The number in front of a formula in a balanced equation; it tells how many units take part.
Synthesis reaction|A + B → AB
Decomposition reaction|AB → A + B
Single replacement reaction|A + BC → AC + B
Double replacement reaction|AB + CD → AD + CB
Combustion reaction|A fuel reacts with oxygen; a hydrocarbon burns to carbon dioxide and water.
Moles from mass|moles = mass ÷ molar mass
Particles from moles|particles = moles × 6.022 × 10²³
Molarity|M = moles of solute ÷ liters of solution
Ideal gas law|PV = nRT, with R = 0.0821 L·atm/(mol·K)
Boyle's law|P₁V₁ = P₂V₂ at constant temperature.
Charles's law|V₁/T₁ = V₂/T₂ at constant pressure, with T in kelvin (K = °C + 273).
Limiting reactant|The reactant that runs out first and limits how much product can form.
Exothermic reaction|Releases heat to the surroundings (ΔH < 0).
Endothermic reaction|Absorbs heat from the surroundings (ΔH > 0).
Catalyst|Speeds up a reaction by lowering the activation energy, without being used up.

@organic-chem|Organic Chemistry|Chemistry|🧪|Hydrocarbons, functional groups, naming and isomers (college, IB Chemistry HL).
Organic compound|A compound built on carbon, usually bonded to hydrogen.
Hydrocarbon|A compound made of only carbon and hydrogen.
Alkane|A hydrocarbon with only single C–C bonds; general formula CₙH₂ₙ₊₂ (methane, ethane, propane).
Alkene|A hydrocarbon with a C=C double bond; CₙH₂ₙ with one double bond.
Alkyne|A hydrocarbon with a C≡C triple bond; CₙH₂ₙ₋₂ with one triple bond.
Carbon-count prefixes|meth- 1, eth- 2, prop- 3, but- 4, pent- 5, hex- 6, hept- 7, oct- 8, non- 9, dec- 10.
Alcohol|Contains a hydroxyl group, –OH (ethanol).
Carboxylic acid|Contains a carboxyl group, –COOH (ethanoic acid, also called acetic acid).
Aldehyde|Contains –CHO at the end of a carbon chain.
Ketone|Contains a C=O group inside the carbon chain.
Ester|Contains –COO–; formed from a carboxylic acid and an alcohol; many smell fruity.
Amine|Contains an amino group, –NH₂.
Isomers|Compounds with the same molecular formula but different structures.
Addition reaction|Atoms add across a double or triple bond (typical of alkenes and alkynes).
Substitution reaction|One atom or group replaces another (typical of alkanes reacting with halogens).

@physics-waves|Waves, Electricity & Modern Physics|Physics|💡|Waves, sound, light, circuits, magnetism, photons and radioactivity.
Wave speed|v = fλ (frequency × wavelength).
Frequency|Waves per second, in hertz (Hz); f = 1 ÷ period.
Amplitude|The height of a wave from its rest position; larger amplitude means more energy.
Transverse wave|The medium moves perpendicular to the wave's direction (light, a wave on a string).
Longitudinal wave|The medium moves parallel to the wave's direction (sound).
Electromagnetic spectrum|Radio, microwave, infrared, visible light, ultraviolet, X-ray, gamma ray: lowest to highest frequency.
Reflection|A wave bounces off a surface; the angle of incidence equals the angle of reflection.
Refraction|A wave bends when it changes speed going into a new medium.
Series circuit|One path for current: total resistance R = R₁ + R₂ + …
Parallel circuit|Several paths: 1/R = 1/R₁ + 1/R₂ + …; each branch gets the full voltage.
Electric power|P = VI (watts).
Coulomb's law|F = kq₁q₂ ÷ r²; like charges repel and opposite charges attract.
Electromagnetic induction|A changing magnetic field produces a voltage in a conductor; this is how generators work.
Photon energy|E = hf, with Planck's constant h = 6.63 × 10⁻³⁴ J·s.
Half-life|The time it takes for half of a radioactive sample to decay.

@human-body|Human Body Systems|Biology|🫀|The organ systems of the human body and how they work together.
Circulatory system|The heart, blood and blood vessels; carries oxygen and nutrients around the body.
Respiratory system|The lungs and airways; take in oxygen and remove carbon dioxide.
Digestive system|Breaks food into nutrients the body can absorb (mouth, stomach, intestines).
Nervous system|The brain, spinal cord and nerves; send the signals that control the body.
Skeletal system|The bones that support and protect the body and make blood cells; adults have 206.
Muscular system|The muscles that move the body, working with the skeleton.
Immune system|Defends the body against germs (white blood cells, antibodies).
Endocrine system|Glands that release hormones, such as insulin and adrenaline.
Excretory system|The kidneys and bladder; remove liquid waste from the blood.
Integumentary system|The skin, hair and nails; protect the body and help control temperature.
Homeostasis|Keeping stable internal conditions, such as body temperature.
Artery|A blood vessel that carries blood away from the heart.
Vein|A blood vessel that carries blood back to the heart.
Alveoli|Tiny air sacs in the lungs where oxygen and carbon dioxide are exchanged.
Neuron|A nerve cell that sends electrical signals.

@env-science|Environmental Science|Earth Science|♻️|Ecosystems, biodiversity, populations, energy, pollution and climate (AP Environmental Science, IB ESS).
Biome|A large region with a similar climate and community of living things (desert, tundra, rainforest).
Biodiversity|The variety of life in an area: genetic, species and ecosystem diversity.
Keystone species|A species with an outsized effect on its ecosystem (sea otters, wolves).
Primary succession|An ecosystem developing on bare rock where there is no soil.
Secondary succession|An ecosystem recovering where soil remains, such as after a fire.
Renewable resource|A resource that is naturally replaced (solar, wind, water, timber).
Nonrenewable resource|A resource that is not replaced on a human timescale (coal, oil, natural gas).
Rule of 70|Doubling time (years) ≈ 70 ÷ growth rate (%).
Eutrophication|Excess nutrients cause algae blooms that use up the oxygen in water.
Biomagnification|Toxins become more concentrated at each higher level of a food chain.
Ozone layer|Ozone in the stratosphere that absorbs ultraviolet radiation; damaged by CFCs.
Tragedy of the commons|A shared resource gets overused when each person acts in their own interest.
Carbon cycle|Carbon moves among the atmosphere, oceans, living things and fossil fuels.
Sustainability|Meeting present needs without harming future generations' ability to meet theirs.

@astronomy|Astronomy & Space|Earth Science|🔭|The solar system, the Moon, stars, galaxies and the universe.
Solar system|The Sun and everything that orbits it.
Planets in order|Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.
Inner planets|Mercury, Venus, Earth and Mars: small and rocky.
Outer planets|Jupiter, Saturn, Uranus and Neptune: gas giants and ice giants.
Moon phases|New, waxing crescent, first quarter, waxing gibbous, full, waning gibbous, third quarter, waning crescent; about 29.5 days.
Solar eclipse|The Moon passes between the Sun and Earth and blocks the Sun.
Lunar eclipse|Earth passes between the Sun and the Moon, and Earth's shadow covers the Moon.
Tides|The rise and fall of sea level, caused mainly by the Moon's gravity.
Light-year|The distance light travels in one year, about 9.46 trillion km.
Star life cycle|Sun-like stars: nebula → main sequence → red giant → white dwarf. Massive stars end in a supernova → neutron star or black hole.
Galaxy|A huge system of stars, gas and dust; we live in the Milky Way.
Big Bang theory|The universe began about 13.8 billion years ago in a hot, dense state and has been expanding since.
`, [['General Science', 'first']]);

  /* ---------------- History & Social Studies ---------------- */
  Library.addCategories('History & Social Studies', String.raw`
@early-social-studies|Community & Map Skills|Social Studies Basics|🏘️|Communities, rules, needs and wants, goods and services, and reading maps.
Community|A group of people who live, work and play in the same area.
Citizen|A member of a community or country, with rights and responsibilities.
Rules and laws|Rules guide behavior at home and school; laws are rules made by a government.
Needs|Things people must have to live: food, water, clothing and shelter.
Wants|Things people would like to have but can live without.
Goods|Things people make or grow that can be bought and sold.
Services|Work people do for others, such as teaching or fixing cars.
Producer|A person who makes goods or provides services.
Consumer|A person who buys and uses goods and services.
Map key|The part of a map (also called the legend) that explains its symbols.
Compass rose|Shows the directions on a map: north, south, east and west.
Natural resource|Something from nature that people use, such as water, trees or soil.

@ancient-civilizations|Ancient Civilizations|History|🏺|Mesopotamia, Egypt, the Indus Valley, China, Greece and Rome.
Civilization|A complex society with cities, a government, writing and specialized jobs.
Mesopotamia|Between the Tigris and Euphrates rivers; cuneiform writing and the Code of Hammurabi.
Ancient Egypt|Along the Nile; ruled by pharaohs; hieroglyphics and pyramids.
Indus Valley civilization|Planned cities such as Harappa and Mohenjo-daro, with drainage systems.
Ancient China|Along the Huang He (Yellow River); ruled by dynasties under the Mandate of Heaven.
Ancient Greece|City-states such as Athens and Sparta; Athens developed democracy.
Roman Republic|Citizens elected leaders such as senators and consuls.
Roman Empire|Began in 27 BCE when Augustus became the first emperor.
Silk Road|Trade routes that linked China with the Mediterranean world.
Polytheism|Belief in many gods.
Monotheism|Belief in one god.

@european-history|European History|History|🏰|From the Renaissance to the European Union (AP European History).
Humanism|A Renaissance focus on human potential and the study of classical Greek and Roman texts.
Printing press|Gutenberg's movable-type press (about 1450) spread books and new ideas quickly.
Absolutism|A ruler holds total power, as Louis XIV did in France.
Glorious Revolution|1688: England's Parliament replaced James II and limited royal power with the English Bill of Rights.
Peace of Westphalia|1648 treaties that ended the Thirty Years' War and strengthened state sovereignty.
Napoleon Bonaparte|Became emperor of France in 1804; defeated at Waterloo in 1815.
Congress of Vienna|1814–1815 meeting that restored order and a balance of power after Napoleon.
Revolutions of 1848|A wave of liberal and nationalist revolutions across Europe.
Italian unification|The Kingdom of Italy was proclaimed in 1861.
German unification|The German Empire was proclaimed in 1871 under Prussian leadership (Bismarck).
Marshall Plan|U.S. aid program (from 1948) that helped rebuild Western Europe after World War II.
NATO|A military alliance founded in 1949 by the U.S., Canada and Western European countries.
European Union|Created by the Maastricht Treaty (signed 1992, in force 1993).

@psychology|Psychology|Behavioral Sciences|🧠|The brain, learning, memory, development and social behavior (AP Psychology, IB Psychology).
Neuron|A nerve cell that carries electrical and chemical signals.
Neurotransmitter|A chemical messenger between neurons, such as dopamine or serotonin.
Classical conditioning|Learning to link two stimuli, as in Pavlov's dogs salivating at a bell.
Operant conditioning|Learning from consequences: reinforcement makes a behavior more likely, punishment less likely (Skinner).
Positive reinforcement|Adding something pleasant to increase a behavior.
Negative reinforcement|Removing something unpleasant to increase a behavior.
Observational learning|Learning by watching others (Bandura's Bobo doll study).
Short-term memory|Holds a small amount of information (about 7 ± 2 items) for a short time.
Long-term memory|Stores information for a long time, with practically unlimited capacity.
Cognitive dissonance|Discomfort from holding conflicting beliefs or acting against one's beliefs.
Conformity|Changing behavior to match a group (Asch's line experiment).
Obedience|Following orders from an authority (Milgram's experiment).
Maslow's hierarchy of needs|Physiological, safety, love and belonging, esteem, self-actualization.
Piaget's stages|Sensorimotor (0–2), preoperational (2–7), concrete operational (7–11), formal operational (12+).
Independent and dependent variables|The researcher changes the independent variable and measures the dependent variable.
Placebo|A fake treatment used to compare against a real one.

@human-geography|Human Geography|Geography|🏙️|Population, migration, culture, cities and development (AP Human Geography, IB Geography).
Demographic transition model|Shows how birth and death rates change as a country develops, in five stages.
Crude birth rate|Births per 1,000 people per year.
Rate of natural increase|(crude birth rate − crude death rate) ÷ 10, as a percentage.
Push factor|Something that drives people to leave a place (war, poverty).
Pull factor|Something that attracts people to a place (jobs, safety).
Relocation diffusion|Ideas spread as people move to new places.
Expansion diffusion|Ideas spread outward from where they started, while staying there too.
Urbanization|The growth of cities as more people move from rural areas.
Primate city|A country's largest city, much bigger than the next largest.
Von Thünen model|Shows how farmland use changes with distance from a market.
Gravity model|Interaction between two places grows with their populations and shrinks with distance.
Supranational organization|A group of countries working together, such as the UN or EU.
Gerrymandering|Drawing electoral boundaries to favor one party.
Centripetal and centrifugal forces|Centripetal forces unite a country; centrifugal forces divide it.

@comparative-government|Comparative Government|Government|🌐|Political systems around the world (AP Comparative Government, IB Global Politics).
Regime|The fundamental rules and norms of how a country is governed.
Authoritarian regime|Power is held by a leader or small group without free elections or limits.
Parliamentary system|The executive (prime minister) comes from and answers to the legislature.
Presidential system|The president is elected separately from the legislature.
Federal system|Power is shared between national and regional governments.
Unitary system|Power is held by the central government.
Head of state vs head of government|The head of state is the symbolic leader; the head of government runs the government.
Proportional representation|Parties win seats in proportion to their share of the vote.
Single-member district|Each district elects one representative, usually by plurality.
Legitimacy|The people's belief that a government has the right to rule.
Sovereignty|A state's authority to govern itself without outside control.
Rule of law|Everyone, including leaders, must follow the law.

@macroeconomics|Macroeconomics|Economics|📈|GDP, unemployment, inflation, fiscal and monetary policy (AP Macroeconomics, IB Economics).
GDP (expenditure approach)|GDP = C + I + G + (X − M): consumption + investment + government spending + net exports.
Real vs nominal GDP|Nominal GDP uses current prices; real GDP adjusts for inflation.
Unemployment rate|Unemployed ÷ labor force × 100.
Inflation rate|(new CPI − old CPI) ÷ old CPI × 100.
Consumer price index (CPI)|Measures the average price of a basket of goods and services over time.
Business cycle|Expansion, peak, contraction (recession) and trough.
Fiscal policy|Government changes in spending and taxes to influence the economy.
Monetary policy|Central bank actions on interest rates and the money supply.
Spending multiplier|1 ÷ MPS, or 1 ÷ (1 − MPC).
Aggregate demand|Total spending on goods and services in an economy at each price level.
Aggregate supply|Total output producers supply at each price level.
Central bank|The bank that runs monetary policy, such as the Federal Reserve.
Exchange rate|The price of one currency in terms of another.

@microeconomics|Microeconomics|Economics|🛒|Supply and demand, elasticity, costs, market structures and market failure (AP Microeconomics, IB Economics).
Marginal analysis|Comparing the extra benefit and extra cost of one more unit.
Comparative advantage|Producing a good at a lower opportunity cost than others; the basis for trade.
Price elasticity of demand|%Δ quantity demanded ÷ %Δ price (use the absolute value).
Elastic demand|Elasticity greater than 1: buyers are very responsive to price.
Inelastic demand|Elasticity less than 1: buyers are not very responsive to price.
Total revenue|Price × quantity.
Profit|Total revenue − total cost.
Perfect competition|Many firms selling identical products; each firm is a price taker.
Monopoly|One firm with no close substitutes and high barriers to entry.
Oligopoly|A few large firms that depend on each other's decisions.
Monopolistic competition|Many firms selling similar but differentiated products.
Profit-maximizing rule|Produce where marginal revenue (MR) equals marginal cost (MC).
Price ceiling|A legal maximum price; below equilibrium it causes a shortage.
Price floor|A legal minimum price; above equilibrium it causes a surplus.
Externality|A cost or benefit that falls on people outside a transaction.
Public good|A good that is nonexcludable and nonrival, such as national defense.

@philosophy|Philosophy & Political Theory|Philosophy|🏛️|Major thinkers and ideas in ethics, knowledge and politics (college, IB Philosophy).
Socrates|Taught by questioning (the Socratic method); "the unexamined life is not worth living."
Plato|Socrates' student; the theory of Forms and the Republic, ruled by philosopher-kings.
Aristotle|Plato's student; virtue ethics and the "golden mean" between extremes.
Descartes|"I think, therefore I am"; founder of modern rationalism.
Empiricism|Knowledge comes from sensory experience (Locke, Hume).
Rationalism|Knowledge comes mainly from reason (Descartes, Leibniz).
Hobbes|Without government, life would be "nasty, brutish, and short"; argued for a strong sovereign.
Locke|Natural rights to life, liberty and property; government by consent of the governed.
Rousseau|The social contract and the "general will."
Kant|Deontology: act only on rules you could will to be universal laws (the categorical imperative).
Utilitarianism|The right action produces the greatest good for the greatest number (Bentham, Mill).
Marx|History as class struggle; critique of capitalism.
Existentialism|People create their own meaning through free choices (Sartre, de Beauvoir).
Social contract|The idea that government's authority comes from an agreement among the people.
`, [['Social Studies Basics', 'first'], ['Behavioral Sciences', 'last'], ['Philosophy', 'last']]);

  /* ---------------- English ---------------- */
  Library.addCategories('English', String.raw`
@early-reading|Phonics & Early Reading|Early Reading|🔤|Letters, vowels, syllables, rhymes and the basics of sentences.
Vowels|a, e, i, o and u (and sometimes y).
Consonants|All the letters that are not vowels.
Short vowel|A vowel sound like the a in cat or the i in sit.
Long vowel|A vowel that says its own name, like the a in cake.
Silent e|An e at the end of a word that makes the vowel before it long: cap → cape.
Syllable|A part of a word with one vowel sound: pen-cil has two syllables.
Rhyming words|Words that end with the same sound, like cat and hat.
Compound word|Two words joined to make a new word: sun + flower = sunflower.
Sight words|Common words learned by sight, such as the, and, said and was.
Capital letters|Used at the start of a sentence, for names and for the word I.
End punctuation|A period ends a statement, a question mark ends a question and an exclamation point shows strong feeling.
Alphabetical order|Putting words in the order of the alphabet by their first letter (then the next letter).

@rhetoric|Rhetoric & Argument|Rhetoric & Analysis|🎙️|Appeals, rhetorical choices and fallacies (AP English Language, IB Language and Literature).
Rhetorical situation|The speaker, audience, purpose, context and message.
Ethos|An appeal to the speaker's credibility or character.
Pathos|An appeal to the audience's emotions.
Logos|An appeal to logic and evidence.
Kairos|Using the right moment or timing to make an argument.
Concession|Admitting that part of the opposing view is valid.
Rebuttal|Answering and disproving an opposing argument.
Diction|The writer's word choice.
Syntax|The arrangement of words and sentences.
Anaphora|Repeating a word or phrase at the start of successive clauses ("We shall fight…").
Antithesis|Contrasting ideas placed side by side in parallel structure.
Rhetorical question|A question asked for effect, not for an answer.
Ad hominem|A fallacy that attacks the person instead of the argument.
Straw man|A fallacy that misrepresents an opponent's argument to make it easier to attack.
False dilemma|A fallacy that presents only two options when more exist.
Slippery slope|A fallacy claiming one step will lead to a chain of extreme results.
Bandwagon|A fallacy claiming something is right because many people believe it.

@poetry|Poetry & Literary Analysis|Rhetoric & Analysis|🪶|Poetic forms, meter, sound devices and literary analysis (AP English Literature, IB Literature).
Stanza|A group of lines in a poem, like a paragraph.
Couplet|Two lines, usually rhyming.
Quatrain|A stanza of four lines.
Rhyme scheme|The pattern of end rhymes, labeled with letters (ABAB).
Meter|The pattern of stressed and unstressed syllables in a line.
Iambic pentameter|Five iambs (da-DUM) per line: ten syllables.
Shakespearean sonnet|14 lines of iambic pentameter rhymed ABAB CDCD EFEF GG.
Petrarchan sonnet|14 lines: an octave (8) and a sestet (6), with a turn between them.
Haiku|A three-line Japanese form with 5, 7 and 5 syllables.
Free verse|Poetry without a regular rhyme or meter.
Blank verse|Unrhymed iambic pentameter.
Enjambment|A sentence that runs past the end of a line onto the next.
Caesura|A pause in the middle of a line.
Volta|The turn in thought in a poem, especially a sonnet.
Assonance|Repeated vowel sounds in nearby words.
Elegy|A poem mourning someone's death.
Ode|A poem praising a person, object or idea.
Tragic flaw|A hero's trait that leads to their downfall (hamartia).
Foil|A character who contrasts with another to highlight their traits.

@research-tok|Research, Seminar & Theory of Knowledge|Rhetoric & Analysis|🔍|Research skills and the IB core (Theory of Knowledge, Extended Essay, CAS) and AP Seminar/Research.
Research question|A focused question that an investigation sets out to answer.
Primary source|A first-hand record from the time or person studied (a diary, data you collected).
Secondary source|An analysis or interpretation of primary sources (a textbook, a review article).
Peer review|Experts check a study's quality before it is published.
Bias|A one-sided view that can distort evidence or conclusions.
Plagiarism|Presenting someone else's words or ideas as your own without credit.
Annotated bibliography|A list of sources, each with a short summary and evaluation.
Qualitative data|Descriptive information in words or categories.
Quantitative data|Numerical information that can be measured.
Correlation vs causation|Two things happening together does not prove that one causes the other.
Theory of Knowledge|The IB core course that asks how we know what we claim to know.
Knowledge question|An open question about knowledge itself, such as "How can we know when evidence is sufficient?"
Areas of knowledge|In TOK: history, the human sciences, the natural sciences, mathematics and the arts.
Extended Essay|The IB's independent research paper of up to 4,000 words.
CAS|Creativity, activity, service: the IB core's experiential learning requirement.
QUEST framework|AP Seminar's process: Question and explore, Understand and analyze, Evaluate multiple perspectives, Synthesize ideas, Team, transform and transmit.

@literary-theory|Literary Theory & Criticism|Literary Theory|📚|Critical lenses for reading literature (college English).
Formalism (New Criticism)|Close reading of the text itself: form, imagery, tension and irony, apart from the author's life.
Structuralism|Studies the underlying structures and patterns of language and narrative.
Deconstruction|Shows how a text's meanings contradict and undermine themselves (Derrida).
Reader-response criticism|Meaning is created by readers as they read.
Feminist criticism|Examines how texts represent gender and power.
Marxist criticism|Examines class, economics and power in texts.
Psychoanalytic criticism|Reads texts through unconscious desires and conflicts (Freud).
Postcolonial criticism|Examines colonialism, empire and identity in literature.
New Historicism|Reads a text alongside the history and culture of its time.
Ecocriticism|Studies how literature represents nature and the environment.
Intertextuality|How a text echoes or responds to other texts.
Canon|The works generally accepted as the most important in a literature.
`, [['Early Reading', 'first'], ['Rhetoric & Analysis', 'last'], ['Literary Theory', 'last']]);

  /* ---------------- World languages ---------------- */
  Library.addCategories('World Languages', String.raw`
@spanish-intermediate|Spanish: Past Tenses & More|Spanish|📚|Preterite, imperfect, future, gustar and the subjunctive (Spanish 2–4, AP Spanish, IB Spanish B).
Preterite|Completed past actions: Ayer comí pizza.
Imperfect|Ongoing, habitual or descriptive past: De niño, comía pizza.
Preterite -ar endings|-é, -aste, -ó, -amos, -asteis, -aron (hablé, hablaste, habló…)
Preterite -er/-ir endings|-í, -iste, -ió, -imos, -isteis, -ieron (comí, viví…)
Imperfect -ar endings|-aba, -abas, -aba, -ábamos, -abais, -aban
Imperfect -er/-ir endings|-ía, -ías, -ía, -íamos, -íais, -ían
Ser and ir in the preterite|fui, fuiste, fue, fuimos, fuisteis, fueron (same forms for both).
Future tense|Infinitive + -é, -ás, -á, -emos, -éis, -án: hablaré.
Gustar|Me gusta + one thing; me gustan + more than one: me gustan los libros.
Direct object pronouns|me, te, lo, la, nos, os, los, las
Subjunctive|Used after wishes, doubts and emotions: Espero que hables.

@first-words-spanish|First Words in Spanish|Spanish|🌈|Colors, numbers, animals and greetings for beginners.
Rojo|Red
Azul|Blue
Amarillo|Yellow
Verde|Green
Uno, dos, tres|One, two, three
Cuatro, cinco|Four, five
El perro|The dog
El gato|The cat
Hola|Hello
Adiós|Goodbye
Sí / No|Yes / No
Gracias|Thank you

@spanish-advanced|Spanish: Advanced Grammar|Spanish|🎓|Subjunctive, conditional, commands and perfect tenses (AP Spanish Language, IB Spanish B HL).
Present subjunctive|Formed from the yo form, dropping -o and adding opposite endings: hablar → hable; comer → coma.
WEIRDO triggers|Wishes, Emotions, Impersonal expressions, Recommendations, Doubt/denial, Ojalá: they take the subjunctive.
Conditional|Infinitive + -ía, -ías, -ía, -íamos, -íais, -ían: hablaría (I would speak).
Si clauses|Si + imperfect subjunctive, conditional: Si tuviera dinero, viajaría.
Present perfect|haber (he, has, ha, hemos, habéis, han) + past participle: he comido.
Past participle|-ar → -ado (hablado); -er/-ir → -ido (comido, vivido).
Affirmative tú commands|Use the él/ella present form: ¡Habla! ¡Come!
Negative tú commands|No + subjunctive tú form: ¡No hables!
Por vs para|Por: exchange, duration, cause, through. Para: purpose, destination, deadline, recipient.
Imperfect subjunctive|From the ellos preterite, drop -ron, add -ra endings: hablaron → hablara.

@german-basics|German Basics|German|🇩🇪|Greetings, everyday vocabulary and key verbs (German 1–2, AP German).
Hallo|Hello
Tschüss|Bye
Danke|Thank you
Bitte|Please / You're welcome
Articles|der (masculine), die (feminine), das (neuter); die is also the plural article.
Nouns|All German nouns are capitalized: der Hund, die Katze.
Sein|To be: ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie sind
Haben|To have: ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie haben
Verb position|In a statement, the verb comes second: Heute spiele ich Fußball.

@italian-basics|Italian Basics|Italian|🇮🇹|Greetings, everyday vocabulary and key verbs (Italian 1–2, AP Italian).
Ciao|Hi / Bye (informal)
Grazie|Thank you
Per favore|Please
Essere|To be: sono, sei, è, siamo, siete, sono
Avere|To have: ho, hai, ha, abbiamo, avete, hanno
Regular -are verbs (parlare)|parlo, parli, parla, parliamo, parlate, parlano
Gender|Most nouns ending in -o are masculine (il libro); most ending in -a are feminine (la casa).

@latin-basics|Latin Basics|Latin|🏛️|Vocabulary, cases, declensions and conjugations (Latin 1–2, AP Latin).
Cases|Nominative (subject), genitive (possession), dative (indirect object), accusative (direct object), ablative (by, with, from).
First declension|Mostly feminine nouns ending in -a: puella, puellae.
Second declension|Mostly masculine nouns in -us and neuter nouns in -um: amicus, bellum.
Esse (to be)|sum, es, est, sumus, estis, sunt
First conjugation (amare)|amo, amas, amat, amamus, amatis, amant
Veni, vidi, vici|"I came, I saw, I conquered" (Julius Caesar).
Carpe diem|"Seize the day" (Horace).

@chinese-basics|Chinese (Mandarin) Basics|Chinese|🇨🇳|Characters, pinyin, tones and everyday words (Chinese 1–2, AP Chinese, IB Mandarin).
Pinyin|The system that writes Chinese sounds with the Latin alphabet: nǐ hǎo.
Tones|Mandarin has four tones plus a neutral tone; the tone changes a word's meaning.
Characters|Chinese is written with characters (汉字 hànzì), each a syllable with meaning.
Measure words|Used between a number and a noun: 一个人 yí ge rén (one person).
Question particle 吗|Add 吗 (ma) to the end of a statement to make a yes/no question.
Word order|Subject–verb–object, like English: 我吃饭 (I eat rice).

@japanese-basics|Japanese Basics|Japanese|🇯🇵|Writing systems, particles and everyday words (Japanese 1–2, AP Japanese).
Hiragana|The basic Japanese syllable alphabet, used for native words and grammar endings.
Katakana|The syllable alphabet used mainly for foreign words: コーヒー (kōhī, coffee).
Kanji|Characters borrowed from Chinese that carry meaning.
Particle は (wa)|Marks the topic of a sentence.
Particle を (o)|Marks the direct object.
Particle の (no)|Shows possession: 私の本 (watashi no hon, my book).
Word order|Subject–object–verb: the verb comes last.
です (desu)|A polite "to be" at the end of a sentence.
`, [['German', 'last'], ['Italian', 'last'], ['Latin', 'last'], ['Chinese', 'last'], ['Japanese', 'last']]);

  /* ---------------- Computer science ---------------- */
  Library.addCategories('Computer Science', String.raw`
@digital-literacy|Digital Literacy & Computer Basics|Computing Basics|⌨️|Parts of a computer, the internet and staying safe online.
Hardware|The physical parts of a computer you can touch.
Software|Programs and apps that tell the computer what to do.
Input device|Sends information into a computer (keyboard, mouse, microphone).
Output device|Shows or plays information from a computer (monitor, printer, speakers).
CPU|The central processing unit: the "brain" that runs instructions.
Memory (RAM)|Short-term working memory, cleared when the power is off.
Storage|Keeps files when the power is off (hard drive, SSD, cloud).
Operating system|Software that runs the computer and other programs (Windows, macOS, Android).
Web browser|A program for visiting websites (Chrome, Safari, Firefox).
URL|A web address, such as https://www.example.com.
Strong password|Long, unique and hard to guess, mixing words, numbers and symbols.
Phishing|A fake message that tries to trick you into giving away passwords or information.
Digital footprint|The trail of information you leave online.
Cyberbullying|Bullying through phones, games or social media.

@cs-java|Java Programming|Computer Science|☕|Java syntax, types, strings, loops, classes and arrays (AP Computer Science A).
Primitive types|int (whole numbers), double (decimals), boolean (true/false).
Integer division|Dividing two ints drops the remainder: 7 / 2 is 3.
Modulus|% gives the remainder: 7 % 2 is 1.
Casting|(int) 3.9 is 3 (it truncates); (double) 7 / 2 is 3.5.
String methods|length(), substring(a, b) (characters a to b − 1), indexOf(str), equals(other).
== vs equals|== compares references for objects; use equals to compare String contents.
Class|A blueprint that defines an object's attributes (fields) and behaviors (methods).
Constructor|A special method that creates and initializes a new object.
Array|A fixed-size list: int[] a = new int[5]; its size is a.length.
ArrayList|A resizable list: add, get, set, remove, and size().
2D array|An array of arrays: grid[row][col].
Inheritance|A subclass extends a superclass and inherits its methods: class Dog extends Animal.
Recursion|A method that calls itself, with a base case that stops it.
Short-circuit evaluation|In a && b, b is skipped if a is false; in a || b, b is skipped if a is true.

@data-structures|Data Structures & Algorithms|Computer Science|🧱|Stacks, queues, trees, graphs, searching and sorting (college computer science).
Stack|Last in, first out (LIFO): push and pop at the top.
Queue|First in, first out (FIFO): enqueue at the back, dequeue at the front.
Linked list|Nodes that each store a value and a link to the next node.
Hash table|Stores key–value pairs with average O(1) lookup.
Binary tree|Each node has at most two children.
Binary search tree|Left subtree values are smaller and right subtree values are larger than the node.
Heap|A tree where each parent is ≥ (max-heap) or ≤ (min-heap) its children.
Graph|Vertices (nodes) connected by edges.
Linear search|Checks items one by one: O(n).
Binary search|Halves a sorted list each step: O(log n).
Bubble sort|Repeatedly swaps adjacent out-of-order items: O(n²).
Merge sort|Splits the list, sorts the halves and merges them: O(n log n).
Breadth-first search|Explores a graph level by level, using a queue.
Depth-first search|Explores as far as possible along each branch, using a stack or recursion.
Dynamic programming|Solves problems by storing answers to overlapping subproblems.

@internet-cybersecurity|The Internet & Cybersecurity|Computer Science|🔐|How the internet works, data, compression and security (AP Computer Science Principles).
Internet|A network of networks that communicate using shared protocols.
IP address|A unique number that identifies a device on a network.
Packet|A small chunk of data sent across the internet, routed on its own.
Router|A device that forwards packets toward their destination.
DNS|The Domain Name System turns names like example.com into IP addresses.
HTTP and HTTPS|Protocols for web pages; HTTPS is encrypted.
Bandwidth|The maximum amount of data that can be sent per second.
Fault tolerance|A system keeps working when parts fail, thanks to redundant paths.
Encryption|Scrambling data so only someone with the key can read it.
Public key encryption|Anyone can encrypt with the public key; only the private key can decrypt.
Multifactor authentication|Logging in with two or more kinds of proof (password + code).
Lossless compression|Shrinks data so it can be restored exactly (ZIP, PNG).
Lossy compression|Shrinks data by removing some detail permanently (JPEG, MP3).
Metadata|Data about data, such as a photo's date and location.
Digital divide|The gap between people who have access to technology and those who do not.
`, [['Computing Basics', 'first']]);

  /* ---------------- Arts & Music (new subject) ---------------- */
  Library.addSubject('Arts & Music', '🎨', ['Art & Music Basics', 'Music', 'Visual Arts'], String.raw`
@art-basics|Art & Music Basics|Art & Music Basics|🖍️|Colors, shapes, rhythm and instruments for young artists and musicians.
Primary colors|Red, yellow and blue: they can't be made by mixing other colors.
Secondary colors|Orange (red + yellow), green (yellow + blue) and purple (blue + red).
Warm colors|Red, orange and yellow: they feel warm and energetic.
Cool colors|Blue, green and purple: they feel calm and cool.
Shape|A flat, two-dimensional area such as a circle, square or triangle.
Pattern|A design that repeats.
Beat|The steady pulse you can clap along to in music.
Rhythm|The pattern of long and short sounds in music.
String instruments|Make sound with vibrating strings: violin, guitar, cello.
Woodwind instruments|Make sound by blowing across or through a reed: flute, clarinet, saxophone.
Brass instruments|Make sound by buzzing the lips into a mouthpiece: trumpet, trombone, tuba.
Percussion instruments|Make sound when struck or shaken: drums, xylophone, tambourine.

@music-theory|Music Theory|Music|🎼|Notes, rhythm, scales, key signatures and chords (middle school through AP Music Theory).
Staff|The five lines and four spaces on which music is written.
Treble clef|Lines E, G, B, D, F ("Every Good Boy Does Fine"); spaces F, A, C, E.
Bass clef|Lines G, B, D, F, A; spaces A, C, E, G.
Whole note|4 beats in 4/4 time.
Half note|2 beats in 4/4 time.
Quarter note|1 beat in 4/4 time.
Eighth note|½ beat in 4/4 time.
Time signature|Top number: beats per measure. Bottom number: which note gets one beat (4 = quarter note).
Sharp and flat|A sharp (♯) raises a note a half step; a flat (♭) lowers it a half step.
Major scale|Whole and half steps in the pattern W W H W W W H (C D E F G A B C).
Key signature|The sharps or flats at the start of each staff that set the key.
Octave|The interval between one note and the next note with the same name, eight notes up.
Major triad|A root, a major third and a perfect fifth (C–E–G).
Minor triad|A root, a minor third and a perfect fifth (A–C–E).
Dynamics|How loud or soft: p (piano) soft, f (forte) loud.
Tempo|How fast: largo is very slow, andante is walking speed, allegro is fast.

@art-history|Art History|Visual Arts|🖼️|Elements of art, major movements and famous works (AP Art History, IB Visual Arts).
Elements of art|Line, shape, form, color, value, texture and space.
Principles of design|Balance, contrast, emphasis, movement, pattern, rhythm and unity.
Renaissance|14th–16th century revival of classical ideas; linear perspective (Leonardo, Michelangelo, Raphael).
Baroque|17th century; drama, motion and strong light and dark (Caravaggio, Bernini, Rembrandt).
Impressionism|Late 1800s; light and color with quick brushstrokes (Monet, Renoir).
Post-Impressionism|Bolder color and form after Impressionism (Van Gogh, Cézanne, Gauguin).
Cubism|Objects shown from several viewpoints at once, in geometric shapes (Picasso, Braque).
Surrealism|Dreamlike, irrational images from the unconscious (Dalí, Magritte).
Abstract Expressionism|Large, gestural, nonrepresentational painting (Pollock, Rothko).
Pop Art|Images from popular culture and advertising (Warhol, Lichtenstein).
Chiaroscuro|Strong contrast between light and dark to model form.
Fresco|Painting on wet plaster so the paint becomes part of the wall.
Contrapposto|A pose with weight on one leg, giving a relaxed, natural stance.
`, 'Music theory and art history');

  /* ---------------- Grade bands: 0 Elementary · 1 Middle · 2 High school · 3 AP & IB · 4 College ---------------- */
  const BAND = {
    'early-math': 0, arithmetic: 0, fractions: 0,
    'decimals-percents': 1, 'integers-exponents': 1, ratios: 1, 'linear-equations': 1, 'geometry-area': 1, pythagorean: 1, angles: 1, volume: 1,
    'lines-slope': 2, systems: 2, polynomials: 2, quadratics: 2, 'exponents-logs': 2, functions: 2, 'alg2-ch2': 2, 'trig-unit-circle': 2, 'trig-right-triangles': 2, sequences: 2, 'complex-numbers': 2, statistics: 2,
    limits: 3, derivatives: 3, integrals: 3, series: 3, 'inferential-statistics': 3,
    multivariable: 4, 'linear-algebra': 4, 'differential-equations': 4, 'discrete-math': 4, 'number-theory': 4, 'abstract-algebra': 4, 'real-analysis': 4, 'complex-analysis': 4, topology: 4,
    'early-science': 0, 'earth-science': 1, astronomy: 1, 'bio-ecology': 1, 'human-body': 1,
    'bio-cells': 2, 'bio-genetics': 2, 'chem-basics': 2, 'physics-motion': 2, 'chem-reactions': 2, 'physics-waves': 2,
    'env-science': 3, 'organic-chem': 4,
    'early-social-studies': 0, geography: 1, 'ancient-civilizations': 1,
    'us-history': 2, 'world-history': 2, government: 2, economics: 2,
    'european-history': 3, psychology: 3, 'human-geography': 3, 'comparative-government': 3, macroeconomics: 3, microeconomics: 3,
    'early-reading': 0, 'word-roots': 1, grammar: 1, 'literary-devices': 1, 'reading-writing': 2,
    rhetoric: 3, poetry: 3, 'research-tok': 3,
    'first-words-spanish': 0, 'spanish-advanced': 3, philosophy: 4, 'literary-theory': 4, 'art-basics': 0,
    'spanish-basics': 1, 'french-basics': 1, 'german-basics': 1, 'italian-basics': 1, 'latin-basics': 1, 'chinese-basics': 1, 'japanese-basics': 1, 'spanish-intermediate': 2,
    'digital-literacy': 0, 'cs-basics': 2, 'cs-java': 3, 'internet-cybersecurity': 3, 'data-structures': 4,
    'music-theory': 1, 'art-history': 3
  };
  Library.categories.forEach((c) => { c.band = BAND[c.id] != null ? BAND[c.id] : 2; });
  // Early Math is the very first math topic, ahead of Arithmetic and Fractions at the same level.
  const cats = Library.categories, em = cats.findIndex((c) => c.id === 'early-math');
  if (em > 0) cats.unshift(cats.splice(em, 1)[0]);
  Library.BAND_OF = BAND;
})(typeof window !== 'undefined' ? window : globalThis);
