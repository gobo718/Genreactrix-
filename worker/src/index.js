/* Genreactrix AI Worker v0.9.6.37-prompt-diagnostics-call-modes
   Registry-driven replacement Worker.
   Source vocabulary is generated from primfusion-registry.json.
*/
const API_VERSION = '0.9.6.37-prompt-diagnostics-call-modes';
const DEFAULT_MODEL = '@cf/meta/llama-3.2-11b-vision-instruct';
// Description-only Reaction analysis keeps the structured-output model used by v0.9.6.31.
const DEFAULT_REACTION_MODEL = '@cf/meta/llama-4-scout-17b-16e-instruct';
const COMPONENT_IDS = ['reactions','themes','description','reactionReasons','genreReasons'];
const CUSTOM_THEME_GENERATION_ENABLED = false;
const PROVIDER_CALL_TIMEOUT_MS = 45000;

const cors = {
  'access-control-allow-origin':'*',
  'access-control-allow-methods':'GET, POST, OPTIONS',
  'access-control-allow-headers':'content-type, x-analysis-key'
};

const json = (body, init={}) => new Response(JSON.stringify(body), {
  ...init,
  headers:{...cors,'content-type':'application/json; charset=utf-8',...(init.headers||{})}
});

const PRIMFUSION_REGISTRY = {"schemaVersion":1,"matrixVersion":"0.0.0.0","latestVersion":"0.0.0.0","codingRules":{"primFusionPrefix":"PFM","fusionPrimOrder":"ascending numeric primitive ID","pairOrderIndependent":true,"fusionCodesExcludeSelfPairs":true,"themeChoiceCount":105,"primCount":14,"fusionCount":91,"aiThemeChoiceCount":91},"researchRules":{"reactionAndThemeAnalysesIndependent":true,"reactionCodesAreReturnIdentifiersNotThemeReasoningInputs":true,"themeSelectionUsesCurrentMatrixVocabulary":true,"customThemeFallbackAllowed":false,"customThemeUseOrCreationTriggers":["AutoKeep","AutoFlag"],"aiThemeSelectionUsesFusionVocabularyOnly":true,"standalonePrimThemesExcludedFromAiThemeSelection":true},"source":{"kind":"live-site-app-js","repository":"gobo718/Genreactrix-","path":"app.js","extractedUtc":"2026-08-09T05:59:12.571064+00:00","note":"Fusion vocabulary synchronized to PRIMFUSION_THEME_DEFINITIONS-v0.0.0.0; Kawaii definition locked in the pre-batch 0.0.0.0 vocabulary. Custom AI Theme fallback is temporarily disabled for research while the feature remains implemented. Reaction Prim definitions retain v0.5 except P02 Beautiful and P09 Zazzly, tuned 2026-08-11 for Beautiful restraint and expanded Zazzly recognition. PFM0308 Liminal tightened to the Backrooms-style environmental definition before any batch use; Matrix remains 0.0.0.0."},"primitives":[{"id":"P01","name":"Adorable","symbol":"🧸","aiMeaning":"Distinct cuteness or endearment that produces an “aww,” nurturing, protective, cuddling, baby-schema, precious, or irresistibly lovable response. Adorable is a narrow reaction to cuteness itself, not a general positive reaction to something pleasant, attractive, friendly, soft, or beautiful.\nRequired gate: Adorable should be supported only when the image contains clear cuteness-specific evidence. Valid routes include juvenile or baby-like traits, baby-schema proportions, tiny vulnerable proportions, plush or toy-like forms, cuddly presentation, affectionate dependence, innocent vulnerability, endearing clumsiness, deliberately cute or kawaii styling, or behavior that specifically evokes caretaking, cuddling, or an “aww” response.\nEvidence can include: Babies or visibly juvenile animals; disproportionately large eyes or head; round cheeks or face; small nose or mouth; tiny paws, limbs, or features; oversized ears; compact or chubby proportions; plushness; stuffed animals; cuddling; being held or cared for; shy, clumsy, dependent, trusting, or affection-seeking behavior; miniature versions of familiar things; cute costumes or accessories; and overt visual design intended to make a subject look precious, huggable, or childlike.\nHard non-qualifiers: Do not score Adorable merely because a subject is beautiful, attractive, smiling, friendly, harmless, pleasant, colorful, soft-lit, cozy, sentimental, feminine, small, young-looking, innocent-looking, or aesthetically pleasing. Smallness alone is not Adorable. Softness alone is not Adorable. Roundness alone is not Adorable. An animal or pet is not automatically Adorable. A cartoon or illustration is not automatically Adorable. A smiling or attractive adult is not Adorable without independent cuteness-specific evidence.\nAnti-fallback rule: Adorable must not be used as a safe default for positive images or as a substitute for Beautiful, Dreamy, Celebration, Zazzly, or general likability. If the image remains appealing after its specifically cute, juvenile, cuddly, vulnerable, or precious qualities are removed, that remaining appeal belongs to another reaction rather than Adorable.\n🧸 Emoji contribution: Teddy bears, stuffed animals, nursery objects, childhood keepsakes, cuddling, soft stuffed forms, being held or cared for, huggability, and sentimental affection reinforce Adorable only when they actively create cuteness, endearment, preciousness, cuddly appeal, or lovable vulnerability. Their mere presence is not sufficient."},{"id":"P02","name":"Beautiful","symbol":"✨","aiMeaning":"Aesthetic beauty from scenery, art, color, light, composition, harmony, symmetry, elegance, radiance, craftsmanship, architecture, design, polish, refinement, or overall visual presentation.\nHard boundary: Do not score Beautiful from a person's face, body, physique, skin, curves, musculature, clothing, pose, nudity, exposed skin, revealing or tight clothing, sensual presentation, or physical attractiveness. The presence or attractiveness of a person is not evidence for Beautiful. Human physical desirability and body-focused appeal belong to Zazzly.\nBeautiful may still score when non-human visual qualities of the image itself independently support it, such as scenery, composition, color, lighting, architecture, art, design, craftsmanship, symmetry, harmony, polish, or refinement."},{"id":"P03","name":"Tragic","symbol":"😭","aiMeaning":"Sadness, grief, loss, suffering, heartbreak, loneliness, helplessness, regret, emotional pain, sorrow, mourning, or sympathy for misfortune.\nEvidence can include: Crying, injury, death, abandonment, ruin, rejection, isolation, mourning, damaged relationships, painful circumstances, visible sorrow, grief-stricken expressions, or situations that evoke compassion for suffering.\n😭 Emoji contribution: Streaming tears, sobbing, emotional collapse, pleading expressions, devastation, heartbreak, helplessness, cathartic grief, painful emotional overflow, inconsolability, or being emotionally overwhelmed by suffering or loss can reinforce Tragic."},{"id":"P04","name":"Funny","symbol":"🤣","aiMeaning":"Humor, amusement, silliness, absurdity, comic surprise, awkward comedy, wit, ridiculousness, playful nonsense, or anything that provokes laughter.\nEvidence can include: Expressions, poses, comic mishaps, jokes, visual puns, incongruity, exaggeration, slapstick, meme-like situations, embarrassing moments, ridiculous reactions, or behavior whose absurdity or incongruity produces amusement.\n🤣 Emoji contribution: Doubled-over laughter, tears of laughter, losing composure, slapstick payoff, ridiculous reactions, meme exaggeration, explosive amusement, contagious laughter, punch-line energy, and scenes that feel impossible to take seriously can reinforce Funny."},{"id":"P05","name":"Intense","symbol":"💥","aiMeaning":"Force, energy, drama, urgency, extremity, power, impact, excitement, danger, speed, violence, passion, tension, chaos, pressure, adrenaline, volatility, sensory overload, or emotional extremity.\nEvidence can include: Explosions, action, confrontation, extreme expressions, dramatic motion, powerful bodies, storms, spectacle, high stakes, tense stand-offs, chaotic environments, sudden escalation, overwhelming sensory presence, or visually forceful scenes.\n💥 Emoji contribution: Explosions, collisions, impacts, crashes, strikes, bursts, breakage, shock waves, blasts, comic-book action marks, sudden escalation, kinetic force, loudness, urgency, disruption, and moments that visually land hard can reinforce Intense."},{"id":"P06","name":"Weird","symbol":"🌀","aiMeaning":"Strangeness, oddity, uncanniness, abnormality, eccentricity, unpredictability, surrealism, mutation, bizarre combinations, perceptual wrongness, or departure from ordinary expectations.\nEvidence can include: Unusual bodies, strange objects, impossible scenes, mismatched elements, distortions, peculiar behavior, unfamiliar forms, uncanny juxtapositions, reality-bending imagery, or anything that makes the viewer think “what the hell?”\n🌀 Emoji contribution: Spirals, vortices, whirlpools, warped perspective, trippy visual effects, looping motion, hypnosis imagery, dizziness, disorientation, perceptual instability, twisting forms, altered orientation, and a sense that reality is slipping out of alignment can reinforce Weird."},{"id":"P07","name":"Ticket","symbol":"🎟️","aiMeaning":"Inappropriate amusement, callousness, taboo enjoyment, schadenfreude, morbid fascination, cruel humor, social transgression, laughing at things that should not be funny, or emotional responses wildly opposed to what society considers acceptable. This captures enjoying cruelty, laughing at tragedy, amusement where empathy is expected, fascination with disturbing material, or reactions that sharply violate social norms.\nEvidence can include: Cruel or humiliating situations treated as entertainment, another person’s misfortune producing amusement, taboo spectacle, train-wreck fascination, vulgar or outrageous behavior, disturbing material that is compelling to watch, social boundary violations, or enjoyment that conflicts sharply with expected empathy or decorum.\n🎟️ Emoji contribution: Admission tickets, event entry, spectatorship, paying to watch, carnival or sideshow imagery, being granted a pass, and metaphorically buying admission to a questionable spectacle can reinforce Ticket through willing spectatorship, complicity, taboo entertainment, or attraction to material that violates social expectations."},{"id":"P08","name":"Dreamy","symbol":"🌌","aiMeaning":"Fantasy, reverie, wonder, escapism, imagination, enchantment, altered reality, surrealism, nostalgia, longing, dream-state, or otherworldliness.\nEvidence can include: Fantasy worlds, impossible landscapes, ethereal or unreal spaces, magical imagery, mist, stars, celestial vistas, altered environments, nostalgic imagery, imaginative transformations, distant horizons, contemplative unreality, dream logic, or scenes that feel transported beyond ordinary life.\n🌌 Emoji contribution: The Milky Way, stars, galaxies, deep night sky, cosmic landscapes, space, distant lights, celestial scale, infinity, mystery, transcendence, cosmic wonder, science-fiction vistas, human smallness before a vast universe, and transportive otherworldliness can reinforce Dreamy."},{"id":"P09","name":"Zazzly","symbol":"🌶️","aiMeaning":"Sexual salience, erotic appeal, physical desirability, horniness, seductive or provocative presentation, body-focused attraction, flirtation, sexual tension, or imagery likely to be perceived as sexy, hot, spicy, revealing, tempting, or turn-on oriented.\nEvidence includes nudity or partial nudity; exposed chest, breasts, nipples, buttocks, crotch, genitals, pubic area, torso, or abundant skin; prominently displayed sexually salient body parts or features such as pecs, abs, hips, thighs, legs, curves, musculature, physique, body proportions, or large or emphasized buttocks. It also includes tight or form-fitting clothing, leggings, compression wear, singlets, athletic outfits, uniforms, body-hugging costumes, underwear, lingerie, briefs, boxers, panties, thongs, jockstraps, bikinis, speedos, revealing swimwear, mesh, sheer clothing, towels, robes, bedsheet coverage, or clothing that reveals, frames, or emphasizes the body.\nBody-display routes include mirror selfies, nude or shirtless selfies, underwear selfies, gym, bathroom, or bedroom selfies, thirst traps, posed body shots, flexing, arching, spread or open-leg posing, chest-, butt-, crotch-, or physique-focused framing, and deliberate body display. Exposure routes include casual or public nudity, nude beaches, skinny-dipping, streaking, flashing, deliberate exposure, undressing, changing clothes, locker-room or shower scenes, towel scenes, wet skin, wet clothing, exhibitionistic display, or being intentionally seen naked or partly naked. Sensual routes include intimate or flirtatious gaze, teasing, provocative expressions, erotic or fetish styling, suggestive framing, seductive atmosphere, or visible sexual tension.\nExpansion rule: Zazzly does not require sexual activity, explicit arousal, a stereotypically seductive pose, fetish content, or an invitation to sex. Casual nudity independently supports Zazzly. Any mirror selfie independently supports at least some Zazzly because it is deliberate self-presentation and body display, even when fully clothed or not overtly sexual. Any adult body type may qualify when sexual or sensual presentation is visually emphasized. Beautiful may score separately for non-human aesthetics, but it must not replace or suppress Zazzly when sexual salience is present.\nAge gate: Apply sexualized Zazzly interpretation only to adult subjects. Do not infer sexual attractiveness or erotic appeal from minors.","publicMeaningHidden":true},{"id":"P10","name":"Disgusting","symbol":"🤢","aiMeaning":"Disgust, revulsion, nausea, contamination, filth, bodily aversion, decay, grossness, gross-out reaction, grotesque unpleasantness, moral revulsion, or an instinctive desire to recoil.\nEvidence can include: Rot, slime, wounds, bodily fluids, spoiled food, parasites, infection, excrement, gore, grime, malformed organic matter, contamination, foul substances, or anything viscerally gross.\n🤢 Emoji contribution: A nauseated face, sickness, gagging, queasiness, foul smells, spoiled food, poisoning, infection, toxic substances, bodily illness, rancidness, contamination, and cues that trigger physical recoil or a “that makes me sick” response can reinforce Disgusting."},{"id":"P11","name":"Scary","symbol":"👻","aiMeaning":"Fear, dread, unease, threat, suspense, vulnerability, danger, horror, paranoia, menace, foreboding, creepiness, alarm, or anticipation that something harmful or uncanny may happen.\nEvidence can include: Monsters, darkness, weapons, threatening people, isolation, disturbing faces, supernatural imagery, stalking, dangerous environments, ominous situations, unseen threats, predatory presence, eerie emptiness, or subtle wrongness.\n👻 Emoji contribution: Ghosts, spirits, apparitions, haunted places, spectral figures, paranormal presences, unseen watchers, Halloween imagery, death or afterlife imagery, jump-scare cues, spooky playfulness, eerie presence, haunting, supernatural unease, and something impossible appearing where it should not be can reinforce Scary."},{"id":"P12","name":"Smart","symbol":"🧠","aiMeaning":"Intelligence, thought, cognition, knowledge, cleverness, psychology, conceptual complexity, strategy, learning, insight, invention, ingenuity, reasoning, intellectual curiosity, mental effort, or fascination with how minds work.\nEvidence can include: Science, mathematics, books, puzzles, planning, symbolism, intellectual humor, psychological states, technical or computational reasoning, ingenious design, problem-solving, conceptual cleverness, visibly thoughtful behavior, learning, analysis, or evidence of deliberate mental work.\n🧠 Emoji contribution: The literal brain, anatomy, neuroscience, neural imagery, memory, cognition, consciousness, psychology, thought diagrams, brain scans, artificial intelligence, mind maps, “big brain” cleverness, overthinking, strategy, introspection, mental effort, and curiosity about how thought works can reinforce Smart."},{"id":"P13","name":"Celebration","symbol":"🎉","aiMeaning":"Happiness expressed through celebration, festivity, achievement, gathering, excitement, communal joy, triumph, revelry, applause, victory, milestones, special occasions, or marking something positively significant.\nEvidence can include: Parties, cheering, dancing, birthdays, holidays, weddings, trophies, confetti, decorations, crowds, congratulations, victories, launches, awards, good-news announcements, milestone moments, or ceremonies and rituals presented as celebratory.\n🎉 Emoji contribution: Party poppers, confetti, streamers, congratulatory bursts, surprise announcements, party supplies, victories, birthdays, milestones, launches, applause, achievements, “yay!” energy, and visible moments of good news or success can reinforce Celebration."},{"id":"P14","name":"Angry","symbol":"🤬","aiMeaning":"Anger, annoyance, irritation, aggravation, frustration, hostility, resentment, defiance, confrontation, outrage, aggression, rage, feeling fed up, or the reaction that something “pisses you off.”\nEvidence can include: Annoyed or furious expressions, yelling, arguing, clenched fists, hostile gestures, threats, fighting, destruction, revenge behavior, protest, intimidation, antagonism, simmering resentment, visible frustration, or escalating confrontation.\n🤬 Emoji contribution: An enraged face, censored symbols over the mouth, shouting, profanity, swearing, rants, insults, verbal confrontation, explosive facial expressions, exasperation, being fed up, loss of polite restraint, censored verbal aggression, and cartoon rage can reinforce Angry across the spectrum from irritation to fury."}],"fusions":[{"code":"PFM0102","name":"Cozy","primIds":["P01","P02"],"matrixVersion":"0.0.0.0","aiMeaning":"Comforting, snug, warm, sheltered, or inviting; soft textures, warm lighting, blankets, relaxed intimate settings, or a feeling of ease, rest, or pleasant closeness."},{"code":"PFM0103","name":"Pitiful","primIds":["P01","P03"],"matrixVersion":"0.0.0.0","aiMeaning":"Arousing sympathy or compassion through visible helplessness, suffering, misfortune, weakness, neglect, injury, abandonment, or pleading."},{"code":"PFM0104","name":"Goofy","primIds":["P01","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Silly, awkward, playful, foolish, or ridiculous in an amusing way; exaggerated expressions, clumsy antics, or playful visual absurdity."},{"code":"PFM0105","name":"Joy","primIds":["P01","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Happiness, delight, pleasure, or emotional uplift shown through smiling, laughter, delighted expressions, playful pleasure, or visible enjoyment."},{"code":"PFM0106","name":"Bizarre","primIds":["P01","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Strange, unusual, unexpected, peculiar; improbable combinations, anomalous forms, or unexplained oddities."},{"code":"PFM0107","name":"Camp","primIds":["P01","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Exaggerated, theatrical, artificial, flamboyant, kitschy, or knowingly excessive styling and presentation."},{"code":"PFM0108","name":"Whimsical","primIds":["P01","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Fanciful, playful, imaginative, lightly odd, or guided by charming logic; fantasy details, charming oddities, or impossible elements."},{"code":"PFM0109","name":"Kawaii","primIds":["P01","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Highly stylized Japanese cute aesthetic using exaggerated sweetness or toy-like, childlike, or chibi-style proportions."},{"code":"PFM0110","name":"Grimy","primIds":["P01","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Dirty, soiled, greasy, dingy, stained, or neglected; visible dirt, grease, soot, residue, or accumulated grime on surfaces."},{"code":"PFM0111","name":"CreepyCute","primIds":["P01","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Cute and unsettling at once; Halloween fun. Appealing subjects combined with eerie, spooky, uncanny, or disturbing features."},{"code":"PFM0112","name":"Innocence","primIds":["P01","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Openness, inexperience, trust, simplicity, or freedom from corruption; childlike expressions, gentleness, or naive imagery."},{"code":"PFM0113","name":"Playful","primIds":["P01","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Lighthearted, mischievous, teasing, game-like, curious, or inclined toward fun and experimentation; games, toys, teasing gestures, or spontaneous fun."},{"code":"PFM0114","name":"Saccharine","primIds":["P01","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Excessively sweet, sentimental, precious, or cutesy to the point of irritation; sugary, pastel, cloying, aggressively sweet imagery."},{"code":"PFM0203","name":"Melancholic","primIds":["P02","P03"],"matrixVersion":"0.0.0.0","aiMeaning":"Sad, wistful, reflective, or touched by longing and loss; downcast expressions, solitude, rain, fading light, or emotional heaviness."},{"code":"PFM0204","name":"Charming","primIds":["P02","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasantly attractive, likable, engaging, or delightful in a way that wins affection; inviting expressions, warmth, approachable elegance, or pleasing details."},{"code":"PFM0205","name":"Majestic","primIds":["P02","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Grand, dignified, regal, imposing, or awe-inspiring in scale, presence, or bearing; symmetry, noble posture, stately beauty, or impressive scenery."},{"code":"PFM0206","name":"Surreal","primIds":["P02","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Dreamlike, impossible, uncanny, or illogical in an altered reality; distorted scale, impossible spaces, or unexpected object combinations."},{"code":"PFM0207","name":"Irreverent","primIds":["P02","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Disrespectful, cheeky, mocking, or dismissive toward seriousness, convention, authority, or decorum; visual disrespect toward sacred, formal, or authoritative symbols."},{"code":"PFM0208","name":"Romance","primIds":["P02","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Affection, longing, intimacy, courtship, tenderness, or romantic attraction; couples, affectionate gestures, closeness, or romantic settings."},{"code":"PFM0209","name":"Exposure","primIds":["P02","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Being naked, indecently revealed, or too visibly exposed, especially in ways that feel shameful, embarrassing, humiliating, or sexually charged; visible nudity, uncovered body parts, flashing, revealing poses, or accidental bodily exposure."},{"code":"PFM0210","name":"Grotesque","primIds":["P02","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Whimsical or ornamental distortion mixing beauty, absurdity, or unease; hybrid human, animal, or plant forms, exaggerated features, decorative symmetry, or playful violations of natural law."},{"code":"PFM0211","name":"Vulnerable","primIds":["P02","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Exposed to harm, rejection, injury, loss, or emotional pain; defenseless posture, exposed emotion, isolation, or injury."},{"code":"PFM0212","name":"Elegant","primIds":["P02","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Graceful, refined, tasteful, polished, restrained, or well composed; sophisticated detail, balanced composition, graceful forms, or controlled styling."},{"code":"PFM0213","name":"Festive","primIds":["P02","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Marked by celebration, holidays, ceremonies, or special occasions; decorations, costumes, lights, ornaments, seasonal styling, or celebratory settings."},{"code":"PFM0214","name":"Pretentious","primIds":["P02","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Affected, self-important, showy, or overly cultured or significant; conspicuous status display and affected refinement."},{"code":"PFM0304","name":"Ironic","primIds":["P03","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Tragic or unfortunate situations made funny through unexpected contrast, reversal, or coincidence. Or happy situations ruined by an unexpected reversal."},{"code":"PFM0305","name":"Devastating","primIds":["P03","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Causing profound damage, loss, grief, shock, defeat, or emotional destruction; catastrophic ruin, collapse, severe aftermath, or overwhelming loss."},{"code":"PFM0306","name":"Nightmarish","primIds":["P03","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Resembling a nightmare; frightening, disturbing, unreal, oppressive, or horrifying, with dream logic, threatening distortions, darkness, or impossible danger."},{"code":"PFM0307","name":"Shame","primIds":["P03","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Painful self-conscious disgrace, embarrassment, exposure, or feeling unworthy, judged, or wanting to hide; averted gaze, covered face, hiding posture, blushing, shrinking, or visibly caught embarrassment."},{"code":"PFM0308","name":"Liminal","primIds":["P03","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Backrooms-style environmental uncanniness: familiar human-built spaces that feel strangely vacant, abandoned, repetitive, transitional, maze-like, displaced, or unnaturally extended beyond their normal purpose. Evidence can include long or repeating corridors; empty hotels, malls, schools, hospitals, offices, airports, cruise-ship passageways, waiting areas, stairwells, parking structures, playgrounds, pools or poolrooms; institutional architecture; repetitive rooms or surfaces; abandoned-looking public spaces; spaces designed for crowds or activity that are unexpectedly deserted; unusual spatial continuity, scale, sameness, or implied endlessness. Required gate: The environment itself must create the liminal effect through architecture, vacancy, repetition, transition, abandonment, spatial wrongness, or unexpected absence of normal human activity. Hard non-qualifiers: Do not score Liminal merely because an image has no people, is dark, eerie, weird, empty, indoors, abandoned-looking, or unfamiliar. An ordinary empty room is not automatically Liminal. Darkness alone is not Liminal. A strange person or unusual event inside an otherwise normal location does not make the location Liminal."},{"code":"PFM0309","name":"Humiliation","primIds":["P03","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Being demeaned, degraded, ridiculed, exposed, rejected, or stripped of dignity by others or events; pointing or laughing onlookers, forced exposure, defeated posture, visible embarrassment, or submission."},{"code":"PFM0310","name":"Despair","primIds":["P03","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Hopelessness, anguish, defeat, or the sense that relief or improvement has disappeared; collapsed posture, ruin, isolation, or hopeless expressions."},{"code":"PFM0311","name":"Foreboding","primIds":["P03","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Uneasy expectation that danger, trouble, harm, or an unwanted event is approaching; ominous shadows, stormy skies, suspense, or approaching threat."},{"code":"PFM0312","name":"Poignant","primIds":["P03","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Emotionally affecting through tenderness, sadness, meaning, or reflection; fragile moments, remembrance, meaningful loss, or emotional stillness."},{"code":"PFM0313","name":"Bittersweet","primIds":["P03","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasure and sadness experienced together; joyful imagery touched by loss, nostalgia, farewell, memory, or impermanence."},{"code":"PFM0314","name":"Dysphoria","primIds":["P03","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Distress, dissatisfaction, unease, or disconnection involving self, body, identity, mood, or circumstance; bodily discomfort, alienation, or self-disconnection."},{"code":"PFM0405","name":"Cringe","primIds":["P04","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Painful awkwardness or embarrassment that causes secondhand discomfort; social blunders, failed interactions, awkward expressions, or embarrassing poses."},{"code":"PFM0406","name":"Zany","primIds":["P04","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Eccentric, unconventional, comically strange, or offbeat; mismatched costumes, unusual poses, frantic antics, or energetic comic behavior."},{"code":"PFM0407","name":"Satirical","primIds":["P04","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Using humor, irony, exaggeration, or ridicule to expose or criticize faults, behavior, institutions, or ideas; visual mockery of politics, culture, or social conventions."},{"code":"PFM0408","name":"Absurd","primIds":["P04","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Illogical, ridiculous, contradictory, pointless, impossible, or incompatible with ordinary sense; nonsensical juxtapositions, impossible logic, or ridiculous contradictions."},{"code":"PFM0409","name":"Ribaldry","primIds":["P04","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Coarse, bawdy, or sexually suggestive humor; sexual jokes, innuendo, vulgar comedy, bawdy gestures, or suggestive comic situations."},{"code":"PFM0410","name":"Grossout","primIds":["P04","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Humor or spectacle built around filth, bodily functions, fluids, decay, gore, or revulsion; vomit, excrement, bodily fluids, or gross material used comically."},{"code":"PFM0411","name":"Comedy Horror","primIds":["P04","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Frightening or macabre material blended with humor, parody, absurdity, slapstick, jokes, or comic relief."},{"code":"PFM0412","name":"Witty","primIds":["P04","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Clever, quick, inventive, or skillful humor and insight; visual puns, layered references, wordplay, or ingenious humorous juxtapositions."},{"code":"PFM0413","name":"PartyTime","primIds":["P04","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Active social celebration centered on revelry, fun, gathering, or excitement; dancing, cheering, crowds, drinks, decorations, music, or confetti."},{"code":"PFM0414","name":"Trolling","primIds":["P04","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Provoking, baiting, mocking, annoying, or misleading others for amusement or reaction; antagonistic jokes, mocking memes, baiting signs, or provocative gestures."},{"code":"PFM0506","name":"Chaotic","primIds":["P05","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Disordered, unstable, crowded, conflicting, or lacking control or organization; scattered objects, unstable motion, visual overload, or competing elements."},{"code":"PFM0507","name":"Outrageous","primIds":["P05","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Shockingly excessive, bold, offensive, audacious, unconventional, or beyond restraint; extreme styling, taboo-breaking, flamboyance, or audacious behavior."},{"code":"PFM0508","name":"Epic","primIds":["P05","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Grand, heroic, or massive in scale, consequence, duration, drama, adventure, struggle, achievement, or spectacle; monumental scenery, heroic action, or high stakes."},{"code":"PFM0509","name":"Lust","primIds":["P05","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexual desire, appetite, craving, fixation, or physical attraction; desirous gazes, sensual bodies, erotic focus, or visible craving."},{"code":"PFM0510","name":"Brutal","primIds":["P05","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Harsh, violent, cruel, punishing, damaging, or unsparing in force or effect; severe injury, destruction, cruelty, or punishing conditions."},{"code":"PFM0511","name":"Terror","primIds":["P05","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Extreme fear, alarm, panic, dread, or immediate danger; terrified expressions, fleeing, overwhelming threat, or visible panic."},{"code":"PFM0512","name":"Brilliant","primIds":["P05","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Clever, inventive, insightful, creative, effective, or intellectually impressive; ingenious designs, exceptional craftsmanship, inventive solutions, or impressive execution."},{"code":"PFM0513","name":"Pride","primIds":["P05","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Satisfaction, self-respect, dignity, or affirmation tied to achievement, identity, belonging, or worth; gay or LGBT imagery; confident posture, identity symbols, or dignified self-presentation."},{"code":"PFM0514","name":"Aggressive","primIds":["P05","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Confrontational, forceful, hostile, threatening, domineering, or ready to attack; attack gestures, weapons, intimidation, forceful motion, or threatening posture."},{"code":"PFM0607","name":"Freakshow","primIds":["P06","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Bizarre or unsettling spectacle that provokes fascinated, guilty enjoyment; shocking anomalies, unusual performers, carnival-like display, or gawking attention."},{"code":"PFM0608","name":"Psychedelic","primIds":["P06","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Hallucinatory, sensory-rich, perception-bending, or suggestive of expanded or distorted consciousness; vivid colors, swirling patterns, fractals, or hallucination-like effects."},{"code":"PFM0609","name":"FreakyDeaky","primIds":["P06","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually playful, unconventional, eccentric, uninhibited, or erotic with an oddball edge; strange erotic styling, playful erotic imagery, or unconventional sexual presentation."},{"code":"PFM0610","name":"Mutant","primIds":["P06","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Biological form altered from a known prototype through mutation, radiation, chemicals, genetics, abnormal development, hybridization, or evolution; extra limbs, altered organs, abnormal growths, or techno-organic fusion."},{"code":"PFM0611","name":"Macabre","primIds":["P06","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Gothic morbidity centered on death, corpses, decay, mortality, funerary imagery, or morbid fascination; skulls, graves, death rituals, or ornate morbid decoration."},{"code":"PFM0612","name":"Alien","primIds":["P06","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Strange, foreign, unfamiliar, or nonhuman; suggesting intelligence, biology, places, or forms outside ordinary human experience. Unfamiliar beings, strange anatomy, spacecraft, foreign environments, otherworldly landscapes, or unfamiliar technology."},{"code":"PFM0613","name":"Delirious","primIds":["P06","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Disoriented, feverish, ecstatic, manic, confused, or detached from stable reality; hallucinations, unstable visual reality, feverish expressions, or ecstatic chaos."},{"code":"PFM0614","name":"Monstrous","primIds":["P06","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Awe-inspiring unnatural threat defined by immense scale, predation, mythic power, or eldritch otherness; colossal creatures, chimeric anatomy, predatory weapons, and impossible features."},{"code":"PFM0708","name":"Medicated","primIds":["P07","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Altered, softened, detached, or chemically influenced consciousness or perception; drowsy eyes, softened expressions, detached gaze, pills, or clinical sedation cues."},{"code":"PFM0709","name":"Exploitation","primIds":["P07","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Using people, bodies, suffering, taboo, shock, or sensational material for advantage, attention, profit, or gratification; objectification, commodification, or spectacle built from others."},{"code":"PFM0710","name":"Tasteless","primIds":["P07","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Vulgar, crude, offensive, insensitive, indecent, or lacking judgment or restraint; socially or aesthetically offensive imagery or insensitive presentation."},{"code":"PFM0711","name":"Execrable","primIds":["P07","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Hateful, detestable, contemptible, vile, cruel, or deserving condemnation; deliberately abhorrent content or visible malice."},{"code":"PFM0712","name":"Parodic","primIds":["P07","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Imitating a recognizable style, work, person, or convention through exaggeration, distortion, mockery, or comic transformation."},{"code":"PFM0713","name":"Snarky","primIds":["P07","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Sarcastic, cutting, mocking, dismissive, or contemptuous humor; eye-rolls, smirks, mocking gestures, sarcastic captions, or dismissive commentary."},{"code":"PFM0714","name":"Wickedness","primIds":["P07","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Wrongdoing, cruelty, malice, corruption, immorality, or pleasure in harmful behavior; deliberate harm, malicious intent, corruption, or gleeful wrongdoing."},{"code":"PFM0809","name":"Limerence","primIds":["P08","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Romantic infatuation marked by longing, idealization, uncertainty, fantasy, or desire for reciprocation; idealized crush imagery, fixation, longing gazes, or unreciprocated yearning."},{"code":"PFM0810","name":"Putrid","primIds":["P08","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Rotten, decaying, foul, contaminated, corrupt, or unpleasant; decomposition, mold, slime, spoiled matter, or contamination."},{"code":"PFM0811","name":"Eerie","primIds":["P08","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Unsettling, haunting, uncanny, quiet, mysterious, or suggestive that something is wrong; strange shadows, emptiness, haunting stillness, or subtle wrongness."},{"code":"PFM0812","name":"Ethereal","primIds":["P08","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Airy, delicate, luminous, weightless, otherworldly, or removed from ordinary physical substance; soft glow, translucence, mist, or delicate forms."},{"code":"PFM0813","name":"Magical","primIds":["P08","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Enchanting, supernatural, wondrous, impossible, or governed by forces from a different reality; spells, glowing effects, impossible transformations, enchanted beings, or supernatural phenomena."},{"code":"PFM0814","name":"Phantasmagoric","primIds":["P08","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Elaborate grotesque fantasy with bizarre creatures, impossible forms, or disturbing imagery."},{"code":"PFM0910","name":"Lewd","primIds":["P09","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually explicit, vulgar, indecent, crude, suggestive, or offensively erotic; explicit exposure, crude sexual gestures, vulgar erotic jokes, or indecent posing."},{"code":"PFM0911","name":"Seduction","primIds":["P09","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Attraction created through allure, temptation, mystery, danger, or sexual invitation; alluring poses, intimate gaze, revealing styling, or a dangerous sensual atmosphere."},{"code":"PFM0912","name":"Kinky","primIds":["P09","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually unconventional, fetish-oriented, experimental, role-based, or involving nonstandard preferences or practices; fetish attire, bondage cues, role-play, or unconventional erotic props."},{"code":"PFM0913","name":"Hedonism","primIds":["P09","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasure, gratification, sensual enjoyment, luxury, appetite, or indulgence elevated into an atmosphere or lifestyle; feasting, partying, lavish consumption, sensual abundance, or decadent excess."},{"code":"PFM0914","name":"Sadomasochism","primIds":["P09","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Erotic pleasure involving pain, domination, submission, humiliation, control, or suffering; bondage, power exchange, or controlled physical pain."},{"code":"PFM1011","name":"Horror","primIds":["P10","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Fear, dread, shock, or revulsion produced by disturbing, threatening, grotesque, supernatural, or violent material; monsters, gore, frightening scenes, or supernatural danger."},{"code":"PFM1012","name":"Greed","primIds":["P10","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Excessive desire to possess, acquire, keep, or control wealth, resources, status, power, or advantage; hoarding, grabbing valuables, status fixation, or acquisitiveness."},{"code":"PFM1013","name":"Indulgent","primIds":["P10","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Permissive toward pleasure, appetite, comfort, luxury, excess, or personal gratification; rich food, lounging, pampering, luxury, or overconsumption."},{"code":"PFM1014","name":"Repulsive","primIds":["P10","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Immediate visceral disgust caused by decay, contamination, bodily fluids, wounds, infection, or organic breakdown; rotting flesh, pus, vomit, lesions, parasites, or formless slime."},{"code":"PFM1112","name":"Paranoia","primIds":["P11","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Persistent suspicion or fear of harm, deception, surveillance, persecution, or hidden threat; watchful fear, suspicious glances, defensive behavior, or surveillance imagery."},{"code":"PFM1113","name":"Spirituality","primIds":["P11","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Meaning, transcendence, sacredness, inner life, faith, ritual, or connection beyond ordinary material existence; prayer, meditation, worship, sacred symbols, or mystical connection."},{"code":"PFM1114","name":"Violated","primIds":["P11","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"A boundary, body, trust, right, safety, privacy, or autonomy invaded or broken; forced intrusion, damaged privacy, assault aftermath, or breached safety."},{"code":"PFM1213","name":"Glory","primIds":["P12","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Honor, acclaim, valor, prestige, or celebrated achievement; trophies, medals, military honors, victory displays, heroic poses, or public recognition."},{"code":"PFM1214","name":"Obsessive","primIds":["P12","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Fixated, compulsive, preoccupied, repetitive, or unable to release attention from a person, idea, goal, or concern; repeated patterns, hoarding, compulsive arrangement, or relentless focus."},{"code":"PFM1314","name":"Revenge","primIds":["P13","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Retaliation, payback, punishment, or action answering a perceived wrong or injury; retaliatory acts, targeting offenders, punishment, or settling scores."}],"themeChoices":[{"code":"P01","name":"Adorable","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P02","name":"Beautiful","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P03","name":"Tragic","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P04","name":"Funny","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P05","name":"Intense","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P06","name":"Weird","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P07","name":"Ticket","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P08","name":"Dreamy","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P09","name":"Zazzly","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P10","name":"Disgusting","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P11","name":"Scary","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P12","name":"Smart","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P13","name":"Celebration","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P14","name":"Angry","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"PFM0102","name":"Cozy","kind":"fusion","primIds":["P01","P02"],"matrixVersion":"0.0.0.0","aiMeaning":"Comforting, snug, warm, sheltered, or inviting; soft textures, warm lighting, blankets, relaxed intimate settings, or a feeling of ease, rest, or pleasant closeness."},{"code":"PFM0103","name":"Pitiful","kind":"fusion","primIds":["P01","P03"],"matrixVersion":"0.0.0.0","aiMeaning":"Arousing sympathy or compassion through visible helplessness, suffering, misfortune, weakness, neglect, injury, abandonment, or pleading."},{"code":"PFM0104","name":"Goofy","kind":"fusion","primIds":["P01","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Silly, awkward, playful, foolish, or ridiculous in an amusing way; exaggerated expressions, clumsy antics, or playful visual absurdity."},{"code":"PFM0105","name":"Joy","kind":"fusion","primIds":["P01","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Happiness, delight, pleasure, or emotional uplift shown through smiling, laughter, delighted expressions, playful pleasure, or visible enjoyment."},{"code":"PFM0106","name":"Bizarre","kind":"fusion","primIds":["P01","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Strange, unusual, unexpected, peculiar; improbable combinations, anomalous forms, or unexplained oddities."},{"code":"PFM0107","name":"Camp","kind":"fusion","primIds":["P01","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Exaggerated, theatrical, artificial, flamboyant, kitschy, or knowingly excessive styling and presentation."},{"code":"PFM0108","name":"Whimsical","kind":"fusion","primIds":["P01","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Fanciful, playful, imaginative, lightly odd, or guided by charming logic; fantasy details, charming oddities, or impossible elements."},{"code":"PFM0109","name":"Kawaii","kind":"fusion","primIds":["P01","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Highly stylized Japanese cute aesthetic using exaggerated sweetness or toy-like, childlike, or chibi-style proportions."},{"code":"PFM0110","name":"Grimy","kind":"fusion","primIds":["P01","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Dirty, soiled, greasy, dingy, stained, or neglected; visible dirt, grease, soot, residue, or accumulated grime on surfaces."},{"code":"PFM0111","name":"CreepyCute","kind":"fusion","primIds":["P01","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Cute and unsettling at once; Halloween fun. Appealing subjects combined with eerie, spooky, uncanny, or disturbing features."},{"code":"PFM0112","name":"Innocence","kind":"fusion","primIds":["P01","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Openness, inexperience, trust, simplicity, or freedom from corruption; childlike expressions, gentleness, or naive imagery."},{"code":"PFM0113","name":"Playful","kind":"fusion","primIds":["P01","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Lighthearted, mischievous, teasing, game-like, curious, or inclined toward fun and experimentation; games, toys, teasing gestures, or spontaneous fun."},{"code":"PFM0114","name":"Saccharine","kind":"fusion","primIds":["P01","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Excessively sweet, sentimental, precious, or cutesy to the point of irritation; sugary, pastel, cloying, aggressively sweet imagery."},{"code":"PFM0203","name":"Melancholic","kind":"fusion","primIds":["P02","P03"],"matrixVersion":"0.0.0.0","aiMeaning":"Sad, wistful, reflective, or touched by longing and loss; downcast expressions, solitude, rain, fading light, or emotional heaviness."},{"code":"PFM0204","name":"Charming","kind":"fusion","primIds":["P02","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasantly attractive, likable, engaging, or delightful in a way that wins affection; inviting expressions, warmth, approachable elegance, or pleasing details."},{"code":"PFM0205","name":"Majestic","kind":"fusion","primIds":["P02","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Grand, dignified, regal, imposing, or awe-inspiring in scale, presence, or bearing; symmetry, noble posture, stately beauty, or impressive scenery."},{"code":"PFM0206","name":"Surreal","kind":"fusion","primIds":["P02","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Dreamlike, impossible, uncanny, or illogical in an altered reality; distorted scale, impossible spaces, or unexpected object combinations."},{"code":"PFM0207","name":"Irreverent","kind":"fusion","primIds":["P02","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Disrespectful, cheeky, mocking, or dismissive toward seriousness, convention, authority, or decorum; visual disrespect toward sacred, formal, or authoritative symbols."},{"code":"PFM0208","name":"Romance","kind":"fusion","primIds":["P02","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Affection, longing, intimacy, courtship, tenderness, or romantic attraction; couples, affectionate gestures, closeness, or romantic settings."},{"code":"PFM0209","name":"Exposure","kind":"fusion","primIds":["P02","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Being naked, indecently revealed, or too visibly exposed, especially in ways that feel shameful, embarrassing, humiliating, or sexually charged; visible nudity, uncovered body parts, flashing, revealing poses, or accidental bodily exposure."},{"code":"PFM0210","name":"Grotesque","kind":"fusion","primIds":["P02","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Whimsical or ornamental distortion mixing beauty, absurdity, or unease; hybrid human, animal, or plant forms, exaggerated features, decorative symmetry, or playful violations of natural law."},{"code":"PFM0211","name":"Vulnerable","kind":"fusion","primIds":["P02","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Exposed to harm, rejection, injury, loss, or emotional pain; defenseless posture, exposed emotion, isolation, or injury."},{"code":"PFM0212","name":"Elegant","kind":"fusion","primIds":["P02","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Graceful, refined, tasteful, polished, restrained, or well composed; sophisticated detail, balanced composition, graceful forms, or controlled styling."},{"code":"PFM0213","name":"Festive","kind":"fusion","primIds":["P02","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Marked by celebration, holidays, ceremonies, or special occasions; decorations, costumes, lights, ornaments, seasonal styling, or celebratory settings."},{"code":"PFM0214","name":"Pretentious","kind":"fusion","primIds":["P02","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Affected, self-important, showy, or overly cultured or significant; conspicuous status display and affected refinement."},{"code":"PFM0304","name":"Ironic","kind":"fusion","primIds":["P03","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Tragic or unfortunate situations made funny through unexpected contrast, reversal, or coincidence. Or happy situations ruined by an unexpected reversal."},{"code":"PFM0305","name":"Devastating","kind":"fusion","primIds":["P03","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Causing profound damage, loss, grief, shock, defeat, or emotional destruction; catastrophic ruin, collapse, severe aftermath, or overwhelming loss."},{"code":"PFM0306","name":"Nightmarish","kind":"fusion","primIds":["P03","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Resembling a nightmare; frightening, disturbing, unreal, oppressive, or horrifying, with dream logic, threatening distortions, darkness, or impossible danger."},{"code":"PFM0307","name":"Shame","kind":"fusion","primIds":["P03","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Painful self-conscious disgrace, embarrassment, exposure, or feeling unworthy, judged, or wanting to hide; averted gaze, covered face, hiding posture, blushing, shrinking, or visibly caught embarrassment."},{"code":"PFM0308","name":"Liminal","kind":"fusion","primIds":["P03","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Vast, lonely spaces with sparse objects or people; emptiness, isolation, corridors, thresholds, sparse interiors, or uncanny stillness."},{"code":"PFM0309","name":"Humiliation","kind":"fusion","primIds":["P03","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Being demeaned, degraded, ridiculed, exposed, rejected, or stripped of dignity by others or events; pointing or laughing onlookers, forced exposure, defeated posture, visible embarrassment, or submission."},{"code":"PFM0310","name":"Despair","kind":"fusion","primIds":["P03","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Hopelessness, anguish, defeat, or the sense that relief or improvement has disappeared; collapsed posture, ruin, isolation, or hopeless expressions."},{"code":"PFM0311","name":"Foreboding","kind":"fusion","primIds":["P03","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Uneasy expectation that danger, trouble, harm, or an unwanted event is approaching; ominous shadows, stormy skies, suspense, or approaching threat."},{"code":"PFM0312","name":"Poignant","kind":"fusion","primIds":["P03","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Emotionally affecting through tenderness, sadness, meaning, or reflection; fragile moments, remembrance, meaningful loss, or emotional stillness."},{"code":"PFM0313","name":"Bittersweet","kind":"fusion","primIds":["P03","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasure and sadness experienced together; joyful imagery touched by loss, nostalgia, farewell, memory, or impermanence."},{"code":"PFM0314","name":"Dysphoria","kind":"fusion","primIds":["P03","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Distress, dissatisfaction, unease, or disconnection involving self, body, identity, mood, or circumstance; bodily discomfort, alienation, or self-disconnection."},{"code":"PFM0405","name":"Cringe","kind":"fusion","primIds":["P04","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Painful awkwardness or embarrassment that causes secondhand discomfort; social blunders, failed interactions, awkward expressions, or embarrassing poses."},{"code":"PFM0406","name":"Zany","kind":"fusion","primIds":["P04","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Eccentric, unconventional, comically strange, or offbeat; mismatched costumes, unusual poses, frantic antics, or energetic comic behavior."},{"code":"PFM0407","name":"Satirical","kind":"fusion","primIds":["P04","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Using humor, irony, exaggeration, or ridicule to expose or criticize faults, behavior, institutions, or ideas; visual mockery of politics, culture, or social conventions."},{"code":"PFM0408","name":"Absurd","kind":"fusion","primIds":["P04","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Illogical, ridiculous, contradictory, pointless, impossible, or incompatible with ordinary sense; nonsensical juxtapositions, impossible logic, or ridiculous contradictions."},{"code":"PFM0409","name":"Ribaldry","kind":"fusion","primIds":["P04","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Coarse, bawdy, or sexually suggestive humor; sexual jokes, innuendo, vulgar comedy, bawdy gestures, or suggestive comic situations."},{"code":"PFM0410","name":"Grossout","kind":"fusion","primIds":["P04","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Humor or spectacle built around filth, bodily functions, fluids, decay, gore, or revulsion; vomit, excrement, bodily fluids, or gross material used comically."},{"code":"PFM0411","name":"Comedy Horror","kind":"fusion","primIds":["P04","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Frightening or macabre material blended with humor, parody, absurdity, slapstick, jokes, or comic relief."},{"code":"PFM0412","name":"Witty","kind":"fusion","primIds":["P04","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Clever, quick, inventive, or skillful humor and insight; visual puns, layered references, wordplay, or ingenious humorous juxtapositions."},{"code":"PFM0413","name":"PartyTime","kind":"fusion","primIds":["P04","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Active social celebration centered on revelry, fun, gathering, or excitement; dancing, cheering, crowds, drinks, decorations, music, or confetti."},{"code":"PFM0414","name":"Trolling","kind":"fusion","primIds":["P04","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Provoking, baiting, mocking, annoying, or misleading others for amusement or reaction; antagonistic jokes, mocking memes, baiting signs, or provocative gestures."},{"code":"PFM0506","name":"Chaotic","kind":"fusion","primIds":["P05","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Disordered, unstable, crowded, conflicting, or lacking control or organization; scattered objects, unstable motion, visual overload, or competing elements."},{"code":"PFM0507","name":"Outrageous","kind":"fusion","primIds":["P05","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Shockingly excessive, bold, offensive, audacious, unconventional, or beyond restraint; extreme styling, taboo-breaking, flamboyance, or audacious behavior."},{"code":"PFM0508","name":"Epic","kind":"fusion","primIds":["P05","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Grand, heroic, or massive in scale, consequence, duration, drama, adventure, struggle, achievement, or spectacle; monumental scenery, heroic action, or high stakes."},{"code":"PFM0509","name":"Lust","kind":"fusion","primIds":["P05","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexual desire, appetite, craving, fixation, or physical attraction; desirous gazes, sensual bodies, erotic focus, or visible craving."},{"code":"PFM0510","name":"Brutal","kind":"fusion","primIds":["P05","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Harsh, violent, cruel, punishing, damaging, or unsparing in force or effect; severe injury, destruction, cruelty, or punishing conditions."},{"code":"PFM0511","name":"Terror","kind":"fusion","primIds":["P05","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Extreme fear, alarm, panic, dread, or immediate danger; terrified expressions, fleeing, overwhelming threat, or visible panic."},{"code":"PFM0512","name":"Brilliant","kind":"fusion","primIds":["P05","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Clever, inventive, insightful, creative, effective, or intellectually impressive; ingenious designs, exceptional craftsmanship, inventive solutions, or impressive execution."},{"code":"PFM0513","name":"Pride","kind":"fusion","primIds":["P05","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Satisfaction, self-respect, dignity, or affirmation tied to achievement, identity, belonging, or worth; gay or LGBT imagery; confident posture, identity symbols, or dignified self-presentation."},{"code":"PFM0514","name":"Aggressive","kind":"fusion","primIds":["P05","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Confrontational, forceful, hostile, threatening, domineering, or ready to attack; attack gestures, weapons, intimidation, forceful motion, or threatening posture."},{"code":"PFM0607","name":"Freakshow","kind":"fusion","primIds":["P06","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Bizarre or unsettling spectacle that provokes fascinated, guilty enjoyment; shocking anomalies, unusual performers, carnival-like display, or gawking attention."},{"code":"PFM0608","name":"Psychedelic","kind":"fusion","primIds":["P06","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Hallucinatory, sensory-rich, perception-bending, or suggestive of expanded or distorted consciousness; vivid colors, swirling patterns, fractals, or hallucination-like effects."},{"code":"PFM0609","name":"FreakyDeaky","kind":"fusion","primIds":["P06","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually playful, unconventional, eccentric, uninhibited, or erotic with an oddball edge; strange erotic styling, playful erotic imagery, or unconventional sexual presentation."},{"code":"PFM0610","name":"Mutant","kind":"fusion","primIds":["P06","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Biological form altered from a known prototype through mutation, radiation, chemicals, genetics, abnormal development, hybridization, or evolution; extra limbs, altered organs, abnormal growths, or techno-organic fusion."},{"code":"PFM0611","name":"Macabre","kind":"fusion","primIds":["P06","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Gothic morbidity centered on death, corpses, decay, mortality, funerary imagery, or morbid fascination; skulls, graves, death rituals, or ornate morbid decoration."},{"code":"PFM0612","name":"Alien","kind":"fusion","primIds":["P06","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Strange, foreign, unfamiliar, or nonhuman; suggesting intelligence, biology, places, or forms outside ordinary human experience. Unfamiliar beings, strange anatomy, spacecraft, foreign environments, otherworldly landscapes, or unfamiliar technology."},{"code":"PFM0613","name":"Delirious","kind":"fusion","primIds":["P06","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Disoriented, feverish, ecstatic, manic, confused, or detached from stable reality; hallucinations, unstable visual reality, feverish expressions, or ecstatic chaos."},{"code":"PFM0614","name":"Monstrous","kind":"fusion","primIds":["P06","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Awe-inspiring unnatural threat defined by immense scale, predation, mythic power, or eldritch otherness; colossal creatures, chimeric anatomy, predatory weapons, and impossible features."},{"code":"PFM0708","name":"Medicated","kind":"fusion","primIds":["P07","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Altered, softened, detached, or chemically influenced consciousness or perception; drowsy eyes, softened expressions, detached gaze, pills, or clinical sedation cues."},{"code":"PFM0709","name":"Exploitation","kind":"fusion","primIds":["P07","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Using people, bodies, suffering, taboo, shock, or sensational material for advantage, attention, profit, or gratification; objectification, commodification, or spectacle built from others."},{"code":"PFM0710","name":"Tasteless","kind":"fusion","primIds":["P07","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Vulgar, crude, offensive, insensitive, indecent, or lacking judgment or restraint; socially or aesthetically offensive imagery or insensitive presentation."},{"code":"PFM0711","name":"Execrable","kind":"fusion","primIds":["P07","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Hateful, detestable, contemptible, vile, cruel, or deserving condemnation; deliberately abhorrent content or visible malice."},{"code":"PFM0712","name":"Parodic","kind":"fusion","primIds":["P07","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Imitating a recognizable style, work, person, or convention through exaggeration, distortion, mockery, or comic transformation."},{"code":"PFM0713","name":"Snarky","kind":"fusion","primIds":["P07","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Sarcastic, cutting, mocking, dismissive, or contemptuous humor; eye-rolls, smirks, mocking gestures, sarcastic captions, or dismissive commentary."},{"code":"PFM0714","name":"Wickedness","kind":"fusion","primIds":["P07","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Wrongdoing, cruelty, malice, corruption, immorality, or pleasure in harmful behavior; deliberate harm, malicious intent, corruption, or gleeful wrongdoing."},{"code":"PFM0809","name":"Limerence","kind":"fusion","primIds":["P08","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Romantic infatuation marked by longing, idealization, uncertainty, fantasy, or desire for reciprocation; idealized crush imagery, fixation, longing gazes, or unreciprocated yearning."},{"code":"PFM0810","name":"Putrid","kind":"fusion","primIds":["P08","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Rotten, decaying, foul, contaminated, corrupt, or unpleasant; decomposition, mold, slime, spoiled matter, or contamination."},{"code":"PFM0811","name":"Eerie","kind":"fusion","primIds":["P08","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Unsettling, haunting, uncanny, quiet, mysterious, or suggestive that something is wrong; strange shadows, emptiness, haunting stillness, or subtle wrongness."},{"code":"PFM0812","name":"Ethereal","kind":"fusion","primIds":["P08","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Airy, delicate, luminous, weightless, otherworldly, or removed from ordinary physical substance; soft glow, translucence, mist, or delicate forms."},{"code":"PFM0813","name":"Magical","kind":"fusion","primIds":["P08","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Enchanting, supernatural, wondrous, impossible, or governed by forces from a different reality; spells, glowing effects, impossible transformations, enchanted beings, or supernatural phenomena."},{"code":"PFM0814","name":"Phantasmagoric","kind":"fusion","primIds":["P08","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Elaborate grotesque fantasy with bizarre creatures, impossible forms, or disturbing imagery."},{"code":"PFM0910","name":"Lewd","kind":"fusion","primIds":["P09","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually explicit, vulgar, indecent, crude, suggestive, or offensively erotic; explicit exposure, crude sexual gestures, vulgar erotic jokes, or indecent posing."},{"code":"PFM0911","name":"Seduction","kind":"fusion","primIds":["P09","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Attraction created through allure, temptation, mystery, danger, or sexual invitation; alluring poses, intimate gaze, revealing styling, or a dangerous sensual atmosphere."},{"code":"PFM0912","name":"Kinky","kind":"fusion","primIds":["P09","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually unconventional, fetish-oriented, experimental, role-based, or involving nonstandard preferences or practices; fetish attire, bondage cues, role-play, or unconventional erotic props."},{"code":"PFM0913","name":"Hedonism","kind":"fusion","primIds":["P09","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasure, gratification, sensual enjoyment, luxury, appetite, or indulgence elevated into an atmosphere or lifestyle; feasting, partying, lavish consumption, sensual abundance, or decadent excess."},{"code":"PFM0914","name":"Sadomasochism","kind":"fusion","primIds":["P09","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Erotic pleasure involving pain, domination, submission, humiliation, control, or suffering; bondage, power exchange, or controlled physical pain."},{"code":"PFM1011","name":"Horror","kind":"fusion","primIds":["P10","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Fear, dread, shock, or revulsion produced by disturbing, threatening, grotesque, supernatural, or violent material; monsters, gore, frightening scenes, or supernatural danger."},{"code":"PFM1012","name":"Greed","kind":"fusion","primIds":["P10","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Excessive desire to possess, acquire, keep, or control wealth, resources, status, power, or advantage; hoarding, grabbing valuables, status fixation, or acquisitiveness."},{"code":"PFM1013","name":"Indulgent","kind":"fusion","primIds":["P10","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Permissive toward pleasure, appetite, comfort, luxury, excess, or personal gratification; rich food, lounging, pampering, luxury, or overconsumption."},{"code":"PFM1014","name":"Repulsive","kind":"fusion","primIds":["P10","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Immediate visceral disgust caused by decay, contamination, bodily fluids, wounds, infection, or organic breakdown; rotting flesh, pus, vomit, lesions, parasites, or formless slime."},{"code":"PFM1112","name":"Paranoia","kind":"fusion","primIds":["P11","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Persistent suspicion or fear of harm, deception, surveillance, persecution, or hidden threat; watchful fear, suspicious glances, defensive behavior, or surveillance imagery."},{"code":"PFM1113","name":"Spirituality","kind":"fusion","primIds":["P11","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Meaning, transcendence, sacredness, inner life, faith, ritual, or connection beyond ordinary material existence; prayer, meditation, worship, sacred symbols, or mystical connection."},{"code":"PFM1114","name":"Violated","kind":"fusion","primIds":["P11","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"A boundary, body, trust, right, safety, privacy, or autonomy invaded or broken; forced intrusion, damaged privacy, assault aftermath, or breached safety."},{"code":"PFM1213","name":"Glory","kind":"fusion","primIds":["P12","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Honor, acclaim, valor, prestige, or celebrated achievement; trophies, medals, military honors, victory displays, heroic poses, or public recognition."},{"code":"PFM1214","name":"Obsessive","kind":"fusion","primIds":["P12","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Fixated, compulsive, preoccupied, repetitive, or unable to release attention from a person, idea, goal, or concern; repeated patterns, hoarding, compulsive arrangement, or relentless focus."},{"code":"PFM1314","name":"Revenge","kind":"fusion","primIds":["P13","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Retaliation, payback, punishment, or action answering a perceived wrong or injury; retaliatory acts, targeting offenders, punishment, or settling scores."}],"aiThemeChoices":[{"code":"PFM0102","name":"Cozy","kind":"fusion","primIds":["P01","P02"],"matrixVersion":"0.0.0.0","aiMeaning":"Comforting, snug, warm, sheltered, or inviting; soft textures, warm lighting, blankets, relaxed intimate settings, or a feeling of ease, rest, or pleasant closeness."},{"code":"PFM0103","name":"Pitiful","kind":"fusion","primIds":["P01","P03"],"matrixVersion":"0.0.0.0","aiMeaning":"Arousing sympathy or compassion through visible helplessness, suffering, misfortune, weakness, neglect, injury, abandonment, or pleading."},{"code":"PFM0104","name":"Goofy","kind":"fusion","primIds":["P01","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Silly, awkward, playful, foolish, or ridiculous in an amusing way; exaggerated expressions, clumsy antics, or playful visual absurdity."},{"code":"PFM0105","name":"Joy","kind":"fusion","primIds":["P01","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Happiness, delight, pleasure, or emotional uplift shown through smiling, laughter, delighted expressions, playful pleasure, or visible enjoyment."},{"code":"PFM0106","name":"Bizarre","kind":"fusion","primIds":["P01","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Strange, unusual, unexpected, peculiar; improbable combinations, anomalous forms, or unexplained oddities."},{"code":"PFM0107","name":"Camp","kind":"fusion","primIds":["P01","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Exaggerated, theatrical, artificial, flamboyant, kitschy, or knowingly excessive styling and presentation."},{"code":"PFM0108","name":"Whimsical","kind":"fusion","primIds":["P01","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Fanciful, playful, imaginative, lightly odd, or guided by charming logic; fantasy details, charming oddities, or impossible elements."},{"code":"PFM0109","name":"Kawaii","kind":"fusion","primIds":["P01","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Highly stylized Japanese cute aesthetic using exaggerated sweetness or toy-like, childlike, or chibi-style proportions."},{"code":"PFM0110","name":"Grimy","kind":"fusion","primIds":["P01","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Dirty, soiled, greasy, dingy, stained, or neglected; visible dirt, grease, soot, residue, or accumulated grime on surfaces."},{"code":"PFM0111","name":"CreepyCute","kind":"fusion","primIds":["P01","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Cute and unsettling at once; Halloween fun. Appealing subjects combined with eerie, spooky, uncanny, or disturbing features."},{"code":"PFM0112","name":"Innocence","kind":"fusion","primIds":["P01","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Openness, inexperience, trust, simplicity, or freedom from corruption; childlike expressions, gentleness, or naive imagery."},{"code":"PFM0113","name":"Playful","kind":"fusion","primIds":["P01","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Lighthearted, mischievous, teasing, game-like, curious, or inclined toward fun and experimentation; games, toys, teasing gestures, or spontaneous fun."},{"code":"PFM0114","name":"Saccharine","kind":"fusion","primIds":["P01","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Excessively sweet, sentimental, precious, or cutesy to the point of irritation; sugary, pastel, cloying, aggressively sweet imagery."},{"code":"PFM0203","name":"Melancholic","kind":"fusion","primIds":["P02","P03"],"matrixVersion":"0.0.0.0","aiMeaning":"Sad, wistful, reflective, or touched by longing and loss; downcast expressions, solitude, rain, fading light, or emotional heaviness."},{"code":"PFM0204","name":"Charming","kind":"fusion","primIds":["P02","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasantly attractive, likable, engaging, or delightful in a way that wins affection; inviting expressions, warmth, approachable elegance, or pleasing details."},{"code":"PFM0205","name":"Majestic","kind":"fusion","primIds":["P02","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Grand, dignified, regal, imposing, or awe-inspiring in scale, presence, or bearing; symmetry, noble posture, stately beauty, or impressive scenery."},{"code":"PFM0206","name":"Surreal","kind":"fusion","primIds":["P02","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Dreamlike, impossible, uncanny, or illogical in an altered reality; distorted scale, impossible spaces, or unexpected object combinations."},{"code":"PFM0207","name":"Irreverent","kind":"fusion","primIds":["P02","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Disrespectful, cheeky, mocking, or dismissive toward seriousness, convention, authority, or decorum; visual disrespect toward sacred, formal, or authoritative symbols."},{"code":"PFM0208","name":"Romance","kind":"fusion","primIds":["P02","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Affection, longing, intimacy, courtship, tenderness, or romantic attraction; couples, affectionate gestures, closeness, or romantic settings."},{"code":"PFM0209","name":"Exposure","kind":"fusion","primIds":["P02","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Being naked, indecently revealed, or too visibly exposed, especially in ways that feel shameful, embarrassing, humiliating, or sexually charged; visible nudity, uncovered body parts, flashing, revealing poses, or accidental bodily exposure."},{"code":"PFM0210","name":"Grotesque","kind":"fusion","primIds":["P02","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Whimsical or ornamental distortion mixing beauty, absurdity, or unease; hybrid human, animal, or plant forms, exaggerated features, decorative symmetry, or playful violations of natural law."},{"code":"PFM0211","name":"Vulnerable","kind":"fusion","primIds":["P02","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Exposed to harm, rejection, injury, loss, or emotional pain; defenseless posture, exposed emotion, isolation, or injury."},{"code":"PFM0212","name":"Elegant","kind":"fusion","primIds":["P02","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Graceful, refined, tasteful, polished, restrained, or well composed; sophisticated detail, balanced composition, graceful forms, or controlled styling."},{"code":"PFM0213","name":"Festive","kind":"fusion","primIds":["P02","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Marked by celebration, holidays, ceremonies, or special occasions; decorations, costumes, lights, ornaments, seasonal styling, or celebratory settings."},{"code":"PFM0214","name":"Pretentious","kind":"fusion","primIds":["P02","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Affected, self-important, showy, or overly cultured or significant; conspicuous status display and affected refinement."},{"code":"PFM0304","name":"Ironic","kind":"fusion","primIds":["P03","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Tragic or unfortunate situations made funny through unexpected contrast, reversal, or coincidence. Or happy situations ruined by an unexpected reversal."},{"code":"PFM0305","name":"Devastating","kind":"fusion","primIds":["P03","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Causing profound damage, loss, grief, shock, defeat, or emotional destruction; catastrophic ruin, collapse, severe aftermath, or overwhelming loss."},{"code":"PFM0306","name":"Nightmarish","kind":"fusion","primIds":["P03","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Resembling a nightmare; frightening, disturbing, unreal, oppressive, or horrifying, with dream logic, threatening distortions, darkness, or impossible danger."},{"code":"PFM0307","name":"Shame","kind":"fusion","primIds":["P03","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Painful self-conscious disgrace, embarrassment, exposure, or feeling unworthy, judged, or wanting to hide; averted gaze, covered face, hiding posture, blushing, shrinking, or visibly caught embarrassment."},{"code":"PFM0308","name":"Liminal","kind":"fusion","primIds":["P03","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Vast, lonely spaces with sparse objects or people; emptiness, isolation, corridors, thresholds, sparse interiors, or uncanny stillness."},{"code":"PFM0309","name":"Humiliation","kind":"fusion","primIds":["P03","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Being demeaned, degraded, ridiculed, exposed, rejected, or stripped of dignity by others or events; pointing or laughing onlookers, forced exposure, defeated posture, visible embarrassment, or submission."},{"code":"PFM0310","name":"Despair","kind":"fusion","primIds":["P03","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Hopelessness, anguish, defeat, or the sense that relief or improvement has disappeared; collapsed posture, ruin, isolation, or hopeless expressions."},{"code":"PFM0311","name":"Foreboding","kind":"fusion","primIds":["P03","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Uneasy expectation that danger, trouble, harm, or an unwanted event is approaching; ominous shadows, stormy skies, suspense, or approaching threat."},{"code":"PFM0312","name":"Poignant","kind":"fusion","primIds":["P03","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Emotionally affecting through tenderness, sadness, meaning, or reflection; fragile moments, remembrance, meaningful loss, or emotional stillness."},{"code":"PFM0313","name":"Bittersweet","kind":"fusion","primIds":["P03","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasure and sadness experienced together; joyful imagery touched by loss, nostalgia, farewell, memory, or impermanence."},{"code":"PFM0314","name":"Dysphoria","kind":"fusion","primIds":["P03","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Distress, dissatisfaction, unease, or disconnection involving self, body, identity, mood, or circumstance; bodily discomfort, alienation, or self-disconnection."},{"code":"PFM0405","name":"Cringe","kind":"fusion","primIds":["P04","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Painful awkwardness or embarrassment that causes secondhand discomfort; social blunders, failed interactions, awkward expressions, or embarrassing poses."},{"code":"PFM0406","name":"Zany","kind":"fusion","primIds":["P04","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Eccentric, unconventional, comically strange, or offbeat; mismatched costumes, unusual poses, frantic antics, or energetic comic behavior."},{"code":"PFM0407","name":"Satirical","kind":"fusion","primIds":["P04","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Using humor, irony, exaggeration, or ridicule to expose or criticize faults, behavior, institutions, or ideas; visual mockery of politics, culture, or social conventions."},{"code":"PFM0408","name":"Absurd","kind":"fusion","primIds":["P04","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Illogical, ridiculous, contradictory, pointless, impossible, or incompatible with ordinary sense; nonsensical juxtapositions, impossible logic, or ridiculous contradictions."},{"code":"PFM0409","name":"Ribaldry","kind":"fusion","primIds":["P04","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Coarse, bawdy, or sexually suggestive humor; sexual jokes, innuendo, vulgar comedy, bawdy gestures, or suggestive comic situations."},{"code":"PFM0410","name":"Grossout","kind":"fusion","primIds":["P04","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Humor or spectacle built around filth, bodily functions, fluids, decay, gore, or revulsion; vomit, excrement, bodily fluids, or gross material used comically."},{"code":"PFM0411","name":"Comedy Horror","kind":"fusion","primIds":["P04","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Frightening or macabre material blended with humor, parody, absurdity, slapstick, jokes, or comic relief."},{"code":"PFM0412","name":"Witty","kind":"fusion","primIds":["P04","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Clever, quick, inventive, or skillful humor and insight; visual puns, layered references, wordplay, or ingenious humorous juxtapositions."},{"code":"PFM0413","name":"PartyTime","kind":"fusion","primIds":["P04","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Active social celebration centered on revelry, fun, gathering, or excitement; dancing, cheering, crowds, drinks, decorations, music, or confetti."},{"code":"PFM0414","name":"Trolling","kind":"fusion","primIds":["P04","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Provoking, baiting, mocking, annoying, or misleading others for amusement or reaction; antagonistic jokes, mocking memes, baiting signs, or provocative gestures."},{"code":"PFM0506","name":"Chaotic","kind":"fusion","primIds":["P05","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Disordered, unstable, crowded, conflicting, or lacking control or organization; scattered objects, unstable motion, visual overload, or competing elements."},{"code":"PFM0507","name":"Outrageous","kind":"fusion","primIds":["P05","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Shockingly excessive, bold, offensive, audacious, unconventional, or beyond restraint; extreme styling, taboo-breaking, flamboyance, or audacious behavior."},{"code":"PFM0508","name":"Epic","kind":"fusion","primIds":["P05","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Grand, heroic, or massive in scale, consequence, duration, drama, adventure, struggle, achievement, or spectacle; monumental scenery, heroic action, or high stakes."},{"code":"PFM0509","name":"Lust","kind":"fusion","primIds":["P05","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexual desire, appetite, craving, fixation, or physical attraction; desirous gazes, sensual bodies, erotic focus, or visible craving."},{"code":"PFM0510","name":"Brutal","kind":"fusion","primIds":["P05","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Harsh, violent, cruel, punishing, damaging, or unsparing in force or effect; severe injury, destruction, cruelty, or punishing conditions."},{"code":"PFM0511","name":"Terror","kind":"fusion","primIds":["P05","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Extreme fear, alarm, panic, dread, or immediate danger; terrified expressions, fleeing, overwhelming threat, or visible panic."},{"code":"PFM0512","name":"Brilliant","kind":"fusion","primIds":["P05","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Clever, inventive, insightful, creative, effective, or intellectually impressive; ingenious designs, exceptional craftsmanship, inventive solutions, or impressive execution."},{"code":"PFM0513","name":"Pride","kind":"fusion","primIds":["P05","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Satisfaction, self-respect, dignity, or affirmation tied to achievement, identity, belonging, or worth; gay or LGBT imagery; confident posture, identity symbols, or dignified self-presentation."},{"code":"PFM0514","name":"Aggressive","kind":"fusion","primIds":["P05","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Confrontational, forceful, hostile, threatening, domineering, or ready to attack; attack gestures, weapons, intimidation, forceful motion, or threatening posture."},{"code":"PFM0607","name":"Freakshow","kind":"fusion","primIds":["P06","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Bizarre or unsettling spectacle that provokes fascinated, guilty enjoyment; shocking anomalies, unusual performers, carnival-like display, or gawking attention."},{"code":"PFM0608","name":"Psychedelic","kind":"fusion","primIds":["P06","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Hallucinatory, sensory-rich, perception-bending, or suggestive of expanded or distorted consciousness; vivid colors, swirling patterns, fractals, or hallucination-like effects."},{"code":"PFM0609","name":"FreakyDeaky","kind":"fusion","primIds":["P06","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually playful, unconventional, eccentric, uninhibited, or erotic with an oddball edge; strange erotic styling, playful erotic imagery, or unconventional sexual presentation."},{"code":"PFM0610","name":"Mutant","kind":"fusion","primIds":["P06","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Biological form altered from a known prototype through mutation, radiation, chemicals, genetics, abnormal development, hybridization, or evolution; extra limbs, altered organs, abnormal growths, or techno-organic fusion."},{"code":"PFM0611","name":"Macabre","kind":"fusion","primIds":["P06","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Gothic morbidity centered on death, corpses, decay, mortality, funerary imagery, or morbid fascination; skulls, graves, death rituals, or ornate morbid decoration."},{"code":"PFM0612","name":"Alien","kind":"fusion","primIds":["P06","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Strange, foreign, unfamiliar, or nonhuman; suggesting intelligence, biology, places, or forms outside ordinary human experience. Unfamiliar beings, strange anatomy, spacecraft, foreign environments, otherworldly landscapes, or unfamiliar technology."},{"code":"PFM0613","name":"Delirious","kind":"fusion","primIds":["P06","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Disoriented, feverish, ecstatic, manic, confused, or detached from stable reality; hallucinations, unstable visual reality, feverish expressions, or ecstatic chaos."},{"code":"PFM0614","name":"Monstrous","kind":"fusion","primIds":["P06","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Awe-inspiring unnatural threat defined by immense scale, predation, mythic power, or eldritch otherness; colossal creatures, chimeric anatomy, predatory weapons, and impossible features."},{"code":"PFM0708","name":"Medicated","kind":"fusion","primIds":["P07","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Altered, softened, detached, or chemically influenced consciousness or perception; drowsy eyes, softened expressions, detached gaze, pills, or clinical sedation cues."},{"code":"PFM0709","name":"Exploitation","kind":"fusion","primIds":["P07","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Using people, bodies, suffering, taboo, shock, or sensational material for advantage, attention, profit, or gratification; objectification, commodification, or spectacle built from others."},{"code":"PFM0710","name":"Tasteless","kind":"fusion","primIds":["P07","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Vulgar, crude, offensive, insensitive, indecent, or lacking judgment or restraint; socially or aesthetically offensive imagery or insensitive presentation."},{"code":"PFM0711","name":"Execrable","kind":"fusion","primIds":["P07","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Hateful, detestable, contemptible, vile, cruel, or deserving condemnation; deliberately abhorrent content or visible malice."},{"code":"PFM0712","name":"Parodic","kind":"fusion","primIds":["P07","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Imitating a recognizable style, work, person, or convention through exaggeration, distortion, mockery, or comic transformation."},{"code":"PFM0713","name":"Snarky","kind":"fusion","primIds":["P07","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Sarcastic, cutting, mocking, dismissive, or contemptuous humor; eye-rolls, smirks, mocking gestures, sarcastic captions, or dismissive commentary."},{"code":"PFM0714","name":"Wickedness","kind":"fusion","primIds":["P07","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Wrongdoing, cruelty, malice, corruption, immorality, or pleasure in harmful behavior; deliberate harm, malicious intent, corruption, or gleeful wrongdoing."},{"code":"PFM0809","name":"Limerence","kind":"fusion","primIds":["P08","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Romantic infatuation marked by longing, idealization, uncertainty, fantasy, or desire for reciprocation; idealized crush imagery, fixation, longing gazes, or unreciprocated yearning."},{"code":"PFM0810","name":"Putrid","kind":"fusion","primIds":["P08","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Rotten, decaying, foul, contaminated, corrupt, or unpleasant; decomposition, mold, slime, spoiled matter, or contamination."},{"code":"PFM0811","name":"Eerie","kind":"fusion","primIds":["P08","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Unsettling, haunting, uncanny, quiet, mysterious, or suggestive that something is wrong; strange shadows, emptiness, haunting stillness, or subtle wrongness."},{"code":"PFM0812","name":"Ethereal","kind":"fusion","primIds":["P08","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Airy, delicate, luminous, weightless, otherworldly, or removed from ordinary physical substance; soft glow, translucence, mist, or delicate forms."},{"code":"PFM0813","name":"Magical","kind":"fusion","primIds":["P08","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Enchanting, supernatural, wondrous, impossible, or governed by forces from a different reality; spells, glowing effects, impossible transformations, enchanted beings, or supernatural phenomena."},{"code":"PFM0814","name":"Phantasmagoric","kind":"fusion","primIds":["P08","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Elaborate grotesque fantasy with bizarre creatures, impossible forms, or disturbing imagery."},{"code":"PFM0910","name":"Lewd","kind":"fusion","primIds":["P09","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually explicit, vulgar, indecent, crude, suggestive, or offensively erotic; explicit exposure, crude sexual gestures, vulgar erotic jokes, or indecent posing."},{"code":"PFM0911","name":"Seduction","kind":"fusion","primIds":["P09","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Attraction created through allure, temptation, mystery, danger, or sexual invitation; alluring poses, intimate gaze, revealing styling, or a dangerous sensual atmosphere."},{"code":"PFM0912","name":"Kinky","kind":"fusion","primIds":["P09","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually unconventional, fetish-oriented, experimental, role-based, or involving nonstandard preferences or practices; fetish attire, bondage cues, role-play, or unconventional erotic props."},{"code":"PFM0913","name":"Hedonism","kind":"fusion","primIds":["P09","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasure, gratification, sensual enjoyment, luxury, appetite, or indulgence elevated into an atmosphere or lifestyle; feasting, partying, lavish consumption, sensual abundance, or decadent excess."},{"code":"PFM0914","name":"Sadomasochism","kind":"fusion","primIds":["P09","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Erotic pleasure involving pain, domination, submission, humiliation, control, or suffering; bondage, power exchange, or controlled physical pain."},{"code":"PFM1011","name":"Horror","kind":"fusion","primIds":["P10","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Fear, dread, shock, or revulsion produced by disturbing, threatening, grotesque, supernatural, or violent material; monsters, gore, frightening scenes, or supernatural danger."},{"code":"PFM1012","name":"Greed","kind":"fusion","primIds":["P10","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Excessive desire to possess, acquire, keep, or control wealth, resources, status, power, or advantage; hoarding, grabbing valuables, status fixation, or acquisitiveness."},{"code":"PFM1013","name":"Indulgent","kind":"fusion","primIds":["P10","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Permissive toward pleasure, appetite, comfort, luxury, excess, or personal gratification; rich food, lounging, pampering, luxury, or overconsumption."},{"code":"PFM1014","name":"Repulsive","kind":"fusion","primIds":["P10","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Immediate visceral disgust caused by decay, contamination, bodily fluids, wounds, infection, or organic breakdown; rotting flesh, pus, vomit, lesions, parasites, or formless slime."},{"code":"PFM1112","name":"Paranoia","kind":"fusion","primIds":["P11","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Persistent suspicion or fear of harm, deception, surveillance, persecution, or hidden threat; watchful fear, suspicious glances, defensive behavior, or surveillance imagery."},{"code":"PFM1113","name":"Spirituality","kind":"fusion","primIds":["P11","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Meaning, transcendence, sacredness, inner life, faith, ritual, or connection beyond ordinary material existence; prayer, meditation, worship, sacred symbols, or mystical connection."},{"code":"PFM1114","name":"Violated","kind":"fusion","primIds":["P11","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"A boundary, body, trust, right, safety, privacy, or autonomy invaded or broken; forced intrusion, damaged privacy, assault aftermath, or breached safety."},{"code":"PFM1213","name":"Glory","kind":"fusion","primIds":["P12","P13"],"matrixVersion":"0.0.0.0","aiMeaning":"Honor, acclaim, valor, prestige, or celebrated achievement; trophies, medals, military honors, victory displays, heroic poses, or public recognition."},{"code":"PFM1214","name":"Obsessive","kind":"fusion","primIds":["P12","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Fixated, compulsive, preoccupied, repetitive, or unable to release attention from a person, idea, goal, or concern; repeated patterns, hoarding, compulsive arrangement, or relentless focus."},{"code":"PFM1314","name":"Revenge","kind":"fusion","primIds":["P13","P14"],"matrixVersion":"0.0.0.0","aiMeaning":"Retaliation, payback, punishment, or action answering a perceived wrong or injury; retaliatory acts, targeting offenders, punishment, or settling scores."}]};

const strip = text => String(text||'')
  .trim()
  .replace(/^```(?:json)?\s*/i,'')
  .replace(/\s*```$/,'')
  .trim();

const parse = text => {
  const clean = strip(text);
  try { return JSON.parse(clean); }
  catch {
    const a = clean.indexOf('{');
    const b = clean.lastIndexOf('}');
    if (a >= 0 && b > a) {
      try { return JSON.parse(clean.slice(a,b+1)); } catch {}
    }
    throw new Error('Vision provider returned invalid JSON');
  }
};

const responseValue = payload =>
  typeof payload === 'string'
    ? payload
    : (payload?.response ?? payload?.result?.response ?? payload?.output_text ?? '');

const safeProviderDiagnostic = payload => {
  const value = responseValue(payload);
  const type = Array.isArray(value) ? 'array' : typeof value;
  let preview = null;

  if (typeof value === 'string') {
    preview = value.slice(0,1200);
  } else if (value && typeof value === 'object') {
    try { preview = JSON.stringify(value).slice(0,1200); }
    catch { preview = '[unserializable object]'; }
  } else if (value != null) {
    preview = String(value).slice(0,1200);
  }

  return {
    phase:'parse',
    payloadType:Array.isArray(payload) ? 'array' : typeof payload,
    responseType:type,
    responsePreview:preview
  };
};

/**
 * Attach provider diagnostics without mutating Error with an undeclared property.
 * @returns {Error}
 */
const diagnosticError = (message, diagnostic) => {
  const error = new Error(message);
  Object.defineProperty(error,'providerDiagnostic',{
    value:diagnostic,
    enumerable:false,
    configurable:true
  });
  return error;
};

const providerDiagnosticOf = error => {
  if (!error || typeof error !== 'object') return null;
  try { return Reflect.get(error,'providerDiagnostic') || null; }
  catch { return null; }
};

const parseProviderResponse = payload => {
  const value = responseValue(payload);
  if (value && typeof value === 'object') return value;
  try {
    return parse(value);
  } catch (error) {
    throw diagnosticError(
      error?.message || 'Vision provider returned invalid JSON',
      safeProviderDiagnostic(payload)
    );
  }
};

const tagImageMime = (bytes,mimeType) => {
  const mime=String(mimeType||'').split(';')[0].trim().toLowerCase();
  if (Array.isArray(bytes) && /^image\/[a-z0-9.+-]+$/i.test(mime)) {
    try { Object.defineProperty(bytes,'mimeType',{value:mime,enumerable:false,configurable:true}); } catch {}
  }
  return bytes;
};

const fetchBytes = async url => {
  if (!/^https:\/\//i.test(url) || url.length > 2000) throw new Error('imageUrl must be HTTPS');
  const response = await fetch(url,{headers:{accept:'image/*'}});
  if (!response.ok) throw new Error(`Could not retrieve image (${response.status})`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!bytes.length) throw new Error('Image was empty');
  if (bytes.length > 6_000_000) throw new Error('Image exceeds 6 MB');
  return tagImageMime(Array.from(bytes),response.headers.get('content-type'));
};

const dataUrlBytes = value => {
  const match = String(value||'').match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) throw new Error('imageDataUrl must be a base64 image');
  const binary = atob(match[2]);
  if (binary.length > 6_000_000) throw new Error('Image exceeds 6 MB');
  return tagImageMime(Array.from(binary,c=>c.charCodeAt(0)),match[1]);
};

const imageMimeFromBytes = bytes => {
  const b=Array.isArray(bytes)?bytes:Array.from(bytes||[]);
  if (b[0]===0xff&&b[1]===0xd8&&b[2]===0xff) return 'image/jpeg';
  if (b[0]===0x89&&b[1]===0x50&&b[2]===0x4e&&b[3]===0x47) return 'image/png';
  if (b[0]===0x47&&b[1]===0x49&&b[2]===0x46&&b[3]===0x38) return 'image/gif';
  if (b[0]===0x52&&b[1]===0x49&&b[2]===0x46&&b[3]===0x46&&b[8]===0x57&&b[9]===0x45&&b[10]===0x42&&b[11]===0x50) return 'image/webp';
  if (b[0]===0x42&&b[1]===0x4d) return 'image/bmp';
  const brand=String.fromCharCode(...b.slice(4,12));
  if (/^ftypavi[fs]$/.test(brand)) return 'image/avif';
  if (/^ftyphei[cf]$/.test(brand)||/^ftyphev[csx]$/.test(brand)) return 'image/heic';
  return 'image/jpeg';
};

const imageBytesDataUrl = bytes => {
  const b=Array.isArray(bytes)?bytes:Array.from(bytes||[]);
  if (!b.length) throw new Error('Image was empty');
  let binary='';
  for (let i=0;i<b.length;i+=0x8000) binary+=String.fromCharCode(...b.slice(i,i+0x8000));
  return `data:${bytes?.mimeType||imageMimeFromBytes(b)};base64,${btoa(binary)}`;
};

function validateRegistry(registry){
  if (!registry || registry.matrixVersion !== '0.0.0.0') throw new Error('Unexpected PrimFusion Matrix version');
  if (!Array.isArray(registry.primitives) || registry.primitives.length !== 14) throw new Error('PrimFusion registry must contain 14 Prims');
  if (!Array.isArray(registry.fusions) || registry.fusions.length !== 91) throw new Error('PrimFusion registry must contain 91 fusions');
  if (!Array.isArray(registry.themeChoices) || registry.themeChoices.length !== 105) throw new Error('PrimFusion registry must contain 105 total Theme choices');
  if (!Array.isArray(registry.aiThemeChoices) || registry.aiThemeChoices.length !== 91) throw new Error('PrimFusion registry must contain 91 AI Theme choices');
  for (const fusion of registry.fusions){
    const [a,b] = fusion.primIds || [];
    if (!a || !b || Number(a.slice(1)) >= Number(b.slice(1))) {
      throw new Error(`Invalid low-to-high fusion code: ${fusion.code||'unknown'}`);
    }
  }
  return registry;
}

validateRegistry(PRIMFUSION_REGISTRY);

const matrixVersion = () => PRIMFUSION_REGISTRY.matrixVersion;

function reactionPrompt({useImage=true,descriptionContext='',lineProtocol=false,requireNotes=false}={}){
  const lines = PRIMFUSION_REGISTRY.primitives.map(p => {
    const meaning = p.aiMeaning ? ` Meaning: ${p.aiMeaning}` : '';
    return `${p.id} — ${p.name}.${meaning}`;
  }).join('\n');
  const description=String(descriptionContext||'').trim().slice(0,6000);
  const useDescription=Boolean(description);
  const evidenceRule=useImage&&useDescription
    ? `Analyze the image and the supplied AI Description together as two evidence sources. Use the Description as observational context, not as prior Reaction scoring. When they differ, judge the reaction field from the total available evidence.`
    : useDescription
      ? `Analyze ONLY the supplied AI Description. No image is provided for this rerun. Do not invent visual evidence beyond what the Description states.`
      : `Analyze the image as the sole evidence source.`;
  const noteRule=useImage?'image-grounded':'description-grounded';
  const descriptionBlock=useDescription?`\n\nAI DESCRIPTION EVIDENCE:\n${description}`:'';
  const ids=PRIMFUSION_REGISTRY.primitives.map(p=>p.id);
  const noteInstruction=(lineProtocol&&!requireNotes)
    ? `Reaction Reasons were not requested for this run. Do not add NOTE or rationale lines.`
    : `Provide concise ${noteRule} notes for the first FOUR ranked reactions. Those notes are an effort check showing that the primary, secondary, and nearest alternatives were actually considered. A genuinely single-dominant case is allowed; if ranks 2-4 are weak or unsupported, say so rather than inventing support.`;
  const outputRule=lineProtocol
    ? `Return ONLY this compact plain-text protocol; do not return JSON, Markdown, labels, percentages, or commentary:\n${ids.map(id=>`${id}|<number from 0 to 100>`).join('\n')}\nRANKING|<all 14 P-codes strongest-to-weakest, comma-separated, each exactly once>${requireNotes?`\nNOTE|<rank-1 P-code>|<brief ${noteRule} reason>\nNOTE|<rank-2 P-code>|<brief ${noteRule} reason>\nNOTE|<rank-3 P-code>|<brief ${noteRule} reason>\nNOTE|<rank-4 P-code>|<brief ${noteRule} reason>`:''}\nEvery P01-P14 line is mandatory and its second field must be a bare numeric value.`
    : `Return one JSON object matching the structure below.\nThe object must contain:\n- weights: P01 through P14, each as a JSON number from 0 to 100\n- ranking: all 14 P-codes strongest-to-weakest, each exactly once\n- notes: exactly four objects for ranks 1-4, each with id and a brief ${noteRule} reason\nDo not put numbers in percent strings. Do not wrap the JSON in Markdown or code fences.`;

  return `You are performing Genreactrix Reaction Analysis.

${evidenceRule}
Choose among all 14 Genreactrix reaction buttons at the same time.
The P-codes are identifiers only. Reaction Analysis is independent from Theme/PrimFusion analysis.

Your job is semantic comparison, NOT arithmetic and NOT 14 independent confidence ratings.
For every reaction, assign a NONNEGATIVE RELATIVE WEIGHT from 0 to 100. The weights do NOT need to total 100 or any other number. A larger weight means that reaction deserves a larger share of the viewer's overall reaction field compared with the other 13 reactions.

Rank ALL 14 reactions from strongest to weakest. Rank #1 is the primary reaction. Rank #2 is the required secondary reaction candidate: identify the best-supported alternative even when it is much weaker than the primary. Do not stop after finding one obvious reaction.

${noteInstruction}

Do not make every weight identical. Do not return all zeros. Do not use Theme names or Theme reasoning to choose the reactions.

REACTION PRIMS:
${lines}${descriptionBlock}

${outputRule}`;
}

function reactionSchema(){
  const ids = PRIMFUSION_REGISTRY.primitives.map(p=>p.id);
  const properties = Object.fromEntries(ids.map(id=>[id,{type:'number',minimum:0,maximum:100}]));
  return {
    type:'object',
    properties:{
      weights:{
        type:'object',
        properties,
        required:ids,
        additionalProperties:false
      },
      ranking:{
        type:'array',
        minItems:14,
        maxItems:14,
        items:{type:'string',enum:ids},
      },
      notes:{
        type:'array',
        minItems:4,
        maxItems:4,
        items:{
          type:'object',
          properties:{
            id:{type:'string',enum:ids},
            reason:{type:'string'}
          },
          required:['id','reason'],
          additionalProperties:false
        }
      }
    },
    required:['weights','ranking','notes'],
    additionalProperties:false
  };
}

function reactionObjectCandidate(text){
  const raw = String(text||'').trim();
  const candidates = [raw];
  const a = raw.indexOf('{'), b = raw.lastIndexOf('}');
  if (a >= 0 && b > a) candidates.push(raw.slice(a,b+1));
  for (const candidate of candidates){
    try{
      const value = JSON.parse(candidate.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim());
      if (value && typeof value === 'object' && !Array.isArray(value)) return value;
    }catch{}
  }
  return null;
}

function parseReactionText(text){
  const ids = PRIMFUSION_REGISTRY.primitives.map(p=>p.id);
  const weights = {};
  let ranking = null;
  const notes = [];
  const raw = String(text||'').replace(/```(?:text|json)?/gi,'').trim();

  const reactionNumber = value => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
    const match = String(value ?? '').match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : NaN;
  };

  // Accept JSON/object-shaped output even though the prompt requests plain text.
  // Tolerate both keyed objects and common arrays such as
  // [{id:'P01', relative_weight:90}, ...].
  const objectCandidate = reactionObjectCandidate(raw);
  if (objectCandidate){
    const sourceWeights = objectCandidate.weights || objectCandidate.reactions || objectCandidate;
    if (Array.isArray(sourceWeights)) {
      for (const item of sourceWeights) {
        const id = String(item?.id ?? item?.code ?? item?.reaction ?? '').toUpperCase();
        const nested = item?.relative_weight ?? item?.relativeWeight ?? item?.weight ?? item?.score ?? item?.value ?? item?.percentage ?? item?.percent;
        const n = reactionNumber(nested);
        if (ids.includes(id) && Number.isFinite(n)) weights[id] = n;
      }
    } else {
      for (const id of ids){
        const direct = sourceWeights?.[id];
        const nested = direct && typeof direct === 'object'
          ? (direct.relative_weight ?? direct.relativeWeight ?? direct.weight ?? direct.score ?? direct.value ?? direct.percentage ?? direct.percent)
          : direct;
        const n = reactionNumber(nested);
        if (Number.isFinite(n)) weights[id]=n;
      }
    }
    const objectRanking = objectCandidate.ranking || objectCandidate.rank || objectCandidate.order;
    if (Array.isArray(objectRanking)) ranking = objectRanking.map(x=>String(x?.id ?? x?.code ?? x).toUpperCase()).filter(x=>ids.includes(x));
    const objectNotes = objectCandidate.notes || objectCandidate.reasons || objectCandidate.reasoning;
    if (Array.isArray(objectNotes)){
      for (const item of objectNotes){
        const id=String(item?.id ?? item?.code ?? '').toUpperCase();
        const reason=String(item?.reason ?? item?.note ?? item?.rationale ?? '').trim();
        if (ids.includes(id) && reason) notes.push({id,reason});
      }
    } else if (objectNotes && typeof objectNotes === 'object') {
      for (const id of ids){
        const reason=String(objectNotes[id] ?? '').trim();
        if (reason) notes.push({id,reason});
      }
    }
  }

  for (const originalLine of raw.split(/\r?\n/)){
    const line = originalLine.trim().replace(/^[-*]\s*/,'').replace(/^\|\s*/,'').replace(/\s*\|$/,'');
    if (!line) continue;

    // Preferred protocol plus tolerant table/colon/equal variants. Also accept
    // a reaction label between the P-code and number, e.g. P01|Adorable|90.
    let m = line.match(/^(?:WEIGHT\s*[|:=,-]\s*)?(P\d{2})(?:\s*[|:=,-]\s*[^|:=,\d][^|:=,]*?)?\s*[|:=,-]\s*(-?\d+(?:\.\d+)?)(?:\s*%?)\b/i);
    if (m){
      const id=m[1].toUpperCase(), n=Number(m[2]);
      if (ids.includes(id) && Number.isFinite(n) && !(id in weights)) weights[id]=n;
    }

    const rankingMatch = line.match(/^(?:RANKING|RANK|ORDER)\s*[|:=]\s*(.+)$/i);
    if (rankingMatch){
      const found=(rankingMatch[1].match(/P\d{2}/gi)||[]).map(x=>x.toUpperCase()).filter(x=>ids.includes(x));
      if (found.length) ranking=found;
    }

    const noteMatch = line.match(/^(?:NOTE|REASON|RATIONALE)\s*[|:=]\s*(P\d{2})\s*[|:=]\s*(.+)$/i);
    if (noteMatch){
      const id=noteMatch[1].toUpperCase(), reason=noteMatch[2].trim();
      if (ids.includes(id) && reason && !notes.some(x=>x.id===id)) notes.push({id,reason});
    }
  }

  // Last-resort extraction of P-code/number pairs anywhere in the response.
  // Permit one short reaction-name/label field between the code and number.
  if (Object.keys(weights).length < ids.length){
    const pairRe = /\b(P\d{2})\b(?:\s*[|:=,-]\s*[^|:=,\d][^|:=,\n]{0,60})?\s*(?:[|:=,-]|\bis\b)?\s*(-?\d+(?:\.\d+)?)\s*%?/gi;
    let m;
    while ((m=pairRe.exec(raw))){
      const id=m[1].toUpperCase(), n=Number(m[2]);
      if (ids.includes(id) && Number.isFinite(n) && !(id in weights)) weights[id]=n;
    }
  }

  if (!ranking || ranking.length !== ids.length || new Set(ranking).size !== ids.length){
    const explicit = raw.match(/(?:RANKING|RANK|ORDER)\s*[|:=]\s*([^\n]+)/i);
    if (explicit){
      const found=(explicit[1].match(/P\d{2}/gi)||[]).map(x=>x.toUpperCase()).filter(x=>ids.includes(x));
      if (found.length===ids.length && new Set(found).size===ids.length) ranking=found;
    }
  }

  return {weights,ranking:ranking||[],notes,rawPreview:raw.slice(0,3000)};
}


function parseReactionLineProtocol(text,{requireNotes=false}={}){
  const ids=PRIMFUSION_REGISTRY.primitives.map(p=>p.id);
  const weights={};
  let ranking=[];
  const notes=[];
  const raw=String(text||'').replace(/```(?:text)?/gi,'').trim();
  for(const originalLine of raw.split(/\r?\n/)){
    const line=originalLine.trim().replace(/^[-*]\s*/,'');
    if(!line)continue;
    const weightMatch=line.match(/^(P\d{2})\s*\|\s*(-?\d+(?:\.\d+)?)\s*$/i);
    if(weightMatch){
      const id=weightMatch[1].toUpperCase(),value=Number(weightMatch[2]);
      if(ids.includes(id)&&Number.isFinite(value)&&!(id in weights))weights[id]=value;
      continue;
    }
    const rankingMatch=line.match(/^RANKING\s*\|\s*(.+)$/i);
    if(rankingMatch){
      ranking=(rankingMatch[1].match(/P\d{2}/gi)||[]).map(x=>x.toUpperCase());
      continue;
    }
    const noteMatch=line.match(/^NOTE\s*\|\s*(P\d{2})\s*\|\s*(.+)$/i);
    if(noteMatch){
      const id=noteMatch[1].toUpperCase(),reason=noteMatch[2].trim();
      if(ids.includes(id)&&reason&&!notes.some(row=>row.id===id))notes.push({id,reason});
    }
  }
  const missing=ids.filter(id=>!(id in weights));
  if(missing.length)throw diagnosticError(
    `Reaction combined-evidence response was missing numeric weights for ${missing.join(', ')}`,
    {phase:'reaction-combined-line-parse',missingPrimCodes:missing,responsePreview:raw.slice(0,1600)}
  );
  if(ranking.length!==ids.length||new Set(ranking).size!==ids.length||ranking.some(id=>!ids.includes(id)))throw diagnosticError(
    'Reaction combined-evidence response did not provide one complete 14-Prim ranking',
    {phase:'reaction-combined-line-parse',responsePreview:raw.slice(0,1600)}
  );
  if(requireNotes&&notes.length<4)throw diagnosticError(
    `Reaction combined-evidence response provided ${notes.length} usable notes instead of 4`,
    {phase:'reaction-combined-line-parse',responsePreview:raw.slice(0,1600)}
  );
  return{weights,ranking,notes,rawPreview:raw.slice(0,3000)};
}

function validateReactionAssessment(raw,{requireNotes=false}={}){
  const ids = PRIMFUSION_REGISTRY.primitives.map(p=>p.id);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Reaction assessment was not an object');
  const weights = {};
  for (const id of ids){
    const value = Number(raw.weights?.[id]);
    if (!Number.isFinite(value) || value < 0 || value > 100) throw new Error(`Reaction relative weight for ${id} must be numeric from 0 to 100`);
    weights[id] = value;
  }
  const total = ids.reduce((sum,id)=>sum+weights[id],0);
  if (!(total > 0)) throw new Error('Reaction assessment returned all-zero relative weights');
  const distinctWeights = new Set(ids.map(id=>weights[id]));
  if (distinctWeights.size === 1) throw new Error('Reaction assessment was uninformative because all 14 relative weights were identical');

  let ranking = Array.isArray(raw.ranking) ? raw.ranking.map(String) : [];
  let rankingSource = 'ai';
  const validRanking = ranking.length === ids.length && new Set(ranking).size === ids.length && !ranking.some(id=>!ids.includes(id));
  const rankingContradicts = validRanking && ranking.some((id,i)=>i>0 && weights[id] > weights[ranking[i-1]] + 1e-9);
  if (!validRanking || rankingContradicts){
    // Formatting mistakes in the ranking must not discard an otherwise complete 14-way semantic assessment.
    // Derive order from the AI's own weights; deterministic Prim ID only breaks exact ties.
    ranking = [...ids].sort((a,b)=>weights[b]-weights[a] || a.localeCompare(b));
    rankingSource = 'worker-derived-from-ai-weights';
  }

  const noteMap = new Map();
  if (Array.isArray(raw.notes)){
    for (const item of raw.notes){
      const id=String(item?.id||'').toUpperCase(), reason=String(item?.reason||'').trim();
      if (ids.includes(id) && reason && !noteMap.has(id)) noteMap.set(id,reason);
    }
  }
  const topFour = ranking.slice(0,4);
  const notes = topFour.filter(id=>noteMap.has(id)).map(id=>({id,reason:noteMap.get(id)}));
  if (requireNotes && notes.length !== 4) throw new Error(`Reaction assessment provided ${notes.length} usable top-four effort notes instead of 4`);

  return {weights,ranking,notes,rankingSource};
}

function allocateReactionPool(assessment){
  const ids = PRIMFUSION_REGISTRY.primitives.map(p=>p.id);
  const total = ids.reduce((sum,id)=>sum+assessment.weights[id],0);
  const rankIndex = new Map(assessment.ranking.map((id,index)=>[id,index]));
  const rows = ids.map(id=>{
    const exact = assessment.weights[id] * 100 / total;
    const discretionary = Math.floor(exact);
    return {id,exact,discretionary,fraction:exact-discretionary};
  });
  let remaining = 100 - rows.reduce((sum,row)=>sum+row.discretionary,0);
  const remainderOrder = [...rows].sort((a,b)=>
    b.fraction-a.fraction ||
    (rankIndex.get(a.id)??99)-(rankIndex.get(b.id)??99) ||
    a.id.localeCompare(b.id)
  );
  for (let i=0;i<remaining;i++) remainderOrder[i % remainderOrder.length].discretionary += 1;

  const display = Object.fromEntries(rows.map(row=>[row.id,row.discretionary]));
  const rawAllocation = Object.fromEntries(rows.map(row=>[row.id,row.discretionary+1]));
  const displayTotal = Object.values(display).reduce((a,b)=>a+b,0);
  const rawTotal = Object.values(rawAllocation).reduce((a,b)=>a+b,0);
  if (displayTotal !== 100 || rawTotal !== 114) throw new Error('Worker reaction apportionment invariant failed');

  const primaryId = assessment.ranking[0], secondaryId = assessment.ranking[1];
  const pair = [primaryId,secondaryId].sort((a,b)=>Number(a.slice(1))-Number(b.slice(1)));
  const primFusionCode = `PFM${pair[0].slice(1)}${pair[1].slice(1)}`;
  const byId = new Map(PRIMFUSION_REGISTRY.primitives.map(p=>[p.id,p]));
  return {
    display,
    diagnostics:{
      scoringMethod:'ai-relative-weights-worker-hamilton-100-plus-14-baseline',
      rawAiWeights:assessment.weights,
      aiRanking:assessment.ranking,
      rankingSource:assessment.rankingSource||'ai',
      effortNotes:assessment.notes,
      discretionaryAllocation:display,
      rawAllocation,
      displayTotal,
      rawTotal,
      singleDominant:Object.values(assessment.weights).filter(v=>v>0).length===1,
      reactionCombo:{
        primaryId,
        primaryName:byId.get(primaryId)?.name||primaryId,
        secondaryId,
        secondaryName:byId.get(secondaryId)?.name||secondaryId,
        primFusionCode,
        normalizedReactionIds:pair
      }
    }
  };
}

function reactionRetryInstruction(error,{lineProtocol=false,requireNotes=false}={}){
  const formatRule=lineProtocol
    ? `Return the compact line protocol exactly: one mandatory P01-P14 numeric weight line for every Prim, then one RANKING line${requireNotes?', then four NOTE lines for ranks 1-4':''}. Do not return JSON.`
    : `Return the required JSON object with all 14 numeric relative weights, a complete strongest-to-weakest ranking with no duplicates, and four non-empty notes for ranks 1-4.`;
  return `\n\nYour previous response was rejected by the Reaction effort/format validator: ${String(error?.message||error||'unknown error').slice(0,500)}\nReassess the whole 14-reaction field from scratch. ${formatRule} Do not perform percentage-total arithmetic.`;
}

async function runReactionAssessment(env,model,image,behavior='analyze',evidence={}){
  let lastError = null;
  const useImage = evidence?.useImage !== false;
  const descriptionContext = String(evidence?.descriptionContext||'').trim();
  const combinedEvidence = useImage && Boolean(descriptionContext);
  const evidenceMode = useImage ? (combinedEvidence ? 'image+description' : 'image') : 'description';
  const requireNotes = evidence?.requireNotes === true;

  // Evidence routing is intentionally mode-specific:
  // - Image only: Llama 3.2 Vision with the documented legacy image field.
  // - Description only: Llama 4 Scout with guided_json and no image bytes.
  // - Image + Description: Llama 4 Scout as a true multimodal chat request, with
  //   text and a data-URI image content part in the same message plus guided_json.
  const reactionModel = combinedEvidence
    ? (env.WORKERS_AI_REACTION_MODEL || DEFAULT_REACTION_MODEL)
    : useImage
      ? (env.WORKERS_AI_REACTION_VISION_MODEL || model || DEFAULT_MODEL)
      : (env.WORKERS_AI_REACTION_MODEL || DEFAULT_REACTION_MODEL);

  for (let attempt=1;attempt<=2;attempt++){
    try{
      const prompt = reactionPrompt(evidence) + (attempt===2 ? reactionRetryInstruction(lastError,{lineProtocol:false,requireNotes}) : '');

      if (combinedEvidence){
        const structured = await runStructured(
          env,reactionModel,image,prompt,reactionSchema(),2300,'guided_json',
          {behavior,reactionEvidenceMode:evidenceMode,multimodalMessages:true,temperature:attempt===1?(behavior==='reanalyze'?0.28:0.08):0}
        );
        return validateReactionAssessment(structured,{requireNotes});
      }

      if (useImage){
        const raw = await runStructured(
          env,reactionModel,image,prompt,null,2600,'text',
          {behavior,reactionEvidenceMode:evidenceMode,temperature:attempt===1?(behavior==='reanalyze'?0.35:0.1):0}
        );
        const parsed = parseReactionText(raw);
        try{
          return validateReactionAssessment(parsed,{requireNotes});
        }catch(error){
          throw diagnosticError(
            error?.message || 'Reaction Vision response could not be validated',
            {
              phase:'reaction-vision-text-parse-or-effort-validation',
              model:reactionModel,
              evidenceMode,
              errorMessage:String(error?.message||error||'unknown').slice(0,1200),
              responsePreview:String(parsed?.rawPreview||raw||'').slice(0,1600)
            }
          );
        }
      }

      const structured = await runStructured(
        env,reactionModel,null,prompt,reactionSchema(),2100,'guided_json',
        {behavior,temperature:attempt===1?(behavior==='reanalyze'?0.35:0.1):0}
      );
      return validateReactionAssessment(structured,{requireNotes});
    }catch(error){
      lastError = error;
      const message = String(error?.message||error);
      const providerFailure = /Workers AI vision failed|timed out after/i.test(message);
      if (attempt>=2 || providerFailure) break;
    }
  }
  const existingDiagnostic = providerDiagnosticOf(lastError);
  if (existingDiagnostic) throw lastError;
  throw diagnosticError(
    lastError?.message || 'Reaction Analysis failed',
    {
      phase:'reaction-parse-or-effort-validation',
      model:reactionModel,
      evidenceMode,
      errorMessage:String(lastError?.message||lastError||'unknown').slice(0,1200)
    }
  );
}

async function runReactionAllocation(env,model,image,behavior='analyze',evidence={}){
  const assessment = await runReactionAssessment(env,model,image,behavior,evidence);
  return allocateReactionPool(assessment);
}

function themePrompt(analysisContext=""){
  // Deliberately expose code + semantic label only.
  // Do NOT expose the P01/P02 provenance of PFM codes to the model:
  // theme classification must remain independent of Reaction Analysis.
  const choices = PRIMFUSION_REGISTRY.aiThemeChoices
    .map(t => `${t.code} — ${t.name}${t.aiMeaning ? ` — Meaning: ${t.aiMeaning}` : ``}`)
    .join('\n');

  const fallbackRule = CUSTOM_THEME_GENERATION_ENABLED
    ? `If an important Theme genuinely is not adequately represented by the current matrix vocabulary, one Custom Theme candidate may be used. A Custom candidate must be a concise reusable semantic Theme name, not a medium/style tag.`
    : `Custom Theme generation is temporarily DISABLED for research. You MUST choose all three selections from the current matrix vocabulary. If the vocabulary is imperfect, choose the three closest valid matrix Themes rather than inventing a fallback. This restriction is intentional so vocabulary weaknesses remain observable.`;

  const formats = CUSTOM_THEME_GENERATION_ENABLED
    ? `1|matrix|<PFM_CODE>|<CONFIDENCE>|Brief image-grounded reason this Theme fits\n2|matrix|<PFM_CODE>|<CONFIDENCE>|Brief image-grounded reason this Theme fits\n3|custom|<PROPOSED_THEME_NAME>|<CONFIDENCE>|Brief image-grounded reason this Theme is needed`
    : `1|matrix|<PFM_CODE>|<CONFIDENCE>|Brief image-grounded reason this Theme fits\n2|matrix|<PFM_CODE>|<CONFIDENCE>|Brief image-grounded reason this Theme fits\n3|matrix|<PFM_CODE>|<CONFIDENCE>|Brief image-grounded reason this Theme fits`;
  const context=String(analysisContext||'').trim().slice(0,6000);
  const failsafe=context ? `\n\nTHEME FAILSAFE CONTEXT:\nUse the existing AI freeform analysis below as additional guidance together with the image. It is a steering input for this rerun; continue judging the Themes from the image as well.\n\n${context}` : '';

  return `You are performing Genreactrix Theme Analysis.

PrimFusion Matrix version: ${matrixVersion()}.

Choose exactly three DIFFERENT Theme selections that best fit the image.
Choose from the current PrimFusion fusion vocabulary below.
Evaluate the semantic meaning of the Theme names from the image itself.
Do not use reaction-analysis scores to make Theme choices.
The codes are identifiers only.

A Theme is a semantic/thematic classification. Do not use a visual medium, production format, or art technique as a Theme merely because it is visible. Those observations belong in the freeform AI Description.

${fallbackRule}${failsafe}

CURRENT AI-ELIGIBLE PRIMFUSION THEMES:
${choices}

Return exactly three ranked selections, strongest first, and nothing else.
Use one line per selection in this exact pipe-delimited format:
${formats}

For matrix choices, field 3 must be one valid PFM code from the vocabulary above. Standalone Prims are intentionally not eligible AI Theme outputs.
Field 4 is confidence from 0-100.
Field 5 is a concise image-grounded rationale explaining why the Theme was selected.

Do not repeat the same Theme, code, or semantic label under another rank.`;
}

function themeSchema(){
  const validCodes = PRIMFUSION_REGISTRY.aiThemeChoices.map(t=>t.code);
  const matrixChoice = {
    type:'object',
    properties:{
      source:{type:'string',enum:['matrix']},
      code:{type:'string',enum:validCodes},
      confidence:{type:'number',minimum:0,maximum:100}
    },
    required:['source','code','confidence'],
    additionalProperties:false
  };
  const itemSchema = CUSTOM_THEME_GENERATION_ENABLED ? {anyOf:[
    matrixChoice,
    {
      type:'object',
      properties:{
        source:{type:'string',enum:['custom']},
        proposedName:{type:'string'},
        confidence:{type:'number',minimum:0,maximum:100}
      },
      required:['source','proposedName','confidence'],
      additionalProperties:false
    }
  ]} : matrixChoice;
  return {
    type:'object',
    properties:{themes:{type:'array',minItems:3,maxItems:3,items:itemSchema}},
    required:['themes'],
    additionalProperties:false
  };
}

const THEME_RERUN_STATES = new Set(['neutral','replace','preserve']);
const THEME_RERUN_PRIM_STATES = new Set(['mandatory','preferred','optional','discouraged','forbidden']);
const THEME_RERUN_PRIM_WEIGHTS = Object.freeze({mandatory:100,preferred:80,optional:60,discouraged:20,forbidden:0});
const THEME_RERUN_SCOPES = new Set(['theme1','theme2','theme3','general']);

function normalizeThemeRerun(input){
  if(!input||typeof input!=='object')return null;
  const validThemeCodes=new Set(PRIMFUSION_REGISTRY.aiThemeChoices.map(row=>row.code));
  const validPrimCodes=new Set(PRIMFUSION_REGISTRY.primitives.map(row=>row.id));
  const rawSlots=Array.isArray(input.themeSlots)?input.themeSlots:[];
  const themeSlots=[1,2,3].map(slot=>{
    const raw=rawSlots.find(row=>Number(row?.slot)===slot)||{};
    const state=THEME_RERUN_STATES.has(String(raw.state||''))?String(raw.state):'neutral';
    const code=String(raw.currentThemeCode||'').trim().toUpperCase();
    const weight=Number(raw.currentThemeWeight??raw.weight);
    return{slot,state,currentThemeCode:validThemeCodes.has(code)?code:null,currentThemeWeight:Number.isFinite(weight)?Math.max(0,Math.min(100,weight)):null};
  });
  const primPicker=[];
  for(const raw of Array.isArray(input.primPicker)?input.primPicker:[]){
    const scope=String(raw?.scope||'');if(!THEME_RERUN_SCOPES.has(scope)||primPicker.some(row=>row.scope===scope))continue;
    const byPrim=new Map();
    for(const item of Array.isArray(raw?.assignments)?raw.assignments:[]){
      const primCode=String(item?.primCode||'').trim().toUpperCase(),state=String(item?.state||'');
      if(validPrimCodes.has(primCode)&&THEME_RERUN_PRIM_STATES.has(state))byPrim.set(primCode,{primCode,state,weight:THEME_RERUN_PRIM_WEIGHTS[state]});
    }
    const assignments=[...byPrim.values()];
    const unchosenWeight=assignments.some(item=>item.state==='optional')?40:50;
    primPicker.push({scope,assignments,unchosenWeight});
  }
  const excludedThemeCodes=[...new Set((Array.isArray(input.excludedThemeCodes)?input.excludedThemeCodes:[]).map(code=>String(code).trim().toUpperCase()).filter(code=>validThemeCodes.has(code)))];
  const includedDescriptions=[];let remaining=16000;
  for(const raw of Array.isArray(input.includedDescriptions)?input.includedDescriptions:[]){
    if(remaining<=0)break;const text=String(raw?.text||'').trim();if(!text)continue;const clipped=text.slice(0,remaining);remaining-=clipped.length;
    includedDescriptions.push({artifactId:raw?.artifactId?String(raw.artifactId):null,version:Number(raw?.version)||0,createdAt:String(raw?.createdAt||''),text:clipped});
  }
  return{schemaVersion:1,themeSlots,primPicker,excludedThemeCodes,includedDescriptions};
}

function themeRerunScopeForSlot(slotRow){return slotRow.state==='preserve'?null:(slotRow.state==='replace'?`theme${slotRow.slot}`:'general')}
function themeRerunScopeWeights(rerun,scope){
  const primCodes=PRIMFUSION_REGISTRY.primitives.map(row=>row.id),row=rerun.primPicker.find(item=>item.scope===scope)||null;
  const unchosenWeight=row?.assignments?.some(item=>item.state==='optional')?40:50,weights=Object.fromEntries(primCodes.map(code=>[code,unchosenWeight]));
  const states={};for(const item of row?.assignments||[]){weights[item.primCode]=THEME_RERUN_PRIM_WEIGHTS[item.state];states[item.primCode]=item.state;}
  return{weights,states,unchosenWeight,mandatory:Object.keys(states).filter(code=>states[code]==='mandatory'),forbidden:Object.keys(states).filter(code=>states[code]==='forbidden')};
}
function themeRerunCandidateData(rerun,slotRow){
  if(slotRow.state==='preserve')return{scope:null,candidates:[],weights:null};
  if(slotRow.state==='replace'&&!slotRow.currentThemeCode)throw new Error(`Theme ${slotRow.slot} cannot be replaced because its current PFM code is unavailable.`);
  const scope=themeRerunScopeForSlot(slotRow),weightSpec=themeRerunScopeWeights(rerun,scope);
  if(weightSpec.mandatory.length>2)throw new Error(`Theme ${slotRow.slot} PrimPicker has ${weightSpec.mandatory.length} Mandatory Prims. A PrimFusion can contain only two Prims.`);
  const excluded=new Set(rerun.excludedThemeCodes);
  for(const row of rerun.themeSlots)if(row.state==='preserve'&&row.currentThemeCode)excluded.add(row.currentThemeCode);
  if(slotRow.state==='replace'&&slotRow.currentThemeCode)excluded.add(slotRow.currentThemeCode);
  const candidates=PRIMFUSION_REGISTRY.aiThemeChoices.filter(theme=>{
    if(excluded.has(theme.code))return false;
    const primIds=Array.isArray(theme.primIds)?theme.primIds:[];
    if(weightSpec.forbidden.some(code=>primIds.includes(code)))return false;
    if(weightSpec.mandatory.some(code=>!primIds.includes(code)))return false;
    return primIds.length===2;
  }).map(theme=>{
    const [first,second]=theme.primIds,pairWeight=(weightSpec.weights[first]+weightSpec.weights[second])/2;
    return{code:theme.code,name:theme.name,primIds:[first,second],pairWeight:Math.round(pairWeight*10)/10,aiMeaning:String(theme.aiMeaning||'')};
  }).sort((a,b)=>b.pairWeight-a.pairWeight||a.code.localeCompare(b.code));
  if(!candidates.length)throw new Error(`Theme ${slotRow.slot} has no eligible PrimFusion Themes after applying its PrimPicker and Theme Exclusions.`);
  return{scope,candidates,weights:weightSpec};
}
function themeRerunCandidateSets(rerun){
  const protectedCodes=new Set();
  for(const row of rerun.themeSlots){
    if(row.state==='preserve'){
      if(!row.currentThemeCode)throw new Error(`Theme ${row.slot} cannot be preserved because its PFM code is unavailable.`);
      if(rerun.excludedThemeCodes.includes(row.currentThemeCode))throw new Error(`Theme ${row.slot} is both preserved and excluded.`);
      if(protectedCodes.has(row.currentThemeCode))throw new Error('Protected Theme slots must contain different PFM codes.');
      protectedCodes.add(row.currentThemeCode);
    }
  }
  const sets={};
  for(const row of rerun.themeSlots)sets[row.slot]=row.state==='preserve'?{scope:null,candidates:[{code:row.currentThemeCode}],weights:null}:themeRerunCandidateData(rerun,row);
  const slotCodes=[1,2,3].map(slot=>sets[slot].candidates.map(row=>row.code));
  const canAssign=(index,used)=>{if(index===slotCodes.length)return true;for(const code of slotCodes[index])if(!used.has(code)){used.add(code);if(canAssign(index+1,used))return true;used.delete(code);}return false;};
  if(!canAssign(0,new Set()))throw new Error('Theme Rerun constraints cannot produce three different Theme codes. Relax a Mandatory, Forbidden, or Theme Exclusion choice.');
  return sets;
}
function themeRerunPrompt(rerun,sets){
  const unionCodes=new Set();for(const slot of [1,2,3])for(const item of sets[slot].candidates)unionCodes.add(item.code);
  const vocabulary=PRIMFUSION_REGISTRY.aiThemeChoices.filter(row=>unionCodes.has(row.code)).map(row=>`${row.code} — ${row.name}${row.aiMeaning?` — Meaning: ${row.aiMeaning}`:''}`).join('\n');
  const slotBlocks=[];
  for(const row of rerun.themeSlots){
    if(row.state==='preserve'){slotBlocks.push(`THEME ${row.slot}: PRESERVE ${row.currentThemeCode}. This slot is immutable. Do not reassess it and do not output a line for it.`);continue;}
    const data=sets[row.slot],weights=data.weights,weightLine=PRIMFUSION_REGISTRY.primitives.map(p=>`${p.id}=${weights.weights[p.id]}`).join(', '),candidateLine=data.candidates.map(item=>`${item.code}(${item.pairWeight})`).join(', ');
    slotBlocks.push(`THEME ${row.slot}: ${row.state==='replace'?`REPLACE the current ${row.currentThemeCode||'Theme'}. The current code is not eligible for this slot.`:`NEUTRAL. You may keep ${row.currentThemeCode||'the current Theme'} if it remains the best eligible fit.`}\nPrimPicker scope: ${data.scope}. Effective P-code weights: ${weightLine}.\nEligible PFM codes for this slot, with pair preference score in parentheses: ${candidateLine}`);
  }
  const descriptionBlock=rerun.includedDescriptions.length?rerun.includedDescriptions.map((row,index)=>`REFERENCE DESCRIPTION ${index+1}${row.createdAt?` — ${row.createdAt}`:''}${row.version?` — v${row.version}`:''}:\n${row.text}`).join('\n\n'):'No AI Description context was included.';
  const openSlots=rerun.themeSlots.filter(row=>row.state!=='preserve').map(row=>row.slot);
  const outputLines=openSlots.map(slot=>`${slot}|matrix|PFM####|0-100|Brief image-grounded reason`).join('\n');
  return `You are performing a DIRECTOR-GUIDED Genreactrix Theme Rerun.\n\nThe image is always authoritative visual evidence. Reassess every slot that is not PRESERVE. A PRESERVE slot is immutable and is handled locally by Genreactrix.\n\nTheme identity is the PFM code. Human-readable Theme names are semantic labels only. The three final PFM codes MUST be different.\n\nPrimPicker rules:\n- Mandatory (100): hard requirement. An eligible PFM for that slot must contain every Mandatory P-code.\n- Preferred (80), Optional (60), Unchosen (40 or 50), and Discouraged (20) are steering weights. Higher pair scores are stronger Director preference, while image fit still matters.\n- Forbidden (0): hard prohibition. A PFM containing a Forbidden P-code is not eligible.\n- Theme Exclusions and a red slot's current PFM are hard prohibitions.\n- Do not use Reaction-analysis scores. PrimPicker values are Director instructions, not Reaction Analysis.\n\n${slotBlocks.join('\n\n')}\n\nINCLUDED AI DESCRIPTION CONTEXT:\n${descriptionBlock}\n\nELIGIBLE THEME SEMANTICS (union of the slot-specific allowed codes):\n${vocabulary}\n\nOUTPUT FORMAT — THIS IS REQUIRED:\nReturn exactly ${openSlots.length} pipe-delimited line${openSlots.length===1?'':'s'}, one for each open Theme slot in ascending slot order.\n${outputLines}\nUse an eligible PFM code for that exact slot. Confidence is 0-100. Rationale must briefly cite visible image evidence.\nDo not return JSON. Do not use Markdown, bullets, headings, commentary, or lines for PRESERVE slots.`;
}
function parseThemeRerunStructured(raw,rerun,sets){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Theme Rerun provider response was not an object.');
  const used=new Set(),selections=[];
  for(const slotRow of rerun.themeSlots){
    const rawRow=raw[`theme${slotRow.slot}`]||{},allowed=new Set(sets[slotRow.slot].candidates.map(item=>item.code));
    const code=slotRow.state==='preserve'?slotRow.currentThemeCode:String(rawRow.code||'').trim().toUpperCase();
    if(!code||!allowed.has(code))throw new Error(`Theme ${slotRow.slot} returned an ineligible PFM code.`);
    if(used.has(code))throw new Error(`Theme Rerun returned duplicate PFM code ${code}.`);used.add(code);
    if(slotRow.state==='preserve')selections.push({rank:slotRow.slot,source:'matrix',code,confidence:slotRow.currentThemeWeight??50,rationale:'Preserved by Director instruction.'});
    else{const confidence=Number(rawRow.confidence),rationale=String(rawRow.rationale||'').trim();if(!Number.isFinite(confidence))throw new Error(`Theme ${slotRow.slot} confidence was invalid.`);if(!rationale)throw new Error(`Theme ${slotRow.slot} rationale was empty.`);selections.push({rank:slotRow.slot,source:'matrix',code,confidence:Math.max(0,Math.min(100,confidence)),rationale});}
  }
  return selections;
}
function parseThemeRerunText(raw,rerun,sets){
  if(raw&&typeof raw==='object'&&!Array.isArray(raw))return parseThemeRerunStructured(raw,rerun,sets);
  const text=String(raw||'').trim();
  if(!text)throw new Error('Theme Rerun provider returned an empty response.');

  // Text mode is authoritative for Theme reruns, but accept a valid JSON object
  // if the model voluntarily emits one despite the requested line protocol.
  try{
    const structured=parse(text);
    if(structured&&typeof structured==='object'&&!Array.isArray(structured))return parseThemeRerunStructured(structured,rerun,sets);
  }catch{}

  const rows=new Map();
  const openSlots=rerun.themeSlots.filter(row=>row.state!=='preserve').map(row=>row.slot);
  const preservedCodes=new Set(rerun.themeSlots.filter(row=>row.state==='preserve').map(row=>row.currentThemeCode).filter(Boolean));
  const allowedBySlot=new Map(openSlots.map(slot=>[slot,new Set(sets[slot].candidates.map(item=>item.code))]));
  const rawLines=text.split(/\r?\n/);

  const confidenceFrom = value => {
    const percent=String(value||'').match(/(?:^|\D)(100|[1-9]?\d(?:\.\d+)?)\s*%/);
    if(percent)return Math.max(0,Math.min(100,Number(percent[1])));
    const bare=String(value||'').match(/(?:^|[|,:;\-–—\s])(100|[1-9]?\d(?:\.\d+)?)(?=$|[|,:;\-–—\s])/);
    return bare?Math.max(0,Math.min(100,Number(bare[1]))):null;
  };
  const slotFrom = value => {
    const v=String(value||'');
    let m=v.match(/\b(?:THEME|SLOT|RANK)\s*#?\s*([123])\b/i);
    if(m)return Number(m[1]);
    m=v.match(/^\s*#?\s*([123])\s*(?:[.)\]:\-–—|]|$)/);
    if(m)return Number(m[1]);
    m=v.match(/\bTHEME\s+(ONE|TWO|THREE)\b/i);
    if(m)return({ONE:1,TWO:2,THREE:3})[m[1].toUpperCase()]||null;
    return null;
  };
  const rationaleFor = (line,code) => {
    const cleaned=String(line||'').replace(/^\s*[-*•]+\s*/,'').trim();
    if(cleaned)return cleaned.slice(0,1000);
    return `Provider response selected ${code}.`;
  };

  // First pass: exact/near-exact pipe formats. Also accept Markdown table rows
  // with a leading/trailing pipe, which the v0.9.6.29 parser rejected.
  for(const line of rawLines){
    const cleaned=line.replace(/^\s*[-*•]+\s*/,'').trim().replace(/^\|\s*/,'').replace(/\s*\|$/,'');
    if(!cleaned||!cleaned.includes('|'))continue;
    const parts=cleaned.split('|').map(part=>part.trim());
    if(parts.length<2)continue;
    const slot=slotFrom(parts[0]);
    if(!openSlots.includes(slot))continue;

    let code=null,confidence=null,rationale='';
    const matrixIndex=parts.findIndex(part=>String(part).toLowerCase()==='matrix');
    const codeIndex=parts.findIndex(part=>/\bPFM\d{4}\b/i.test(part));
    if(codeIndex>=0)code=String(parts[codeIndex].match(/PFM\d{4}/i)[0]).toUpperCase();
    if(!code)continue;
    if(matrixIndex>=0&&codeIndex===matrixIndex+1){
      confidence=confidenceFrom(parts[codeIndex+1]);
      rationale=parts.slice(codeIndex+2).join('|').trim();
    }else{
      confidence=confidenceFrom(parts[codeIndex+1]||cleaned);
      rationale=parts.slice(codeIndex+2).join('|').trim();
    }
    if(confidence==null)confidence=confidenceFrom(cleaned)??70;
    if(!rationale)rationale=rationaleFor(line,code);
    if(allowedBySlot.get(slot)?.has(code)&&!preservedCodes.has(code))rows.set(slot,{code,confidence,rationale});
  }

  // Second pass: tolerate ordinary prose/Markdown such as
  // "Theme 1: PFM0407 — 88% — reason" or "1. **PFM0407** (88%) reason".
  // If a line explicitly names a slot, assign only when that code is eligible
  // for that exact slot.
  const codeOccurrences=[];
  for(let lineIndex=0;lineIndex<rawLines.length;lineIndex++){
    const line=rawLines[lineIndex];
    const re=/\b(PFM\d{4})\b/ig;let m;
    while((m=re.exec(line))){
      const code=m[1].toUpperCase();
      const explicitSlot=slotFrom(line);
      const confidence=confidenceFrom(line)??70;
      const occurrence={code,line,lineIndex,offset:m.index,explicitSlot,confidence,rationale:rationaleFor(line,code)};
      codeOccurrences.push(occurrence);
      if(explicitSlot&&openSlots.includes(explicitSlot)&&!rows.has(explicitSlot)&&allowedBySlot.get(explicitSlot)?.has(code)&&!preservedCodes.has(code)){
        rows.set(explicitSlot,{code,confidence,rationale:occurrence.rationale});
      }
    }
  }

  // Third pass: if the model supplied PFM codes but omitted usable slot labels,
  // assign the remaining unique codes to remaining open slots in response order.
  // A tiny backtracking match preserves slot-specific eligibility for future
  // mixed Green/Red/Neutral reruns instead of blindly treating order as truth.
  const usedCodes=new Set([...preservedCodes,...[...rows.values()].map(row=>row.code)]);
  const remainingSlots=openSlots.filter(slot=>!rows.has(slot));
  const pool=[];
  for(const occ of codeOccurrences){
    if(usedCodes.has(occ.code)||pool.some(item=>item.code===occ.code))continue;
    pool.push(occ);
  }
  const assignment=new Map();
  const assign=(index,used)=>{
    if(index>=remainingSlots.length)return true;
    const slot=remainingSlots[index];
    for(let i=0;i<pool.length;i++){
      const occ=pool[i];
      if(used.has(occ.code)||!allowedBySlot.get(slot)?.has(occ.code))continue;
      // An explicit label for a different open slot is strong evidence and
      // should not be silently reassigned here.
      if(occ.explicitSlot&&occ.explicitSlot!==slot)continue;
      used.add(occ.code);assignment.set(slot,occ);
      if(assign(index+1,used))return true;
      assignment.delete(slot);used.delete(occ.code);
    }
    return false;
  };
  assign(0,new Set(usedCodes));
  for(const [slot,occ] of assignment)rows.set(slot,{code:occ.code,confidence:occ.confidence,rationale:occ.rationale});

  const structured={};
  for(const slotRow of rerun.themeSlots){
    if(slotRow.state==='preserve')structured[`theme${slotRow.slot}`]={code:slotRow.currentThemeCode};
    else{
      const row=rows.get(slotRow.slot);
      if(!row){
        const preview=text.replace(/\s+/g,' ').slice(0,500);
        throw new Error(`Theme ${slotRow.slot} was missing from the Theme Rerun response.${preview?` Provider preview: ${preview}`:''}`);
      }
      structured[`theme${slotRow.slot}`]=row;
    }
  }
  return parseThemeRerunStructured(structured,rerun,sets);
}
async function runThemeRerun(env,model,image,behavior,input){
  const rerun=normalizeThemeRerun(input);if(!rerun)throw new Error('Theme Rerun request was missing.');
  const sets=themeRerunCandidateSets(rerun),basePrompt=themeRerunPrompt(rerun,sets),openSlots=rerun.themeSlots.filter(row=>row.state!=='preserve');
  if(!openSlots.length){
    const local={};for(const row of rerun.themeSlots)local[`theme${row.slot}`]={code:row.currentThemeCode};
    return{rerun,sets,selections:parseThemeRerunStructured(local,rerun,sets)};
  }
  let lastError=null;
  for(let attempt=1;attempt<=3;attempt++){
    const recovery=attempt===1?'':`\n\nRECOVERY: The prior response could not be accepted${lastError?.message?`: ${String(lastError.message).slice(0,300)}`:''}. Return only the exact established Theme Analysis pipe-delimited line format requested for each open Theme slot. Use an eligible PFM code for that slot, keep all final codes unique, and obey every REPLACE, PrimPicker, and Theme Exclusion constraint.`;
    const raw=await runStructured(env,model,image,basePrompt+recovery,null,1600,'text',{behavior,themeRerun:true,temperature:attempt===1?0.18:0.05});
    try{return{rerun,sets,selections:parseThemeRerunText(raw,rerun,sets)};}catch(error){
      lastError=diagnosticError(
        error?.message||'Theme Rerun text response could not be parsed.',
        {phase:'theme-rerun-text-parse',attempt,responsePreview:String(raw||'').slice(0,1200)}
      );
    }
  }
  throw lastError||new Error('Theme Rerun did not produce a valid result.');
}

function normalizeDescriptionRerun(input){
  if(!input||typeof input!=='object')return null;
  const operation=['all','add','replace'].includes(String(input.operation||''))?String(input.operation):'all';
  const themes=Array.isArray(input.themes)?input.themes.slice(0,6).map(row=>({source:String(row?.source||''),slot:Number(row?.slot)||0,label:String(row?.label||''),weight:Number.isFinite(Number(row?.weight))?Number(row.weight):null})).filter(row=>row.label):[];
  const includedDescriptions=Array.isArray(input.includedDescriptions)?input.includedDescriptions.map(row=>({artifactId:row?.artifactId?String(row.artifactId):null,version:Number(row?.version)||0,createdAt:String(row?.createdAt||''),label:String(row?.label||''),text:String(row?.text||'')})).filter(row=>row.text.trim()):[];
  let targetDescription=null;
  if(input.targetDescription&&typeof input.targetDescription==='object'){
    const text=String(input.targetDescription.text||''),start=Math.max(0,Math.min(text.length,Number(input.targetDescription.start)||0)),end=Math.max(start,Math.min(text.length,Number(input.targetDescription.end)||0));
    targetDescription={artifactId:input.targetDescription.artifactId?String(input.targetDescription.artifactId):null,version:Number(input.targetDescription.version)||0,createdAt:String(input.targetDescription.createdAt||''),label:String(input.targetDescription.label||''),text,start,end,selectedText:String(input.targetDescription.selectedText||text.slice(start,end))};
  }
  return{schemaVersion:1,operation,themes,includedDescriptions,targetDescription};
}

function descriptionPrompt(directorGuidance="",descriptionRerun=null){
  const guidance=String(directorGuidance||'').trim().slice(0,6000),rerun=normalizeDescriptionRerun(descriptionRerun);
  const guidanceBlock=guidance ? `\n\nDIRECTOR GUIDANCE:\n${guidance}` : '';
  let contextBlock='';
  if(rerun){
    const themeBlock=rerun.themes.length?rerun.themes.map(row=>`- ${row.source} Theme ${row.slot}: ${row.label}${row.weight!=null?` (${row.weight}%)`:''}`).join('\n'):'No Themes were selected for context.';
    const descriptionsBlock=rerun.includedDescriptions.length?rerun.includedDescriptions.map((row,index)=>`REFERENCE DESCRIPTION ${index+1} — ${row.label||row.createdAt||'undated'}${row.version?` — v${row.version}`:''}:\n${row.text}`).join('\n\n'):'No historical Descriptions were selected for reference context.';
    let operationBlock='';
    if(rerun.operation==='add'){
      const target=rerun.targetDescription;if(!target||!target.text.trim())throw new Error('Description Add rerun requires a populated target Description');
      operationBlock=`OPERATION: ADD AT CURSOR.\nThe target Description is shown below with ⟦CURSOR⟧ at the exact insertion point. Return ONLY the new prose fragment that should be inserted there. Do not repeat the existing prefix or suffix, do not rewrite surrounding text, and do not add commentary about the edit.\n\nTARGET DESCRIPTION:\n${target.text.slice(0,target.start)}⟦CURSOR⟧${target.text.slice(target.start)}`;
    }else if(rerun.operation==='replace'){
      const target=rerun.targetDescription;if(!target||!target.text.trim()||target.end<=target.start)throw new Error('Description Replace rerun requires a highlighted target span');
      operationBlock=`OPERATION: REPLACE HIGHLIGHTED SECTION.\nThe target Description is shown below with the exact editable span marked. Return ONLY replacement prose for the highlighted span. Everything outside the markers is immutable and will be preserved locally by Genreactrix. Do not repeat unchanged surrounding text and do not explain the edit.\n\nTARGET DESCRIPTION:\n${target.text.slice(0,target.start)}⟦HIGHLIGHT START⟧${target.text.slice(target.start,target.end)}⟦HIGHLIGHT END⟧${target.text.slice(target.end)}`;
    }else{
      operationBlock='OPERATION: REWRITE ALL. Return a complete new AI Description of the image. Historical Descriptions, if selected, are reference context only; use, revise, or discard their observations according to what the image actually supports.';
    }
    contextBlock=`\n\nGENREACTRIX RERUN WORKSPACE CONTEXT:\n${operationBlock}\n\nSELECTED THEME CONTEXT:\n${themeBlock}\n\nSELECTED DESCRIPTION CONTEXT:\n${descriptionsBlock}`;
  }
  const outputRule=rerun?.operation==='add'?'Return only the insertion fragment as plain prose.':rerun?.operation==='replace'?'Return only the replacement fragment as plain prose.':'Return the complete freeform analysis directly as prose.';
  return `You are performing Genreactrix Freeform AI Description Analysis.

Study the image closely and provide a robust, substantial visual analysis rather than a short caption.
Be curious and observant. Discuss whatever is materially useful or revealing about the image without forcing the analysis into a fixed checklist.
You may address subjects, objects, actions, setting, composition, medium or style, visible text, relationships, visual jokes, unusual juxtapositions, mood, tone, possible themes, symbolism, ambiguity, implied action, anomalies, or other grounded observations when relevant.

Do not artificially limit the analysis to predefined categories.
Do not invent hidden identity, biography, or facts that cannot reasonably be supported by the image.
When moving beyond direct observation into interpretation, phrase it as interpretation rather than certainty.${contextBlock}${guidanceBlock}

${outputRule} Do not wrap the answer in JSON, Markdown code fences, or a field label.`;
}

function descriptionSchema(){
  return {
    type:'object',
    properties:{description:{type:'string'}},
    required:['description'],
    additionalProperties:false
  };
}

async function runStructured(env, model, image, prompt, schema, maxTokens=2600, responseMode='json_schema', options={}){
  let payload;
  const behavior = options.behavior === 'reanalyze' ? 'reanalyze' : 'analyze';
  const freshRerun = behavior === 'reanalyze'
    ? (options.scopedEdit
      ? ' This is a rerun. Reassess the visual evidence, but obey the exact scoped edit boundary: return only the requested insertion or replacement fragment and leave all other target text to Genreactrix.'
      : options.themeRerun
        ? ' This is a fresh Theme rerun. Reassess only the slots that are open to change, obey Director constraints exactly, and copy every preserved slot unchanged.'
        : options.reactionEvidenceMode === 'image+description'
          ? ' This is a fresh Reaction rerun. Reassess the image and supplied AI Description together as the two selected evidence sources. Do not mechanically reproduce a prior plausible answer; reconsider the relative evidence from both sources.'
          : ' This is a fresh rerun. Reassess the image independently from scratch. Do not mechanically reproduce a prior plausible answer; reconsider the relative evidence while remaining faithful to what is visible.')
    : '';
  const temperature = Number.isFinite(options.temperature)
    ? options.temperature
    : (behavior === 'reanalyze' ? 0.35 : 0.1);

  try{
    const fullPrompt=prompt + freshRerun;
    const multimodalMessages=options.multimodalMessages===true;
    const request = multimodalMessages
      ? {
          messages:[{
            role:'user',
            content:[
              {type:'text',text:fullPrompt},
              {type:'image_url',image_url:{url:imageBytesDataUrl(image)}}
            ]
          }],
          max_tokens:maxTokens,
          temperature
        }
      : {
          prompt:fullPrompt,
          max_tokens:maxTokens,
          temperature
        };
    if (!multimodalMessages && image && (image.byteLength || image.length)) request.image = image;
    if (responseMode === 'guided_json') {
      // Cloudflare Workers AI binding parameter: schema-guided JSON generation.
      request.guided_json = schema;
    } else if (responseMode === 'json_schema') {
      request.response_format = {type:'json_schema',json_schema:schema};
    } else if (responseMode === 'json_object') {
      request.response_format = {type:'json_object'};
    }

    payload = await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error(`Provider call timed out after ${Math.round(PROVIDER_CALL_TIMEOUT_MS/1000)}s`)),PROVIDER_CALL_TIMEOUT_MS);
      Promise.resolve(env.AI.run(model,request)).then(
        value=>{clearTimeout(timer);resolve(value)},
        error=>{clearTimeout(timer);reject(error)}
      );
    });
  }catch(error){
    throw diagnosticError(
      `Workers AI vision failed: ${error?.message||error}`,
      {
        phase:'provider-call',
        errorName:error?.name || null,
        errorMessage:String(error?.message || error).slice(0,1200)
      }
    );
  }

  const value = responseValue(payload);
  if (value === '' || value == null) {
    throw diagnosticError(
      'Workers AI returned no analysis response',
      safeProviderDiagnostic(payload)
    );
  }

  if (responseMode === 'text') {
    if (typeof value === 'string') return options.preserveWhitespace ? value : value.trim();
    if (value && typeof value === 'object') return JSON.stringify(value);
    const text=String(value);
    return options.preserveWhitespace ? text : text.trim();
  }

  return parseProviderResponse(payload);
}


const PROMPT_DIAGNOSTIC_BATCH_SIZE = 15;
const PROMPT_DIAGNOSTIC_BATCH_COUNT = 7;
const PROMPT_DIAGNOSTIC_WAVE_SIZE = 5;

function promptDiagnosticDefinitionParts(definition){
  const text=String(definition||'').trim();
  if(!text)return[];
  const parts=[];
  for(const paragraph of text.split(/\n+/).map(v=>v.trim()).filter(Boolean)){
    const sentences=paragraph.split(/(?<=[.!?])\s+/).map(v=>v.trim()).filter(Boolean);
    for(const sentence of sentences){
      const clauses=sentence.split(/;\s+/).map(v=>v.trim()).filter(Boolean);
      for(const clause of clauses)parts.push(clause);
    }
  }
  return parts.length?parts:[text];
}

function promptDiagnosticVocabulary(){
  const prims=PRIMFUSION_REGISTRY.primitives.map(row=>({
    code:row.id,name:row.name,kind:'prim',symbol:row.symbol||'',primIds:[row.id],definition:String(row.aiMeaning||'')
  }));
  const themes=PRIMFUSION_REGISTRY.aiThemeChoices.map(row=>({
    code:row.code,name:row.name,kind:'fusion',symbol:'',primIds:Array.isArray(row.primIds)?[...row.primIds]:[],definition:String(row.aiMeaning||'')
  }));
  const batches=[];
  for(let batchIndex=0;batchIndex<PROMPT_DIAGNOSTIC_BATCH_COUNT;batchIndex++){
    const primSlice=prims.slice(batchIndex*2,batchIndex*2+2);
    const themeSlice=themes.slice(batchIndex*13,batchIndex*13+13);
    batches.push([...primSlice,...themeSlice].map((row,index)=>({
      ...row,
      batchIndex,
      position:index+1,
      definitionParts:promptDiagnosticDefinitionParts(row.definition)
    })));
  }
  if(batches.length!==7||batches.some(batch=>batch.length!==15))throw new Error('Prompt Diagnostics vocabulary must resolve to seven 15-concept batches');
  return batches;
}

const PROMPT_DIAGNOSTIC_BATCHES = promptDiagnosticVocabulary();

function normalizePromptDiagnosticSources(input){
  const sources={
    image:Boolean(input?.image),
    reactions:Boolean(input?.reactions),
    description:Boolean(input?.description)
  };
  if(!sources.image&&!sources.reactions&&!sources.description)throw new Error('Prompt Diagnostics requires at least one evidence source');
  return sources;
}

function normalizePromptDiagnosticReactionScores(raw){
  const source=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
  const out={};
  for(const prim of PRIMFUSION_REGISTRY.primitives){
    const value=source[prim.id];
    const n=typeof value==='number'?value:Number(value?.percentage??value?.confidence??value?.score??value?.weight??value?.value??value);
    out[prim.id]=Number.isFinite(n)?Math.max(0,Math.min(100,n)):0;
  }
  return out;
}

function promptDiagnosticSourceLabel(sources){
  return ['image','reactions','description'].filter(key=>sources[key]).join('+');
}

function promptDiagnosticCallSpec(body){
  const batchIndex=Number(body?.batchIndex);
  if(!Number.isInteger(batchIndex)||batchIndex<0||batchIndex>=PROMPT_DIAGNOSTIC_BATCH_COUNT)throw new Error('Prompt Diagnostics batchIndex must be 0-6');
  const requested=String(body?.callMode||'fifteen').trim().toLowerCase();
  const callMode=requested==='five'?'five':'fifteen';
  const batch=PROMPT_DIAGNOSTIC_BATCHES[batchIndex];
  if(callMode==='fifteen')return{batchIndex,callMode,waveIndex:null,waveNumber:null,waveCount:1,conceptOffset:0,concepts:batch};
  const waveIndex=Number(body?.waveIndex);
  if(!Number.isInteger(waveIndex)||waveIndex<0||waveIndex>2)throw new Error('Prompt Diagnostics five-concept waveIndex must be 0-2');
  const conceptOffset=waveIndex*PROMPT_DIAGNOSTIC_WAVE_SIZE;
  const concepts=batch.slice(conceptOffset,conceptOffset+PROMPT_DIAGNOSTIC_WAVE_SIZE);
  if(concepts.length!==PROMPT_DIAGNOSTIC_WAVE_SIZE)throw new Error('Prompt Diagnostics five-concept wave did not resolve to exactly 5 concepts');
  return{batchIndex,callMode,waveIndex,waveNumber:waveIndex+1,waveCount:3,conceptOffset,concepts};
}

function promptDiagnosticPrompt({callSpec,sources,reactions,description}){
  const {concepts:batch,callMode,waveNumber}=callSpec;
  const sourceLabel=promptDiagnosticSourceLabel(sources);
  const evidence=[];
  if(sources.image)evidence.push('IMAGE: The supplied image is evidence. Judge only what can reasonably be seen or inferred from it.');
  if(sources.reactions){
    const reactionLines=PRIMFUSION_REGISTRY.primitives.map(p=>`${p.id} ${p.name}: ${Math.round((reactions[p.id]||0)*10)/10}%`).join('\n');
    evidence.push(`CURRENT REACTION EVIDENCE: Treat these as supplied reaction measurements, not as ground truth and not as Theme selections.\n${reactionLines}`);
  }
  if(sources.description)evidence.push(`CURRENT AI DESCRIPTION: Treat this as supplied observational/interpretive evidence, not as ground truth and not as a Theme selection.\n${description}`);

  const concepts=batch.map(row=>{
    const numbered=row.definitionParts.map((part,index)=>`  [${index+1}] ${part}`).join('\n');
    return `CONCEPT ${row.code} — ${row.name} — ${row.kind==='prim'?'PRIM BUILDING BLOCK (diagnostic only; not selectable as a final Theme)':'PRIMFUSION THEME'}\nCURRENT WORKER DEFINITION (verbatim):\n${row.definition}\nDEFINITION PARTS TO ASSESS:\n${numbered}`;
  }).join('\n\n');

  const callLabel=callMode==='five'?`5-concept wave ${waveNumber} of 3 within this 15-concept batch`:'15 concepts at once';
  const count=batch.length;
  return `You are running GENREACTRIX PROMPT DIAGNOSTICS. This is research instrumentation, not normal Theme selection.

DIAGNOSTIC CALL FORMAT: ${callLabel}
EVIDENCE SOURCE COMBINATION: ${sourceLabel}
${evidence.join('\n\n')}

Evaluate EACH of the ${count} concepts below INDEPENDENTLY against the available evidence and against its exact current Worker definition.

SCORING RULES:
- Give every concept its own 0-100 MATCH CONFIDENCE. These scores are independent. They do NOT add to 100, are NOT shares of a pool, and must NOT be normalized against one another.
- Do NOT choose three winners. Do NOT rank concepts as a substitute for scoring them. A concept can score 0 even when others score highly, and many concepts can simultaneously score highly.
- Base the score on the supplied definition. The purpose is to discover what the AI sees, does not see, understands, misunderstands, or fails to associate with the definition.
- Assess EVERY numbered definition part for EVERY concept. Do not skip a part because the final score is low.
- A 0% score requires a full explanation. For a zero, explicitly state why each definition part has no supporting evidence, is contradicted, or cannot be established from the selected evidence sources.
- Conversely, high confidence must be justified by concrete definition-level support. Do not inflate confidence merely because a concept is vaguely plausible.
- For PrimFusion Themes, do not automatically infer the Theme just because its two constituent Prims might fit. Judge the fusion Theme's own supplied definition.
- For standalone Prims, judge the Prim definition directly. They are diagnostic building blocks and cannot be selected as final Genreactrix Themes.
- If an evidence source is silent on something, say so. Do not invent missing image details, reaction meaning, or Description content.

For each definition part use exactly one assessment label: SUPPORTS, PARTIAL, ABSENT, CONTRADICTS, or NOT_OBSERVABLE.

Return ONLY valid JSON in this shape:
{"results":[{"code":"P01 or PFM####","confidence":0,"definitionAnalysis":[{"part":1,"assessment":"SUPPORTS|PARTIAL|ABSENT|CONTRADICTS|NOT_OBSERVABLE","reason":"concise evidence-grounded reason"}],"scoreReason":"concise explanation of why the part-level findings justify the final score"}]}

Every listed concept must appear exactly once, and every numbered definition part for that concept must appear exactly once.

${count} CONCEPTS:
${concepts}`;
}

function parsePromptDiagnosticResponse(raw,expected){
  const parsed=parse(raw);
  const rows=Array.isArray(parsed?.results)?parsed.results:[];
  if(rows.length!==expected.length)throw new Error(`Prompt Diagnostics expected ${expected.length} results but received ${rows.length}`);
  const byCode=new Map(rows.map(row=>[String(row?.code||'').trim().toUpperCase(),row]));
  const allowedAssessments=new Set(['SUPPORTS','PARTIAL','ABSENT','CONTRADICTS','NOT_OBSERVABLE']);
  return expected.map(concept=>{
    const rawRow=byCode.get(concept.code);
    if(!rawRow)throw new Error(`Prompt Diagnostics response omitted ${concept.code}`);
    const confidence=Number(rawRow.confidence);
    if(!Number.isFinite(confidence)||confidence<0||confidence>100)throw new Error(`Prompt Diagnostics confidence for ${concept.code} must be numeric 0-100`);
    const analyses=Array.isArray(rawRow.definitionAnalysis)?rawRow.definitionAnalysis:[];
    if(analyses.length!==concept.definitionParts.length)throw new Error(`Prompt Diagnostics ${concept.code} must assess all ${concept.definitionParts.length} definition parts`);
    const byPart=new Map(analyses.map(item=>[Number(item?.part),item]));
    const definitionAnalysis=concept.definitionParts.map((text,index)=>{
      const part=index+1,item=byPart.get(part);
      if(!item)throw new Error(`Prompt Diagnostics ${concept.code} omitted definition part ${part}`);
      const assessment=String(item.assessment||'').trim().toUpperCase();
      if(!allowedAssessments.has(assessment))throw new Error(`Prompt Diagnostics ${concept.code} part ${part} has invalid assessment`);
      const reason=String(item.reason||'').trim();
      if(!reason)throw new Error(`Prompt Diagnostics ${concept.code} part ${part} needs a reason`);
      return{part,text,assessment,reason};
    });
    const scoreReason=String(rawRow.scoreReason||'').trim();
    if(!scoreReason)throw new Error(`Prompt Diagnostics ${concept.code} needs a score reason`);
    return{
      code:concept.code,name:concept.name,kind:concept.kind,symbol:concept.symbol,primIds:[...concept.primIds],position:concept.position,
      confidence:Math.round(confidence*10)/10,definition:concept.definition,definitionAnalysis,scoreReason
    };
  });
}

async function runPromptDiagnosticBatch(env,body){
  const callSpec=promptDiagnosticCallSpec(body);
  const {batchIndex,callMode,waveIndex,waveNumber,waveCount,conceptOffset,concepts}=callSpec;
  const sources=normalizePromptDiagnosticSources(body?.sources);
  const reactions=normalizePromptDiagnosticReactionScores(body?.reactions);
  const description=sources.description?String(body?.description||'').trim().slice(0,12000):'';
  if(sources.description&&!description)throw new Error('Prompt Diagnostics selected Description but no AI Description was supplied');
  if(sources.reactions&&(!body?.reactions||typeof body.reactions!=='object'))throw new Error('Prompt Diagnostics selected Reactions but no Reaction scores were supplied');
  const image=sources.image?(body.imageDataUrl?dataUrlBytes(body.imageDataUrl):await fetchBytes(body.imageUrl)):null;
  const model=env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL;
  const prompt=promptDiagnosticPrompt({callSpec,sources,reactions,description});
  let lastError=null;
  const outputTokens=callMode==='five'?3600:7200;
  for(let attempt=1;attempt<=3;attempt++){
    const recovery=attempt===1?'':`\n\nRECOVERY: The previous diagnostic response was invalid${lastError?.message?`: ${String(lastError.message).slice(0,350)}`:''}. Return only valid JSON, include all ${concepts.length} requested codes exactly once, and assess every numbered definition part exactly once.`;
    const raw=await runStructured(env,model,image,prompt+recovery,null,outputTokens,'text',{temperature:attempt===1?0.12:0.03});
    try{
      return{
        schemaVersion:2,
        matrixVersion:matrixVersion(),
        workerVersion:API_VERSION,
        batchIndex,
        batchNumber:batchIndex+1,
        batchCount:PROMPT_DIAGNOSTIC_BATCH_COUNT,
        batchSize:PROMPT_DIAGNOSTIC_BATCH_SIZE,
        callMode,
        callConceptCount:concepts.length,
        conceptOffset,
        waveIndex,
        waveNumber,
        waveCount,
        sourceCombination:promptDiagnosticSourceLabel(sources),
        sources,
        model,
        evaluatedAt:new Date().toISOString(),
        results:parsePromptDiagnosticResponse(raw,concepts)
      };
    }catch(error){lastError=error;}
  }
  throw lastError||new Error('Prompt Diagnostics did not produce a valid response');
}

function themeRecoverySchema(){
  const validCodes = PRIMFUSION_REGISTRY.aiThemeChoices.map(t=>t.code);
  return {
    type:'object',
    properties:{
      themes:{
        type:'array',minItems:3,maxItems:3,
        items:{
          type:'object',
          properties:{
            source:{type:'string',enum:CUSTOM_THEME_GENERATION_ENABLED?['matrix','custom']:['matrix']},
            value:{type:'string'},
            confidence:{type:'number',minimum:0,maximum:100},
            rationale:{type:'string'}
          },
          required:['source','value','confidence','rationale'],
          additionalProperties:false
        }
      }
    },
    required:['themes'],
    additionalProperties:false
  };
}

function themeStructuredRecoveryPrompt(analysisContext=""){
  const example = CUSTOM_THEME_GENERATION_ENABLED
    ? `{"themes":[{"source":"matrix","value":"PFM0205","confidence":92,"rationale":"image-grounded reason"},{"source":"matrix","value":"PFM0104","confidence":81,"rationale":"image-grounded reason"},{"source":"custom","value":"Distinct Custom Theme","confidence":70,"rationale":"image-grounded reason"}]}`
    : `{"themes":[{"source":"matrix","value":"PFM0205","confidence":92,"rationale":"image-grounded reason"},{"source":"matrix","value":"PFM0104","confidence":81,"rationale":"image-grounded reason"},{"source":"matrix","value":"PFM0608","confidence":70,"rationale":"image-grounded reason"}]}`;
  return `${themePrompt(analysisContext)}

STRUCTURED RECOVERY MODE:
The normal three-line response could not be parsed. Re-evaluate the image and return exactly one JSON object with exactly three DIFFERENT selections:
${example}
For source "matrix", value MUST be one valid PFM code from the vocabulary above.
${CUSTOM_THEME_GENERATION_ENABLED ? 'For source "custom", value MUST be a concise semantic Theme name that does not duplicate a matrix Theme or standalone Prim.' : 'Custom Theme output is disabled. Every source MUST be "matrix".'}
Return exactly three unique selections and use every required field.`;
}

function parseThemeStructured(raw){
  const themes = Array.isArray(raw?.themes) ? raw.themes : [];
  const byCode = new Map(PRIMFUSION_REGISTRY.aiThemeChoices.map(t=>[t.code,t]));
  const existingNames = new Set(PRIMFUSION_REGISTRY.aiThemeChoices.map(t=>String(t.name).trim().toLowerCase()));
  const primitiveNames = new Set(PRIMFUSION_REGISTRY.primitives.map(p=>String(p.name).trim().toLowerCase()));
  const usedCodes = new Set();
  const usedNames = new Set();
  const selections = [];

  for (const item of themes){
    if (!item || typeof item !== 'object') continue;
    const source = String(item.source||'').toLowerCase();
    const value = String(item.value||'').trim();
    const confidence = Number(item.confidence);
    const rationale = String(item.rationale||'').trim();
    if (!value || !Number.isFinite(confidence)) continue;

    if (source === 'matrix') {
      const resolved = byCode.get(value);
      if (!resolved || usedCodes.has(value)) continue;
      const nameKey = String(resolved.name).trim().toLowerCase();
      if (usedNames.has(nameKey)) continue;
      usedCodes.add(value);
      usedNames.add(nameKey);
      selections.push({rank:selections.length+1,source:'matrix',code:value,confidence:Math.max(0,Math.min(100,confidence)),rationale});
    } else if (source === 'custom' && CUSTOM_THEME_GENERATION_ENABLED) {
      const nameKey = value.toLowerCase();
      if (existingNames.has(nameKey) || primitiveNames.has(nameKey) || usedNames.has(nameKey)) continue;
      usedNames.add(nameKey);
      selections.push({rank:selections.length+1,source:'custom',proposedName:value,confidence:Math.max(0,Math.min(100,confidence)),rationale});
    }
  }

  if (selections.length !== 3) {
    throw diagnosticError(
      `Theme structured recovery yielded ${selections.length} unique valid selections instead of 3`,
      {
        phase:'theme-structured-parse',
        responseType:Array.isArray(raw) ? 'array' : typeof raw,
        responsePreview:JSON.stringify(raw).slice(0,1200)
      }
    );
  }

  return selections;
}

function parseThemeText(raw){
  const lines = String(raw).split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const byCode = new Map(PRIMFUSION_REGISTRY.aiThemeChoices.map(t=>[t.code,t]));
  const existingNames = new Map(
    PRIMFUSION_REGISTRY.aiThemeChoices.map(t=>[String(t.name).trim().toLowerCase(),t])
  );
  const primitiveNames = new Set(PRIMFUSION_REGISTRY.primitives.map(p=>String(p.name).trim().toLowerCase()));
  const selections = [];
  const usedCodes = new Set();
  const usedNames = new Set();

  const addSelection = selection => {
    const canonicalName = selection.source === 'matrix'
      ? String(byCode.get(selection.code)?.name || '').trim()
      : String(selection.proposedName || '').trim();

    if (!canonicalName) return false;

    const nameKey = canonicalName.toLowerCase();
    if (selection.source === 'matrix') {
      if (!byCode.has(selection.code) || usedCodes.has(selection.code) || usedNames.has(nameKey)) return false;
    } else {
      // A custom Theme is invalid if it merely duplicates any existing matrix Theme
      // or a Theme already selected in this result.
      if (existingNames.has(nameKey) || primitiveNames.has(nameKey) || usedNames.has(nameKey)) return false;
    }

    if (selection.source === 'matrix') usedCodes.add(selection.code);
    usedNames.add(nameKey);
    selections.push(selection);
    return true;
  };

  for (const line of lines) {
    const cleaned = line.replace(/^\s*[-*]\s*/, '');
    const parts = cleaned.split('|').map(x=>x.trim());
    if (parts.length < 4) continue;

    const rank = Number(parts[0].replace(/[^0-9]/g,''));
    const source = parts[1].toLowerCase();
    const value = parts[2];
    const confidence = Math.max(0, Math.min(100, Number(parts[3].replace(/[^0-9.]/g,''))));
    const rationale = parts.slice(4).join('|').trim();

    if (![1,2,3].includes(rank) || !Number.isFinite(confidence)) continue;

    if (source === 'matrix' && byCode.has(value)) {
      addSelection({
        rank,
        source:'matrix',
        code:value,
        confidence,
        rationale
      });
    } else if (source === 'custom' && CUSTOM_THEME_GENERATION_ENABLED && value) {
      addSelection({
        rank,
        source:'custom',
        proposedName:value,
        confidence,
        rationale
      });
    }
  }

  // Fallback for Markdown/prose output. Preserve the explanatory text from
  // the line/paragraph around each code as rationale where possible.
  if (selections.length < 3) {
    const rawText = String(raw);
    const codePattern = /\b(PFM(?:0[1-9]|1[0-4])(?:0[1-9]|1[0-4]))\b/g;
    let match;

    while ((match = codePattern.exec(rawText)) && selections.length < 3) {
      const code = match[1];
      if (!byCode.has(code) || usedCodes.has(code)) continue;

      const lineStart = rawText.lastIndexOf('\n', match.index) + 1;
      const lineEndRaw = rawText.indexOf('\n', match.index);
      const lineEnd = lineEndRaw === -1 ? rawText.length : lineEndRaw;
      const line = rawText.slice(lineStart, lineEnd).trim();

      const added = addSelection({
        rank:selections.length+1,
        source:'matrix',
        code,
        confidence:Math.max(60,90-(selections.length*10)),
        rationale:line
      });

      if (!added) continue;
    }
  }

  selections.sort((a,b)=>a.rank-b.rank);

  if (selections.length !== 3) {
    throw diagnosticError(
      `Theme provider response yielded ${selections.length} unique valid selections instead of 3`,
      {
        phase:'theme-text-parse',
        responseType:'string',
        responsePreview:String(raw).slice(0,1200)
      }
    );
  }

  // Normalize ranks after duplicate filtering/fallback.
  return selections.slice(0,3).map((item,index)=>({...item,rank:index+1}));
}

function resolveThemes(rawThemes){
  const byCode = new Map(PRIMFUSION_REGISTRY.aiThemeChoices.map(t=>[t.code,t]));
  return rawThemes.map((item,index)=>{
    if (item.source === 'matrix'){
      const resolved = byCode.get(item.code);
      if (!resolved) throw new Error(`Unknown matrix Theme code ${item.code}`);
      return {
        rank:index+1,
        source:'matrix',
        code:item.code,
        name:resolved.name,
        confidence:item.confidence,
        rationale:String(item.rationale||'').trim(),
        matrixVersion:matrixVersion()
      };
    }
    return {
      rank:index+1,
      source:'custom',
      proposedName:String(item.proposedName||'').trim(),
      confidence:item.confidence,
      rationale:String(item.rationale||'').trim(),
      matrixVersion:matrixVersion()
    };
  });
}

async function analyze(env,body){
  if (!env.AI?.run) throw new Error('Workers AI binding AI is not configured');

  const requested = [...new Set((body.components||[]).filter(x=>COMPONENT_IDS.includes(x)))];
  if (!body.imageId || !requested.length) throw new Error('imageId and components are required');

  const reactionOnly = requested.every(name=>name==='reactions'||name==='reactionReasons');
  const rawReactionSources = body.reactionRerunSources && typeof body.reactionRerunSources==='object' ? body.reactionRerunSources : null;
  const reactionSources = rawReactionSources ? {image:rawReactionSources.image!==false,description:Boolean(rawReactionSources.description)} : {image:true,description:false};
  const reactionDescriptionContext = reactionSources.description ? String(body.reactionDescriptionContext||'').trim().slice(0,6000) : '';
  if (reactionOnly && !reactionSources.image && !reactionSources.description) throw new Error('Reaction rerun requires Image, Description, or both');
  if (reactionOnly && reactionSources.description && !reactionDescriptionContext) throw new Error('Reaction rerun requested Description evidence but no AI Description context was supplied');
  const needsImage = !reactionOnly || reactionSources.image;
  const image = needsImage ? (body.imageDataUrl ? dataUrlBytes(body.imageDataUrl) : await fetchBytes(body.imageUrl)) : null;

  const model = env.WORKERS_AI_VISION_MODEL || DEFAULT_MODEL;
  const components = {};
  const promptVersions = {};
  let customThemeTriggered = false;

  const behaviorFor = names => names.some(name=>requested.includes(name) && body.componentBehaviors?.[name] === 'reanalyze') ? 'reanalyze' : 'analyze';

  // Reaction and Theme families are intentionally analyzed independently.
  // Info outputs share the exact same underlying assessment as their paired classification
  // when both are requested, so research reasoning cannot drift away from the result it explains.
  if (requested.includes('reactions') || requested.includes('reactionReasons')){
    const behavior = behaviorFor(['reactions','reactionReasons']);
    const reactionEvidence = {useImage:reactionSources.image,descriptionContext:reactionDescriptionContext,requireNotes:requested.includes('reactionReasons')};
    const reactionResult = await runReactionAllocation(env,model,image,behavior,reactionEvidence);
    components.reactionDiagnostics = reactionResult.diagnostics;
    if (requested.includes('reactions')) components.reactions = reactionResult.display;
    if (requested.includes('reactionReasons')) components.reactionReasons = {
      rawAiWeights:reactionResult.diagnostics.rawAiWeights,
      ranking:reactionResult.diagnostics.aiRanking,
      notes:reactionResult.diagnostics.effortNotes,
      reactionCombo:reactionResult.diagnostics.reactionCombo,
      singleDominant:reactionResult.diagnostics.singleDominant
    };
    promptVersions.reactions = reactionSources.image&&reactionSources.description
      ? 'genreactrix-reactions-registry-v10-combined-multimodal-guided-json'
      : reactionSources.image
        ? 'genreactrix-reactions-registry-v8-vision-text-validated'
        : 'genreactrix-reactions-registry-v7-rerun-evidence-sources';
    if (requested.includes('reactionReasons')) promptVersions.reactionReasons = 'genreactrix-reaction-info-v2-shared-assessment';
  }

  if (requested.includes('themes') || requested.includes('genreReasons')){
    const behavior = behaviorFor(['themes','genreReasons']),themeRerun=body.themeRerun&&requested.includes('themes')?normalizeThemeRerun(body.themeRerun):null;
    let resolvedThemes;
    if(themeRerun){
      const rerunResult=await runThemeRerun(env,model,image,behavior,themeRerun);
      resolvedThemes=resolveThemes(rerunResult.selections);
      components.themeRerunDiagnostics={
        schemaVersion:1,applied:true,
        protectedSlots:rerunResult.rerun.themeSlots.filter(row=>row.state==='preserve').map(row=>row.slot),
        replaceSlots:rerunResult.rerun.themeSlots.filter(row=>row.state==='replace').map(row=>row.slot),
        neutralSlots:rerunResult.rerun.themeSlots.filter(row=>row.state==='neutral').map(row=>row.slot),
        excludedThemeCodes:[...rerunResult.rerun.excludedThemeCodes],
        includedDescriptionCount:rerunResult.rerun.includedDescriptions.length,
        candidateCounts:Object.fromEntries([1,2,3].map(slot=>[slot,rerunResult.sets[slot].candidates.length]))
      };
      promptVersions.themes='genreactrix-themes-pfm-v9-director-rerun-format-compat';
    }else{
      const themeAnalysisContext = body.themeUseAnalysis ? String(body.themeAnalysisContext||'').trim().slice(0,6000) : '';
      const rawThemes = await runStructured(env,model,image,themePrompt(themeAnalysisContext),themeSchema(),2200,'text',{behavior});
      let parsedThemes;
      let firstError = null;
      let retryRaw = null;
      try{
        parsedThemes = parseThemeText(rawThemes);
      }catch(error){
        if (!/unique valid selections instead of 3/i.test(String(error?.message||''))) throw error;
        firstError = error;
        const recoveryPrompt = `${themePrompt(themeAnalysisContext)}

RECOVERY REQUIREMENT: Your previous attempt did not produce three unique valid Theme selections. Re-evaluate the image independently and return exactly three DIFFERENT valid ranked matrix Theme selections. Do not repeat a Theme code or Theme name. Custom Theme output is disabled for this research phase. Return only the required three-line format.`;
        retryRaw = await runStructured(env,model,image,recoveryPrompt,themeSchema(),2200,'text',{behavior});
        try{
          parsedThemes = parseThemeText(retryRaw);
        }catch(retryError){
          if (!/unique valid selections instead of 3/i.test(String(retryError?.message||''))) throw retryError;
          const structured = await runStructured(
            env,model,image,themeStructuredRecoveryPrompt(themeAnalysisContext),themeRecoverySchema(),2200,'json_schema',
            {behavior,temperature:0}
          );
          parsedThemes = parseThemeStructured(structured);
          components.themeRecovery = {
            recovered:true,mode:'structured-json-fallback',reason:String(firstError?.message||firstError||''),
            firstRawResponse:String(rawThemes).slice(0,4000),retryRawResponse:String(retryRaw).slice(0,4000)
          };
        }
      }
      if (firstError && !components.themeRecovery) {
        components.themeRecovery = {
          recovered:true,mode:'text-retry',reason:String(firstError.message||firstError),
          firstRawResponse:String(rawThemes).slice(0,4000),retryRawResponse:String(retryRaw).slice(0,4000)
        };
      }
      resolvedThemes = resolveThemes(parsedThemes);
      promptVersions.themes = themeAnalysisContext ? 'genreactrix-themes-pfm-v6-analysis-failsafe' : 'genreactrix-themes-pfm-v5-matrix-only-research';
    }
    if (requested.includes('themes')) components.themes = resolvedThemes;
    if (requested.includes('genreReasons')) components.genreReasons = resolvedThemes.map(item=>({
      rank:item.rank,code:item.code||null,name:item.name||item.proposedName||'',confidence:item.confidence,
      rationale:item.rationale,matrixVersion:item.matrixVersion
    }));
    customThemeTriggered = resolvedThemes.some(t=>t.source==='custom');
    if (requested.includes('genreReasons')) promptVersions.genreReasons = themeRerun?'genreactrix-theme-info-v2-director-rerun':'genreactrix-theme-info-v1-shared-assessment';
  }

  if (requested.includes('description')){
    const behavior = behaviorFor(['description']),descriptionRerun=normalizeDescriptionRerun(body.descriptionRerun),scopedEdit=['add','replace'].includes(descriptionRerun?.operation);
    const description = await runStructured(env,model,image,descriptionPrompt(body.directorGuidance,descriptionRerun),descriptionSchema(),3200,'text',{behavior,scopedEdit,preserveWhitespace:scopedEdit});
    if (typeof description !== 'string' || !description.trim()) throw new Error('Description provider response did not contain description text');
    components.description = scopedEdit ? description : description.trim();
    promptVersions.description = descriptionRerun ? `genreactrix-freeform-v3-rerun-workspace-${descriptionRerun.operation}` : (String(body.directorGuidance||'').trim() ? 'genreactrix-freeform-v2-director-guidance' : 'genreactrix-freeform-v1');
  }

  return {
    schemaVersion:3,
    imageId:body.imageId,
    analyzedAt:new Date().toISOString(),
    provider:{id:'cloudflare-workers-ai',displayName:'Genreactrix Vision · Cloudflare Workers AI',model},
    model,
    primFusionMatrixVersion:matrixVersion(),
    promptVersions,
    researchConfiguration:{customThemeGenerationEnabled:CUSTOM_THEME_GENERATION_ENABLED,...(requested.includes('reactions')?{reactionEvidenceSources:{image:reactionSources.image,description:reactionSources.description}}:{})},
    reviewDirectives:{
      autoKeep:customThemeTriggered,
      autoFlag:customThemeTriggered,
      reason:customThemeTriggered ? 'custom-theme-use-or-creation' : null
    },
    components
  };
}

export default {
  async fetch(request,env={}){
    const url = new URL(request.url);

    if (request.method === 'OPTIONS'){
      return new Response(null,{
        status:204,
        headers:{...cors,'access-control-max-age':'86400'}
      });
    }

    if (request.method === 'GET' && url.pathname === '/api/health'){
      return json({
        ok:true,
        service:'Genreactrix AI',
        version:API_VERSION,
        vision:env.AI?'configured':'not-configured',
        provider:'cloudflare-workers-ai',
        primFusionMatrixVersion:matrixVersion(),
        primCount:PRIMFUSION_REGISTRY.primitives.length,
        fusionCount:PRIMFUSION_REGISTRY.fusions.length,
        themeChoiceCount:PRIMFUSION_REGISTRY.aiThemeChoices.length,
        totalThemeVocabularyCount:PRIMFUSION_REGISTRY.themeChoices.length,
        components:COMPONENT_IDS,
        customThemeGenerationEnabled:CUSTOM_THEME_GENERATION_ENABLED,
        promptDiagnostics:{enabled:true,conceptCount:105,batchSize:PROMPT_DIAGNOSTIC_BATCH_SIZE,batchCount:PROMPT_DIAGNOSTIC_BATCH_COUNT,waveSize:PROMPT_DIAGNOSTIC_WAVE_SIZE,executionModes:['fifteen','five','compare']}
      });
    }

    try{
      if (request.method === 'POST' && url.pathname === '/api/genreactrix/image'){
        if (!env.ANALYSIS_KEY){
          return json({ok:false,error:'Analysis access is not configured'},{status:503});
        }
        if (request.headers.get('x-analysis-key') !== env.ANALYSIS_KEY){
          return json({ok:false,error:'Unauthorized'},{status:401});
        }
        const body = await request.json().catch(()=>null);
        const imageUrl = String(body?.imageUrl||'').trim();
        if (!/^https:\/\//i.test(imageUrl) || imageUrl.length > 2000){
          return json({ok:false,error:'imageUrl must be HTTPS'},{status:400});
        }
        const upstream = await fetch(imageUrl,{headers:{accept:'image/*'}});
        if (!upstream.ok) return json({ok:false,error:`Could not retrieve image (${upstream.status})`},{status:502});
        const contentType = String(upstream.headers.get('content-type')||'').split(';')[0].trim().toLowerCase();
        if (!contentType.startsWith('image/')) return json({ok:false,error:'URL did not return an image'},{status:415});
        const bytes = new Uint8Array(await upstream.arrayBuffer());
        if (!bytes.length) return json({ok:false,error:'Image was empty'},{status:422});
        if (bytes.length > 6_000_000) return json({ok:false,error:'Image exceeds 6 MB'},{status:413});
        return new Response(bytes,{status:200,headers:{...cors,'content-type':contentType,'cache-control':'no-store','content-length':String(bytes.length)}});
      }

      if (request.method === 'POST' && url.pathname === '/api/genreactrix/prompt-diagnostics'){
        if (!env.ANALYSIS_KEY){
          return json({ok:false,error:'Analysis access is not configured'},{status:503});
        }
        if (request.headers.get('x-analysis-key') !== env.ANALYSIS_KEY){
          return json({ok:false,error:'Unauthorized'},{status:401});
        }
        const body = await request.json().catch(()=>null);
        if (!body) return json({ok:false,error:'JSON body required'},{status:400});
        return json({ok:true,result:await runPromptDiagnosticBatch(env,body)});
      }

      if (request.method === 'POST' && url.pathname === '/api/genreactrix/analyze'){
        if (!env.ANALYSIS_KEY){
          return json({ok:false,error:'Analysis access is not configured'},{status:503});
        }
        if (request.headers.get('x-analysis-key') !== env.ANALYSIS_KEY){
          return json({ok:false,error:'Unauthorized'},{status:401});
        }

        const body = await request.json().catch(()=>null);
        if (!body) return json({ok:false,error:'JSON body required'},{status:400});

        return json({ok:true,result:await analyze(env,body)});
      }
    }catch(error){
      const body = {ok:false,error:error?.message || String(error)};
      const diagnostic = providerDiagnosticOf(error);
      if (diagnostic) body.providerDiagnostic = diagnostic;
      return json(body,{status:500});
    }

    return json({ok:false,error:'Not found'},{status:404});
  }
};

