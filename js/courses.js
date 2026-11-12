/* AP and IB Diploma courses: each course's units (from the College Board course and exam
   descriptions and the IB subject guides) and the built-in topics that practice them.
   A course's practice quiz draws questions from its linked topics. */
(function (root) {
  'use strict';
  const C = [];
  const add = (program, id, name, subject, topics, units, note) => C.push({ id, program, name, subject, topics, units, note: note || '' });
  const LANG_THEMES = ['Families and Communities', 'Personal and Public Identities', 'Beauty and Aesthetics', 'Science and Technology', 'Contemporary Life', 'Global Challenges'];
  const IB_LANG_B = ['Identities', 'Experiences', 'Human ingenuity', 'Social organization', 'Sharing the planet'];

  /* ---------------- AP (College Board) ---------------- */
  add('AP', 'ap-precalculus', 'AP Precalculus', 'Math', ['functions', 'polynomials', 'exponents-logs', 'trig-unit-circle', 'trig-right-triangles', 'linear-algebra'],
    ['Polynomial and Rational Functions', 'Exponential and Logarithmic Functions', 'Trigonometric and Polar Functions', 'Functions Involving Parameters, Vectors, and Matrices']);
  add('AP', 'ap-calculus-ab', 'AP Calculus AB', 'Math', ['limits', 'derivatives', 'integrals', 'differential-equations'],
    ['Limits and Continuity', 'Differentiation: Definition and Fundamental Properties', 'Differentiation: Composite, Implicit, and Inverse Functions', 'Contextual Applications of Differentiation', 'Analytical Applications of Differentiation', 'Integration and Accumulation of Change', 'Differential Equations', 'Applications of Integration']);
  add('AP', 'ap-calculus-bc', 'AP Calculus BC', 'Math', ['limits', 'derivatives', 'integrals', 'differential-equations', 'series'],
    ['Limits and Continuity', 'Differentiation: Definition and Fundamental Properties', 'Differentiation: Composite, Implicit, and Inverse Functions', 'Contextual Applications of Differentiation', 'Analytical Applications of Differentiation', 'Integration and Accumulation of Change', 'Differential Equations', 'Applications of Integration', 'Parametric Equations, Polar Coordinates, and Vector-Valued Functions', 'Infinite Sequences and Series']);
  add('AP', 'ap-statistics', 'AP Statistics', 'Math', ['statistics', 'inferential-statistics'],
    ['Exploring One-Variable Data', 'Exploring Two-Variable Data', 'Collecting Data', 'Probability, Random Variables, and Probability Distributions', 'Sampling Distributions', 'Inference for Categorical Data: Proportions', 'Inference for Quantitative Data: Means', 'Inference for Categorical Data: Chi-Square', 'Inference for Quantitative Data: Slopes']);
  add('AP', 'ap-biology', 'AP Biology', 'Science', ['bio-cells', 'bio-genetics', 'bio-ecology', 'human-body'],
    ['Chemistry of Life', 'Cell Structure and Function', 'Cellular Energetics', 'Cell Communication and Cell Cycle', 'Heredity', 'Gene Expression and Regulation', 'Natural Selection', 'Ecology']);
  add('AP', 'ap-chemistry', 'AP Chemistry', 'Science', ['chem-basics', 'chem-reactions'],
    ['Atomic Structure and Properties', 'Compound Structure and Properties', 'Properties of Substances and Mixtures', 'Chemical Reactions', 'Kinetics', 'Thermochemistry', 'Equilibrium', 'Acids and Bases', 'Thermodynamics and Electrochemistry']);
  add('AP', 'ap-physics-1', 'AP Physics 1: Algebra-Based', 'Science', ['physics-motion'],
    ['Kinematics', 'Force and Translational Dynamics', 'Work, Energy, and Power', 'Linear Momentum', 'Torque and Rotational Dynamics', 'Energy and Momentum of Rotating Systems', 'Oscillations', 'Fluids']);
  add('AP', 'ap-physics-2', 'AP Physics 2: Algebra-Based', 'Science', ['physics-waves', 'physics-motion'],
    ['Thermodynamics', 'Electric Force, Field, and Potential', 'Electric Circuits', 'Magnetism and Electromagnetism', 'Geometric Optics', 'Waves, Sound, and Physical Optics', 'Modern Physics']);
  add('AP', 'ap-physics-c-mech', 'AP Physics C: Mechanics', 'Science', ['physics-motion', 'derivatives', 'integrals'],
    ['Kinematics', 'Force and Translational Dynamics', 'Work, Energy, and Power', 'Linear Momentum', 'Torque and Rotational Dynamics', 'Energy and Momentum of Rotating Systems', 'Oscillations']);
  add('AP', 'ap-physics-c-em', 'AP Physics C: Electricity and Magnetism', 'Science', ['physics-waves', 'integrals', 'multivariable'],
    ['Electric Charges, Fields, and Gauss\'s Law', 'Electric Potential', 'Conductors and Capacitors', 'Electric Circuits', 'Magnetic Fields and Electromagnetism', 'Electromagnetic Induction']);
  add('AP', 'ap-environmental-science', 'AP Environmental Science', 'Science', ['env-science', 'bio-ecology', 'earth-science'],
    ['The Living World: Ecosystems', 'The Living World: Biodiversity', 'Populations', 'Earth Systems and Resources', 'Land and Water Use', 'Energy Resources and Consumption', 'Atmospheric Pollution', 'Aquatic and Terrestrial Pollution', 'Global Change']);
  add('AP', 'ap-us-history', 'AP United States History', 'History & Social Studies', ['us-history'],
    ['Period 1: 1491–1607', 'Period 2: 1607–1754', 'Period 3: 1754–1800', 'Period 4: 1800–1848', 'Period 5: 1844–1877', 'Period 6: 1865–1898', 'Period 7: 1890–1945', 'Period 8: 1945–1980', 'Period 9: 1980–Present']);
  add('AP', 'ap-world-history', 'AP World History: Modern', 'History & Social Studies', ['world-history', 'geography'],
    ['The Global Tapestry (c. 1200–1450)', 'Networks of Exchange (c. 1200–1450)', 'Land-Based Empires (c. 1450–1750)', 'Transoceanic Interconnections (c. 1450–1750)', 'Revolutions (c. 1750–1900)', 'Consequences of Industrialization (c. 1750–1900)', 'Global Conflict (c. 1900–present)', 'Cold War and Decolonization (c. 1900–present)', 'Globalization (c. 1900–present)']);
  add('AP', 'ap-european-history', 'AP European History', 'History & Social Studies', ['european-history', 'world-history'],
    ['Renaissance and Exploration', 'Age of Reformation', 'Absolutism and Constitutionalism', 'Scientific, Philosophical, and Political Developments', 'Conflict, Crisis, and Reaction in the Late 18th Century', 'Industrialization and Its Effects', '19th-Century Perspectives and Political Developments', '20th-Century Global Conflicts', 'Cold War and Contemporary Europe']);
  add('AP', 'ap-us-government', 'AP United States Government and Politics', 'History & Social Studies', ['government'],
    ['Foundations of American Democracy', 'Interactions Among Branches of Government', 'Civil Liberties and Civil Rights', 'American Political Ideologies and Beliefs', 'Political Participation']);
  add('AP', 'ap-comparative-government', 'AP Comparative Government and Politics', 'History & Social Studies', ['comparative-government'],
    ['Political Systems, Regimes, and Governments', 'Political Institutions', 'Political Culture and Participation', 'Party and Electoral Systems and Citizen Organizations', 'Political and Economic Changes and Development'], 'Countries studied: United Kingdom, Mexico, Russia, China, Iran and Nigeria.');
  add('AP', 'ap-human-geography', 'AP Human Geography', 'History & Social Studies', ['human-geography', 'geography'],
    ['Thinking Geographically', 'Population and Migration Patterns and Processes', 'Cultural Patterns and Processes', 'Political Patterns and Processes', 'Agriculture and Rural Land-Use Patterns and Processes', 'Cities and Urban Land-Use Patterns and Processes', 'Industrial and Economic Development Patterns and Processes']);
  add('AP', 'ap-macroeconomics', 'AP Macroeconomics', 'History & Social Studies', ['macroeconomics', 'economics'],
    ['Basic Economic Concepts', 'Economic Indicators and the Business Cycle', 'National Income and Price Determination', 'Financial Sector', 'Long-Run Consequences of Stabilization Policies', 'Open Economy: International Trade and Finance']);
  add('AP', 'ap-microeconomics', 'AP Microeconomics', 'History & Social Studies', ['microeconomics', 'economics'],
    ['Basic Economic Concepts', 'Supply and Demand', 'Production, Cost, and the Perfect Competition Model', 'Imperfect Competition', 'Factor Markets', 'Market Failure and the Role of Government']);
  add('AP', 'ap-psychology', 'AP Psychology', 'History & Social Studies', ['psychology'],
    ['Biological Bases of Behavior', 'Cognition', 'Development and Learning', 'Social Psychology and Personality', 'Mental and Physical Health']);
  add('AP', 'ap-african-american-studies', 'AP African American Studies', 'History & Social Studies', ['us-history'],
    ['Origins of the African Diaspora', 'Freedom, Enslavement, and Resistance', 'The Practice of Freedom', 'Movements and Debates']);
  add('AP', 'ap-english-language', 'AP English Language and Composition', 'English', ['rhetoric', 'reading-writing', 'grammar'],
    ['Rhetorical situation: exigence, purpose, audience, context', 'Claims and evidence', 'Reasoning and organization', 'Style: diction, syntax and rhetorical choices', 'Synthesis essay', 'Rhetorical analysis essay', 'Argument essay']);
  add('AP', 'ap-english-literature', 'AP English Literature and Composition', 'English', ['poetry', 'literary-devices', 'reading-writing'],
    ['Short Fiction', 'Poetry', 'Longer Fiction or Drama', 'Big ideas: character, setting, structure, narration, figurative language, literary argumentation', 'Poetry analysis essay', 'Prose fiction analysis essay', 'Literary argument essay']);
  add('AP', 'ap-seminar', 'AP Seminar', 'English', ['research-tok', 'rhetoric'],
    ['Question and Explore', 'Understand and Analyze', 'Evaluate Multiple Perspectives', 'Synthesize Ideas', 'Team, Transform, and Transmit'], 'The QUEST framework; assessed by a team project, an individual research essay and presentation, and an end-of-course exam.');
  add('AP', 'ap-research', 'AP Research', 'English', ['research-tok', 'inferential-statistics'],
    ['Choosing a topic and research question', 'Literature review', 'Research methods', 'Analyzing and interpreting evidence', 'Academic paper (4,000–5,000 words)', 'Presentation and oral defense']);
  add('AP', 'ap-computer-science-a', 'AP Computer Science A', 'Computer Science', ['cs-java', 'cs-basics', 'data-structures'],
    ['Using Objects and Methods', 'Selection and Iteration', 'Class Creation', 'Data Collections']);
  add('AP', 'ap-computer-science-principles', 'AP Computer Science Principles', 'Computer Science', ['internet-cybersecurity', 'cs-basics'],
    ['Creative Development', 'Data', 'Algorithms and Programming', 'Computer Systems and Networks', 'Impact of Computing']);
  add('AP', 'ap-spanish-language', 'AP Spanish Language and Culture', 'World Languages', ['spanish-advanced', 'spanish-intermediate', 'spanish-basics'], LANG_THEMES);
  add('AP', 'ap-french-language', 'AP French Language and Culture', 'World Languages', ['french-basics'], LANG_THEMES);
  add('AP', 'ap-german-language', 'AP German Language and Culture', 'World Languages', ['german-basics'], LANG_THEMES);
  add('AP', 'ap-italian-language', 'AP Italian Language and Culture', 'World Languages', ['italian-basics'], LANG_THEMES);
  add('AP', 'ap-chinese-language', 'AP Chinese Language and Culture', 'World Languages', ['chinese-basics'], LANG_THEMES);
  add('AP', 'ap-japanese-language', 'AP Japanese Language and Culture', 'World Languages', ['japanese-basics'], LANG_THEMES);
  add('AP', 'ap-latin', 'AP Latin', 'World Languages', ['latin-basics'], ['Vergil, Aeneid (selections)', 'Caesar, De Bello Gallico (selections)', 'Translation, comprehension and analysis']);
  add('AP', 'ap-art-history', 'AP Art History', 'Arts & Music', ['art-history'],
    ['Global Prehistory', 'Ancient Mediterranean', 'Early Europe and Colonial Americas', 'Later Europe and Americas', 'Indigenous Americas', 'Africa', 'West and Central Asia', 'South, East, and Southeast Asia', 'The Pacific', 'Global Contemporary']);
  add('AP', 'ap-music-theory', 'AP Music Theory', 'Arts & Music', ['music-theory'],
    ['Music Fundamentals I: Pitch, Major Scales and Key Signatures, Rhythm, Meter, and Expressive Elements', 'Music Fundamentals II: Minor Scales and Key Signatures, Melody, Timbre, and Texture', 'Music Fundamentals III: Triads and Seventh Chords', 'Harmony and Voice Leading I: Chord Function, Cadence, and Phrase', 'Harmony and Voice Leading II: Chord Progressions and Predominant Function', 'Harmony and Voice Leading III: Embellishments, Motives, and Melodic Devices', 'Harmony and Voice Leading IV: Secondary Function', 'Modes and Form']);

  /* ---------------- IB Diploma Programme ---------------- */
  add('IB', 'ib-math-aa', 'IB Mathematics: Analysis and Approaches (SL/HL)', 'Math', ['functions', 'exponents-logs', 'sequences', 'trig-unit-circle', 'statistics', 'inferential-statistics', 'limits', 'derivatives', 'integrals', 'complex-numbers', 'series'],
    ['Number and algebra', 'Functions', 'Geometry and trigonometry', 'Statistics and probability', 'Calculus'], 'HL adds complex numbers, proof, vectors, further calculus and Maclaurin series.');
  add('IB', 'ib-math-ai', 'IB Mathematics: Applications and Interpretation (SL/HL)', 'Math', ['functions', 'statistics', 'inferential-statistics', 'geometry-area', 'derivatives', 'integrals', 'linear-algebra', 'differential-equations'],
    ['Number and algebra', 'Functions', 'Geometry and trigonometry', 'Statistics and probability', 'Calculus'], 'HL adds matrices, graph theory, further statistics and differential equations.');
  add('IB', 'ib-biology', 'IB Biology (SL/HL)', 'Science', ['bio-cells', 'bio-genetics', 'bio-ecology', 'human-body'],
    ['Unity and diversity', 'Form and function', 'Interaction and interdependence', 'Continuity and change']);
  add('IB', 'ib-chemistry', 'IB Chemistry (SL/HL)', 'Science', ['chem-basics', 'chem-reactions', 'organic-chem'],
    ['Structure 1: Models of the particulate nature of matter', 'Structure 2: Models of bonding and structure', 'Structure 3: Classification of matter', 'Reactivity 1: What drives chemical reactions?', 'Reactivity 2: How much, how fast and how far?', 'Reactivity 3: What are the mechanisms of chemical change?']);
  add('IB', 'ib-physics', 'IB Physics (SL/HL)', 'Science', ['physics-motion', 'physics-waves', 'astronomy'],
    ['A. Space, time and motion', 'B. The particulate nature of matter', 'C. Wave behaviour', 'D. Fields', 'E. Nuclear and quantum physics']);
  add('IB', 'ib-ess', 'IB Environmental Systems and Societies', 'Science', ['env-science', 'bio-ecology', 'earth-science'],
    ['Foundation', 'Ecology', 'Biodiversity and conservation', 'Water', 'Land', 'Atmosphere and climate change', 'Natural resources', 'Human populations and urban systems']);
  add('IB', 'ib-computer-science', 'IB Computer Science (SL/HL)', 'Computer Science', ['cs-basics', 'cs-java', 'data-structures', 'internet-cybersecurity'],
    ['A1 Computer fundamentals', 'A2 Networks', 'A3 Databases', 'A4 Machine learning', 'B1 Computational thinking', 'B2 Programming', 'B3 Object-oriented programming', 'B4 Abstract data types (HL)']);
  add('IB', 'ib-history', 'IB History (SL/HL)', 'History & Social Studies', ['world-history', 'european-history', 'us-history'],
    ['Prescribed subjects (e.g. military leaders, the move to global war, rights and protest)', 'World history topics (e.g. causes and effects of 20th-century wars, authoritarian states, the Cold War)', 'HL regional options (Africa and the Middle East, the Americas, Asia and Oceania, Europe)']);
  add('IB', 'ib-economics', 'IB Economics (SL/HL)', 'History & Social Studies', ['microeconomics', 'macroeconomics', 'economics'],
    ['Introduction to economics', 'Microeconomics', 'Macroeconomics', 'The global economy']);
  add('IB', 'ib-geography', 'IB Geography (SL/HL)', 'History & Social Studies', ['human-geography', 'geography', 'env-science'],
    ['Changing population', 'Global climate: vulnerability and resilience', 'Global resource consumption and security', 'Geographic themes (options)', 'HL: Geographic perspectives, global change']);
  add('IB', 'ib-psychology', 'IB Psychology (SL/HL)', 'History & Social Studies', ['psychology', 'research-tok'],
    ['Biological approach', 'Cognitive approach', 'Sociocultural approach', 'Research methods', 'Applications: health and well-being, human development, human relationships, learning and cognition']);
  add('IB', 'ib-global-politics', 'IB Global Politics (SL/HL)', 'History & Social Studies', ['comparative-government', 'government'],
    ['Power, sovereignty and international relations', 'Human rights', 'Development', 'Peace and conflict']);
  add('IB', 'ib-philosophy', 'IB Philosophy (SL/HL)', 'History & Social Studies', ['philosophy'],
    ['Core theme: being human', 'Optional themes (e.g. ethics, political philosophy, epistemology)', 'Prescribed philosophical text', 'HL: exploring philosophical activity']);
  add('IB', 'ib-lang-lit', 'IB English A: Language and Literature (SL/HL)', 'English', ['rhetoric', 'literary-devices', 'reading-writing'],
    ['Readers, writers and texts', 'Time and space', 'Intertextuality: connecting texts']);
  add('IB', 'ib-literature', 'IB English A: Literature (SL/HL)', 'English', ['poetry', 'literary-devices', 'literary-theory'],
    ['Readers, writers and texts', 'Time and space', 'Intertextuality: connecting texts']);
  add('IB', 'ib-spanish-b', 'IB Spanish B (SL/HL)', 'World Languages', ['spanish-advanced', 'spanish-intermediate'], IB_LANG_B);
  add('IB', 'ib-french-b', 'IB French B (SL/HL)', 'World Languages', ['french-basics'], IB_LANG_B);
  add('IB', 'ib-german-b', 'IB German B (SL/HL)', 'World Languages', ['german-basics'], IB_LANG_B);
  add('IB', 'ib-mandarin-b', 'IB Mandarin B (SL/HL)', 'World Languages', ['chinese-basics'], IB_LANG_B);
  add('IB', 'ib-ab-initio', 'IB Language ab initio (Spanish, French, Mandarin, …)', 'World Languages', ['spanish-basics', 'french-basics', 'chinese-basics'], IB_LANG_B, 'For students starting a new language.');
  add('IB', 'ib-visual-arts', 'IB Visual Arts (SL/HL)', 'Arts & Music', ['art-history', 'art-basics'], ['Art-making inquiries portfolio', 'Connections study', 'Visual arts process portfolio', 'Exhibition']);
  add('IB', 'ib-music', 'IB Music (SL/HL)', 'Arts & Music', ['music-theory'], ['Exploring music in context', 'Experimenting with music', 'Presenting music', 'HL: the contemporary music maker']);
  add('IB', 'ib-tok', 'IB Theory of Knowledge (core)', 'English', ['research-tok', 'philosophy'],
    ['Core theme: knowledge and the knower', 'Optional themes: technology, language, politics, religion, indigenous societies', 'Areas of knowledge: history, the human sciences, the natural sciences, mathematics, the arts', 'TOK exhibition', 'TOK essay (1,600 words)']);
  add('IB', 'ib-extended-essay', 'IB Extended Essay (core)', 'English', ['research-tok'],
    ['Choosing a subject and research question', 'Research and reflection (three reflection sessions)', 'Writing the essay (up to 4,000 words)', 'Assessment criteria: framework, knowledge and understanding, analysis, discussion and evaluation, engagement']);

  root.MSG = root.MSG || {};
  root.MSG.Courses = {
    list: C,
    get(id) { return C.find((c) => c.id === id); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
