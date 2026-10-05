/**
 * Word lists for the forecast generator.
 *
 * Things that fall from the sky each carry a glyph (drawn as a silhouette in
 * the sky window), a motion style, and a relative size. Motion styles:
 * - fall: drops straight down with a little sway
 * - flutter: drifts down slowly, rocking side to side
 * - drift: crosses the sky sideways
 * - rise: floats upward
 */
export const PRECIPITATION = [
  { plural: 'Trains', singular: 'a train', glyph: '🚂', motion: 'drift', size: 1.6 },
  { plural: 'Teeth', singular: 'a tooth', glyph: '🦷', motion: 'fall', size: 0.8 },
  { plural: 'Toy Airplanes', singular: 'a toy airplane', glyph: '✈️', motion: 'drift', size: 1 },
  { plural: 'Violins', singular: 'a violin', glyph: '🎻', motion: 'fall', size: 1.2 },
  { plural: 'Moths', singular: 'a moth', glyph: '🦋', motion: 'flutter', size: 0.8 },
  { plural: 'Lost Keys', singular: 'a lost key', glyph: '🔑', motion: 'fall', size: 0.8 },
  { plural: 'Small Horses', singular: 'a small horse', glyph: '🐎', motion: 'drift', size: 1.3 },
  { plural: 'Goldfish', singular: 'a goldfish', glyph: '🐟', motion: 'rise', size: 1 },
  { plural: 'Spoons', singular: 'a spoon', glyph: '🥄', motion: 'fall', size: 0.9 },
  { plural: 'Chairs', singular: 'a chair', glyph: '🪑', motion: 'fall', size: 1.2 },
  { plural: 'Grandfather Clocks', singular: 'a grandfather clock', glyph: '🕰️', motion: 'fall', size: 1.4 },
  { plural: 'Ladders', singular: 'a ladder', glyph: '🪜', motion: 'flutter', size: 1.4 },
  { plural: 'Doors', singular: 'a door', glyph: '🚪', motion: 'drift', size: 1.5 },
  { plural: 'Top Hats', singular: 'a top hat', glyph: '🎩', motion: 'flutter', size: 1 },
  { plural: 'Teacups', singular: 'a teacup', glyph: '☕', motion: 'fall', size: 0.9 },
  { plural: 'Pianos', singular: 'a piano', glyph: '🎹', motion: 'fall', size: 1.7 },
  { plural: 'Balloons', singular: 'a balloon', glyph: '🎈', motion: 'rise', size: 1.1 },
  { plural: 'Eyes', singular: 'an eye', glyph: '👁️', motion: 'drift', size: 1 },
  { plural: 'Feathers', singular: 'a feather', glyph: '🪶', motion: 'flutter', size: 0.9 },
  { plural: 'Bubbles', singular: 'a bubble', glyph: '🫧', motion: 'rise', size: 0.9 },
  { plural: 'Lemons', singular: 'a lemon', glyph: '🍋', motion: 'fall', size: 0.9 },
  { plural: 'Shoes', singular: 'a shoe', glyph: '👞', motion: 'fall', size: 1 },
  { plural: 'Candles', singular: 'a candle', glyph: '🕯️', motion: 'rise', size: 1 },
  { plural: 'Telephones', singular: 'a telephone', glyph: '☎️', motion: 'fall', size: 1.1 },
  { plural: 'Houseplants', singular: 'a houseplant', glyph: '🪴', motion: 'fall', size: 1.1 },
  { plural: 'Snails', singular: 'a snail', glyph: '🐌', motion: 'drift', size: 0.8 },
  { plural: 'Whales', singular: 'a whale', glyph: '🐋', motion: 'drift', size: 3.2 },
  { plural: 'Umbrellas', singular: 'an umbrella', glyph: '☂️', motion: 'flutter', size: 1.2 },
  { plural: 'Paper Boats', singular: 'a paper boat', glyph: '⛵', motion: 'drift', size: 1.1 },
  { plural: 'Wedding Rings', singular: 'a wedding ring', glyph: '💍', motion: 'fall', size: 0.8 },
]

/**
 * Real forecast words, each paired with how crowded the sky gets (0 to 1).
 */
export const QUALIFIERS = [
  { word: 'A Slight Chance of', density: 0.08 },
  { word: 'Isolated', density: 0.15 },
  { word: 'Patchy', density: 0.3 },
  { word: 'Scattered', density: 0.4 },
  { word: 'Occasional', density: 0.35 },
  { word: 'Light', density: 0.3 },
  { word: 'Intermittent', density: 0.45 },
  { word: 'Periods of', density: 0.6 },
  { word: 'Widespread', density: 0.85 },
  { word: 'Heavy', density: 1 },
  { word: 'Freezing', density: 0.5 },
]

export const SKY_PREFIXES = ['Mostly', 'Partly', 'Becoming', 'Briefly', 'Overcast and']

export const SKY_WORDS = [
  'Velvet', 'Wednesday', 'Felt', 'Remembered', 'Corduroy', 'Upholstered',
  'Familiar', 'Inside', 'Carpeted', 'Lukewarm', 'Fluorescent', 'Hymnal',
  'Vestibule', 'Laminated', 'Unfinished',
]

/**
 * Sky colors for the window, top to bottom. Each has a tint used for the
 * silhouettes so they always read against their own sky.
 */
export const SKIES = [
  { name: 'bruise', stops: ['#2b1d4a', '#6b3f7a', '#d98c8c'], ink: '#170f2b' },
  { name: 'aquarium', stops: ['#0f3b4a', '#2f7d7a', '#bfe3c9'], ink: '#082028' },
  { name: 'late tape', stops: ['#3a2f5c', '#a05a8c', '#f2c58a'], ink: '#1d1530' },
  { name: 'waiting room', stops: ['#8fa6a0', '#c9d1b5', '#efe8c8'], ink: '#33403c' },
  { name: 'pool at night', stops: ['#0b1a3a', '#1f4f8a', '#6fc3df'], ink: '#050c1f' },
  { name: 'sherbet', stops: ['#f08a7a', '#f6b98a', '#f9e2a8'], ink: '#5a2a2a' },
  { name: 'pressed flower', stops: ['#5c4a6b', '#a78ba8', '#e6d3d8'], ink: '#2a1f33' },
  { name: 'green hour', stops: ['#20302a', '#5a7a4a', '#c8d48a'], ink: '#101a14' },
]

export const PLACES = [
  'The Hallway That Keeps Going',
  "Your Grandmother's Kitchen (Expanded)",
  'The Mall, After Closing',
  'Lower Saltmarsh, Which Is Also Your Office',
  'A Train Station With No Trains Left',
  'The School You Never Attended',
  'The Hotel With Too Many Floors',
  'An Airport Made of Carpet',
  'The Backyard, But Bigger',
  'A Beach Inside a Library',
]

export const WIND_DIRECTIONS = [
  'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW',
  'Inward', 'Toward the Sea You Can Hear', 'From Behind You', 'Upstairs',
]

export const WIND_UNITS = ['mph', 'knots', 'whispers per hour', 'sighs', 'mph']

export const WIND_CARGO = [
  'carrying faint piano',
  'smelling of pencil shavings',
  'carrying someone calling your name',
  'with gusts of applause',
  'carrying the sound of a dishwasher',
  'smelling of a pool you swam in once',
  'with no cargo at present',
]

export const FEELS_LIKE = [
  'your third-grade classroom',
  'a car left in the sun',
  'the inside of a coat pocket',
  'a hug from someone you forgot',
  'the cold side of the pillow',
  'a library in August',
  'a bath someone else ran',
  'standing at the top of the stairs',
  'a basement that is somehow warm',
  'the moment before a phone rings',
]

export const VISIBILITY_ENDINGS = [
  'then a door', 'then fog', 'then your old house', 'then a second, smaller you',
  'then the ocean', 'then nothing in particular', 'then a gift shop',
]

export const HUMIDITY_SOURCES = [
  'mostly from the piano', 'mostly tears of joy', 'mostly the aquarium',
  'from an unknown kettle', 'mostly soup', 'from the pool upstairs',
]

export const PRESSURE_TRENDS = ['rising', 'falling', 'steady', 'unsure', 'pretending to be steady']

export const UV_ADVICE = [
  'you are wearing the wrong shoes',
  'bring a hat you do not own',
  'shade available under the whale',
  'sunscreen will not help but is encouraged',
  'the sun is mostly decorative today',
]

/**
 * Hazards for watches, advisories and warnings. The detail sentence explains
 * what people should do, the way real alerts do.
 */
export const HAZARDS = [
  { name: 'Small Craft', detail: 'Crafts smaller than a thimble should remain indoors. Paper boats are exempt.' },
  { name: 'Staircase', detail: 'Stairs may continue past the expected floor. Count steps carefully and do not trust landings.' },
  { name: 'Dense Familiarity', detail: 'Strangers may look like people you know. Do not wave back.' },
  { name: 'Excessive Hallways', detail: 'Travel between rooms may take longer than usual. Allow extra time to reach the kitchen.' },
  { name: 'Freezing Fog of Names', detail: 'Names may be hard to recall. Smile and nod until conditions improve.' },
  { name: 'Unexpected Exam', detail: 'A test you did not study for is possible. You are wearing clothes. Probably.' },
  { name: 'High Tide of Old Emails', detail: 'Low-lying inboxes may flood. Move valuables to higher folders.' },
  { name: 'Loose Teeth', detail: 'Chew with care. Teeth that fall will be counted toward precipitation totals.' },
  { name: 'Slow Running', detail: 'Running may feel like moving through syrup. This is normal. Do not try to escape.' },
  { name: 'Gale of Laughter', detail: 'Gusts of laughter may arrive from rooms with no one in them. Secure loose dignity.' },
]

export const ALERT_LEVELS = ['Advisory', 'Watch', 'Warning']

export const ALERT_ENDINGS = [
  'until you wake', 'until 7 AM or the alarm, whichever is first',
  'through the second act', 'until further notice from your mother',
  'until the train arrives', 'indefinitely, but gently',
]

export const MOON_PHASES = [
  'New', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
  'Full', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
]

export const MOON_ASIDES = [
  'possibly a plate', 'seen through a keyhole', 'slightly too close',
  'with a face you recognize', 'reflected in a spoon', 'on loan',
]

export const TIDE_LOCATIONS = [
  'the upstairs bathroom', 'the hallway closet', 'the school gym',
  'the back seat of the car', 'the cereal aisle', 'your childhood bedroom',
]

export const SUNSETS = [
  'whenever you stop looking', 'twice', 'behind the department store',
  'not tonight', 'very slowly, with music', 'early, out of politeness',
]

export const FORECASTERS = [
  'THE MAN FROM THE ELEVATOR',
  'YOUR SECOND-GRADE TEACHER',
  'A VERY TALL DOG',
  'SOMEONE WHO LOOKS LIKE YOUR COUSIN',
  'THE LIFEGUARD',
  'A VOICE FROM THE NEXT ROOM',
  'THE SUBSTITUTE',
]

/**
 * Sentences for the forecast discussion. Each is a function so it can pull
 * the day's own precipitation and place into the text.
 */
export const SYNOPSIS = [
  (f) => `A STALLED FRONT OF ${f.precip.plural} REMAINS DRAPED ACROSS ${f.place}. IT HAS BEEN THERE FOR AS LONG AS ANYONE CAN REMEMBER, WHICH IS ABOUT FOUR MINUTES.`,
  (f) => `HIGH PRESSURE BUILDS OVER THE AREA, BRINGING A SENSE THAT YOU HAVE LEFT THE STOVE ON. A WEAK DISTURBANCE OF ${f.precip.plural} SLIDES IN FROM THE ${f.wind.direction}.`,
  (f) => `A DEEPENING LOW OVER ${f.place} CONTINUES TO PULL ${f.precip.plural} INTO THE REGION. MODELS AGREE ON THIS, AND ALSO THAT THE MODELS ARE YOUR FORMER CLASSMATES.`,
  (f) => `AN UPPER-LEVEL RIDGE OF NOSTALGIA SETTLES IN. MEANWHILE ${f.precip.plural} CONTINUE TO ORGANIZE, THOUGH NOBODY KNOWS WHO PUT THEM IN CHARGE.`,
]

export const NEAR_TERM = [
  (f) => `${f.qualifier.word} ${f.precip.plural} THROUGH THE EVENING HOURS. ACCUMULATIONS OF ${f.amount} ARE POSSIBLE ON PORCHES AND IN SHOES.`,
  (f) => `EXPECT ${f.qualifier.word} ${f.precip.plural} TO BECOME ${f.later.qualifier.word} ${f.later.precip.plural} AFTER MIDNIGHT, OR WHENEVER THE ROOM CHANGES.`,
  (f) => `THE MAIN CONCERN TONIGHT IS ${f.precip.singular} FALLING NEAR SOMEONE YOU USED TO DATE. CONFIDENCE IN THIS IS HIGH. CONFIDENCE IN EVERYTHING ELSE IS LOW.`,
]

export const LONG_TERM = [
  () => 'THE EXTENDED PERIOD LOOKS LIKE THE SAME DAY REPEATED, BUT WITH THE FURNITURE MOVED. DAYTIME HIGHS NEAR NORMAL, IF NORMAL STILL EXISTS.',
  () => 'LATE IN THE WEEK, A DAY THAT IS NOT ON THE CALENDAR MAY DEVELOP. PLAN ACCORDINGLY. OR DO NOT. IT WILL NOT MATTER.',
  () => 'A SLOW WARMING TREND IS EXPECTED AS YOU REMEMBER WHERE YOU ARE. THE WEEKEND MAY BE CANCELLED DUE TO A LACK OF INTEREST.',
]

export const AVIATION = [
  () => 'FLIGHTS ARE POSSIBLE WITHOUT AN AIRPLANE IF YOU FLAP CONFIDENTLY. CEILINGS LOWERING TO THE HEIGHT OF YOUR CHILDHOOD BEDROOM.',
  () => 'VFR CONDITIONS PREVAIL, EXCEPT YOU HAVE FORGOTTEN HOW TO FLY. PILOTS SHOULD AVOID LOOKING DOWN.',
  (f) => `${f.precip.plural} MAY BRIEFLY OBSCURE THE RUNWAY. THE RUNWAY MAY ALSO BE A HALLWAY.`,
]

export const MARINE = [
  () => 'SEAS 2 TO 4 FEET, RISING TO KNEE-DEEP IN THE KITCHEN. THE OCEAN IS VISIBLE FROM EVERY WINDOW TODAY, INCLUDING THE INTERIOR ONES.',
  () => 'A LIGHT CHOP ON THE BATHTUB. SWIMMERS SHOULD NOTE THAT THE POOL IS ALSO A GYMNASIUM.',
  (f) => `MARINERS SHOULD WATCH FOR ${f.precip.plural} BOBBING NEAR THE SURFACE. DO NOT ATTEMPT TO RETURN THEM.`,
]

export const AMOUNTS = [
  'ONE TO TWO INCHES', 'A HANDFUL', 'ROUGHLY A DOZEN', 'MORE THAN SEEMS FAIR',
  'TRACE AMOUNTS', 'UP TO A BUCKET',
]

/**
 * Day names that wander. Most days come out normal; a few slip.
 */
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const DAY_SLIPS = {
  Sunday: ['Sunday-ish', 'Sonday'],
  Monday: ['Moonday', 'Monday (Again)'],
  Tuesday: ['Twosday', 'Tuesday, Probably'],
  Wednesday: ['Wendsday', 'Wednesday Eve'],
  Thursday: ['Thursday (Again)', 'Thirstday'],
  Friday: ['Fryday', 'Friday Jr.'],
  Saturday: ['Satyrday', 'Saturday, Briefly'],
}
