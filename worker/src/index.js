/* Genreactrix AI Worker v0.9.6.5 — true reanalyze behavior + balanced 114-point comparative Reaction scoring. */
const API_VERSION='0.9.6.5';
const BUILD_ID='prim-reactions-114-reanalyze-v2-theme-catalog-v0.0.0.0';
const cors={
  'access-control-allow-origin':'*',
  'access-control-allow-methods':'GET, POST, OPTIONS',
  'access-control-allow-headers':'content-type, x-analysis-key'
};
const json=(body,init={})=>new Response(JSON.stringify(body),{
  ...init,
  headers:{...cors,'content-type':'application/json; charset=utf-8',...(init.headers||{})}
});
const DEFAULT_MODEL='@cf/meta/llama-3.2-11b-vision-instruct';
const COMPONENT_IDS=['reactions','themes','description','emotion','reactionReasons','genreReasons'];
const REACTION_NAMES=['Beautiful','Adorable','Tragic','Funny','Intense','Weird','Ticket','Dreamy','Zazzly','Disgusting','Scary','Smart','Celebration','Angry'];
const PROMPT_VERSIONS=Object.freeze({
  reactions:'genreactrix-reactions-v4-114-point-balanced-rerun',
  themes:'genreactrix-themes-v2-catalog',
  description:'genreactrix-description-v1',
  emotion:'genreactrix-emotion-v1',
  reactionReasons:'genreactrix-reaction-reasons-v2-prims',
  genreReasons:'genreactrix-genre-reasons-v1'
});
const REACTION_CATALOG=Object.freeze([
  "Beautiful ✨ - Beauty, attractiveness, elegance, grace, harmony, radiance, artistry, gorgeousness, aesthetic pleasure, visual admiration, or striking appearance.",
  "Adorable 🧸 - Cuteness, sweetness, affection, tenderness, innocence, softness, charm, vulnerability, preciousness, coziness, playfulness, or “aww.”",
  "Tragic 😭 - Sadness, grief, loss, heartbreak, suffering, sorrow, regret, loneliness, helplessness, pity, emotional pain, or devastation.",
  "Funny 🤣 - Humor, amusement, silliness, absurdity, wit, ridiculousness, comedy, playful surprise, awkwardness, slapstick, visual jokes, or laughter.",
  "Intense 💥 - Energy, force, drama, urgency, power, excitement, extremity, passion, impact, danger, action, tension, chaos, spectacle, or overwhelming presence.",
  "Weird 🌀 - Strangeness, oddity, bizarreness, uncanniness, eccentricity, surrealism, abnormality, unpredictability, mutation, impossibility, unfamiliarity, or “what the hell?”",
  "Ticket 🎟️ - Inappropriate amusement, callousness, taboo enjoyment, schadenfreude, morbid fascination, cruel humor, social transgression, laughing at things that should not be funny, or emotional responses wildly opposed to what society considers acceptable. This captures enjoying cruelty, laughing at tragedy, amusement where empathy is expected, fascination with disturbing material, or reactions that sharply violate social norms.",
  "Dreamy 🌌 - Fantasy, reverie, wonder, escapism, imagination, enchantment, altered reality, surrealism, nostalgia, longing, otherworldliness, or dream-state.",
  "Zazzly 🌶️ - Sexual attraction, erotic appeal, sensuality, arousal, horniness, physical desire, temptation, sexual tension, hotness, or lustful interest.",
  "Disgusting 🤢 - Disgust, revulsion, nausea, filth, contamination, rot, decay, slime, gore, bodily fluids, infestation, grossness, or recoil.",
  "Scary 👻 - Fear, dread, threat, danger, horror, suspense, unease, menace, paranoia, terror, eerie atmosphere, playful spookiness, creepy fun, haunted vibes, Halloween, or frightening uncertainty.",
  "Smart / Brain 🧠 - Thought, intelligence, imagination, ideas, cleverness, cognition, knowledge, reasoning, curiosity, strategy, invention, insight, memory, consciousness, psychology, learning, problem-solving, or mental engagement.",
  "Celebration 🎉 - Joy, festivity, achievement, cheering, revelry, parties, ceremony, victory, congratulations, dancing, excitement, special occasions, or communal happiness.",
  "Angry 🤬 - Anger, rage, hostility, irritation, annoyance, resentment, aggression, frustration, defiance, outrage, confrontation, fury, vengeance, antagonism, or “pisses you off.”"
]);
const REACTION_CATALOG_TEXT=REACTION_CATALOG.join('\n');
const THEME_CATALOG=Object.freeze([
  "PFM0102 [🧸✨] Cozy - Comforting, snug, warm, sheltered, or inviting; soft textures, warm lighting, blankets, relaxed intimate settings, or a feeling of ease, rest, or pleasant closeness.",
  "PFM0103 [🧸😭] Pitiful - Arousing sympathy or compassion through visible helplessness, suffering, misfortune, weakness, neglect, injury, abandonment, or pleading.",
  "PFM0104 [🧸🤣] Goofy - Silly, awkward, playful, foolish, or ridiculous in an amusing way; exaggerated expressions, clumsy antics, or playful visual absurdity.",
  "PFM0105 [🧸💥] Joy - Happiness, delight, pleasure, or emotional uplift shown through smiling, laughter, delighted expressions, playful pleasure, or visible enjoyment.",
  "PFM0106 [🧸🌀] Bizarre - Strange, unusual, unexpected, peculiar; improbable combinations, anomalous forms, or unexplained oddities.",
  "PFM0107 [🧸🎟️] Camp - Exaggerated, theatrical, artificial, flamboyant, kitschy, or knowingly excessive styling and presentation.",
  "PFM0108 [🧸🌌] Whimsical - Fanciful, playful, imaginative, lightly odd, or guided by charming logic; fantasy details, charming oddities, or impossible elements.",
  "PFM0109 [🧸🌶️] Kawaii - A cute aesthetic emphasizing sweetness, softness, expressive features, or playful visual appeal; rounded forms, pastel styling, big eyes, or tiny proportions.",
  "PFM0110 [🧸🤢] Grimy - Dirty, soiled, greasy, dingy, stained, or neglected; visible dirt, grease, soot, residue, or accumulated grime on surfaces.",
  "PFM0111 [🧸👻] CreepyCute - Cute and unsettling at once; Halloween fun. Appealing subjects combined with eerie, spooky, uncanny, or disturbing features.",
  "PFM0112 [🧸🧠] Innocence - Openness, inexperience, trust, simplicity, or freedom from corruption; childlike expressions, gentleness, or naive imagery.",
  "PFM0113 [🧸🎉] Playful - Lighthearted, mischievous, teasing, game-like, curious, or inclined toward fun and experimentation; games, toys, teasing gestures, or spontaneous fun.",
  "PFM0114 [🧸🤬] Saccharine - Excessively sweet, sentimental, precious, or cutesy to the point of irritation; sugary, pastel, cloying, aggressively sweet imagery.",
  "PFM0203 [✨😭] Melancholic - Sad, wistful, reflective, or touched by longing and loss; downcast expressions, solitude, rain, fading light, or emotional heaviness.",
  "PFM0204 [✨🤣] Charming - Pleasantly attractive, likable, engaging, or delightful in a way that wins affection; inviting expressions, warmth, approachable elegance, or pleasing details.",
  "PFM0205 [✨💥] Majestic - Grand, dignified, regal, imposing, or awe-inspiring in scale, presence, or bearing; symmetry, noble posture, stately beauty, or impressive scenery.",
  "PFM0206 [✨🌀] Surreal - Dreamlike, impossible, uncanny, or illogical in an altered reality; distorted scale, impossible spaces, or unexpected object combinations.",
  "PFM0207 [✨🎟️] Irreverent - Disrespectful, cheeky, mocking, or dismissive toward seriousness, convention, authority, or decorum; visual disrespect toward sacred, formal, or authoritative symbols.",
  "PFM0208 [✨🌌] Romance - Affection, longing, intimacy, courtship, tenderness, or romantic attraction; couples, affectionate gestures, closeness, or romantic settings.",
  "PFM0209 [✨🌶️] Exposure - Being naked, indecently revealed, or too visibly exposed, especially in ways that feel shameful, embarrassing, humiliating, or sexually charged; visible nudity, uncovered body parts, flashing, revealing poses, or accidental bodily exposure.",
  "PFM0210 [✨🤢] Grotesque - Whimsical or ornamental distortion mixing beauty, absurdity, or unease; hybrid human, animal, or plant forms, exaggerated features, decorative symmetry, or playful violations of natural law.",
  "PFM0211 [✨👻] Vulnerable - Exposed to harm, rejection, injury, loss, or emotional pain; defenseless posture, exposed emotion, isolation, or injury.",
  "PFM0212 [✨🧠] Elegant - Graceful, refined, tasteful, polished, restrained, or well composed; sophisticated detail, balanced composition, graceful forms, or controlled styling.",
  "PFM0213 [✨🎉] Festive - Marked by celebration, holidays, ceremonies, or special occasions; decorations, costumes, lights, ornaments, seasonal styling, or celebratory settings.",
  "PFM0214 [✨🤬] Pretentious - Affected, self-important, showy, or overly cultured or significant; conspicuous status display and affected refinement.",
  "PFM0304 [😭🤣] Ironic - Tragic or unfortunate situations made funny through unexpected contrast, reversal, or coincidence. Or happy situations ruined by an unexpected reversal.",
  "PFM0305 [😭💥] Devastating - Causing profound damage, loss, grief, shock, defeat, or emotional destruction; catastrophic ruin, collapse, severe aftermath, or overwhelming loss.",
  "PFM0306 [😭🌀] Nightmarish - Resembling a nightmare; frightening, disturbing, unreal, oppressive, or horrifying, with dream logic, threatening distortions, darkness, or impossible danger.",
  "PFM0307 [😭🎟️] Shame - Painful self-conscious disgrace, embarrassment, exposure, or feeling unworthy, judged, or wanting to hide; averted gaze, covered face, hiding posture, blushing, shrinking, or visibly caught embarrassment.",
  "PFM0308 [😭🌌] Liminal - Vast, lonely spaces with sparse objects or people; emptiness, isolation, corridors, thresholds, sparse interiors, or uncanny stillness.",
  "PFM0309 [😭🌶️] Humiliation - Being demeaned, degraded, ridiculed, exposed, rejected, or stripped of dignity by others or events; pointing or laughing onlookers, forced exposure, defeated posture, visible embarrassment, or submission.",
  "PFM0310 [😭🤢] Despair - Hopelessness, anguish, defeat, or the sense that relief or improvement has disappeared; collapsed posture, ruin, isolation, or hopeless expressions.",
  "PFM0311 [😭👻] Foreboding - Uneasy expectation that danger, trouble, harm, or an unwanted event is approaching; ominous shadows, stormy skies, suspense, or approaching threat.",
  "PFM0312 [😭🧠] Poignant - Emotionally affecting through tenderness, sadness, meaning, or reflection; fragile moments, remembrance, meaningful loss, or emotional stillness.",
  "PFM0313 [😭🎉] Bittersweet - Pleasure and sadness experienced together; joyful imagery touched by loss, nostalgia, farewell, memory, or impermanence.",
  "PFM0314 [😭🤬] Dysphoria - Distress, dissatisfaction, unease, or disconnection involving self, body, identity, mood, or circumstance; bodily discomfort, alienation, or self-disconnection.",
  "PFM0405 [🤣💥] Cringe - Painful awkwardness or embarrassment that causes secondhand discomfort; social blunders, failed interactions, awkward expressions, or embarrassing poses.",
  "PFM0406 [🤣🌀] Zany - Eccentric, unconventional, comically strange, or offbeat; mismatched costumes, unusual poses, frantic antics, or energetic comic behavior.",
  "PFM0407 [🤣🎟️] Satirical - Using humor, irony, exaggeration, or ridicule to expose or criticize faults, behavior, institutions, or ideas; visual mockery of politics, culture, or social conventions.",
  "PFM0408 [🤣🌌] Absurd - Illogical, ridiculous, contradictory, pointless, impossible, or incompatible with ordinary sense; nonsensical juxtapositions, impossible logic, or ridiculous contradictions.",
  "PFM0409 [🤣🌶️] Ribaldry - Coarse, bawdy, or sexually suggestive humor; sexual jokes, innuendo, vulgar comedy, bawdy gestures, or suggestive comic situations.",
  "PFM0410 [🤣🤢] Grossout - Humor or spectacle built around filth, bodily functions, fluids, decay, gore, or revulsion; vomit, excrement, bodily fluids, or gross material used comically.",
  "PFM0411 [🤣👻] Comedy Horror - Frightening or macabre material blended with humor, parody, absurdity, slapstick, jokes, or comic relief.",
  "PFM0412 [🤣🧠] Witty - Clever, quick, inventive, or skillful humor and insight; visual puns, layered references, wordplay, or ingenious humorous juxtapositions.",
  "PFM0413 [🤣🎉] PartyTime - Active social celebration centered on revelry, fun, gathering, or excitement; dancing, cheering, crowds, drinks, decorations, music, or confetti.",
  "PFM0414 [🤣🤬] Trolling - Provoking, baiting, mocking, annoying, or misleading others for amusement or reaction; antagonistic jokes, mocking memes, baiting signs, or provocative gestures.",
  "PFM0506 [💥🌀] Chaotic - Disordered, unstable, crowded, conflicting, or lacking control or organization; scattered objects, unstable motion, visual overload, or competing elements.",
  "PFM0507 [💥🎟️] Outrageous - Shockingly excessive, bold, offensive, audacious, unconventional, or beyond restraint; extreme styling, taboo-breaking, flamboyance, or audacious behavior.",
  "PFM0508 [💥🌌] Epic - Grand, heroic, or massive in scale, consequence, duration, drama, adventure, struggle, achievement, or spectacle; monumental scenery, heroic action, or high stakes.",
  "PFM0509 [💥🌶️] Lust - Sexual desire, appetite, craving, fixation, or physical attraction; desirous gazes, sensual bodies, erotic focus, or visible craving.",
  "PFM0510 [💥🤢] Brutal - Harsh, violent, cruel, punishing, damaging, or unsparing in force or effect; severe injury, destruction, cruelty, or punishing conditions.",
  "PFM0511 [💥👻] Terror - Extreme fear, alarm, panic, dread, or immediate danger; terrified expressions, fleeing, overwhelming threat, or visible panic.",
  "PFM0512 [💥🧠] Brilliant - Clever, inventive, insightful, creative, effective, or intellectually impressive; ingenious designs, exceptional craftsmanship, inventive solutions, or impressive execution.",
  "PFM0513 [💥🎉] Pride - Satisfaction, self-respect, dignity, or affirmation tied to achievement, identity, belonging, or worth; gay or LGBT imagery; confident posture, identity symbols, or dignified self-presentation.",
  "PFM0514 [💥🤬] Aggressive - Confrontational, forceful, hostile, threatening, domineering, or ready to attack; attack gestures, weapons, intimidation, forceful motion, or threatening posture.",
  "PFM0607 [🌀🎟️] Freakshow - Bizarre or unsettling spectacle that provokes fascinated, guilty enjoyment; shocking anomalies, unusual performers, carnival-like display, or gawking attention.",
  "PFM0608 [🌀🌌] Psychedelic - Hallucinatory, sensory-rich, perception-bending, or suggestive of expanded or distorted consciousness; vivid colors, swirling patterns, fractals, or hallucination-like effects.",
  "PFM0609 [🌀🌶️] FreakyDeaky - Sexually playful, unconventional, eccentric, uninhibited, or erotic with an oddball edge; strange erotic styling, playful erotic imagery, or unconventional sexual presentation.",
  "PFM0610 [🌀🤢] Mutant - Biological form altered from a known prototype through mutation, radiation, chemicals, genetics, abnormal development, hybridization, or evolution; extra limbs, altered organs, abnormal growths, or techno-organic fusion.",
  "PFM0611 [🌀👻] Macabre - Gothic morbidity centered on death, corpses, decay, mortality, funerary imagery, or morbid fascination; skulls, graves, death rituals, or ornate morbid decoration.",
  "PFM0612 [🌀🧠] Alien - Strange, foreign, unfamiliar, or nonhuman; suggesting intelligence, biology, places, or forms outside ordinary human experience. Unfamiliar beings, strange anatomy, spacecraft, foreign environments, otherworldly landscapes, or unfamiliar technology.",
  "PFM0613 [🌀🎉] Delirious - Disoriented, feverish, ecstatic, manic, confused, or detached from stable reality; hallucinations, unstable visual reality, feverish expressions, or ecstatic chaos.",
  "PFM0614 [🌀🤬] Monstrous - Awe-inspiring unnatural threat defined by immense scale, predation, mythic power, or eldritch otherness; colossal creatures, chimeric anatomy, predatory weapons, and impossible features.",
  "PFM0708 [🎟️🌌] Medicated - Altered, softened, detached, or chemically influenced consciousness or perception; drowsy eyes, softened expressions, detached gaze, pills, or clinical sedation cues.",
  "PFM0709 [🎟️🌶️] Exploitation - Using people, bodies, suffering, taboo, shock, or sensational material for advantage, attention, profit, or gratification; objectification, commodification, or spectacle built from others.",
  "PFM0710 [🎟️🤢] Tasteless - Vulgar, crude, offensive, insensitive, indecent, or lacking judgment or restraint; socially or aesthetically offensive imagery or insensitive presentation.",
  "PFM0711 [🎟️👻] Execrable - Hateful, detestable, contemptible, vile, cruel, or deserving condemnation; deliberately abhorrent content or visible malice.",
  "PFM0712 [🎟️🧠] Parodic - Imitating a recognizable style, work, person, or convention through exaggeration, distortion, mockery, or comic transformation.",
  "PFM0713 [🎟️🎉] Snarky - Sarcastic, cutting, mocking, dismissive, or contemptuous humor; eye-rolls, smirks, mocking gestures, sarcastic captions, or dismissive commentary.",
  "PFM0714 [🎟️🤬] Wickedness - Wrongdoing, cruelty, malice, corruption, immorality, or pleasure in harmful behavior; deliberate harm, malicious intent, corruption, or gleeful wrongdoing.",
  "PFM0809 [🌌🌶️] Limerence - Romantic infatuation marked by longing, idealization, uncertainty, fantasy, or desire for reciprocation; idealized crush imagery, fixation, longing gazes, or unreciprocated yearning.",
  "PFM0810 [🌌🤢] Putrid - Rotten, decaying, foul, contaminated, corrupt, or unpleasant; decomposition, mold, slime, spoiled matter, or contamination.",
  "PFM0811 [🌌👻] Eerie - Unsettling, haunting, uncanny, quiet, mysterious, or suggestive that something is wrong; strange shadows, emptiness, haunting stillness, or subtle wrongness.",
  "PFM0812 [🌌🧠] Ethereal - Airy, delicate, luminous, weightless, otherworldly, or removed from ordinary physical substance; soft glow, translucence, mist, or delicate forms.",
  "PFM0813 [🌌🎉] Magical - Enchanting, supernatural, wondrous, impossible, or governed by forces from a different reality; spells, glowing effects, impossible transformations, enchanted beings, or supernatural phenomena.",
  "PFM0814 [🌌🤬] Phantasmagoric - Elaborate grotesque fantasy with bizarre creatures, impossible forms, or disturbing imagery.",
  "PFM0910 [🌶️🤢] Lewd - Sexually explicit, vulgar, indecent, crude, suggestive, or offensively erotic; explicit exposure, crude sexual gestures, vulgar erotic jokes, or indecent posing.",
  "PFM0911 [🌶️👻] Seduction - Attraction created through allure, temptation, mystery, danger, or sexual invitation; alluring poses, intimate gaze, revealing styling, or a dangerous sensual atmosphere.",
  "PFM0912 [🌶️🧠] Kinky - Sexually unconventional, fetish-oriented, experimental, role-based, or involving nonstandard preferences or practices; fetish attire, bondage cues, role-play, or unconventional erotic props.",
  "PFM0913 [🌶️🎉] Hedonism - Pleasure, gratification, sensual enjoyment, luxury, appetite, or indulgence elevated into an atmosphere or lifestyle; feasting, partying, lavish consumption, sensual abundance, or decadent excess.",
  "PFM0914 [🌶️🤬] Sadomasochism - Erotic pleasure involving pain, domination, submission, humiliation, control, or suffering; bondage, power exchange, or controlled physical pain.",
  "PFM1011 [🤢👻] Horror - Fear, dread, shock, or revulsion produced by disturbing, threatening, grotesque, supernatural, or violent material; monsters, gore, frightening scenes, or supernatural danger.",
  "PFM1012 [🤢🧠] Greed - Excessive desire to possess, acquire, keep, or control wealth, resources, status, power, or advantage; hoarding, grabbing valuables, status fixation, or acquisitiveness.",
  "PFM1013 [🤢🎉] Indulgent - Permissive toward pleasure, appetite, comfort, luxury, excess, or personal gratification; rich food, lounging, pampering, luxury, or overconsumption.",
  "PFM1014 [🤢🤬] Repulsive - Immediate visceral disgust caused by decay, contamination, bodily fluids, wounds, infection, or organic breakdown; rotting flesh, pus, vomit, lesions, parasites, or formless slime.",
  "PFM1112 [👻🧠] Paranoia - Persistent suspicion or fear of harm, deception, surveillance, persecution, or hidden threat; watchful fear, suspicious glances, defensive behavior, or surveillance imagery.",
  "PFM1113 [👻🎉] Spirituality - Meaning, transcendence, sacredness, inner life, faith, ritual, or connection beyond ordinary material existence; prayer, meditation, worship, sacred symbols, or mystical connection.",
  "PFM1114 [👻🤬] Violated - A boundary, body, trust, right, safety, privacy, or autonomy invaded or broken; forced intrusion, damaged privacy, assault aftermath, or breached safety.",
  "PFM1213 [🧠🎉] Glory - Honor, acclaim, valor, prestige, or celebrated achievement; trophies, medals, military honors, victory displays, heroic poses, or public recognition.",
  "PFM1214 [🧠🤬] Obsessive - Fixated, compulsive, preoccupied, repetitive, or unable to release attention from a person, idea, goal, or concern; repeated patterns, hoarding, compulsive arrangement, or relentless focus.",
  "PFM1314 [🎉🤬] Revenge - Retaliation, payback, punishment, or action answering a perceived wrong or injury; retaliatory acts, targeting offenders, punishment, or settling scores."
]);
const THEME_CATALOG_TEXT=THEME_CATALOG.join('\n');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

const strip=text=>String(text||'').trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
const parse=value=>{
  if(value&&typeof value==='object')return value;
  const clean=strip(value);
  try{return JSON.parse(clean)}catch{}
  const a=clean.indexOf('{'),b=clean.lastIndexOf('}');
  if(a>=0&&b>a){try{return JSON.parse(clean.slice(a,b+1))}catch{}}
  throw new Error('Vision provider returned invalid JSON');
};
const responseValue=p=>{
  if(p&&typeof p==='object'){
    if(Object.prototype.hasOwnProperty.call(p,'response'))return p.response;
    if(p.result&&typeof p.result==='object'&&Object.prototype.hasOwnProperty.call(p.result,'response'))return p.result.response;
    if(Object.prototype.hasOwnProperty.call(p,'output_text'))return p.output_text;
  }
  return p;
};
const fetchBytes=async url=>{
  if(!/^https:\/\//i.test(url)||url.length>2000)throw new Error('imageUrl must be HTTPS');
  const r=await fetch(url,{headers:{accept:'image/*'}});
  if(!r.ok)throw new Error(`Could not retrieve image (${r.status})`);
  const bytes=new Uint8Array(await r.arrayBuffer());
  if(!bytes.length)throw new Error('Image was empty');
  if(bytes.length>6_000_000)throw new Error('Image exceeds 6 MB');
  return Array.from(bytes);
};
const dataUrlBytes=value=>{
  const m=String(value||'').match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/);
  if(!m)throw new Error('imageDataUrl must be a base64 image');
  const binary=atob(m[1]);
  if(binary.length>6_000_000)throw new Error('Image exceeds 6 MB');
  return Array.from(binary,c=>c.charCodeAt(0));
};

const reactionAllocationSchema={
  type:'object',
  properties:{
    points:{type:'integer',minimum:1,maximum:101},
    reason:{type:'string'}
  },
  required:['points','reason'],
  additionalProperties:false
};
const reactionProperties=Object.fromEntries(REACTION_NAMES.map(name=>[name,reactionAllocationSchema]));
const componentSchemas={
  reactions:{
    type:'object',
    properties:{reactions:{type:'object',properties:reactionProperties,required:REACTION_NAMES,additionalProperties:false}},
    required:['reactions'],
    additionalProperties:false
  },
  themes:{
    type:'object',
    properties:{themes:{
      type:'array',minItems:3,maxItems:3,
      items:{
        type:'object',
        properties:{
          theme:{type:'string'},
          confidence:{type:'number',minimum:0,maximum:100},
          evidence:{type:'string'},
          role:{type:'string',enum:['primary','secondary','ambiguous']}
        },
        required:['theme','confidence','evidence','role'],
        additionalProperties:false
      }
    }},
    required:['themes'],
    additionalProperties:false
  },
  description:{
    type:'object',
    properties:{description:{type:'string'}},
    required:['description'],
    additionalProperties:false
  },
  emotion:{
    type:'object',
    properties:{emotion:{
      type:'object',
      properties:{
        dominant:{type:'array',items:{type:'string'}},
        secondary:{type:'array',items:{type:'string'}},
        tone:{type:'string'},
        intensity:{type:'number',minimum:0,maximum:100},
        contrasts:{type:'array',items:{type:'string'}},
        causes:{type:'array',items:{type:'string'}}
      },
      required:['dominant','secondary','tone','intensity','contrasts','causes'],
      additionalProperties:false
    }},
    required:['emotion'],
    additionalProperties:false
  },
  reactionReasons:{
    type:'object',
    properties:{reactionReasons:{type:'object'}},
    required:['reactionReasons'],
    additionalProperties:false
  },
  genreReasons:{
    type:'object',
    properties:{genreReasons:{
      type:'array',
      items:{
        type:'object',
        properties:{theme:{type:'string'},reason:{type:'string'},evidence:{type:'array',items:{type:'string'}}},
        required:['theme','reason','evidence'],
        additionalProperties:false
      }
    }},
    required:['genreReasons'],
    additionalProperties:false
  }
};

const promptFor=component=>{
  const common='You are Genreactrix, a rigorous visual-research analyst. Analyze only visible evidence in the image. Do not infer hidden identity or backstory.';
  const prompts={
    reactions:`${common} Mimic a person choosing emoji reaction buttons from what the image feels like or what word essence it gives off. Consider every reaction using its supplied definition. Use one shared pool of exactly 114 WHOLE points across all 14 reactions. Give every reaction at least 1 point. Allocate the remaining 100 discretionary points according to relative reaction fit. Concentrate points on reactions a person would actually feel compelled to press, while giving some discretionary points to every reaction that has meaningful visible or felt support. Do not collapse to a winner-take-all 101/1/1/... allocation merely because one reaction is strongest; use that extreme only when the image genuinely has no meaningful secondary reaction. A reaction with no meaningful fit may receive only its required 1 point. When no reaction strongly dominates, spread discretionary points more evenly. Return every exact reaction key with integer points plus a concise reason grounded in visible evidence or felt essence. Smart is the output key for the 🧠 Brain/Mind reaction.\n\nCANONICAL PRIM REACTIONS\n${REACTION_CATALOG_TEXT}`,
    themes:`${common} Return exactly THREE distinct Theme suggestions, ranked strongest to weakest. First compare the image against the complete canonical PrimFusion Theme catalog below and use the exact canonical Theme label whenever an existing Theme reasonably represents the concept. A different word, synonym, grammatical variation, broader or narrower wording, or an existing Theme combined with visible subject matter is NOT a Custom Theme. A Custom Theme is allowed only for a genuine semantic gap that the canonical catalog cannot reasonably express. Custom Theme labels must be one concise reusable abstract concept: never a setting, object, profession, standalone Prim name, or an "and" compound. Theme labels must be non-empty and unique ignoring capitalization and surrounding whitespace. Give confidence 0-100, concise visible evidence, and role primary, secondary, or ambiguous. Do not repeat the same Theme under alternate capitalization or trivial wording.\n\nCANONICAL PRIMFUSION THEMES — MATRIX v0.0.0.0\n${THEME_CATALOG_TEXT}`,
    description:`${common} Write a detailed factual description of subjects, objects, actions, setting, composition, style, visible text, and unusual juxtapositions.`,
    emotion:`${common} Describe visible emotional tone using dominant and secondary emotions, overall tone, 0-100 intensity, contrasts, and visible causes.`,
    reactionReasons:`${common} Use the canonical Prim definitions below. Return an object keyed by relevant Genreactrix reaction name, with a detailed visible-evidence explanation for why a viewer may feel that reaction. Smart is the output key for the 🧠 Brain/Mind reaction.\n\nCANONICAL PRIM REACTIONS\n${REACTION_CATALOG_TEXT}`,
    genreReasons:`${common} Return theme reasoning entries with theme, reason, and an array of visible evidence.`
  };
  return prompts[component]||common;
};

function normalizedConfidence(value){
  const n=Number(value);
  if(!Number.isFinite(n))throw new Error('Confidence was not numeric');
  return Math.max(0,Math.min(100,n));
}
function validateComponent(component,value){
  if(component==='reactions'){
    if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Reaction output was not an object');
    const raw={},out={};let total=0;
    for(const name of REACTION_NAMES){
      const row=value[name];
      if(!row||typeof row!=='object')throw new Error(`Reaction output omitted ${name}`);
      const points=Number(row.points),reason=String(row.reason||'').trim();
      if(!Number.isInteger(points))throw new Error(`Reaction allocation for ${name} was not a whole number`);
      if(points<1||points>101)throw new Error(`Reaction allocation for ${name} must be between 1 and 101`);
      if(!reason)throw new Error(`Reaction output omitted a reason for ${name}`);
      raw[name]=points;total+=points;
    }
    if(total!==114)throw new Error(`Reaction allocation totaled ${total}; exactly 114 required`);
    for(const name of REACTION_NAMES){
      out[name]={confidence:raw[name]-1,allocationPoints:raw[name],reason:String(value[name].reason).trim()};
    }
    return out;
  }
  if(component==='themes'){
    if(!Array.isArray(value))throw new Error('Theme output was not an array');
    const normalized=value.map(row=>({
      theme:String(row?.theme||'').trim(),
      confidence:normalizedConfidence(row?.confidence),
      evidence:String(row?.evidence||'').trim(),
      role:['primary','secondary','ambiguous'].includes(row?.role)?row.role:'ambiguous'
    })).filter(row=>row.theme&&row.evidence);
    const seen=new Set(),unique=[];
    for(const row of normalized){
      const key=row.theme.toLocaleLowerCase();
      if(seen.has(key))continue;
      seen.add(key);unique.push(row);
    }
    if(unique.length!==3)throw new Error(`Theme output contained ${unique.length} unique valid selections; exactly 3 required`);
    return unique;
  }
  if(component==='description'){
    const text=String(value||'').trim();
    if(!text)throw new Error('Description output was empty');
    return text;
  }
  if(component==='emotion'){
    if(!value||typeof value!=='object')throw new Error('Emotion output was not an object');
    return value;
  }
  if(component==='reactionReasons'){
    if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Reaction reasons output was not an object');
    return value;
  }
  if(component==='genreReasons'){
    if(!Array.isArray(value))throw new Error('Genre reasons output was not an array');
    return value;
  }
  throw new Error(`Unsupported component ${component}`);
}

function isTransientProviderError(message){
  return /json mode couldn'?t be met|rate.?limit|temporar|timeout|timed out|overload|capacity|unavailable|internal error|try again/i.test(String(message||''));
}
function isRecoverableOutputError(message){
  return /invalid json|output|omitted|confidence|description|theme|reaction allocation|whole number|114 required/i.test(String(message||''));
}

async function runComponent(env,model,image,component,behavior='analyze'){
  const schema=componentSchemas[component];
  if(!schema)throw new Error(`No structured schema for ${component}`);
  let lastError=null;
  for(let attempt=1;attempt<=3;attempt++){
    const schemaMode=attempt<3;
    const freshRerun=behavior==='reanalyze'?' This is a fresh rerun. Reassess the image independently from scratch. Do not mechanically reproduce a prior plausible allocation or wording; reconsider the relative evidence while remaining faithful to what is visible.':'';
    const correction=attempt===1?'':` Previous attempt was unusable. Follow the requested structure exactly${component==='themes'?' and return three DISTINCT theme labels':''}${component==='reactions'?' and return all 14 integer point allocations totaling exactly 114 with minimum 1 each':''}.`;
    try{
      const payload=await env.AI.run(model,{
        prompt:promptFor(component)+freshRerun+correction,
        image,
        max_tokens:component==='reactions'?2200:component==='description'?1600:1200,
        temperature:attempt===1?(behavior==='reanalyze'?0.35:0.1):(attempt===2&&behavior==='reanalyze'?0.1:0),
        response_format:schemaMode?{type:'json_schema',json_schema:schema}:{type:'json_object'}
      });
      const raw=responseValue(payload);
      if(raw==null||raw==='')throw new Error('Workers AI returned no analysis text');
      const parsed=parse(raw);
      if(!Object.prototype.hasOwnProperty.call(parsed,component))throw new Error(`Provider omitted ${component}`);
      return{value:validateComponent(component,parsed[component]),attempts:attempt,mode:schemaMode?'json_schema':'json_object-fallback'};
    }catch(error){
      lastError=error;
      const message=String(error?.message||error);
      if(attempt>=3||(!isTransientProviderError(message)&&!isRecoverableOutputError(message)))break;
      await sleep(150*Math.pow(2,attempt-1));
    }
  }
  const message=String(lastError?.message||lastError||'Unknown provider failure');
  if(/json mode couldn'?t be met/i.test(message))throw new Error(`Vision provider could not satisfy structured ${component} output after retry`);
  throw new Error(message);
}

async function analyze(env,body){
  if(!env.AI?.run)throw new Error('Workers AI binding AI is not configured');
  const requested=[...new Set((body.components||[]).filter(x=>COMPONENT_IDS.includes(x)))];
  if(!body.imageId||!requested.length)throw new Error('imageId and components are required');
  const image=body.imageDataUrl?dataUrlBytes(body.imageDataUrl):await fetchBytes(body.imageUrl);
  const model=env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL;
  const components={},diagnostics={};
  for(const component of requested){
    try{
      const behavior=body.componentBehaviors?.[component]==='reanalyze'?'reanalyze':'analyze';
      const result=await runComponent(env,model,image,component,behavior);
      components[component]=result.value;
      diagnostics[component]={attempts:result.attempts,mode:result.mode,behavior};
      if(component==='reactions')Object.assign(diagnostics[component],{scoringMethod:'114-point-min1-minus1',rawAllocationTotal:114,derivedPercentageTotal:100});
    }catch(error){
      throw new Error(`${component}: ${String(error?.message||error)}`);
    }
  }
  return{
    schemaVersion:1,
    imageId:body.imageId,
    analyzedAt:new Date().toISOString(),
    provider:{id:'cloudflare-workers-ai',displayName:'Genreactrix Vision · Cloudflare Workers AI',model,workerVersion:API_VERSION,build:BUILD_ID},
    model,
    promptVersions:Object.fromEntries(requested.map(id=>[id,PROMPT_VERSIONS[id]||'genreactrix-v1'])),
    components,
    diagnostics
  };
}

export default{
  async fetch(request,env={}){
    const url=new URL(request.url);
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...cors,'access-control-max-age':'86400'}});
    if(request.method==='GET'&&url.pathname==='/api/health')return json({
      ok:true,service:'Genreactrix AI',version:API_VERSION,build:BUILD_ID,
      vision:env.AI?'configured':'not-configured',provider:'cloudflare-workers-ai',structuredOutput:'component-json-schema'
    });
    try{
      if(request.method==='POST'&&url.pathname==='/api/genreactrix/analyze'){
        if(!env.ANALYSIS_KEY)return json({ok:false,error:'Analysis access is not configured',workerVersion:API_VERSION},{status:503});
        if(request.headers.get('x-analysis-key')!==env.ANALYSIS_KEY)return json({ok:false,error:'Unauthorized',workerVersion:API_VERSION},{status:401});
        const body=await request.json().catch(()=>null);
        if(!body)return json({ok:false,error:'JSON body required',workerVersion:API_VERSION},{status:400});
        return json({ok:true,result:await analyze(env,body),workerVersion:API_VERSION});
      }
    }catch(error){
      return json({ok:false,error:String(error?.message||error),workerVersion:API_VERSION,build:BUILD_ID},{status:500});
    }
    return json({ok:false,error:'Not found',workerVersion:API_VERSION},{status:404});
  }
};
