/* Practice-question generators for the non-math subjects (see js/library-subjects.js).
   Same question shapes as js/generators.js; added to the same MSG.Generators.G table. */
(function (root) {
  'use strict';
  const U = root.MSG.U;
  const { G, helpers } = root.MSG.Generators;
  const { num, mc, m, fmtNum } = helpers;
  const { ri, pick, shuffle } = U;
  const others = (list, correct, key) => list.filter((x) => (key ? x[key] : x) !== correct).map((x) => (key ? x[key] : x));
  const sub = (formula) => formula.replace(/(\d+)/g, (d) => d.split('').map((c) => '₀₁₂₃₄₅₆₇₈₉'[c]).join(''));

  /* ---------- Biology ---------- */
  function punnett(p1, p2) {
    const kids = [];
    for (const a of p1) for (const b of p2) kids.push([a, b].sort().join('')); // 'A' sorts before 'a'
    return kids;
  }
  G['bio-genetics'] = [
    () => {
      const geno = ['AA', 'Aa', 'aa'];
      const p1 = pick(geno), p2 = pick(geno);
      const kids = punnett(p1, p2);
      const ask = pick(['recessive', 'dominant', 'heterozygous']);
      const count = kids.filter((k) => (ask === 'recessive' ? k === 'aa' : ask === 'dominant' ? k !== 'aa' : k === 'Aa')).length;
      const what = ask === 'recessive' ? 'shows the recessive trait (aa)' : ask === 'dominant' ? 'shows the dominant trait (AA or Aa)' : 'is heterozygous (Aa)';
      return num(`Two parents with genotypes ${p1} and ${p2} have a child. What is the probability that the child ${what}? (fraction ok)`, count / 4,
        `The Punnett square gives ${kids.join(', ')}: ${count} of 4 boxes.`, { display: fmtNum(count / 4) });
    },
    () => {
      const items = [['AA', 'Homozygous dominant'], ['aa', 'Homozygous recessive'], ['Aa', 'Heterozygous'], ['BB', 'Homozygous dominant'], ['Bb', 'Heterozygous'], ['bb', 'Homozygous recessive']];
      const [g, a] = pick(items);
      return mc(`What kind of genotype is ${g}?`, a, ['Homozygous dominant', 'Homozygous recessive', 'Heterozygous'], 'Two identical letters = homozygous; one capital and one lowercase = heterozygous.');
    },
    () => {
      const items = [['Makes two identical body cells', 'Mitosis'], ['Makes four sex cells with half the chromosomes', 'Meiosis'], ['Used for growth and repair of the body', 'Mitosis'], ['Produces sperm and egg cells', 'Meiosis']];
      const [d, a] = pick(items);
      return mc(`Which type of cell division: ${d}?`, a, ['Mitosis', 'Meiosis'], 'Mitosis copies body cells; meiosis makes gametes with half the chromosomes.');
    }
  ];
  G['bio-ecology'] = [
    () => {
      const e = pick([1000, 5000, 10000, 20000, 50000]), k = ri(1, 3);
      const names = ['', 'primary consumers', 'secondary consumers', 'tertiary consumers'];
      return num(`Producers in a food chain store ${e} kcal of energy. About how much energy reaches the ${names[k]}? (kcal)`, e / Math.pow(10, k),
        `About 10% passes to each level: ${e} × 0.1${k > 1 ? '^' + k : ''}.`);
    },
    () => {
      const items = [['Clownfish and sea anemone: both are protected and fed', 'Mutualism'], ['A tick feeding on a dog', 'Parasitism'], ['Barnacles riding on a whale, which is unaffected', 'Commensalism'],
        ['Bees pollinating flowers while getting nectar', 'Mutualism'], ['A tapeworm living in a person\'s intestine', 'Parasitism'], ['A bird nesting in a tree, which is unaffected', 'Commensalism']];
      const [d, a] = pick(items);
      return mc(`What kind of relationship is this? ${d}.`, a, ['Mutualism', 'Commensalism', 'Parasitism'], 'Both benefit = mutualism; one benefits, other unaffected = commensalism; one benefits, other harmed = parasitism.');
    },
    () => {
      const items = [['Grass', 'Producer'], ['Mushroom breaking down a log', 'Decomposer'], ['Rabbit eating grass', 'Consumer'], ['Oak tree', 'Producer'], ['Bacteria breaking down dead leaves', 'Decomposer'], ['Hawk eating a snake', 'Consumer'], ['Algae', 'Producer']];
      const [d, a] = pick(items);
      return mc(`What role does this play in an ecosystem? ${d}.`, a, ['Producer', 'Consumer', 'Decomposer'], 'Producers make food, consumers eat other organisms, decomposers break down dead matter.');
    },
    () => {
      const items = [['Sunlight', 'Abiotic'], ['Temperature', 'Abiotic'], ['Water', 'Abiotic'], ['Soil minerals', 'Abiotic'], ['Fungi', 'Biotic'], ['Deer', 'Biotic'], ['Bacteria', 'Biotic'], ['Grass', 'Biotic']];
      const [d, a] = pick(items);
      return mc(`Is this a biotic or abiotic factor? ${d}.`, a, ['Biotic', 'Abiotic'], 'Biotic = living; abiotic = nonliving.');
    }
  ];
  G['bio-cells'] = [
    () => {
      const items = [['Controls the cell and holds DNA', 'Nucleus'], ['Releases energy from food', 'Mitochondria'], ['Builds proteins', 'Ribosome'], ['Packages and ships proteins', 'Golgi apparatus'],
        ['Controls what enters and leaves the cell', 'Cell membrane'], ['Where photosynthesis happens', 'Chloroplast'], ['Gives plant cells a rigid shape', 'Cell wall'], ['Stores water and waste', 'Vacuole']];
      const [d, a] = pick(items);
      return mc(`Which part of the cell does this? ${d}.`, a, others(items, a, 1), 'See the Cells reference sheet.');
    },
    () => {
      const items = [['Water moves into a raisin soaked in water', 'Osmosis'], ['Perfume spreads across a room', 'Diffusion'], ['A cell pumps ions in, using ATP, against the gradient', 'Active transport'], ['Oxygen moves from the lungs into the blood', 'Diffusion']];
      const [d, a] = pick(items);
      return mc(`Which process is this? ${d}.`, a, ['Diffusion', 'Osmosis', 'Active transport'], 'Osmosis is diffusion of water; active transport uses energy.');
    },
    () => {
      const items = [['Bacteria', 'Prokaryote'], ['Human skin cell', 'Eukaryote'], ['Plant leaf cell', 'Eukaryote'], ['Yeast (a fungus)', 'Eukaryote'], ['Archaea', 'Prokaryote']];
      const [d, a] = pick(items);
      return mc(`Is this a prokaryote or a eukaryote? ${d}.`, a, ['Prokaryote', 'Eukaryote'], 'Prokaryotes have no nucleus; eukaryotes do.');
    }
  ];

  /* ---------- Chemistry ---------- */
  const ELEMENTS = [ // name, symbol, atomic number, atomic mass
    ['Hydrogen', 'H', 1, 1.008], ['Helium', 'He', 2, 4.003], ['Lithium', 'Li', 3, 6.94], ['Carbon', 'C', 6, 12.011], ['Nitrogen', 'N', 7, 14.007], ['Oxygen', 'O', 8, 15.999],
    ['Fluorine', 'F', 9, 18.998], ['Neon', 'Ne', 10, 20.180], ['Sodium', 'Na', 11, 22.990], ['Magnesium', 'Mg', 12, 24.305], ['Aluminum', 'Al', 13, 26.982], ['Silicon', 'Si', 14, 28.085],
    ['Phosphorus', 'P', 15, 30.974], ['Sulfur', 'S', 16, 32.06], ['Chlorine', 'Cl', 17, 35.45], ['Argon', 'Ar', 18, 39.948], ['Potassium', 'K', 19, 39.098], ['Calcium', 'Ca', 20, 40.078],
    ['Iron', 'Fe', 26, 55.845], ['Nickel', 'Ni', 28, 58.693], ['Copper', 'Cu', 29, 63.546], ['Zinc', 'Zn', 30, 65.38], ['Silver', 'Ag', 47, 107.868], ['Tin', 'Sn', 50, 118.71],
    ['Iodine', 'I', 53, 126.904], ['Gold', 'Au', 79, 196.967], ['Mercury', 'Hg', 80, 200.59], ['Lead', 'Pb', 82, 207.2], ['Uranium', 'U', 92, 238.029]
  ];
  const BY_SYM = Object.fromEntries(ELEMENTS.map((e) => [e[1], e]));
  function molarMass(formula) {
    let total = 0;
    formula.replace(/([A-Z][a-z]?)(\d*)/g, (_, s, n) => { total += BY_SYM[s][3] * (n ? Number(n) : 1); return ''; });
    return total;
  }
  G['chem-basics'] = [
    () => {
      const e = pick(ELEMENTS);
      return Math.random() < 0.5
        ? mc(`What is the chemical symbol for ${e[0]}?`, e[1], shuffle(others(ELEMENTS, e[1], 1)).slice(0, 6), `${e[0]} = ${e[1]} (atomic number ${e[2]}).`)
        : mc(`Which element has the symbol ${e[1]}?`, e[0], shuffle(others(ELEMENTS, e[0], 0)).slice(0, 6), `${e[1]} = ${e[0]}.`);
    },
    () => {
      const e = pick(ELEMENTS.filter((x) => x[2] > 1)), A = Math.round(e[3]) + pick([0, 0, 1, 2]);
      const ask = pick(['protons', 'neutrons', 'electrons']);
      const v = ask === 'neutrons' ? A - e[2] : e[2];
      return num(`A neutral atom of ${e[0]}-${A} has atomic number ${e[2]}. How many ${ask} does it have?`, v,
        ask === 'neutrons' ? `Neutrons = mass number − atomic number = ${A} − ${e[2]}.` : `A neutral atom has as many ${ask} as its atomic number.`);
    },
    () => {
      const ions = [['Na', 11, 1], ['K', 19, 1], ['Mg', 12, 2], ['Ca', 20, 2], ['Al', 13, 3], ['Cl', 17, -1], ['F', 9, -1], ['O', 8, -2], ['S', 16, -2]];
      const [s, z, c] = pick(ions);
      const charge = (Math.abs(c) > 1 ? Math.abs(c) : '') + (c > 0 ? '⁺' : '⁻');
      return num(`How many electrons does the ion ${s}${charge.replace(/\d/, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d])} have? (atomic number ${z})`, z - c,
        `${c > 0 ? 'It lost' : 'It gained'} ${Math.abs(c)} electron${Math.abs(c) > 1 ? 's' : ''}: ${z} ${c > 0 ? '−' : '+'} ${Math.abs(c)} = ${z - c}.`);
    },
    () => {
      const f = pick(['H2O', 'CO2', 'NaCl', 'CH4', 'NH3', 'O2', 'C6H12O6', 'CaCO3', 'H2SO4', 'KCl', 'MgO', 'NaOH', 'HCl', 'N2']);
      const v = molarMass(f);
      return num(`What is the molar mass of ${sub(f)} in g/mol? (round to 1 decimal place)`, Math.round(v * 10) / 10,
        'Add the atomic masses of every atom in the formula.', { tol: 0.11, display: (Math.round(v * 10) / 10).toFixed(1) + ' g/mol' });
    },
    () => {
      const ph = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
      return mc(`A solution has a pH of ${ph}. It is…`, ph < 7 ? 'Acidic' : ph === 7 ? 'Neutral' : 'Basic', ['Acidic', 'Neutral', 'Basic'], 'Below 7 = acidic, 7 = neutral, above 7 = basic.');
    },
    () => {
      const items = [['NaCl', 'Ionic'], ['KBr', 'Ionic'], ['MgO', 'Ionic'], ['CaCl2', 'Ionic'], ['H2O', 'Covalent'], ['CO2', 'Covalent'], ['CH4', 'Covalent'], ['NH3', 'Covalent'], ['O2', 'Covalent']];
      const [f, a] = pick(items);
      return mc(`What kind of bond holds ${sub(f)} together?`, a, ['Ionic', 'Covalent'], 'Metal + nonmetal = ionic (electrons transferred); nonmetals only = covalent (electrons shared).');
    }
  ];

  /* ---------- Physics ---------- */
  G['physics-motion'] = [
    () => { const v = ri(2, 30), t = ri(2, 20); return num(`A car travels ${v * t} m in ${t} s. What is its average speed in m/s?`, v, 'v = d ÷ t'); },
    () => { const a = ri(1, 9), t = ri(2, 10), vi = ri(0, 10); return num(`A bike speeds up from ${vi} m/s to ${vi + a * t} m/s in ${t} s. What is its acceleration in m/s²?`, a, 'a = (final − initial velocity) ÷ time'); },
    () => { const mm = ri(2, 50), a = ri(1, 12); return num(`What force (N) accelerates a ${mm} kg object at ${a} m/s²?`, mm * a, 'F = ma'); },
    () => { const mm = ri(2, 100); const w = Math.round(mm * 98) / 10; return num(`What is the weight of a ${mm} kg object on Earth, in newtons? (g = 9.8 m/s²)`, w, 'W = mg', { tol: 0.11, display: String(w) }); },
    () => { const mm = ri(1, 20) * 2, v = ri(1, 12); return num(`What is the kinetic energy (J) of a ${mm} kg object moving at ${v} m/s?`, 0.5 * mm * v * v, 'KE = ½mv²'); },
    () => { const mm = ri(1, 20), h = ri(1, 30); const pe = Math.round(mm * 98 * h) / 10; return num(`What is the potential energy (J) of a ${mm} kg object ${h} m above the ground? (g = 9.8 m/s²)`, pe, 'PE = mgh', { tol: 0.11, display: String(pe) }); },
    () => { const f = ri(5, 100), d = ri(2, 20); return num(`How much work (J) is done pushing a box with ${f} N of force for ${d} m?`, f * d, 'W = Fd'); },
    () => { const p = ri(2, 50), t = ri(2, 20); return num(`A motor does ${p * t} J of work in ${t} s. What is its power in watts?`, p, 'P = W ÷ t'); },
    () => { const mm = ri(1, 80), v = ri(1, 20); return num(`What is the momentum (kg·m/s) of a ${mm} kg object moving at ${v} m/s?`, mm * v, 'p = mv'); },
    () => {
      const i = ri(1, 10), r = ri(2, 50);
      return Math.random() < 0.5 ? num(`A current of ${i} A flows through a ${r} Ω resistor. What is the voltage (V)?`, i * r, 'V = IR')
        : num(`A ${i * r} V battery is connected to a ${r} Ω resistor. What is the current (A)?`, i, 'I = V ÷ R');
    },
    () => {
      const items = [['A book stays on a table until someone pushes it', "Newton's first law"], ['A rocket pushes gas down and the gas pushes the rocket up', "Newton's third law"],
        ['A heavier cart needs more force to speed up at the same rate', "Newton's second law"], ['Passengers lurch forward when a bus stops suddenly', "Newton's first law"], ['A swimmer pushes the wall backward and moves forward', "Newton's third law"]];
      const [d, a] = pick(items);
      return mc(`Which law explains this? ${d}.`, a, ["Newton's first law", "Newton's second law", "Newton's third law"], 'First: inertia. Second: F = ma. Third: equal and opposite forces.');
    }
  ];

  /* ---------- Earth science ---------- */
  G['earth-science'] = [
    () => {
      const items = [['Lava cools quickly on Earth\'s surface', 'Igneous'], ['Layers of sand are pressed and cemented together', 'Sedimentary'], ['Limestone is changed into marble by heat and pressure', 'Metamorphic'],
        ['Magma cools slowly underground, forming granite', 'Igneous'], ['Shells and mud harden into limestone', 'Sedimentary'], ['Shale is changed into slate by pressure', 'Metamorphic']];
      const [d, a] = pick(items);
      return mc(`What type of rock forms this way? ${d}.`, a, ['Igneous', 'Sedimentary', 'Metamorphic'], 'Igneous from melted rock, sedimentary from layers, metamorphic from heat and pressure.');
    },
    () => {
      const items = [['The Mid-Atlantic Ridge, where plates move apart', 'Divergent'], ['The Himalayas, where India pushes into Asia', 'Convergent'], ['The San Andreas Fault, where plates slide past each other', 'Transform'],
        ['The Andes and a deep ocean trench, where an ocean plate sinks under a continent', 'Convergent'], ['The East African Rift, where the land is pulling apart', 'Divergent']];
      const [d, a] = pick(items);
      return mc(`What kind of plate boundary is this? ${d}.`, a, ['Convergent', 'Divergent', 'Transform'], 'Together = convergent, apart = divergent, sliding past = transform.');
    },
    () => {
      const items = [['Water vapor cools and forms clouds', 'Condensation'], ['Rain, snow or hail falls from clouds', 'Precipitation'], ['The Sun heats water into vapor', 'Evaporation'], ['Plants release water vapor from their leaves', 'Transpiration']];
      const [d, a] = pick(items);
      return mc(`Which step of the water cycle is this? ${d}.`, a, ['Evaporation', 'Condensation', 'Precipitation', 'Transpiration'], 'See the water cycle on the reference sheet.');
    },
    () => mc('What causes Earth\'s seasons?', 'The tilt of Earth\'s axis', ['Earth\'s distance from the Sun', 'The Moon\'s gravity', 'Changes in the Sun\'s temperature'], 'The 23.5° tilt changes how directly sunlight hits each hemisphere.'),
    () => {
      const items = [['Rock breaks into pieces when water freezes in its cracks', 'Weathering'], ['A river carries soil downstream', 'Erosion'], ['Sand settles at the mouth of a river, forming a delta', 'Deposition'], ['Wind blows sand across a desert', 'Erosion']];
      const [d, a] = pick(items);
      return mc(`Which process is this? ${d}.`, a, ['Weathering', 'Erosion', 'Deposition'], 'Weathering breaks rock, erosion moves it, deposition drops it.');
    }
  ];

  /* ---------- History ---------- */
  function yearQuestions(events) {
    return [
      () => {
        const [e, y] = pick(events);
        const near = shuffle([y - 1, y + 1, y - 2, y + 3, y - 10, y + 10, y - 5, y + 4].filter((v) => v > 0)).slice(0, 3);
        return mc(`In what year: ${e}?`, String(y), near.map(String), `${e}: ${y}.`);
      },
      () => {
        let a, b;
        do { a = pick(events); b = pick(events); } while (a[1] === b[1]);
        const first = a[1] < b[1] ? a : b;
        return mc(`Which happened first?`, first[0], [a[0], b[0]], `${a[0]}: ${a[1]}. ${b[0]}: ${b[1]}.`);
      }
    ];
  }
  G['us-history'] = yearQuestions([
    ['The Declaration of Independence was adopted', 1776], ['The Constitution was signed', 1787], ['The Bill of Rights was ratified', 1791], ['The Louisiana Purchase', 1803],
    ['The War of 1812 began', 1812], ['The Civil War began', 1861], ['The Emancipation Proclamation was issued', 1863], ['The 13th Amendment abolished slavery', 1865],
    ['The 19th Amendment gave women the right to vote', 1920], ['The stock market crashed, starting the Great Depression', 1929], ['Japan attacked Pearl Harbor', 1941],
    ['Brown v. Board of Education was decided', 1954], ['The Civil Rights Act was signed', 1964], ['Apollo 11 landed on the Moon', 1969]
  ]);
  G['world-history'] = yearQuestions([
    ['The Magna Carta was signed', 1215], ['Columbus reached the Americas', 1492], ['Martin Luther posted his 95 Theses', 1517], ['The French Revolution began', 1789],
    ['World War I began', 1914], ['The Russian Revolution', 1917], ['World War I ended', 1918], ['The Treaty of Versailles was signed', 1919], ['World War II began', 1939],
    ['World War II ended', 1945], ['The United Nations was founded', 1945], ['The Berlin Wall fell', 1989], ['The Soviet Union dissolved', 1991]
  ].filter((x, i, arr) => arr.findIndex((y) => y[1] === x[1]) === i));

  /* ---------- Government ---------- */
  G.government = [
    () => {
      const facts = [['How many senators does each state have?', 2], ['How many members are in the U.S. Senate?', 100], ['How many voting members are in the House of Representatives?', 435],
        ['How many justices sit on the Supreme Court?', 9], ['How many years is a senator\'s term?', 6], ['How many years is a representative\'s term?', 2], ['How many years is a presidential term?', 4],
        ['How many amendments does the Constitution have?', 27], ['How many electoral votes does a candidate need to win the presidency?', 270], ['How many amendments make up the Bill of Rights?', 10]];
      const [q, a] = pick(facts);
      return num(q, a, 'See the Government & Civics reference sheet.');
    },
    () => {
      const items = [['Makes laws', 'Legislative'], ['Can veto a bill', 'Executive'], ['Can declare a law unconstitutional', 'Judicial'], ['Confirms Supreme Court justices (the Senate)', 'Legislative'],
        ['Appoints federal judges', 'Executive'], ['Commander in chief of the military', 'Executive'], ['Can override a veto with a two-thirds vote', 'Legislative'], ['Interprets the meaning of laws', 'Judicial']];
      const [d, a] = pick(items);
      return mc(`Which branch of government? ${d}.`, a, ['Legislative', 'Executive', 'Judicial'], 'Legislative = Congress, executive = the President, judicial = the courts.');
    },
    () => {
      const free = ['Religion', 'Speech', 'Press', 'Assembly', 'Petition'];
      const not = ['To bear arms (2nd Amendment)', 'A speedy trial (6th Amendment)', 'To vote at 18 (26th Amendment)', 'Against unreasonable searches (4th Amendment)'];
      const right = pick(free);
      return mc('Which freedom is protected by the First Amendment?', right, shuffle(not).slice(0, 3), 'The First Amendment protects religion, speech, press, assembly and petition.');
    }
  ];

  /* ---------- Geography ---------- */
  const CAPITALS = [ // country, capital, continent
    ['France', 'Paris', 'Europe'], ['Germany', 'Berlin', 'Europe'], ['Italy', 'Rome', 'Europe'], ['Spain', 'Madrid', 'Europe'], ['United Kingdom', 'London', 'Europe'], ['Ireland', 'Dublin', 'Europe'],
    ['Portugal', 'Lisbon', 'Europe'], ['Greece', 'Athens', 'Europe'], ['Poland', 'Warsaw', 'Europe'], ['Sweden', 'Stockholm', 'Europe'], ['Norway', 'Oslo', 'Europe'], ['Ukraine', 'Kyiv', 'Europe'],
    ['Japan', 'Tokyo', 'Asia'], ['China', 'Beijing', 'Asia'], ['India', 'New Delhi', 'Asia'], ['South Korea', 'Seoul', 'Asia'], ['Thailand', 'Bangkok', 'Asia'],
    ['Vietnam', 'Hanoi', 'Asia'], ['Philippines', 'Manila', 'Asia'], ['Pakistan', 'Islamabad', 'Asia'], ['Saudi Arabia', 'Riyadh', 'Asia'], ['Iran', 'Tehran', 'Asia'], 
    ['Egypt', 'Cairo', 'Africa'], ['Kenya', 'Nairobi', 'Africa'], ['Nigeria', 'Abuja', 'Africa'], ['Ethiopia', 'Addis Ababa', 'Africa'], ['Ghana', 'Accra', 'Africa'], ['Morocco', 'Rabat', 'Africa'],
    ['Canada', 'Ottawa', 'North America'], ['Mexico', 'Mexico City', 'North America'], ['United States', 'Washington, D.C.', 'North America'], ['Cuba', 'Havana', 'North America'],
    ['Brazil', 'Brasília', 'South America'], ['Argentina', 'Buenos Aires', 'South America'], ['Peru', 'Lima', 'South America'], ['Chile', 'Santiago', 'South America'], ['Colombia', 'Bogotá', 'South America'],
    ['Australia', 'Canberra', 'Australia & Oceania'], ['New Zealand', 'Wellington', 'Australia & Oceania']
  ];
  G.geography = [
    () => { const c = pick(CAPITALS); return mc(`What is the capital of ${c[0]}?`, c[1], shuffle(others(CAPITALS, c[1], 1)).slice(0, 8), `The capital of ${c[0]} is ${c[1]}.`); },
    () => { const c = pick(CAPITALS); return mc(`${c[1]} is the capital of which country?`, c[0], shuffle(others(CAPITALS, c[0], 0)).slice(0, 8), `${c[1]} is the capital of ${c[0]}.`); },
    () => { const c = pick(CAPITALS); return mc(`On which continent is ${c[0]}?`, c[2], ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Australia & Oceania'], `${c[0]} is in ${c[2]}.`); },
    () => {
      const items = [['0° latitude', 'Equator'], ['0° longitude', 'Prime meridian'], ['Lines that measure distance north or south of the equator', 'Latitude'], ['Lines that measure distance east or west of the prime meridian', 'Longitude']];
      const [d, a] = pick(items);
      return mc(`What is this? ${d}.`, a, ['Equator', 'Prime meridian', 'Latitude', 'Longitude'], 'Latitude runs east–west and measures north–south; longitude the opposite.');
    },
    () => mc('Which is the largest ocean?', 'Pacific', ['Atlantic', 'Indian', 'Arctic', 'Southern'], 'The Pacific is the largest; the Arctic is the smallest.')
  ];

  /* ---------- Economics ---------- */
  G.economics = [
    () => { const p = pick([500, 1000, 2000, 2500, 5000]), r = pick([2, 3, 4, 5, 6, 8]), t = ri(1, 6); return num(`How much simple interest is earned on ${p} dollars at ${r}% per year for ${t} years? (in dollars)`, p * r / 100 * t, `I = P × r × t = ${p} × ${r / 100} × ${t}`); },
    () => { const old = ri(2, 40) * 5, pct = pick([10, 20, 25, 50, -10, -20, -25]); const nw = old * (1 + pct / 100); return num(`A price goes from ${old} to ${nw} dollars. What is the percent change? (negative for a decrease)`, pct, '(new − old) ÷ old × 100'); },
    () => {
      const items = [['The price of concert tickets goes up. What happens to the quantity demanded?', 'It goes down'], ['The price of a good goes down. What happens to the quantity demanded?', 'It goes up'],
        ['The price of a good goes up. What happens to the quantity supplied?', 'It goes up'], ['The price of a good goes down. What happens to the quantity supplied?', 'It goes down']];
      const [q, a] = pick(items);
      return mc(q, a, ['It goes up', 'It goes down', 'It stays the same'], 'Law of demand: price and quantity demanded move in opposite directions. Law of supply: price and quantity supplied move together.');
    },
    () => {
      const items = [['You spend Saturday studying instead of working a shift that pays 60 dollars.', 'The 60 dollars you could have earned'], ['A city uses a park to build a parking lot.', 'The park and its uses'],
        ['You buy a video game instead of saving the money for a bike.', 'Getting closer to buying the bike']];
      const [q, a] = pick(items);
      return mc(`${q} What is the opportunity cost?`, a, others(items, a, 1).concat(['Nothing; there is no cost']), 'Opportunity cost = the next-best choice you give up.');
    }
  ];

  /* ---------- English ---------- */
  G.grammar = [
    () => {
      const items = [['She **quickly** finished her homework.', 'Adverb'], ['The **tall** girl won the race.', 'Adjective'], ['My **dog** barks at night.', 'Noun'], ['They **ran** to the bus stop.', 'Verb'],
        ['**He** forgot his lunch.', 'Pronoun'], ['The book is **under** the bed.', 'Preposition'], ['I wanted pizza, **but** we had tacos.', 'Conjunction'], ['**Wow**, that was amazing!', 'Interjection'],
        ['**Happiness** matters.', 'Noun'], ['The soup smells **delicious**.', 'Adjective'], ['We walked **through** the park.', 'Preposition'], ['She sings **beautifully**.', 'Adverb'],
        ['**They** are coming tomorrow.', 'Pronoun'], ['The game ended **very** late.', 'Adverb'], ['I stayed home **because** I was sick.', 'Conjunction'], ['The baby **is** sleepy.', 'Verb']];
      const [s, a] = pick(items);
      return mc(`What part of speech is the bold word? ${s}`, a, ['Noun', 'Pronoun', 'Verb', 'Adjective', 'Adverb', 'Preposition', 'Conjunction', 'Interjection'], 'See the parts of speech on the reference sheet.');
    },
    () => {
      const items = [['Because the bus was late.', 'Fragment'], ['I love pizza it is my favorite food.', 'Run-on sentence'], ['The dog chased the ball.', 'Complete sentence'], ['I was tired, I went to bed.', 'Comma splice'],
        ['Running through the park on a sunny day.', 'Fragment'], ['She studied hard, so she passed the test.', 'Complete sentence'], ['The movie ended we went home.', 'Run-on sentence'], ['It was cold, we wore coats.', 'Comma splice']];
      const [s, a] = pick(items);
      return mc(`What is this? "${s}"`, a, ['Complete sentence', 'Fragment', 'Run-on sentence', 'Comma splice'], 'A complete sentence has a subject, a verb and a complete thought, with clauses joined correctly.');
    }
  ];
  G['literary-devices'] = [
    () => {
      const items = [['The classroom was a zoo.', 'Metaphor'], ['Her smile was as bright as the sun.', 'Simile'], ['The leaves danced in the wind.', 'Personification'], ["I'm so hungry I could eat a horse.", 'Hyperbole'],
        ['Sally sells seashells by the seashore.', 'Alliteration'], ['The bacon sizzled in the pan.', 'Onomatopoeia'], ['A fire station burns down.', 'Situational irony'],
        ['The audience knows the villain is hiding in the closet, but the hero opens the door.', 'Dramatic irony'], ['"Oh, great, another rainy day," she groaned.', 'Verbal irony'],
        ['He was a real Romeo with the ladies.', 'Allusion'], ['It was an open secret.', 'Oxymoron'], ['Life is like a box of chocolates.', 'Simile'], ['The old car coughed and wheezed up the hill.', 'Personification'],
        ['This backpack weighs a ton.', 'Hyperbole'], ['The thunder went boom.', 'Onomatopoeia']];
      const [s, a] = pick(items);
      return mc(`Which literary device is this? "${s}"`, a, others(items, a, 1), 'See the Literary Devices reference sheet.');
    }
  ];
  G['reading-writing'] = [
    () => {
      const items = [['Characters and setting are introduced.', 'Exposition'], ['Problems arise and tension builds.', 'Rising action'], ['The turning point and moment of greatest tension.', 'Climax'],
        ['Events wind down after the turning point.', 'Falling action'], ['The conflict is settled.', 'Resolution']];
      const [d, a] = pick(items);
      return mc(`Which part of the plot? ${d}`, a, ['Exposition', 'Rising action', 'Climax', 'Falling action', 'Resolution'], 'Plot order: exposition → rising action → climax → falling action → resolution.');
    },
    () => {
      const items = [['I couldn\'t believe my eyes when I opened the door.', 'First person'], ['She walked into the room, unaware of what waited for her.', 'Third person'],
        ['You walk into the room and see a letter on the table.', 'Second person'], ['We packed our bags and left before sunrise.', 'First person'], ['He wondered if anyone would notice he was gone.', 'Third person']];
      const [s, a] = pick(items);
      return mc(`What point of view is this? "${s}"`, a, ['First person', 'Second person', 'Third person'], 'First = I/we, second = you, third = he/she/they.');
    },
    () => {
      const items = [['The writer\'s main argument', 'Claim'], ['Facts, quotes or data that support the argument', 'Evidence'], ['An opposing argument the writer answers', 'Counterclaim'], ['One sentence stating the main point of an essay', 'Thesis statement']];
      const [d, a] = pick(items);
      return mc(`What is this called? ${d}.`, a, ['Claim', 'Evidence', 'Counterclaim', 'Thesis statement'], 'See the Reading & Writing Skills reference sheet.');
    }
  ];
  G['word-roots'] = [
    () => {
      const items = [['biology', 'bio', 'life'], ['geography', 'geo', 'earth'], ['autograph', 'graph', 'write'], ['telescope', 'tele', 'far'], ['photograph', 'photo', 'light'], ['chronological', 'chron', 'time'],
        ['portable', 'port', 'carry'], ['manuscript', 'script', 'write'], ['predict', 'dict', 'say'], ['audience', 'aud', 'hear'], ['vision', 'vis', 'see'], ['microscope', 'micro', 'small'],
        ['preview', 'pre-', 'before'], ['antibiotic', 'anti-', 'against'], ['submarine', 'sub-', 'under'], ['international', 'inter-', 'between'], ['transatlantic', 'trans-', 'across'], ['fearless', '-less', 'without']];
      const [w, r, mean] = pick(items);
      return mc(`In the word "${w}", what does "${r}" mean?`, mean, Array.from(new Set(others(items, mean, 2))), `"${r}" means ${mean}.`);
    }
  ];

  /* ---------- World languages ---------- */
  function vocabQuestions(list, lang) {
    return [
      () => { const [w, e] = pick(list); return mc(`What does "${w}" mean in English?`, e, shuffle(others(list, e, 1)).slice(0, 6), `${w} = ${e}.`); },
      () => { const [w, e] = pick(list); return mc(`How do you say "${e}" in ${lang}?`, w, shuffle(others(list, w, 0)).slice(0, 6), `${e} = ${w}.`); }
    ];
  }
  const ES_VOCAB = [['el perro', 'the dog'], ['el gato', 'the cat'], ['la casa', 'the house'], ['el libro', 'the book'], ['la escuela', 'the school'], ['el agua', 'the water'], ['la comida', 'the food'],
    ['el amigo', 'the friend'], ['la familia', 'the family'], ['el día', 'the day'], ['la noche', 'the night'], ['hoy', 'today'], ['mañana', 'tomorrow'], ['ayer', 'yesterday'], ['rojo', 'red'], ['azul', 'blue'],
    ['verde', 'green'], ['amarillo', 'yellow'], ['grande', 'big'], ['pequeño', 'small'], ['feliz', 'happy'], ['triste', 'sad'], ['comer', 'to eat'], ['beber', 'to drink'], ['hablar', 'to speak'],
    ['vivir', 'to live'], ['escribir', 'to write'], ['leer', 'to read'], ['dormir', 'to sleep'], ['el hermano', 'the brother'], ['la madre', 'the mother'], ['el padre', 'the father'], ['diez', 'ten']];
  const ES_PRON = ['yo', 'tú', 'él / ella / usted', 'nosotros', 'vosotros', 'ellos / ellas / ustedes'];
  const ES_END = { ar: ['o', 'as', 'a', 'amos', 'áis', 'an'], er: ['o', 'es', 'e', 'emos', 'éis', 'en'], ir: ['o', 'es', 'e', 'imos', 'ís', 'en'] };
  const ES_VERBS = [['hablar', 'to speak'], ['estudiar', 'to study'], ['trabajar', 'to work'], ['caminar', 'to walk'], ['bailar', 'to dance'], ['cantar', 'to sing'], ['escuchar', 'to listen'],
    ['comer', 'to eat'], ['beber', 'to drink'], ['correr', 'to run'], ['aprender', 'to learn'], ['vender', 'to sell'], ['vivir', 'to live'], ['escribir', 'to write'], ['abrir', 'to open'], ['recibir', 'to receive']];
  G['spanish-basics'] = vocabQuestions(ES_VOCAB, 'Spanish').concat([
    () => {
      const [v, eng] = pick(ES_VERBS), stem = v.slice(0, -2), cls = v.slice(-2), i = ri(0, 5);
      const forms = ES_END[cls].map((e) => stem + e);
      const wrongCls = cls === 'ar' ? 'er' : 'ar';
      return mc(`Conjugate "${v}" (${eng}) for ${ES_PRON[i]}.`, forms[i], forms.filter((f, j) => j !== i).concat([stem + ES_END[wrongCls][i]]), `Regular -${cls} endings: ${ES_END[cls].join(', ')}.`);
    },
    () => {
      const items = [['Yo ___ de México.', 'soy', 'origin uses ser'], ['Ella ___ en la escuela.', 'está', 'location uses estar'], ['Nosotros ___ cansados.', 'estamos', 'feelings use estar'],
        ['Mi padre ___ doctor.', 'es', 'professions use ser'], ['¿Cómo ___ tú?', 'estás', 'how someone feels uses estar'], ['Ellos ___ altos.', 'son', 'permanent traits use ser'], ['Hoy ___ lunes.', 'es', 'days and dates use ser']];
      const [s, a, why] = pick(items);
      return mc(`Fill in the blank with ser or estar: ${s}`, a, ['soy', 'es', 'son', 'somos', 'estoy', 'está', 'están', 'estamos', 'estás', 'eres'], `"${a}": ${why}.`);
    }
  ]);
  const FR_VOCAB = [['le chien', 'the dog'], ['le chat', 'the cat'], ['la maison', 'the house'], ['le livre', 'the book'], ["l'école", 'the school'], ["l'eau", 'the water'], ["l'ami", 'the friend'],
    ['la famille', 'the family'], ['le jour', 'the day'], ['la nuit', 'the night'], ["aujourd'hui", 'today'], ['demain', 'tomorrow'], ['hier', 'yesterday'], ['rouge', 'red'], ['bleu', 'blue'], ['vert', 'green'],
    ['jaune', 'yellow'], ['grand', 'big'], ['petit', 'small'], ['heureux', 'happy'], ['triste', 'sad'], ['manger', 'to eat'], ['boire', 'to drink'], ['parler', 'to speak'], ['lire', 'to read'],
    ['écrire', 'to write'], ['dormir', 'to sleep'], ['le frère', 'the brother'], ['la mère', 'the mother'], ['le père', 'the father'], ['dix', 'ten']];
  const FR_PRON = ['je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'];
  const FR_END = ['e', 'es', 'e', 'ons', 'ez', 'ent'];
  const FR_VERBS = [['parler', 'to speak'], ['aimer', 'to like, to love'], ['regarder', 'to watch'], ['jouer', 'to play'], ['écouter', 'to listen'], ['danser', 'to dance'], ['chanter', 'to sing'], ['travailler', 'to work']];
  G['french-basics'] = vocabQuestions(FR_VOCAB, 'French').concat([
    () => {
      const [v, eng] = pick(FR_VERBS), stem = v.slice(0, -2), i = ri(0, 5);
      const forms = FR_END.map((e) => stem + e);
      const pron = i === 0 && /^[aeiouéh]/.test(v) ? "je (j')" : FR_PRON[i];
      return mc(`Conjugate "${v}" (${eng}) for ${pron}.`, forms[i], Array.from(new Set(forms.filter((f, j) => j !== i && f !== forms[i]).concat([stem + 'er', stem + 'ent', stem + 'ons']))).filter((f) => f !== forms[i]),
        `Regular -er endings: ${FR_END.join(', ')}.`);
    },
    () => {
      const etre = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'], avoir = ['ai', 'as', 'a', 'avons', 'avez', 'ont'];
      const useEtre = Math.random() < 0.5, i = ri(0, 5), forms = useEtre ? etre : avoir;
      const pron = !useEtre && i === 0 ? "je (j')" : FR_PRON[i];
      return mc(`Conjugate "${useEtre ? 'être' : 'avoir'}" for ${pron}.`, forms[i], forms.filter((f, j) => j !== i).concat(useEtre ? avoir.slice(0, 2) : etre.slice(0, 2)).filter((f) => f !== forms[i]),
        `${useEtre ? 'être' : 'avoir'}: ${forms.join(', ')}.`);
    }
  ]);

  // Shared with js/generators-more.js.
  root.MSG.SubjectKit = { yearQuestions, vocabQuestions, molarMass, sub, others };

  /* ---------- Computer science ---------- */
  G['cs-basics'] = [
    () => { const v = ri(1, 255); return num(`Convert binary ${v.toString(2)} to decimal.`, v, 'Add the place values (1, 2, 4, 8, …) where there is a 1.'); },
    () => { const v = ri(2, 64); return mc(`Convert ${v} to binary.`, v.toString(2), [(v + 1).toString(2), (v ^ 2).toString(2), (v - 1).toString(2), (v << 1).toString(2)], 'Divide by 2 repeatedly and read the remainders from bottom to top.'); },
    () => { const b = pick([1, 2, 4, 8, 16, 32, 64]); return num(`How many bits are in ${b} byte${b > 1 ? 's' : ''}?`, b * 8, '1 byte = 8 bits.'); },
    () => {
      const A = Math.random() < 0.5, B = Math.random() < 0.5;
      const exprs = [['A and B', A && B], ['A or B', A || B], ['not A', !A], ['not (A and B)', !(A && B)], ['A and not B', A && !B], ['(A or B) and not A', (A || B) && !A]];
      const [e, v] = pick(exprs);
      return mc(`If A is ${A} and B is ${B}, what is: ${e}?`, v ? 'True' : 'False', ['True', 'False'], '"and" needs both to be true; "or" needs at least one; "not" flips the value.');
    },
    () => {
      const items = [['Looking up an item in an array by its index', 'O(1)'], ['Checking every item in a list once', 'O(n)'], ['Binary search on a sorted list', 'O(log n)'],
        ['Comparing every item with every other item (nested loops)', 'O(n²)'], ['Merge sort', 'O(n log n)']];
      const [d, a] = pick(items);
      return mc(`What is the time complexity? ${d}.`, a, ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'], 'Big-O describes how running time grows with the input size n.');
    },
    () => {
      const n = ri(3, 10), k = ri(2, 6), mm = ri(2, 5);
      const items = [
        [`total = 0\nfor i in range(1, ${n + 1}):\n    total = total + i\nprint(total)`, n * (n + 1) / 2],
        [`count = 0\nfor i in range(${n}):\n    for j in range(${mm}):\n        count = count + 1\nprint(count)`, n * mm],
        [`x = 1\nfor i in range(${k}):\n    x = x * 2\nprint(x)`, Math.pow(2, k)],
        [`x = ${n}\nwhile x > 0:\n    x = x - ${mm}\nprint(x)`, n - mm * Math.ceil(n / mm)]
      ];
      const [code, out] = pick(items);
      return num(`What does this Python code print?\n${code.replace(/ {4}/g, '\u00a0\u00a0\u00a0\u00a0')}`, out, 'Trace the loop one step at a time.');
    },
    () => {
      const list = shuffle(['apple', 'banana', 'cherry', 'grape', 'mango', 'peach']).slice(0, 5), i = ri(0, 4);
      return mc(`fruits = [${list.map((f) => "'" + f + "'").join(', ')}]. What is fruits[${i}]?`, list[i], list.filter((f, j) => j !== i), 'Indexes start at 0.');
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
