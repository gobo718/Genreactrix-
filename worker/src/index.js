/* Genreactrix AI Worker v0.9.6.136-cloudflare-typecheck-fix
   Preserves the accepted Theme/Description pipeline, provider lanes, and deterministic Theme-derived reactions.
   Fresh Theme provider order: Mistral Primary -> GPT-4.1 mini Secondary -> Qwen 3.7 Plus Third.
   Each fresh Theme run remains Image -> Preliminary Themes -> Theme-aware Description -> Description-only Final Themes.
   A semantically rejected fresh Theme run is discarded wholesale before the next provider starts from the original image.
   Final Themes are independently reviewed by the next provider; reviewer technical failures rotate reviewers.
   Preliminary-vs-Final comparison telemetry is recorded so the preliminary pass can be evaluated for future removal.
   Reactions are deterministic: the three selected Themes contribute six equal 1/6 Prim slots; no AI Reaction scan runs.
*/
const API_VERSION = '0.9.6.136-cloudflare-typecheck-fix';
const DEFAULT_MODEL = '@cf/meta/llama-3.2-11b-vision-instruct';
// Legacy Reaction model constant retained for historical diagnostics only; normal analysis never invokes a Reaction scan.
const DEFAULT_REACTION_MODEL = '@cf/meta/llama-4-scout-17b-16e-instruct';
const COMPONENT_IDS = ['reactions','themes','description','reactionReasons','genreReasons'];
const CUSTOM_THEME_GENERATION_ENABLED = false;
const PROVIDER_CALL_TIMEOUT_MS = 45000;
const PROMPT_DIAGNOSTIC_PROVIDER_CALL_TIMEOUT_MS = 120000;
const AMA_PROVIDER_CALL_TIMEOUT_MS = 90000;
const DEFAULT_FALLBACK_MODEL = 'openai/gpt-4.1-mini';
const DEFAULT_MISTRAL_DESCRIPTION_MODEL = 'ministral-14b-2512';
const DEFAULT_QWEN_THEME_MODEL = 'alibaba/qwen3.7-plus';
const DEFAULT_AI_GATEWAY_ID = 'default';
const FALLBACK_COOLDOWN_MS = 15 * 60 * 1000;

const cors = {
  'access-control-allow-origin':'*',
  'access-control-allow-methods':'GET, POST, OPTIONS',
  'access-control-allow-headers':'content-type, x-analysis-key'
};

const json = (body, init={}) => new Response(JSON.stringify(body), {
  ...init,
  headers:{...cors,'content-type':'application/json; charset=utf-8',...(init.headers||{})}
});

const PRIMFUSION_REGISTRY = {"schemaVersion":1,"matrixVersion":"0.0.0.0","latestVersion":"0.0.0.0","codingRules":{"primFusionPrefix":"PFM","fusionPrimOrder":"ascending numeric primitive ID","pairOrderIndependent":true,"fusionCodesExcludeSelfPairs":true,"themeChoiceCount":78,"primCount":12,"fusionCount":66,"aiThemeChoiceCount":66},"researchRules":{"reactionAndThemeAnalysesIndependent":true,"reactionCodesAreReturnIdentifiersNotThemeReasoningInputs":true,"themeSelectionUsesCurrentMatrixVocabulary":true,"customThemeFallbackAllowed":false,"customThemeUseOrCreationTriggers":["AutoKeep","AutoFlag"],"aiThemeSelectionUsesFusionVocabularyOnly":true,"standalonePrimThemesExcludedFromAiThemeSelection":true},"source":{"kind":"live-site-app-js","repository":"gobo718/Genreactrix-","path":"app.js","extractedUtc":"2026-08-09T05:59:12.571064+00:00","note":"Fusion vocabulary for 12 active Prims after retiring Ticket and Smart. Former P14 Angry remains P07. Celebration occupies P12, so active Prim IDs remain contiguous P01–P12. Smart-linked Innocence and Elegant are retired; Gloomy is retired and Mundane is PFM0203 (Beautiful + Tragic); Glory is PFM0512 (Intense + Celebration). The final three open pair slots are now assigned: PFM0109 Cheeky (Adorable + Zazzly), PFM0708 Cursed (Angry + Dreamy), and PFM1112 Halloween (Scary + Celebration). Current active matrix: 66 assigned PrimFusion Themes and 0 open pair slots. Goofy/Camp remains PFM0104 Goofy and PFM0204 Camp."},"primitives":[{"id":"P01","name":"Adorable","symbol":"🧸","aiMeaning":"Distinct cuteness or endearment that produces an “aww,” nurturing, protective, cuddling, baby-schema, precious, or irresistibly lovable response. Adorable is a narrow reaction to cuteness itself, not a general positive reaction to something pleasant, attractive, friendly, soft, or beautiful.\nRequired gate: Adorable should be supported only when the image contains clear cuteness-specific evidence. Valid routes include juvenile or baby-like traits, baby-schema proportions, tiny vulnerable proportions, plush or toy-like forms, cuddly presentation, affectionate dependence, innocent vulnerability, endearing clumsiness, deliberately cute or kawaii styling, or behavior that specifically evokes caretaking, cuddling, or an “aww” response.\nEvidence can include: Babies or visibly juvenile animals; disproportionately large eyes or head; round cheeks or face; small nose or mouth; tiny paws, limbs, or features; oversized ears; compact or chubby proportions; plushness; stuffed animals; cuddling; being held or cared for; shy, clumsy, dependent, trusting, or affection-seeking behavior; miniature versions of familiar things; cute costumes or accessories; and overt visual design intended to make a subject look precious, huggable, or childlike.\nHard non-qualifiers: Do not score Adorable merely because a subject is beautiful, attractive, smiling, friendly, harmless, pleasant, colorful, soft-lit, cozy, sentimental, feminine, small, young-looking, innocent-looking, or aesthetically pleasing. Smallness alone is not Adorable. Softness alone is not Adorable. Roundness alone is not Adorable. An animal or pet is not automatically Adorable. A cartoon or illustration is not automatically Adorable. A smiling or attractive adult is not Adorable without independent cuteness-specific evidence.\nAnti-fallback rule: Adorable must not be used as a safe default for positive images or as a substitute for Beautiful, Dreamy, Celebration, Zazzly, or general likability. If the image remains appealing after its specifically cute, juvenile, cuddly, vulnerable, or precious qualities are removed, that remaining appeal belongs to another reaction rather than Adorable.\n🧸 Emoji contribution: Teddy bears, stuffed animals, nursery objects, childhood keepsakes, cuddling, soft stuffed forms, being held or cared for, huggability, and sentimental affection reinforce Adorable only when they actively create cuteness, endearment, preciousness, cuddly appeal, or lovable vulnerability. Their mere presence is not sufficient."},{"id":"P02","name":"Beautiful","symbol":"✨","aiMeaning":"Aesthetic beauty from scenery, art, color, light, composition, harmony, symmetry, elegance, radiance, craftsmanship, architecture, design, polish, refinement, or overall visual presentation.\nHard boundary: Do not score Beautiful from a person's face, body, physique, skin, curves, musculature, clothing, pose, nudity, exposed skin, revealing or tight clothing, sensual presentation, or physical attractiveness. The presence or attractiveness of a person is not evidence for Beautiful. Human physical desirability and body-focused appeal belong to Zazzly.\nBeautiful may still score when non-human visual qualities of the image itself independently support it, such as scenery, composition, color, lighting, architecture, art, design, craftsmanship, symmetry, harmony, polish, or refinement."},{"id":"P03","name":"Tragic","symbol":"😭","aiMeaning":"Sadness, grief, loss, suffering, heartbreak, loneliness, helplessness, regret, emotional pain, sorrow, mourning, or sympathy for misfortune.\nEvidence can include: Crying, injury, death, abandonment, ruin, rejection, isolation, mourning, damaged relationships, painful circumstances, visible sorrow, grief-stricken expressions, or situations that evoke compassion for suffering.\n😭 Emoji contribution: Streaming tears, sobbing, emotional collapse, pleading expressions, devastation, heartbreak, helplessness, cathartic grief, painful emotional overflow, inconsolability, or being emotionally overwhelmed by suffering or loss can reinforce Tragic."},{"id":"P04","name":"Funny","symbol":"🤣","aiMeaning":"Humor, amusement, silliness, absurdity, comic surprise, awkward comedy, wit, ridiculousness, playful nonsense, or anything that provokes laughter.\nEvidence can include: Expressions, poses, comic mishaps, jokes, visual puns, incongruity, exaggeration, slapstick, meme-like situations, embarrassing moments, ridiculous reactions, or behavior whose absurdity or incongruity produces amusement.\n🤣 Emoji contribution: Doubled-over laughter, tears of laughter, losing composure, slapstick payoff, ridiculous reactions, meme exaggeration, explosive amusement, contagious laughter, punch-line energy, and scenes that feel impossible to take seriously can reinforce Funny."},{"id":"P05","name":"Intense","symbol":"💥","aiMeaning":"Force, energy, drama, urgency, extremity, power, impact, excitement, danger, speed, violence, passion, tension, chaos, pressure, adrenaline, volatility, sensory overload, or emotional extremity.\nEvidence can include: Explosions, action, confrontation, extreme expressions, dramatic motion, powerful bodies, storms, spectacle, high stakes, tense stand-offs, chaotic environments, sudden escalation, overwhelming sensory presence, or visually forceful scenes.\n💥 Emoji contribution: Explosions, collisions, impacts, crashes, strikes, bursts, breakage, shock waves, blasts, comic-book action marks, sudden escalation, kinetic force, loudness, urgency, disruption, and moments that visually land hard can reinforce Intense."},{"id":"P06","name":"Weird","symbol":"🌀","aiMeaning":"Strangeness, oddity, uncanniness, abnormality, eccentricity, unpredictability, surrealism, mutation, bizarre combinations, perceptual wrongness, or departure from ordinary expectations.\nEvidence can include: Unusual bodies, strange objects, impossible scenes, mismatched elements, distortions, peculiar behavior, unfamiliar forms, uncanny juxtapositions, reality-bending imagery, or anything that makes the viewer think “what the hell?”\n🌀 Emoji contribution: Spirals, vortices, whirlpools, warped perspective, trippy visual effects, looping motion, hypnosis imagery, dizziness, disorientation, perceptual instability, twisting forms, altered orientation, and a sense that reality is slipping out of alignment can reinforce Weird."},{"id":"P07","name":"Angry","symbol":"🤬","aiMeaning":"Anger, annoyance, irritation, aggravation, frustration, hostility, resentment, defiance, confrontation, outrage, aggression, rage, feeling fed up, or the reaction that something “pisses you off.”\nEvidence can include: Annoyed or furious expressions, yelling, arguing, clenched fists, hostile gestures, threats, fighting, destruction, revenge behavior, protest, intimidation, antagonism, simmering resentment, visible frustration, or escalating confrontation.\n🤬 Emoji contribution: An enraged face, censored symbols over the mouth, shouting, profanity, swearing, rants, insults, verbal confrontation, explosive facial expressions, exasperation, being fed up, loss of polite restraint, censored verbal aggression, and cartoon rage can reinforce Angry across the spectrum from irritation to fury."},{"id":"P08","name":"Dreamy","symbol":"🌌","aiMeaning":"Fantasy, reverie, wonder, escapism, imagination, enchantment, altered reality, surrealism, nostalgia, longing, dream-state, or otherworldliness.\nEvidence can include: Fantasy worlds, impossible landscapes, ethereal or unreal spaces, magical imagery, mist, stars, celestial vistas, altered environments, nostalgic imagery, imaginative transformations, distant horizons, contemplative unreality, dream logic, or scenes that feel transported beyond ordinary life.\n🌌 Emoji contribution: The Milky Way, stars, galaxies, deep night sky, cosmic landscapes, space, distant lights, celestial scale, infinity, mystery, transcendence, cosmic wonder, science-fiction vistas, human smallness before a vast universe, and transportive otherworldliness can reinforce Dreamy."},{"id":"P09","name":"Zazzly","symbol":"🌶️","aiMeaning":"Sexual salience, erotic appeal, physical desirability, horniness, seductive or provocative presentation, body-focused attraction, flirtation, sexual tension, or imagery likely to be perceived as sexy, hot, spicy, revealing, tempting, or turn-on oriented.\nEvidence includes nudity or partial nudity; exposed chest, breasts, nipples, buttocks, crotch, genitals, pubic area, torso, or abundant skin; prominently displayed sexually salient body parts or features such as pecs, abs, hips, thighs, legs, curves, musculature, physique, body proportions, or large or emphasized buttocks. It also includes tight or form-fitting clothing, leggings, compression wear, singlets, athletic outfits, uniforms, body-hugging costumes, underwear, lingerie, briefs, boxers, panties, thongs, jockstraps, bikinis, speedos, revealing swimwear, mesh, sheer clothing, towels, robes, bedsheet coverage, or clothing that reveals, frames, or emphasizes the body.\nBody-display routes include mirror selfies, nude or shirtless selfies, underwear selfies, gym, bathroom, or bedroom selfies, thirst traps, posed body shots, flexing, arching, spread or open-leg posing, chest-, butt-, crotch-, or physique-focused framing, and deliberate body display. Exposure routes include casual or public nudity, nude beaches, skinny-dipping, streaking, flashing, deliberate exposure, undressing, changing clothes, locker-room or shower scenes, towel scenes, wet skin, wet clothing, exhibitionistic display, or being intentionally seen naked or partly naked. Sensual routes include intimate or flirtatious gaze, teasing, provocative expressions, erotic or fetish styling, suggestive framing, seductive atmosphere, or visible sexual tension.\nExpansion rule: Zazzly does not require sexual activity, explicit arousal, a stereotypically seductive pose, fetish content, or an invitation to sex. Casual nudity independently supports Zazzly. Any mirror selfie independently supports at least some Zazzly because it is deliberate self-presentation and body display, even when fully clothed or not overtly sexual. Any adult body type may qualify when sexual or sensual presentation is visually emphasized. Beautiful may score separately for non-human aesthetics, but it must not replace or suppress Zazzly when sexual salience is present.\nAge gate: Apply sexualized Zazzly interpretation only to adult subjects. Do not infer sexual attractiveness or erotic appeal from minors.","publicMeaningHidden":true},{"id":"P10","name":"Disgusting","symbol":"🤢","aiMeaning":"Disgust, revulsion, nausea, contamination, filth, bodily aversion, decay, grossness, gross-out reaction, grotesque unpleasantness, moral revulsion, or an instinctive desire to recoil.\nEvidence can include: Rot, slime, wounds, bodily fluids, spoiled food, parasites, infection, excrement, gore, grime, malformed organic matter, contamination, foul substances, or anything viscerally gross.\n🤢 Emoji contribution: A nauseated face, sickness, gagging, queasiness, foul smells, spoiled food, poisoning, infection, toxic substances, bodily illness, rancidness, contamination, and cues that trigger physical recoil or a “that makes me sick” response can reinforce Disgusting."},{"id":"P11","name":"Scary","symbol":"👻","aiMeaning":"Fear, dread, unease, threat, suspense, vulnerability, danger, horror, paranoia, menace, foreboding, creepiness, alarm, or anticipation that something harmful or uncanny may happen.\nEvidence can include: Monsters, darkness, weapons, threatening people, isolation, disturbing faces, supernatural imagery, stalking, dangerous environments, ominous situations, unseen threats, predatory presence, eerie emptiness, or subtle wrongness.\n👻 Emoji contribution: Ghosts, spirits, apparitions, haunted places, spectral figures, paranormal presences, unseen watchers, Halloween imagery, death or afterlife imagery, jump-scare cues, spooky playfulness, eerie presence, haunting, supernatural unease, and something impossible appearing where it should not be can reinforce Scary."},{"id":"P12","name":"Celebration","symbol":"🎉","aiMeaning":"Happiness expressed through celebration, festivity, achievement, gathering, excitement, communal joy, triumph, revelry, applause, victory, milestones, special occasions, or marking something positively significant.\nEvidence can include: Parties, cheering, dancing, birthdays, holidays, weddings, trophies, confetti, decorations, crowds, congratulations, victories, launches, awards, good-news announcements, milestone moments, or ceremonies and rituals presented as celebratory.\n🎉 Emoji contribution: Party poppers, confetti, streamers, congratulatory bursts, surprise announcements, party supplies, victories, birthdays, milestones, launches, applause, achievements, “yay!” energy, and visible moments of good news or success can reinforce Celebration."}],"fusions":[{"code":"PFM0102","name":"Cozy","primIds":["P01","P02"],"matrixVersion":"0.0.0.0","aiMeaning":"Comforting, snug, warm, sheltered, or inviting; soft textures, warm lighting, blankets, relaxed intimate settings, or a feeling of ease, rest, or pleasant closeness."},{"code":"PFM0103","name":"Poignant","primIds":["P01","P03"],"matrixVersion":"0.0.0.0","aiMeaning":"Emotionally affecting through tenderness, sadness, sympathy, compassion, meaning, or reflection; visible helplessness, suffering, misfortune, weakness, neglect, injury, abandonment, pleading, fragile moments, remembrance, meaningful loss, or emotional stillness."},{"code":"PFM0104","name":"Goofy","primIds":["P01","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Silly, awkward, playful, foolish, ridiculous, eccentric, unconventional, comically strange, or offbeat in an amusing way; exaggerated expressions, clumsy antics, playful visual absurdity, mismatched costumes, unusual poses, frantic antics, or energetic comic behavior.\nGate: Ordinary resting, reclining, standing, sitting, relaxation, incidental awkwardness, clutter, or merely unusual appearance is not Goofy by itself. Goofy requires actual amusing silliness, foolishness, eccentric comic behavior, playful absurdity, exaggerated comic expression or behavior, or comparable laughter-producing incongruity."},{"code":"PFM0105","name":"Joy","primIds":["P01","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Happiness, delight, pleasure, or emotional uplift shown through smiling, laughter, delighted expressions, playful pleasure, or visible enjoyment."},{"code":"PFM0106","name":"Kawaii","primIds":["P01","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"A distinctly Japanese cute aesthetic marked by chibi, anime/manga, toy-like, or deliberately exaggerated cute styling."},{"code":"PFM0107","name":"Saccharine","primIds":["P01","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Excessively sweet, sentimental, precious, or cutesy to the point of irritation; sugary, pastel, cloying, aggressively sweet imagery.\nGate: “Excessive” means excessive sweetness, sentimentality, preciousness, or cutesiness—not clutter, quantity, chaos, decoration, intensity, or visual excess. Pastel colors alone are not Saccharine unless they contribute to a clearly sugary, cloying, aggressively sweet, sentimental, or cutesy presentation."},{"code":"PFM0108","name":"Whimsical","primIds":["P01","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Fanciful, playful, imaginative, lightly odd, or guided by charming logic; fantasy details, charming oddities, or impossible elements."},{"code":"PFM0109","name":"Cheeky","primIds":["P01","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Playfully provocative, mischievous, teasing, impudent, saucy, or knowingly suggestive. Includes cute or endearing sexual presentation, playful exposure, suggestive posing, and literal butt cheeks when presented with a cheeky, playful, or teasing quality."},{"code":"PFM0110","name":"UglyCute","primIds":["P01","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"“So ugly it’s cute” appeal: unattractive, awkward, scruffy, misshapen, grotesque, gross-looking, or otherwise visually off-putting qualities that become endearing, charming, funny, lovable, or cute; the ugliness or ickiness is itself part of the appeal.\nEvidence can include troll-like dolls, scruffy animals, odd little creatures, misshapen toys, awkward faces or proportions, strange character designs, or other subjects whose off-putting features actively increase their endearment.\nGate: Dirt, grime, filth, clutter, ugliness, disgust, or cuteness alone is not UglyCute. The image must combine genuine off-putting, ugly, or icky qualities with genuine cute or endearing appeal, and the undesirable quality must contribute to the affection rather than merely coexist with it."},{"code":"PFM0111","name":"CreepyCute","primIds":["P01","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Cute and unsettling at once; Halloween fun. Appealing subjects combined with eerie, spooky, uncanny, or disturbing features."},{"code":"PFM0112","name":"Playful","primIds":["P01","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Lighthearted, mischievous, teasing, game-like, curious, imaginative, or inclined toward fun and experimentation; playful role-taking, dress-up, character customization, make-believe, games, toys, teasing gestures, spontaneous fun, or deliberately fun self-presentation.\nClarification: Playful does not require laughter, toys, overt antics, or childish behavior. Role-play, dress-up, character experimentation, and deliberately fun or lighthearted presentation can independently support Playful when they function as play."},{"code":"PFM0203","name":"Mundane","primIds":["P02","P03"],"matrixVersion":"0.0.0.0","aiMeaning":"Ordinary, routine, commonplace, dull, uneventful, repetitive, familiar, or visually unremarkable; everyday subject matter with little novelty, stimulation, drama, or distinctive interest. Includes boring, tedious, generic, monotonous, plain, or ‘nothing much going on’ imagery."},{"code":"PFM0204","name":"Camp","primIds":["P02","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Exaggerated, theatrical, artificial, flamboyant, kitschy, or knowingly excessive styling and presentation."},{"code":"PFM0205","name":"Epic","primIds":["P02","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Grand, dignified, regal, imposing, heroic, awe-inspiring, or massive in scale, presence, bearing, consequence, duration, drama, adventure, struggle, achievement, or spectacle; symmetry, noble posture, stately beauty, impressive or monumental scenery, heroic action, or high stakes."},{"code":"PFM0206","name":"Psychedelic","primIds":["P02","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Hallucinatory, sensory-rich, perception-bending, or suggestive of expanded or distorted consciousness; vivid colors, swirling patterns, fractals, or hallucination-like effects."},{"code":"PFM0207","name":"Pretentious","primIds":["P02","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Affected, self-important, showy, or overly cultured or significant; conspicuous status display and affected refinement."},{"code":"PFM0208","name":"Romance","primIds":["P02","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Romantic affection, attraction, courtship, partnership, or love, expressed either through people/characters or through clearly romantic symbols, objects, gestures, messages, or situations. Evidence can include courting or affectionate interaction, kissing or embracing in a romantic context, dating, marriage proposals and engagements, weddings, engagement rings, love letters, hearts used romantically, roses, romantic gifts, chocolates, or other unmistakably romantic presentation. Requirement: The reasoning must identify the concrete evidence that makes the image specifically romantic."},{"code":"PFM0209","name":"Exposure","primIds":["P02","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Being naked, indecently revealed, or too visibly exposed, especially in ways that feel shameful, embarrassing, humiliating, sexually charged or exhibitionistic; visible nudity, uncovered body parts, flashing, revealing poses, accidental bodily exposure, exhibitionism, exhibitionistic display, deliberate public or social exposure, intentionally displaying underwear, genitals, buttocks, or other intimate body areas, or deliberately revealing the body for attention or reaction."},{"code":"PFM0210","name":"Grotesque","primIds":["P02","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Whimsical or ornamental distortion mixing beauty, absurdity, or unease; hybrid human, animal, or plant forms, exaggerated features, decorative symmetry, or playful violations of natural law.\nGate: Costume, role-play, muscularity, unusual clothing, or animal-themed accessories alone are not Grotesque; the depicted form itself must be meaningfully distorted, hybridized, deformed, ornamental, or unnaturally transformed."},{"code":"PFM0211","name":"Vulnerable","primIds":["P02","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Exposed to harm, rejection, injury, loss, or emotional pain; defenseless posture, exposed emotion, isolation, or injury."},{"code":"PFM0212","name":"Festive","primIds":["P02","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Christmas-specific celebration, imagery, atmosphere, traditions, decorations, symbols, characters, or styling. Required gate: Festive requires clear Christmas evidence. Valid evidence can include Christmas trees, ornaments, wreaths, stockings, Santa or Christmas characters, Christmas lights or decorations presented as Christmas, explicitly Christmas-themed clothing or displays, nativity imagery, Christmas gifts or traditions, or other unmistakably Christmas-specific cues. Hard non-qualifiers: A generic party, celebration, ceremony, formal event, crowd, gathering, decorated venue, winter scene, snow, cold weather, seasonal atmosphere, holiday-like styling, or special occasion is not Festive unless the image clearly communicates Christmas. When the evidence is only general partying, celebration, social fun, or event energy, do not select Festive; PartyTime may apply instead."},{"code":"PFM0304","name":"Freakshow","primIds":["P03","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Bizarre, degrading, dysfunctional, shocking, or socially transgressive people, situations, lifestyles, or spectacles that provoke fascinated, guilty, voyeuristic, or trainwreck-like attention; something disturbing, embarrassing, abnormal, or shameful that is compelling to look at.\nEvidence can include unusual performers or exhibited subjects, carnival/sideshow-like presentation, gawking attention, conspicuous dysfunction, degrading living conditions, humiliating or bizarre personal presentation, shocking anomalies, or situations whose very wrongness or dysfunction makes them fascinating to observe.\nGate: Mere clutter, eccentricity, poverty, unusual appearance, or disorder is not Freakshow by itself. The scene must actually carry a sense of bizarre, degrading, dysfunctional, shocking, embarrassing, or transgressive spectacle that invites fascinated or trainwreck-like attention."},{"code":"PFM0305","name":"Despair","primIds":["P03","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Hopelessness, anguish, defeat, profound or overwhelming loss, grief, shock, or the sense that relief or improvement has disappeared; collapsed posture, hopeless expressions, isolation, catastrophic ruin, collapse, severe aftermath, or visible destruction."},{"code":"PFM0306","name":"Nightmarish","primIds":["P03","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Resembling a nightmare; frightening, disturbing, unreal, oppressive, or horrifying, with dream logic, threatening distortions, darkness, or impossible danger."},{"code":"PFM0307","name":"Overstimulated","primIds":["P03","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Overloaded or visibly overwhelmed by excessive sensory, informational, or social input; intense or competing lights, sounds, screens, signs, crowds, motion, alerts, simultaneous activity, or multiple demands for attention, with cues such as frazzled expressions, hands over ears or eyes, agitation, or difficulty focusing."},{"code":"PFM0308","name":"Nostalgia","primIds":["P03","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Old-timey, vintage, retro, memory-filled, or evocative of the past, childhood, bygone eras, or “the good old days.”"},{"code":"PFM0309","name":"Humiliation","primIds":["P03","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Demeaning, degrading, ridiculing, belittling, infantilizing, exposing, or stripping someone of dignity.\nEvidence can include degrading treatment, public ridicule, forced exposure, visible embarrassment or submission, insulting labels or messages, or costumes, tattoos, markings, symbols, or body presentation that clearly function to demean, belittle, infantilize, ridicule, embarrass, or strip the subject of dignity.\nGate: A costume, tattoo, marking, label, symbol, exposure, or unusual presentation is not Humiliation by itself. It must carry a clearly degrading, belittling, ridiculing, infantilizing, or dignity-reducing meaning in context."},{"code":"PFM0310","name":"Shame","primIds":["P03","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Painful self-conscious disgrace, embarrassment, exposure, or feeling unworthy, judged, or wanting to hide; averted gaze, covered face, hiding posture, blushing, shrinking, or visibly caught embarrassment."},{"code":"PFM0311","name":"Paranoia","primIds":["P03","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Persistent suspicion or fear of harm, deception, surveillance, persecution, or hidden threat; watchful fear, suspicious glances, defensive behavior, or surveillance imagery."},{"code":"PFM0312","name":"Bittersweet","primIds":["P03","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasure and sadness experienced together; joyful imagery touched by loss, nostalgia, farewell, memory, or impermanence."},{"code":"PFM0405","name":"Hilarious","primIds":["P04","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Clever, quick, inventive, or skillful humor and insight; visual puns, layered references, wordplay, or ingenious humorous juxtapositions. When claiming a visual pun, wordplay, layered reference, or ingenious juxtaposition, the reasoning must identify the actual connection that makes it clever."},{"code":"PFM0406","name":"Absurd","primIds":["P04","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Illogical, ridiculous, contradictory, pointless, impossible, or incompatible with ordinary sense; nonsensical juxtapositions, impossible logic, or ridiculous contradictions."},{"code":"PFM0407","name":"Mockery","primIds":["P04","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Using humor, irony, exaggeration, distortion, imitation, or ridicule to expose, criticize, or comically undermine a recognizable person, behavior, institution, idea, convention, style, work, archetype, or trope. Mockery may operate satirically by exposing faults or absurdities, or parodically by imitating and comically transforming a recognizable source.\nBoundary: Mere clutter, chaos, exaggeration, absurdity, or unusual styling is not Mockery. There must be a recognizable target and clear evidence that it is being ridiculed, comically imitated, distorted, exaggerated, or critically exposed."},{"code":"PFM0408","name":"Medicated","primIds":["P04","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Altered, softened, detached, or chemically influenced consciousness or perception; drowsy eyes, softened expressions, detached gaze, pills, or clinical sedation cues."},{"code":"PFM0409","name":"Raunchy","primIds":["P04","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Coarse, bawdy, or sexually suggestive humor; sexual jokes, innuendo, vulgar comedy, bawdy gestures, or suggestive comic situations."},{"code":"PFM0410","name":"Grossout","primIds":["P04","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Humor or spectacle built around filth, bodily functions, fluids, decay, gore, infestation, vermin, or revulsion; vomit, excrement, bodily fluids, gross material, bugs, rats, flies, or other unclean/vermin-associated creatures used to create grossness or disgust.\nBoundary: Bugs, rats, flies, or other creatures are not Grossout merely because they are present. They contribute when they function as evidence of filth, uncleanness, contamination, infestation, decay, or revulsion in context."},{"code":"PFM0411","name":"ComedyHorror","primIds":["P04","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Frightening or macabre material blended with humor, parody, absurdity, slapstick, jokes, or comic relief."},{"code":"PFM0412","name":"PartyTime","primIds":["P04","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Partying, celebration, lively social fun, festive energy, or candid group enjoyment. This can include goofy, spontaneous, high-energy group photos even when obvious party props or decorations are not visible."},{"code":"PFM0506","name":"Chaotic","primIds":["P05","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Disordered, unstable, crowded, conflicting, or lacking control or organization; scattered objects, unstable motion, visual overload, or competing elements."},{"code":"PFM0507","name":"Aggressive","primIds":["P05","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Visible confrontation, hostility, threat, intimidation, domination, attack readiness, or force directed toward someone or something; attacking gestures, weapons used threateningly, hostile advance, forceful restraint, threatening posture, or overt intimidation. Gate: Muscularity, masculinity, confidence, nudity, sexual posing, standing firmly, looking serious, dramatic posture, physical size, athleticism, or an imposing appearance alone are not Aggressive. There must be evidence of hostility, threat, force, confrontation, or domination."},{"code":"PFM0508","name":"Ethereal","primIds":["P05","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Airy, delicate, luminous, weightless, otherworldly, or removed from ordinary physical substance; soft glow, translucence, mist, or delicate forms."},{"code":"PFM0509","name":"Lust","primIds":["P05","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexual desire, appetite, craving, fixation, or physical attraction; desirous gazes, sensual bodies, erotic focus, or visible craving."},{"code":"PFM0510","name":"Brutal","primIds":["P05","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Harsh, violent, cruel, punishing, damaging, or unsparing in force or effect; severe injury, destruction, cruelty, or punishing conditions.\nGate: Muscularity, physique, nudity, confidence, posing, body display, or bold styling alone are not Brutal. There must be harshness, violence, cruelty, damage, injury, punishment, destruction, or visibly unsparing force."},{"code":"PFM0511","name":"Terror","primIds":["P05","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Extreme fear, alarm, panic, dread, or immediate danger; terrified expressions, fleeing, overwhelming threat, or visible panic."},{"code":"PFM0512","name":"Glory","primIds":["P05","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Honor, acclaim, valor, prestige, or celebrated achievement; trophies, medals, military honors, victory displays, heroic poses, or public recognition."},{"code":"PFM0607","name":"Monstrous","primIds":["P06","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Awe-inspiring unnatural threat defined by immense scale, predation, mythic power, grotesquely nonhuman anatomy, or eldritch otherness; colossal creatures, chimeric anatomy, predatory weapons, impossible bodies, or visibly transformed beings. Gate: Ordinary humans are not Monstrous merely because they are muscular, unusually proportioned, nude, sexually presented, unattractive, intimidating, costumed, unconventional, or visually striking. A human subject requires clearly impossible, creature-like, transformed, or supernaturally monstrous features."},{"code":"PFM0608","name":"Spirituality","primIds":["P06","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Meaning, transcendence, sacredness, inner life, faith, ritual, or connection beyond ordinary material existence; prayer, meditation, worship, sacred symbols, or mystical connection."},{"code":"PFM0609","name":"FreakyDeaky","primIds":["P06","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually playful, unconventional, eccentric, uninhibited, or erotic with an oddball edge; strange erotic styling, playful erotic imagery, or unconventional sexual presentation."},{"code":"PFM0610","name":"Strange","primIds":["P06","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Visibly anomalous, impossible, unfamiliar, transformed, or outside ordinary reality; mutated or hybrid bodies, extra limbs or altered organs, abnormal growths, techno-organic fusion, unfamiliar or nonhuman beings, strange anatomy, spacecraft or unfamiliar technology, otherworldly environments, improbable combinations, unexplained oddities, distorted scale, impossible spaces, unexpected object combinations, or dreamlike altered reality."},{"code":"PFM0611","name":"Horror","primIds":["P06","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Fear, dread, shock, or revulsion caused by clearly disturbing, threatening, grotesque, supernatural, violent, or ominous material. The reasoning must identify the concrete depicted source of the fear, dread, shock, or revulsion and explain how it creates the Horror response. Horror confidence must be based on that depicted source and response."},{"code":"PFM0612","name":"Delirious","primIds":["P06","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Disoriented, feverish, ecstatic, manic, confused, or detached from stable reality; hallucinations, unstable visual reality, feverish expressions, or ecstatic chaos."},{"code":"PFM0708","name":"Cursed","primIds":["P07","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"AI-generated or altered imagery with an uncanny, glitched, biologically wrong, or impossible quality. Includes extra or fused fingers, malformed hands, duplicated or misplaced anatomy, melted or merged body parts, impossible joints, distorted faces, unnatural symmetry, and other realistic-looking errors that trigger uncanny-valley discomfort or glitch-horror/body-horror reactions."},{"code":"PFM0709","name":"Sadomasochism","primIds":["P07","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Erotic pleasure involving pain, domination, submission, humiliation, control, or suffering; bondage, power exchange, or controlled physical pain."},{"code":"PFM0710","name":"Repulsive","primIds":["P07","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Immediate visceral disgust caused specifically by physical contamination, decay, bodily fluids, wounds, infection, infestation, organic breakdown, or comparably contaminating material; rotting flesh, pus, vomit, lesions, parasites, excrement, infected tissue, or formless slime. Gate: Repulsive does not mean unattractive, socially disliked, embarrassing, offensive, sexually explicit, nude, unconventional, badly dressed, awkward, creepy, or aesthetically unpleasant. If the disgust is not materially rooted in contamination, decay, bodily waste, injury, infection, or organic corruption, do not use Repulsive."},{"code":"PFM0711","name":"Wickedness","primIds":["P07","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Wrongdoing, cruelty, malice, corruption, immorality, or pleasure in harmful behavior; deliberate harm, malicious intent, corruption, or gleeful wrongdoing."},{"code":"PFM0712","name":"Revenge","primIds":["P07","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Retaliation, payback, punishment, or action answering a perceived wrong or injury; retaliatory acts, targeting offenders, punishment, or settling scores."},{"code":"PFM0809","name":"Seduction","primIds":["P08","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Attraction created through allure, temptation, mystery, danger, or sexual invitation; alluring poses, intimate gaze, revealing styling, or a dangerous sensual atmosphere."},{"code":"PFM0810","name":"Phantasmagoric","primIds":["P08","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Elaborate grotesque fantasy with bizarre creatures, impossible forms, or disturbing imagery."},{"code":"PFM0811","name":"Eerie","primIds":["P08","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Unsettling, haunting, uncanny, quiet, mysterious, or suggestive that something is wrong; strange shadows, emptiness, haunting stillness, or subtle wrongness."},{"code":"PFM0812","name":"Magical","primIds":["P08","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Enchanting, supernatural, wondrous, impossible, or governed by forces from a different reality; spells, glowing effects, impossible transformations, enchanted beings, or supernatural phenomena."},{"code":"PFM0910","name":"Lewd","primIds":["P09","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually explicit, vulgar, indecent, crude, suggestive, or offensively erotic; explicit exposure, crude sexual gestures, vulgar erotic jokes, or indecent posing."},{"code":"PFM0911","name":"Exploitation","primIds":["P09","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Using another person, body, suffering, vulnerability, or taboo material as a means to gain advantage, attention, profit, gratification, or spectacle."},{"code":"PFM0912","name":"Hedonism","primIds":["P09","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasure, gratification, sensual enjoyment, luxury, appetite, or indulgence elevated into an atmosphere or lifestyle; feasting, partying, lavish consumption, sensual abundance, or decadent excess."},{"code":"PFM1011","name":"Foreboding","primIds":["P10","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Uneasy expectation that danger, trouble, harm, or an unwanted event is approaching; ominous shadows, stormy skies, suspense, or approaching threat."},{"code":"PFM1012","name":"Excess","primIds":["P10","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Visible overabundance, accumulation, possession, consumption, luxury, indulgence, or waste; hoards, stockpiles, piles of possessions, excessive quantities of food or goods, conspicuous wealth or status display, lavish comfort, pampering, extravagance, grabbing or claiming valuables, or visible overconsumption."},{"code":"PFM1112","name":"Halloween","primIds":["P11","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Halloween imagery, costumes, decorations, parties, trick-or-treating, jack-o’-lanterns, haunted-house aesthetics, spooky festivities, and other clearly Halloween-specific scenes."}],"themeChoices":[{"code":"P01","name":"Adorable","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P02","name":"Beautiful","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P03","name":"Tragic","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P04","name":"Funny","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P05","name":"Intense","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P06","name":"Weird","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P07","name":"Angry","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P08","name":"Dreamy","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P09","name":"Zazzly","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P10","name":"Disgusting","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P11","name":"Scary","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"P12","name":"Celebration","kind":"prim","matrixVersion":"0.0.0.0"},{"code":"PFM0102","name":"Cozy","primIds":["P01","P02"],"matrixVersion":"0.0.0.0","aiMeaning":"Comforting, snug, warm, sheltered, or inviting; soft textures, warm lighting, blankets, relaxed intimate settings, or a feeling of ease, rest, or pleasant closeness.","kind":"fusion"},{"code":"PFM0103","name":"Poignant","primIds":["P01","P03"],"matrixVersion":"0.0.0.0","aiMeaning":"Emotionally affecting through tenderness, sadness, sympathy, compassion, meaning, or reflection; visible helplessness, suffering, misfortune, weakness, neglect, injury, abandonment, pleading, fragile moments, remembrance, meaningful loss, or emotional stillness.","kind":"fusion"},{"code":"PFM0104","name":"Goofy","primIds":["P01","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Silly, awkward, playful, foolish, ridiculous, eccentric, unconventional, comically strange, or offbeat in an amusing way; exaggerated expressions, clumsy antics, playful visual absurdity, mismatched costumes, unusual poses, frantic antics, or energetic comic behavior.\nGate: Ordinary resting, reclining, standing, sitting, relaxation, incidental awkwardness, clutter, or merely unusual appearance is not Goofy by itself. Goofy requires actual amusing silliness, foolishness, eccentric comic behavior, playful absurdity, exaggerated comic expression or behavior, or comparable laughter-producing incongruity.","kind":"fusion"},{"code":"PFM0105","name":"Joy","primIds":["P01","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Happiness, delight, pleasure, or emotional uplift shown through smiling, laughter, delighted expressions, playful pleasure, or visible enjoyment.","kind":"fusion"},{"code":"PFM0106","name":"Kawaii","primIds":["P01","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"A distinctly Japanese cute aesthetic marked by chibi, anime/manga, toy-like, or deliberately exaggerated cute styling.","kind":"fusion"},{"code":"PFM0107","name":"Saccharine","primIds":["P01","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Excessively sweet, sentimental, precious, or cutesy to the point of irritation; sugary, pastel, cloying, aggressively sweet imagery.\nGate: “Excessive” means excessive sweetness, sentimentality, preciousness, or cutesiness—not clutter, quantity, chaos, decoration, intensity, or visual excess. Pastel colors alone are not Saccharine unless they contribute to a clearly sugary, cloying, aggressively sweet, sentimental, or cutesy presentation.","kind":"fusion"},{"code":"PFM0108","name":"Whimsical","primIds":["P01","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Fanciful, playful, imaginative, lightly odd, or guided by charming logic; fantasy details, charming oddities, or impossible elements.","kind":"fusion"},{"code":"PFM0109","name":"Cheeky","primIds":["P01","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Playfully provocative, mischievous, teasing, impudent, saucy, or knowingly suggestive. Includes cute or endearing sexual presentation, playful exposure, suggestive posing, and literal butt cheeks when presented with a cheeky, playful, or teasing quality.","kind":"fusion"},{"code":"PFM0110","name":"UglyCute","primIds":["P01","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"“So ugly it’s cute” appeal: unattractive, awkward, scruffy, misshapen, grotesque, gross-looking, or otherwise visually off-putting qualities that become endearing, charming, funny, lovable, or cute; the ugliness or ickiness is itself part of the appeal.\nEvidence can include troll-like dolls, scruffy animals, odd little creatures, misshapen toys, awkward faces or proportions, strange character designs, or other subjects whose off-putting features actively increase their endearment.\nGate: Dirt, grime, filth, clutter, ugliness, disgust, or cuteness alone is not UglyCute. The image must combine genuine off-putting, ugly, or icky qualities with genuine cute or endearing appeal, and the undesirable quality must contribute to the affection rather than merely coexist with it.","kind":"fusion"},{"code":"PFM0111","name":"CreepyCute","primIds":["P01","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Cute and unsettling at once; Halloween fun. Appealing subjects combined with eerie, spooky, uncanny, or disturbing features.","kind":"fusion"},{"code":"PFM0112","name":"Playful","primIds":["P01","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Lighthearted, mischievous, teasing, game-like, curious, imaginative, or inclined toward fun and experimentation; playful role-taking, dress-up, character customization, make-believe, games, toys, teasing gestures, spontaneous fun, or deliberately fun self-presentation.\nClarification: Playful does not require laughter, toys, overt antics, or childish behavior. Role-play, dress-up, character experimentation, and deliberately fun or lighthearted presentation can independently support Playful when they function as play.","kind":"fusion"},{"code":"PFM0203","name":"Mundane","primIds":["P02","P03"],"matrixVersion":"0.0.0.0","aiMeaning":"Ordinary, routine, commonplace, dull, uneventful, repetitive, familiar, or visually unremarkable; everyday subject matter with little novelty, stimulation, drama, or distinctive interest. Includes boring, tedious, generic, monotonous, plain, or ‘nothing much going on’ imagery.","kind":"fusion"},{"code":"PFM0204","name":"Camp","primIds":["P02","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Exaggerated, theatrical, artificial, flamboyant, kitschy, or knowingly excessive styling and presentation.","kind":"fusion"},{"code":"PFM0205","name":"Epic","primIds":["P02","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Grand, dignified, regal, imposing, heroic, awe-inspiring, or massive in scale, presence, bearing, consequence, duration, drama, adventure, struggle, achievement, or spectacle; symmetry, noble posture, stately beauty, impressive or monumental scenery, heroic action, or high stakes.","kind":"fusion"},{"code":"PFM0206","name":"Psychedelic","primIds":["P02","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Hallucinatory, sensory-rich, perception-bending, or suggestive of expanded or distorted consciousness; vivid colors, swirling patterns, fractals, or hallucination-like effects.","kind":"fusion"},{"code":"PFM0207","name":"Pretentious","primIds":["P02","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Affected, self-important, showy, or overly cultured or significant; conspicuous status display and affected refinement.","kind":"fusion"},{"code":"PFM0208","name":"Romance","primIds":["P02","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Romantic affection, attraction, courtship, partnership, or love, expressed either through people/characters or through clearly romantic symbols, objects, gestures, messages, or situations. Evidence can include courting or affectionate interaction, kissing or embracing in a romantic context, dating, marriage proposals and engagements, weddings, engagement rings, love letters, hearts used romantically, roses, romantic gifts, chocolates, or other unmistakably romantic presentation. Requirement: The reasoning must identify the concrete evidence that makes the image specifically romantic.","kind":"fusion"},{"code":"PFM0209","name":"Exposure","primIds":["P02","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Being naked, indecently revealed, or too visibly exposed, especially in ways that feel shameful, embarrassing, humiliating, sexually charged or exhibitionistic; visible nudity, uncovered body parts, flashing, revealing poses, accidental bodily exposure, exhibitionism, exhibitionistic display, deliberate public or social exposure, intentionally displaying underwear, genitals, buttocks, or other intimate body areas, or deliberately revealing the body for attention or reaction.","kind":"fusion"},{"code":"PFM0210","name":"Grotesque","primIds":["P02","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Whimsical or ornamental distortion mixing beauty, absurdity, or unease; hybrid human, animal, or plant forms, exaggerated features, decorative symmetry, or playful violations of natural law.\nGate: Costume, role-play, muscularity, unusual clothing, or animal-themed accessories alone are not Grotesque; the depicted form itself must be meaningfully distorted, hybridized, deformed, ornamental, or unnaturally transformed.","kind":"fusion"},{"code":"PFM0211","name":"Vulnerable","primIds":["P02","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Exposed to harm, rejection, injury, loss, or emotional pain; defenseless posture, exposed emotion, isolation, or injury.","kind":"fusion"},{"code":"PFM0212","name":"Festive","primIds":["P02","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Christmas-specific celebration, imagery, atmosphere, traditions, decorations, symbols, characters, or styling. Required gate: Festive requires clear Christmas evidence. Valid evidence can include Christmas trees, ornaments, wreaths, stockings, Santa or Christmas characters, Christmas lights or decorations presented as Christmas, explicitly Christmas-themed clothing or displays, nativity imagery, Christmas gifts or traditions, or other unmistakably Christmas-specific cues. Hard non-qualifiers: A generic party, celebration, ceremony, formal event, crowd, gathering, decorated venue, winter scene, snow, cold weather, seasonal atmosphere, holiday-like styling, or special occasion is not Festive unless the image clearly communicates Christmas. When the evidence is only general partying, celebration, social fun, or event energy, do not select Festive; PartyTime may apply instead.","kind":"fusion"},{"code":"PFM0304","name":"Freakshow","primIds":["P03","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Bizarre, degrading, dysfunctional, shocking, or socially transgressive people, situations, lifestyles, or spectacles that provoke fascinated, guilty, voyeuristic, or trainwreck-like attention; something disturbing, embarrassing, abnormal, or shameful that is compelling to look at.\nEvidence can include unusual performers or exhibited subjects, carnival/sideshow-like presentation, gawking attention, conspicuous dysfunction, degrading living conditions, humiliating or bizarre personal presentation, shocking anomalies, or situations whose very wrongness or dysfunction makes them fascinating to observe.\nGate: Mere clutter, eccentricity, poverty, unusual appearance, or disorder is not Freakshow by itself. The scene must actually carry a sense of bizarre, degrading, dysfunctional, shocking, embarrassing, or transgressive spectacle that invites fascinated or trainwreck-like attention.","kind":"fusion"},{"code":"PFM0305","name":"Despair","primIds":["P03","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Hopelessness, anguish, defeat, profound or overwhelming loss, grief, shock, or the sense that relief or improvement has disappeared; collapsed posture, hopeless expressions, isolation, catastrophic ruin, collapse, severe aftermath, or visible destruction.","kind":"fusion"},{"code":"PFM0306","name":"Nightmarish","primIds":["P03","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Resembling a nightmare; frightening, disturbing, unreal, oppressive, or horrifying, with dream logic, threatening distortions, darkness, or impossible danger.","kind":"fusion"},{"code":"PFM0307","name":"Overstimulated","primIds":["P03","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Overloaded or visibly overwhelmed by excessive sensory, informational, or social input; intense or competing lights, sounds, screens, signs, crowds, motion, alerts, simultaneous activity, or multiple demands for attention, with cues such as frazzled expressions, hands over ears or eyes, agitation, or difficulty focusing.","kind":"fusion"},{"code":"PFM0308","name":"Nostalgia","primIds":["P03","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Old-timey, vintage, retro, memory-filled, or evocative of the past, childhood, bygone eras, or “the good old days.”","kind":"fusion"},{"code":"PFM0309","name":"Humiliation","primIds":["P03","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Demeaning, degrading, ridiculing, belittling, infantilizing, exposing, or stripping someone of dignity.\nEvidence can include degrading treatment, public ridicule, forced exposure, visible embarrassment or submission, insulting labels or messages, or costumes, tattoos, markings, symbols, or body presentation that clearly function to demean, belittle, infantilize, ridicule, embarrass, or strip the subject of dignity.\nGate: A costume, tattoo, marking, label, symbol, exposure, or unusual presentation is not Humiliation by itself. It must carry a clearly degrading, belittling, ridiculing, infantilizing, or dignity-reducing meaning in context.","kind":"fusion"},{"code":"PFM0310","name":"Shame","primIds":["P03","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Painful self-conscious disgrace, embarrassment, exposure, or feeling unworthy, judged, or wanting to hide; averted gaze, covered face, hiding posture, blushing, shrinking, or visibly caught embarrassment.","kind":"fusion"},{"code":"PFM0311","name":"Paranoia","primIds":["P03","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Persistent suspicion or fear of harm, deception, surveillance, persecution, or hidden threat; watchful fear, suspicious glances, defensive behavior, or surveillance imagery.","kind":"fusion"},{"code":"PFM0312","name":"Bittersweet","primIds":["P03","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasure and sadness experienced together; joyful imagery touched by loss, nostalgia, farewell, memory, or impermanence.","kind":"fusion"},{"code":"PFM0405","name":"Hilarious","primIds":["P04","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Clever, quick, inventive, or skillful humor and insight; visual puns, layered references, wordplay, or ingenious humorous juxtapositions. When claiming a visual pun, wordplay, layered reference, or ingenious juxtaposition, the reasoning must identify the actual connection that makes it clever.","kind":"fusion"},{"code":"PFM0406","name":"Absurd","primIds":["P04","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Illogical, ridiculous, contradictory, pointless, impossible, or incompatible with ordinary sense; nonsensical juxtapositions, impossible logic, or ridiculous contradictions.","kind":"fusion"},{"code":"PFM0407","name":"Mockery","primIds":["P04","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Using humor, irony, exaggeration, distortion, imitation, or ridicule to expose, criticize, or comically undermine a recognizable person, behavior, institution, idea, convention, style, work, archetype, or trope. Mockery may operate satirically by exposing faults or absurdities, or parodically by imitating and comically transforming a recognizable source.\nBoundary: Mere clutter, chaos, exaggeration, absurdity, or unusual styling is not Mockery. There must be a recognizable target and clear evidence that it is being ridiculed, comically imitated, distorted, exaggerated, or critically exposed.","kind":"fusion"},{"code":"PFM0408","name":"Medicated","primIds":["P04","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Altered, softened, detached, or chemically influenced consciousness or perception; drowsy eyes, softened expressions, detached gaze, pills, or clinical sedation cues.","kind":"fusion"},{"code":"PFM0409","name":"Raunchy","primIds":["P04","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Coarse, bawdy, or sexually suggestive humor; sexual jokes, innuendo, vulgar comedy, bawdy gestures, or suggestive comic situations.","kind":"fusion"},{"code":"PFM0410","name":"Grossout","primIds":["P04","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Humor or spectacle built around filth, bodily functions, fluids, decay, gore, infestation, vermin, or revulsion; vomit, excrement, bodily fluids, gross material, bugs, rats, flies, or other unclean/vermin-associated creatures used to create grossness or disgust.\nBoundary: Bugs, rats, flies, or other creatures are not Grossout merely because they are present. They contribute when they function as evidence of filth, uncleanness, contamination, infestation, decay, or revulsion in context.","kind":"fusion"},{"code":"PFM0411","name":"ComedyHorror","primIds":["P04","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Frightening or macabre material blended with humor, parody, absurdity, slapstick, jokes, or comic relief.","kind":"fusion"},{"code":"PFM0412","name":"PartyTime","primIds":["P04","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Partying, celebration, lively social fun, festive energy, or candid group enjoyment. This can include goofy, spontaneous, high-energy group photos even when obvious party props or decorations are not visible.","kind":"fusion"},{"code":"PFM0506","name":"Chaotic","primIds":["P05","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Disordered, unstable, crowded, conflicting, or lacking control or organization; scattered objects, unstable motion, visual overload, or competing elements.","kind":"fusion"},{"code":"PFM0507","name":"Aggressive","primIds":["P05","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Visible confrontation, hostility, threat, intimidation, domination, attack readiness, or force directed toward someone or something; attacking gestures, weapons used threateningly, hostile advance, forceful restraint, threatening posture, or overt intimidation. Gate: Muscularity, masculinity, confidence, nudity, sexual posing, standing firmly, looking serious, dramatic posture, physical size, athleticism, or an imposing appearance alone are not Aggressive. There must be evidence of hostility, threat, force, confrontation, or domination.","kind":"fusion"},{"code":"PFM0508","name":"Ethereal","primIds":["P05","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Airy, delicate, luminous, weightless, otherworldly, or removed from ordinary physical substance; soft glow, translucence, mist, or delicate forms.","kind":"fusion"},{"code":"PFM0509","name":"Lust","primIds":["P05","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexual desire, appetite, craving, fixation, or physical attraction; desirous gazes, sensual bodies, erotic focus, or visible craving.","kind":"fusion"},{"code":"PFM0510","name":"Brutal","primIds":["P05","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Harsh, violent, cruel, punishing, damaging, or unsparing in force or effect; severe injury, destruction, cruelty, or punishing conditions.\nGate: Muscularity, physique, nudity, confidence, posing, body display, or bold styling alone are not Brutal. There must be harshness, violence, cruelty, damage, injury, punishment, destruction, or visibly unsparing force.","kind":"fusion"},{"code":"PFM0511","name":"Terror","primIds":["P05","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Extreme fear, alarm, panic, dread, or immediate danger; terrified expressions, fleeing, overwhelming threat, or visible panic.","kind":"fusion"},{"code":"PFM0512","name":"Glory","primIds":["P05","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Honor, acclaim, valor, prestige, or celebrated achievement; trophies, medals, military honors, victory displays, heroic poses, or public recognition.","kind":"fusion"},{"code":"PFM0607","name":"Monstrous","primIds":["P06","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Awe-inspiring unnatural threat defined by immense scale, predation, mythic power, grotesquely nonhuman anatomy, or eldritch otherness; colossal creatures, chimeric anatomy, predatory weapons, impossible bodies, or visibly transformed beings. Gate: Ordinary humans are not Monstrous merely because they are muscular, unusually proportioned, nude, sexually presented, unattractive, intimidating, costumed, unconventional, or visually striking. A human subject requires clearly impossible, creature-like, transformed, or supernaturally monstrous features.","kind":"fusion"},{"code":"PFM0608","name":"Spirituality","primIds":["P06","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Meaning, transcendence, sacredness, inner life, faith, ritual, or connection beyond ordinary material existence; prayer, meditation, worship, sacred symbols, or mystical connection.","kind":"fusion"},{"code":"PFM0609","name":"FreakyDeaky","primIds":["P06","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually playful, unconventional, eccentric, uninhibited, or erotic with an oddball edge; strange erotic styling, playful erotic imagery, or unconventional sexual presentation.","kind":"fusion"},{"code":"PFM0610","name":"Strange","primIds":["P06","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Visibly anomalous, impossible, unfamiliar, transformed, or outside ordinary reality; mutated or hybrid bodies, extra limbs or altered organs, abnormal growths, techno-organic fusion, unfamiliar or nonhuman beings, strange anatomy, spacecraft or unfamiliar technology, otherworldly environments, improbable combinations, unexplained oddities, distorted scale, impossible spaces, unexpected object combinations, or dreamlike altered reality.","kind":"fusion"},{"code":"PFM0611","name":"Horror","primIds":["P06","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Fear, dread, shock, or revulsion caused by clearly disturbing, threatening, grotesque, supernatural, violent, or ominous material. The reasoning must identify the concrete depicted source of the fear, dread, shock, or revulsion and explain how it creates the Horror response. Horror confidence must be based on that depicted source and response.","kind":"fusion"},{"code":"PFM0612","name":"Delirious","primIds":["P06","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Disoriented, feverish, ecstatic, manic, confused, or detached from stable reality; hallucinations, unstable visual reality, feverish expressions, or ecstatic chaos.","kind":"fusion"},{"code":"PFM0708","name":"Cursed","primIds":["P07","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"AI-generated or altered imagery with an uncanny, glitched, biologically wrong, or impossible quality. Includes extra or fused fingers, malformed hands, duplicated or misplaced anatomy, melted or merged body parts, impossible joints, distorted faces, unnatural symmetry, and other realistic-looking errors that trigger uncanny-valley discomfort or glitch-horror/body-horror reactions.","kind":"fusion"},{"code":"PFM0709","name":"Sadomasochism","primIds":["P07","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Erotic pleasure involving pain, domination, submission, humiliation, control, or suffering; bondage, power exchange, or controlled physical pain.","kind":"fusion"},{"code":"PFM0710","name":"Repulsive","primIds":["P07","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Immediate visceral disgust caused specifically by physical contamination, decay, bodily fluids, wounds, infection, infestation, organic breakdown, or comparably contaminating material; rotting flesh, pus, vomit, lesions, parasites, excrement, infected tissue, or formless slime. Gate: Repulsive does not mean unattractive, socially disliked, embarrassing, offensive, sexually explicit, nude, unconventional, badly dressed, awkward, creepy, or aesthetically unpleasant. If the disgust is not materially rooted in contamination, decay, bodily waste, injury, infection, or organic corruption, do not use Repulsive.","kind":"fusion"},{"code":"PFM0711","name":"Wickedness","primIds":["P07","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Wrongdoing, cruelty, malice, corruption, immorality, or pleasure in harmful behavior; deliberate harm, malicious intent, corruption, or gleeful wrongdoing.","kind":"fusion"},{"code":"PFM0712","name":"Revenge","primIds":["P07","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Retaliation, payback, punishment, or action answering a perceived wrong or injury; retaliatory acts, targeting offenders, punishment, or settling scores.","kind":"fusion"},{"code":"PFM0809","name":"Seduction","primIds":["P08","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Attraction created through allure, temptation, mystery, danger, or sexual invitation; alluring poses, intimate gaze, revealing styling, or a dangerous sensual atmosphere.","kind":"fusion"},{"code":"PFM0810","name":"Phantasmagoric","primIds":["P08","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Elaborate grotesque fantasy with bizarre creatures, impossible forms, or disturbing imagery.","kind":"fusion"},{"code":"PFM0811","name":"Eerie","primIds":["P08","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Unsettling, haunting, uncanny, quiet, mysterious, or suggestive that something is wrong; strange shadows, emptiness, haunting stillness, or subtle wrongness.","kind":"fusion"},{"code":"PFM0812","name":"Magical","primIds":["P08","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Enchanting, supernatural, wondrous, impossible, or governed by forces from a different reality; spells, glowing effects, impossible transformations, enchanted beings, or supernatural phenomena.","kind":"fusion"},{"code":"PFM0910","name":"Lewd","primIds":["P09","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually explicit, vulgar, indecent, crude, suggestive, or offensively erotic; explicit exposure, crude sexual gestures, vulgar erotic jokes, or indecent posing.","kind":"fusion"},{"code":"PFM0911","name":"Exploitation","primIds":["P09","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Using another person, body, suffering, vulnerability, or taboo material as a means to gain advantage, attention, profit, gratification, or spectacle.","kind":"fusion"},{"code":"PFM0912","name":"Hedonism","primIds":["P09","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasure, gratification, sensual enjoyment, luxury, appetite, or indulgence elevated into an atmosphere or lifestyle; feasting, partying, lavish consumption, sensual abundance, or decadent excess.","kind":"fusion"},{"code":"PFM1011","name":"Foreboding","primIds":["P10","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Uneasy expectation that danger, trouble, harm, or an unwanted event is approaching; ominous shadows, stormy skies, suspense, or approaching threat.","kind":"fusion"},{"code":"PFM1012","name":"Excess","primIds":["P10","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Visible overabundance, accumulation, possession, consumption, luxury, indulgence, or waste; hoards, stockpiles, piles of possessions, excessive quantities of food or goods, conspicuous wealth or status display, lavish comfort, pampering, extravagance, grabbing or claiming valuables, or visible overconsumption.","kind":"fusion"},{"code":"PFM1112","name":"Halloween","primIds":["P11","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Halloween imagery, costumes, decorations, parties, trick-or-treating, jack-o’-lanterns, haunted-house aesthetics, spooky festivities, and other clearly Halloween-specific scenes.","kind":"fusion"}],"aiThemeChoices":[{"code":"PFM0102","name":"Cozy","primIds":["P01","P02"],"matrixVersion":"0.0.0.0","aiMeaning":"Comforting, snug, warm, sheltered, or inviting; soft textures, warm lighting, blankets, relaxed intimate settings, or a feeling of ease, rest, or pleasant closeness.","kind":"fusion"},{"code":"PFM0103","name":"Poignant","primIds":["P01","P03"],"matrixVersion":"0.0.0.0","aiMeaning":"Emotionally affecting through tenderness, sadness, sympathy, compassion, meaning, or reflection; visible helplessness, suffering, misfortune, weakness, neglect, injury, abandonment, pleading, fragile moments, remembrance, meaningful loss, or emotional stillness.","kind":"fusion"},{"code":"PFM0104","name":"Goofy","primIds":["P01","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Silly, awkward, playful, foolish, ridiculous, eccentric, unconventional, comically strange, or offbeat in an amusing way; exaggerated expressions, clumsy antics, playful visual absurdity, mismatched costumes, unusual poses, frantic antics, or energetic comic behavior.\nGate: Ordinary resting, reclining, standing, sitting, relaxation, incidental awkwardness, clutter, or merely unusual appearance is not Goofy by itself. Goofy requires actual amusing silliness, foolishness, eccentric comic behavior, playful absurdity, exaggerated comic expression or behavior, or comparable laughter-producing incongruity.","kind":"fusion"},{"code":"PFM0105","name":"Joy","primIds":["P01","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Happiness, delight, pleasure, or emotional uplift shown through smiling, laughter, delighted expressions, playful pleasure, or visible enjoyment.","kind":"fusion"},{"code":"PFM0106","name":"Kawaii","primIds":["P01","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"A distinctly Japanese cute aesthetic marked by chibi, anime/manga, toy-like, or deliberately exaggerated cute styling.","kind":"fusion"},{"code":"PFM0107","name":"Saccharine","primIds":["P01","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Excessively sweet, sentimental, precious, or cutesy to the point of irritation; sugary, pastel, cloying, aggressively sweet imagery.\nGate: “Excessive” means excessive sweetness, sentimentality, preciousness, or cutesiness—not clutter, quantity, chaos, decoration, intensity, or visual excess. Pastel colors alone are not Saccharine unless they contribute to a clearly sugary, cloying, aggressively sweet, sentimental, or cutesy presentation.","kind":"fusion"},{"code":"PFM0108","name":"Whimsical","primIds":["P01","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Fanciful, playful, imaginative, lightly odd, or guided by charming logic; fantasy details, charming oddities, or impossible elements.","kind":"fusion"},{"code":"PFM0109","name":"Cheeky","primIds":["P01","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Playfully provocative, mischievous, teasing, impudent, saucy, or knowingly suggestive. Includes cute or endearing sexual presentation, playful exposure, suggestive posing, and literal butt cheeks when presented with a cheeky, playful, or teasing quality.","kind":"fusion"},{"code":"PFM0110","name":"UglyCute","primIds":["P01","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"“So ugly it’s cute” appeal: unattractive, awkward, scruffy, misshapen, grotesque, gross-looking, or otherwise visually off-putting qualities that become endearing, charming, funny, lovable, or cute; the ugliness or ickiness is itself part of the appeal.\nEvidence can include troll-like dolls, scruffy animals, odd little creatures, misshapen toys, awkward faces or proportions, strange character designs, or other subjects whose off-putting features actively increase their endearment.\nGate: Dirt, grime, filth, clutter, ugliness, disgust, or cuteness alone is not UglyCute. The image must combine genuine off-putting, ugly, or icky qualities with genuine cute or endearing appeal, and the undesirable quality must contribute to the affection rather than merely coexist with it.","kind":"fusion"},{"code":"PFM0111","name":"CreepyCute","primIds":["P01","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Cute and unsettling at once; Halloween fun. Appealing subjects combined with eerie, spooky, uncanny, or disturbing features.","kind":"fusion"},{"code":"PFM0112","name":"Playful","primIds":["P01","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Lighthearted, mischievous, teasing, game-like, curious, imaginative, or inclined toward fun and experimentation; playful role-taking, dress-up, character customization, make-believe, games, toys, teasing gestures, spontaneous fun, or deliberately fun self-presentation.\nClarification: Playful does not require laughter, toys, overt antics, or childish behavior. Role-play, dress-up, character experimentation, and deliberately fun or lighthearted presentation can independently support Playful when they function as play.","kind":"fusion"},{"code":"PFM0203","name":"Mundane","primIds":["P02","P03"],"matrixVersion":"0.0.0.0","aiMeaning":"Ordinary, routine, commonplace, dull, uneventful, repetitive, familiar, or visually unremarkable; everyday subject matter with little novelty, stimulation, drama, or distinctive interest. Includes boring, tedious, generic, monotonous, plain, or ‘nothing much going on’ imagery.","kind":"fusion"},{"code":"PFM0204","name":"Camp","primIds":["P02","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Exaggerated, theatrical, artificial, flamboyant, kitschy, or knowingly excessive styling and presentation.","kind":"fusion"},{"code":"PFM0205","name":"Epic","primIds":["P02","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Grand, dignified, regal, imposing, heroic, awe-inspiring, or massive in scale, presence, bearing, consequence, duration, drama, adventure, struggle, achievement, or spectacle; symmetry, noble posture, stately beauty, impressive or monumental scenery, heroic action, or high stakes.","kind":"fusion"},{"code":"PFM0206","name":"Psychedelic","primIds":["P02","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Hallucinatory, sensory-rich, perception-bending, or suggestive of expanded or distorted consciousness; vivid colors, swirling patterns, fractals, or hallucination-like effects.","kind":"fusion"},{"code":"PFM0207","name":"Pretentious","primIds":["P02","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Affected, self-important, showy, or overly cultured or significant; conspicuous status display and affected refinement.","kind":"fusion"},{"code":"PFM0208","name":"Romance","primIds":["P02","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Romantic affection, attraction, courtship, partnership, or love, expressed either through people/characters or through clearly romantic symbols, objects, gestures, messages, or situations. Evidence can include courting or affectionate interaction, kissing or embracing in a romantic context, dating, marriage proposals and engagements, weddings, engagement rings, love letters, hearts used romantically, roses, romantic gifts, chocolates, or other unmistakably romantic presentation. Requirement: The reasoning must identify the concrete evidence that makes the image specifically romantic.","kind":"fusion"},{"code":"PFM0209","name":"Exposure","primIds":["P02","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Being naked, indecently revealed, or too visibly exposed, especially in ways that feel shameful, embarrassing, humiliating, sexually charged or exhibitionistic; visible nudity, uncovered body parts, flashing, revealing poses, accidental bodily exposure, exhibitionism, exhibitionistic display, deliberate public or social exposure, intentionally displaying underwear, genitals, buttocks, or other intimate body areas, or deliberately revealing the body for attention or reaction.","kind":"fusion"},{"code":"PFM0210","name":"Grotesque","primIds":["P02","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Whimsical or ornamental distortion mixing beauty, absurdity, or unease; hybrid human, animal, or plant forms, exaggerated features, decorative symmetry, or playful violations of natural law.\nGate: Costume, role-play, muscularity, unusual clothing, or animal-themed accessories alone are not Grotesque; the depicted form itself must be meaningfully distorted, hybridized, deformed, ornamental, or unnaturally transformed.","kind":"fusion"},{"code":"PFM0211","name":"Vulnerable","primIds":["P02","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Exposed to harm, rejection, injury, loss, or emotional pain; defenseless posture, exposed emotion, isolation, or injury.","kind":"fusion"},{"code":"PFM0212","name":"Festive","primIds":["P02","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Christmas-specific celebration, imagery, atmosphere, traditions, decorations, symbols, characters, or styling. Required gate: Festive requires clear Christmas evidence. Valid evidence can include Christmas trees, ornaments, wreaths, stockings, Santa or Christmas characters, Christmas lights or decorations presented as Christmas, explicitly Christmas-themed clothing or displays, nativity imagery, Christmas gifts or traditions, or other unmistakably Christmas-specific cues. Hard non-qualifiers: A generic party, celebration, ceremony, formal event, crowd, gathering, decorated venue, winter scene, snow, cold weather, seasonal atmosphere, holiday-like styling, or special occasion is not Festive unless the image clearly communicates Christmas. When the evidence is only general partying, celebration, social fun, or event energy, do not select Festive; PartyTime may apply instead.","kind":"fusion"},{"code":"PFM0304","name":"Freakshow","primIds":["P03","P04"],"matrixVersion":"0.0.0.0","aiMeaning":"Bizarre, degrading, dysfunctional, shocking, or socially transgressive people, situations, lifestyles, or spectacles that provoke fascinated, guilty, voyeuristic, or trainwreck-like attention; something disturbing, embarrassing, abnormal, or shameful that is compelling to look at.\nEvidence can include unusual performers or exhibited subjects, carnival/sideshow-like presentation, gawking attention, conspicuous dysfunction, degrading living conditions, humiliating or bizarre personal presentation, shocking anomalies, or situations whose very wrongness or dysfunction makes them fascinating to observe.\nGate: Mere clutter, eccentricity, poverty, unusual appearance, or disorder is not Freakshow by itself. The scene must actually carry a sense of bizarre, degrading, dysfunctional, shocking, embarrassing, or transgressive spectacle that invites fascinated or trainwreck-like attention.","kind":"fusion"},{"code":"PFM0305","name":"Despair","primIds":["P03","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Hopelessness, anguish, defeat, profound or overwhelming loss, grief, shock, or the sense that relief or improvement has disappeared; collapsed posture, hopeless expressions, isolation, catastrophic ruin, collapse, severe aftermath, or visible destruction.","kind":"fusion"},{"code":"PFM0306","name":"Nightmarish","primIds":["P03","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Resembling a nightmare; frightening, disturbing, unreal, oppressive, or horrifying, with dream logic, threatening distortions, darkness, or impossible danger.","kind":"fusion"},{"code":"PFM0307","name":"Overstimulated","primIds":["P03","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Overloaded or visibly overwhelmed by excessive sensory, informational, or social input; intense or competing lights, sounds, screens, signs, crowds, motion, alerts, simultaneous activity, or multiple demands for attention, with cues such as frazzled expressions, hands over ears or eyes, agitation, or difficulty focusing.","kind":"fusion"},{"code":"PFM0308","name":"Nostalgia","primIds":["P03","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Old-timey, vintage, retro, memory-filled, or evocative of the past, childhood, bygone eras, or “the good old days.”","kind":"fusion"},{"code":"PFM0309","name":"Humiliation","primIds":["P03","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Demeaning, degrading, ridiculing, belittling, infantilizing, exposing, or stripping someone of dignity.\nEvidence can include degrading treatment, public ridicule, forced exposure, visible embarrassment or submission, insulting labels or messages, or costumes, tattoos, markings, symbols, or body presentation that clearly function to demean, belittle, infantilize, ridicule, embarrass, or strip the subject of dignity.\nGate: A costume, tattoo, marking, label, symbol, exposure, or unusual presentation is not Humiliation by itself. It must carry a clearly degrading, belittling, ridiculing, infantilizing, or dignity-reducing meaning in context.","kind":"fusion"},{"code":"PFM0310","name":"Shame","primIds":["P03","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Painful self-conscious disgrace, embarrassment, exposure, or feeling unworthy, judged, or wanting to hide; averted gaze, covered face, hiding posture, blushing, shrinking, or visibly caught embarrassment.","kind":"fusion"},{"code":"PFM0311","name":"Paranoia","primIds":["P03","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Persistent suspicion or fear of harm, deception, surveillance, persecution, or hidden threat; watchful fear, suspicious glances, defensive behavior, or surveillance imagery.","kind":"fusion"},{"code":"PFM0312","name":"Bittersweet","primIds":["P03","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasure and sadness experienced together; joyful imagery touched by loss, nostalgia, farewell, memory, or impermanence.","kind":"fusion"},{"code":"PFM0405","name":"Hilarious","primIds":["P04","P05"],"matrixVersion":"0.0.0.0","aiMeaning":"Clever, quick, inventive, or skillful humor and insight; visual puns, layered references, wordplay, or ingenious humorous juxtapositions. When claiming a visual pun, wordplay, layered reference, or ingenious juxtaposition, the reasoning must identify the actual connection that makes it clever.","kind":"fusion"},{"code":"PFM0406","name":"Absurd","primIds":["P04","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Illogical, ridiculous, contradictory, pointless, impossible, or incompatible with ordinary sense; nonsensical juxtapositions, impossible logic, or ridiculous contradictions.","kind":"fusion"},{"code":"PFM0407","name":"Mockery","primIds":["P04","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Using humor, irony, exaggeration, distortion, imitation, or ridicule to expose, criticize, or comically undermine a recognizable person, behavior, institution, idea, convention, style, work, archetype, or trope. Mockery may operate satirically by exposing faults or absurdities, or parodically by imitating and comically transforming a recognizable source.\nBoundary: Mere clutter, chaos, exaggeration, absurdity, or unusual styling is not Mockery. There must be a recognizable target and clear evidence that it is being ridiculed, comically imitated, distorted, exaggerated, or critically exposed.","kind":"fusion"},{"code":"PFM0408","name":"Medicated","primIds":["P04","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Altered, softened, detached, or chemically influenced consciousness or perception; drowsy eyes, softened expressions, detached gaze, pills, or clinical sedation cues.","kind":"fusion"},{"code":"PFM0409","name":"Raunchy","primIds":["P04","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Coarse, bawdy, or sexually suggestive humor; sexual jokes, innuendo, vulgar comedy, bawdy gestures, or suggestive comic situations.","kind":"fusion"},{"code":"PFM0410","name":"Grossout","primIds":["P04","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Humor or spectacle built around filth, bodily functions, fluids, decay, gore, infestation, vermin, or revulsion; vomit, excrement, bodily fluids, gross material, bugs, rats, flies, or other unclean/vermin-associated creatures used to create grossness or disgust.\nBoundary: Bugs, rats, flies, or other creatures are not Grossout merely because they are present. They contribute when they function as evidence of filth, uncleanness, contamination, infestation, decay, or revulsion in context.","kind":"fusion"},{"code":"PFM0411","name":"ComedyHorror","primIds":["P04","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Frightening or macabre material blended with humor, parody, absurdity, slapstick, jokes, or comic relief.","kind":"fusion"},{"code":"PFM0412","name":"PartyTime","primIds":["P04","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Partying, celebration, lively social fun, festive energy, or candid group enjoyment. This can include goofy, spontaneous, high-energy group photos even when obvious party props or decorations are not visible.","kind":"fusion"},{"code":"PFM0506","name":"Chaotic","primIds":["P05","P06"],"matrixVersion":"0.0.0.0","aiMeaning":"Disordered, unstable, crowded, conflicting, or lacking control or organization; scattered objects, unstable motion, visual overload, or competing elements.","kind":"fusion"},{"code":"PFM0507","name":"Aggressive","primIds":["P05","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Visible confrontation, hostility, threat, intimidation, domination, attack readiness, or force directed toward someone or something; attacking gestures, weapons used threateningly, hostile advance, forceful restraint, threatening posture, or overt intimidation. Gate: Muscularity, masculinity, confidence, nudity, sexual posing, standing firmly, looking serious, dramatic posture, physical size, athleticism, or an imposing appearance alone are not Aggressive. There must be evidence of hostility, threat, force, confrontation, or domination.","kind":"fusion"},{"code":"PFM0508","name":"Ethereal","primIds":["P05","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Airy, delicate, luminous, weightless, otherworldly, or removed from ordinary physical substance; soft glow, translucence, mist, or delicate forms.","kind":"fusion"},{"code":"PFM0509","name":"Lust","primIds":["P05","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexual desire, appetite, craving, fixation, or physical attraction; desirous gazes, sensual bodies, erotic focus, or visible craving.","kind":"fusion"},{"code":"PFM0510","name":"Brutal","primIds":["P05","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Harsh, violent, cruel, punishing, damaging, or unsparing in force or effect; severe injury, destruction, cruelty, or punishing conditions.\nGate: Muscularity, physique, nudity, confidence, posing, body display, or bold styling alone are not Brutal. There must be harshness, violence, cruelty, damage, injury, punishment, destruction, or visibly unsparing force.","kind":"fusion"},{"code":"PFM0511","name":"Terror","primIds":["P05","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Extreme fear, alarm, panic, dread, or immediate danger; terrified expressions, fleeing, overwhelming threat, or visible panic.","kind":"fusion"},{"code":"PFM0512","name":"Glory","primIds":["P05","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Honor, acclaim, valor, prestige, or celebrated achievement; trophies, medals, military honors, victory displays, heroic poses, or public recognition.","kind":"fusion"},{"code":"PFM0607","name":"Monstrous","primIds":["P06","P07"],"matrixVersion":"0.0.0.0","aiMeaning":"Awe-inspiring unnatural threat defined by immense scale, predation, mythic power, grotesquely nonhuman anatomy, or eldritch otherness; colossal creatures, chimeric anatomy, predatory weapons, impossible bodies, or visibly transformed beings. Gate: Ordinary humans are not Monstrous merely because they are muscular, unusually proportioned, nude, sexually presented, unattractive, intimidating, costumed, unconventional, or visually striking. A human subject requires clearly impossible, creature-like, transformed, or supernaturally monstrous features.","kind":"fusion"},{"code":"PFM0608","name":"Spirituality","primIds":["P06","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"Meaning, transcendence, sacredness, inner life, faith, ritual, or connection beyond ordinary material existence; prayer, meditation, worship, sacred symbols, or mystical connection.","kind":"fusion"},{"code":"PFM0609","name":"FreakyDeaky","primIds":["P06","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually playful, unconventional, eccentric, uninhibited, or erotic with an oddball edge; strange erotic styling, playful erotic imagery, or unconventional sexual presentation.","kind":"fusion"},{"code":"PFM0610","name":"Strange","primIds":["P06","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Visibly anomalous, impossible, unfamiliar, transformed, or outside ordinary reality; mutated or hybrid bodies, extra limbs or altered organs, abnormal growths, techno-organic fusion, unfamiliar or nonhuman beings, strange anatomy, spacecraft or unfamiliar technology, otherworldly environments, improbable combinations, unexplained oddities, distorted scale, impossible spaces, unexpected object combinations, or dreamlike altered reality.","kind":"fusion"},{"code":"PFM0611","name":"Horror","primIds":["P06","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Fear, dread, shock, or revulsion caused by clearly disturbing, threatening, grotesque, supernatural, violent, or ominous material. The reasoning must identify the concrete depicted source of the fear, dread, shock, or revulsion and explain how it creates the Horror response. Horror confidence must be based on that depicted source and response.","kind":"fusion"},{"code":"PFM0612","name":"Delirious","primIds":["P06","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Disoriented, feverish, ecstatic, manic, confused, or detached from stable reality; hallucinations, unstable visual reality, feverish expressions, or ecstatic chaos.","kind":"fusion"},{"code":"PFM0708","name":"Cursed","primIds":["P07","P08"],"matrixVersion":"0.0.0.0","aiMeaning":"AI-generated or altered imagery with an uncanny, glitched, biologically wrong, or impossible quality. Includes extra or fused fingers, malformed hands, duplicated or misplaced anatomy, melted or merged body parts, impossible joints, distorted faces, unnatural symmetry, and other realistic-looking errors that trigger uncanny-valley discomfort or glitch-horror/body-horror reactions.","kind":"fusion"},{"code":"PFM0709","name":"Sadomasochism","primIds":["P07","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Erotic pleasure involving pain, domination, submission, humiliation, control, or suffering; bondage, power exchange, or controlled physical pain.","kind":"fusion"},{"code":"PFM0710","name":"Repulsive","primIds":["P07","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Immediate visceral disgust caused specifically by physical contamination, decay, bodily fluids, wounds, infection, infestation, organic breakdown, or comparably contaminating material; rotting flesh, pus, vomit, lesions, parasites, excrement, infected tissue, or formless slime. Gate: Repulsive does not mean unattractive, socially disliked, embarrassing, offensive, sexually explicit, nude, unconventional, badly dressed, awkward, creepy, or aesthetically unpleasant. If the disgust is not materially rooted in contamination, decay, bodily waste, injury, infection, or organic corruption, do not use Repulsive.","kind":"fusion"},{"code":"PFM0711","name":"Wickedness","primIds":["P07","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Wrongdoing, cruelty, malice, corruption, immorality, or pleasure in harmful behavior; deliberate harm, malicious intent, corruption, or gleeful wrongdoing.","kind":"fusion"},{"code":"PFM0712","name":"Revenge","primIds":["P07","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Retaliation, payback, punishment, or action answering a perceived wrong or injury; retaliatory acts, targeting offenders, punishment, or settling scores.","kind":"fusion"},{"code":"PFM0809","name":"Seduction","primIds":["P08","P09"],"matrixVersion":"0.0.0.0","aiMeaning":"Attraction created through allure, temptation, mystery, danger, or sexual invitation; alluring poses, intimate gaze, revealing styling, or a dangerous sensual atmosphere.","kind":"fusion"},{"code":"PFM0810","name":"Phantasmagoric","primIds":["P08","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Elaborate grotesque fantasy with bizarre creatures, impossible forms, or disturbing imagery.","kind":"fusion"},{"code":"PFM0811","name":"Eerie","primIds":["P08","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Unsettling, haunting, uncanny, quiet, mysterious, or suggestive that something is wrong; strange shadows, emptiness, haunting stillness, or subtle wrongness.","kind":"fusion"},{"code":"PFM0812","name":"Magical","primIds":["P08","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Enchanting, supernatural, wondrous, impossible, or governed by forces from a different reality; spells, glowing effects, impossible transformations, enchanted beings, or supernatural phenomena.","kind":"fusion"},{"code":"PFM0910","name":"Lewd","primIds":["P09","P10"],"matrixVersion":"0.0.0.0","aiMeaning":"Sexually explicit, vulgar, indecent, crude, suggestive, or offensively erotic; explicit exposure, crude sexual gestures, vulgar erotic jokes, or indecent posing.","kind":"fusion"},{"code":"PFM0911","name":"Exploitation","primIds":["P09","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Using another person, body, suffering, vulnerability, or taboo material as a means to gain advantage, attention, profit, gratification, or spectacle.","kind":"fusion"},{"code":"PFM0912","name":"Hedonism","primIds":["P09","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Pleasure, gratification, sensual enjoyment, luxury, appetite, or indulgence elevated into an atmosphere or lifestyle; feasting, partying, lavish consumption, sensual abundance, or decadent excess.","kind":"fusion"},{"code":"PFM1011","name":"Foreboding","primIds":["P10","P11"],"matrixVersion":"0.0.0.0","aiMeaning":"Uneasy expectation that danger, trouble, harm, or an unwanted event is approaching; ominous shadows, stormy skies, suspense, or approaching threat.","kind":"fusion"},{"code":"PFM1012","name":"Excess","primIds":["P10","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Visible overabundance, accumulation, possession, consumption, luxury, indulgence, or waste; hoards, stockpiles, piles of possessions, excessive quantities of food or goods, conspicuous wealth or status display, lavish comfort, pampering, extravagance, grabbing or claiming valuables, or visible overconsumption.","kind":"fusion"},{"code":"PFM1112","name":"Halloween","primIds":["P11","P12"],"matrixVersion":"0.0.0.0","aiMeaning":"Halloween imagery, costumes, decorations, parties, trick-or-treating, jack-o’-lanterns, haunted-house aesthetics, spooky festivities, and other clearly Halloween-specific scenes.","kind":"fusion"}]};

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

const responseValue = payload => {
  if (typeof payload === 'string') return payload;
  const direct = payload?.response ?? payload?.result?.response ?? payload?.output_text;
  if (direct !== undefined && direct !== null) return direct;
  const chat = payload?.choices?.[0]?.message?.content ?? payload?.choices?.[0]?.text;
  if (chat !== undefined && chat !== null) return chat;
  const responseOutput = Array.isArray(payload?.output)
    ? payload.output.flatMap(item=>Array.isArray(item?.content)?item.content:[]).map(item=>item?.text||item?.value||'').filter(Boolean).join('\n')
    : '';
  return responseOutput || '';
};

const capacity3040 = error => {
  const diagnostic=providerDiagnosticOf(error)||{};
  const values=[error?.code,error?.status,error?.cause?.code,error?.cause?.status,diagnostic.errorCode,diagnostic.errorStatus,diagnostic.status];
  if(values.some(value=>String(value)==='3040'))return true;
  const text=`${error?.message||''} ${error?.cause?.message||''} ${diagnostic.errorMessage||''}`.toLowerCase();
  return /(^|\D)3040(\D|$)|capacity temporarily exceeded|out of capacity|no more data centers to forward/.test(text);
};

const providerRoutingEnv = (env,body={}) => {
  const routed=Object.create(env||null);
  const incoming=body?.providerRouting&&typeof body.providerRouting==='object'?body.providerRouting:{};
  const incomingUntil=Number(incoming.fallbackUntil)||0;
  const useIncomingFallback=String(incoming.mode||'')==='fallback'&&incomingUntil>Date.now();
  Object.defineProperty(routed,'__GENREACTRIX_PROVIDER_ROUTE',{value:{
    mode:useIncomingFallback?'fallback':'primary',
    fallbackUntil:useIncomingFallback?incomingUntil:0,
    fallbackReason:useIncomingFallback?String(incoming.reason||'3040'):null,
    activatedThisRequest:false
  },enumerable:false,configurable:true});
  Object.defineProperty(routed,'__GENREACTRIX_PROVIDER_TRACE',{value:[],enumerable:false,configurable:true});
  return routed;
};

const providerTrace = env => Array.isArray(env?.__GENREACTRIX_PROVIDER_TRACE)?env.__GENREACTRIX_PROVIDER_TRACE:null;
const providerRoute = env => env?.__GENREACTRIX_PROVIDER_ROUTE&&typeof env.__GENREACTRIX_PROVIDER_ROUTE==='object'?env.__GENREACTRIX_PROVIDER_ROUTE:null;
const providerAttemptContext = env => env?.__GENREACTRIX_PROVIDER_ATTEMPT_CONTEXT&&typeof env.__GENREACTRIX_PROVIDER_ATTEMPT_CONTEXT==='object'?env.__GENREACTRIX_PROVIDER_ATTEMPT_CONTEXT:null;
const providerProgressSink = env => typeof env?.__GENREACTRIX_PROGRESS_SINK==='function'?env.__GENREACTRIX_PROGRESS_SINK:null;
const providerProgressEvent = (env,event) => { const sink=providerProgressSink(env); if(!sink)return; try{const provider=String(event?.provider||'').toLowerCase();sink({at:new Date().toISOString(),...(providerAttemptContext(env)||{}),...event,...(provider==='qwen'||provider.includes('qwen')?{thinkingMode:'disabled'}:{})});}catch{} };
const providerTraceEvent = (env,event) => { const trace=providerTrace(env); if(trace)trace.push({at:new Date().toISOString(),...(providerAttemptContext(env)||{}),...event}); };
const fallbackModelFor = env => String(env?.GENREACTRIX_FALLBACK_MODEL||DEFAULT_FALLBACK_MODEL).trim()||DEFAULT_FALLBACK_MODEL;
const mistralDescriptionModelFor = env => String(env?.MISTRAL_DESCRIPTION_MODEL||DEFAULT_MISTRAL_DESCRIPTION_MODEL).trim()||DEFAULT_MISTRAL_DESCRIPTION_MODEL;
const qwenThemeModelFor = env => String(env?.GENREACTRIX_QWEN_THEME_MODEL||DEFAULT_QWEN_THEME_MODEL).trim()||DEFAULT_QWEN_THEME_MODEL;
const aiGatewayIdFor = env => String(env?.GENREACTRIX_AI_GATEWAY_ID||DEFAULT_AI_GATEWAY_ID).trim()||DEFAULT_AI_GATEWAY_ID;
const effectiveProviderModel = (env,primaryModel) => {
  const models=[...new Set((providerTrace(env)||[]).filter(row=>row.outcome==='success').map(row=>row.model).filter(Boolean))];
  return models.length===1?models[0]:(models.length>1?'mixed':primaryModel);
};

const providerRoutingSnapshot = (env,primaryModel=null) => {
  const route=providerRoute(env)||{mode:'primary',fallbackUntil:0,fallbackReason:null,activatedThisRequest:false};
  const trace=providerTrace(env)||[];
  const successes=trace.filter(row=>row.outcome==='success');
  const successfulModels=[...new Set(successes.map(row=>row.model).filter(Boolean))];
  const successfulProviders=[...new Set(successes.map(row=>row.provider).filter(Boolean))];
  return {
    mode:route.mode==='fallback'&&Number(route.fallbackUntil)>Date.now()?'fallback':'primary',
    primaryModel:primaryModel||null,
    fallbackModel:fallbackModelFor(env),
    fallbackUntil:Number(route.fallbackUntil)||0,
    fallbackReason:route.fallbackReason||null,
    activatedThisRequest:Boolean(route.activatedThisRequest),
    cooldownMinutes:15,
    providerCyclePolicy:typeof THEME_PROVIDER_CYCLE_POLICY==='string'?THEME_PROVIDER_CYCLE_POLICY:'mistral-gpt41mini-qwen-one-attempt-per-cycle-v1',
    themeWholeRunPolicy:typeof THEME_WHOLE_RUN_POLICY==='string'?THEME_WHOLE_RUN_POLICY:'mistral-primary-gpt41mini-secondary-qwen-third-whole-run-v1',
    themeProviderRoster:typeof themeProviderRoster==='function'?themeProviderRoster(env,primaryModel):[],
    successfulModels,
    successfulProviders,
    calls:trace.map(row=>({...row}))
  };
};

const providerReadinessProbe = async (env,{timeoutMs=12000}={}) => {
  const runWorkers=async({provider,model,request,options=null})=>{
    if(!env.AI?.run)return{ready:false,status:'not-configured',provider,model,error:'Workers AI binding AI is not configured'};
    try{
      await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error(`Provider readiness probe timed out after ${Math.round(timeoutMs/1000)}s`)),timeoutMs);const invocation=options?env.AI.run(model,request,options):env.AI.run(model,request);Promise.resolve(invocation).then(value=>{clearTimeout(timer);resolve(value)},error=>{clearTimeout(timer);reject(error)})});
      return{ready:true,status:'ready',provider,model};
    }catch(error){return{ready:false,status:capacity3040(error)?'capacity-unavailable':'failed',provider,model,error:String(error?.message||error).replace(/\s+/g,' ').trim().slice(0,500),errorCode:capacity3040(error)?'3040':null};}
  };
  const runMistral=async()=>{
    const provider='mistral-direct',model=mistralDescriptionModelFor(env),apiKey=String(env?.MISTRAL_API_KEY||'').trim();
    if(!apiKey)return{ready:false,status:'not-configured',provider,model,error:'MISTRAL_API_KEY is not configured'};
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMs);
    try{
      const response=await fetch('https://api.mistral.ai/v1/chat/completions',{
        method:'POST',
        headers:{'content-type':'application/json','authorization':`Bearer ${apiKey}`},
        body:JSON.stringify({model,messages:[{role:'user',content:'Reply with READY only.'}],max_tokens:8,temperature:0}),
        signal:controller.signal
      });
      const raw=await response.text();let payload=null;try{payload=raw?JSON.parse(raw):null}catch{}
      if(!response.ok){const detail=String(payload?.message||payload?.error?.message||raw||`HTTP ${response.status}`).replace(/\s+/g,' ').trim().slice(0,500);return{ready:false,status:'failed',provider,model,error:detail,httpStatus:response.status};}
      const answer=mistralDescriptionText(payload);
      if(!answer)return{ready:false,status:'failed',provider,model,error:'Mistral readiness probe returned no text'};
      return{ready:true,status:'ready',provider,model};
    }catch(error){return{ready:false,status:error?.name==='AbortError'?'timeout':'failed',provider,model,error:String(error?.name==='AbortError'?`Mistral readiness probe timed out after ${Math.round(timeoutMs/1000)}s`:error?.message||error).replace(/\s+/g,' ').trim().slice(0,500)};}
    finally{clearTimeout(timer);}
  };
  const fallbackModel=fallbackModelFor(env),qwenModel=qwenThemeModelFor(env),gatewayId=aiGatewayIdFor(env);
  const primary=await runMistral();
  const secondary=await runWorkers({provider:'openai-via-cloudflare-ai-gateway',model:fallbackModel,request:{messages:[{role:'user',content:'Reply with READY only.'}],max_tokens:8,temperature:0},options:{gateway:{id:gatewayId}}});
  secondary.gatewayId=gatewayId;
  const third=await runWorkers({provider:'cloudflare-workers-ai-qwen',model:qwenModel,request:{messages:[{role:'user',content:'Reply with READY only.'}],max_tokens:8,temperature:0,enable_thinking:false}});
  third.thinkingMode='disabled';
  // Compatibility aliases remain for the existing readiness UI while Theme roles are explicit.
  return{primary,secondary,third,fallback:secondary,mistral:primary,qwen:third,themeProviderOrder:themeProviderRoster(env,env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL),probedAt:new Date().toISOString(),cooldownStateChanged:false};
};

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

const normalizedContentType = response => String(response?.headers?.get?.('content-type')||'').split(';')[0].trim().toLowerCase();
const safeHttpsUrl = value => { try { const url=new URL(String(value||'')); return url.protocol==='https:'&&url.href.length<=2000?url:null; } catch { return null; } };
const decodeHtmlEntities = value => String(value||'').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&#x([0-9a-f]+);/gi,(_,h)=>String.fromCodePoint(parseInt(h,16))).replace(/&#([0-9]+);/g,(_,d)=>String.fromCodePoint(parseInt(d,10)));
const absoluteHttpsCandidate = (value,base) => { try { const url=new URL(decodeHtmlEntities(String(value||'').trim()),base); return url.protocol==='https:'&&url.href.length<=2000?url.href:null; } catch { return null; } };
const commonsFileTitle = value => { const url=safeHttpsUrl(value); if(!url||url.hostname.toLowerCase()!=='commons.wikimedia.org'||!url.pathname.startsWith('/wiki/File:'))return null; try{return decodeURIComponent(url.pathname.slice('/wiki/'.length)).replace(/_/g,' ')}catch{return url.pathname.slice('/wiki/'.length).replace(/_/g,' ')} };
const resolveCommonsOriginalUrl = async value => {
  const title=commonsFileTitle(value);if(!title)return null;
  const fallback=`https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(title.replace(/^File:/i,'').replace(/ /g,'_'))}`;
  try{const api=new URL('https://commons.wikimedia.org/w/api.php');api.searchParams.set('action','query');api.searchParams.set('format','json');api.searchParams.set('formatversion','2');api.searchParams.set('prop','imageinfo');api.searchParams.set('iiprop','url');api.searchParams.set('iiurlwidth','2048');api.searchParams.set('titles',title);
    const response=await fetch(api.href,{headers:{accept:'application/json','user-agent':'Genreactrix/0.9 (+https://gobo718.github.io/)'}});if(response.ok){const payload=await response.json().catch(()=>null),info=payload?.query?.pages?.[0]?.imageinfo?.[0],resolved=info?.thumburl||info?.url,href=absoluteHttpsCandidate(resolved,'https://commons.wikimedia.org/');if(href)return href}}catch{}
  return fallback;
};
const htmlAttribute = (tag,name) => { const match=String(tag||'').match(new RegExp(`\\b${name}\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))`,'i'));return match?(match[1]??match[2]??match[3]??''):''; };
const pageImageCandidates = (html,base) => {
  const text=String(html||''),out=[],seen=new Set(),push=value=>{const href=absoluteHttpsCandidate(value,base);if(href&&!seen.has(href)){seen.add(href);out.push(href)}};
  for(const tag of text.match(/<meta\b[^>]*>/gi)||[]){const key=String(htmlAttribute(tag,'property')||htmlAttribute(tag,'name')).toLowerCase();if(['og:image','og:image:url','twitter:image','twitter:image:src'].includes(key))push(htmlAttribute(tag,'content'))}
  for(const tag of text.match(/<link\b[^>]*>/gi)||[]){const rel=String(htmlAttribute(tag,'rel')).toLowerCase(),as=String(htmlAttribute(tag,'as')).toLowerCase();if(rel.split(/\s+/).includes('image_src')||(rel.split(/\s+/).includes('preload')&&as==='image'))push(htmlAttribute(tag,'href'))}
  for(const tag of text.match(/<img\b[^>]*>/gi)||[]){push(htmlAttribute(tag,'src')||htmlAttribute(tag,'data-src'));if(out.length>=12)break}return out.slice(0,12);
};
const fetchImageResponse = async originalUrl => {
  const source=safeHttpsUrl(originalUrl);if(!source)throw new Error('imageUrl must be HTTPS');
  const commons=await resolveCommonsOriginalUrl(source.href).catch(()=>null);const firstUrl=commons||source.href;
  let response=await fetch(firstUrl,{redirect:'follow',headers:{accept:'image/*, text/html;q=0.9, */*;q=0.1','user-agent':'Genreactrix/0.9 (+https://gobo718.github.io/)'}});
  if(!response.ok)throw new Error(`Could not retrieve image (${response.status})`);let type=normalizedContentType(response);if(type.startsWith('image/'))return response;
  if(type!=='text/html'&&type!=='application/xhtml+xml')throw new Error('URL did not return an image');
  const length=Number(response.headers.get('content-length')||0);if(length>2_000_000)throw new Error('Image source page exceeds 2 MB');const html=(await response.text()).slice(0,2_000_000),base=response.url||source.href,candidates=pageImageCandidates(html,base);
  for(const candidate of candidates){try{const candidateResponse=await fetch(candidate,{redirect:'follow',headers:{accept:'image/*','user-agent':'Genreactrix/0.9 (+https://gobo718.github.io/)'}});if(candidateResponse.ok&&normalizedContentType(candidateResponse).startsWith('image/'))return candidateResponse}catch{}}
  throw new Error('Could not resolve an image from the source page');
};

const fetchBytes = async url => {
  const response = await fetchImageResponse(url);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!bytes.length) throw new Error('Image was empty');
  if (bytes.length > 6_000_000) throw new Error('Image exceeds 6 MB');
  return tagImageMime(Array.from(bytes),normalizedContentType(response));
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
  if (!Array.isArray(registry.primitives) || registry.primitives.length !== registry.codingRules.primCount) throw new Error(`PrimFusion registry must contain ${registry.codingRules.primCount} Prims`);
  if (!Array.isArray(registry.fusions) || registry.fusions.length !== registry.codingRules.fusionCount) throw new Error(`PrimFusion registry must contain ${registry.codingRules.fusionCount} fusions`);
  if (!Array.isArray(registry.themeChoices) || registry.themeChoices.length !== registry.codingRules.themeChoiceCount) throw new Error(`PrimFusion registry must contain ${registry.codingRules.themeChoiceCount} total Theme choices`);
  if (!Array.isArray(registry.aiThemeChoices) || registry.aiThemeChoices.length !== registry.codingRules.aiThemeChoiceCount) throw new Error(`PrimFusion registry must contain ${registry.codingRules.aiThemeChoiceCount} AI Theme choices`);
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
    ? `Return ONLY this compact plain-text protocol; do not return JSON, Markdown, labels, percentages, or commentary:\n${ids.map(id=>`${id}|<number from 0 to 100>`).join('\n')}\nRANKING|<all active P-codes strongest-to-weakest, comma-separated, each exactly once>${requireNotes?`\nNOTE|<rank-1 P-code>|<brief ${noteRule} reason>\nNOTE|<rank-2 P-code>|<brief ${noteRule} reason>\nNOTE|<rank-3 P-code>|<brief ${noteRule} reason>\nNOTE|<rank-4 P-code>|<brief ${noteRule} reason>`:''}\nEvery active Prim line listed above is mandatory and its second field must be a bare numeric value.`
    : `Return one JSON object matching the structure below.\nThe object must contain:\n- weights: every active Prim ID listed above, each as a JSON number from 0 to 100\n- ranking: all active P-codes strongest-to-weakest, each exactly once\n- notes: exactly four objects for ranks 1-4, each with id and a brief ${noteRule} reason\nDo not put numbers in percent strings. Do not wrap the JSON in Markdown or code fences.`;

  return `You are performing Genreactrix Reaction Analysis.

${evidenceRule}
Choose among all active Genreactrix reaction buttons at the same time.
The P-codes are identifiers only. Reaction Analysis is independent from Theme/PrimFusion analysis.

Your job is semantic comparison, NOT arithmetic and NOT independent confidence ratings.
For every reaction, assign a NONNEGATIVE RELATIVE WEIGHT from 0 to 100. The weights do NOT need to total 100 or any other number. A larger weight means that reaction deserves a larger share of the viewer's overall reaction field compared with the other active reactions.

Rank ALL active reactions from strongest to weakest. Rank #1 is the primary reaction. Rank #2 is the required secondary reaction candidate: identify the best-supported alternative even when it is much weaker than the primary. Do not stop after finding one obvious reaction.

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
        minItems:ids.length,
        maxItems:ids.length,
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
    `Reaction combined-evidence response did not provide one complete ${ids.length}-Prim ranking`,
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
  if (distinctWeights.size === 1) throw new Error(`Reaction assessment was uninformative because all ${ids.length} relative weights were identical`);

  let ranking = Array.isArray(raw.ranking) ? raw.ranking.map(String) : [];
  let rankingSource = 'ai';
  const validRanking = ranking.length === ids.length && new Set(ranking).size === ids.length && !ranking.some(id=>!ids.includes(id));
  const rankingContradicts = validRanking && ranking.some((id,i)=>i>0 && weights[id] > weights[ranking[i-1]] + 1e-9);
  if (!validRanking || rankingContradicts){
    // Formatting mistakes in the ranking must not discard an otherwise complete active-Prim semantic assessment.
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

function invalidReactionWeightIds(raw){
  const ids=PRIMFUSION_REGISTRY.primitives.map(p=>p.id),bad=[];
  for(const id of ids){const value=Number(raw?.weights?.[id]);if(!Number.isFinite(value)||value<0||value>100)bad.push(id);}
  return bad;
}

function reactionWeightRepairPrompt(raw,missingIds,evidence={}){
  const byId=new Map(PRIMFUSION_REGISTRY.primitives.map(p=>[p.id,p]));
  const accepted=PRIMFUSION_REGISTRY.primitives.map(p=>p.id).filter(id=>!missingIds.includes(id)).map(id=>`${id}=${Number(raw?.weights?.[id])}`).join(', ');
  const missing=missingIds.map(id=>{const p=byId.get(id);return `${id} — ${p?.name||id}: ${String(p?.aiMeaning||'').trim()}`}).join('\n');
  const description=String(evidence?.descriptionContext||'').trim();
  const evidenceRule=evidence?.useImage===false
    ? `Use ONLY the supplied AI Description evidence below. Do not invent visual evidence beyond it.`
    : description
      ? `Use the image and supplied AI Description together as the same evidence sources used for the original Reaction Analysis.`
      : `Use the image as the same sole evidence source used for the original Reaction Analysis.`;
  const descriptionBlock=description?`\n\nAI DESCRIPTION EVIDENCE:\n${description}`:'';
  return `You are repairing ONLY malformed or missing numeric Reaction weight fields from an otherwise completed Genreactrix Reaction Analysis.\n\n${evidenceRule}\n\nThe accepted weights below are IMMUTABLE. Do not revise, recalculate, or return them:\n${accepted||'None'}\n\nRepair only these P-codes:\n${missing}\n\nChoose each missing relative weight from 0 to 100 so it fits coherently beside the immutable accepted weights. The active Prim weights do not need to total 100. Do not change ranking, notes, or any accepted weight.${descriptionBlock}\n\nOUTPUT FORMAT — REQUIRED:\n${missingIds.map(id=>`${id}|<number from 0 to 100>`).join('\n')}\nReturn exactly ${missingIds.length} line${missingIds.length===1?'':'s'} and nothing else.`;
}

function parseReactionWeightRepair(raw,missingIds){
  const wanted=new Set(missingIds),found={};
  const text=String(raw||'').replace(/```(?:text|json)?/gi,'').trim();
  const objectCandidate=reactionObjectCandidate(text);
  if(objectCandidate){const source=objectCandidate.weights||objectCandidate;for(const id of missingIds){const direct=source?.[id],nested=direct&&typeof direct==='object'?(direct.relative_weight??direct.relativeWeight??direct.weight??direct.score??direct.value??direct.percentage??direct.percent):direct;const n=Number(nested);if(Number.isFinite(n)&&n>=0&&n<=100)found[id]=n;}}
  for(const line of text.split(/\r?\n/)){
    const m=line.trim().replace(/^[-*]\s*/,'').match(/^(P\d{2})\s*[|:=,-]\s*(-?\d+(?:\.\d+)?)\s*%?\s*$/i);
    if(!m)continue;const id=m[1].toUpperCase(),n=Number(m[2]);if(wanted.has(id)&&Number.isFinite(n)&&n>=0&&n<=100)found[id]=n;
  }
  const missing=missingIds.filter(id=>!Object.prototype.hasOwnProperty.call(found,id));
  if(missing.length)throw diagnosticError(`Reaction targeted weight repair was missing numeric values for ${missing.join(', ')}`,{phase:'reaction-weight-targeted-repair-parse',missingPrimCodes:missing,responsePreview:text.slice(0,1200)});
  return found;
}

async function repairReactionWeightsIfNeeded(env,reactionModel,image,behavior,evidence,rawAssessment){
  let assessment=rawAssessment&&typeof rawAssessment==='object'?structuredClone(rawAssessment):rawAssessment;
  let missingIds=invalidReactionWeightIds(assessment);
  if(!missingIds.length)return assessment;
  let lastError=null;
  for(let attempt=1;attempt<=2;attempt++){
    const prompt=reactionWeightRepairPrompt(assessment,missingIds,evidence)+(attempt===2?`\n\nRECOVERY: The previous repair response was malformed. Return only the requested P-code|number lines.`:'');
    try{
      const useImage=evidence?.useImage!==false,description=String(evidence?.descriptionContext||'').trim(),combined=useImage&&Boolean(description);
      const raw=await runStructured(env,reactionModel,useImage?image:null,prompt,null,700,'text',{behavior,reactionEvidenceMode:'targeted-weight-repair',multimodalMessages:combined,temperature:0});
      const repaired=parseReactionWeightRepair(raw,missingIds);
      assessment={...(assessment||{}),weights:{...((assessment&&assessment.weights)||{}),...repaired}};
      missingIds=invalidReactionWeightIds(assessment);
      if(!missingIds.length)return assessment;
    }catch(error){lastError=error;}
  }
  throw diagnosticError(lastError?.message||`Reaction targeted weight repair failed for ${missingIds.join(', ')}`,{phase:'reaction-weight-targeted-repair',missingPrimCodes:missingIds});
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
  if (displayTotal !== 100 || rawTotal !== 100 + ids.length) throw new Error('Worker reaction apportionment invariant failed');

  const primaryId = assessment.ranking[0], secondaryId = assessment.ranking[1];
  const pair = [primaryId,secondaryId].sort((a,b)=>Number(a.slice(1))-Number(b.slice(1)));
  const primFusionCode = `PFM${pair[0].slice(1)}${pair[1].slice(1)}`;
  const byId = new Map(PRIMFUSION_REGISTRY.primitives.map(p=>[p.id,p]));
  return {
    display,
    diagnostics:{
      scoringMethod:`ai-relative-weights-worker-hamilton-100-plus-${ids.length}-baseline`,
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
      },
      providerCycle:assessment.providerCycle||null
    }
  };
}

function reactionRetryInstruction(error,{lineProtocol=false,requireNotes=false}={}){
  const formatRule=lineProtocol
    ? `Return the compact line protocol exactly: one mandatory numeric weight line for every active Prim, then one RANKING line${requireNotes?', then four NOTE lines for ranks 1-4':''}. Do not return JSON.`
    : `Return the required JSON object with all active Prim numeric relative weights, a complete strongest-to-weakest ranking with no duplicates, and four non-empty notes for ranks 1-4.`;
  return `\n\nYour previous response was rejected by the Reaction effort/format validator: ${String(error?.message||error||'unknown error').slice(0,500)}\nReassess the whole active-reaction field from scratch. ${formatRule} Do not perform percentage-total arithmetic.`;
}

async function runReactionAssessment(env,model,image,behavior='analyze',evidence={}){
  let lastError=null,lastRaw='';
  const attempts=[];
  const stageStartedMs=Date.now();
  const useImage=evidence?.useImage!==false;
  const descriptionContext=String(evidence?.descriptionContext||'').trim();
  const combinedEvidence=useImage&&Boolean(descriptionContext);
  const evidenceMode=useImage?(combinedEvidence?'image+description':'image'):'description';
  const requireNotes=evidence?.requireNotes===true;

  // Preserve the established mode-specific primary model choice. Provider-cycle
  // routing changes only WHICH provider gets the next whole-assessment attempt;
  // it does not alter Reaction semantics, weighting, allocation, or evidence.
  const reactionModel=combinedEvidence
    ?(env.WORKERS_AI_REACTION_MODEL||DEFAULT_REACTION_MODEL)
    :useImage
      ?(env.WORKERS_AI_REACTION_VISION_MODEL||model||DEFAULT_MODEL)
      :(env.WORKERS_AI_REACTION_MODEL||DEFAULT_REACTION_MODEL);

  for(let cycle=1;cycle<=2;cycle++){
    const cycleRecoveryError=lastError;
    for(const provider of THEME_PROVIDER_CYCLE_ORDER){
      const attemptStartedMs=Date.now();
      const attemptEnv=providerCycleAttemptEnv(env,provider,'reactions',cycle);
      providerProgressEvent(attemptEnv,{event:'provider-attempt-start',stage:'reactions',cycle,provider,providerRole:themeProviderRole(provider),model:themeProviderModel(env,provider,reactionModel),state:'running'});
      const lineProtocol=provider==='mistral';
      const prompt=reactionPrompt({...evidence,lineProtocol,requireNotes})+
        (cycle===1?'':reactionRetryInstruction(cycleRecoveryError,{lineProtocol,requireNotes}));
      lastRaw='';
      try{
        let assessment;
        const temperature=cycle===1?(combinedEvidence?(behavior==='reanalyze'?0.28:0.08):(behavior==='reanalyze'?0.35:0.1)):0;

        if(provider==='mistral'){
          // Mistral is a text-output provider. The compact protocol carries the
          // same Reaction weights/ranking/notes without requiring guided JSON.
          lastRaw=String(await runStructured(
            attemptEnv,reactionModel,useImage?image:null,prompt,null,2600,'text',
            {behavior,reactionEvidenceMode:evidenceMode,temperature}
          ));
          assessment=parseReactionText(lastRaw);
        }else if(combinedEvidence){
          const structured=await runStructured(
            attemptEnv,reactionModel,image,prompt,reactionSchema(),2300,'guided_json',
            {behavior,reactionEvidenceMode:evidenceMode,multimodalMessages:true,temperature}
          );
          try{lastRaw=JSON.stringify(structured).slice(0,3000);}catch{lastRaw='[unserializable reaction response]';}
          assessment=structured;
        }else if(useImage){
          lastRaw=String(await runStructured(
            attemptEnv,reactionModel,image,prompt,null,2600,'text',
            {behavior,reactionEvidenceMode:evidenceMode,temperature}
          ));
          assessment=parseReactionText(lastRaw);
        }else{
          const structured=await runStructured(
            attemptEnv,reactionModel,null,prompt,reactionSchema(),2100,'guided_json',
            {behavior,reactionEvidenceMode:evidenceMode,temperature}
          );
          try{lastRaw=JSON.stringify(structured).slice(0,3000);}catch{lastRaw='[unserializable reaction response]';}
          assessment=structured;
        }

        const repaired=await repairReactionWeightsIfNeeded(attemptEnv,reactionModel,image,behavior,evidence,assessment);
        const validated=validateReactionAssessment(repaired,{requireNotes});
        const attemptEndedMs=Date.now();
        mergeProviderTrace(env,attemptEnv,'provider-cycle:reactions');
        attempts.push(providerCycleSuccessRow({cycle,provider,startedMs:attemptStartedMs,endedMs:attemptEndedMs}));
        const providerCycle=providerCycleRecoverySummary({stage:'reactions',attempts,winningCycle:cycle,winningProvider:provider,startedMs:stageStartedMs,endedMs:attemptEndedMs,maxCycles:2});
        providerTraceEvent(env,{provider:'provider-cycle-router',model:null,outcome:'stage-success',providerCyclePolicy:THEME_PROVIDER_CYCLE_POLICY,providerCycleStage:'reactions',providerCycleNumber:cycle,providerCycleProvider:provider,durationMs:timingDurationMs(attemptStartedMs,attemptEndedMs)});
        providerProgressEvent(env,{event:'provider-attempt-success',stage:'reactions',cycle,provider,providerRole:themeProviderRole(provider),model:themeProviderModel(env,provider,reactionModel),state:'success',durationMs:timingDurationMs(attemptStartedMs,attemptEndedMs)});
        return{...validated,providerCycle};
      }catch(error){
        const attemptEndedMs=Date.now();
        mergeProviderTrace(env,attemptEnv,'provider-cycle:reactions');
        lastError=error;
        const failure=providerCycleFailureRow(error,{cycle,provider,raw:lastRaw,startedMs:attemptStartedMs,endedMs:attemptEndedMs});
        attempts.push(failure);
        providerTraceEvent(env,{provider:'provider-cycle-router',model:null,outcome:'stage-failure',providerCyclePolicy:THEME_PROVIDER_CYCLE_POLICY,providerCycleStage:'reactions',providerCycleNumber:cycle,providerCycleProvider:provider,failurePhase:failure.failurePhase,failureKind:failure.failureKind,errorMessage:failure.errorMessage,durationMs:failure.durationMs});
        providerProgressEvent(env,{event:'provider-attempt-failure',stage:'reactions',cycle,provider,providerRole:themeProviderRole(provider),model:themeProviderModel(env,provider,reactionModel),state:'failure',durationMs:failure.durationMs,failurePhase:failure.failurePhase,failureKind:failure.failureKind,errorMessage:failure.errorMessage});
      }
    }
  }

  throw diagnosticError(
    lastError?.message||'Reaction Analysis provider cycle exhausted',
    {
      phase:'provider-cycle-reactions-exhausted',
      failureKind:'provider-cycle-exhausted',
      freshRequestRecommended:true,
      model:reactionModel,
      evidenceMode,
      providerCycle:providerCycleRecoverySummary({stage:'reactions',attempts,winningCycle:null,winningProvider:null,startedMs:stageStartedMs,endedMs:Date.now(),maxCycles:2}),
      responsePreview:String(lastRaw||'').slice(0,1200),
      errorMessage:String(lastError?.message||lastError||'unknown').slice(0,1200)
    }
  );
}

async function runReactionAllocation(env,model,image,behavior='analyze',evidence={}){
  const assessment = await runReactionAssessment(env,model,image,behavior,evidence);
  return allocateReactionPool(assessment);
}

const THEME_SEMANTIC_EVIDENCE_RULES = `SEMANTIC EVIDENCE DISCIPLINE:
- Cue ≠ meaning. The mere presence of an object, color, pose, creature, room state, or other cue is not Theme evidence unless that cue actually carries the Theme's meaning in context.
- Modifiers matter. Do not silently change what a word modifies: visual quantity is not excessive sweetness; generic clutter alone is not sparseness, grime, hoarding, carnival display, or distorted reality; an ordinary pose is not automatically comic, eccentric, helpless, or romantic.
- Do not manufacture evidence from interpretation. A conclusion such as “surreal,” “liminal,” “zany,” “horror,” or “medicated” cannot be recycled as proof of the conditions that supposedly justify it.
- Keep ambiguous cues ambiguous until independent evidence supports a more specific interpretation. Closed eyes can mean rest; a distant gaze can have many causes; a still image can support persistence only through visible accumulated consequences or other concrete evidence.
- Identify the actual semantic route that earns a match. If a broad definition has several routes, name the route supported by the image instead of inventing a different one.
- Confidence must track demonstrated evidence. 100 means exceptionally complete and essentially unmistakable, not merely plausible. A forced top-three choice may legitimately have modest confidence if it is only the closest available Theme.`;


const THEME_HUMAN_FIT_SELECTION_RULES = `HUMAN-FIT RANKING — NO EMOTIONAL-SALIENCE BONUS:
- Your job is to choose the three Themes an ordinary reasonably engaged human would most naturally select for THIS image from the available vocabulary. The goal is closest human-perceived semantic fit, not the most interesting answer.
- Emotional intensity, theatricality, evocative quality, attention-grabbing quality, drama, expressiveness, aesthetic appeal, novelty, or how interesting a Theme is to discuss MUST NOT give that Theme any ranking advantage by itself.
- A boring, neutral, mundane, ordinary, low-emotion, or visually unremarkable Theme MUST outrank a richer or more emotional Theme whenever the boring Theme is the closer fit. Neutral Themes are first-class answers, not fallbacks.
- Mood, humor, beauty, tension, nostalgia, warmth, silliness, sweetness, fear, romance, and other affective meanings are valid only when the image contains evidence that actually earns that response. Preserve genuine human theatricality when it is present; do not manufacture it to make the result more engaging.
- Do not convert generic positive/evaluative language into Theme evidence. “Visually appealing,” “interesting,” “striking,” “compelling,” “evocative,” “thought-provoking,” “well-balanced,” “elegant,” or “beautifully composed” do not by themselves imply Goofy, Cozy, Saccharine, Dreamy, Nostalgia, Poignant, Romance, or any other affective Theme.
- Do not make these substitutions without independent semantic evidence: simplicity/minimalism → playfulness; irregularity/random arrangement → silliness; visual interest → Goofy; neutral stillness → Cozy; generic pleasantness → sweetness; reflective prose → Nostalgia/Poignant; aesthetic polish → emotional significance.
- Before finalizing, ask: “Would I still choose this Theme if it were less emotional, less vivid, and less interesting to talk about?” If the answer is no and a closer neutral Theme exists, choose the closer Theme.
- A merely defensible Theme loses to a materially closer Theme. Ranking and confidence are separate: the second- or third-closest Theme may be weak and should remain low-confidence.`;

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
  const failsafe=context ? `\n\nTHEME FAILSAFE CONTEXT:\nUse the existing AI freeform analysis below only as secondary guidance together with the image. The image remains authoritative. Do not treat generic evaluative prose (for example: visually appealing, striking, compelling, evocative, thought-provoking, elegant, interesting, or well-balanced) as semantic evidence for an affective Theme. Verify every Theme meaning against what the image actually earns.\n\n${context}` : '';

  return `You are performing Genreactrix Theme Analysis.

PrimFusion Matrix version: ${matrixVersion()}.

Choose exactly three DIFFERENT Theme selections that best fit the image.
Choose from the current PrimFusion fusion vocabulary below.
Evaluate the semantic meaning of the Theme names from the image itself.
Do not use reaction-analysis scores to make Theme choices.
The codes are identifiers only.

A Theme is a semantic/thematic classification. Do not use a visual medium, production format, or art technique as a Theme merely because it is visible. Those observations belong in the freeform AI Description.

${THEME_SEMANTIC_EVIDENCE_RULES}

${THEME_HUMAN_FIT_SELECTION_RULES}

The exactly-three rule is mandatory. If fewer than three Themes are strong matches, still return the three closest valid PrimFusion Themes, but lower confidence instead of fabricating evidence or inflating a weak fit.

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



const THEME_DECISION_CANDIDATE_LIMIT = 12;
const THEME_DECISION_AUDIT_BATCH_SIZE = 4;

function themeDecisionEvidencePrompt(analysisContext=""){
  const context=String(analysisContext||'').trim().slice(0,6000);
  const contextBlock=context?`\n\nSECONDARY AI DESCRIPTION CONTEXT:\n${context}\n\nThe secondary context may contribute only concrete facts that are actually consistent with the image. Omit generic praise, mood inflation, and semantic conclusions.`:'';
  const outputExample=context
    ?'E1|image|one concrete fact\nE2|image|one concrete fact\nE3|analysis|one concrete fact explicitly supplied by the secondary context'
    :'E1|image|one concrete fact\nE2|image|one concrete fact\nE3|image|one concrete fact';
  const sourceRule=context
    ?'Source must be image or analysis.'
    :'Source must be image only; do not emit analysis-sourced lines because no secondary context was supplied.';
  return `GENREACTRIX THEME DECISION — STAGE 1: LITERAL EVIDENCE.\n\nDo NOT choose, score, rank, name, or discuss any Genreactrix Theme. Do NOT mention PFM codes. Do NOT infer an emotional response merely because an image is interesting, aesthetically pleasing, evocative, dramatic, simple, minimal, irregular, quiet, or visually appealing.\n\nProduce a compact ledger of concrete evidence that exists BEFORE Theme selection. Record atomic observable facts: subjects, objects, materials, colors, shapes, count, arrangement, actions, expressions, setting, damage, text, spatial relationships, and other directly visible details. If secondary AI Description context is supplied, it can contribute only concrete facts that agree with the image.\n\nExclude moods, metaphors, analogies, intentions, personalities, emotional qualities, generic evaluative praise, and thematic interpretations. Specifically omit language such as visually appealing, striking, compelling, evocative, thought-provoking, elegant, interesting, beautiful, well-balanced, cozy, playful, silly, sweet, nostalgic, poignant, romantic, eerie, or dramatic unless the word itself is literally visible text in the image.\n\nThe image is authoritative. Keep each ledger item to one fact. Aim for 6–12 useful facts.${contextBlock}\n\nOUTPUT FORMAT — REQUIRED:\n${outputExample}\n\nUse sequential E-numbers. ${sourceRule} Return only ledger lines.`;
}

function parseThemeDecisionEvidence(raw,{allowAnalysis=false}={}){
  const text=String(raw||'').replace(/\r/g,'').trim();
  if(!text)throw new Error('Theme evidence pass returned an empty response.');
  const rows=[];
  for(const line of text.split('\n')){
    const cleaned=line.replace(/^\s*[-*•]+\s*/,'').trim().replace(/^\|\s*/,'').replace(/\s*\|$/,'');
    const m=cleaned.match(/^E(\d{1,2})\s*\|\s*(image|analysis)\s*\|\s*(.+)$/i);
    if(!m)continue;
    const source=m[2].toLowerCase();
    if(source==='analysis'&&!allowAnalysis)continue;
    let fact=String(m[3]||'').replace(/\*{1,2}/g,'').trim().replace(/\s+/g,' ');
    if(!fact||/\bPFM\d{4}\b/i.test(fact))continue;
    rows.push({source,fact:fact.slice(0,420)});
    if(rows.length>=16)break;
  }
  if(rows.length<3)throw new Error(`Theme evidence pass produced only ${rows.length} usable facts; at least 3 are required.`);
  return rows.map((row,index)=>({id:`E${index+1}`,source:row.source,fact:row.fact}));
}

function themeDecisionEvidenceText(ledger){return (ledger||[]).map(row=>`${row.id}|${row.source}|${row.fact}`).join('\n')}

async function runThemeDecisionEvidencePass(env,model,image,behavior,analysisContext=""){
  let lastError=null;
  const allowAnalysis=Boolean(String(analysisContext||'').trim());
  for(let attempt=1;attempt<=2;attempt++){
    try{
      const recovery=attempt===2
        ?(allowAnalysis?'\n\nRECOVERY: Return only sequential E#|image|fact or E#|analysis|fact lines. No classification.':'\n\nRECOVERY: Return only sequential E#|image|fact lines. No classification. Do not emit analysis-sourced lines because no secondary context was supplied.')
        :'';
      const prompt=themeDecisionEvidencePrompt(analysisContext)+recovery;
      const raw=await runStructured(env,model,image,prompt,null,1400,'text',{behavior,themeDecisionEvidencePass:true,temperature:0});
      return parseThemeDecisionEvidence(raw,{allowAnalysis});
    }catch(error){lastError=error;}
  }
  throw diagnosticError(lastError?.message||'Theme evidence pass failed.',{phase:'theme-decision-literal-evidence'});
}

function themeDecisionCatalog(codes=null){
  const allow=codes?new Set(codes):null;
  return PRIMFUSION_REGISTRY.aiThemeChoices.filter(row=>!allow||allow.has(row.code)).map(row=>`${row.code} — ${row.name}: ${row.aiMeaning}`).join('\n');
}

function themeDecisionCandidatePrompt(ledger,{excludeCodes=[]}={}){
  const excluded=new Set((excludeCodes||[]).map(code=>String(code||'').toUpperCase()));
  const catalog=PRIMFUSION_REGISTRY.aiThemeChoices.filter(row=>!excluded.has(row.code)).map(row=>`${row.code} — ${row.name}: ${row.aiMeaning}`).join('\n');
  return `GENREACTRIX THEME DECISION — STAGE 2: BROAD CANDIDATE DISCOVERY.\n\nThis is NOT the final ranking. Using ONLY the literal evidence ledger, create a broad shortlist of up to ${THEME_DECISION_CANDIDATE_LIMIT} materially plausible PrimFusion Themes. The shortlist must be diverse enough to include literal, neutral, boring, ordinary, low-emotion, and low-stimulation interpretations whenever the evidence permits them. Do not prefer emotional, evocative, dramatic, expressive, funny, warm, sweet, nostalgic, beautiful, or interesting Themes merely because they make a richer answer.\n\nUse ordinary human context as a first-class constraint. Read the visible setting, attire/presentation, activity, action, expression, and composition together before proposing an emotionally or atmospherically loaded Theme. Neutral, formal, professional, calm, focused, deliberate, or composed evidence is not itself evidence of comfort, intimacy, sexual desire, craving, disorder, nostalgia, obsession, grandeur, cuteness, intelligence, or any other richer semantic conclusion. A loaded Theme may still be a candidate when separate concrete evidence actually earns its defining meaning.\n\nDo not turn simplicity/minimalism into playfulness; irregularity/random arrangement into silliness; neutral stillness into coziness; generic pleasantness into sweetness; visual appeal into emotional significance; reflective language into nostalgia/poignancy; concentration/focus into intimacy, desire, obsession, intelligence, grandeur, or chaos; or deliberate composition into emotional significance. Include competitors that require LESS inference when they fit the same evidence.\n\nA candidate only needs to be plausible enough to deserve an audit. Do not assign final confidence and do not defend a candidate. Return ${THEME_DECISION_CANDIDATE_LIMIT} unique PFM codes when possible.\n\nLITERAL EVIDENCE\n${themeDecisionEvidenceText(ledger)}\n\nCURRENT 78 THEMES\n${catalog}\n\nOUTPUT FORMAT — one code per line and nothing else:\nCANDIDATE|PFM####`;
}

function parseThemeDecisionCandidates(raw,{max=THEME_DECISION_CANDIDATE_LIMIT,min=3,excludeCodes=[]}={}){
  const valid=new Set(PRIMFUSION_REGISTRY.aiThemeChoices.map(row=>row.code)),excluded=new Set((excludeCodes||[]).map(code=>String(code||'').toUpperCase())),out=[];
  const seen=new Set();
  for(const m of String(raw||'').matchAll(/\bPFM\d{4}\b/gi)){
    const code=m[0].toUpperCase();
    if(!valid.has(code)||excluded.has(code)||seen.has(code))continue;
    seen.add(code);out.push(code);
    if(out.length>=max)break;
  }
  const required=Math.max(1,Math.min(Number(min)||1,max));
  if(out.length<required)throw new Error(`Theme candidate discovery produced only ${out.length} valid candidates; ${required} required for this pass.`);
  return out;
}

async function runThemeDecisionCandidatePass(env,model,behavior,ledger,{excludeCodes=[],minCandidates=3}={}){
  let lastError=null;
  for(let attempt=1;attempt<=2;attempt++){
    try{
      const prompt=themeDecisionCandidatePrompt(ledger,{excludeCodes})+(attempt===2?'\n\nRECOVERY: Return only CANDIDATE|PFM#### lines. Include neutral/literal competitors; do not return explanations.':'');
      const raw=await runStructured(env,model,null,prompt,null,900,'text',{behavior,themeDecisionCandidatePass:true,temperature:attempt===1?0.08:0});
      return parseThemeDecisionCandidates(raw,{min:minCandidates,excludeCodes});
    }catch(error){lastError=error;}
  }
  throw diagnosticError(lastError?.message||'Theme candidate discovery failed.',{phase:'theme-decision-candidates'});
}

function themeDecisionAuditPrompt(ledger,codes){
  const defs=themeDecisionCatalog(codes);
  return `GENREACTRIX THEME DECISION — STAGE 3: ADVERSARIAL FIT AUDIT.\n\nAudit each listed candidate independently. Your role is to attack the candidate, not defend the earlier shortlist. A Theme cannot survive merely because you can write a plausible rationale for it. It survives only if the literal evidence contains positive semantic evidence that actually distinguishes that Theme from a neutral or less inferential interpretation.\n\nSTATUS RULES:\nSUPPORTED = clear positive evidence earns the Theme's semantic meaning.\nWEAK = it is a plausible closest-available interpretation, but evidence is partial; confidence later must remain low/modest.\nREJECT = the rationale depends on emotional-salience substitution, generic aesthetic praise, unsupported inference, missing gate/required meaning, contextual contradiction, or a materially closer less-inferential interpretation.\n\nCONTEXT CROSS-CHECK — REQUIRED: Before allowing SUPPORTED or WEAK, compare the candidate against the ordinary human reading of the ledger's setting, presentation/attire, activity, action, expression, and composition. If the candidate needs a semantic quality that those facts do not actually show—or the ordinary context points away from it—reject it unless separate concrete evidence positively supplies that quality. Do not convert neutral/professional/formal/calm/focused/deliberate/composed facts into emotionally or sensorily loaded evidence merely because a verbal bridge can be written.\n\nReject these substitutions unless independent evidence specifically earns the Theme meaning: simplicity/minimalism→playfulness; irregularity/randomness→silliness; visual interest→Goofy; neutral stillness→Cozy; generic pleasantness→sweetness; aesthetic appeal→emotional significance; reflective prose→Nostalgia/Poignant; concentration/focus→intimacy, Lust, Obsessive, intelligence, Epic, or Chaotic; deliberate composition→warmth, nostalgia, grandeur, or emotional significance. The same principle applies to every Theme, not just those examples.\n\nFor SUPPORTED or WEAK, cite one or more E# facts that positively support the semantic route. For REJECT, refs may be NONE. BETTER may name one materially closer PFM code from the full vocabulary, or NONE. Do not choose final top three here.\n\nLITERAL EVIDENCE\n${themeDecisionEvidenceText(ledger)}\n\nCANDIDATES TO AUDIT\n${defs}\n\nOUTPUT FORMAT — exactly one line per candidate:\nAUDIT|PFM####|SUPPORTED_or_WEAK_or_REJECT|E1,E2_or_NONE|BETTER_PFM####_or_NONE|brief reason`;
}

function parseThemeDecisionAudits(raw,codes,ledger){
  const wanted=new Set(codes),validCodes=new Set(PRIMFUSION_REGISTRY.aiThemeChoices.map(row=>row.code)),validRefs=new Set((ledger||[]).map(row=>row.id)),map=new Map();
  for(const line of String(raw||'').replace(/\r/g,'').split('\n')){
    const parts=line.trim().replace(/^[-*•]\s*/,'').split('|').map(x=>x.trim());
    if(parts.length<6||String(parts[0]).toUpperCase()!=='AUDIT')continue;
    const code=String(parts[1]||'').toUpperCase();if(!wanted.has(code)||map.has(code))continue;
    const status=String(parts[2]||'').toUpperCase();if(!['SUPPORTED','WEAK','REJECT'].includes(status))continue;
    const refs=[...new Set((String(parts[3]||'').match(/\bE\d{1,2}\b/gi)||[]).map(id=>id.toUpperCase()).filter(id=>validRefs.has(id)))];
    const betterRaw=String(parts[4]||'').toUpperCase(),better=validCodes.has(betterRaw)&&betterRaw!==code?betterRaw:null;
    const reason=parts.slice(5).join('|').replace(/\s+/g,' ').trim().slice(0,900);
    if(status!=='REJECT'&&!refs.length)continue;
    map.set(code,{code,status,supportEvidenceIds:refs,betterCode:better,reason,synthetic:false});
  }
  return map;
}

async function runThemeDecisionAuditBatch(env,model,behavior,ledger,codes){
  let best=new Map(),lastRaw='';
  for(let attempt=1;attempt<=2;attempt++){
    const prompt=themeDecisionAuditPrompt(ledger,codes)+(attempt===2?'\n\nRECOVERY: Audit every listed candidate exactly once. Return only AUDIT lines.':'');
    const raw=await runStructured(env,model,null,prompt,null,1600,'text',{behavior,themeDecisionAuditPass:true,temperature:0});
    lastRaw=raw;const parsed=parseThemeDecisionAudits(raw,codes,ledger);for(const [code,row] of parsed)best.set(code,row);
    if(best.size===codes.length)break;
  }
  for(const code of codes)if(!best.has(code))best.set(code,{code,status:'REJECT',supportEvidenceIds:[],betterCode:null,reason:'Audit did not return a valid attributable assessment for this candidate.',synthetic:true});
  return{audits:[...best.values()],rawPreview:String(lastRaw||'').slice(0,1200)};
}

async function runThemeDecisionAudits(env,model,behavior,ledger,codes){
  const all=[];
  for(let i=0;i<codes.length;i+=THEME_DECISION_AUDIT_BATCH_SIZE){
    const batch=codes.slice(i,i+THEME_DECISION_AUDIT_BATCH_SIZE),result=await runThemeDecisionAuditBatch(env,model,behavior,ledger,batch);
    all.push(...result.audits);
  }
  return all;
}

function themeDecisionFinalPrompt(ledger,audits){
  const survivors=audits.filter(row=>row.status!=='REJECT'),codes=survivors.map(row=>row.code),defs=themeDecisionCatalog(codes);
  const auditText=survivors.map(row=>`${row.code}|${row.status}|${row.supportEvidenceIds.join(',')||'NONE'}|${row.reason}`).join('\n');
  return `GENREACTRIX THEME DECISION — STAGE 4: FINAL RANK.\n\nChoose exactly three DIFFERENT Themes from the AUDIT-SURVIVING candidates only. Candidates marked REJECT have already failed adversarial review and are not eligible. Rank by closest ordinary-human semantic fit to the literal evidence and its ordinary situational context—not emotional richness, drama, novelty, aesthetic appeal, or how satisfying a Theme is to discuss. Clear observable cues and the visible setting/activity/presentation outrank abstract or forced association. A boring/neutral Theme wins whenever it is closer.\n\nSUPPORTED normally outranks WEAK when fit is otherwise comparable, but status does not replace semantic comparison. Confidence measures absolute strength of fit, NOT rank. A third-best WEAK Theme may deserve low confidence. Do not assign high confidence merely because a Theme is the best remaining option. High confidence requires strong direct visual/contextual support for the Theme's defining meaning and little meaningful contradiction; 100 means exceptionally complete and unmistakable.\n\nEvery final rationale must cite at least one E# support fact and must state the actual semantic route. Do not create new image facts. Do not resurrect a rejected Theme.\n\nLITERAL EVIDENCE\n${themeDecisionEvidenceText(ledger)}\n\nAUDIT SURVIVORS\n${auditText}\n\nSURVIVOR DEFINITIONS\n${defs}\n\nReturn exactly three lines and nothing else:\n1|matrix|PFM####|CONFIDENCE|E#[,E#] concise image-grounded reason\n2|matrix|PFM####|CONFIDENCE|E#[,E#] concise image-grounded reason\n3|matrix|PFM####|CONFIDENCE|E#[,E#] concise image-grounded reason`;
}

async function runThemeDecisionFinalRank(env,model,behavior,ledger,audits){
  const allowed=new Set(audits.filter(row=>row.status!=='REJECT').map(row=>row.code));
  if(allowed.size<3)throw diagnosticError(`Theme adversarial audit left only ${allowed.size} surviving candidates; refusing to fabricate a three-Theme result.`,{phase:'theme-decision-audit-survivors',survivors:[...allowed]});
  let lastError=null;
  for(let attempt=1;attempt<=2;attempt++){
    try{
      const prompt=themeDecisionFinalPrompt(ledger,audits)+(attempt===2?'\n\nRECOVERY: Use only the survivor PFM codes. Return exactly three unique pipe-delimited lines.':'');
      const raw=await runStructured(env,model,null,prompt,null,1100,'text',{behavior,themeDecisionFinalRank:true,temperature:0});
      const parsed=parseThemeText(raw);
      if(parsed.some(row=>row.source!=='matrix'||!allowed.has(row.code)))throw new Error('Theme final rank attempted to select a candidate that did not survive adversarial audit.');
      return parsed;
    }catch(error){lastError=error;}
  }
  throw diagnosticError(lastError?.message||'Theme final rank failed.',{phase:'theme-decision-final-rank'});
}

function themeDecisionPartialFinalPrompt(ledger,audits){
  const survivors=audits.filter(row=>row.status!=='REJECT'),count=survivors.length,codes=survivors.map(row=>row.code),defs=themeDecisionCatalog(codes);
  const auditText=survivors.map(row=>`${row.code}|${row.status}|${row.supportEvidenceIds.join(',')||'NONE'}|${row.reason}`).join('\n');
  return `GENREACTRIX THEME DECISION — SLOP WARNING PARTIAL RANK.\n\nThe adversarial audit has exhausted the full current Theme vocabulary and only ${count} defensible Theme${count===1?' remains':'s remain'}. Do NOT invent, resurrect, or weaken a rejected Theme merely to reach three. Rank exactly the surviving Theme${count===1?'':'s'} by closest ordinary-human semantic fit and assign realistic confidence using the same calibration as normal final ranking. High confidence still requires strong direct visual/contextual support. Every rationale must cite at least one supplied E# fact.\n\nLITERAL EVIDENCE\n${themeDecisionEvidenceText(ledger)}\n\nAUDIT SURVIVORS\n${auditText}\n\nSURVIVOR DEFINITIONS\n${defs}\n\nReturn exactly ${count} line${count===1?'':'s'} and nothing else:\n${survivors.map((_,index)=>`${index+1}|matrix|PFM####|CONFIDENCE|E#[,E#] concise image-grounded reason`).join('\n')}`;
}

function parseThemeDecisionPartialRank(raw,allowedCodes,expectedCount){
  const allowed=new Set(allowedCodes),validRefs=/\bE\d{1,2}\b/i,out=[],used=new Set();
  for(const line of String(raw||'').replace(/\r/g,'').split('\n')){
    const parts=line.trim().replace(/^[-*•]\s*/,'').split('|').map(x=>x.trim());
    if(parts.length<5)continue;
    const rank=Number(String(parts[0]||'').replace(/[^0-9]/g,'')),source=String(parts[1]||'').toLowerCase(),code=String(parts[2]||'').toUpperCase(),confidence=Number(String(parts[3]||'').replace(/[^0-9.]/g,'')),rationale=parts.slice(4).join('|').replace(/\s+/g,' ').trim();
    if(rank<1||rank>expectedCount||source!=='matrix'||!allowed.has(code)||used.has(code)||!Number.isFinite(confidence)||!validRefs.test(rationale))continue;
    used.add(code);out.push({rank,source:'matrix',code,confidence:Math.max(0,Math.min(100,confidence)),rationale});
  }
  out.sort((a,b)=>a.rank-b.rank);
  if(out.length!==expectedCount)throw new Error(`Theme partial final rank yielded ${out.length} valid selections instead of ${expectedCount}.`);
  return out.map((row,index)=>({...row,rank:index+1}));
}

async function runThemeDecisionPartialRank(env,model,behavior,ledger,audits){
  const survivors=audits.filter(row=>row.status!=='REJECT'),allowed=survivors.map(row=>row.code),expected=allowed.length;
  if(!expected)return[];
  let lastError=null;
  for(let attempt=1;attempt<=2;attempt++){
    try{
      const prompt=themeDecisionPartialFinalPrompt(ledger,audits)+(attempt===2?'\n\nRECOVERY: Use every survivor exactly once. Return only the requested pipe-delimited lines.':'');
      const raw=await runStructured(env,model,null,prompt,null,800,'text',{behavior,themeDecisionPartialRank:true,temperature:0});
      return parseThemeDecisionPartialRank(raw,allowed,expected);
    }catch(error){lastError=error;}
  }
  throw diagnosticError(lastError?.message||'Theme partial final rank failed.',{phase:'theme-decision-partial-final-rank',survivors:allowed});
}

function themeExhaustionSlopWarning({survivorCount=0,auditedCount=0,candidateCount=0}={}){
  const count=Math.max(0,Number(survivorCount)||0),audited=Math.max(0,Number(auditedCount)||0),candidates=Math.max(0,Number(candidateCount)||0);
  return{schemaVersion:2,assessmentId:`slop_warning_${Date.now().toString(36)}_${crypto.randomUUID().slice(0,8)}`,assessedAt:new Date().toISOString(),detected:false,warning:true,status:'warning',kind:'warning',confidence:null,reason:`Theme analysis exhausted the current ${PRIMFUSION_REGISTRY.aiThemeChoices.length}-Theme vocabulary and found only ${count} defensible Theme${count===1?'':'s'}; Director review is recommended.`,basis:'theme-evidence-exhaustion',trigger:'insufficient-theme-survivors',themeSurvivorCount:count,themeAuditedCount:audited,themeCandidateCount:candidates};
}

async function runThemeAdversarialDecisionPipeline(env,model,image,behavior='analyze',analysisContext=""){
  const evidenceLedger=await runThemeDecisionEvidencePass(env,model,image,behavior,analysisContext),allThemeCodes=PRIMFUSION_REGISTRY.aiThemeChoices.map(row=>row.code);
  let candidateCodes=await runThemeDecisionCandidatePass(env,model,behavior,evidenceLedger),audits=await runThemeDecisionAudits(env,model,behavior,evidenceLedger,candidateCodes),survivors=audits.filter(row=>row.status!=='REJECT');
  const auditedCodes=new Set(candidateCodes),expansionRounds=[];
  let expansionRound=0;
  while(survivors.length<3&&auditedCodes.size<allThemeCodes.length){
    expansionRound++;
    const remaining=allThemeCodes.filter(code=>!auditedCodes.has(code));
    const expansion=await runThemeDecisionCandidatePass(env,model,behavior,evidenceLedger,{excludeCodes:[...auditedCodes],minCandidates:Math.min(3,remaining.length)}),newCodes=expansion.filter(code=>!auditedCodes.has(code));
    if(!newCodes.length)throw diagnosticError('Theme candidate expansion returned no previously unaudited candidates.',{phase:'theme-decision-expansion-no-progress',auditedCount:auditedCodes.size,remainingCount:remaining.length,expansionRound});
    for(const code of newCodes)auditedCodes.add(code);
    const newAudits=await runThemeDecisionAudits(env,model,behavior,evidenceLedger,newCodes);
    candidateCodes=[...candidateCodes,...newCodes];audits=[...audits,...newAudits];survivors=audits.filter(row=>row.status!=='REJECT');
    expansionRounds.push({round:expansionRound,candidateCodes:[...newCodes],survivorCodes:newAudits.filter(row=>row.status!=='REJECT').map(row=>row.code),auditedCount:auditedCodes.size,remainingCount:allThemeCodes.length-auditedCodes.size});
  }
  const exhausted=survivors.length<3&&auditedCodes.size===allThemeCodes.length,syntheticAudits=audits.filter(row=>row.synthetic);
  if(exhausted&&syntheticAudits.length)throw diagnosticError(`Theme audit integrity failed for ${syntheticAudits.length} candidates; refusing to convert malformed audit output into a SLOP Warning.`,{phase:'theme-decision-audit-integrity',invalidAuditCodes:syntheticAudits.map(row=>row.code),survivorCodes:survivors.map(row=>row.code),auditedThemeCount:auditedCodes.size});
  const selections=exhausted?await runThemeDecisionPartialRank(env,model,behavior,evidenceLedger,audits):await runThemeDecisionFinalRank(env,model,behavior,evidenceLedger,audits);
  const warning=exhausted?themeExhaustionSlopWarning({survivorCount:survivors.length,auditedCount:auditedCodes.size,candidateCount:candidateCodes.length}):null;
  return{selections,warning,diagnostics:{schemaVersion:2,protocol:'literal-evidence-candidates-adversarial-audit-final-rank-v2-exhaustive-recovery',imageAccess:{evidence:true,candidates:false,audit:false,final:false},evidenceLedger,candidateCodes,audits,survivorCodes:survivors.map(row=>row.code),expansionRounds,exhaustedThemeVocabulary:exhausted,auditedThemeCount:auditedCodes.size,themeVocabularyCount:allThemeCodes.length,slopWarning:warning?{assessmentId:warning.assessmentId,trigger:warning.trigger,themeSurvivorCount:warning.themeSurvivorCount}:null}};
}

// v0.9.6.86 EXPERIMENT — one-variable continuation of v0.9.6.85.
// Fresh normal Theme selection still uses the exact same raw human-vote prompt and
// scoring objective. The only decision-input change is presentation order: the 66
// currently assigned Theme definitions are supplied in this fixed shuffled order.
const HUMAN_VOTE_FIXED_SHUFFLED_THEME_ORDER = ["PFM0511","PFM0210","PFM0508","PFM0506","PFM0102","PFM0709","PFM0207","PFM0312","PFM0608","PFM0910","PFM1011","PFM0407","PFM0412","PFM0411","PFM0304","PFM0306","PFM0410","PFM0110","PFM0305","PFM0205","PFM0710","PFM0104","PFM0107","PFM0507","PFM0211","PFM0112","PFM0311","PFM0912","PFM0209","PFM0204","PFM0711","PFM0405","PFM0509","PFM0307","PFM0206","PFM0212","PFM1012","PFM0612","PFM0512","PFM0510","PFM0712","PFM0111","PFM0309","PFM0406","PFM0208","PFM0911","PFM0408","PFM0810","PFM0607","PFM0611","PFM0811","PFM0609","PFM0203","PFM0812","PFM0809","PFM0308","PFM0103","PFM0106","PFM0310","PFM0409","PFM0108","PFM0610","PFM0105"];
const HUMAN_VOTE_FINAL_FIXED_SHUFFLED_THEME_ORDER = ["PFM0809","PFM0408","PFM0509","PFM0210","PFM0310","PFM0911","PFM0307","PFM0810","PFM0212","PFM0510","PFM0209","PFM0407","PFM0110","PFM0107","PFM0607","PFM0912","PFM0204","PFM0511","PFM0102","PFM0104","PFM0311","PFM0304","PFM0412","PFM0812","PFM1011","PFM0710","PFM0312","PFM0208","PFM0709","PFM0609","PFM0610","PFM0206","PFM0103","PFM0811","PFM0910","PFM0712","PFM0409","PFM0111","PFM0405","PFM0608","PFM0105","PFM1012","PFM0112","PFM0508","PFM0410","PFM0306","PFM0205","PFM0507","PFM0611","PFM0309","PFM0211","PFM0305","PFM0406","PFM0512","PFM0207","PFM0106","PFM0506","PFM0308","PFM0711","PFM0411","PFM0203","PFM0108","PFM0612"];
const HUMAN_VOTE_FINAL_FIXED_SHUFFLE_SEED = 'description-final-v1';
function themeSweepSeedHash(value){let h=2166136261>>>0;for(const ch of String(value||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function themeSweepRandom(seed){let a=themeSweepSeedHash(seed)||0x9e3779b9;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function shuffledThemeOrder(seed){const out=PRIMFUSION_REGISTRY.aiThemeChoices.map(t=>t.code),rand=themeSweepRandom(seed);for(let i=out.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
function resolveHumanVoteThemeOrder(themeSweep=null){
  const mode=String(themeSweep?.orderMode||'').toLowerCase();
  if(mode==='canonical')return{mode:'canonical',seed:null,codes:PRIMFUSION_REGISTRY.aiThemeChoices.map(t=>t.code)};
  if(mode==='shuffled'&&String(themeSweep?.orderSeed||'').trim())return{mode:'shuffled',seed:String(themeSweep.orderSeed),codes:shuffledThemeOrder(themeSweep.orderSeed)};
  return{mode:'fixed-shuffled-v1',seed:null,codes:[...HUMAN_VOTE_FIXED_SHUFFLED_THEME_ORDER]};
}
function resolveThemeAssociationOrder(themeSweep=null,stage='preliminary'){
  if(stage==='final'&&!themeSweep){
    return{mode:'fixed-shuffled-final-v1',seed:HUMAN_VOTE_FINAL_FIXED_SHUFFLE_SEED,codes:[...HUMAN_VOTE_FINAL_FIXED_SHUFFLED_THEME_ORDER]};
  }
  return resolveHumanVoteThemeOrder(themeSweep);
}
function themeHumanVoteExperimentPrompt(themeSweep=null,{excludedThemeCodes=[]}={}){
  const blocked=new Set((excludedThemeCodes||[]).map(code=>String(code||'').toUpperCase()));
  const byCode=new Map(PRIMFUSION_REGISTRY.aiThemeChoices.map(t=>[t.code,t]));
  const order=resolveHumanVoteThemeOrder(themeSweep);
  const choices=order.codes
    .filter(code=>!blocked.has(code))
    .map(code=>byCode.get(code))
    .filter(Boolean)
    .map(t=>`${t.code} — ${t.name}${t.aiMeaning?` — Meaning: ${t.aiMeaning}`:''}`)
    .join('\n');
  const exclusionNote=blocked.size?`\n\nRECOVERY EXCLUSIONS: ${[...blocked].join(', ')} are unavailable in this recovery pass because the prior result contradicted them. Do not return an excluded code.`:'';
  return `GENREACTRIX HUMAN-VOTE THEME EXPERIMENT.\n\nImagine a large group of independent human judges viewing this image. Each human may choose up to 3 Themes from the available definitions below. Predict the resulting human Theme leaderboard.\n\nSubmit up to 3 ranked Themes to maximize your expected score under this scoring system:\n- Human rank #1: +10,000 points.\n- Human ranks #2-4: +2,000 points each.\n- Human ranks #5-8: +500 points each.\n- Human ranks #9-12: +125 points each.\n- Each blank submitted slot: -500 points.\n- A submitted Theme outside the human top 12 but selected by at least one human: -1,000 points.\n- A submitted Theme selected by no humans at all: -10,000 points.\n\nMaximize expected score.${exclusionNote}\n\nCURRENT AVAILABLE THEME DEFINITIONS:\n${choices}\n\nOUTPUT ONLY these three ranked rows, one per line:\n1|PFM####|brief concrete selection basis or 1|BLANK|brief reason for leaving blank\n2|PFM####|brief concrete selection basis or 2|BLANK|brief reason for leaving blank\n3|PFM####|brief concrete selection basis or 3|BLANK|brief reason for leaving blank\n\nDo not output percentages or confidence scores. Keep each selection basis to one short sentence grounded in what is visible in the image. Do not add any other text.`;
}

function parseThemeHumanVoteExperiment(raw,{excludedThemeCodes=[]}={}){
  const blocked=new Set((excludedThemeCodes||[]).map(code=>String(code||'').toUpperCase()));
  const validCodes=new Set(PRIMFUSION_REGISTRY.aiThemeChoices.map(row=>row.code).filter(code=>!blocked.has(code)));
  const rows=new Map(),used=new Set();
  for(const line of String(raw||'').replace(/\r/g,'').split('\n')){
    const parts=line.trim().replace(/^[-*•]\s*/,'').split('|').map(x=>x.trim());
    if(parts.length<2)continue;
    const rank=Number(String(parts[0]||'').replace(/[^0-9]/g,''));
    if(![1,2,3].includes(rank)||rows.has(rank))continue;
    const value=String(parts[1]||'').toUpperCase();
    const rationale=parts.slice(2).join('|').replace(/\s+/g,' ').trim().slice(0,700);
    if(value==='BLANK'){
      rows.set(rank,{rank,blank:true,rationale});
      continue;
    }
    if(!validCodes.has(value)||used.has(value))continue;
    used.add(value);
    rows.set(rank,{rank,blank:false,code:value,rationale});
  }
  if(rows.size!==3)throw new Error(`Human-vote Theme experiment returned ${rows.size} valid ranked rows instead of 3.`);
  const ordered=[1,2,3].map(rank=>rows.get(rank));
  return {
    selections:ordered.filter(row=>!row.blank).map((row,index)=>({rank:index+1,source:'matrix',code:row.code,confidence:null,rationale:String(row.rationale||'').trim()})),
    submittedRows:ordered.map(row=>row.blank?{rank:row.rank,blank:true,rationale:String(row.rationale||'').trim()}:{rank:row.rank,blank:false,code:row.code,rationale:String(row.rationale||'').trim()}),
    blankCount:ordered.filter(row=>row.blank).length
  };
}


function themeEscapeRegex(value){return String(value||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function themeWordStem(value){
  let word=String(value||'').toLowerCase().replace(/[^a-z]/g,'');if(word.length<4)return word;
  for(const [suffix,replacement] of [['ization',''],['isation',''],['ation',''],['ition',''],['ion',''],['ized',''],['ised',''],['ing',''],['ed',''],['es',''],['s','']]){
    if(word.endsWith(suffix)&&word.length-suffix.length>=4){word=word.slice(0,-suffix.length)+replacement;break;}
  }
  return word;
}
const THEME_REQUIRED_STOPWORDS=new Set(['there','must','required','requires','require','evidence','clear','visible','meaningfully','meaningful','depicted','itself','itself','it','this','that','these','those','with','from','into','through','when','where','which','have','has','been','being','only','alone','actual','genuine','specific','specifically','form','theme']);
function themeRequiredTermStems(theme){
  const definition=String(theme?.aiMeaning||''),required=[];
  for(const sentence of definition.split(/(?<=[.!?])\s+|\n+/)){
    let tail='';
    const must=sentence.match(/\bmust\s+(?!not\b)(.+)$/i);
    if(must)tail=must[1];
    else{
      const req=sentence.match(/\brequires?\s+(.+)$/i);
      if(req){const prefix=sentence.slice(0,req.index);if(!/\b(?:does|do|is|are)?\s*not\s*$/i.test(prefix))tail=req[1];}
    }
    if(!tail)continue;
    for(const word of tail.toLowerCase().match(/[a-z][a-z-]{3,}/g)||[]){const stem=themeWordStem(word);if(stem.length>=4&&!THEME_REQUIRED_STOPWORDS.has(word)&&!THEME_REQUIRED_STOPWORDS.has(stem))required.push(stem);}
  }
  return new Set(required);
}
function themeNegatedTermStems(text){
  const value=String(text||'');const stems=new Set();
  const patterns=[
    /\bwithout\s+(?:any\s+|clear\s+|visible\s+|meaningful\s+|actual\s+)?([a-z][a-z-]{3,})/gi,
    /\bno\s+(?:clear\s+|visible\s+|meaningful\s+|actual\s+)?(?:evidence\s+(?:of|for)\s+)?([a-z][a-z-]{3,})/gi,
    /\blacks?\s+(?:any\s+|clear\s+|visible\s+|meaningful\s+|actual\s+)?([a-z][a-z-]{3,})/gi,
    /\bnot\s+(?:meaningfully\s+|actually\s+|really\s+)?([a-z][a-z-]{3,})/gi
  ];
  for(const pattern of patterns){let match;while((match=pattern.exec(value))){const stem=themeWordStem(match[1]);if(stem.length>=4)stems.add(stem);}}
  return stems;
}
function themeSelectionExplicitSelfContradiction(selection){
  const theme=PRIMFUSION_REGISTRY.aiThemeChoices.find(row=>row.code===String(selection?.code||'').toUpperCase());
  const reason=String(selection?.rationale||'').trim();if(!theme||!reason)return false;
  const name=themeEscapeRegex(String(theme.name||'').trim());if(!name)return false;
  return [
    new RegExp(`\\bnot\\s+(?:really\\s+|actually\\s+)?${name}\\b`,'i'),
    new RegExp(`\\bno\\s+(?:clear\\s+|visible\\s+|actual\\s+|meaningful\\s+)?evidence\\s+(?:for|of)\\s+(?:the\\s+)?${name}\\b`,'i'),
    new RegExp(`\\b(?:does\\s+not|doesn't)\\s+(?:support|fit|match)\\s+(?:the\\s+)?${name}\\b`,'i')
  ].some(pattern=>pattern.test(reason));
}
function themeSelectionContradictsDefinition(selection){
  const theme=PRIMFUSION_REGISTRY.aiThemeChoices.find(row=>row.code===String(selection?.code||'').toUpperCase());
  const reason=String(selection?.rationale||'').trim();if(!theme||!reason)return false;
  if(themeSelectionExplicitSelfContradiction(selection))return true;
  const required=themeRequiredTermStems(theme),negated=themeNegatedTermStems(reason);
  return [...negated].some(term=>required.has(term));
}
function themeAuditContradictionRepair(audit,selection,evidenceLedger=[]){
  if(!audit||audit.gate!=='GATE_PASS')return audit;
  const theme=PRIMFUSION_REGISTRY.aiThemeChoices.find(row=>row.code===String(audit.code||'').toUpperCase());if(!theme)return audit;
  const evidenceById=new Map((evidenceLedger||[]).map(row=>[row.id,String(row.fact||'')]));
  const combined=[selection?.rationale,audit.reason,...(audit.evidenceIds||[]).map(id=>evidenceById.get(id)||'')].filter(Boolean).join(' ');
  const explicit=themeSelectionExplicitSelfContradiction({...selection,rationale:combined});
  const required=themeRequiredTermStems(theme),negated=themeNegatedTermStems(combined),terms=[...negated].filter(term=>required.has(term));
  if(!explicit&&!terms.length)return audit;
  return {...audit,status:'REJECT',gate:'GATE_FAIL',failureClass:'definition-misread',automaticContradictionRepair:true,contradictionTerms:terms};
}
const THEME_REASONING_FAILURE_CLASSES = new Set(['none','image-misread','definition-misread','ranking-error','emotional-salience','invented-evidence','cue-trap','order-availability','other']);
function themeReasoningPrimCatalog(){
  return PRIMFUSION_REGISTRY.primitives.map(p=>`${p.id} — ${p.name}: ${String(p.aiMeaning||'').split(/\n/)[0]}`).join('\n');
}
function themeReasoningSelectedCatalog(selections=[]){
  const byCode=new Map(PRIMFUSION_REGISTRY.aiThemeChoices.map(t=>[t.code,t]));
  return selections.map(row=>{const t=byCode.get(row.code);return t?`${row.rank}|${t.code} — ${t.name}: ${t.aiMeaning}\nSTATED SELECTION BASIS: ${String(row.rationale||'').trim()||'None supplied'}`:''}).filter(Boolean).join('\n\n');
}
function themeReasoningPrompt(selections=[],themeSweep=null){
  const order=resolveHumanVoteThemeOrder(themeSweep),orderByCode=new Map(order.codes.map((code,index)=>[code,index+1]));
  const allThemes=PRIMFUSION_REGISTRY.aiThemeChoices.map(t=>`${t.code} — ${t.name}: ${t.aiMeaning}`).join('\n');
  const locked=selections.map(row=>`${row.rank}|${row.code}|basis=${String(row.rationale||'').trim()||'None supplied'}`).join('\n')||'No nonblank Theme was selected.';
  return `GENREACTRIX THEMES INFO — DIAGNOSTIC SIDECAR.\n\nThe Theme selections below are already LOCKED by a prior human-vote selection call. This diagnostic MUST NOT change them. Analyze why they may have been chosen and whether the visible evidence actually supports them.\n\nFirst construct literal visual evidence. Then score all active Prims independently from the image. Then identify up to 12 Themes that deserve serious consideration before ranking. Finally audit each locked selected Theme against its exact definition.\n\nDo not reward a Theme merely for being emotional, dramatic, provocative, attention-grabbing, evocative, aesthetically interesting, or richer to discuss. If a selected Theme lacks its required semantic evidence, mark it REJECT even if a plausible story can be written.\n\nCONTRADICTION CHECK: Compare each locked Theme's exact definition against its STATED SELECTION BASIS and your literal evidence. If the basis/evidence says a defining requirement is absent (for example, ‘without X’, ‘no X’, ‘lacks X’, or explicitly says the Theme does not fit), that absence is not support. When a required element is contradicted, return REJECT and GATE_FAIL.\n\nFor Prim scores, 0 means no meaningful support; 100 means unmistakable support. Score every active Prim. The Prim pass is diagnostic only and does not alter the locked Theme result.\n\nFor SELECTED audit status: SUPPORTED = clear evidence; WEAK = partial/closest-available evidence; REJECT = insufficient or contradicted evidence. GATE_PASS means the selected Theme's defining/required meaning is visibly satisfied; GATE_FAIL means it is not.\n\nFailure class must be exactly one of: none, image-misread, definition-misread, ranking-error, emotional-salience, invented-evidence, cue-trap, order-availability, other. Use none when the selection is sound. CLOSEST may be one PFM code from the full vocabulary or NONE.\n\nLOCKED SELECTIONS\n${locked}\n\nACTIVE PRIMS\n${themeReasoningPrimCatalog()}\n\nFULL THEME VOCABULARY\n${allThemes}\n\nReturn only these line types, in this order:\nEVIDENCE|E1|one concrete visible fact\n... 6 to 12 EVIDENCE lines\nPRIM|P01|0-100|E1,E2_or_NONE|brief concrete reason\n... exactly one PRIM line for every active Prim listed above\nCANDIDATE|PFM####\n... up to 12 unique serious pre-ranking candidates\nSELECTED|rank|PFM####|SUPPORTED_or_WEAK_or_REJECT|E1,E2_or_NONE|GATE_PASS_or_GATE_FAIL|PFM####_or_NONE|failure-class|brief audit reason\n... exactly one SELECTED line for every nonblank locked Theme.\n\nDo not output prose outside these records.`;
}
function parseThemeReasoningDiagnostic(raw,selections=[],themeSweep=null){
  const validThemes=new Set(PRIMFUSION_REGISTRY.aiThemeChoices.map(t=>t.code)),validPrims=new Set(PRIMFUSION_REGISTRY.primitives.map(p=>p.id));
  const evidence=[],evidenceIds=new Set(),primMap=new Map(),candidates=[],candidateSet=new Set(),selectedMap=new Map();
  for(const line of String(raw||'').replace(/\r/g,'').split('\n')){
    const parts=line.trim().replace(/^[-*•]\s*/,'').split('|').map(x=>x.trim());if(!parts.length)continue;
    const kind=String(parts[0]||'').toUpperCase();
    if(kind==='EVIDENCE'&&parts.length>=3){const id=String(parts[1]||'').toUpperCase();if(!/^E\d{1,2}$/.test(id)||evidenceIds.has(id))continue;const fact=parts.slice(2).join('|').replace(/\s+/g,' ').trim().slice(0,500);if(!fact)continue;evidenceIds.add(id);evidence.push({id,fact});continue;}
    if(kind==='PRIM'&&parts.length>=5){const code=String(parts[1]||'').toUpperCase(),score=Number(String(parts[2]||'').replace(/[^0-9.]/g,''));if(!validPrims.has(code)||primMap.has(code)||!Number.isFinite(score))continue;const refs=[...new Set((String(parts[3]||'').match(/\bE\d{1,2}\b/gi)||[]).map(x=>x.toUpperCase()))];const reason=parts.slice(4).join('|').replace(/\s+/g,' ').trim().slice(0,700);primMap.set(code,{code,score:Math.max(0,Math.min(100,score)),evidenceIds:refs,reason});continue;}
    if(kind==='CANDIDATE'&&parts.length>=2){const code=String(parts[1]||'').toUpperCase();if(validThemes.has(code)&&!candidateSet.has(code)){candidateSet.add(code);candidates.push(code);}continue;}
    if(kind==='SELECTED'&&parts.length>=9){const rank=Number(parts[1]),code=String(parts[2]||'').toUpperCase(),status=String(parts[3]||'').toUpperCase(),gate=String(parts[5]||'').toUpperCase(),closestRaw=String(parts[6]||'').toUpperCase(),failure=String(parts[7]||'').toLowerCase();if(!Number.isInteger(rank)||!validThemes.has(code)||!['SUPPORTED','WEAK','REJECT'].includes(status)||!['GATE_PASS','GATE_FAIL'].includes(gate))continue;const refs=[...new Set((String(parts[4]||'').match(/\bE\d{1,2}\b/gi)||[]).map(x=>x.toUpperCase()))];const closest=validThemes.has(closestRaw)&&closestRaw!==code?closestRaw:null,reason=parts.slice(8).join('|').replace(/\s+/g,' ').trim().slice(0,900);selectedMap.set(code,{rank,code,status,evidenceIds:refs,gate,closestAlternativeCode:closest,failureClass:THEME_REASONING_FAILURE_CLASSES.has(failure)?failure:'other',reason});}
  }
  const primScores=PRIMFUSION_REGISTRY.primitives.map(p=>primMap.get(p.id)||{code:p.id,score:null,evidenceIds:[],reason:'Diagnostic did not return a valid score.'});
  const byPrim=new Map(primScores.map(row=>[row.code,row]));
  const order=resolveHumanVoteThemeOrder(themeSweep),orderByCode=new Map(order.codes.map((code,index)=>[code,index+1]));
  const selectedAudits=selections.map(row=>themeAuditContradictionRepair(selectedMap.get(row.code)||{rank:row.rank,code:row.code,status:'UNPARSED',evidenceIds:[],gate:'UNPARSED',closestAlternativeCode:null,failureClass:'other',reason:'Diagnostic did not return a valid selected-Theme audit.'},row,evidence));
  const primConsistency=selections.map(row=>{const m=String(row.code||'').match(/^PFM(\d{2})(\d{2})$/),primCodes=m?[`P${m[1]}`,`P${m[2]}`]:[],scores=primCodes.map(code=>byPrim.get(code)?.score??null);return{rank:row.rank,code:row.code,themeOrderPosition:orderByCode.get(row.code)||null,primCodes,primScores:scores,minPrimScore:scores.every(v=>Number.isFinite(v))?Math.min(...scores):null,averagePrimScore:scores.every(v=>Number.isFinite(v))?Math.round((scores[0]+scores[1])/2):null,candidateEntered:candidateSet.has(row.code)};});
  return{schemaVersion:1,status:'complete',protocol:'human-vote-reasoning-sidecar-v1',evidenceLedger:evidence,primScores,candidateCodes:candidates.slice(0,12),selectedAudits,primConsistency,themeDefinitionOrder:order.mode,themeDefinitionOrderSeed:order.seed};
}
function themeSingleDecisionGatePrompt(selection){
  const code=String(selection?.code||'').toUpperCase();
  const theme=PRIMFUSION_REGISTRY.aiThemeChoices.find(row=>String(row.code||'').toUpperCase()===code);
  if(!theme)throw diagnosticError(`Cannot audit unknown Theme ${code||'(blank)'}.`,{phase:'theme-decision-audit-setup',failureKind:'unknown-theme',themeCode:code||null});
  return `GENREACTRIX THEME DECISION AUDIT — ONE THEME ONLY.\n\nThe three selected Themes are an UNORDERED SET of equal selections. This request judges only ${theme.code} — ${theme.name}. Do not rank it, compare its position, or infer importance from any 1/2/3 ordering.\n\nTHEME DEFINITION\n${theme.code} — ${theme.name}: ${theme.aiMeaning}\n\nSTATED SELECTION BASIS\n${String(selection?.rationale||'').trim()||'None supplied'}\n\nDECISION\nKEEP = the visible image contains enough real support for this Theme to remain one of the three equal selected Themes. Partial but genuine support may still be KEEP when the Theme is a reasonable fit.\nREJECT = the Theme lacks its defining/required meaning, contradicts the visible image or its stated basis, depends on invented evidence, or is being justified only through emotional salience or semantic stretch.\n\nReturn exactly one word and nothing else:\nKEEP\nor\nREJECT`;
}
function themeBinaryAuditDecision(value){
  const token=String(value||'').toUpperCase().replace(/[^A-Z]/g,'');
  if(['KEEP','KEPT','ACCEPT','ACCEPTED','PASS','PASSED','YES','SUPPORTED','SUPPORT','WEAK'].includes(token))return'KEEP';
  if(['REJECT','REJECTED','FAIL','FAILED','NO','DROP','DROPPED','REMOVE','REMOVED','UNSUPPORTED','NOTSUPPORTED','GATEFAIL'].includes(token))return'REJECT';
  return null;
}
function parseThemeSingleDecisionGate(raw){
  const original=String(raw||'');
  let cleaned=original.replace(/\r/g,'').replace(/```(?:text|txt|markdown|md|json)?/gi,'').replace(/```/g,'').trim();
  if(!cleaned)return null;
  // Accept tiny JSON wrappers providers sometimes add despite the one-word instruction.
  try{
    const parsed=JSON.parse(cleaned);
    if(typeof parsed==='string'){
      const d=themeBinaryAuditDecision(parsed);if(d)return d;
    }else if(parsed&&typeof parsed==='object'){
      for(const key of ['decision','verdict','result','answer','status']){
        const d=themeBinaryAuditDecision(parsed[key]);if(d)return d;
      }
    }
  }catch{}
  const direct=themeBinaryAuditDecision(cleaned);if(direct)return direct;
  const labeled=cleaned.match(/\b(?:decision|verdict|result|answer|status)\s*[:=|>\-]+\s*(KEEP|KEPT|ACCEPT(?:ED)?|PASS(?:ED)?|YES|SUPPORTED|SUPPORT|WEAK|REJECT(?:ED)?|FAIL(?:ED)?|NO|DROP(?:PED)?|REMOVE(?:D)?|UNSUPPORTED|NOT\s+SUPPORTED|GATE\s*FAIL)\b/i);
  if(labeled){const d=themeBinaryAuditDecision(labeled[1]);if(d)return d;}
  const tokens=cleaned.match(/\b(?:KEEP|KEPT|ACCEPT(?:ED)?|PASS(?:ED)?|YES|SUPPORTED|SUPPORT|WEAK|REJECT(?:ED)?|FAIL(?:ED)?|NO|DROP(?:PED)?|REMOVE(?:D)?|UNSUPPORTED|NOT\s+SUPPORTED|GATE\s*FAIL)\b/ig)||[];
  const decisions=[...new Set(tokens.map(themeBinaryAuditDecision).filter(Boolean))];
  return decisions.length===1?decisions[0]:null;
}
function themeSingleDecisionAuditRow(selection,decision){
  const code=String(selection?.code||'').toUpperCase();
  return decision==='KEEP'
    ?{rank:selection?.rank,code,status:'SUPPORTED',evidenceIds:[],gate:'GATE_PASS',closestAlternativeCode:null,failureClass:'none',reason:'Independent one-Theme binary audit: KEEP.'}
    :{rank:selection?.rank,code,status:'REJECT',evidenceIds:[],gate:'GATE_FAIL',closestAlternativeCode:null,failureClass:'other',reason:'Independent one-Theme binary audit: REJECT.'};
}
function themeStableProviderRotation(code,providers=[]){
  const list=[...providers];if(list.length<2)return list;
  let hash=0;for(const ch of String(code||''))hash=(hash*31+ch.charCodeAt(0))>>>0;
  const offset=hash%list.length;return[...list.slice(offset),...list.slice(0,offset)];
}
function themeProviderLaneExecutor(){
  const tails=new Map();
  return async(provider,task)=>{
    const prior=tails.get(provider)||Promise.resolve();
    const run=prior.catch(()=>{}).then(()=>task());
    tails.set(provider,run.catch(()=>{}));
    return await run;
  };
}
function buildPerThemeDecisionDiagnostic(selections=[],themeResults=[],protocol='selected-theme-decision-audit-v4-single-theme-binary-unordered'){
  const byCode=new Map(themeResults.map(result=>[String(result?.code||'').toUpperCase(),result]));
  const selectedAudits=selections.map(selection=>{
    const code=String(selection?.code||'').toUpperCase(),result=byCode.get(code);
    return result?.audit||{rank:selection?.rank,code,status:'UNPARSED',evidenceIds:[],gate:'UNPARSED',closestAlternativeCode:null,failureClass:'other',reason:'No valid one-Theme decision audit was returned.'};
  });
  const attempts=themeResults.flatMap(result=>(result?.attempts||[]).map(attempt=>({...attempt,themeCode:result.code})));
  return{schemaVersion:4,status:'complete',protocol,diagnosticClass:'decision-critical',themeSetSemantics:'unordered-equal',auditUnit:'one-theme-per-request',selectedAudits,evidenceLedger:[],primScores:[],candidateCodes:[],primConsistency:[],reportingSidecar:{status:'pending',protocol:'human-vote-reasoning-sidecar-v1'},providerCycle:{schemaVersion:4,policy:'per-theme-binary-provider-retry-v1',stage:'theme-decision-audit',attemptCount:attempts.length,perTheme:themeResults.map(result=>({code:result.code,decision:result.decision,winningProvider:result.winningProvider,attemptCount:(result.attempts||[]).length,durationMs:result.durationMs,attempts:result.attempts||[]})),attempts}};
}
const THEME_PROVIDER_CYCLE_ORDER=['mistral','secondary','qwen'];
const THEME_PROVIDER_CYCLE_POLICY='mistral-gpt41mini-qwen-one-attempt-per-cycle-v1';
const THEME_WHOLE_RUN_POLICY='mistral-primary-gpt41mini-secondary-qwen-third-whole-run-v1';
const THEME_PROVIDER_ROLE={mistral:'primary',secondary:'secondary',qwen:'third'};
function themeProviderRole(provider){return THEME_PROVIDER_ROLE[String(provider||'').toLowerCase()]||'unknown';}
function themeProviderModel(env,provider,primaryModel=null){
  if(provider==='mistral')return mistralDescriptionModelFor(env);
  if(provider==='secondary')return fallbackModelFor(env);
  if(provider==='qwen')return qwenThemeModelFor(env);
  return primaryModel||env?.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL;
}
function themeProviderRoster(env,primaryModel=null){return THEME_PROVIDER_CYCLE_ORDER.map(provider=>({role:themeProviderRole(provider),provider,model:themeProviderModel(env,provider,primaryModel)}));}
function themePinnedProviderEnv(env,provider,reason='fresh-theme-whole-run'){
  const routed=providerRoutingEnv(env,provider==='secondary'?{providerRouting:{mode:'fallback',fallbackUntil:Date.now()+60000,reason}}:{});
  Object.defineProperty(routed,'__GENREACTRIX_THEME_PINNED_PROVIDER',{value:provider,enumerable:false,configurable:true});
  return routed;
}
function providerCycleAttemptEnv(env,provider,stage,cycle){
  const routed=providerRoutingEnv(env,provider==='secondary'?{providerRouting:{mode:'fallback',fallbackUntil:Date.now()+60000,reason:`provider-cycle-${stage}`}}:{});
  Object.defineProperty(routed,'__GENREACTRIX_FORCED_PROVIDER',{value:provider,enumerable:false,configurable:true});
  Object.defineProperty(routed,'__GENREACTRIX_PROVIDER_ATTEMPT_CONTEXT',{value:{providerCyclePolicy:THEME_PROVIDER_CYCLE_POLICY,providerCycleStage:stage,providerCycleNumber:cycle,providerCycleProvider:provider,providerRole:themeProviderRole(provider)},enumerable:false,configurable:true});
  return routed;
}
function timingIso(ms){return new Date(Number(ms)||Date.now()).toISOString();}
function timingDurationMs(startedMs,endedMs=Date.now()){return Math.max(0,Math.round((Number(endedMs)||Date.now())-(Number(startedMs)||Date.now())));}
function providerCycleSuccessRow({cycle,provider,startedMs,endedMs=Date.now()}){
  return{cycle,provider,outcome:'success',startedAt:timingIso(startedMs),endedAt:timingIso(endedMs),durationMs:timingDurationMs(startedMs,endedMs)};
}
function providerCycleFailureRow(error,{cycle,provider,raw='',startedMs=null,endedMs=Date.now()}){
  const diagnostic=providerDiagnosticOf(error)||{};
  return{cycle,provider,outcome:'failure',startedAt:startedMs==null?null:timingIso(startedMs),endedAt:timingIso(endedMs),durationMs:startedMs==null?null:timingDurationMs(startedMs,endedMs),failurePhase:diagnostic.phase||null,failureKind:diagnostic.failureKind||null,errorName:String(error?.name||'Error'),errorMessage:String(error?.message||error).slice(0,1200),responsePreview:String(raw||'').slice(0,1200)};
}
function providerCycleRecoverySummary({stage,attempts,winningCycle=null,winningProvider=null,startedMs,endedMs=Date.now(),maxCycles=2}){
  return{schemaVersion:2,policy:THEME_PROVIDER_CYCLE_POLICY,stage,startedAt:timingIso(startedMs),endedAt:timingIso(endedMs),durationMs:timingDurationMs(startedMs,endedMs),winningCycle,winningProvider,attemptCount:attempts.length,secondCycleUsed:winningCycle==null?maxCycles>1:winningCycle>1,attempts:[...attempts]};
}
/**
 * Run one attempt per eligible provider in each cycle.
 * @param {any} env
 * @param {any} model
 * @param {{
 *   stage:string,
 *   image?:any,
 *   promptForCycle:string|((cycleNumber:number)=>string),
 *   maxTokens?:number,
 *   behavior?:string,
 *   temperature?:number,
 *   options?:Record<string, any>,
 *   validate:(raw:string, meta:{cycle:number,provider:string})=>any|Promise<any>,
 *   maxCycles?:number
 * }} config
 */
async function runThemeProviderCycle(env,model,{stage,image=null,promptForCycle,maxTokens=1200,behavior='analyze',temperature=0,options={},validate,maxCycles=2}){
  const attempts=[];let lastError=null,lastRaw='';
  const stageStartedMs=Date.now();
  const pinnedProvider=String(env?.__GENREACTRIX_THEME_PINNED_PROVIDER||'').toLowerCase();
  const providers=pinnedProvider?[pinnedProvider]:THEME_PROVIDER_CYCLE_ORDER;
  const effectiveMaxCycles=pinnedProvider?1:maxCycles;
  for(let cycle=1;cycle<=effectiveMaxCycles;cycle++){
    const prompt=typeof promptForCycle==='function'?promptForCycle(cycle):String(promptForCycle||'');
    for(const provider of providers){
      lastRaw='';
      const attemptStartedMs=Date.now();
      const attemptEnv=providerCycleAttemptEnv(env,provider,stage,cycle);
      providerProgressEvent(attemptEnv,{event:'provider-attempt-start',stage,cycle,provider,providerRole:themeProviderRole(provider),model:themeProviderModel(env,provider,model),state:'running'});
      try{
        lastRaw=String(await runStructured(attemptEnv,model,image,prompt,null,maxTokens,'text',{behavior,temperature,...options}));
        const result=await validate(lastRaw,{cycle,provider});
        const attemptEndedMs=Date.now();
        mergeProviderTrace(env,attemptEnv,`provider-cycle:${stage}`);
        attempts.push(providerCycleSuccessRow({cycle,provider,startedMs:attemptStartedMs,endedMs:attemptEndedMs}));
        providerTraceEvent(env,{provider:'provider-cycle-router',model:null,outcome:'stage-success',providerCyclePolicy:THEME_PROVIDER_CYCLE_POLICY,providerCycleStage:stage,providerCycleNumber:cycle,providerCycleProvider:provider,durationMs:timingDurationMs(attemptStartedMs,attemptEndedMs)});
        providerProgressEvent(env,{event:'provider-attempt-success',stage,cycle,provider,providerRole:themeProviderRole(provider),model:themeProviderModel(env,provider,model),state:'success',durationMs:timingDurationMs(attemptStartedMs,attemptEndedMs)});
        return{result,raw:lastRaw,recovery:providerCycleRecoverySummary({stage,attempts,winningCycle:cycle,winningProvider:provider,startedMs:stageStartedMs,endedMs:attemptEndedMs,maxCycles})};
      }catch(error){
        const attemptEndedMs=Date.now();
        mergeProviderTrace(env,attemptEnv,`provider-cycle:${stage}`);
        lastError=error;
        const failure=providerCycleFailureRow(error,{cycle,provider,raw:lastRaw,startedMs:attemptStartedMs,endedMs:attemptEndedMs});
        attempts.push(failure);
        providerTraceEvent(env,{provider:'provider-cycle-router',model:null,outcome:'stage-failure',providerCyclePolicy:THEME_PROVIDER_CYCLE_POLICY,providerCycleStage:stage,providerCycleNumber:cycle,providerCycleProvider:provider,failurePhase:failure.failurePhase,failureKind:failure.failureKind,errorMessage:failure.errorMessage,durationMs:failure.durationMs});
        providerProgressEvent(env,{event:'provider-attempt-failure',stage,cycle,provider,providerRole:themeProviderRole(provider),model:themeProviderModel(env,provider,model),state:'failure',durationMs:failure.durationMs,failurePhase:failure.failurePhase,failureKind:failure.failureKind,errorMessage:failure.errorMessage});
      }
    }
  }
  const endedMs=Date.now();
  throw diagnosticError(lastError?.message||`Provider cycle exhausted for ${stage}.`,{phase:`provider-cycle-${stage}-exhausted`,failureKind:'provider-cycle-exhausted',freshRequestRecommended:true,providerCycle:providerCycleRecoverySummary({stage,attempts,winningCycle:null,winningProvider:null,startedMs:stageStartedMs,endedMs,maxCycles:effectiveMaxCycles}),responsePreview:String(lastRaw||'').slice(0,1200)});
}

async function runThemeSingleDecisionAcrossProviders(env,model,image,behavior,selection,providers=[],laneRun=null){
  const code=String(selection?.code||'').toUpperCase(),ordered=themeStableProviderRotation(code,providers),attempts=[],startedMs=Date.now();
  let lastError=null,lastRaw='';
  for(let attemptNumber=1;attemptNumber<=ordered.length;attemptNumber++){
    const provider=ordered[attemptNumber-1],attemptStartedMs=Date.now();
    const perform=async()=>{
      const attemptEnv=providerCycleAttemptEnv(env,provider,'theme-decision-audit',attemptNumber);
      providerProgressEvent(attemptEnv,{event:'provider-attempt-start',stage:'theme-decision-audit',themeCode:code,cycle:attemptNumber,provider,providerRole:themeProviderRole(provider),model:themeProviderModel(env,provider,model),state:'running'});
      let raw='';
      try{
        raw=String(await runStructured(attemptEnv,model,image,themeSingleDecisionGatePrompt(selection),null,24,'text',{behavior,temperature:0,themeDecisionAudit:true,themeDecisionAuditBinary:true,themeDecisionAuditSingleTheme:true,themeDecisionAuditUnordered:true,providerCallTimeoutMs:30000,preserveWhitespace:true}));
        const decision=parseThemeSingleDecisionGate(raw);
        if(!decision)throw diagnosticError(`Theme decision audit for ${code} did not return an unambiguous KEEP/REJECT decision.`,{phase:'theme-decision-audit-incomplete',failureKind:'malformed-or-incomplete',themeCode:code,responsePreview:raw.slice(0,1200)});
        const endedMs=Date.now();mergeProviderTrace(env,attemptEnv,`theme-decision-audit:${code}:${provider}`);
        const row={cycle:attemptNumber,provider,outcome:'success',startedAt:timingIso(attemptStartedMs),endedAt:timingIso(endedMs),durationMs:timingDurationMs(attemptStartedMs,endedMs),responsePreview:raw.slice(0,300)};
        attempts.push(row);
        providerProgressEvent(env,{event:'provider-attempt-success',stage:'theme-decision-audit',themeCode:code,cycle:attemptNumber,provider,providerRole:themeProviderRole(provider),model:themeProviderModel(env,provider,model),state:'success',durationMs:row.durationMs,decision});
        return{code,decision,audit:themeSingleDecisionAuditRow(selection,decision),winningProvider:provider,attempts:[...attempts],durationMs:timingDurationMs(startedMs,endedMs)};
      }catch(error){
        const endedMs=Date.now();mergeProviderTrace(env,attemptEnv,`theme-decision-audit:${code}:${provider}:failed`);lastError=error;lastRaw=raw;
        const failure=providerCycleFailureRow(error,{cycle:attemptNumber,provider,raw,startedMs:attemptStartedMs,endedMs});failure.themeCode=code;attempts.push(failure);
        providerProgressEvent(env,{event:'provider-attempt-failure',stage:'theme-decision-audit',themeCode:code,cycle:attemptNumber,provider,providerRole:themeProviderRole(provider),model:themeProviderModel(env,provider,model),state:'failure',durationMs:failure.durationMs,failurePhase:failure.failurePhase,failureKind:failure.failureKind,errorMessage:failure.errorMessage});
        throw error;
      }
    };
    try{return await(laneRun?laneRun(provider,perform):perform());}catch(error){lastError=error;}
  }
  throw diagnosticError(lastError?.message||`Theme decision audit exhausted for ${code}.`,{phase:'theme-decision-audit-theme-exhausted',failureKind:'reviewer-technical-exhausted',themeCode:code,attempts,responsePreview:String(lastRaw||'').slice(0,1200)});
}

async function runThemeSelectedDecisionAudit(env,model,image,behavior,selections=[]){
  const unique=[],seen=new Set();for(const row of selections||[]){const code=String(row?.code||'').toUpperCase();if(code&&!seen.has(code)){seen.add(code);unique.push(row);}}
  if(!unique.length)throw diagnosticError('Theme decision audit received no Themes.',{phase:'theme-decision-audit-setup',failureKind:'no-themes'});
  const pinned=String(env?.__GENREACTRIX_THEME_PINNED_PROVIDER||'').toLowerCase();
  const providers=pinned?[pinned]:[...THEME_PROVIDER_CYCLE_ORDER];
  const laneRun=pinned?null:themeProviderLaneExecutor();
  let settled;
  if(pinned){
    const taskResults=new Array(unique.length);let cursor=0;
    const worker=async()=>{for(;;){const index=cursor++;if(index>=unique.length)return;try{taskResults[index]={status:'fulfilled',value:await runThemeSingleDecisionAcrossProviders(env,model,image,behavior,unique[index],providers,null)};}catch(reason){taskResults[index]={status:'rejected',reason};}}};
    await Promise.all(Array.from({length:Math.min(2,unique.length)},worker));settled=taskResults;
  }else{
    settled=await Promise.allSettled(unique.map(selection=>runThemeSingleDecisionAcrossProviders(env,model,image,behavior,selection,providers,laneRun)));
  }
  const results=settled.filter(row=>row.status==='fulfilled').map(row=>row.value);
  if(results.length<unique.length){
    const failures=settled.filter(row=>row.status==='rejected').map(row=>String(row.reason?.message||row.reason).slice(0,900));
    throw diagnosticError(`Theme decision audit completed ${results.length}/${unique.length} one-Theme decisions.`,{phase:'theme-decision-audit-incomplete',failureKind:'reviewer-technical-exhausted',themeSetSemantics:'unordered-equal',successfulCodes:results.map(row=>row.code),failedCodes:unique.map(row=>String(row.code||'').toUpperCase()).filter(code=>!results.some(result=>result.code===code)),failures});
  }
  const diagnostic=buildPerThemeDecisionDiagnostic(unique,results);
  if(diagnostic.providerCycle.attempts.some(row=>row.outcome==='failure'))diagnostic.technicalRecovery={schemaVersion:3,type:'per-theme-provider-retry',attemptCount:diagnostic.providerCycle.attemptCount,perTheme:diagnostic.providerCycle.perTheme};
  return diagnostic;
}

async function runThemeReportingDiagnostic(env,model,image,behavior,selections=[],themeSweep=null){
  const cycle=await runThemeProviderCycle(env,model,{
    stage:'theme-reporting-diagnostic',image,maxTokens:3600,behavior,temperature:0,
    options:{themeReasoningDiagnostic:true,themeReportingDiagnostic:true,providerCallTimeoutMs:PROMPT_DIAGNOSTIC_PROVIDER_CALL_TIMEOUT_MS,preserveWhitespace:true},
    promptForCycle:cycleNumber=>themeReasoningPrompt(selections,themeSweep)+(cycleNumber===1?'':`\n\nFORMAT RECOVERY: Return only EVIDENCE, PRIM, CANDIDATE, and SELECTED records exactly as specified. Include all ${PRIMFUSION_REGISTRY.primitives.length} active PRIM records and every locked SELECTED record.`),
    validate:raw=>{
      const parsed=parseThemeReasoningDiagnostic(raw,selections,themeSweep);
      const validPrimCount=parsed.primScores.filter(row=>Number.isFinite(row.score)).length,validAuditCount=parsed.selectedAudits.filter(row=>row.status!=='UNPARSED').length;
      if(validPrimCount<PRIMFUSION_REGISTRY.primitives.length||validAuditCount<selections.length)throw diagnosticError(`Theme reasoning diagnostic incomplete: ${validPrimCount}/${PRIMFUSION_REGISTRY.primitives.length} Prim scores and ${validAuditCount}/${selections.length} selected audits.`,{phase:'theme-reporting-diagnostic-incomplete',failureKind:'malformed-or-incomplete'});
      return parsed;
    }
  });
  cycle.result.providerCycle=cycle.recovery;
  if(cycle.recovery.attemptCount>1)cycle.result.technicalRecovery={schemaVersion:2,type:'provider-cycle',policy:cycle.recovery.policy,winningCycle:cycle.recovery.winningCycle,winningProvider:cycle.recovery.winningProvider,attemptCount:cycle.recovery.attemptCount,attempts:cycle.recovery.attempts};
  return cycle.result;
}

async function runThemeHumanVoteExperiment(env,model,image,behavior='analyze',themeSweep=null,{excludedThemeCodes=[]}={}){
  const cycle=await runThemeProviderCycle(env,model,{
    stage:'preliminary-theme-selection',image,maxTokens:500,behavior,temperature:0,
    options:{themeHumanVoteRawExperiment:true,themeSweepPass:Number(themeSweep?.pass)||null},
    promptForCycle:cycleNumber=>themeHumanVoteExperimentPrompt(themeSweep,{excludedThemeCodes})+(cycleNumber===1?'':'\n\nFORMAT RECOVERY: Return only ranks 1, 2, and 3 using PFM#### or BLANK exactly as specified. Do not add any other text.'),
    validate:raw=>parseThemeHumanVoteExperiment(raw,{excludedThemeCodes})
  });
  const parsed=cycle.result;
  return {
    selections:parsed.selections,
    diagnostics:{
      schemaVersion:1,
      protocol:'human-vote-expected-score-raw-v1-theme-sweep-order-aware',
      experimental:true,
      frozenControlWorker:'0.9.6.84-theme-exhaustion-slop-warning',
      priorExperimentWorker:'0.9.6.87-human-vote-shuffled-rerun-experiment',
      themeDefinitionOrder:resolveHumanVoteThemeOrder(themeSweep).mode,
      themeDefinitionOrderSeed:resolveHumanVoteThemeOrder(themeSweep).seed,
      themeSweepId:themeSweep?.sweepId||null,
      themeSweepPass:Number(themeSweep?.pass)||null,
      imageAccess:true,
      descriptionContextUsed:false,
      reactionScoresUsed:false,
      selectionCallCount:cycle.recovery.attemptCount,
      providerCycle:cycle.recovery,
      scoreBands:{humanRank1:10000,humanRanks2to4:2000,humanRanks5to8:500,humanRanks9to12:125,blank:-500,outsideTop12SelectedByHuman:-1000,selectedByNoHumans:-10000},
      submittedRows:parsed.submittedRows,
      selectedCodes:parsed.selections.map(row=>row.code),
      blankCount:parsed.blankCount,
      confidenceGenerated:false,
      rationaleGenerated:true,
      excludedThemeCodes:[...(excludedThemeCodes||[])]
    }
  };
}


async function runPreliminaryThemeMismatchRecovery(env,model,image,behavior='analyze',themeSweep=null){
  const first=await runThemeHumanVoteExperiment(env,model,image,behavior,themeSweep),blocked=first.selections.filter(themeSelectionContradictsDefinition).map(row=>row.code);
  if(!blocked.length)return{result:first,recovery:null};
  const second=await runThemeHumanVoteExperiment(env,model,image,behavior,themeSweep,{excludedThemeCodes:blocked});
  return{result:second,recovery:{schemaVersion:3,trigger:'preliminary-self-contradiction',rollbackTarget:'preliminary-theme-selection',rerunReason:'preliminary-self-contradiction',mode:'blocked-rescan',blockedThemeCodes:[...blocked],initialSelectedCodes:first.selections.map(row=>row.code),rescanSelectedCodes:second.selections.map(row=>row.code),rescanCount:1,initialProviderCycle:first.diagnostics?.providerCycle||null,rescanProviderCycle:second.diagnostics?.providerCycle||null}};
}

// v0.9.6.94 — fresh analysis pipeline:
// raw image -> preliminary Theme hypotheses -> Theme-aware Description ->
// final Theme selection from Description only. Preliminary Themes never flow
// directly into the final selector.
function themeAssociationCatalog(themeSweep=null,stage='preliminary',excludedThemeCodes=[]){
  const blocked=new Set((excludedThemeCodes||[]).map(code=>String(code||'').toUpperCase()));
  const byCode=new Map(PRIMFUSION_REGISTRY.aiThemeChoices.map(t=>[t.code,t]));
  const order=resolveThemeAssociationOrder(themeSweep,stage);
  return order.codes.filter(code=>!blocked.has(code)).map(code=>byCode.get(code)).filter(Boolean).map(t=>`${t.code} — ${t.name}: ${t.aiMeaning}`).join('\n');
}

function themeAssociationPrompt({description='',themeSweep=null,stage='preliminary',excludedThemeCodes=[],confirmationContext=''}={}){
  const blocked=[...new Set((excludedThemeCodes||[]).map(code=>String(code||'').toUpperCase()))],catalog=themeAssociationCatalog(themeSweep,stage,blocked);
  const exclusionNote=blocked.length?`\n\nRECOVERY EXCLUSIONS: ${blocked.join(', ')} are unavailable in this rescan because the prior result contradicted them. Do not return an excluded code.`:'';
  const confirmation=String(confirmationContext||'').trim();
  if(stage==='final'){
    return `FINAL GENREACTRIX THEME SELECTION — DESCRIPTION ONLY.\n\nWhich three of the available Themes would a human viewer be most likely to associate with an image matching this description? Rank them from strongest to weakest fit.${exclusionNote}${confirmation?`\n\nCONFIRMATION CHECK — the prior audit questioned, but did not prove wrong, one or more Themes. They remain eligible. Reconsider them against the same Description and keep them if they are still among the three best fits:\n${confirmation}`:''}\n\nIMAGE DESCRIPTION:\n${String(description||'').trim()}\n\nCURRENT AVAILABLE THEME DEFINITIONS:\n${catalog}\n\nReturn exactly three lines and no other text:\n1|PFM####|one short description-grounded reason\n2|PFM####|one short description-grounded reason\n3|PFM####|one short description-grounded reason`;
  }
  return `PRELIMINARY GENREACTRIX THEME HYPOTHESES — IMAGE ONLY.\n\nLook directly at the image. Which three of the available Themes would a human viewer be most likely to associate with this image? These are preliminary hypotheses for a later Description pass and may be wrong. Rank the three strongest possibilities from strongest to weakest.${exclusionNote}\n\nCURRENT AVAILABLE THEME DEFINITIONS:\n${catalog}\n\nReturn exactly three lines and no other text:\n1|PFM####|one short visible basis\n2|PFM####|one short visible basis\n3|PFM####|one short visible basis`;
}

function parseThemeAssociation(raw,{excludedThemeCodes=[]}={}){
  const blocked=new Set((excludedThemeCodes||[]).map(code=>String(code||'').toUpperCase()));
  const validCodes=new Set(PRIMFUSION_REGISTRY.aiThemeChoices.map(row=>row.code).filter(code=>!blocked.has(code)));
  const rows=new Map(),used=new Set();
  for(const sourceLine of String(raw||'').replace(/\r/g,'').split('\n')){
    const line=sourceLine.trim().replace(/^[-*•]\s*/,'');
    if(!line)continue;
    const parts=line.split('|').map(x=>x.trim());
    if(parts.length<2)continue;
    const rank=Number(String(parts[0]||'').replace(/[^0-9]/g,''));
    const code=String(parts[1]||'').toUpperCase();
    if(![1,2,3].includes(rank)||rows.has(rank)||!validCodes.has(code)||used.has(code))continue;
    const rationale=parts.slice(2).join('|').replace(/\s+/g,' ').trim().slice(0,700);
    rows.set(rank,{rank,source:'matrix',code,confidence:null,rationale});
    used.add(code);
  }
  if(rows.size!==3)throw new Error(`Theme association selector returned ${rows.size} valid ranked Themes instead of 3.`);
  return [1,2,3].map(rank=>rows.get(rank));
}

async function runThemeAssociation(env,model,{image=null,description='',behavior='analyze',themeSweep=null,stage='preliminary',excludedThemeCodes=[],confirmationContext=''}={}){
  const cycle=await runThemeProviderCycle(env,model,{
    stage:`theme-association-${stage}`,image:stage==='final'?null:image,maxTokens:650,behavior,temperature:0,
    options:{themeSweepPass:Number(themeSweep?.pass)||null},
    promptForCycle:cycleNumber=>themeAssociationPrompt({description,themeSweep,stage,excludedThemeCodes,confirmationContext})+(cycleNumber===1?'':'\n\nFORMAT RECOVERY: Return exactly ranks 1, 2, and 3 using valid, non-excluded PFM#### codes, one row per line, with no other text.'),
    validate:raw=>parseThemeAssociation(raw,{excludedThemeCodes})
  });
  const selections=cycle.result;
  return {selections,diagnostics:{schemaVersion:1,protocol:stage==='final'?'description-only-human-association-v1':'image-only-preliminary-human-association-v1',stage,imageAccess:stage!=='final',descriptionAccess:stage==='final',themeDefinitionOrder:resolveThemeAssociationOrder(themeSweep,stage).mode,themeDefinitionOrderSeed:resolveThemeAssociationOrder(themeSweep,stage).seed,themeSweepId:themeSweep?.sweepId||null,themeSweepPass:Number(themeSweep?.pass)||null,selectedCodes:selections.map(row=>row.code),selectionCallCount:cycle.recovery.attemptCount,providerCycle:cycle.recovery,excludedThemeCodes:[...(excludedThemeCodes||[])],confirmationContextUsed:Boolean(String(confirmationContext||'').trim())}};
}


function themeRecoverySignals(diagnostic,selections=[]){
  const audits=Array.isArray(diagnostic?.selectedAudits)?diagnostic.selectedAudits:[],hard=new Set(),soft=new Set();
  for(const row of selections||[])if(themeSelectionContradictsDefinition(row))hard.add(String(row.code||'').toUpperCase());
  for(const audit of audits){
    const code=String(audit?.code||'').toUpperCase();if(!code)continue;
    if(audit.automaticContradictionRepair===true)hard.add(code);
    else if(audit.gate==='GATE_FAIL')soft.add(code);
  }
  for(const code of hard)soft.delete(code);
  return{hardCodes:[...hard],softCodes:[...soft]};
}
function themeConfirmationContext(diagnostic,codes=[]){
  const wanted=new Set((codes||[]).map(code=>String(code||'').toUpperCase()));
  return (diagnostic?.selectedAudits||[]).filter(row=>wanted.has(String(row.code||'').toUpperCase())).map(row=>`${row.code}: ${String(row.reason||'').trim()||'Audit questioned the fit.'}`).join('\n');
}
/** @param {{description?:string,initialDecision?:any,themeSweep?:any}} options */
async function runFreshThemeMismatchRecovery(env,model,image,behavior,options={}){
  const {description='',initialDecision,themeSweep=null}=options;
  const initialResolved=resolveThemes(initialDecision.selections);
  let initialDiagnostic;
  try{
    initialDiagnostic=await runThemeSelectedDecisionAudit(env,model,image,behavior,initialResolved);
  }catch(error){
    const d=providerDiagnosticOf(error)||{};
    // This same-path audit exists to improve mismatch recovery. A technical audit
    // failure is not semantic evidence against the Theme set and must not kill
    // an otherwise usable result; downstream independent review remains mandatory.
    return{resolvedThemes:initialResolved,finalDecision:initialDecision,diagnostic:{schemaVersion:4,status:'technical-unavailable',protocol:'selected-theme-decision-audit-v4-single-theme-binary-unordered',themeSetSemantics:'unordered-equal',auditUnit:'one-theme-per-request',selectedAudits:[],technicalFailure:{phase:d.phase||null,failureKind:d.failureKind||null,errorMessage:String(error?.message||error).slice(0,1200)}},recovery:{schemaVersion:4,trigger:'same-path-audit-technical-unavailable',rollbackTarget:null,rerunReason:'technical-audit-failure-is-not-semantic-evidence',acceptedOriginal:true,rescanCount:0,technicalFailureNonFatal:true}};
  }
  const signals=themeRecoverySignals(initialDiagnostic,initialDecision.selections);
  if(!signals.hardCodes.length&&!signals.softCodes.length)return{resolvedThemes:initialResolved,finalDecision:initialDecision,diagnostic:initialDiagnostic,recovery:null};
  const hard=signals.hardCodes.length>0,mode=hard?'blocked-rescan':'unblocked-confirmation-rescan',blocked=hard?signals.hardCodes:[],questioned=hard?signals.hardCodes:signals.softCodes;
  const rescan=await runThemeAssociation(env,model,{description,behavior,themeSweep,stage:'final',excludedThemeCodes:blocked,confirmationContext:hard?'':themeConfirmationContext(initialDiagnostic,questioned)}),rescanResolved=resolveThemes(rescan.selections),rescanCodes=new Set(rescan.selections.map(row=>row.code));
  if(!hard&&questioned.every(code=>rescanCodes.has(code))){
    return{resolvedThemes:initialResolved,finalDecision:initialDecision,diagnostic:initialDiagnostic,recovery:{schemaVersion:3,trigger:'audit-gate-fail',rollbackTarget:'final-theme-selection',rerunReason:'downstream-audit-questioned-final-selection',mode,blockedThemeCodes:[],questionedThemeCodes:questioned,initialSelectedCodes:initialDecision.selections.map(row=>row.code),rescanSelectedCodes:rescan.selections.map(row=>row.code),acceptedRescan:false,confirmationRetainedOriginal:true,rescanCount:1,initialFinalProviderCycle:initialDecision.diagnostics?.providerCycle||null,initialDiagnosticProviderCycle:initialDiagnostic?.providerCycle||null,rescanProviderCycle:rescan.diagnostics?.providerCycle||null}};
  }
  let finalDiagnostic,postSignals={hardCodes:[],softCodes:[]},finalAuditTechnicalFailure=null;
  try{finalDiagnostic=await runThemeSelectedDecisionAudit(env,model,image,behavior,rescanResolved);postSignals=themeRecoverySignals(finalDiagnostic,rescan.selections);}
  catch(error){const d=providerDiagnosticOf(error)||{};finalAuditTechnicalFailure={phase:d.phase||null,failureKind:d.failureKind||null,errorMessage:String(error?.message||error).slice(0,1200)};finalDiagnostic={schemaVersion:4,status:'technical-unavailable',protocol:'selected-theme-decision-audit-v4-single-theme-binary-unordered',themeSetSemantics:'unordered-equal',selectedAudits:[],technicalFailure:finalAuditTechnicalFailure};}
  return{resolvedThemes:rescanResolved,finalDecision:rescan,diagnostic:finalDiagnostic,recovery:{schemaVersion:4,trigger:hard?'theme-evidence-contradiction':'audit-gate-fail',rollbackTarget:'final-theme-selection',rerunReason:hard?'downstream-audit-found-theme-evidence-contradiction':'downstream-audit-questioned-final-selection',mode,blockedThemeCodes:blocked,questionedThemeCodes:questioned,initialSelectedCodes:initialDecision.selections.map(row=>row.code),rescanSelectedCodes:rescan.selections.map(row=>row.code),acceptedRescan:true,confirmationRetainedOriginal:false,rescanCount:1,postRescanHardCodes:postSignals.hardCodes,postRescanSoftCodes:postSignals.softCodes,initialFinalProviderCycle:initialDecision.diagnostics?.providerCycle||null,initialDiagnosticProviderCycle:initialDiagnostic?.providerCycle||null,rescanProviderCycle:rescan.diagnostics?.providerCycle||null,finalDiagnosticProviderCycle:finalDiagnostic?.providerCycle||null,finalAuditTechnicalFailureNonFatal:Boolean(finalAuditTechnicalFailure),finalAuditTechnicalFailure}};
}


function comparePreliminaryFinalThemes(preliminaryThemes=[],finalThemes=[]){
  const preliminaryCodes=(preliminaryThemes||[]).map(row=>String(row?.code||'').toUpperCase()).filter(Boolean);
  const finalCodes=(finalThemes||[]).map(row=>String(row?.code||'').toUpperCase()).filter(Boolean);
  const finalSet=new Set(finalCodes),overlapCodes=preliminaryCodes.filter(code=>finalSet.has(code));
  const exactRankMatches=preliminaryCodes.filter((code,index)=>code&&code===finalCodes[index]);
  const union=new Set([...preliminaryCodes,...finalCodes]);
  return{schemaVersion:1,protocol:'preliminary-vs-final-description-only-v1',preliminaryCodes,finalCodes,overlapCodes,overlapCount:overlapCodes.length,exactRankMatchCodes:exactRankMatches,exactRankMatchCount:exactRankMatches.length,jaccard:union.size?Number((overlapCodes.length/union.size).toFixed(4)):0,finalSelectionSource:'description-only',preliminaryPassedDirectlyToFinal:false};
}
function themeReviewProviderOrder(runProvider){
  const order=[...THEME_PROVIDER_CYCLE_ORDER],index=order.indexOf(runProvider);
  if(index<0)return order;
  return [...order.slice(index+1),...order.slice(0,index)].filter(provider=>provider!==runProvider);
}
async function runIndependentThemeReview(env,model,image,behavior,selections=[],themeSweep=null,runProvider=''){
  const unique=[],seen=new Set();for(const row of selections||[]){const code=String(row?.code||'').toUpperCase();if(code&&!seen.has(code)){seen.add(code);unique.push(row);}}
  const reviewers=themeReviewProviderOrder(runProvider);
  if(!reviewers.length)throw diagnosticError('No independent Theme reviewer is available.',{phase:'independent-theme-review-setup',failureKind:'no-independent-reviewer',runProvider});
  const laneRun=themeProviderLaneExecutor();
  const settled=await Promise.allSettled(unique.map(selection=>runThemeSingleDecisionAcrossProviders(env,model,image,behavior,selection,reviewers,laneRun)));
  const results=settled.filter(row=>row.status==='fulfilled').map(row=>row.value);
  const failures=settled.filter(row=>row.status==='rejected').map((row,index)=>({error:String(row.reason?.message||row.reason).slice(0,1000),diagnostic:providerDiagnosticOf(row.reason)||null}));
  const successfulCodes=new Set(results.map(row=>row.code)),failedCodes=unique.map(row=>String(row.code||'').toUpperCase()).filter(code=>!successfulCodes.has(code));
  const attempts=results.flatMap(result=>(result.attempts||[]).map(attempt=>({...attempt,themeCode:result.code})));
  for(const row of settled)if(row.status==='rejected'){
    const d=providerDiagnosticOf(row.reason)||{};for(const attempt of d.attempts||[])attempts.push(attempt);
  }
  if(failedCodes.length){
    throw diagnosticError(`Independent Theme review failed technically for ${failedCodes.length} Theme${failedCodes.length===1?'':'s'}: ${failedCodes.join(', ')}.`,{phase:'independent-theme-review-exhausted',failureKind:'reviewer-technical-exhausted',runProvider,themeSetSemantics:'unordered-equal',failedCodes,successfulCodes:[...successfulCodes],reviewers:[...reviewers],reviewAttempts:attempts,perThemeFailures:failures});
  }
  const diagnostic=buildPerThemeDecisionDiagnostic(unique,results,'selected-theme-decision-audit-v4-independent-per-theme-binary-unordered');
  return{diagnostic,reviewer:'per-theme-independent',reviewers:[...new Set(results.map(row=>row.winningProvider))],attempts:diagnostic.providerCycle.attempts,perTheme:diagnostic.providerCycle.perTheme};
}

function themeReviewSemanticRejects(diagnostic){return (diagnostic?.selectedAudits||[]).filter(row=>row?.status==='REJECT'||row?.gate==='GATE_FAIL').map(row=>String(row.code||'').toUpperCase()).filter(Boolean);}

async function runThemesFromMistralDescriptionThroughExistingProviders(env,model,image,behavior,{description='',themeSweep=null}={}){
  const runChain=async(runEnv)=>{
    const initialFinalDecision=await runThemeAssociation(runEnv,model,{description,behavior,themeSweep,stage:'final'});
    const mismatchRecovery=await runFreshThemeMismatchRecovery(runEnv,model,image,behavior,{description,initialDecision:initialFinalDecision,themeSweep});
    return{initialFinalDecision,mismatchRecovery};
  };
  const primaryEnv=providerRoutingEnv(env,{});
  try{
    const result=await runChain(primaryEnv);
    mergeProviderTrace(env,primaryEnv,'mistral-description-downstream-primary');
    return{...result,recovery:{schemaVersion:1,descriptionProvider:'mistral',themeProviderRoute:'primary',fallbackUsed:false}};
  }catch(primaryError){
    mergeProviderTrace(env,primaryEnv,'mistral-description-downstream-primary');
    const fallbackEnv=providerRoutingEnv(env,{providerRouting:{mode:'fallback',fallbackUntil:Date.now()+60000,reason:'mistral-description-downstream-fallback'}});
    try{
      const result=await runChain(fallbackEnv);
      mergeProviderTrace(env,fallbackEnv,'mistral-description-downstream-fallback');
      return{...result,recovery:{schemaVersion:1,descriptionProvider:'mistral',themeProviderRoute:'fallback',fallbackUsed:true,primaryFailure:String(primaryError?.message||primaryError).slice(0,1000)}};
    }catch(fallbackError){
      mergeProviderTrace(env,fallbackEnv,'mistral-description-downstream-fallback');
      throw diagnosticError(
        `Mistral Description was preserved, but Theme processing failed on primary and fallback providers: ${fallbackError?.message||fallbackError}`,
        {
          phase:'mistral-description-downstream-theme-recovery',
          failureKind:'theme-downstream-failed',
          mistralDescriptionPreserved:true,
          preservedDescription:String(description||'').slice(0,12000),
          preservedDescriptionDiagnostics:{schemaVersion:1,thirdProviderUsed:true,thirdProvider:'mistral',thirdProviderModel:mistralDescriptionModelFor(env)},
          primaryError:String(primaryError?.message||primaryError).slice(0,1200),
          fallbackError:String(fallbackError?.message||fallbackError).slice(0,1200)
        }
      );
    }
  }
}
function zazzlyTerms(){
  const base=PRIMFUSION_REGISTRY.primitives.find(row=>row.id==='P09');
  const fusions=PRIMFUSION_REGISTRY.aiThemeChoices.filter(row=>Array.isArray(row.primIds)&&row.primIds.includes('P09'));
  return [
    ...(base?[{code:base.id,name:base.name,aiMeaning:base.aiMeaning,kind:'prim'}]:[]),
    ...fusions.map(row=>({code:row.code,name:row.name,aiMeaning:row.aiMeaning,kind:'fusion'}))
  ];
}

function isZazzlyThemeCode(code){
  const row=PRIMFUSION_REGISTRY.aiThemeChoices.find(item=>item.code===String(code||'').toUpperCase());
  return Boolean(row&&Array.isArray(row.primIds)&&row.primIds.includes('P09'));
}

function preliminaryThemeDescriptionContext(preliminary=[]){
  const byCode=new Map(PRIMFUSION_REGISTRY.aiThemeChoices.map(row=>[row.code,row]));
  return preliminary.map(row=>byCode.get(row.code)).filter(Boolean).map((row,index)=>`${index+1}. ${row.code} — ${row.name}: ${row.aiMeaning}`).join('\n');
}

function zazzlyDescriptionProtocol(preliminary=[]){
  const triggered=preliminary.some(row=>isZazzlyThemeCode(row.code));
  if(!triggered)return{triggered:false,text:'',preliminaryZazzlyCodes:[],termCount:0};
  const prelimCodes=preliminary.filter(row=>isZazzlyThemeCode(row.code)).map(row=>row.code);
  const catalog=zazzlyTerms();
  const text=`\n\nMANDATORY ZAZZLY COVERAGE — TRIGGERED BY THE PRELIMINARY THEMES.\nZazzly appeared in the preliminary Theme hypotheses. This trigger is absolute. Perform an exhaustive check of ALL ${catalog.length} Zazzly terms below every time; do not stop after confirming one term.\n\nTreat every preliminary Zazzly-associated Theme as a strong 95% prior that the specific concept is genuinely present. Explicitly discuss the image evidence for that concept when reasonably supportable. The remaining 4.9% possibility belongs to the other Zazzly terms and is not a generic fallback bucket: inspect every alternative individually. Crucially, this 4.9% cross-check still happens even when the 95% preliminary Zazzly hypothesis is clearly supported. Continue through all ${catalog.length} terms every time. Only after all ${catalog.length} terms are unsupported may the Zazzly signal be treated as the 0.1% fully spurious case.\n\nThis is not merely an instruction to notice the evidence internally. The finished Description must actually SAY the reasonably supported Zazzly-relevant aspects. Directly and neutrally describe relevant body presentation, exposure, nudity, skin, underwear or revealing clothing, posing, sexual or erotic presentation, exhibitionistic framing, humiliation, lewdness, seduction, kink, indulgence, or other Zazzly-term evidence when it is visibly supported. Do not sanitize, euphemize, or silently omit those aspects.\n\nALL ${catalog.length} ZAZZLY TERMS — CHECK EACH ONE:\n${catalog.map((row,index)=>`${index+1}. ${row.code} — ${row.name}: ${String(row.aiMeaning||'').replace(/\s+/g,' ').trim()}`).join('\n')}`;
  return{triggered:true,text,preliminaryZazzlyCodes:prelimCodes,termCount:catalog.length};
}

function freshDescriptionPrompt({directorGuidance='',preliminaryThemes=[]}={}){
  const guidance=String(directorGuidance||'').trim().slice(0,6000);
  const preliminary=preliminaryThemeDescriptionContext(preliminaryThemes);
  const zazzly=zazzlyDescriptionProtocol(preliminaryThemes);
  return `GENREACTRIX DESCRIPTION PASS.\n\nDescribe what is visibly present in this image clearly, concretely, and substantially. The Description must be comfortable describing any kind of image. Include people, bodies, clothing or nudity, poses, expressions, actions, physical contact, setting, objects, visible text, composition, and overall presentation whenever they are materially relevant. Sexual, erotic, violent, humiliating, grotesque, disturbing, or otherwise explicit content may be important evidence: describe it directly and neutrally rather than softening, sanitizing, euphemizing, or replacing it with a milder caption.\n\nThe preliminary Themes below are hypotheses, not final answers. Use them as attention cues. Look specifically for concrete image elements that could reasonably support them and incorporate those aspects into the Description when they are reasonably supported. If a non-Zazzly preliminary Theme is genuinely a long shot, ignore that hypothesis rather than forcing it.\n\nPRELIMINARY THEME HYPOTHESES:\n${preliminary||'None'}${zazzly.text}${guidance?`\n\nDIRECTOR GUIDANCE:\n${guidance}`:''}\n\nReturn only the completed Description as plain prose. Do not return Theme rankings, a checklist, JSON, Markdown, or commentary about these instructions.`;
}

function descriptionLimitationDetected(text){
  const value=String(text||'').trim();
  if(!value)return true;
  return /\b(?:i|we)\s+(?:can(?:not|'t)|am unable|are unable)\b/i.test(value)
    || /\b(?:cannot|can't|unable to)\s+(?:describe|provide|comply|assist|help|analy[sz]e)\b/i.test(value)
    || /\b(?:i(?:'m| am) sorry,? but|i must refuse|content policy|policy prevents|cannot fulfill)\b/i.test(value)
    || /\b(?:non-explicit|less explicit|safer)\s+(?:description|version|summary)\b/i.test(value);
}

function mergeProviderTrace(targetEnv,sourceEnv,label='description-backup'){
  const target=providerTrace(targetEnv),source=providerTrace(sourceEnv);
  if(!target||!source)return;
  for(const row of source)target.push({...row,recoveryRole:label});
}

function alternateProviderEnv(env){
  const route=providerRoute(env);
  const currentlyFallback=route?.mode==='fallback'&&Number(route.fallbackUntil)>Date.now();
  return {env:providerRoutingEnv(env,currentlyFallback?{}:{providerRouting:{mode:'fallback',fallbackUntil:Date.now()+60000,reason:'description-local-backup'}}),from:currentlyFallback?'fallback':'primary',to:currentlyFallback?'primary':'fallback'};
}

function mistralDescriptionText(payload){
  const content=payload?.choices?.[0]?.message?.content;
  if(typeof content==='string')return content.trim();
  if(Array.isArray(content))return content.map(part=>typeof part==='string'?part:String(part?.text||part?.content||'')).filter(Boolean).join('\n').trim();
  const value=responseValue(payload);
  return typeof value==='string'?value.trim():'';
}

async function runMistralTextProvider(env,image,prompt,{maxTokens=3400,temperature=0.08,timeoutMs=PROVIDER_CALL_TIMEOUT_MS,phase='mistral-provider'}={}){
  const apiKey=String(env?.MISTRAL_API_KEY||'').trim();
  const model=mistralDescriptionModelFor(env);
  if(!apiKey)throw diagnosticError('Mistral provider is not configured: MISTRAL_API_KEY is missing.',{phase,provider:'mistral-direct',model});
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{
    const content=image&&((image.byteLength||image.length)>0)?[{type:'text',text:prompt},{type:'image_url',image_url:imageBytesDataUrl(image)}]:prompt;
    const response=await fetch('https://api.mistral.ai/v1/chat/completions',{
      method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${apiKey}`},
      body:JSON.stringify({model,messages:[{role:'user',content}],max_tokens:maxTokens,temperature}),signal:controller.signal
    });
    const raw=await response.text();let payload=null;try{payload=raw?JSON.parse(raw):null;}catch{}
    if(!response.ok){const detail=String(payload?.message||payload?.error?.message||raw||`HTTP ${response.status}`).slice(0,1200);throw diagnosticError(`Mistral provider failed (${response.status}): ${detail}`,{phase,provider:'mistral-direct',model,status:response.status,errorMessage:detail});}
    const text=mistralDescriptionText(payload);
    if(!text)throw diagnosticError('Mistral provider returned no text.',{phase,provider:'mistral-direct',model,status:response.status,responsePreview:raw.slice(0,1200)});
    providerTraceEvent(env,{provider:'mistral-direct',model,outcome:'success'});
    return{text,model};
  }catch(error){
    const timedOut=error?.name==='AbortError';const message=timedOut?`Mistral provider timed out after ${Math.round(timeoutMs/1000)}s`:String(error?.message||error);
    providerTraceEvent(env,{provider:'mistral-direct',model,outcome:'failure',errorMessage:message.slice(0,500)});
    if(providerDiagnosticOf(error))throw error;
    throw diagnosticError(message,{phase,provider:'mistral-direct',model,errorName:error?.name||null,errorMessage:message.slice(0,1200)});
  }finally{clearTimeout(timer);}
}

async function runMistralDescriptionFallback(env,image,prompt){
  return runMistralTextProvider(env,image,prompt,{maxTokens:3400,temperature:0.08,phase:'mistral-description-provider'});
}

async function runFreshThemeAwareDescription(env,model,image,{behavior='analyze',directorGuidance='',preliminaryThemes=[]}={}){
  const prompt=freshDescriptionPrompt({directorGuidance,preliminaryThemes});
  const zazzly=zazzlyDescriptionProtocol(preliminaryThemes);
  const cycle=await runThemeProviderCycle(env,model,{
    stage:'theme-aware-description',image,maxTokens:3400,behavior,temperature:0.08,options:{multimodalMessages:true},
    promptForCycle:cycleNumber=>prompt+(cycleNumber===1?'':'\n\nRECOVERY CYCLE: Produce the required complete Description directly. Do not mention prior provider failures or recovery.'),
    validate:raw=>{const text=String(raw||'').trim();if(descriptionLimitationDetected(text))throw diagnosticError('Description response showed a refusal/limitation pattern.',{phase:'theme-aware-description-limitation',failureKind:'provider-output-limitation'});return text;}
  });
  const winner=cycle.recovery.winningProvider,winnerRole=themeProviderRole(winner);
  return{description:cycle.result,diagnostics:{schemaVersion:3,protocol:'preliminary-theme-aware-description-v3-provider-roster',zazzlyTriggered:zazzly.triggered,zazzlyTermCount:zazzly.termCount,preliminaryZazzlyCodes:zazzly.preliminaryZazzlyCodes,providerCycle:cycle.recovery,winningProvider:winner,winningProviderRole:winnerRole,winningProviderModel:themeProviderModel(env,winner,model),backupUsed:winnerRole!=='primary',backupAttempted:cycle.recovery.attemptCount>1,thirdProviderUsed:winnerRole==='third',thirdProvider:winnerRole==='third'?winner:null,thirdProviderModel:winnerRole==='third'?themeProviderModel(env,winner,model):null}};
}



// v0.9.6.87 EXPERIMENT — preserve the already-flagged image records by allowing
// an ordinary all-three Theme Rerun to exercise the exact v0.9.6.86 selector.
// Specialized Director constraints remain on the frozen rerun pipeline so this
// comparison does not silently discard Preserve/Replace/PrimPicker/Exclusions.
function themeHumanVoteRerunExperimentEligible(rerun){
  const normalized=normalizeThemeRerun(rerun);if(!normalized)return false;
  if(normalized.themeSlots.some(row=>row.state!=='neutral'))return false;
  if(normalized.excludedThemeCodes.length)return false;
  if(normalized.primPicker.some(row=>Array.isArray(row.assignments)&&row.assignments.length))return false;
  return true;
}
function themeHumanVoteRerunExperimentPrompt(rerun){
  const normalized=normalizeThemeRerun(rerun),base=themeHumanVoteExperimentPrompt(null);
  if(!normalized?.includedDescriptions?.length)return base;
  const descriptionContext=normalized.includedDescriptions.map((row,index)=>`REFERENCE DESCRIPTION ${index+1}${row.createdAt?` — ${row.createdAt}`:''}${row.version?` — v${row.version}`:''}:\n${row.text}`).join('\n\n');
  const marker='\n\nOUTPUT ONLY these three ranked rows, one per line:';
  const block=`\n\nOPTIONAL REFERENCE DESCRIPTION CONTEXT — explicitly included by the Director:\n${descriptionContext}\n\nUse this context only as additional information about the same image. The image remains authoritative.`;
  return base.includes(marker)?base.replace(marker,block+marker):base+block;
}
async function runThemeHumanVoteRerunExperiment(env,model,image,behavior,rerunInput){
  const rerun=normalizeThemeRerun(rerunInput);if(!rerun)throw new Error('Theme Rerun request was missing.');
  if(!themeHumanVoteRerunExperimentEligible(rerun))throw new Error('Theme human-vote rerun experiment received Director constraints and must use the frozen constrained rerun pipeline.');
  const cycle=await runThemeProviderCycle(env,model,{
    stage:'theme-rerun-human-vote-selection',image,maxTokens:500,behavior,temperature:0,
    options:{themeRerun:true,themeHumanVoteRawExperiment:true,themeHumanVoteRerunExperiment:true},
    promptForCycle:cycleNumber=>themeHumanVoteRerunExperimentPrompt(rerun)+(cycleNumber===1?'':'\n\nFORMAT RECOVERY: Return only ranks 1, 2, and 3 using PFM#### or BLANK exactly as specified. Do not add any other text.'),
    validate:raw=>parseThemeHumanVoteExperiment(raw)
  });
  const parsed=cycle.result;
  return{
    rerun,selections:parsed.selections,
    diagnostics:{
      schemaVersion:1,protocol:'human-vote-expected-score-raw-v1-fixed-shuffled-order-rerun',experimental:true,
      sourceExperimentWorker:'0.9.6.86-human-vote-shuffled-order-experiment',frozenControlWorker:'0.9.6.84-theme-exhaustion-slop-warning',
      themeDefinitionOrder:'fixed-shuffled-78-v1',imageAccess:true,descriptionContextUsed:rerun.includedDescriptions.length>0,includedDescriptionCount:rerun.includedDescriptions.length,
      reactionScoresUsed:false,selectionCallCount:cycle.recovery.attemptCount,providerCycle:cycle.recovery,
      scoreBands:{humanRank1:10000,humanRanks2to4:2000,humanRanks5to8:500,humanRanks9to12:125,blank:-500,outsideTop12SelectedByHuman:-1000,selectedByNoHumans:-10000},
      submittedRows:parsed.submittedRows,selectedCodes:parsed.selections.map(row=>row.code),blankCount:parsed.blankCount,confidenceGenerated:false,rationaleGenerated:true,recordFlagsTouched:false
    }
  };
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
  return{schemaVersion:1,themeSlots,primPicker,excludedThemeCodes,includedDescriptions,explainChanges:input.explainChanges!==false};
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
function themeRerunEvidencePrompt(rerun){
  const allowDescription=rerun.includedDescriptions.length>0;
  const descriptionBlock=allowDescription?rerun.includedDescriptions.map((row,index)=>`REFERENCE DESCRIPTION ${index+1}${row.createdAt?` — ${row.createdAt}`:''}${row.version?` — v${row.version}`:''}:\n${row.text}`).join('\n\n'):'No AI Description context was included.';
  const outputExample=allowDescription
    ?'E1|image|one concrete fact\nE2|image|one concrete fact\nE3|description|one explicitly supplied description fact'
    :'E1|image|one concrete fact\nE2|image|one concrete fact\nE3|image|one concrete fact';
  const sourceRule=allowDescription
    ?'Use source image or description only.'
    :'Use source image only; do not emit description-sourced lines because no Description was included.';
  return `THEME RERUN — FROZEN EVIDENCE PASS.\n\nDo NOT choose, score, rank, name, or discuss any Genreactrix Theme. Do NOT mention PFM codes. Your only job is to make a compact ledger of evidence that exists BEFORE Theme selection.\n\nRecord concrete, atomic facts from the image and, when present, facts explicitly supplied by the included AI Description. Prefer directly visible properties: subjects, objects, materials, colors, shapes, count, arrangement, actions, expressions, setting, damage, text, spatial relationships, and other observable details. Do not add moods, metaphors, analogies, intentions, personalities, emotional qualities, or thematic interpretations. Description text may supply concrete facts, but generic evaluative praise or engagement language — such as visually appealing, striking, compelling, evocative, thought-provoking, elegant, interesting, beautiful, well-balanced, or inviting the viewer to contemplate — is NOT a factual evidence item and must be omitted from the ledger. Do not convert an ordinary visual fact into a semantic conclusion.\n\nThe image is authoritative. Description-derived evidence may supplement it but may not contradict what is visible. Keep each ledger item to one fact. Aim for 5–12 useful facts.\n\nINCLUDED AI DESCRIPTION CONTEXT:\n${descriptionBlock}\n\nOUTPUT FORMAT — REQUIRED:\n${outputExample}\n\nUse sequential E-numbers. ${sourceRule} Return only ledger lines and nothing else.`;
}
function parseThemeRerunEvidenceLedger(raw,rerun){
  const text=String(raw||'').replace(/\r/g,'').trim();if(!text)throw new Error('Theme Rerun evidence pass returned an empty response.');
  const allowDescription=rerun.includedDescriptions.length>0,rows=[];
  for(const line of text.split('\n')){
    const cleaned=line.replace(/^\s*[-*•]+\s*/,'').trim().replace(/^\|\s*/,'').replace(/\s*\|$/,'');
    const m=cleaned.match(/^E(\d{1,2})\s*\|\s*(image|description)\s*\|\s*(.+)$/i);if(!m)continue;
    const source=m[2].toLowerCase();if(source==='description'&&!allowDescription)continue;
    let fact=String(m[3]||'').replace(/\*{1,2}/g,'').trim().replace(/\s+/g,' ');if(!fact||/\bPFM\d{4}\b/i.test(fact))continue;
    rows.push({source,fact:fact.slice(0,420)});if(rows.length>=16)break;
  }
  if(rows.length<3)throw new Error(`Theme Rerun evidence pass produced only ${rows.length} usable facts; at least 3 are required.`);
  return rows.map((row,index)=>({id:`E${index+1}`,source:row.source,fact:row.fact}));
}
function themeRerunEvidenceText(evidenceLedger){return evidenceLedger.map(row=>`${row.id}|${row.source}|${row.fact}`).join('\n')}
async function runThemeRerunEvidencePass(env,model,image,behavior,rerun){
  let lastError=null;
  const allowDescription=rerun.includedDescriptions.length>0;
  for(let attempt=1;attempt<=2;attempt++){
    try{
      const recovery=attempt===2
        ?(allowDescription?'\n\nRECOVERY: Return only sequential E#|image|fact or E#|description|fact lines. Do not classify the image.':'\n\nRECOVERY: Return only sequential E#|image|fact lines. Do not classify the image. Do not emit description-sourced lines because no Description was included.')
        :'';
      const prompt=themeRerunEvidencePrompt(rerun)+recovery;
      const raw=await runStructured(env,model,image,prompt,null,1200,'text',{behavior,themeRerun:true,themeRerunEvidencePass:true,temperature:0});
      return parseThemeRerunEvidenceLedger(raw,rerun);
    }catch(error){lastError=error;}
  }
  throw diagnosticError(lastError?.message||'Theme Rerun evidence pass failed.',{phase:'theme-rerun-frozen-evidence-pass'});
}
function themeRerunReasonEvidenceRefs(reason){return [...new Set((String(reason||'').match(/\bE\d{1,2}\b/gi)||[]).map(id=>id.toUpperCase()))]}
function themeRerunReasonGrounded(reason,evidenceLedger){
  const valid=new Set((evidenceLedger||[]).map(row=>String(row.id||'').toUpperCase())),refs=themeRerunReasonEvidenceRefs(reason);
  return refs.length>0&&refs.every(id=>valid.has(id));
}
function themeRerunSelectionSchema(rerun,slots=null){
  const wanted=(Array.isArray(slots)&&slots.length?slots:rerun.themeSlots.filter(row=>row.state!=='preserve').map(row=>row.slot)).map(Number);
  const properties={};
  for(const slot of wanted){
    properties[`theme${slot}`]={
      type:'object',
      properties:{
        code:{type:'string'},
        confidence:{type:'number',minimum:0,maximum:100},
        supportEvidenceIds:{type:'array',minItems:1,maxItems:8,items:{type:'string'}}
      },
      required:['code','confidence','supportEvidenceIds'],
      additionalProperties:false
    };
  }
  return{type:'object',properties,required:wanted.map(slot=>`theme${slot}`),additionalProperties:false};
}
function themeRerunPrompt(rerun,sets,evidenceLedger){
  const open=rerun.themeSlots.filter(row=>row.state!=='preserve');
  const unionCodes=new Set();for(const row of open)for(const item of sets[row.slot].candidates)unionCodes.add(item.code);
  const vocabulary=PRIMFUSION_REGISTRY.aiThemeChoices.filter(row=>unionCodes.has(row.code)).map(row=>`${row.code} — ${row.name}: ${row.aiMeaning}`).join('\n');
  const slots=open.map(row=>{
    const current=row.currentThemeCode?` current=${row.currentThemeCode}`:'';
    const mode=row.state==='replace'?'replace':'neutral';
    const candidates=sets[row.slot].candidates.map(item=>`${item.code}:${item.pairWeight}`).join(', ');
    return `Theme ${row.slot} (${mode}${current}) eligible=${candidates}`;
  }).join('\n');
  return `Choose the best eligible PrimFusion Themes for the open slots using ONLY the frozen evidence facts below. Simulate what an ordinary person would most naturally pick from the available Theme vocabulary. Emotional intensity, drama, evocative quality, attention-grabbing quality, expressiveness, aesthetic appeal, novelty, or how interesting a Theme is to discuss MUST NOT give it a ranking advantage. A boring/neutral/Mundane-type Theme must beat a richer or more emotional Theme whenever it is the closer semantic fit. Do not infer playfulness from simplicity/minimalism, silliness from irregularity/random arrangement, coziness from neutral stillness, sweetness from generic pleasantness, or emotional meaning from words like striking/compelling/evocative/thought-provoking. Genuine mood or theatricality still counts when the frozen evidence actually earns it. Evaluate ALL eligible candidates before deciding; do not stop at the first Theme that can be defended. A merely plausible or broad/easy Theme must not outrank a materially closer or more specific Theme. Apply the same ordinary-context cross-check used by the main Theme pipeline: neutral, formal, professional, calm, focused, deliberate, or composed evidence does not itself support comfort, intimacy, desire, obsession, intelligence, grandeur, nostalgia, chaos, or another loaded meaning. The loaded Theme needs separate concrete evidence that earns its semantics. Treat the open slots jointly as one exactly-three ranking subject to their slot-specific eligibility and Director constraints. Confidence measures strength of fit, NOT rank: a second- or third-best Theme may legitimately have low confidence when it is only the closest available choice. Before finalizing, compare every selected Theme against the unselected eligible Themes and replace any selection if an unselected Theme is materially closer to the image evidence. The image is not available in this step. Pair-weight numbers are Director preferences, not confidence scores. 100 is for an exceptionally complete, unmistakable match. Each chosen Theme must cite one or more E# facts that actually support it. Final PFM codes must be different.\n\nReturn only one compact line per open slot:\nSLOT|PFM####|CONFIDENCE|E#[,E#]\nExample: 2|PFM0104|23|E2,E5\n\nFROZEN EVIDENCE\n${themeRerunEvidenceText(evidenceLedger)}\n\nOPEN SLOTS\n${slots}\n\nELIGIBLE DEFINITIONS\n${vocabulary}`;
}
function parseThemeRerunStructured(raw,rerun,sets){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Theme Rerun provider response was not an object.');
  const used=new Set(),selections=[];
  for(const slotRow of rerun.themeSlots){
    const rawRow=raw[`theme${slotRow.slot}`]||{},allowed=new Set(sets[slotRow.slot].candidates.map(item=>item.code));
    const code=slotRow.state==='preserve'?slotRow.currentThemeCode:String(rawRow.code||'').trim().toUpperCase();
    if(!code||!allowed.has(code))throw new Error(`Theme ${slotRow.slot} returned an ineligible PFM code.`);
    if(used.has(code))throw new Error(`Theme Rerun returned duplicate PFM code ${code}.`);used.add(code);
    if(slotRow.state==='preserve')selections.push({rank:slotRow.slot,source:'matrix',code,confidence:slotRow.currentThemeWeight??50,rationale:'Preserved by Director instruction.',supportEvidenceIds:[]});
    else{
      const confidence=Number(rawRow.confidence),rationale=String(rawRow.rationale||'').trim(),supportEvidenceIds=[...new Set((Array.isArray(rawRow.supportEvidenceIds)?rawRow.supportEvidenceIds:[]).map(id=>String(id||'').toUpperCase()).filter(Boolean))];
      if(!Number.isFinite(confidence))throw new Error(`Theme ${slotRow.slot} confidence was invalid.`);
      selections.push({rank:slotRow.slot,source:'matrix',code,confidence:Math.max(0,Math.min(100,confidence)),rationale,supportEvidenceIds});
    }
  }
  return selections;
}
function themeRerunSpecificConfidence(value){
  const text=String(value||'').trim();
  if(!text||/\b0\s*[-–—]\s*100\b/.test(text)||/\bCONFIDENCE(?:_0_TO_100)?\b/i.test(text))return null;
  const percent=text.match(/(?:^|\D)(100|[1-9]?\d(?:\.\d+)?)\s*%/);if(percent)return Math.max(0,Math.min(100,Number(percent[1])));
  const afterCode=text.match(/\bPFM\d{4}\b\s*(?:[|,:;\-–—]\s*)?(100|[1-9]?\d(?:\.\d+)?)(?=\s*(?:%|[|,:;\-–—]|$))/i);if(afterCode)return Math.max(0,Math.min(100,Number(afterCode[1])));
  const whole=text.match(/^(100|[1-9]?\d(?:\.\d+)?)\s*%?$/);return whole?Math.max(0,Math.min(100,Number(whole[1]))):null;
}
function themeRerunSupportRefs(value,evidenceLedger){
  const valid=new Set((evidenceLedger||[]).map(row=>String(row.id||'').toUpperCase()));
  const refs=[...new Set((String(value||'').match(/\bE\d{1,2}\b/gi)||[]).map(id=>id.toUpperCase()))];
  return refs.filter(id=>valid.has(id));
}
function parseThemeRerunSelectionCompactRows(raw,rerun,sets,evidenceLedger){
  const text=typeof raw==='string'?String(raw).replace(/\r/g,'').trim():'';
  const openSlots=rerun.themeSlots.filter(row=>row.state!=='preserve').map(row=>row.slot),allowedBySlot=new Map(openSlots.map(slot=>[slot,new Set(sets[slot].candidates.map(item=>item.code))]));
  const preservedCodes=new Set(rerun.themeSlots.filter(row=>row.state==='preserve').map(row=>row.currentThemeCode).filter(Boolean)),rows=new Map(),used=new Set(preservedCodes);
  const put=(slot,code,score,refs)=>{
    slot=Number(slot);code=String(code||'').toUpperCase();const confidence=themeRerunSpecificConfidence(score),supportEvidenceIds=themeRerunSupportRefs(refs,evidenceLedger);
    if(!openSlots.includes(slot)||rows.has(slot)||!allowedBySlot.get(slot)?.has(code)||used.has(code)||confidence==null||!supportEvidenceIds.length)return false;
    rows.set(slot,{code,confidence,supportEvidenceIds,rationale:''});used.add(code);return true;
  };
  if(raw&&typeof raw==='object'&&!Array.isArray(raw)){
    for(const slot of openSlots){const row=raw[`theme${slot}`]||{};put(slot,row.code,row.confidence,row.supportEvidenceIds||row.evidenceRefs||row.evidence||'');}
  }
  if(text){
    for(const rawLine of text.split('\n')){
      const line=rawLine.replace(/^\s*[-*•]+\s*/,'').replace(/^\s*\|\s*/,'').replace(/\s*\|\s*$/,'').replace(/\*{1,2}/g,'').trim();if(!line||/\b0\s*[-–—]\s*100\b/.test(line)||/\bCONFIDENCE(?:_0_TO_100)?\b/i.test(line))continue;
      // Primary compact contract: 2 PFM0104 23 E2,E5. Pipes/commas/colons are tolerated.
      const m=line.match(/^\s*(?:THEME\s*|SLOT\s*)?([123])\s*(?:[|,:;\-–—]|\s)+\s*(PFM\d{4})\s*(?:[|,:;\-–—]|\s)+\s*(100|[1-9]?\d(?:\.\d+)?)\s*%?\s*(?:[|,:;\-–—]|\s)+\s*((?:E\d{1,2})(?:\s*[,;+ ]\s*E\d{1,2})*)\s*$/i);
      if(m){put(m[1],m[2],m[3],m[4]);continue;}
      // Resilience for labels around fields, but still require an explicit slot, PFM, one score and E# support.
      const sm=line.match(/\b(?:THEME|SLOT|RANK)?\s*#?\s*([123])\b/i)||line.match(/^\s*([123])\b/),cm=line.match(/\b(PFM\d{4})\b/i),refs=themeRerunSupportRefs(line,evidenceLedger);
      if(!sm||!cm||!refs.length)continue;
      const tail=line.slice((cm.index||0)+cm[0].length),scoreMatch=tail.match(/(?:^|[^\d])(100|[1-9]?\d(?:\.\d+)?)\s*%?(?=\s|[|,:;\-–—]|E\d|$)/i);if(!scoreMatch)continue;
      put(sm[1],cm[1],scoreMatch[1],refs.join(','));
    }
  }
  return rows;
}
function parseThemeRerunSelectionCompactPartial(raw,rerun,sets,evidenceLedger){
  return parseThemeRerunSelectionCompactRows(raw,rerun,sets,evidenceLedger);
}
function parseThemeRerunSelectionCompact(raw,rerun,sets,evidenceLedger){
  const text=typeof raw==='string'?String(raw).replace(/\r/g,'').trim():'';
  const rows=parseThemeRerunSelectionCompactRows(raw,rerun,sets,evidenceLedger),structured={};
  for(const slotRow of rerun.themeSlots){
    if(slotRow.state==='preserve')structured[`theme${slotRow.slot}`]={code:slotRow.currentThemeCode};
    else{const row=rows.get(slotRow.slot);if(!row){const preview=text.replace(/\s+/g,' ').slice(0,500);throw new Error(`Theme ${slotRow.slot} was missing from the Theme Rerun selection response.${preview?` Provider preview: ${preview}`:''}`);}structured[`theme${slotRow.slot}`]=row;}
  }
  return parseThemeRerunStructured(structured,rerun,sets);
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

  const confidenceFrom = value => themeRerunSpecificConfidence(value);
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

  // Code-first block recovery. Provider-written Theme names are not authoritative.
  // Accept Markdown/prose blocks such as:
  // **Theme 1: Neutral** * PFM code: PFM0206 * Confidence: 100 * Reason: ...
  // The PFM code identifies the Theme; labels such as "Neutral" are ignored.
  const blockPattern=/(?:\*{0,2}\s*)?Theme\s*([123])\s*:[\s\S]*?(?=(?:\*{0,2}\s*)?Theme\s*[123]\s*:|$)/gi;
  let blockMatch;
  while((blockMatch=blockPattern.exec(text))){
    const slot=Number(blockMatch[1]);
    if(!openSlots.includes(slot)||rows.has(slot))continue;
    const block=String(blockMatch[0]||'');
    const codeMatch=block.match(/\b(PFM\d{4})\b/i);
    if(!codeMatch)continue;
    const code=codeMatch[1].toUpperCase();
    if(!allowedBySlot.get(slot)?.has(code)||preservedCodes.has(code))continue;
    const confidenceLabel=block.match(/\bConfidence\s*[:=]\s*(100|[1-9]?\d(?:\.\d+)?)\s*%?(?!\s*[-–—]\s*100)/i);
    const confidence=confidenceLabel?Math.max(0,Math.min(100,Number(confidenceLabel[1]))):confidenceFrom(block);
    if(confidence==null)continue;
    const reasonMatch=block.match(/\bReason\s*[:=]\s*([\s\S]*)$/i);
    const rationale=String(reasonMatch?.[1]||`Provider response selected ${code}.`).replace(/\*{1,2}/g,'').trim().slice(0,1000) || `Provider response selected ${code}.`;
    rows.set(slot,{code,confidence,rationale});
  }

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
    if(confidence==null)confidence=confidenceFrom(cleaned);
    if(confidence==null)continue;
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
      const confidence=confidenceFrom(line);
      if(confidence==null)continue;
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
function extractThemeRerunAcceptedPartial(raw,rerun,sets){
  const text=typeof raw==='string'?String(raw).trim():'';
  const accepted=new Map(),used=new Set(rerun.themeSlots.filter(row=>row.state==='preserve').map(row=>row.currentThemeCode).filter(Boolean));
  const openSlots=rerun.themeSlots.filter(row=>row.state!=='preserve').map(row=>row.slot),allowed=new Map(openSlots.map(slot=>[slot,new Set(sets[slot].candidates.map(item=>item.code))]));
  const put=(slot,code,confidence=null,rationale='')=>{code=String(code||'').toUpperCase();if(confidence==null)return false;const n=Number(confidence);if(!Number.isFinite(n)||!openSlots.includes(Number(slot))||accepted.has(Number(slot))||!allowed.get(Number(slot))?.has(code)||used.has(code))return false;accepted.set(Number(slot),{code,confidence:Math.max(0,Math.min(100,n)),rationale:String(rationale||`Provider response selected ${code}.`).trim().slice(0,1000)||`Provider response selected ${code}.`});used.add(code);return true;};
  if(raw&&typeof raw==='object'&&!Array.isArray(raw))for(const slot of openSlots){const row=raw[`theme${slot}`]||{};put(slot,row.code,row.confidence,row.rationale);}
  if(!text)return accepted;
  try{const obj=parse(text);if(obj&&typeof obj==='object'&&!Array.isArray(obj))for(const slot of openSlots){const row=obj[`theme${slot}`]||{};put(slot,row.code,row.confidence,row.rationale);}}catch{}
  const confidenceFrom=v=>themeRerunSpecificConfidence(v);
  const blockPattern=/(?:\*{0,2}\s*)?Theme\s*([123])\s*:[\s\S]*?(?=(?:\*{0,2}\s*)?Theme\s*[123]\s*:|$)/gi;let bm;
  while((bm=blockPattern.exec(text))){const slot=Number(bm[1]),block=String(bm[0]||''),cm=block.match(/\b(PFM\d{4})\b/i);if(!cm)continue;const rm=block.match(/\bReason\s*[:=]\s*([\s\S]*)$/i);put(slot,cm[1],confidenceFrom(block),String(rm?.[1]||block).replace(/\*{1,2}/g,'').trim());}
  for(const line of text.split(/\r?\n/)){
    const sm=line.match(/\b(?:THEME|SLOT|RANK)\s*#?\s*([123])\b/i)||line.match(/^\s*#?\s*([123])\s*(?:[.)\]:\-|]|\|)/);
    const cm=line.match(/\b(PFM\d{4})\b/i);if(sm&&cm)put(Number(sm[1]),cm[1],confidenceFrom(line),line);
    const pipe=line.trim().replace(/^\|\s*/,'').replace(/\s*\|$/,'').split('|').map(x=>x.trim());if(pipe.length>=3&&/^[123]$/.test(pipe[0])){const pcm=pipe.join('|').match(/\b(PFM\d{4})\b/i);if(pcm)put(Number(pipe[0]),pcm[1],confidenceFrom(line),pipe.slice(4).join('|')||line);}
  }
  return accepted;
}

function themeRerunMissingRepairPrompt(rerun,sets,accepted,missingSlots,evidenceLedger,forbiddenCodes=[]){
  const acceptedCodes=new Set([...accepted.values()].map(row=>row.code)),forbidden=new Set((forbiddenCodes||[]).map(code=>String(code||'').toUpperCase()));
  const fixed=[...accepted.entries()].sort((a,b)=>a[0]-b[0]).map(([slot,row])=>`Theme ${slot}=${row.code}`).join(', ')||'none';
  const blocks=missingSlots.map(slot=>{
    const candidates=sets[slot].candidates.filter(row=>!acceptedCodes.has(row.code)&&!forbidden.has(row.code));
    const defs=candidates.map(row=>`${row.code} — ${row.name}: ${row.aiMeaning}`).join('\n');
    return `Theme ${slot} eligible=${candidates.map(row=>`${row.code}:${row.pairWeight}`).join(', ')}\n${defs}`;
  }).join('\n\n');
  return `Fill only the missing Theme slots using the frozen evidence. Existing selections stay fixed. For each missing slot, evaluate ALL remaining eligible candidates and choose the Theme an ordinary person would most naturally pick; do not settle for a merely defensible broad/easy Theme when a materially closer or more specific Theme is available. Do not reward emotional, evocative, dramatic, expressive, aesthetically appealing, attention-grabbing, or interesting Themes merely for being richer answers. A boring/neutral Theme wins whenever it is materially closer. Do not infer playfulness from simplicity/minimalism, silliness from irregularity, coziness from neutral stillness, sweetness from pleasantness, or emotional significance from generic praise. Confidence measures strength of fit, not rank, so a closest-available weak Theme should stay low-confidence. Before returning, check that no unselected eligible Theme is materially closer than the choice. Cite supporting E# facts.\n\nReturn only one compact line per missing slot:\nSLOT|PFM####|CONFIDENCE|E#[,E#]\nExample: 2|PFM0104|23|E2,E5\n\nFROZEN EVIDENCE\n${themeRerunEvidenceText(evidenceLedger)}\n\nFIXED\n${fixed}\n\nMISSING\n${blocks}`;
}
async function repairMissingThemeRerunSlots(env,model,behavior,rerun,sets,accepted,evidenceLedger,forbiddenCodes=[]){
  let working=new Map(accepted),lastError=null;
  for(let attempt=1;attempt<=2;attempt++){
    const missing=rerun.themeSlots.filter(row=>row.state!=='preserve'&&!working.has(row.slot)).map(row=>row.slot);if(!missing.length)return working;
    try{
      const raw=await runStructured(env,model,null,themeRerunMissingRepairPrompt(rerun,sets,working,missing,evidenceLedger,forbiddenCodes),null,650,'text',{behavior,themeRerun:true,themeRerunRepair:true,temperature:0});
      const newly=parseThemeRerunSelectionCompactPartial(raw,rerun,sets,evidenceLedger);
      for(const [slot,row] of newly)if(missing.includes(slot)&&!working.has(slot)&&![...working.values()].some(x=>x.code===row.code))working.set(slot,row);
      if(rerun.themeSlots.filter(row=>row.state!=='preserve'&&!working.has(row.slot)).length===0)return working;
    }catch(error){lastError=error;}
  }
  const missing=rerun.themeSlots.filter(row=>row.state!=='preserve'&&!working.has(row.slot)).map(row=>row.slot);
  throw diagnosticError(lastError?.message||`Theme Rerun repair remained incomplete; missing Theme ${missing.join(', Theme ')}`,{phase:'theme-rerun-missing-slot-repair',missingSlots:missing});
}
function themeRerunThemeMeta(code){return PRIMFUSION_REGISTRY.aiThemeChoices.find(row=>row.code===String(code||'').toUpperCase())||null}
function themeRerunReasonMentions(reason,theme){const text=String(reason||'').toLowerCase();if(!theme)return false;return text.includes(String(theme.name||'').toLowerCase())||text.includes(String(theme.code||'').toLowerCase())}
function themeRerunComparativeReasonValid(reason,beforeCode,afterCode,evidenceLedger=[],allowedEvidenceRefs=[]){
  beforeCode=String(beforeCode||'').toUpperCase();afterCode=String(afterCode||'').toUpperCase();
  const text=String(reason||'').trim(),refs=themeRerunReasonEvidenceRefs(text);if(!text||!themeRerunReasonGrounded(text,evidenceLedger))return false;
  const allowed=new Set((allowedEvidenceRefs||[]).map(id=>String(id||'').toUpperCase()).filter(Boolean));if(allowed.size&&refs.some(id=>!allowed.has(id)))return false;
  if(!beforeCode||!afterCode||beforeCode===afterCode)return true;
  const before=themeRerunThemeMeta(beforeCode),after=themeRerunThemeMeta(afterCode);
  if(!themeRerunReasonMentions(text,before)||!themeRerunReasonMentions(text,after))return false;
  return /\b(?:better|stronger|closer|more|less|rather|instead|over|than|whereas|while|compared|outweigh|replace|replacement|fit|fits|fitting|support|supported)\b/i.test(text);
}
function cleanThemeRerunReasonOnly(raw){
  let text=String(raw||'').replace(/\r/g,'').trim();if(!text)return'';
  const lines=text.split('\n').map(line=>line.trim()).filter(Boolean);
  if(lines.length>1){const reasonLine=lines.find(line=>/^reason\s*[:=\-–—]/i.test(line));if(reasonLine)text=reasonLine;else text=lines.join(' ');}
  return text.replace(/^[-*•\s]+/,'').replace(/^reason\s*[:=\-–—]\s*/i,'').replace(/^['"]|['"]$/g,'').replace(/\*{1,2}/g,'').trim().slice(0,1000);
}
function themeRerunComparativeReasonPrompt(rerun,slotRow,selection,evidenceLedger){
  const before=themeRerunThemeMeta(slotRow.currentThemeCode),after=themeRerunThemeMeta(selection.code),support=[...new Set(selection.supportEvidenceIds||[])],supportSet=new Set(support),supportLedger=(evidenceLedger||[]).filter(row=>supportSet.has(String(row.id||'').toUpperCase()));
  const director=slotRow.state==='replace'?'The Director explicitly required the old Theme to be replaced.':slotRow.state==='neutral'?'The slot was neutral and could have kept the old Theme if it remained the best fit.':'';
  return `THEME EDIT LOG — EXPLANATION ONLY. The Theme choice and confidence are already locked. The image is unavailable. Do not choose, rescore, or alter a Theme.\n\nThe selection step cited ONLY these support facts:\n${themeRerunEvidenceText(supportLedger)}\n\nBEFORE: ${before?.code||slotRow.currentThemeCode} — ${before?.name||'Unknown'} — ${before?.aiMeaning||''}\nAFTER: ${after?.code||selection.code} — ${after?.name||'Unknown'} — ${after?.aiMeaning||''}\nLOCKED CONFIDENCE: ${selection.confidence}%\n${director}\n\nWrite one concise paragraph explaining why ${after?.name||selection.code} is better supported than ${before?.name||slotRow.currentThemeCode}, using ONLY the cited support facts above. Name both Theme labels exactly and cite the E# IDs you use. Do not add any new visual fact, mood, analogy, intention, personality, atmosphere, emotional quality, or semantic support. Return only the paragraph.`;
}
async function repairThemeRerunComparativeReason(env,model,behavior,rerun,slotRow,selection,evidenceLedger){
  let last='';
  for(let attempt=1;attempt<=2;attempt++){
    try{
      const raw=await runStructured(env,model,null,themeRerunComparativeReasonPrompt(rerun,slotRow,selection,evidenceLedger)+(attempt===2?'\n\nUse only the listed E# facts. Name both Themes. Return only the paragraph.':''),null,600,'text',{behavior,themeRerun:true,themeRerunReasonRepair:true,temperature:0});
      const reason=cleanThemeRerunReasonOnly(raw);last=reason;if(themeRerunComparativeReasonValid(reason,slotRow.currentThemeCode,selection.code,evidenceLedger,selection.supportEvidenceIds))return reason;
    }catch(error){last=String(error?.message||'').slice(0,500);}
  }
  console.warn(`Theme Edit Log reason repair failed for Theme ${slotRow.slot}: ${last||'no usable reason'}`);return'';
}
async function ensureThemeRerunComparativeReasons(env,model,behavior,rerun,selections,evidenceLedger){
  if(!rerun.explainChanges)return selections.map(row=>({...row,rationale:''}));
  const out=selections.map(row=>({...row}));
  for(const slotRow of rerun.themeSlots){
    if(slotRow.state==='preserve'||!slotRow.currentThemeCode)continue;
    const selection=out.find(row=>Number(row.rank)===Number(slotRow.slot));if(!selection)continue;
    if(selection.code===slotRow.currentThemeCode){selection.rationale='';continue;}
    selection.rationale=await repairThemeRerunComparativeReason(env,model,behavior,rerun,slotRow,selection,evidenceLedger);
  }
  return out;
}
function finalizeThemeRerunPartial(rerun,sets,accepted){
  const structured={};
  for(const row of rerun.themeSlots){if(row.state==='preserve')structured[`theme${row.slot}`]={code:row.currentThemeCode};else{const found=accepted.get(row.slot);if(!found)throw new Error(`Theme ${row.slot} remained missing after targeted repair.`);structured[`theme${row.slot}`]=found;}}
  return parseThemeRerunStructured(structured,rerun,sets);
}

async function runThemeRerun(env,model,image,behavior,input){
  const rerun=normalizeThemeRerun(input);if(!rerun)throw new Error('Theme Rerun request was missing.');
  const sets=themeRerunCandidateSets(rerun),openSlots=rerun.themeSlots.filter(row=>row.state!=='preserve');
  if(!openSlots.length){
    const local={};for(const row of rerun.themeSlots)local[`theme${row.slot}`]={code:row.currentThemeCode};
    return{rerun,sets,evidenceLedger:[],selections:parseThemeRerunStructured(local,rerun,sets),auditRounds:[]};
  }
  // v0.9.6.79 Theme Rerun decision pipeline:
  // 1) image/Description -> frozen factual evidence ledger
  // 2) NO IMAGE -> candidate selection under Director constraints
  // 3) NO IMAGE -> adversarial audit of every proposed open-slot Theme
  // 4) rejected candidates are forbidden and replaced; only audit survivors can lock
  // 5) NO IMAGE -> separate Theme Edit Log explanation from locked choice + cited E# facts
  const evidenceLedger=await runThemeRerunEvidencePass(env,model,image,behavior,rerun),basePrompt=themeRerunPrompt(rerun,sets,evidenceLedger),rejectedCodes=new Set(),auditRounds=[];
  let lastError=null;
  for(let round=1;round<=3;round++){
    const rejectBlock=rejectedCodes.size?`

ADVERSARIAL AUDIT REJECTIONS — THESE CODES ARE NOW INELIGIBLE FOR OPEN SLOTS:
${[...rejectedCodes].join(', ')}
Do not return any rejected code. Select the closest remaining eligible Theme for each open slot, even if confidence is low.`:'';
    let proposed=null;
    for(let attempt=1;attempt<=2&&!proposed;attempt++){
      try{
        const raw=await runStructured(env,model,null,basePrompt+rejectBlock,null,700,'text',{behavior,themeRerun:true,themeRerunSelectionFromFrozenEvidence:true,temperature:attempt===1?0.08:0});
        try{
          const selections=parseThemeRerunSelectionCompact(raw,rerun,sets,evidenceLedger);
          if(selections.some(row=>openSlots.some(slot=>slot.slot===row.rank)&&rejectedCodes.has(row.code)))throw new Error('Theme Rerun proposal reused an adversarially rejected code.');
          proposed=selections;
        }catch(error){
          const accepted=parseThemeRerunSelectionCompactPartial(raw,rerun,sets,evidenceLedger),missing=openSlots.filter(row=>!accepted.has(row.slot));
          if(accepted.size&&missing.length){
            for(const [slot,row] of [...accepted])if(rejectedCodes.has(row.code))accepted.delete(slot);
            const repaired=await repairMissingThemeRerunSlots(env,model,behavior,rerun,sets,accepted,evidenceLedger,[...rejectedCodes]),selections=finalizeThemeRerunPartial(rerun,sets,repaired);
            if(selections.some(row=>openSlots.some(slot=>slot.slot===row.rank)&&rejectedCodes.has(row.code)))throw new Error('Theme Rerun repair reused an adversarially rejected code.');
            proposed=selections;
          }else lastError=error;
        }
      }catch(error){lastError=error;}
    }
    if(!proposed)continue;
    const openCodes=proposed.filter(row=>openSlots.some(slot=>slot.slot===row.rank)).map(row=>row.code),audits=await runThemeDecisionAudits(env,model,behavior,evidenceLedger,openCodes),rejected=audits.filter(row=>row.status==='REJECT');
    auditRounds.push({round,proposedCodes:[...openCodes],audits:audits.map(row=>({...row}))});
    if(!rejected.length){
      const locked=await ensureThemeRerunComparativeReasons(env,model,behavior,rerun,proposed,evidenceLedger);
      return{rerun,sets,evidenceLedger,selections:locked,auditRounds};
    }
    for(const row of rejected)rejectedCodes.add(row.code);
  }
  throw diagnosticError(lastError?.message||'Theme Rerun adversarial audit could not produce three surviving Themes.',{phase:'theme-rerun-adversarial-audit',rejectedCodes:[...rejectedCodes],auditRounds});
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
  const providerCallTimeoutMs = Number.isFinite(options.providerCallTimeoutMs)
    ? Math.max(1000, options.providerCallTimeoutMs)
    : PROVIDER_CALL_TIMEOUT_MS;
  const fullPrompt=prompt + freshRerun;

  const primaryRequest=()=>{
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
      request.guided_json = schema;
    } else if (responseMode === 'json_schema') {
      request.response_format = {type:'json_schema',json_schema:schema};
    } else if (responseMode === 'json_object') {
      request.response_format = {type:'json_object'};
    }
    return request;
  };

  const fallbackRequest=()=>{
    const content=image&&((image.byteLength||image.length)>0)
      ? [{type:'text',text:fullPrompt},{type:'image_url',image_url:{url:imageBytesDataUrl(image)}}]
      : fullPrompt;
    const request={messages:[{role:'user',content}],max_tokens:maxTokens,temperature};
    if((responseMode==='json_schema'||responseMode==='guided_json')&&schema){
      request.response_format={type:'json_schema',json_schema:{name:'genreactrix_response',strict:true,schema}};
    }else if(responseMode==='json_object'){
      request.response_format={type:'json_object'};
    }
    return request;
  };


  const qwenRequest=()=>{
    const content=image&&((image.byteLength||image.length)>0)
      ? [{type:'text',text:fullPrompt},{type:'image_url',image_url:{url:imageBytesDataUrl(image)}}]
      : fullPrompt;
    return{messages:[{role:'user',content}],max_tokens:maxTokens,temperature,enable_thinking:false};
  };

  const timedRun=async(runModel,request,provider,gatewayId=null)=>{
    try{
      const value=await new Promise((resolve,reject)=>{
        const timer=setTimeout(()=>reject(new Error(`Provider call timed out after ${Math.round(providerCallTimeoutMs/1000)}s`)),providerCallTimeoutMs);
        const invocation=gatewayId
          ? env.AI.run(runModel,request,{gateway:{id:gatewayId}})
          : env.AI.run(runModel,request);
        Promise.resolve(invocation).then(
          result=>{clearTimeout(timer);resolve(result)},
          error=>{clearTimeout(timer);reject(error)}
        );
      });
      providerTraceEvent(env,{provider,model:runModel,outcome:'success'});
      return value;
    }catch(error){
      providerTraceEvent(env,{provider,model:runModel,outcome:'failure',errorCode:capacity3040(error)?'3040':null,errorMessage:String(error?.message||error).slice(0,500)});
      throw error;
    }
  };

  const route=providerRoute(env);
  const fallbackModel=fallbackModelFor(env);
  const gatewayId=aiGatewayIdFor(env);
  const forcedProvider=String(env?.__GENREACTRIX_FORCED_PROVIDER||'').toLowerCase();
  const shouldUseFallback=route?.mode==='fallback'&&Number(route.fallbackUntil)>Date.now();

  try{
    if(forcedProvider==='primary'){
      payload=await timedRun(model,primaryRequest(),'cloudflare-workers-ai');
    }else if(forcedProvider==='secondary'){
      payload=await timedRun(fallbackModel,fallbackRequest(),'openai-via-cloudflare-ai-gateway',gatewayId);
    }else if(forcedProvider==='mistral'){
      if(responseMode!=='text')throw diagnosticError('Mistral provider-cycle routing currently supports text-output stages only.',{phase:'provider-call',provider:'mistral-direct',model:mistralDescriptionModelFor(env),failureKind:'unsupported-response-mode',responseMode});
      const mistral=await runMistralTextProvider(env,image,fullPrompt,{maxTokens,temperature,timeoutMs:providerCallTimeoutMs,phase:'provider-call'});
      payload={response:mistral.text};
    }else if(forcedProvider==='qwen'){
      if(responseMode!=='text')throw diagnosticError('Qwen Theme provider routing currently supports text-output Theme stages only.',{phase:'provider-call',provider:'cloudflare-workers-ai-qwen',model:qwenThemeModelFor(env),failureKind:'unsupported-response-mode',responseMode});
      payload=await timedRun(qwenThemeModelFor(env),qwenRequest(),'cloudflare-workers-ai-qwen');
    }else if(shouldUseFallback){
      payload=await timedRun(fallbackModel,fallbackRequest(),'openai-via-cloudflare-ai-gateway',gatewayId);
    }else{
      try{
        payload=await timedRun(model,primaryRequest(),'cloudflare-workers-ai');
        if(route){route.mode='primary';route.fallbackUntil=0;route.fallbackReason=null;}
      }catch(primaryError){
        if(!capacity3040(primaryError))throw primaryError;
        const fallbackUntil=Date.now()+FALLBACK_COOLDOWN_MS;
        if(route){
          route.mode='fallback';
          route.fallbackUntil=fallbackUntil;
          route.fallbackReason='3040';
          route.activatedThisRequest=true;
        }
        providerTraceEvent(env,{provider:'router',model:null,outcome:'fallback-activated',errorCode:'3040',fallbackUntil});
        try{
          payload=await timedRun(fallbackModel,fallbackRequest(),'openai-via-cloudflare-ai-gateway',gatewayId);
        }catch(fallbackError){
          throw diagnosticError(
            `Fallback AI failed after Workers AI capacity error 3040: ${fallbackError?.message||fallbackError}`,
            {
              phase:'provider-call',provider:'openai-via-cloudflare-ai-gateway',model:fallbackModel,
              primaryErrorCode:'3040',fallbackUntil,fallbackReason:'3040',
              errorName:fallbackError?.name||null,errorMessage:String(fallbackError?.message||fallbackError).slice(0,1200)
            }
          );
        }
      }
    }
  }catch(error){
    if(providerDiagnosticOf(error))throw error;
    throw diagnosticError(
      `${forcedProvider==='mistral'?'Mistral AI':forcedProvider==='qwen'?'Qwen AI':forcedProvider==='secondary'||shouldUseFallback?'Fallback AI':'Workers AI vision'} failed: ${error?.message||error}`,
      {
        phase:'provider-call',
        provider:forcedProvider==='mistral'?'mistral-direct':forcedProvider==='qwen'?'cloudflare-workers-ai-qwen':forcedProvider==='secondary'||shouldUseFallback?'openai-via-cloudflare-ai-gateway':'cloudflare-workers-ai',
        model:forcedProvider==='mistral'?mistralDescriptionModelFor(env):forcedProvider==='qwen'?qwenThemeModelFor(env):forcedProvider==='secondary'||shouldUseFallback?fallbackModel:model,
        fallbackUntil:Number(route?.fallbackUntil)||0,
        fallbackReason:route?.fallbackReason||null,
        errorName:error?.name || null,
        errorMessage:String(error?.message || error).slice(0,1200)
      }
    );
  }

  const value = responseValue(payload);
  if (value === '' || value == null) {
    throw diagnosticError(
      'AI provider returned no analysis response',
      {...safeProviderDiagnostic(payload),...providerRoutingSnapshot(env,model)}
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

function promptDiagnosticTransientProviderError(error){
  const diagnostic=providerDiagnosticOf(error)||{};
  if(diagnostic.transientProviderFailure===true)return true;
  const providerPhase=String(diagnostic.providerPhase||diagnostic.phase||'');
  if(providerPhase!=='provider-call')return false;
  const status=Number(diagnostic.errorStatus??diagnostic.status??0);
  if([429,500,502,503,504].includes(status))return true;
  const text=`${error?.message||''} ${diagnostic.errorMessage||''}`.toLowerCase();
  return /timed out|timeout|temporar|overload|unavailable|try again|rate limit|too many requests|network|failed to fetch|connection/.test(text);
}

function promptDiagnosticProviderFailureKind(error){
  const diagnostic=providerDiagnosticOf(error)||{};
  const text=`${error?.message||''} ${diagnostic.errorMessage||''}`.toLowerCase();
  if(/timed out|timeout/.test(text))return'timeout';
  if(/rate limit|too many requests|429/.test(text))return'rate-limit';
  if(/overload|unavailable|temporar|502|503|504/.test(text))return'unavailable';
  return'provider-transient';
}

function promptDiagnosticRecoveryEvent(recoveryLog,event){
  if(!Array.isArray(recoveryLog))return;
  recoveryLog.push({at:new Date().toISOString(),...event});
}

async function runPromptDiagnosticStructured(env,model,image,prompt,schema,maxTokens,responseMode,options={},meta={}){
  const maxProviderAttempts=Math.max(1,Math.min(3,Number(meta.maxProviderAttempts)||2));
  let lastError=null;
  for(let providerAttempt=1;providerAttempt<=maxProviderAttempts;providerAttempt++){
    try{
      const value=await runStructured(env,model,image,prompt,schema,maxTokens,responseMode,options);
      if(providerAttempt>1){
        promptDiagnosticRecoveryEvent(meta.recoveryLog,{
          type:'provider-recovered',failureKind:promptDiagnosticProviderFailureKind(lastError),
          stage:meta.stage||null,conceptCode:meta.conceptCode||null,componentIds:meta.componentIds||null,
          batchIndex:meta.callContext?.batchIndex??null,callMode:meta.callContext?.callMode??null,waveIndex:meta.callContext?.waveIndex??null,
          providerAttempts:providerAttempt
        });
      }
      return value;
    }catch(error){
      if(!promptDiagnosticTransientProviderError(error))throw error;
      lastError=error;
      const failureKind=promptDiagnosticProviderFailureKind(error);
      if(failureKind==='timeout'){
        const inner=providerDiagnosticOf(error)||{};
        promptDiagnosticRecoveryEvent(meta.recoveryLog,{type:'provider-timeout-fresh-request-required',failureKind,stage:meta.stage||null,conceptCode:meta.conceptCode||null,componentIds:meta.componentIds||null,batchIndex:meta.callContext?.batchIndex??null,callMode:meta.callContext?.callMode??null,waveIndex:meta.callContext?.waveIndex??null,providerAttempt});
        throw diagnosticError(error?.message||'Prompt Diagnostics provider timed out',{phase:'prompt-diagnostics-provider-timeout',providerPhase:inner.phase||'provider-call',transientProviderFailure:true,failureKind:'timeout',freshRequestRecommended:true,batchIndex:meta.callContext?.batchIndex??null,batchNumber:meta.callContext?.batchNumber??null,callMode:meta.callContext?.callMode??null,waveIndex:meta.callContext?.waveIndex??null,waveNumber:meta.callContext?.waveNumber??null,stage:meta.stage||null,conceptCode:meta.conceptCode||null,componentIds:meta.componentIds||null});
      }
      promptDiagnosticRecoveryEvent(meta.recoveryLog,{
        type:providerAttempt<maxProviderAttempts?'provider-retry':'provider-retries-exhausted',
        failureKind:promptDiagnosticProviderFailureKind(error),stage:meta.stage||null,conceptCode:meta.conceptCode||null,componentIds:meta.componentIds||null,
        batchIndex:meta.callContext?.batchIndex??null,callMode:meta.callContext?.callMode??null,waveIndex:meta.callContext?.waveIndex??null,
        providerAttempt,maxProviderAttempts
      });
      if(providerAttempt<maxProviderAttempts)continue;
      const inner=providerDiagnosticOf(error)||{};
      throw diagnosticError(
        error?.message||'Prompt Diagnostics provider call failed after automatic retries',
        {
          phase:'prompt-diagnostics-provider-retry-exhausted',providerPhase:inner.phase||'provider-call',
          transientProviderFailure:true,failureKind:promptDiagnosticProviderFailureKind(error),
          batchIndex:meta.callContext?.batchIndex??null,batchNumber:meta.callContext?.batchNumber??null,
          callMode:meta.callContext?.callMode??null,waveIndex:meta.callContext?.waveIndex??null,waveNumber:meta.callContext?.waveNumber??null,
          stage:meta.stage||null,conceptCode:meta.conceptCode||null,componentIds:meta.componentIds||null,
          providerAttempts:maxProviderAttempts,errorName:inner.errorName||error?.name||null,errorMessage:inner.errorMessage||String(error?.message||error).slice(0,1200)
        }
      );
    }
  }
  throw lastError||new Error('Prompt Diagnostics provider call failed');
}

const PROMPT_DIAGNOSTIC_BATCH_SIZE = 15;
const PROMPT_DIAGNOSTIC_BATCH_COUNT = 6;
const PROMPT_DIAGNOSTIC_FIVE_WAVE_SIZE = 5;
const PROMPT_DIAGNOSTIC_THREE_WAVE_SIZE = 3;
const PROMPT_DIAGNOSTIC_COMPONENT_CHUNK_SIZE = 5;

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
  let primOffset=0,themeOffset=0;
  for(let batchIndex=0;batchIndex<PROMPT_DIAGNOSTIC_BATCH_COUNT;batchIndex++){
    const batchesRemaining=PROMPT_DIAGNOSTIC_BATCH_COUNT-batchIndex;
    const primCount=Math.ceil((prims.length-primOffset)/batchesRemaining);
    const themeCount=PROMPT_DIAGNOSTIC_BATCH_SIZE-primCount;
    const primSlice=prims.slice(primOffset,primOffset+primCount);
    const themeSlice=themes.slice(themeOffset,themeOffset+themeCount);
    primOffset+=primSlice.length;
    themeOffset+=themeSlice.length;
    batches.push([...primSlice,...themeSlice].map((row,index)=>({
      ...row,
      batchIndex,
      position:index+1,
      definitionParts:promptDiagnosticDefinitionParts(row.definition)
    })));
  }
  const flattened=batches.flat();
  const expectedCount=prims.length+themes.length;
  if(batches.length!==PROMPT_DIAGNOSTIC_BATCH_COUNT||batches.some(batch=>batch.length<1||batch.length>PROMPT_DIAGNOSTIC_BATCH_SIZE)||flattened.length!==expectedCount||new Set(flattened.map(row=>row.code)).size!==expectedCount)throw new Error('Prompt Diagnostics vocabulary batching does not match the current PrimFusion vocabulary');
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
  if(!Number.isInteger(batchIndex)||batchIndex<0||batchIndex>=PROMPT_DIAGNOSTIC_BATCH_COUNT)throw new Error(`Prompt Diagnostics batchIndex must be 0-${PROMPT_DIAGNOSTIC_BATCH_COUNT-1}`);
  const requested=String(body?.callMode||'fifteen').trim().toLowerCase();
  const callMode=['fifteen','five','three'].includes(requested)?requested:'fifteen';
  const batch=PROMPT_DIAGNOSTIC_BATCHES[batchIndex];
  if(callMode==='fifteen')return{batchIndex,callMode,waveIndex:null,waveNumber:null,waveCount:1,conceptOffset:0,concepts:batch};
  const waveSize=callMode==='three'?PROMPT_DIAGNOSTIC_THREE_WAVE_SIZE:PROMPT_DIAGNOSTIC_FIVE_WAVE_SIZE;
  const waveCount=Math.ceil(batch.length/waveSize);
  const waveIndex=Number(body?.waveIndex);
  if(!Number.isInteger(waveIndex)||waveIndex<0||waveIndex>=waveCount)throw new Error(`Prompt Diagnostics ${waveSize}-concept waveIndex must be 0-${waveCount-1}`);
  const conceptOffset=waveIndex*waveSize;
  const concepts=batch.slice(conceptOffset,conceptOffset+waveSize);
  if(!concepts.length||concepts.length>waveSize)throw new Error(`Prompt Diagnostics ${waveSize}-concept wave resolved to an invalid concept count`);
  return{batchIndex,callMode,waveIndex,waveNumber:waveIndex+1,waveCount,conceptOffset,concepts};
}

function promptDiagnosticEvidence({sources,reactions,description}){
  const sourceLabel=promptDiagnosticSourceLabel(sources);
  const evidence=[];
  if(sources.image)evidence.push('IMAGE: The supplied image is evidence. Judge only what can reasonably be seen or inferred from it.');
  if(sources.reactions){
    const reactionLines=PRIMFUSION_REGISTRY.primitives.map(p=>`${p.id} ${p.name}: ${Math.round((reactions[p.id]||0)*10)/10}%`).join('\n');
    evidence.push(`CURRENT REACTION EVIDENCE: Treat these as supplied reaction measurements, not as ground truth and not as Theme selections.\n${reactionLines}`);
  }
  if(sources.description)evidence.push(`CURRENT AI DESCRIPTION: Treat this as supplied observational/interpretive evidence, not as ground truth and not as a Theme selection.\n${description}`);
  return{sourceLabel,evidenceText:evidence.join('\n\n')};
}

function promptDiagnosticPartId(code,index){
  return `${code}.${String(index+1).padStart(2,'0')}`;
}

function promptDiagnosticConceptBlock(row){
  const numbered=row.definitionParts.map((part,index)=>`  ${promptDiagnosticPartId(row.code,index)} :: ${part}`).join('\n');
  return `CONCEPT ${row.code} — ${row.name} — ${row.kind==='prim'?'PRIM BUILDING BLOCK (diagnostic only; not selectable as a final Theme)':'PRIMFUSION THEME'}\nCURRENT WORKER DEFINITION (verbatim):\n${row.definition}\nDEFINITION COMPONENTS TO ASSESS ONE BY ONE:\n${numbered}`;
}

function promptDiagnosticRequiredRecords(concepts){
  return concepts.map(row=>{
    const parts=row.definitionParts.map((_,index)=>`${promptDiagnosticPartId(row.code,index)} <ASSESSMENT> - <reason>`).join('\n');
    return `${row.code} SCORE <0-100>\n${parts}\n${row.code} WHY - <overall score reason>`;
  }).join('\n');
}

function promptDiagnosticPrompt({callSpec,sources,reactions,description}){
  const {concepts:batch,callMode,waveNumber}=callSpec;
  const {sourceLabel,evidenceText}=promptDiagnosticEvidence({sources,reactions,description});
  const concepts=batch.map(promptDiagnosticConceptBlock).join('\n\n');
  const callLabel=callMode==='five'?`5-concept wave ${waveNumber} of 3 within this 15-concept batch`:callMode==='three'?`3-concept wave ${waveNumber} of 5 within this 15-concept batch`:'15 concepts at once';
  const count=batch.length;
  return `You are running GENREACTRIX PROMPT DIAGNOSTICS. This is research instrumentation, not normal Theme selection.

DIAGNOSTIC CALL FORMAT: ${callLabel}
EVIDENCE SOURCE COMBINATION: ${sourceLabel}
${evidenceText}

Evaluate EACH of the ${count} concepts below INDEPENDENTLY against the available evidence and against its exact current Worker definition.

SCORING RULES:
- Give every concept its own 0-100 MATCH CONFIDENCE. These scores are independent. They do NOT add to 100, are NOT shares of a pool, and must NOT be normalized against one another.
- Do NOT choose three winners. Do NOT rank concepts as a substitute for scoring them.
- Base the score on the supplied definition. The purpose is to discover what the AI sees, does not see, understands, misunderstands, or fails to associate with the definition.
- Assess EVERY explicitly identified definition component for EVERY concept. Do not collapse the definition into one generalized judgment.
- A 0% score requires the same complete component-by-component analysis as a high score.
- Confidence calibration: 0 = no meaningful positive support or a hard gate makes the concept inapplicable; 1-19 = trace/tenuous; 20-39 = weak but real; 40-59 = moderate/mixed; 60-79 = strong; 80-94 = very strong/direct; 95-100 = exceptionally complete/unmistakable. 100 requires essentially no meaningful doubt. 0 requires essentially no positive match evidence unless a hard gate overrides it.
- Genuine positive supporting evidence should normally move the score above 0. Missing, ambiguous, or contradictory evidence should explain why a score is below 100.
- High confidence must be justified by concrete component-level support. Do not inflate confidence because a concept is merely plausible.
- For PrimFusion Themes, judge the fusion Theme's own supplied definition; do not automatically infer it from its two Prims.
- Standalone Prims are diagnostic building blocks only and cannot become final Genreactrix Themes.
- If an evidence source is silent on something, say so. Do not invent missing evidence.
- Cue ≠ meaning. Do not promote an ordinary cue into a more specific semantic claim without independent evidence.
- Do not infer dirt from clutter, hoarding from generic mess, clinical setting from ordinary room objects, romance from a gaze, supernatural danger from an inactive object, distorted reality from confusion, or performance/spectacle from mere oddness.
- The component findings, numeric score, and final WHY must agree. Do not give a high score and then say there is no evidence, insufficient information, or that the concept is unsupported.
- FINAL SCORE SELF-CHECK: Before writing each final score and WHY, re-read that concept's completed component assessments and reasons and evaluate the score again from those findings. If the proposed score conflicts with your own assessment, revise the score. Assessment -> score, never score -> assessment. Do not invent new evidence during this self-check.
- Evaluate only the target concept. Do not compare it to or explain it through unrelated concepts in the same call.
- When a concept matches through one specific route in a broad definition, identify that actual route in the reason.

For each definition component use exactly one assessment label:
- MATCH_EVIDENCE = positive evidence that raises confidence in the concept.
- GATE_CONFIRMED = a limiting/non-qualifier rule is correctly recognized; this validates the gate but does not itself raise match confidence.
- PARTIAL = some but incomplete/ambiguous positive support.
- ABSENT = the component's positive evidence is not present.
- CONTRADICTS = evidence points against the component/concept.
- NOT_OBSERVABLE = the available evidence cannot establish it.
Legacy SUPPORTS is accepted by the Worker as MATCH_EVIDENCE, but prefer the labels above.

OUTPUT: plain text only. Markdown decoration is unnecessary. The Worker accepts minor punctuation variation, but EVERY required record identifier below must be present so each judgment can be tied to the exact definition component.
Use this shape:
P01 SCORE 72
P01.01 MATCH_EVIDENCE - concrete evidence-grounded reason
P01 WHY - explanation of why the component findings justify the final score

Do not substitute a paragraph such as "Definition / Evidence / Score" for the numbered component records.
Do not skip numbered components even at 0%.

${THEME_SEMANTIC_EVIDENCE_RULES}

REQUIRED RECORDS TO COMPLETE:
${promptDiagnosticRequiredRecords(batch)}

${count} CONCEPTS:
${concepts}`;
}

function cleanPromptDiagnosticLine(rawLine){
  return String(rawLine||'')
    .trim()
    .replace(/^[-*•]+\s*/,'')
    .replace(/\*\*/g,'')
    .replace(/`/g,'')
    .trim();
}

function promptDiagnosticCanonicalAssessment(raw){
  const value=String(raw||'').trim().toUpperCase().replace(/[\s-]+/g,'_');
  if(value==='SUPPORTS'||value==='MATCH_EVIDENCE')return'MATCH_EVIDENCE';
  if(value==='GATE_CONFIRMED'||value==='EXCLUSION_CONFIRMED'||value==='EXCLUSION_GATE_CONFIRMED')return'GATE_CONFIRMED';
  if(value==='PARTIAL')return'PARTIAL';
  if(value==='ABSENT')return'ABSENT';
  if(value==='CONTRADICTS')return'CONTRADICTS';
  if(value==='NOT_OBSERVABLE')return'NOT_OBSERVABLE';
  return value;
}

function promptDiagnosticEmptyState(expected){
  const state=new Map();
  for(const concept of expected)state.set(concept.code,{score:null,why:'',parts:new Map(),placeholderParts:new Map()});
  return state;
}

function parsePromptDiagnosticPartial(raw,expected){
  const text=String(raw||'').replace(/```(?:text)?/gi,'').replace(/```/g,'').trim();
  const expectedCodes=new Set(expected.map(c=>c.code));
  const state=promptDiagnosticEmptyState(expected);
  const singleExpectedCode=expected.length===1?expected[0].code:null;
  let currentCode=null;
  let pendingPart=null;
  let pendingPartHeading=null;
  let pendingWhy=null;
  const assessmentPattern='MATCH[_ -]?EVIDENCE|GATE[_ -]?CONFIRMED|EXCLUSION(?:[_ -]?GATE)?[_ -]?CONFIRMED|SUPPORTS|PARTIAL|ABSENT|CONTRADICTS|NOT[_ -]?OBSERVABLE';

  const setScore=(code,value)=>{
    code=String(code||'').toUpperCase();
    if(!expectedCodes.has(code))return;
    const n=Number(value);
    if(Number.isFinite(n)&&n>=0&&n<=100&&state.get(code).score==null)state.get(code).score=n;
  };
  const setWhy=(code,reason)=>{
    code=String(code||'').toUpperCase();
    reason=String(reason||'').trim().replace(/^[-–—:|\s]+/,'');
    if(expectedCodes.has(code)&&reason&&!state.get(code).why)state.get(code).why=reason;
  };
  const setPart=(code,part,assessment,reason)=>{
    code=String(code||'').toUpperCase();
    part=Number(part);assessment=promptDiagnosticCanonicalAssessment(assessment);reason=String(reason||'').trim().replace(/^[-–—:|\s]+/,'').replace(/^REASON\s*[:=\-–—]\s*/i,'');
    if(!expectedCodes.has(code)||!Number.isInteger(part)||part<1||!reason)return;
    if(!['MATCH_EVIDENCE','GATE_CONFIRMED','PARTIAL','ABSENT','CONTRADICTS','NOT_OBSERVABLE'].includes(assessment))return;
    const concept=expected.find(c=>c.code===code);
    if(!concept||part>concept.definitionParts.length)return;
    if(!state.get(code).parts.has(part))state.get(code).parts.set(part,{part,assessment,reason});
  };

  for(const rawLine of text.split(/\r?\n/)){
    const line=cleanPromptDiagnosticLine(rawLine);
    if(!line)continue;

    // Some focused/component-chunk repairs put the known component heading on
    // one line, then emit ASSESSMENT and REASON as separate structured lines:
    // P01.07 :: round cheeks or face
    // ASSESSMENT: PARTIAL
    // REASON: <reason>
    // Keep the exact expected component pending only long enough to attach the
    // immediately following structured assessment. No assessment is inferred
    // from the heading text itself, and the state is discarded on any other
    // substantive line so it cannot bleed across components.
    if(pendingPartHeading){
      // Provider may omit the literal ASSESSMENT label and combine the valid
      // assessment token with its reason on the next line, e.g.:
      // PFM0205.01 :: <component text>
      // MATCH_EVIDENCE: <reason>
      // Because the exact expected component heading is already pending, this
      // shape is unambiguous. Accept only a known assessment token followed by
      // a delimiter and substantive reason; do not infer from arbitrary prose.
      const assessmentWithReason=line.match(new RegExp(`^(${assessmentPattern})\\s*(?:\\||::|[:=\\-–—])\\s*(.+)$`,'i'));
      if(assessmentWithReason&&String(assessmentWithReason[2]||'').trim()){
        setPart(pendingPartHeading.code,pendingPartHeading.part,assessmentWithReason[1],assessmentWithReason[2]);
        currentCode=pendingPartHeading.code;
        pendingPartHeading=null;
        continue;
      }
      const assessmentOnly=line.match(new RegExp(`^ASSESSMENT\\s*(?:\\||::|[:=\\-–—])\\s*(${assessmentPattern})\\s*$`,'i'));
      if(assessmentOnly){
        pendingPart={code:pendingPartHeading.code,part:pendingPartHeading.part,assessment:assessmentOnly[1]};
        currentCode=pendingPartHeading.code;
        pendingPartHeading=null;
        continue;
      }
      pendingPartHeading=null;
    }

    // Some provider repairs echo the template marker and put the real label at
    // the end of the component line, then place the reason on the next line:
    // P03.02 <ASSESSMENT> - ABSENT
    // <reason>
    // Preserve the valid label and consume the following prose line as its reason.
    if(pendingPart){
      const startsNewRecord=/^(?:(?:P\d{2}|PFM\d{4})(?:\.\d{1,2}\b|\s*(?:\||[-–—:]?\s*)(?:SCORE|WHY)\b)|(?:SCORE|WHY)\b|PART\s*\|)/i.test(line);
      if(!startsNewRecord){
        setPart(pendingPart.code,pendingPart.part,pendingPart.assessment,line);
        pendingPart=null;
        continue;
      }
      pendingPart=null;
    }

    // Focused final-score repairs are unambiguously scoped to one concept, but
    // providers sometimes return a Markdown/bare WHY label on one line and put
    // the actual reason on the next line, e.g. "**WHY:**" then prose. Preserve
    // that reason instead of falsely declaring CODE WHY missing. Unqualified WHY
    // remains disallowed for multi-concept responses.
    if(pendingWhy){
      const startsNewRecord=/^(?:(?:P\d{2}|PFM\d{4})(?:\.\d{1,2}\b|\s*(?:\||[-–—:]?\s*)(?:SCORE|WHY)\b)|(?:SCORE|WHY)\b|PART\s*\|)/i.test(line);
      if(!startsNewRecord){
        setWhy(pendingWhy,line);
        pendingWhy=null;
        continue;
      }
      pendingWhy=null;
    }

    let m=line.match(/^(?:#{1,6}\s*)?(?:CONCEPT\s+)?(P\d{2}|PFM\d{4})(?:\s*[-–—:]\s*|\s+)(?:[A-Za-z].*)?$/i);
    if(m&&expectedCodes.has(m[1].toUpperCase()))currentCode=m[1].toUpperCase();

    m=line.match(/^SCORE\s*\|\s*(P\d{2}|PFM\d{4})\s*\|\s*(-?\d+(?:\.\d+)?)\s*%?(?:\s*[-–—:]\s*(.+))?\s*$/i);
    if(m){setScore(m[1],m[2]);if(m[3])setWhy(m[1],m[3]);continue;}
    m=line.match(/^(P\d{2}|PFM\d{4})\s*(?:\||[-–—:]?\s*)SCORE\s*(?:\||[:=\-–—]?\s*)*(-?\d+(?:\.\d+)?)\s*%?(?:\s*[-–—:]\s*(.+))?\s*$/i);
    if(m){setScore(m[1],m[2]);if(m[3])setWhy(m[1],m[3]);currentCode=m[1].toUpperCase();continue;}
    m=line.match(/^SCORE\s+(?:FOR\s+)?(P\d{2}|PFM\d{4})\s*[:=\-–—]?\s*(-?\d+(?:\.\d+)?)\s*%?(?:\s*[-–—:]\s*(.+))?\s*$/i);
    if(m){setScore(m[1],m[2]);if(m[3])setWhy(m[1],m[3]);continue;}
    m=line.match(/^(?:SCORE|MATCH\s+CONFIDENCE)\s*[:=\-–—]\s*(-?\d+(?:\.\d+)?)\s*%?(?:\s*[-–—:]\s*(.+))?\s*$/i);
    if(m&&currentCode){setScore(currentCode,m[1]);if(m[2])setWhy(currentCode,m[2]);continue;}

    m=line.match(/^PART\s*\|\s*(P\d{2}|PFM\d{4})\s*\|\s*(\d+)\s*\|\s*(${assessmentPattern})\s*\|\s*(.+)$/i);
    if(m){setPart(m[1],m[2],m[3],m[4]);continue;}
    // Robust component-ID anchored parsing. The model may echo definition text
    // between the component ID and assessment, e.g.:
    // PFM0412.02 :: <definition text>. SUPPORTS - <reason>
    // Anchor on the known component ID first, then locate the first valid assessment
    // token anywhere after it instead of requiring one punctuation/layout shape.
    m=line.match(/^(P\d{2}|PFM\d{4})\.(\d{1,2})\b(.*)$/i);
    if(m){
      const code=m[1].toUpperCase();
      const tail=String(m[3]||'');
      const a=tail.match(new RegExp(`\\b(${assessmentPattern})\\b`,'i'));
      if(a){
        const after=tail.slice((a.index||0)+a[0].length).replace(/^\s*(?:\||::|[:.\-–—])+\s*/,'').trim();
        if(after){setPart(code,m[2],a[1],after);currentCode=code;continue;}
        // A real assessment token is present, but the model put the reason on
        // the next line. Keep the component pending instead of declaring it missing.
        pendingPart={code,part:m[2],assessment:a[1]};
        currentCode=code;
        continue;
      }
      // Provider may preserve the literal <ASSESSMENT> placeholder while still
      // supplying a substantive reason on the same component line, e.g.:
      // PFM1011.03 <ASSESSMENT> - <reason>
      // Preserve that reason for a tiny assessment-token recovery call. Do not
      // infer the missing label from prose in the parser.
      const placeholder=tail.match(/<ASSESSMENT>\s*(?:\||::|[:=\-–—])\s*(.+)$/i);
      if(placeholder&&String(placeholder[1]||'').trim()){
        const concept=expected.find(c=>c.code===code);
        const part=Number(m[2]);
        if(expectedCodes.has(code)&&concept&&Number.isInteger(part)&&part>=1&&part<=concept.definitionParts.length){
          const reason=String(placeholder[1]).trim().replace(/^[-–—:|\s]+/,'');
          if(reason&&!state.get(code).placeholderParts.has(part))state.get(code).placeholderParts.set(part,{part,reason});
          currentCode=code;
          continue;
        }
      }

      // Heading-only provider form. Record the exact expected component ID, but
      // do not create a component result until a separate structured ASSESSMENT
      // line and then a substantive reason are supplied.
      const concept=expected.find(c=>c.code===code);
      const part=Number(m[2]);
      if(expectedCodes.has(code)&&concept&&Number.isInteger(part)&&part>=1&&part<=concept.definitionParts.length&&tail.trim()){
        pendingPartHeading={code,part};
        currentCode=code;
        continue;
      }
    }
    m=line.match(new RegExp(`^(P\\d{2}|PFM\\d{4})\\.(\\d{1,2})\\s*(?:\\||[:\\-–—]?\\s*)(${assessmentPattern})\\s*(?:\\||[:\\-–—]\\s*)+(.+)$`,'i'));
    if(m){setPart(m[1],m[2],m[3],m[4]);currentCode=m[1].toUpperCase();continue;}
    m=line.match(new RegExp(`^(?:PART\\s*)?\\[?(\\d{1,2})\\]?\\s*[.):\\-–—]?\\s*(${assessmentPattern})\\s*(?:[:\\-–—]\\s*)+(.+)$`,'i'));
    if(m&&currentCode){setPart(currentCode,m[1],m[2],m[3]);continue;}

    m=line.match(/^WHY\s*\|\s*(P\d{2}|PFM\d{4})\s*\|\s*(.+)$/i);
    if(m){setWhy(m[1],m[2]);continue;}
    m=line.match(/^(P\d{2}|PFM\d{4})\s*(?:\||[-–—:]?\s*)WHY\s*(?:\||[:\-–—]?\s*)+(.+)$/i);
    if(m){setWhy(m[1],m[2]);currentCode=m[1].toUpperCase();continue;}
    m=line.match(/^WHY\s*[:\-–—]\s*(.+)$/i);
    if(m&&singleExpectedCode){setWhy(singleExpectedCode,m[1]);continue;}
    m=line.match(/^WHY\s*[:\-–—]?\s*$/i);
    if(m&&singleExpectedCode){pendingWhy=singleExpectedCode;continue;}
  }
  return{state,responsePreview:text.slice(0,1200)};
}

// Final-score calls are single-concept and occasionally come back with a valid
// CODE SCORE line followed by a normal explanatory paragraph but no literal WHY
// label. Keep this tolerance local to the final-score repair path: other parser
// modes remain code/label strict, so unlabeled prose cannot bleed across concepts.
function promptDiagnosticUnlabeledFinalScoreWhy(raw,concept){
  const code=String(concept?.code||'').toUpperCase();
  if(!/^(?:P\d{2}|PFM\d{4})$/.test(code))return'';
  const text=String(raw||'').replace(/```(?:text)?/gi,'').replace(/```/g,'').trim();
  if(!text)return'';

  // A foreign concept code makes the response ambiguous; never infer an unlabeled WHY.
  const mentionedCodes=[...text.matchAll(/\b(P\d{2}|PFM\d{4})\b/gi)].map(m=>m[1].toUpperCase());
  if(mentionedCodes.some(found=>found!==code))return'';

  const lines=text.split(/\r?\n/);
  let scoreLineIndex=-1;
  for(let i=0;i<lines.length;i++){
    const line=cleanPromptDiagnosticLine(lines[i]);
    if(!line)continue;
    const codedScore=new RegExp(`^${promptDiagnosticEscapedRegex(code)}\\s*(?:\\||[-–—:]?\\s*)SCORE\\s*(?:\\||[:=\\-–—]?\\s*)*(-?\\d+(?:\\.\\d+)?)\\s*%?(?:\\s*[-–—:]\\s*(.+))?\\s*$`,'i').exec(line);
    const pipeScore=new RegExp(`^SCORE\\s*\\|\\s*${promptDiagnosticEscapedRegex(code)}\\s*\\|\\s*(-?\\d+(?:\\.\\d+)?)\\s*%?(?:\\s*[-–—:]\\s*(.+))?\\s*$`,'i').exec(line);
    const forScore=new RegExp(`^SCORE\\s+(?:FOR\\s+)?${promptDiagnosticEscapedRegex(code)}\\s*[:=\\-–—]?\\s*(-?\\d+(?:\\.\\d+)?)\\s*%?(?:\\s*[-–—:]\\s*(.+))?\\s*$`,'i').exec(line);
    const match=codedScore||pipeScore||forScore;
    if(!match)continue;
    const n=Number(match[1]);
    if(!Number.isFinite(n)||n<0||n>100)continue;
    // If the score line already carries prose after it, the normal parser treats
    // that prose as WHY; this fallback is unnecessary.
    if(match[2]&&String(match[2]).trim())return'';
    scoreLineIndex=i;
    break;
  }
  if(scoreLineIndex<0)return'';

  const prose=[];
  let started=false;
  const structuredStart=/^(?:(?:P\d{2}|PFM\d{4})(?:\.\d{1,2}\b|\s*(?:\||[-–—:]?\s*)(?:SCORE|WHY)\b)|(?:SCORE|WHY)\b|PART\s*\|)/i;
  for(let i=scoreLineIndex+1;i<lines.length;i++){
    const rawLine=String(lines[i]||'');
    if(!rawLine.trim()){
      if(started)break; // first substantive paragraph only
      continue;
    }
    const line=cleanPromptDiagnosticLine(rawLine);
    if(!line)continue;
    if(structuredStart.test(line))return''; // explicit structure takes precedence
    if(/<\s*(?:WHY|OVERALL\s+SCORE\s+REASON|WHY\s+THESE\s+COMPONENT)/i.test(line))return'';
    if(/^<[^>]+>$/.test(line))return'';
    if(!/[A-Za-z]/.test(line))return'';
    prose.push(line);
    started=true;
  }
  const reason=prose.join(' ').trim();
  return reason.length>=12?reason:'';
}

function promptDiagnosticMissingForConcept(concept,data){
  const missing=[];
  if(data.score==null)missing.push(`${concept.code} SCORE`);
  for(let index=0;index<concept.definitionParts.length;index++)if(!data.parts.has(index+1))missing.push(promptDiagnosticPartId(concept.code,index));
  if(!data.why)missing.push(`${concept.code} WHY`);
  return missing;
}

function finalizePromptDiagnosticConcept(concept,data){
  const missing=promptDiagnosticMissingForConcept(concept,data);
  if(missing.length)throw new Error(`Prompt Diagnostics ${concept.code} incomplete; missing ${missing.join(', ')}`);
  const confidence=Number(data.score);
  if(!Number.isFinite(confidence)||confidence<0||confidence>100)throw new Error(`Prompt Diagnostics confidence for ${concept.code} must be numeric 0-100`);
  const definitionAnalysis=concept.definitionParts.map((partText,index)=>{
    const item=data.parts.get(index+1);
    return{part:index+1,id:promptDiagnosticPartId(concept.code,index),text:partText,assessment:item.assessment,reason:item.reason};
  });
  return{
    code:concept.code,name:concept.name,kind:concept.kind,symbol:concept.symbol,primIds:[...concept.primIds],position:concept.position,
    confidence:Math.round(confidence*10)/10,definition:concept.definition,definitionAnalysis,scoreReason:data.why
  };
}

function promptDiagnosticRepairPrompt({concept,sources,reactions,description,missing}){
  const {sourceLabel,evidenceText}=promptDiagnosticEvidence({sources,reactions,description});
  return `GENREACTRIX PROMPT DIAGNOSTICS — INCOMPLETE CONCEPT REPAIR.

The previous multi-concept answer did not complete the required component-level diagnostic for ${concept.code} ${concept.name}. Re-evaluate THIS ONE CONCEPT from scratch so its final score is based on every definition component, not on a generalized impression.

EVIDENCE SOURCE COMBINATION: ${sourceLabel}
${evidenceText}

${promptDiagnosticConceptBlock(concept)}

SCORING RULES:
- Produce an independent 0-100 match confidence for this concept only.
- Assess every numbered definition component separately, including at 0%.
- Use MATCH_EVIDENCE for positive match evidence, GATE_CONFIRMED for correctly applied limiting/non-qualifier rules, or PARTIAL, ABSENT, CONTRADICTS, NOT_OBSERVABLE as appropriate. Legacy SUPPORTS is accepted as MATCH_EVIDENCE.
- The final score must follow from the component-level findings and use the calibration: 0 none/hard-gated; 1-19 trace; 20-39 weak; 40-59 moderate; 60-79 strong; 80-94 very strong/direct; 95-100 exceptionally complete/unmistakable.
- Cue ≠ meaning. Do not invent evidence or promote an ambiguous cue into a specific cause.
- Keep this concept isolated from unrelated concepts in the same wave.
- The component findings, numeric score, and WHY must agree.
- FINAL SCORE SELF-CHECK: Before returning the score, re-read the completed component assessments and reasons and evaluate the score again from those findings. If the proposed score conflicts with your own assessment, revise the score. Assessment -> score, never score -> assessment. Do not invent new evidence during this self-check.
- Do not collapse the definition into a single Evidence paragraph.

The prior response was incomplete. Missing identifiers included: ${missing.join(', ')}.
Return the COMPLETE concept, not merely those missing lines, using these exact record identifiers. Minor punctuation around them is acceptable:
${promptDiagnosticRequiredRecords([concept])}

No JSON is required. No table is required. Every component identifier must appear.`;
}

function promptDiagnosticMergeState(target,source,concept){
  if(!target||!source)return target;
  if(target.score==null&&source.score!=null)target.score=source.score;
  if(!target.why&&source.why)target.why=source.why;
  for(const [part,item] of source.parts||[]){
    const partNumber=Number(part);
    if(Number.isInteger(partNumber)&&partNumber>=1&&partNumber<=concept.definitionParts.length&&!target.parts.has(partNumber))target.parts.set(partNumber,item);
  }
  if(target.placeholderParts instanceof Map&&source.placeholderParts instanceof Map){
    for(const [part,item] of source.placeholderParts){
      const partNumber=Number(part);
      if(Number.isInteger(partNumber)&&partNumber>=1&&partNumber<=concept.definitionParts.length&&!target.parts.has(partNumber)&&!target.placeholderParts.has(partNumber))target.placeholderParts.set(partNumber,item);
    }
  }
  return target;
}

function promptDiagnosticComponentChunkPrompt({concept,sources,reactions,description,partNumbers}){
  const {sourceLabel,evidenceText}=promptDiagnosticEvidence({sources,reactions,description});
  const requested=partNumbers.map(partNumber=>{
    const index=partNumber-1;
    return `${promptDiagnosticPartId(concept.code,index)} :: ${concept.definitionParts[index]}`;
  }).join('\n');
  const required=partNumbers.map(partNumber=>`${concept.code}.${String(partNumber).padStart(2,'0')} <ASSESSMENT> - <reason>`).join('\n');
  return `GENREACTRIX PROMPT DIAGNOSTICS — COMPONENT CHUNK REPAIR.

Evaluate ONLY the numbered definition components listed below for ${concept.code} ${concept.name}. This is a fallback because the model did not reliably enumerate the entire definition in one response.

EVIDENCE SOURCE COMBINATION: ${sourceLabel}
${evidenceText}

CURRENT WORKER DEFINITION (verbatim):
${concept.definition}

COMPONENTS TO ASSESS NOW:
${requested}

For every component use exactly one label: MATCH_EVIDENCE, GATE_CONFIRMED, PARTIAL, ABSENT, CONTRADICTS, or NOT_OBSERVABLE. Legacy SUPPORTS is accepted as MATCH_EVIDENCE.
Give a concrete evidence-grounded reason for every component, including GATE_CONFIRMED, ABSENT, CONTRADICTS, and NOT_OBSERVABLE. Cue ≠ meaning: do not invent evidence or promote ambiguous cues into specific claims.
Do not give an overall score in this call. Do not discuss unlisted component IDs.

REQUIRED RECORDS:
${required}

Plain text only. Every listed component ID must appear.`;
}

function promptDiagnosticScoreFromPartsPrompt({concept,sources,reactions,description,data}){
  const {sourceLabel,evidenceText}=promptDiagnosticEvidence({sources,reactions,description});
  const findings=concept.definitionParts.map((partText,index)=>{
    const item=data.parts.get(index+1);
    return `${promptDiagnosticPartId(concept.code,index)} ${item.assessment} - ${item.reason}`;
  }).join('\n');
  return `GENREACTRIX PROMPT DIAGNOSTICS — FINAL SCORE FROM COMPLETED COMPONENT FINDINGS.

Concept: ${concept.code} ${concept.name}
EVIDENCE SOURCE COMBINATION: ${sourceLabel}
${evidenceText}

CURRENT WORKER DEFINITION (verbatim):
${concept.definition}

COMPLETED COMPONENT FINDINGS:
${findings}

Now derive ONE independent 0-100 match confidence from those completed findings. The score is not a share of a 100% pool and is not relative to other concepts. Use this calibration: 0 none/hard-gated; 1-19 trace; 20-39 weak; 40-59 moderate; 60-79 strong; 80-94 very strong/direct; 95-100 exceptionally complete/unmistakable. 100 requires essentially no meaningful doubt; genuine positive match evidence should normally prevent 0 unless a hard gate overrides it. GATE_CONFIRMED validates a boundary but does not itself raise match confidence. Do not change the component findings in this call.
The WHY must agree with the numeric score, evaluate this concept only, identify the actual semantic route that earns the score, and must not invent evidence or a more specific cause than the evidence supports.
FINAL SCORE SELF-CHECK: Before returning the score, re-read every completed component finding above and evaluate the proposed score again from those findings. If the score conflicts with your own assessment, revise the score. Assessment -> score, never score -> assessment. Do not change the component findings and do not invent new evidence.

Return only:
${concept.code} SCORE <0-100>
${concept.code} WHY - <why these component findings justify that score>`;
}

function promptDiagnosticAssessmentTokenRecoveryPrompt({concept,data,partNumbers}){
  const records=partNumbers.map(partNumber=>{
    const item=data.placeholderParts.get(partNumber);
    const component=concept.definitionParts[partNumber-1];
    return `${promptDiagnosticPartId(concept.code,partNumber-1)} :: ${component}\nPRESERVED REASON: ${item?.reason||''}`;
  }).join('\n\n');
  const required=partNumbers.map(partNumber=>`${promptDiagnosticPartId(concept.code,partNumber-1)} <ASSESSMENT_TOKEN>`).join('\n');
  return `GENREACTRIX PROMPT DIAGNOSTICS — ASSESSMENT TOKEN RECOVERY.

The provider already supplied a reason for each component below but copied the literal <ASSESSMENT> placeholder instead of choosing a label.
Choose the missing assessment token from the preserved component text and preserved reason only. Do not add, rewrite, or invent evidence.
Allowed tokens: MATCH_EVIDENCE, GATE_CONFIRMED, PARTIAL, ABSENT, CONTRADICTS, NOT_OBSERVABLE.

${records}

Return only these records, one per line:
${required}`;
}

function parsePromptDiagnosticAssessmentTokenRecovery(raw,concept,partNumbers){
  const allowed=new Set(['MATCH_EVIDENCE','GATE_CONFIRMED','PARTIAL','ABSENT','CONTRADICTS','NOT_OBSERVABLE']);
  const wanted=new Set(partNumbers.map(Number));
  const found=new Map();
  const code=promptDiagnosticEscapedRegex(concept.code);
  const assessmentPattern='MATCH[_ -]?EVIDENCE|GATE[_ -]?CONFIRMED|EXCLUSION(?:[_ -]?GATE)?[_ -]?CONFIRMED|SUPPORTS|PARTIAL|ABSENT|CONTRADICTS|NOT[_ -]?OBSERVABLE';
  for(const rawLine of String(raw||'').split(/\r?\n/)){
    const line=cleanPromptDiagnosticLine(rawLine);
    if(!line)continue;
    const m=line.match(new RegExp(`^${code}\\.(\\d{1,2})\\s*(?:(?:ASSESSMENT|ASSESSMENT_TOKEN)\\s*)?(?:\\||::|[:=\\-–—])?\\s*(${assessmentPattern})\\s*$`,'i'));
    if(!m)continue;
    const part=Number(m[1]);
    const assessment=promptDiagnosticCanonicalAssessment(m[2]);
    if(wanted.has(part)&&allowed.has(assessment)&&!found.has(part))found.set(part,assessment);
  }
  return found;
}

async function runPromptDiagnosticPlaceholderAssessmentRecovery(env,{model,concept,data,partNumbers,recoveryLog,callContext}){
  const recoverable=partNumbers.filter(partNumber=>!data.parts.has(partNumber)&&data.placeholderParts instanceof Map&&data.placeholderParts.has(partNumber));
  if(!recoverable.length)return{attempts:0,recovered:0};
  let attempts=0;
  for(let attempt=1;attempt<=2;attempt++){
    attempts=attempt;
    try{
      const prompt=promptDiagnosticAssessmentTokenRecoveryPrompt({concept,data,partNumbers:recoverable});
      const raw=await runPromptDiagnosticStructured(env,model,null,prompt,null,Math.max(500,220+recoverable.length*80),'text',{temperature:attempt===1?0.01:0,preserveWhitespace:true,providerCallTimeoutMs:PROMPT_DIAGNOSTIC_PROVIDER_CALL_TIMEOUT_MS},{recoveryLog,callContext,stage:'assessment-token-recovery',conceptCode:concept.code,componentIds:recoverable.map(n=>promptDiagnosticPartId(concept.code,n-1)),maxProviderAttempts:3});
      const found=parsePromptDiagnosticAssessmentTokenRecovery(raw,concept,recoverable);
      for(const [part,assessment] of found){
        if(data.parts.has(part))continue;
        const saved=data.placeholderParts.get(part);
        const reason=String(saved?.reason||'').trim();
        if(reason)data.parts.set(part,{part,assessment,reason});
      }
      if(recoverable.every(partNumber=>data.parts.has(partNumber))){
        promptDiagnosticRecoveryEvent(recoveryLog,{type:'format-recovered',from:'literal-assessment-placeholder',to:'assessment-token',stage:'assessment-token-recovery',conceptCode:concept.code,componentIds:recoverable.map(n=>promptDiagnosticPartId(concept.code,n-1)),batchIndex:callContext?.batchIndex??null,callMode:callContext?.callMode??null,waveIndex:callContext?.waveIndex??null});
        return{attempts,recovered:recoverable.length};
      }
    }catch(error){
      if(!promptDiagnosticTransientProviderError(error))throw error;
      // Let the existing component retry/single-component fallback recover if
      // this tiny label-only provider call also encounters infrastructure noise.
      break;
    }
  }
  return{attempts,recovered:recoverable.filter(partNumber=>data.parts.has(partNumber)).length};
}

async function runPromptDiagnosticComponentChunks(env,{model,image,concept,sources,reactions,description,data,recoveryLog,callContext}){
  let chunkCalls=0;
  let retries=0;
  while(true){
    const missingParts=[];
    for(let partNumber=1;partNumber<=concept.definitionParts.length;partNumber++)if(!data.parts.has(partNumber))missingParts.push(partNumber);
    if(!missingParts.length)break;
    const partNumbers=missingParts.slice(0,PROMPT_DIAGNOSTIC_COMPONENT_CHUNK_SIZE);
    let completed=false,lastRaw='',fallbackToSingles=false;
    for(let attempt=1;attempt<=2;attempt++){
      const prompt=promptDiagnosticComponentChunkPrompt({concept,sources,reactions,description,partNumbers});
      try{
        chunkCalls++;if(attempt>1)retries++;
        const raw=await runPromptDiagnosticStructured(env,model,image,prompt,null,Math.max(900,500+partNumbers.length*180),'text',{temperature:attempt===1?0.04:0.01,preserveWhitespace:true,providerCallTimeoutMs:PROMPT_DIAGNOSTIC_PROVIDER_CALL_TIMEOUT_MS},{recoveryLog,callContext,stage:'component-chunk',conceptCode:concept.code,componentIds:partNumbers.map(n=>promptDiagnosticPartId(concept.code,n-1)),maxProviderAttempts:2});
        lastRaw=String(raw||'');
        const partial=parsePromptDiagnosticPartial(lastRaw,[concept]);
        promptDiagnosticMergeState(data,partial.state.get(concept.code),concept);
        if(data.placeholderParts instanceof Map&&partNumbers.some(partNumber=>!data.parts.has(partNumber)&&data.placeholderParts.has(partNumber))){
          await runPromptDiagnosticPlaceholderAssessmentRecovery(env,{model,concept,data,partNumbers,recoveryLog,callContext});
        }
        completed=partNumbers.every(partNumber=>data.parts.has(partNumber));
        if(completed)break;
      }catch(error){
        if(!promptDiagnosticTransientProviderError(error))throw error;
        fallbackToSingles=true;
        promptDiagnosticRecoveryEvent(recoveryLog,{type:'provider-fallback',from:'component-chunk',to:'single-components',failureKind:promptDiagnosticProviderFailureKind(error),stage:'component-chunk',conceptCode:concept.code,componentIds:partNumbers.map(n=>promptDiagnosticPartId(concept.code,n-1)),batchIndex:callContext?.batchIndex??null,callMode:callContext?.callMode??null,waveIndex:callContext?.waveIndex??null});
        break;
      }
    }

    if(fallbackToSingles){
      for(const partNumber of partNumbers){
        if(data.parts.has(partNumber))continue;
        let singleComplete=false;
        for(let attempt=1;attempt<=2;attempt++){
          const prompt=promptDiagnosticComponentChunkPrompt({concept,sources,reactions,description,partNumbers:[partNumber]});
          chunkCalls++;if(attempt>1)retries++;
          const raw=await runPromptDiagnosticStructured(env,model,image,prompt,null,900,'text',{temperature:attempt===1?0.03:0.01,preserveWhitespace:true,providerCallTimeoutMs:PROMPT_DIAGNOSTIC_PROVIDER_CALL_TIMEOUT_MS},{recoveryLog,callContext,stage:'single-component',conceptCode:concept.code,componentIds:[promptDiagnosticPartId(concept.code,partNumber-1)],maxProviderAttempts:3});
          lastRaw=String(raw||'');
          const partial=parsePromptDiagnosticPartial(lastRaw,[concept]);
          promptDiagnosticMergeState(data,partial.state.get(concept.code),concept);
          if(data.placeholderParts instanceof Map&&!data.parts.has(partNumber)&&data.placeholderParts.has(partNumber)){
            await runPromptDiagnosticPlaceholderAssessmentRecovery(env,{model,concept,data,partNumbers:[partNumber],recoveryLog,callContext});
          }
          if(data.parts.has(partNumber)){singleComplete=true;break;}
        }
        if(!singleComplete){
          const id=promptDiagnosticPartId(concept.code,partNumber-1);
          throw diagnosticError(
            `Prompt Diagnostics ${concept.code} single-component recovery remained incomplete; missing ${id}`,
            {phase:'prompt-diagnostics-single-component-repair',conceptCode:concept.code,missingRequirements:[id],batchIndex:callContext?.batchIndex??null,callMode:callContext?.callMode??null,waveIndex:callContext?.waveIndex??null,responsePreview:lastRaw.slice(0,1200)}
          );
        }
      }
      completed=partNumbers.every(partNumber=>data.parts.has(partNumber));
    }

    if(!completed){
      const stillMissing=partNumbers.filter(partNumber=>!data.parts.has(partNumber)).map(partNumber=>`${concept.code}.${String(partNumber).padStart(2,'0')}`);
      throw diagnosticError(
        `Prompt Diagnostics ${concept.code} component chunk remained incomplete; missing ${stillMissing.join(', ')}`,
        {phase:'prompt-diagnostics-component-chunk-repair',conceptCode:concept.code,missingRequirements:stillMissing,batchIndex:callContext?.batchIndex??null,callMode:callContext?.callMode??null,waveIndex:callContext?.waveIndex??null,responsePreview:lastRaw.slice(0,1200)}
      );
    }
  }
  return{chunkCalls,retries};
}

async function runPromptDiagnosticFinalScore(env,{model,image,concept,sources,reactions,description,data,recoveryLog,callContext}){
  let lastRaw='';
  for(let attempt=1;attempt<=2;attempt++){
    data.score=null;data.why='';
    const prompt=promptDiagnosticScoreFromPartsPrompt({concept,sources,reactions,description,data});
    const raw=await runPromptDiagnosticStructured(env,model,image,prompt,null,1000,'text',{temperature:attempt===1?0.04:0.01,preserveWhitespace:true,providerCallTimeoutMs:PROMPT_DIAGNOSTIC_PROVIDER_CALL_TIMEOUT_MS},{recoveryLog,callContext,stage:'final-score',conceptCode:concept.code,maxProviderAttempts:3});
    lastRaw=String(raw||'');
    const partial=parsePromptDiagnosticPartial(lastRaw,[concept]);
    const scored=partial.state.get(concept.code);
    if(scored?.score!=null)data.score=scored.score;
    if(scored?.why)data.why=scored.why;
    if(data.score!=null&&!data.why){
      const unlabeledWhy=promptDiagnosticUnlabeledFinalScoreWhy(lastRaw,concept);
      if(unlabeledWhy)data.why=unlabeledWhy;
    }
    if(data.score!=null&&data.why)return{attempts:attempt,raw:lastRaw};
  }
  const missing=[];if(data.score==null)missing.push(`${concept.code} SCORE`);if(!data.why)missing.push(`${concept.code} WHY`);
  throw diagnosticError(
    `Prompt Diagnostics ${concept.code} final score remained incomplete; missing ${missing.join(', ')}`,
    {phase:'prompt-diagnostics-final-score',conceptCode:concept.code,missingRequirements:missing,batchIndex:callContext?.batchIndex??null,callMode:callContext?.callMode??null,waveIndex:callContext?.waveIndex??null,responsePreview:lastRaw.slice(0,1200)}
  );
}

async function runPromptDiagnosticConceptRepair(env,{model,image,concept,sources,reactions,description,missing,seedData,recoveryLog,callContext}){
  const data=promptDiagnosticEmptyState([concept]).get(concept.code);
  if(seedData)promptDiagnosticMergeState(data,seedData,concept);
  let fullRepairAttempts=0,lastRaw='',focusedProviderFallback=false;

  // One focused whole-concept attempt comes first. A transient provider failure
  // is infrastructure noise: retry it automatically, then fall through to the
  // smaller component path instead of killing the diagnostic run.
  {
    const prompt=promptDiagnosticRepairPrompt({concept,sources,reactions,description,missing});
    try{
      const raw=await runPromptDiagnosticStructured(env,model,image,prompt,null,Math.max(1800,Math.min(4800,1200+concept.definitionParts.length*110)),'text',{temperature:0.02,preserveWhitespace:true,providerCallTimeoutMs:PROMPT_DIAGNOSTIC_PROVIDER_CALL_TIMEOUT_MS},{recoveryLog,callContext,stage:'focused-concept',conceptCode:concept.code,maxProviderAttempts:2});
      fullRepairAttempts=1;lastRaw=String(raw||'');
      const partial=parsePromptDiagnosticPartial(lastRaw,[concept]);
      promptDiagnosticMergeState(data,partial.state.get(concept.code),concept);
    }catch(error){
      if(!promptDiagnosticTransientProviderError(error))throw error;
      focusedProviderFallback=true;
      promptDiagnosticRecoveryEvent(recoveryLog,{type:'provider-fallback',from:'focused-concept',to:'component-chunks',failureKind:promptDiagnosticProviderFailureKind(error),stage:'focused-concept',conceptCode:concept.code,batchIndex:callContext?.batchIndex??null,callMode:callContext?.callMode??null,waveIndex:callContext?.waveIndex??null});
    }
  }

  const missingParts=[];
  for(let partNumber=1;partNumber<=concept.definitionParts.length;partNumber++)if(!data.parts.has(partNumber))missingParts.push(partNumber);
  let componentChunkCalls=0,componentChunkRetries=0,finalScoreAttempts=0;
  if(missingParts.length){
    const chunked=await runPromptDiagnosticComponentChunks(env,{model,image,concept,sources,reactions,description,data,recoveryLog,callContext});
    componentChunkCalls=chunked.chunkCalls;componentChunkRetries=chunked.retries;
  }

  if(missingParts.length||data.score==null||!data.why||focusedProviderFallback){
    const scored=await runPromptDiagnosticFinalScore(env,{model,image,concept,sources,reactions,description,data,recoveryLog,callContext});
    finalScoreAttempts=scored.attempts;lastRaw=scored.raw;
  }

  const stillMissing=promptDiagnosticMissingForConcept(concept,data);
  if(stillMissing.length){
    throw diagnosticError(
      `Prompt Diagnostics ${concept.code} remained incomplete after adaptive repair; missing ${stillMissing.join(', ')}`,
      {phase:'prompt-diagnostics-adaptive-repair',conceptCode:concept.code,missingRequirements:stillMissing,batchIndex:callContext?.batchIndex??null,callMode:callContext?.callMode??null,waveIndex:callContext?.waveIndex??null,responsePreview:lastRaw.slice(0,1200)}
    );
  }
  return{
    result:finalizePromptDiagnosticConcept(concept,data),
    raw:lastRaw,
    attempts:fullRepairAttempts,
    strategy:componentChunkCalls?(focusedProviderFallback?'provider-fallback+component-chunks+final-score':'focused+component-chunks+final-score'):'focused',
    componentChunkCalls,
    componentChunkRetries,
    finalScoreAttempts
  };
}

function promptDiagnosticEscapedRegex(value){return String(value||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}

function promptDiagnosticWhySignals(why){
  why=String(why||'').trim();
  const negativeWhyPatterns=[
    /\bdoes not (?:provide|contain|show|have) (?:any |enough |sufficient )?evidence\b/i,
    /\bno (?:clear |meaningful |sufficient )?evidence\b/i,
    /\bnot enough (?:information|evidence)\b/i,
    /\binsufficient (?:information|evidence)\b/i,
    /\bunclear whether\b/i,
    /\bdoes not support (?:the )?(?:concept|theme)?\b/i,
    /\bnot supported by (?:the )?(?:image|evidence)\b/i,
    /\bdoes not match (?:the )?(?:concept|theme|definition)\b/i
  ];
  const positiveWhyPatterns=[
    /\bstrong match\b/i,
    /\bclear evidence\b/i,
    /\bstrongly supports\b/i,
    /\bsupports (?:the )?(?:concept|theme)\b/i,
    /\bhighly consistent\b/i
  ];
  const positive=positiveWhyPatterns.some(rx=>rx.test(why));
  const negative=negativeWhyPatterns.some(rx=>rx.test(why));
  return{positive,negative,polarity:positive&&negative?'mixed':positive?'positive':negative?'negative':'neutral'};
}

function promptDiagnosticConsistencyIssues(concept,result,callConcepts=[]){
  const issues=[];
  const confidence=Number(result?.confidence);
  const why=String(result?.scoreReason||'').trim();
  const parts=Array.isArray(result?.definitionAnalysis)?result.definitionAnalysis:[];
  const positive=parts.filter(item=>item.assessment==='MATCH_EVIDENCE').length;
  const partial=parts.filter(item=>item.assessment==='PARTIAL').length;
  const whySignals=promptDiagnosticWhySignals(why);

  if(Number.isFinite(confidence)&&confidence>=80&&whySignals.negative)issues.push('high score conflicts with a negative/insufficient-evidence WHY');
  if(Number.isFinite(confidence)&&confidence<=20&&whySignals.positive)issues.push('low score conflicts with a strongly positive WHY');
  if(Number.isFinite(confidence)&&confidence>=80&&positive===0&&partial===0)issues.push('high score has no MATCH_EVIDENCE or PARTIAL component');
  if(Number.isFinite(confidence)&&confidence===0&&positive>0)issues.push('0 score conflicts with positive MATCH_EVIDENCE');

  const ownDefinition=String(concept?.definition||'').toLowerCase();
  for(const other of callConcepts||[]){
    if(!other||other.code===concept.code)continue;
    const code=String(other.code||'');
    const name=String(other.name||'').trim();
    if(code&&new RegExp(`\\b${promptDiagnosticEscapedRegex(code)}\\b`,'i').test(why)){
      issues.push(`WHY references unrelated same-call concept ${code}`);continue;
    }
    if(name&&name.length>=4&&!ownDefinition.includes(name.toLowerCase())&&new RegExp(`\\b${promptDiagnosticEscapedRegex(name)}\\b`,'i').test(why))issues.push(`WHY references unrelated same-call concept ${name}`);
  }
  return[...new Set(issues)];
}

function promptDiagnosticLiteralPlaceholderIssues(raw){
  const issues=[];
  const assessmentPattern='MATCH[_ -]?EVIDENCE|GATE[_ -]?CONFIRMED|EXCLUSION(?:[_ -]?GATE)?[_ -]?CONFIRMED|SUPPORTS|PARTIAL|ABSENT|CONTRADICTS|NOT[_ -]?OBSERVABLE';
  const unresolved=String(raw||'').split(/\r?\n/).some(line=>{
    const marker=/<ASSESSMENT>/i.exec(line);
    if(!marker)return false;
    const after=line.slice(marker.index+marker[0].length);
    // Echoing <ASSESSMENT> is formatting noise, not a structural failure, when
    // the same component line also supplies a real assessment token afterward.
    return !new RegExp(`\\b(?:${assessmentPattern})\\b`,'i').test(after);
  });
  if(unresolved)issues.push('literal <ASSESSMENT> placeholder returned without an allowed assessment token');
  return issues;
}

function promptDiagnosticValidationSnapshot(concept,data,result,raw){
  const assessments={};
  if(data?.parts instanceof Map){
    for(const [part,item] of data.parts)assessments[promptDiagnosticPartId(concept.code,Number(part)-1)]=item?.assessment||null;
  }else if(Array.isArray(result?.definitionAnalysis)){
    for(const item of result.definitionAnalysis)assessments[item.id]=item.assessment;
  }
  const why=String(result?.scoreReason||data?.why||'').trim();
  return{
    parsedScore:result?.confidence??data?.score??null,
    parsedAssessments:assessments,
    whyPolarity:promptDiagnosticWhySignals(why).polarity,
    missingRequirements:promptDiagnosticMissingForConcept(concept,data),
    placeholderIssues:promptDiagnosticLiteralPlaceholderIssues(raw)
  };
}

function promptDiagnosticConsistencyRepairPrompt({concept,sources,reactions,description,issues}){
  const {sourceLabel,evidenceText}=promptDiagnosticEvidence({sources,reactions,description});
  return `GENREACTRIX PROMPT DIAGNOSTICS — CONSISTENCY / EVIDENCE REPAIR.

The previous completed answer for ${concept.code} ${concept.name} was structurally complete but failed validation:
${issues.map((issue,index)=>`${index+1}. ${issue}`).join('\n')}

Re-evaluate THIS ONE CONCEPT from scratch. Do not defend or preserve the previous score.

EVIDENCE SOURCE COMBINATION: ${sourceLabel}
${evidenceText}

${promptDiagnosticConceptBlock(concept)}

${THEME_SEMANTIC_EVIDENCE_RULES}

REPAIR RULES:
- Replace every <ASSESSMENT> placeholder with an actual allowed assessment token. The literal text <ASSESSMENT> is invalid output.
- Use MATCH_EVIDENCE only for positive evidence that raises confidence.
- Use GATE_CONFIRMED when a limiting/non-qualifier rule is correctly recognized; it does not itself raise confidence.
- Also allowed: PARTIAL, ABSENT, CONTRADICTS, NOT_OBSERVABLE.
- Confidence calibration: 0 none/hard-gated; 1-19 trace; 20-39 weak; 40-59 moderate; 60-79 strong; 80-94 very strong/direct; 95-100 exceptionally complete/unmistakable.
- The numeric score, every component finding, and WHY must agree.
- FINAL SCORE SELF-CHECK: Before returning the score, re-read the completed component assessments and reasons and evaluate the score again from those findings. If the proposed score conflicts with your own assessment, revise the score. Assessment -> score, never score -> assessment. Do not invent new evidence during this self-check.
- Evaluate only ${concept.code} ${concept.name}. Do not mention or compare unrelated concepts from the same wave.
- Do not invent dirt, hoarding, romance, clinical setting, supernatural danger, altered reality, performance, spectacle, or any other specific condition unless the available evidence actually supports it.
- If the concept fits through one route in a broad definition, identify that route explicitly.

Return the COMPLETE required records:
${promptDiagnosticRequiredRecords([concept])}

Plain text only.`;
}

async function runPromptDiagnosticQualityRepair(env,{model,image,concept,sources,reactions,description,issues,callConcepts,recoveryLog,callContext}){
  let lastRaw='';
  let lastIssues=[...(issues||[])];
  let lastSnapshot={parsedScore:null,parsedAssessments:{},whyPolarity:'neutral',missingRequirements:[],placeholderIssues:[]};
  let componentChunkCalls=0,componentChunkRetries=0,finalScoreAttempts=0;

  for(let attempt=1;attempt<=2;attempt++){
    const placeholderRecovery=attempt===1?'':`\n\nSTRICT RECOVERY: The previous repair may have copied instruction placeholders instead of choosing labels. The literal text <ASSESSMENT> is INVALID OUTPUT. Replace every component placeholder with exactly one allowed token: MATCH_EVIDENCE, GATE_CONFIRMED, PARTIAL, ABSENT, CONTRADICTS, or NOT_OBSERVABLE.`;
    const prompt=promptDiagnosticConsistencyRepairPrompt({concept,sources,reactions,description,issues:lastIssues})+placeholderRecovery;
    let data=null;
    let placeholderIssues=[];
    let providerFallback=false;
    try{
      const raw=await runPromptDiagnosticStructured(env,model,image,prompt,null,Math.max(1800,Math.min(4800,1200+concept.definitionParts.length*110)),'text',{temperature:attempt===1?0.02:0.01,preserveWhitespace:true,providerCallTimeoutMs:PROMPT_DIAGNOSTIC_PROVIDER_CALL_TIMEOUT_MS},{recoveryLog,callContext,stage:'consistency-repair',conceptCode:concept.code,maxProviderAttempts:2});
      lastRaw=String(raw||'');
      const parsed=parsePromptDiagnosticPartial(lastRaw,[concept]);
      data=parsed.state.get(concept.code);
      placeholderIssues=promptDiagnosticLiteralPlaceholderIssues(lastRaw);
    }catch(error){
      if(!promptDiagnosticTransientProviderError(error))throw error;
      providerFallback=true;
      data=promptDiagnosticEmptyState([concept]).get(concept.code);
      promptDiagnosticRecoveryEvent(recoveryLog,{type:'provider-fallback',from:'consistency-repair',to:'component-chunks',failureKind:promptDiagnosticProviderFailureKind(error),stage:'consistency-repair',conceptCode:concept.code,batchIndex:callContext?.batchIndex??null,callMode:callContext?.callMode??null,waveIndex:callContext?.waveIndex??null});
    }

    let missing=promptDiagnosticMissingForConcept(concept,data);
    if(missing.length||placeholderIssues.length||providerFallback){
      try{
        const missingParts=[];
        for(let partNumber=1;partNumber<=concept.definitionParts.length;partNumber++)if(!data.parts.has(partNumber))missingParts.push(partNumber);
        if(missingParts.length){
          const chunked=await runPromptDiagnosticComponentChunks(env,{model,image,concept,sources,reactions,description,data,recoveryLog,callContext});
          componentChunkCalls+=chunked.chunkCalls;componentChunkRetries+=chunked.retries;
        }
        if(missingParts.length||data.score==null||!data.why||placeholderIssues.length||providerFallback){
          const scored=await runPromptDiagnosticFinalScore(env,{model,image,concept,sources,reactions,description,data,recoveryLog,callContext});
          finalScoreAttempts+=scored.attempts;lastRaw=scored.raw||lastRaw;
        }
      }catch(error){
        lastSnapshot=promptDiagnosticValidationSnapshot(concept,data,null,lastRaw);
        lastIssues=[...new Set([...placeholderIssues,...lastSnapshot.missingRequirements.map(item=>`missing ${item}`)])];
        if(attempt<2)continue;
        throw diagnosticError(
          `Prompt Diagnostics ${concept.code} quality repair remained structurally incomplete`,
          {
            phase:'prompt-diagnostics-consistency-repair',conceptCode:concept.code,validationIssues:lastIssues,
            parsedScore:lastSnapshot.parsedScore,parsedAssessments:lastSnapshot.parsedAssessments,whyPolarity:lastSnapshot.whyPolarity,
            missingRequirements:lastSnapshot.missingRequirements,placeholderIssues:lastSnapshot.placeholderIssues,
            batchIndex:callContext?.batchIndex??null,callMode:callContext?.callMode??null,waveIndex:callContext?.waveIndex??null,
            responsePreview:lastRaw.slice(0,1200),nestedDiagnostic:error?.providerDiagnostic||null
          }
        );
      }
    }

    missing=promptDiagnosticMissingForConcept(concept,data);
    if(missing.length){
      lastSnapshot=promptDiagnosticValidationSnapshot(concept,data,null,lastRaw);
      lastIssues=[...new Set([...placeholderIssues,...missing.map(item=>`missing ${item}`)])];
      continue;
    }

    const result=finalizePromptDiagnosticConcept(concept,data);
    const remaining=promptDiagnosticConsistencyIssues(concept,result,callConcepts);
    lastSnapshot=promptDiagnosticValidationSnapshot(concept,data,result,lastRaw);
    if(!remaining.length)return{result,attempts:attempt,raw:lastRaw,componentChunkCalls,componentChunkRetries,finalScoreAttempts};
    lastIssues=remaining;
  }

  throw diagnosticError(
    `Prompt Diagnostics ${concept.code} remained inconsistent after quality repair`,
    {
      phase:'prompt-diagnostics-consistency-repair',conceptCode:concept.code,validationIssues:lastIssues,
      parsedScore:lastSnapshot.parsedScore,parsedAssessments:lastSnapshot.parsedAssessments,whyPolarity:lastSnapshot.whyPolarity,
      missingRequirements:lastSnapshot.missingRequirements,placeholderIssues:lastSnapshot.placeholderIssues,
      batchIndex:callContext?.batchIndex??null,callMode:callContext?.callMode??null,waveIndex:callContext?.waveIndex??null,
      responsePreview:lastRaw.slice(0,1200)
    }
  );
}

async function runPromptDiagnosticBatch(env,body){
  const callSpec=promptDiagnosticCallSpec(body);
  const {batchIndex,callMode,waveIndex,waveNumber,waveCount,conceptOffset,concepts}=callSpec;
  const callContext={batchIndex,batchNumber:batchIndex+1,callMode,waveIndex,waveNumber,conceptCodes:concepts.map(c=>c.code)};
  const recoveryLog=[];
  const sources=normalizePromptDiagnosticSources(body?.sources);
  const reactions=normalizePromptDiagnosticReactionScores(body?.reactions);
  const description=sources.description?String(body?.description||'').trim().slice(0,12000):'';
  if(sources.description&&!description)throw new Error('Prompt Diagnostics selected Description but no AI Description was supplied');
  if(sources.reactions&&(!body?.reactions||typeof body.reactions!=='object'))throw new Error('Prompt Diagnostics selected Reactions but no Reaction scores were supplied');
  const image=sources.image?(body.imageDataUrl?dataUrlBytes(body.imageDataUrl):await fetchBytes(body.imageUrl)):null;
  const model=env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL;
  const prompt=promptDiagnosticPrompt({callSpec,sources,reactions,description});
  const outputTokens=callMode==='three'?3000:callMode==='five'?3600:7200;
  let lastRaw='',initialPartial=null;

  for(let attempt=1;attempt<=2;attempt++){
    const recovery=attempt===1?'':`\n\nRECOVERY: Your previous response did not reliably use the explicit component IDs. Do not write Definition/Evidence/Score paragraphs. Complete the required CODE SCORE, CODE.NN assessment, and CODE WHY records.`;
    try{
      const raw=await runPromptDiagnosticStructured(env,model,image,prompt+recovery,null,outputTokens,'text',{temperature:attempt===1?0.10:0.02,preserveWhitespace:true,providerCallTimeoutMs:PROMPT_DIAGNOSTIC_PROVIDER_CALL_TIMEOUT_MS},{recoveryLog,callContext,stage:'multi-concept-wave',componentIds:null,maxProviderAttempts:2});
      lastRaw=String(raw||'');
      initialPartial=parsePromptDiagnosticPartial(lastRaw,concepts);
      const complete=concepts.filter(c=>promptDiagnosticMissingForConcept(c,initialPartial.state.get(c.code)).length===0);
      if(complete.length===concepts.length)break;
      if(complete.length===0||attempt===2)break;
    }catch(error){
      if(!promptDiagnosticTransientProviderError(error))throw error;
      // A random provider outage must not kill a full-vocabulary diagnostic run. Preserve any
      // usable records from an earlier semantic attempt and let the normal
      // focused repair loop complete only the missing concepts.
      promptDiagnosticRecoveryEvent(recoveryLog,{type:'provider-fallback',from:'multi-concept-wave',to:'focused-concepts',failureKind:promptDiagnosticProviderFailureKind(error),stage:'multi-concept-wave',batchIndex,callMode,waveIndex,waveNumber,conceptCodes:concepts.map(c=>c.code)});
      if(!initialPartial)initialPartial={state:promptDiagnosticEmptyState(concepts),responsePreview:''};
      break;
    }
  }

  if(!initialPartial)initialPartial=parsePromptDiagnosticPartial(lastRaw,concepts);
  const resultsByCode=new Map();
  const focusedRepairs=[];
  for(const concept of concepts){
    const data=initialPartial.state.get(concept.code);
    const missing=promptDiagnosticMissingForConcept(concept,data);
    let result;
    let repairMeta=null;
    if(!missing.length){
      result=finalizePromptDiagnosticConcept(concept,data);
    }else{
      const repaired=await runPromptDiagnosticConceptRepair(env,{model,image,concept,sources,reactions,description,missing,seedData:data,recoveryLog,callContext});
      result=repaired.result;
      repairMeta={code:concept.code,attempts:repaired.attempts,strategy:repaired.strategy,componentChunkCalls:repaired.componentChunkCalls,componentChunkRetries:repaired.componentChunkRetries,finalScoreAttempts:repaired.finalScoreAttempts,initialMissing:missing,qualityRepairAttempts:0,validationIssues:[]};
    }

    const validationIssues=promptDiagnosticConsistencyIssues(concept,result,concepts);
    if(validationIssues.length){
      const quality=await runPromptDiagnosticQualityRepair(env,{model,image,concept,sources,reactions,description,issues:validationIssues,callConcepts:concepts,recoveryLog,callContext});
      result=quality.result;
      if(!repairMeta)repairMeta={code:concept.code,attempts:0,strategy:'consistency/evidence-repair',componentChunkCalls:quality.componentChunkCalls||0,componentChunkRetries:quality.componentChunkRetries||0,finalScoreAttempts:quality.finalScoreAttempts||0,initialMissing:[],qualityRepairAttempts:quality.attempts,validationIssues};
      else{repairMeta.strategy=`${repairMeta.strategy}+consistency/evidence-repair`;repairMeta.qualityRepairAttempts=quality.attempts;repairMeta.validationIssues=validationIssues;repairMeta.componentChunkCalls+=(quality.componentChunkCalls||0);repairMeta.componentChunkRetries+=(quality.componentChunkRetries||0);repairMeta.finalScoreAttempts+=(quality.finalScoreAttempts||0);}
    }
    resultsByCode.set(concept.code,result);
    if(repairMeta)focusedRepairs.push(repairMeta);
  }

  return{
    schemaVersion:4,
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
    model:effectiveProviderModel(env,model),
    providerRouting:providerRoutingSnapshot(env,model),
    evaluatedAt:new Date().toISOString(),
    responseProtocol:'numbered-flex-v4',
    focusedRepairCount:focusedRepairs.length,
    focusedRepairs,
    providerRecoveryCount:recoveryLog.length,
    providerRecoveries:recoveryLog,
    results:concepts.map(c=>resultsByCode.get(c.code))
  };
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
    : `{"themes":[{"source":"matrix","value":"PFM0205","confidence":92,"rationale":"image-grounded reason"},{"source":"matrix","value":"PFM0104","confidence":81,"rationale":"image-grounded reason"},{"source":"matrix","value":"PFM0206","confidence":70,"rationale":"image-grounded reason"}]}`;
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


// v0.9.6.112 — Fresh Theme provider-cycle router: Primary -> Secondary -> Mistral once per cycle; no consecutive same-provider retries; cycle telemetry in reports.
// v0.9.6.114 — Reaction Analysis joins the same provider-cycle policy; all-zero/malformed whole assessments advance providers instead of immediately repeating one provider.
// v0.9.6.115 — Adds URL/image-input, family, stage, and provider-attempt timing telemetry; Reactions and Themes execute concurrently when both are requested and independent; existing mismatch recovery behavior is preserved and now reports rollback target/reason.
// v0.9.6.126 — Replace manual Promise-resolver release callback with direct per-provider promise chaining. Same serialization behavior, but removes Cloudflare editor ts(2322)/ts(2722) inference hazards entirely.
// v0.9.6.127 — Retire the AI Reaction scan. Reactions are 100% derived from the three selected Themes as six equal 1/6 Prim slots; duplicates accumulate.
// v0.9.6.125 — Initialize the provider-lane release callback before Promise assignment so Cloudflare editor type-checking cannot treat it as possibly undefined. Runtime behavior is unchanged.
// v0.9.6.124 — Theme decision audit now uses one KEEP/REJECT request per Theme. Independent reviewers retry only the technically failed Theme; Theme order is never used. Provider-lane serialization prevents duplicate same-provider audit calls from colliding within one image, and one-word audit calls have a 30s ceiling.
// v0.9.6.123 — Theme decision audit is now a binary KEEP/REJECT gate over an unordered equal three-Theme set; Theme identity is matched by PFM code/name only, never by 1/2/3 position.
// v0.9.6.122 — Fast Theme decision audit now uses a compact three-record contract plus tolerant parsing for harmless provider formatting differences; rejected raw audit output is retained in diagnostics.
// v0.9.6.121 — Qwen 3.7 Plus runs with enable_thinking:false to avoid deep-reasoning latency on Genreactrix Theme stages; provider progress/readiness telemetry labels Qwen as non-thinking.
// v0.9.6.120 — Split decision-critical Theme audit from the heavy reporting diagnostic.
// v0.9.6.119 — Live progress stream compatibility repair: use TransformStream instead of ReadableStream constructor; no Cloudflare compatibility-flag change required.
// v0.9.6.101 — Preserve successful Mistral Description; reuse it for downstream Theme/Reaction recovery via primary then fallback; visible Mistral readiness probe.
// v0.9.6.100 — Description-only Mistral third fallback after both existing routes fail/refuse; Theme pipeline unchanged.
// v0.9.6.99 — Type-check-safe Theme mismatch recovery signature; behavior unchanged from 0.9.6.98; Matrix remains 0.0.0.0.
// v0.9.6.88 — EXPERIMENT: Theme Sweep order control: canonical pack Pass 1; one fixed seeded shuffle per recovery Pass 2/3; human-vote scoring and then-current definitions unchanged.
// v0.9.6.87 — EXPERIMENT: ordinary unconstrained Theme Rerun uses the .86 shuffled raw human-vote selector so the exact flagged sample can be rerolled; constrained reruns retain .84 logic.
// v0.9.6.86 — EXPERIMENT: same raw human-vote selection as .85, with only the then-current definition presentation order fixed-shuffled; .84 remains frozen control and powers Theme Rerun.
// v0.9.6.85 — EXPERIMENT: fresh normal Themes use raw human-vote expected-score prediction; v0.9.6.84 remains the frozen control and powers Theme Rerun.
// v0.9.6.84 — Exhaustive fresh-candidate Theme recovery; full-vocabulary exhaustion becomes puce SLOP? Warning instead of fabricated third Theme or terminal audit failure.
// v0.9.6.83 — Behavior-neutral AMA metadata iteration cleanup to eliminate Cloudflare editor TS2345 type-check warning.
// v0.9.6.82 — AMA-derived Theme contextual gating + confidence calibration; AMA Prim/ownership/integrity repair; Theme Rerun evidence-source repair; provider readiness probe.
// v0.9.6.79 — Theme adversarial decision pipeline: literal evidence -> broad candidates -> adversarial audit -> final rank.
// v0.9.6.78 — Theme human-fit calibration: no emotional-salience ranking bonus; neutral closer fits win; generic descriptive praise excluded from rerun evidence.
// v0.9.6.71 — AMA-specific 90s provider timeout + one transient retry.
// v0.9.6.70 — advisory SLOP assessment + immutable AI AMA interview service.
function cleanSingleLine(value,max=800){return String(value||'').replace(/\s+/g,' ').trim().slice(0,max)}
function parseSlopAssessment(raw,{basis='analysis'}={}){
  const text=String(raw||'').replace(/\r/g,'').trim();
  const detected=/\bSLOP\s*:\s*(?:YES|TRUE)\b/i.test(text);
  const no=/\bSLOP\s*:\s*(?:NO|FALSE)\b/i.test(text);
  const confMatch=text.match(/\bCONFIDENCE\s*:\s*(\d{1,3})\b/i);
  const reasonMatch=text.match(/\bREASON\s*:\s*([\s\S]*)$/i);
  if(!detected&&!no)throw new Error('SLOP advisory response did not contain YES or NO');
  const confidence=Math.max(0,Math.min(100,Number(confMatch?.[1]||0)));
  return{schemaVersion:1,assessmentId:`slop_${Date.now().toString(36)}_${crypto.randomUUID().slice(0,8)}`,assessedAt:new Date().toISOString(),detected,confidence,reason:cleanSingleLine(reasonMatch?.[1]||'',900),basis};
}
async function runSlopAssessment(env,model,image,resolvedThemes=[],description='',basis='analysis'){
  if(!image)return{schemaVersion:1,assessmentId:`slop_unavailable_${Date.now().toString(36)}`,assessedAt:new Date().toISOString(),detected:false,confidence:0,reason:'SLOP advisory unavailable because the image was unavailable.',basis,status:'unavailable'};
  const themes=(resolvedThemes||[]).slice(0,3).map((row,index)=>`${index+1}. ${row.name||row.label||row.code||'Unknown'} ${Number(row.confidence)||0}%`).join('\n');
  const prompt=`You are providing a separate curator advisory for Genreactrix AFTER the required Theme task has already been completed. This advisory must never replace, skip, weaken, or excuse the exactly-three Theme requirement.\n\nQuestion: Would a human curator plausibly flag this image as SLOP because it offers unusually little meaningful reaction/Theme territory for the game — for example it is generic, repetitive, low-information, redundant, accidental, or visually uninteresting, and the best Theme choices tend to collapse toward broad/easy territory such as Mundane or Chaotic?\n\nDo NOT mark an image SLOP merely because it is simple, minimalist, quiet, abstract, or difficult. If it has a distinctive mood, aesthetic, subject, joke, tension, beauty, strangeness, emotional pull, or other meaningful human reaction potential, it can be worth keeping.\n\nCURRENT THEMES (already selected; do not change them):\n${themes||'Unavailable'}\n\nCURRENT AI DESCRIPTION (if available):\n${cleanSingleLine(description,3500)||'Unavailable'}\n\nReturn exactly three lines:\nSLOP: YES or NO\nCONFIDENCE: one integer 0-100\nREASON: one concise sentence explaining the curator-value judgment.`;
  try{
    const raw=await runStructured(env,model,image,prompt,null,500,'text',{temperature:0.1,slopAdvisory:true});
    return parseSlopAssessment(raw,{basis});
  }catch(error){
    return{schemaVersion:1,assessmentId:`slop_error_${Date.now().toString(36)}`,assessedAt:new Date().toISOString(),detected:false,confidence:0,reason:`SLOP advisory could not be completed: ${cleanSingleLine(error?.message||error,500)}`,basis,status:'unavailable'};
  }
}
function amaThemeMeta(ref={},source='candidate'){
  const rawCode=String(ref.code||ref.id||'').toUpperCase();
  const label=String(ref.label||ref.name||'').trim().toLowerCase();
  const declaredKind=String(ref.kind||'').toLowerCase();
  const fusionByCode=rawCode?PRIMFUSION_REGISTRY.aiThemeChoices.find(row=>row.code===rawCode):null;
  const fusionByName=!fusionByCode&&label?PRIMFUSION_REGISTRY.aiThemeChoices.find(row=>String(row.name||'').trim().toLowerCase()===label):null;
  const primByCode=rawCode?PRIMFUSION_REGISTRY.primitives.find(row=>row.id===rawCode):null;
  const primByName=!primByCode&&label?PRIMFUSION_REGISTRY.primitives.find(row=>String(row.name||'').trim().toLowerCase()===label):null;
  let row=null,kind='unknown';
  if(declaredKind==='primitive'||declaredKind==='prim'||primByCode){row=primByCode||primByName;kind='primitive'}
  else if(fusionByCode){row=fusionByCode;kind='primFusion'}
  else if(source==='director'&&primByName&&!fusionByName){row=primByName;kind='primitive'}
  else if(fusionByName){row=fusionByName;kind='primFusion'}
  else if(primByName){row=primByName;kind='primitive'}
  if(row&&kind==='primitive')return{code:row.id,name:row.name,aiMeaning:row.aiMeaning||'',kind:'primitive',source};
  if(row)return{code:row.code,name:row.name,aiMeaning:row.aiMeaning||'',kind:'primFusion',source};
  return{code:rawCode||null,name:String(ref.label||ref.name||ref.code||'Unknown'),aiMeaning:String(ref.aiMeaning||''),kind:declaredKind||'unknown',source};
}
function amaThemeLine(ref={},source='candidate'){
  const meta=amaThemeMeta(ref,source),confidence=Number.isFinite(Number(ref.confidence??ref.weight))?Number(ref.confidence??ref.weight):null;
  const sourceLabel=source==='ai'?'AI':source==='director'?'DIRECTOR':'CANDIDATE',kindLabel=meta.kind==='primitive'?'PRIM':meta.kind==='primFusion'?'PRIMFUSION':'UNKNOWN';
  return`[SOURCE=${sourceLabel}] [KIND=${kindLabel}] ${meta.code||'NO-CODE'} — ${meta.name}${confidence==null?'':` — ${confidence}%`} — ${meta.aiMeaning||'No stored definition available.'}`;
}
async function runAmaStructured(env,model,image,prompt,schema,maxTokens,responseMode='text',options={}){
  let lastError=null;
  for(let attempt=1;attempt<=2;attempt++){
    try{
      return await runStructured(env,model,image,prompt,schema,maxTokens,responseMode,{...options,providerCallTimeoutMs:AMA_PROVIDER_CALL_TIMEOUT_MS});
    }catch(error){
      lastError=error;
      if(attempt>=2||!promptDiagnosticTransientProviderError(error))throw error;
      await new Promise(resolve=>setTimeout(resolve,900));
    }
  }
  throw lastError||new Error('AMA provider call failed');
}
function amaSnapshotThemes(snapshot,key){return(Array.isArray(snapshot?.[key])?snapshot[key]:[]).filter(Boolean)}
function amaUniqueThemeMetas(snapshot,candidateCodes=[]){
  const rows=[],seen=new Set();
  const pushUnique=meta=>{const key=`${meta.kind}:${String(meta.code||meta.name).toLowerCase()}`;if(seen.has(key))return;seen.add(key);rows.push(meta)};
  for(const ref of amaSnapshotThemes(snapshot,'aiThemes'))pushUnique(amaThemeMeta(ref,'ai'));
  for(const ref of amaSnapshotThemes(snapshot,'directorThemes'))pushUnique(amaThemeMeta(ref,'director'));
  for(const code of candidateCodes||[])pushUnique(amaThemeMeta({code},'candidate'));
  return rows;
}
function amaVisualPrompt(snapshot){return`Describe this image as a perceptive human would describe it to another person so it can support a later Theme-comparison interview. Include subject, composition, color, lighting, texture, style, setting, visible action, and any reasonably supported atmosphere, energy, aesthetic, or emotional impression. A little theatricality is welcome when the visible image earns it. Do not invent narrative, intent, symbolism, personality, unseen events, or Theme-specific justifications.\n\nExisting AI Description for context only (correct it if the image disagrees):\n${cleanSingleLine(snapshot?.aiDescription||'',5000)||'None stored.'}\n\nReturn one concise but substantial paragraph.`}
function amaAllThemeCatalog(){return PRIMFUSION_REGISTRY.aiThemeChoices.map(row=>`${row.code} — ${row.name} — ${String(row.aiMeaning||'').replace(/\s+/g,' ')}`).join('\n')}
async function amaCandidateAudit(env,model,visualRead,snapshot){
  const selected=[...amaSnapshotThemes(snapshot,'aiThemes'),...amaSnapshotThemes(snapshot,'directorThemes')].map(row=>String(row.code||row.id||'').toUpperCase()).filter(Boolean);
  const prompt=`You are preparing an AI-vs-Director diagnostic interview. Using the visual read below, identify up to 12 PrimFusion Themes from the current 78 that are materially plausible competitors or alternatives. This is NOT the final Theme selection and must not change historical results. Include any selected AI/Director codes when they are valid, but do not invent support just to keep them. Return only PFM codes separated by spaces.\n\nVISUAL READ:\n${visualRead}\n\nCURRENT AI/DIRECTOR CODES:\n${selected.join(' ')||'None'}\n\nCURRENT 78 THEMES:\n${amaAllThemeCatalog()}`;
  let raw='';try{raw=await runAmaStructured(env,model,null,prompt,null,900,'text',{temperature:0.05,amaCandidateAudit:true})}catch{}
  const codes=[...new Set([...(String(raw).match(/PFM\d{4}/gi)||[]).map(x=>x.toUpperCase()),...selected])].filter(code=>PRIMFUSION_REGISTRY.aiThemeChoices.some(row=>row.code===code));
  return codes.slice(0,14);
}
function amaRepresentative(snapshot){const ai=amaSnapshotThemes(snapshot,'aiThemes'),director=amaSnapshotThemes(snapshot,'directorThemes');const dLabels=director.map(x=>x.label||x.name||x.code).filter(Boolean),aLabels=ai.map(x=>x.label||x.name||x.code).filter(Boolean);const dSet=new Set(dLabels.map(x=>String(x).toLowerCase())),aSet=new Set(aLabels.map(x=>String(x).toLowerCase()));const aiOnly=aLabels.filter(x=>!dSet.has(String(x).toLowerCase())),directorOnly=dLabels.filter(x=>!aSet.has(String(x).toLowerCase())),all=[...new Set([...aLabels,...dLabels])];return{aiLabels:aLabels,directorLabels:dLabels,aiOnly,directorOnly,all,aiOne:aiOnly[0]||aLabels[0]||'the AI Theme',directorOne:directorOnly[0]||dLabels[0]||'the Director Theme',themeOne:all[0]||'the Theme',themeTwo:all[1]||all[0]||'the competing Theme'}}
function amaQuestions(snapshot){
  const r=amaRepresentative(snapshot),directorCount=r.directorLabels.length,dirN=directorCount===1?'the Director’s current Theme':`the Director’s ${directorCount} current Themes`,combined=`AI: ${r.aiLabels.join(', ')||'—'}; Director: ${r.directorLabels.join(', ')||'—'}`;
  return[
['Q1',`Summarize the AI Theme triplet and ${dirN} for this image. Where do they agree, and where do they disagree? (${combined})`],
['Q2','Which Theme is the strongest point of agreement between AI and Director? If there is no overlap, say so explicitly.'],
['Q3','Which choice from either side is strongest overall for this image?'],
['Q4','If only one Theme could survive from the combined AI and Director choices, which should it be, and why?'],
['Q5','If only three Themes could survive from the combined AI + Director set, which three should they be? Exactly three; do not inflate confidence merely because a Theme survives the ranking.'],
['Q6','Rank all unique Themes from both AI and Director from strongest to weakest for this image. Preserve weak results as weak; rank and confidence are different.'],
['Q7',`Why did AI choose each AI-only Theme (${r.aiOnly.join(', ')||'none'}) instead of each competing Director-only Theme (${r.directorOnly.join(', ')||'none'})? Explain ranking differences; do not merely restate definitions.`],
['Q8',`Why did AI choose ${r.aiOne} instead of ${r.directorOne}?`],
['Q9',`Why did AI rank ${r.aiOne} above ${r.directorOne}?`],
['Q10','Which of AI’s three choices is weakest, and why?'],
['Q11','Which AI-selected Theme has the weakest evidence or support?'],
['Q12','Is each AI-selected Theme genuinely strong, merely defensible, or weak? Classify all three separately.'],
['Q13','Are any AI selections merely defensible rather than genuinely strong?'],
['Q14','Did AI appear to latch onto a misleading cue? If so, identify the cue and the Theme it distorted.'],
['Q15',`What cue may have caused AI to over-select ${r.aiOne}?`],
['Q16','Are any AI selections being justified after the fact rather than emerging naturally from the image? Look for answer-first rationalization.'],
['Q17',`Why might each Director-only Theme (${r.directorOnly.join(', ')||'none'}) fit better than the competing AI choice? Treat Director choices as hypotheses, not automatically correct.`],
['Q18',`Why might the Director choose ${r.directorOne} over ${r.aiOne}?`],
['Q19',`Which of ${dirN} is strongest?`],
['Q20',`Which of ${dirN} is weakest? If there is only one, assess whether that one is strong or weak.`],
['Q21','Did AI overlook any Director Theme?'],
['Q22',`Did AI overlook ${r.directorOne}? If so, what likely caused the miss?`],
['Q23',`What cue may have caused AI to miss ${r.directorOne}?`],
['Q24','Did Director potentially overrate any Theme? If so, which one and why? Be willing to disagree with Director when warranted.'],
['Q25','Which Director Theme has the strongest visible support?'],
['Q26',`Which better fits the image: ${r.themeOne} or ${r.themeTwo}? Also address the most important disputed pairs.`],
['Q27','Which Theme is stronger in each AI-versus-Director disagreement? Give a winner for each disputed pair even when both are weak.'],
['Q28',`What visible or image evidence supports each materially relevant Theme in this combined set: ${r.all.join(', ')}?`],
['Q29',`What visible or image evidence argues against each materially relevant Theme in this combined set: ${r.all.join(', ')}?`],
['Q30',`What evidence supports the Director choice(s): ${r.directorLabels.join(', ')||'none'}?`],
['Q31','Which selected Theme has the weakest evidence?'],
['Q32','Is any unselected or Director-selected Theme materially closer to the image than an AI-selected Theme? A merely defensible Theme must not outrank a materially closer one.'],
['Q33','Which unselected Theme is materially closer than one of the selected Themes, if any?'],
['Q34',`What would need to be different in the image for a disputed Theme such as ${r.themeOne} to become a genuinely strong match? Use a counterfactual image change, not a definition rewrite.`],
['Q35',`What would have made AI choose ${r.directorOne}?`],
['Q36','Are AI’s confidence scores appropriate for the actual strength of its selections? Confidence measures fit, not rank.'],
['Q37','Which AI confidence score is most overconfident?'],
['Q38','Which AI confidence score is most underconfident, if any?'],
['Q39','Did AI confuse “best available” with “strong match”? A Theme can be third-best and still deserve low confidence.'],
['Q40','Did AI choose a broad, easy, or low-effort Theme when a materially closer or more specific Theme existed?'],
['Q41','Before finalizing its original answer, should AI have replaced any selected Theme with an unselected Theme that was materially closer? Which one?'],
['Q42','For each disagreement, does the problem look most like image understanding, Theme definition, ranking, or confidence calibration? Assign one or more categories to every major disagreement.'],
['Q43','Which disagreement is probably caused by the Theme definition rather than the image?'],
['Q44','Which disagreement most likely comes from image interpretation?'],
['Q45','Did AI misunderstand the image? If yes, what did it misunderstand?'],
['Q46','Did AI misunderstand a Theme definition? If yes, which Theme and what meaning was misread?'],
['Q47','Did AI see the relevant Theme but rank another Theme higher?'],
['Q48','Did AI behave as though a Director Theme required something that was actually not required?'],
['Q49','Was a useful cue or association missing from the Theme wording, or was this simply a bad semantic judgment?'],
['Q50','Was this a ranking failure, confidence failure, image-understanding failure, definition failure, model limitation, or simply a one-off bad judgment? Do not force a systemic explanation.'],
['Q51','Does this image appear to have unusually little meaningful Theme or reaction territory? SLOP? is advisory only and never excuses the exactly-three Theme task.'],
['Q52','Would a human curator reasonably keep this image in a game intended to provoke meaningful reactions and Theme choices, or is it too generic, low-information, redundant, accidental, or visually uninteresting? Do not equate simple/minimalist with SLOP automatically.'],
['Q53','Are weak or strange Theme answers more likely to reflect a Theme-discovery failure, or an image that simply offers little useful reaction content?'],
['Q54','If SLOP? is suggested, what is the concise reason? Director makes the final Yellow / Red / Hot Magenta / NOT SLOP judgment.'],
['Q55','What would you suggest changing so that you would be more likely to select the better Theme in a similar image in the future? Possible answers include Theme wording, image interpretation, ranking instruction, confidence calibration, missing association/cue, model capability, or no systemic change because this was simply a bad judgment.'],
['Q56','Would your suggested change improve similar images generally, or is it too specific to this image?'],
['Q57','Could your proposed fix cause a different Theme to become over-selected or under-selected? Which Theme, and how?'],
['Q58','Would the proposed change improve one Theme while damaging another part of the current Theme vocabulary?'],
['Q59','Is the safest improvement better Theme wording, better image interpretation, a ranking instruction, confidence calibration, a missing association/cue, a model change, or no systemic change?'],
['Q60','If you recommend changing a Theme definition, what exact semantic gap caused the miss? Do not recommend definition edits merely to rescue this one image.'],
['Q61','If you recommend a ranking change, what general ranking principle should change?'],
['Q62','If you recommend a confidence change, what calibration behavior should change?'],
['Q63','If you recommend no systemic change, explain why this should be treated as a one-off bad judgment instead of a rule change.'],
['Q64','What is the single most important thing this AI-versus-Director disagreement teaches us about Theme discovery?'],
['Q65','What is the most likely root cause of the disagreement overall?'],
['Q66','What, if anything, should the Director change in Genreactrix based on this case? Recommendations are hypotheses only; AMA cannot modify Themes, code, prompts, or history.'],
['Q67','What should the Director explicitly NOT change based on this case? Protect against overfitting to a single strange image.'],
['Q68','Bottom line: if this exact image were evaluated again under the same current available Themes, what three Themes should a human-like Genreactrix AI most naturally choose, with realistic confidence levels?']
  ].map(([id,question],index)=>({id,question,section:index<6?'Orientation':index<16?'AI Choice Interrogation':index<25?'Director Choice Interrogation':index<35?'Evidence and Theme Fit':index<41?'Confidence and Ranking Calibration':index<50?'Failure Diagnosis':index<54?'SLOP / Image Value':index<63?'Future Improvement Interview':'Overall Diagnosis'}));
}
function cleanAmaBareAnswer(text){
  let value=String(text||'').replace(/\r/g,'').trim();
  value=value.replace(/^```(?:text|markdown|md)?\s*/i,'').replace(/\s*```$/,'').trim();
  return value;
}
function amaQuestionMarkers(text){
  const source=String(text||''),marker=/(?:^|\n)[ \t]*(?:[-*+•]\s*)?(?:\*\*|__)?(?:Q\s*0*(\d{1,4})|Question\s*0*(\d{1,4}))\s*(?:(?::|[-–—.]|\)|\])\s*)?(?:\*\*|__)?[ \t]*/gim,matches=[];let m;
  while((m=marker.exec(source))){
    const number=Number(m[1]||m[2]);
    if(!Number.isInteger(number)||number<1)continue;
    matches.push({id:`Q${number}`,start:m.index,contentStart:marker.lastIndex});
  }
  return matches;
}
function amaInlineQuestionMarkerCount(text){
  return (String(text||'').match(/(?:^|\s)(?:\*\*|__)?(?:Q\s*0*\d{1,4}|Question\s*0*\d{1,4})\s*(?::|[-–—.]|\)|\])/gim)||[]).length;
}
function amaRepeatedAnswerReason(value){
  const compact=String(value||'').replace(/\s+/g,' ').trim();
  const sentences=compact.split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(x=>x.length>=36);
  if(sentences.length<3)return'';
  const counts=new Map();for(const sentence of sentences){const key=sentence.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();counts.set(key,(counts.get(key)||0)+1)}
  if([...counts.values()].some(count=>count>=3))return'answer contains a repeated sentence loop';
  if(sentences.length>=8&&counts.size/sentences.length<0.62)return'answer is dominated by repeated prose';
  return'';
}
function amaOwnershipContradictionReason(value,snapshot){
  if(!snapshot)return'';
  const r=amaRepresentative(snapshot),text=String(value||''),esc=label=>String(label||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  for(const label of r.aiOnly){const L=esc(label);if(new RegExp(`\\bDirector(?:'s)?\\s+(?:choice|theme|selection)(?:\\s+of)?\\s+[\\"“”']?${L}\\b|\\bDirector\\s+(?:selected|chose|picked|overrated|ranked)\\s+[\\"“”']?${L}\\b`,'i').test(text))return`answer assigns AI-only Theme ${label} to Director`;}
  for(const label of r.directorOnly){const L=esc(label);if(new RegExp(`\\bAI(?:'s)?\\s+(?:choice|theme|selection)(?:\\s+of)?\\s+[\\"“”']?${L}\\b|\\bAI\\s+(?:selected|chose|picked)\\s+[\\"“”']?${L}\\b`,'i').test(text))return`answer assigns Director-only Theme ${label} to AI`;}
  return'';
}
function amaValidateAnswerText(text,{allowQuestionIds=false,question=null,snapshot=null}={}){
  const value=cleanAmaBareAnswer(text);
  if(!value)return{valid:false,reason:'empty answer'};
  if(!/[A-Za-z0-9]/.test(value))return{valid:false,reason:'answer contains no substantive text'};
  const compact=value.replace(/\s+/g,' ').trim();
  if(/^(?:nswer|answer|response|n\/?a|unknown|unavailable)$/i.test(compact))return{valid:false,reason:'answer is a placeholder/corrupted fragment'};
  const repeated=amaRepeatedAnswerReason(value);if(repeated)return{valid:false,reason:repeated};
  if(!allowQuestionIds&&amaInlineQuestionMarkerCount(value)>0)return{valid:false,reason:'answer contains another question-ID marker'};
  const questionMarks=(compact.match(/\?/g)||[]).length;
  const lead=compact.replace(/^[\s\"'“”'‘’()[\]{}*_-]+/,'').replace(/^\d+\s*:\s*/,'').trim();
  const interrogative=/^(?:what|which|why|how|when|where|who|whom|whose|is|are|am|was|were|do|does|did|can|could|would|should|will|has|have|had|may|might)\b/i;
  if(questionMarks>=3)return{valid:false,reason:'answer appears to generate questions instead of answering'};
  if(questionMarks>=1&&/[?]\s*$/.test(compact)&&interrogative.test(lead))return{valid:false,reason:'response is a question rather than an answer'};
  if(/^\d+\s*:\s*(?:what|which|why|how|is|are|was|were|do|does|did|can|could|would|should|has|have|had)\b/i.test(compact)&&/[?]\s*$/.test(compact))return{valid:false,reason:'response is a generated question'};
  const qid=String(question?.id||'').toUpperCase();
  if((qid==='Q1'||qid==='Q2')&&amaSnapshotThemes(snapshot,'aiThemes').length&&amaSnapshotThemes(snapshot,'directorThemes').length&&/not visible in (?:the )?snapshot|not (?:shown|provided|available)|cannot determine (?:whether |if )?(?:there is )?(?:any )?overlap/i.test(compact))return{valid:false,reason:'answer falsely claims supplied AI/Director snapshot data is unavailable'};
  const ownership=amaOwnershipContradictionReason(value,snapshot);if(ownership)return{valid:false,reason:ownership};
  return{valid:true,reason:''};
}
function parseAmaAnswersDetailed(raw,questions,snapshot=null){
  const text=cleanAmaBareAnswer(raw),out=new Map(),rejected=[],wanted=new Set(questions.map(q=>String(q.id||'').toUpperCase()));
  if(!text)return{answers:out,rejected,markerIds:[]};

  // All recognized Q-markers are boundaries, including unrequested IDs. This prevents
  // an answer such as Q9 from swallowing a provider continuation beginning with Q10.
  const matches=amaQuestionMarkers(text);
  for(let i=0;i<matches.length;i++){
    const current=matches[i],next=matches[i+1];
    if(!wanted.has(current.id)||out.has(current.id))continue;
    const answer=cleanAmaBareAnswer(text.slice(current.contentStart,next?next.start:text.length)).slice(0,7000);
    const validation=amaValidateAnswerText(answer,{question:questions.find(q=>String(q.id||'').toUpperCase()===current.id)||null,snapshot});
    if(validation.valid)out.set(current.id,answer);
    else rejected.push({id:current.id,reason:validation.reason,preview:answer.replace(/\s+/g,' ').slice(0,500)});
  }

  // For a single-question recovery call, unlabeled prose can be accepted only when
  // it actually looks like an answer. If the provider emitted any Q-marker at all,
  // attribution is no longer unambiguous and the unlabeled fallback is disabled.
  if(questions.length===1&&!out.size&&matches.length===0){
    const id=String(questions[0]?.id||'').toUpperCase(),answer=cleanAmaBareAnswer(text).slice(0,7000),validation=amaValidateAnswerText(answer,{question:questions[0]||null,snapshot});
    if(id&&validation.valid)out.set(id,answer);
    else if(id)rejected.push({id,reason:validation.reason||'unusable single-question response',preview:answer.replace(/\s+/g,' ').slice(0,500)});
  }
  return{answers:out,rejected,markerIds:matches.map(row=>row.id)};
}
function parseAmaAnswers(raw,questions,snapshot=null){return parseAmaAnswersDetailed(raw,questions,snapshot).answers}
function amaContext(snapshot,visualRead,candidateCodes){
  const ai=amaSnapshotThemes(snapshot,'aiThemes').map(ref=>amaThemeLine(ref,'ai')).join('\n')||'None';
  const director=amaSnapshotThemes(snapshot,'directorThemes').map(ref=>amaThemeLine(ref,'director')).join('\n')||'None';
  const themeContext=amaUniqueThemeMetas(snapshot,candidateCodes).map(row=>`[KIND=${row.kind==='primitive'?'PRIM':row.kind==='primFusion'?'PRIMFUSION':'UNKNOWN'}] ${row.code||'NO-CODE'} — ${row.name} — ${String(row.aiMeaning||'').replace(/\s+/g,' ')}`).join('\n');
  return`IMAGE / VISUAL READ:\n${visualRead}\n\nSOURCE OWNERSHIP — AUTHORITATIVE:\nItems under AI THEMES were selected by AI. Items under DIRECTOR THEMES were selected by Director. Never swap, blur, or infer ownership. A Director primitive remains a PRIM and is not a PrimFusion.\n\nAI THEMES (historical current snapshot):\n${ai}\n\nDIRECTOR THEMES (current snapshot; Director may have 1, 2, or 3):\n${director}\n\nCURRENT AI DESCRIPTION:\n${cleanSingleLine(snapshot?.aiDescription||'',5000)||'None'}\n\nCURRENT SLOP ADVISORY:\n${snapshot?.slopAssessment?JSON.stringify(snapshot.slopAssessment):'None'}\n\nRELEVANT CURRENT/CANDIDATE THEME DEFINITIONS:\n${themeContext}\n\nRERUN / CURRENT SNAPSHOT CONTEXT:\n${cleanSingleLine(JSON.stringify(snapshot?.rerunContext||{}),5000)||'None'}`;
}
async function runAmaQuestionBlock(env,model,context,questions,snapshot=null){
  const list=questions.map(q=>`${q.id}: ${q.question}`).join('\n');
  const prompt=`You are conducting a saved Genreactrix AI AMA interview. This is diagnostic only. You are NOT allowed to alter the historical AI Theme choices, Director choices, confidence values, definitions, image status, or code. Be candid when AI was wrong. Do not defend a Theme just because AI selected it. Do not assume Director is automatically right. Distinguish strong fit from merely defensible fit. Prefer ordinary human applicability. Source ownership in the supplied context is authoritative: never attribute an AI-selected Theme to Director or a Director-selected Theme to AI. Treat every supplied Theme/Prim definition and gate as authoritative; ordinary focus, concentration, calmness, formality, professionalism, or deliberate composition is not by itself evidence for a richer Theme meaning. Do not claim supplied snapshot information is missing when it is present. Avoid repetition; answer once, directly, and stop.\n\nAnswer EVERY listed question. Return only lines/paragraphs keyed by question ID in this form:\nQ1: answer\nQ2: answer\n...\nYou may use multiple sentences per answer, but do not omit an ID and do not add unrequested IDs.\n\n${context}\n\nQUESTIONS:\n${list}`;
  const raw=await runAmaStructured(env,model,null,prompt,null,4200,'text',{temperature:0.15,amaInterview:true});
  const answers=parseAmaAnswers(raw,questions,snapshot),missing=questions.filter(q=>!answers.has(q.id));
  if(missing.length)throw new Error(`Legacy AI AMA call returned incomplete answers: missing ${missing.map(q=>q.id).join(', ')}.`);
  return questions.map(q=>({id:q.id,question:q.question,answer:answers.get(q.id),section:q.section}));
}
const AMA_QUESTION_BLOCK_SIZE=3;
function validateAmaSnapshot(snapshot){
  const aiThemes=amaSnapshotThemes(snapshot,'aiThemes'),directorThemes=amaSnapshotThemes(snapshot,'directorThemes');
  if(aiThemes.length!==3)throw new Error('AI AMA requires the current three AI Themes.');
  if(directorThemes.length<1||directorThemes.length>3)throw new Error('AI AMA requires at least one and at most three Director Themes.');
  return snapshot;
}
function amaQuestionPlan(snapshot){
  const questions=amaQuestions(snapshot),blocks=[];
  for(let start=0,index=0;start<questions.length;start+=AMA_QUESTION_BLOCK_SIZE,index++)blocks.push({index,questionIds:questions.slice(start,start+AMA_QUESTION_BLOCK_SIZE).map(q=>q.id)});
  return{questionCount:questions.length,blockSize:AMA_QUESTION_BLOCK_SIZE,blockCount:blocks.length,blocks};
}
async function runAmaVisualStep(env,body){
  if(!env.AI?.run)throw new Error('Workers AI binding AI is not configured');
  const snapshot=validateAmaSnapshot(body?.snapshot&&typeof body.snapshot==='object'?body.snapshot:{}),model=env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL;
  const image=body.imageDataUrl?dataUrlBytes(body.imageDataUrl):(body.imageUrl?await fetchBytes(body.imageUrl):null);
  if(!image&&!String(snapshot.aiDescription||'').trim())throw new Error('AI AMA requires the current image or an AI Description.');
  const visualRead=image?String(await runAmaStructured(env,model,image,amaVisualPrompt(snapshot),null,1000,'text',{temperature:0.12,amaVisualRead:true})).trim():String(snapshot.aiDescription||'').trim();
  if(!visualRead)throw new Error('AI AMA visual read returned no usable description.');
  const plan=amaQuestionPlan(snapshot);
  return{schemaVersion:2,amaVersion:'AMA-2-resumable',stage:'visual',createdAt:new Date().toISOString(),workerVersion:API_VERSION,matrixVersion:matrixVersion(),model:effectiveProviderModel(env,model),providerRouting:providerRoutingSnapshot(env,model),visualRead,...plan};
}
async function runAmaCandidateStep(env,body){
  if(!env.AI?.run)throw new Error('Workers AI binding AI is not configured');
  const snapshot=validateAmaSnapshot(body?.snapshot&&typeof body.snapshot==='object'?body.snapshot:{}),model=env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL,visualRead=String(body?.visualRead||'').trim();
  if(!visualRead)throw new Error('AI AMA candidate audit requires the saved visual read.');
  const candidateThemeCodes=await amaCandidateAudit(env,model,visualRead,snapshot),plan=amaQuestionPlan(snapshot);
  return{schemaVersion:2,amaVersion:'AMA-2-resumable',stage:'candidates',createdAt:new Date().toISOString(),workerVersion:API_VERSION,matrixVersion:matrixVersion(),model:effectiveProviderModel(env,model),providerRouting:providerRoutingSnapshot(env,model),candidateThemeCodes,themeDefinitions:amaUniqueThemeMetas(snapshot,candidateThemeCodes),...plan};
}
function amaSlotMarkers(text){
  const source=String(text||''),marker=/(?:^|\n)[ \t]*(?:[-*+•]\s*)?(?:\*\*|__)?(?:ANSWER\s+)?([ABC])\s*(?:(?::|[-–—.]|\)|\])\s*)?(?:\*\*|__)?[ \t]*/gim,matches=[];let m;
  while((m=marker.exec(source)))matches.push({slot:String(m[1]||'').toUpperCase(),start:m.index,contentStart:marker.lastIndex});
  return matches;
}
function amaCleanDirectAnswer(text){
  return cleanAmaBareAnswer(text).replace(/^(?:DIRECT\s+ANSWER|ANSWER|RESPONSE)\s*(?::|[-–—.]|\)|\])\s*/i,'').trim();
}
function parseAmaSlotAnswersDetailed(raw,questions,snapshot=null){
  const text=cleanAmaBareAnswer(raw),out=new Map(),rejected=[],slots=['A','B','C'],slotToQuestion=new Map();
  questions.forEach((q,index)=>{if(slots[index])slotToQuestion.set(slots[index],q)});
  if(!text)return{answers:out,rejected,slotMarkers:[],questionMarkers:[]};
  const questionMarkers=amaQuestionMarkers(text);
  if(questions.length===1){
    const q=questions[0],answer=amaCleanDirectAnswer(text).slice(0,7000),validation=amaValidateAnswerText(answer,{question:q,snapshot});
    if(validation.valid)out.set(q.id,answer);
    else rejected.push({id:q.id,reason:validation.reason||'unusable direct answer',preview:answer.replace(/\s+/g,' ').slice(0,500)});
    return{answers:out,rejected,slotMarkers:[],questionMarkers:questionMarkers.map(row=>row.id)};
  }
  const matches=amaSlotMarkers(text);
  for(let i=0;i<matches.length;i++){
    const current=matches[i],next=matches[i+1],q=slotToQuestion.get(current.slot);
    if(!q||out.has(q.id))continue;
    const answer=amaCleanDirectAnswer(text.slice(current.contentStart,next?next.start:text.length)).slice(0,7000),validation=amaValidateAnswerText(answer,{question:q,snapshot});
    if(validation.valid)out.set(q.id,answer);
    else rejected.push({id:q.id,slot:current.slot,reason:validation.reason,preview:answer.replace(/\s+/g,' ').slice(0,500)});
  }
  for(const [slot,q] of slotToQuestion){if(!out.has(q.id)&&!rejected.some(row=>row.id===q.id))rejected.push({id:q.id,slot,reason:matches.length?'no validated answer for requested slot':'provider did not return ANSWER A/B/C slots',preview:text.replace(/\s+/g,' ').slice(0,500)})}
  return{answers:out,rejected,slotMarkers:matches.map(row=>row.slot),questionMarkers:questionMarkers.map(row=>row.id)};
}
async function runAmaQuestionChunk(env,model,context,questions,snapshot=null){
  const single=questions.length===1;
  let prompt;
  if(single){
    prompt=`You are conducting a saved Genreactrix AI AMA interview. This is diagnostic only. You are NOT allowed to alter the historical AI Theme choices, Director choices, confidence values, definitions, image status, or code. Be candid when AI was wrong. Do not defend a Theme just because AI selected it. Do not assume Director is automatically right. Distinguish strong fit from merely defensible fit. Prefer ordinary human applicability. Source ownership in the supplied context is authoritative: never attribute an AI-selected Theme to Director or a Director-selected Theme to AI. Treat every supplied Theme/Prim definition and gate as authoritative; ordinary focus, concentration, calmness, formality, professionalism, or deliberate composition is not by itself evidence for a richer Theme meaning. Do not claim supplied snapshot information is missing when it is present. Avoid repetition; answer once, directly, and stop.\n\nAnswer ONE direct question. Do not write or propose any question, questionnaire, question number, heading, label, or follow-up. Do not repeat the question. Return only the prose answer.\n\n${context}\n\nDIRECT QUESTION:\n${questions[0].question}\n\nDIRECT ANSWER:`;
  }else{
    const slots=['A','B','C'],list=questions.map((q,index)=>`ITEM ${slots[index]}: ${q.question}`).join('\n');
    const answerShape=questions.map((q,index)=>`ANSWER ${slots[index]}: <answer to ITEM ${slots[index]}>`).join('\n');
    prompt=`You are conducting a saved Genreactrix AI AMA interview. This is diagnostic only. You are NOT allowed to alter the historical AI Theme choices, Director choices, confidence values, definitions, image status, or code. Be candid when AI was wrong. Do not defend a Theme just because AI selected it. Do not assume Director is automatically right. Distinguish strong fit from merely defensible fit. Prefer ordinary human applicability. Source ownership in the supplied context is authoritative: never attribute an AI-selected Theme to Director or a Director-selected Theme to AI. Treat every supplied Theme/Prim definition and gate as authoritative; ordinary focus, concentration, calmness, formality, professionalism, or deliberate composition is not by itself evidence for a richer Theme meaning. Do not claim supplied snapshot information is missing when it is present. Avoid repetition; answer once, directly, and stop.\n\nAnswer ONLY the listed ITEMS. The letters A/B/C are response slots, not a sequence to extend. Do not generate, rewrite, repeat, extend, or propose questions. Do not output Q-numbers, Question numbers, ITEM D, ANSWER D, or any other unrequested slot.\n\nReturn exactly one answer for each requested slot using these labels. Multiple prose sentences are allowed inside each answer:\n${answerShape}\n\n${context}\n\nITEMS TO ANSWER:\n${list}`;
  }
  // Interview recovery deliberately uses ONE provider attempt at the current granularity.
  // The site owns fallback (3 -> 1) and checkpoints only validated answers.
  // Canonical Q IDs stay internal; the provider sees DIRECT QUESTION or A/B/C slots only.
  const raw=await runStructured(env,model,null,prompt,null,single?1200:2600,'text',{temperature:0.15,amaInterview:true,amaResumableChunk:true,amaThreeQuestionChunk:!single,amaSingleQuestionRecovery:single,providerCallTimeoutMs:AMA_PROVIDER_CALL_TIMEOUT_MS});
  const parsed=parseAmaSlotAnswersDetailed(raw,questions,snapshot),answers=parsed.answers,missing=questions.filter(q=>!answers.has(q.id));
  const rawResponsePreview=missing.length?cleanAmaBareAnswer(raw).replace(/\s+/g,' ').slice(0,1600):'';
  return{questions:questions.filter(q=>answers.has(q.id)).map(q=>({id:q.id,question:q.question,answer:answers.get(q.id),section:q.section})),missingQuestionIds:missing.map(q=>q.id),rejectedAnswers:parsed.rejected,providerQuestionMarkers:parsed.questionMarkers,providerAnswerSlots:parsed.slotMarkers,rawResponsePreview};
}
async function runAmaQuestionStep(env,body){
  if(!env.AI?.run)throw new Error('Workers AI binding AI is not configured');
  const snapshot=validateAmaSnapshot(body?.snapshot&&typeof body.snapshot==='object'?body.snapshot:{}),model=env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL,visualRead=String(body?.visualRead||'').trim();
  if(!visualRead)throw new Error('AI AMA question block requires the saved visual read.');
  const candidateThemeCodes=Array.isArray(body?.candidateThemeCodes)?body.candidateThemeCodes:[],questions=amaQuestions(snapshot),plan=amaQuestionPlan(snapshot),blockIndex=Number(body?.blockIndex);
  if(!Number.isInteger(blockIndex)||blockIndex<0||blockIndex>=plan.blockCount)throw new Error(`AI AMA blockIndex must be an integer from 0 to ${plan.blockCount-1}.`);
  const start=blockIndex*AMA_QUESTION_BLOCK_SIZE,fullBlock=questions.slice(start,start+AMA_QUESTION_BLOCK_SIZE),allowedIds=new Set(fullBlock.map(q=>q.id));
  const supplied=Array.isArray(body?.questionIds)?[...new Set(body.questionIds.map(id=>String(id||'').toUpperCase()).filter(Boolean))]:[];
  if(supplied.length>AMA_QUESTION_BLOCK_SIZE)throw new Error(`AI AMA question request cannot exceed ${AMA_QUESTION_BLOCK_SIZE} questions.`);
  if(supplied.some(id=>!allowedIds.has(id)))throw new Error('AI AMA question IDs must belong to the requested canonical 3-question block.');
  const requestedIds=supplied.length?supplied:fullBlock.map(q=>q.id),requestedSet=new Set(requestedIds),block=fullBlock.filter(q=>requestedSet.has(q.id));
  if(!block.length)throw new Error('AI AMA question request contains no canonical questions.');
  const context=amaContext(snapshot,visualRead,candidateThemeCodes),chunk=await runAmaQuestionChunk(env,model,context,block,snapshot);
  return{schemaVersion:2,amaVersion:'AMA-2-resumable',stage:'questions',createdAt:new Date().toISOString(),workerVersion:API_VERSION,matrixVersion:matrixVersion(),model:effectiveProviderModel(env,model),providerRouting:providerRoutingSnapshot(env,model),blockIndex,questionIds:block.map(q=>q.id),requestedQuestionCount:block.length,adaptiveChunkSize:block.length,answerParser:'slot-mapped-integrity-v5',complete:chunk.missingQuestionIds.length===0,...plan,...chunk};
}
async function runAma(env,body){
  if(!env.AI?.run)throw new Error('Workers AI binding AI is not configured');
  const snapshot=body?.snapshot&&typeof body.snapshot==='object'?body.snapshot:{};
  const aiThemes=amaSnapshotThemes(snapshot,'aiThemes'),directorThemes=amaSnapshotThemes(snapshot,'directorThemes');
  if(aiThemes.length!==3)throw new Error('AI AMA requires the current three AI Themes.');
  if(directorThemes.length<1||directorThemes.length>3)throw new Error('AI AMA requires at least one and at most three Director Themes.');
  const model=env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL,image=body.imageDataUrl?dataUrlBytes(body.imageDataUrl):(body.imageUrl?await fetchBytes(body.imageUrl):null);
  if(!image&&!String(snapshot.aiDescription||'').trim())throw new Error('AI AMA requires the current image or an AI Description.');
  const visualRead=image?String(await runAmaStructured(env,model,image,amaVisualPrompt(snapshot),null,1000,'text',{temperature:0.12,amaVisualRead:true})).trim():String(snapshot.aiDescription||'').trim();
  const candidateCodes=await amaCandidateAudit(env,model,visualRead,snapshot),context=amaContext(snapshot,visualRead,candidateCodes),questions=amaQuestions(snapshot),blocks=[questions.slice(0,17),questions.slice(17,35),questions.slice(35,54),questions.slice(54)];
  const answered=[];for(const block of blocks)answered.push(...await runAmaQuestionBlock(env,model,context,block,snapshot));
  return{schemaVersion:1,amaVersion:'AMA-1',createdAt:new Date().toISOString(),workerVersion:API_VERSION,matrixVersion:matrixVersion(),model:effectiveProviderModel(env,model),providerRouting:providerRoutingSnapshot(env,model),visualRead,candidateThemeCodes:candidateCodes,themeDefinitions:amaUniqueThemeMetas(snapshot,candidateCodes),questionCount:answered.length,questions:answered};
}
async function runAmaFollowup(env,body){
  if(!env.AI?.run)throw new Error('Workers AI binding AI is not configured');
  const snapshot=body?.snapshot&&typeof body.snapshot==='object'?body.snapshot:{},question=String(body?.question||'').trim().slice(0,3000);if(!question)throw new Error('AMA follow-up question is required');
  const model=env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL,visualRead=String(body?.visualRead||snapshot.aiDescription||'').trim(),prior=String(body?.priorTranscript||'').slice(0,18000),candidateCodes=Array.isArray(body?.candidateThemeCodes)?body.candidateThemeCodes:[],context=amaContext(snapshot,visualRead,candidateCodes);
  const prompt=`You are answering a Director follow-up question in an existing saved Genreactrix AI AMA. The historical report is immutable; your answer is a new linked Q/A record and must not alter prior answers, Themes, confidence, definitions, image status, or code. Be candid and diagnostic.\n\n${context}\n\nPRIOR AMA TRANSCRIPT (reference only):\n${prior||'Unavailable'}\n\nDIRECTOR QUESTION:\n${question}\n\nReturn only the answer.`;
  const answer=String(await runAmaStructured(env,model,null,prompt,null,1400,'text',{temperature:0.12,amaFollowup:true})).trim();if(!answer)throw new Error('AMA follow-up returned no answer');return{schemaVersion:1,createdAt:new Date().toISOString(),workerVersion:API_VERSION,model:effectiveProviderModel(env,model),providerRouting:providerRoutingSnapshot(env,model),answer};
}

const analysisProviderSummary = (env,primaryModel) => {
  const routing=providerRoutingSnapshot(env,primaryModel);
  const successCalls=routing.calls.filter(row=>row.outcome==='success');
  const providers=[...new Set(successCalls.map(row=>row.provider).filter(Boolean))];
  const models=[...new Set(successCalls.map(row=>row.model).filter(Boolean))];
  const id=providers.length>1?'mixed-ai-providers':(providers[0]||'cloudflare-workers-ai');
  const displayName=id==='mixed-ai-providers'?'Genreactrix Vision · Mixed provider route':id==='openai-via-cloudflare-ai-gateway'?'Genreactrix Vision · OpenAI via Cloudflare AI Gateway':id==='mistral-direct'?'Genreactrix Vision · Mistral':'Genreactrix Vision · Cloudflare Workers AI';
  const effectiveModel=models.length===1?models[0]:(models.length>1?'mixed':primaryModel);
  return {provider:{id,displayName,model:effectiveModel,routing},model:effectiveModel};
};


function themeProviderCycleReportSnapshot(components={}){
  const fresh=components.themeDecisionDiagnostics&&typeof components.themeDecisionDiagnostics==='object'?components.themeDecisionDiagnostics:null;
  const rerun=components.themeRerunDiagnostics&&typeof components.themeRerunDiagnostics==='object'?components.themeRerunDiagnostics:null;
  if(!fresh&&!rerun)return null;
  return{
    schemaVersion:1,
    policy:THEME_PROVIDER_CYCLE_POLICY,
    order:[...THEME_PROVIDER_CYCLE_ORDER],
    ...(fresh?{freshPipeline:{
      wholeRunProviderRecovery:fresh.wholeRunProviderRecovery||null,
      acceptedRunProvider:fresh.acceptedRunProvider||null,
      acceptedRunProviderRole:fresh.acceptedRunProviderRole||null,
      preliminary:fresh.preliminary?.providerCycle||null,
      preliminaryMismatchRecovery:fresh.preliminaryMismatchRecovery||null,
      description:fresh.description?.providerCycle||null,
      initialFinal:fresh.initialFinal?.providerCycle||null,
      final:fresh.final?.providerCycle||null,
      independentReview:fresh.independentReview||null,
      preliminaryFinalComparison:fresh.preliminaryFinalComparison||null,
      automaticMismatchRecovery:fresh.automaticMismatchRecovery||null,
      sameProviderFinalRescanUsed:Boolean(fresh.sameProviderFinalRescanUsed),
      preservedDescriptionReused:Boolean(fresh.preservedDescriptionReused)
    }}:{}),
    ...(rerun?{rerun:{selection:rerun.providerCycle||null,protocol:rerun.protocol||null}}:{})
  };
}


const THEME_REACTION_SLOT_WEIGHT=100/6;
function themeReactionPrimIds(theme){
  const code=String(theme?.code||theme?.id||theme?.value||'').trim().toUpperCase(),match=code.match(/^PFM(\d{2})(\d{2})$/);
  if(!match)return[];
  const ids=[`P${match[1]}`,`P${match[2]}`],valid=new Set(PRIMFUSION_REGISTRY.primitives.map(row=>String(row.id)));
  return ids.every(id=>valid.has(id))?ids:[];
}
function deriveReactionsFromThemes(themes){
  const selected=Array.isArray(themes)?themes.slice(0,3):[];
  if(selected.length!==3)throw new Error('Theme-derived Reactions require exactly three selected Themes.');
  const reactions=Object.fromEntries(PRIMFUSION_REGISTRY.primitives.map(row=>[row.id,0])),slots=[];
  for(const theme of selected){
    const ids=themeReactionPrimIds(theme);if(ids.length!==2)throw new Error(`Theme-derived Reactions could not resolve two Prim codes from ${String(theme?.code||theme?.name||'Theme')}.`);
    const themeCode=String(theme?.code||theme?.id||theme?.value||'').trim().toUpperCase();
    for(const primId of ids){reactions[primId]+=THEME_REACTION_SLOT_WEIGHT;slots.push({themeCode,primId,weight:THEME_REACTION_SLOT_WEIGHT});}
  }
  const diagnostics={schemaVersion:1,method:'theme-derived-six-equal-slots-v1',aiScan:false,themeOrderSignificant:false,slotCount:6,slotWeight:THEME_REACTION_SLOT_WEIGHT,total:100,themeCodes:selected.map(theme=>String(theme?.code||theme?.id||theme?.value||'').trim().toUpperCase()),slots};
  return{reactions,diagnostics};
}

async function analyze(env,body){
  if (!env.AI?.run) throw new Error('Workers AI binding AI is not configured');

  const requested = [...new Set((body.components||[]).filter(x=>COMPONENT_IDS.includes(x)))];
  if (!body.imageId || !requested.length) throw new Error('imageId and components are required');
  const analysisStartedMs=Date.now();

  const reactionFamilyRequested=requested.includes('reactions')||requested.includes('reactionReasons');
  const themeFamilyRequested=requested.includes('themes')||requested.includes('genreReasons');
  if(reactionFamilyRequested&&!themeFamilyRequested)throw new Error('AI Reaction scan is retired. Request Themes with Reactions, or recalculate Reactions locally from the current three Themes.');
  const needsImage = true;
  const imageInputStartedMs=Date.now();
  const image = body.imageDataUrl ? dataUrlBytes(body.imageDataUrl) : (body.imageObjectKey ? await serverJobImageBytes(env,body.imageObjectKey) : await fetchBytes(body.imageUrl));
  const imageInputEndedMs=Date.now();

  const model = env.WORKERS_AI_VISION_MODEL || DEFAULT_MODEL;
  const components = {};
  const promptVersions = {};
  let customThemeTriggered = false;
  let resolvedThemesForSlop = null,resolvedThemesForReactions=null;
  const pipelineTiming={
    schemaVersion:1,
    startedAt:timingIso(analysisStartedMs),
    endedAt:null,
    durationMs:null,
    execution:{reactionAiScan:false,reactionArchitecture:'theme-derived-six-equal-slots-v1',reactionThemeParallelEligible:false,reactionThemeRanInParallel:false,costOrderedProviderRouting:true,providerOrder:[...THEME_PROVIDER_CYCLE_ORDER]},
    families:{
      imageInput:{startedAt:timingIso(imageInputStartedMs),endedAt:timingIso(imageInputEndedMs),durationMs:timingDurationMs(imageInputStartedMs,imageInputEndedMs),mode:needsImage?(body.imageDataUrl?'embedded-data-url':(body.imageObjectKey?'server-r2-object':'remote-url')):'not-required',byteLength:image?Number(image.byteLength||image.length||0):0}
    },
    recoveryPolicy:{freshThemeWholeRunReplacement:true,freshSameProviderFinalRescan:false,rejectedFreshRunDataReused:false,rerunRecoveryPreserved:true,rollbackTelemetryOnly:true}
  };
  const recordFamilyTiming=(name,startedMs,endedMs=Date.now(),extra={})=>{pipelineTiming.families[name]={startedAt:timingIso(startedMs),endedAt:timingIso(endedMs),durationMs:timingDurationMs(startedMs,endedMs),...extra};};

  const behaviorFor = names => names.some(name=>requested.includes(name) && body.componentBehaviors?.[name] === 'reanalyze') ? 'reanalyze' : 'analyze';

  // Reactions are not independently analyzed. They are derived deterministically
  // from the three selected Themes after Theme selection completes.

  const themeTask=themeFamilyRequested?(async()=>{
    const familyStartedMs=Date.now();
    try{

    const behavior = behaviorFor(['themes','genreReasons']),themeRerun=body.themeRerun&&requested.includes('themes')?normalizeThemeRerun(body.themeRerun):null;
    let resolvedThemes,sharedThemeReasoningDiagnostic=null;
    if(themeRerun){
      if(themeHumanVoteRerunExperimentEligible(themeRerun)){
        const rerunResult=await runThemeHumanVoteRerunExperiment(env,model,image,behavior,themeRerun);
        resolvedThemes=resolveThemes(rerunResult.selections);
        components.themeRerunDiagnostics={
          ...rerunResult.diagnostics,
          applied:true,
          protectedSlots:[],replaceSlots:[],neutralSlots:[1,2,3],excludedThemeCodes:[],
          explainChanges:false,
          evidenceLedger:[],selectionSupportBySlot:{},auditRounds:[],
          constrainedRerunFallbackUsed:false
        };
        promptVersions.themes='genreactrix-themes-pfm-v24-rerun-human-vote-raw-fixed-shuffled-order-experiment';
      }else{
        const rerunResult=await runThemeRerun(env,model,image,behavior,themeRerun);
        resolvedThemes=resolveThemes(rerunResult.selections).map((row,index)=>({...row,supportEvidenceIds:[...(rerunResult.selections[index]?.supportEvidenceIds||[])]}));
        if(!rerunResult.rerun.explainChanges)resolvedThemes=resolvedThemes.map(row=>({...row,rationale:''}));
        components.themeRerunDiagnostics={
          schemaVersion:3,applied:true,
          evidenceProtocol:'frozen-ledger-support-refs-v2',
          selectionImageAccess:false,
          editLogReasonImageAccess:false,
          selectionOutputProtocol:'slot-pfm-score-evidence-ids-v1',
          evidenceLedger:rerunResult.evidenceLedger.map(row=>({...row})),
          selectionSupportBySlot:Object.fromEntries(rerunResult.selections.filter(row=>Array.isArray(row.supportEvidenceIds)&&row.supportEvidenceIds.length).map(row=>[row.rank,[...row.supportEvidenceIds]])),
          protectedSlots:rerunResult.rerun.themeSlots.filter(row=>row.state==='preserve').map(row=>row.slot),
          replaceSlots:rerunResult.rerun.themeSlots.filter(row=>row.state==='replace').map(row=>row.slot),
          neutralSlots:rerunResult.rerun.themeSlots.filter(row=>row.state==='neutral').map(row=>row.slot),
          excludedThemeCodes:[...rerunResult.rerun.excludedThemeCodes],
          includedDescriptionCount:rerunResult.rerun.includedDescriptions.length,
          explainChanges:rerunResult.rerun.explainChanges!==false,
          candidateCounts:Object.fromEntries([1,2,3].map(slot=>[slot,rerunResult.sets[slot].candidates.length])),
          adversarialAuditProtocol:'candidate-audit-replace-v1',
          auditRounds:Array.isArray(rerunResult.auditRounds)?rerunResult.auditRounds:[],
          constrainedRerunFallbackUsed:true
        };
        promptVersions.themes='genreactrix-themes-pfm-v19-rerun-adversarial-audit';
      }
    }else{
      // Fresh Theme analysis is a provider-owned whole run. A provider that
      // produces semantically rejected Final Themes does not get a same-provider
      // Final rescan; its complete Preliminary -> Description -> Final result is
      // discarded before the next provider starts again from the original image.
      const runFreshThemeChain=async(runEnv,runProvider)=>{
        const preservedDescription=String(body.preservedDescriptionContext||'').trim().slice(0,12000);
        const preservedDiagnostics=body.preservedDescriptionDiagnostics&&typeof body.preservedDescriptionDiagnostics==='object'?body.preservedDescriptionDiagnostics:null;
        let preliminaryRun=null,preliminary=null,preliminaryThemes=[],descriptionPass;
        if(preservedDescription){
          descriptionPass={description:preservedDescription,diagnostics:{schemaVersion:3,protocol:'preliminary-theme-aware-description-v3-provider-roster',...(preservedDiagnostics||{}),preservedForDownstreamRecovery:true}};
        }else{
          preliminaryRun=await runPreliminaryThemeMismatchRecovery(runEnv,model,image,behavior,body.themeSweep||null);
          preliminary=preliminaryRun.result;
          preliminaryThemes=resolveThemes(preliminary.selections);
          descriptionPass=await runFreshThemeAwareDescription(runEnv,model,image,{behavior,directorGuidance:body.directorGuidance,preliminaryThemes});
        }
        const initialFinalDecision=await runThemeAssociation(runEnv,model,{description:descriptionPass.description,behavior,themeSweep:body.themeSweep||null,stage:'final'});
        const resolvedFinal=resolveThemes(initialFinalDecision.selections);
        const review=await runIndependentThemeReview(runEnv,model,image,behavior,resolvedFinal,body.themeSweep||null,runProvider);
        const rejectedCodes=themeReviewSemanticRejects(review.diagnostic);
        const comparison=comparePreliminaryFinalThemes(preliminaryThemes,resolvedFinal);
        if(rejectedCodes.length){
          throw diagnosticError(`Independent Theme review rejected ${rejectedCodes.length} delivered Theme${rejectedCodes.length===1?'':'s'} from ${runProvider}.`,{phase:'fresh-theme-whole-run-semantic-reject',failureKind:'semantic-reject',runProvider,runProviderRole:themeProviderRole(runProvider),rejectedCodes,reviewer:review.reviewer,reviewers:review.reviewers||[],reviewAttempts:review.attempts,preliminaryFinalComparison:comparison});
        }
        return{
          resolvedThemes:resolvedFinal,
          sharedThemeReasoningDiagnostic:review.diagnostic,
          description:descriptionPass.description,
          descriptionDiagnostics:descriptionPass.diagnostics,
          themeDecisionDiagnostics:{
            schemaVersion:7,
            protocol:'description-only-final-themes-whole-run-provider-replacement-v1',
            wholeRunPolicy:THEME_WHOLE_RUN_POLICY,
            providerCyclePolicy:THEME_PROVIDER_CYCLE_POLICY,
            providerCycleOrder:[...THEME_PROVIDER_CYCLE_ORDER],
            providerRoster:themeProviderRoster(runEnv,model),
            acceptedRunProvider:runProvider,
            acceptedRunProviderRole:themeProviderRole(runProvider),
            acceptedRunProviderModel:themeProviderModel(runEnv,runProvider,model),
            preliminary:preliminary?.diagnostics||null,
            preliminaryThemes:preliminaryThemes.map(row=>({rank:row.rank,code:row.code,name:row.name})),
            preliminaryMismatchRecovery:preliminaryRun?.recovery||null,
            description:descriptionPass.diagnostics,
            initialFinal:initialFinalDecision.diagnostics,
            final:initialFinalDecision.diagnostics,
            independentReview:{schemaVersion:3,auditProtocol:review.diagnostic?.protocol||'selected-theme-decision-audit-v4-independent-per-theme-binary-unordered',reviewerMode:'per-theme-independent',reviewers:review.reviewers||[],perTheme:review.perTheme||[],attempts:review.attempts,rejectedCodes:[],accepted:true},
            preliminaryFinalComparison:comparison,
            automaticMismatchRecovery:null,
            sameProviderFinalRescanUsed:false,
            rejectedRunDataReused:false,
            preservedDescriptionReused:Boolean(preservedDescription),
            preliminarySelectorPreserved:!preservedDescription,
            finalSelectionImageAccess:false,
            finalSelectionPreliminaryThemeAccess:false
          }
        };
      };
      const wholeRunAttempts=[];let freshChain=null,lastWholeRunError=null;
      for(const runProvider of THEME_PROVIDER_CYCLE_ORDER){
        const runStartedMs=Date.now(),runEnv=themePinnedProviderEnv(env,runProvider,`fresh-theme-whole-run-${runProvider}`);
        providerProgressEvent(env,{event:'whole-run-provider-start',stage:'fresh-theme-whole-run',provider:runProvider,providerRole:themeProviderRole(runProvider),model:themeProviderModel(env,runProvider,model),state:'running'});
        try{
          freshChain=await runFreshThemeChain(runEnv,runProvider);
          const runEndedMs=Date.now();
          mergeProviderTrace(env,runEnv,`fresh-theme-whole-run:${runProvider}:accepted`);
          wholeRunAttempts.push({provider:runProvider,role:themeProviderRole(runProvider),model:themeProviderModel(env,runProvider,model),outcome:'accepted',startedAt:timingIso(runStartedMs),endedAt:timingIso(runEndedMs),durationMs:timingDurationMs(runStartedMs,runEndedMs)});
          providerProgressEvent(env,{event:'whole-run-provider-success',stage:'fresh-theme-whole-run',provider:runProvider,providerRole:themeProviderRole(runProvider),model:themeProviderModel(env,runProvider,model),state:'success',durationMs:timingDurationMs(runStartedMs,runEndedMs)});
          break;
        }catch(error){
          const runEndedMs=Date.now(),d=providerDiagnosticOf(error)||{};
          mergeProviderTrace(env,runEnv,`fresh-theme-whole-run:${runProvider}:discarded`);
          wholeRunAttempts.push({provider:runProvider,role:themeProviderRole(runProvider),model:themeProviderModel(env,runProvider,model),outcome:d.failureKind==='semantic-reject'?'semantic-reject':'technical-failure',discarded:true,startedAt:timingIso(runStartedMs),endedAt:timingIso(runEndedMs),durationMs:timingDurationMs(runStartedMs,runEndedMs),failurePhase:d.phase||null,failureKind:d.failureKind||null,rejectedCodes:Array.isArray(d.rejectedCodes)?[...d.rejectedCodes]:[],reviewer:d.reviewer||null,reviewAttempts:Array.isArray(d.reviewAttempts)?d.reviewAttempts:[],preliminaryFinalComparison:d.preliminaryFinalComparison||null,errorMessage:String(error?.message||error).slice(0,1000)});
          providerProgressEvent(env,{event:'whole-run-provider-failure',stage:'fresh-theme-whole-run',provider:runProvider,providerRole:themeProviderRole(runProvider),model:themeProviderModel(env,runProvider,model),state:'failure',durationMs:timingDurationMs(runStartedMs,runEndedMs),failurePhase:d.phase||null,failureKind:d.failureKind||null,errorMessage:String(error?.message||error).slice(0,1000)});
          lastWholeRunError=error;
        }
      }
      if(!freshChain)throw diagnosticError(lastWholeRunError?.message||'Fresh Theme whole-run provider roster exhausted.',{phase:'fresh-theme-whole-run-exhausted',failureKind:'whole-run-exhausted',wholeRunPolicy:THEME_WHOLE_RUN_POLICY,wholeRunAttempts});
      freshChain.themeDecisionDiagnostics.wholeRunProviderRecovery={schemaVersion:1,policy:THEME_WHOLE_RUN_POLICY,order:themeProviderRoster(env,model),attempts:wholeRunAttempts,acceptedProvider:freshChain.themeDecisionDiagnostics.acceptedRunProvider,acceptedProviderRole:freshChain.themeDecisionDiagnostics.acceptedRunProviderRole};
      resolvedThemes=freshChain.resolvedThemes;
      sharedThemeReasoningDiagnostic=freshChain.sharedThemeReasoningDiagnostic;
      components.themeDecisionDiagnostics=freshChain.themeDecisionDiagnostics;
      components.__freshPipelineDescription=freshChain.description;
      components.__freshPipelineDescriptionDiagnostics=freshChain.descriptionDiagnostics;
      promptVersions.themes='genreactrix-themes-pfm-v34-mistral-primary-whole-run';
    }
    resolvedThemesForReactions=resolvedThemes.map(row=>({...row}));
    if (requested.includes('themes')) components.themes = resolvedThemes;
    if (requested.includes('genreReasons')) {
      // Preserve the existing Theme reasoning sidecar on fresh analysis and
      // eligible all-three reruns. It remains diagnostic/evidence support and
      // is not removed by the new Description-led refinement stage.
      const humanVoteDiagnosticEligible = !themeRerun || themeHumanVoteRerunExperimentEligible(themeRerun);
      const diagnostic = humanVoteDiagnosticEligible
        ? (sharedThemeReasoningDiagnostic||await runThemeSelectedDecisionAudit(env,model,image,behavior,resolvedThemes))
        : {schemaVersion:1,status:'not-applicable',protocol:'human-vote-reasoning-sidecar-v1',reason:'Director-constrained Theme Rerun uses the frozen-evidence rerun diagnostic pipeline.'};
      const pipelineProviderCycles=themeProviderCycleReportSnapshot(components);
      if(diagnostic&&typeof diagnostic==='object'&&pipelineProviderCycles)diagnostic.pipelineProviderCycles=pipelineProviderCycles;
      components.genreReasons = {
        schemaVersion:2,
        protocol:humanVoteDiagnosticEligible?'human-vote-selection-basis-plus-audit-v1':'director-rerun-shared-assessment-v1',
        themes:resolvedThemes.map(item=>({
          rank:item.rank,code:item.code||null,name:item.name||item.proposedName||'',confidence:item.confidence,
          rationale:item.rationale,matrixVersion:item.matrixVersion
        })),
        diagnostic
      };
    }
    customThemeTriggered = resolvedThemes.some(t=>t.source==='custom');
    resolvedThemesForSlop = resolvedThemes.map(row=>({...row}));
    if (requested.includes('genreReasons')) promptVersions.genreReasons = themeRerun&&!themeHumanVoteRerunExperimentEligible(themeRerun)?'genreactrix-theme-info-v2-director-rerun':'genreactrix-theme-info-v7-per-theme-binary-audit-deferred-reporting';
  
    }finally{recordFamilyTiming('themes',familyStartedMs,Date.now(),{parallelWithReactions:false});}
  })():Promise.resolve();

  await themeTask;

  if(reactionFamilyRequested){
    const familyStartedMs=Date.now(),derived=deriveReactionsFromThemes(resolvedThemesForReactions);
    components.reactionDiagnostics=derived.diagnostics;
    if(requested.includes('reactions'))components.reactions=derived.reactions;
    if(requested.includes('reactionReasons'))components.reactionReasons={schemaVersion:1,protocol:'theme-derived-six-equal-slots-v1',aiScan:false,themeCodes:[...derived.diagnostics.themeCodes],slots:derived.diagnostics.slots.map(row=>({...row})),summary:'Three selected Themes contribute six equal Prim slots; duplicate Prims accumulate.'};
    promptVersions.reactions='genreactrix-reactions-theme-derived-v1';
    if(requested.includes('reactionReasons'))promptVersions.reactionReasons='genreactrix-reaction-info-theme-derived-v1';
    recordFamilyTiming('reactions-derived',familyStartedMs,Date.now(),{aiCall:false,slotCount:6,slotWeight:THEME_REACTION_SLOT_WEIGHT});
  }

  if (requested.includes('description')){
    const familyStartedMs=Date.now();
    try{

    const behavior = behaviorFor(['description']),descriptionRerun=normalizeDescriptionRerun(body.descriptionRerun),scopedEdit=['add','replace'].includes(descriptionRerun?.operation);
    if(!descriptionRerun&&components.__freshPipelineDescription){
      components.description=components.__freshPipelineDescription;
      components.descriptionDiagnostics=components.__freshPipelineDescriptionDiagnostics;
      promptVersions.description='genreactrix-freeform-v4-preliminary-theme-aware-zazzly-exhaustive';
    }else if(!descriptionRerun){
      const preliminaryRun=await runPreliminaryThemeMismatchRecovery(env,model,image,behavior,body.themeSweep||null),preliminary=preliminaryRun.result;
      const preliminaryThemes=resolveThemes(preliminary.selections);
      const descriptionPass=await runFreshThemeAwareDescription(env,model,image,{behavior,directorGuidance:body.directorGuidance,preliminaryThemes});
      components.description=descriptionPass.description;
      components.descriptionDiagnostics={...descriptionPass.diagnostics,preliminaryThemes:preliminaryThemes.map(row=>({rank:row.rank,code:row.code,name:row.name})),preliminaryMismatchRecovery:preliminaryRun.recovery};
      promptVersions.description='genreactrix-freeform-v4-preliminary-theme-aware-zazzly-exhaustive';
    }else{
      const description = await runStructured(env,model,image,descriptionPrompt(body.directorGuidance,descriptionRerun),descriptionSchema(),3200,'text',{behavior,scopedEdit,preserveWhitespace:scopedEdit});
      if (typeof description !== 'string' || !description.trim()) throw new Error('Description provider response did not contain description text');
      components.description = scopedEdit ? description : description.trim();
      promptVersions.description = `genreactrix-freeform-v3-rerun-workspace-${descriptionRerun.operation}`;
    }
  
    }finally{recordFamilyTiming('description-component',familyStartedMs);}
  }
  if (requested.includes('themes') && resolvedThemesForSlop && !components.slopAssessment){
    const familyStartedMs=Date.now();
    try{

    const basis=body.themeRerun?'theme-rerun':'origin-or-analysis';
    const descriptionForSlop=String(components.description||components.__freshPipelineDescription||body.themeAnalysisContext||'').trim();
    components.slopAssessment=await runSlopAssessment(env,model,image,resolvedThemesForSlop,descriptionForSlop,basis);
    promptVersions.slopAssessment='genreactrix-slop-advisory-v1';
  
    }finally{recordFamilyTiming('slop-assessment',familyStartedMs);}
  }

  const analysisEndedMs=Date.now();
  pipelineTiming.endedAt=timingIso(analysisEndedMs);
  pipelineTiming.durationMs=timingDurationMs(analysisStartedMs,analysisEndedMs);
  components.pipelineTiming=pipelineTiming;
  if(components.genreReasons?.diagnostic&&typeof components.genreReasons.diagnostic==='object')components.genreReasons.diagnostic.pipelineTiming=pipelineTiming;
  if(components.reactionDiagnostics&&typeof components.reactionDiagnostics==='object')components.reactionDiagnostics.pipelineTiming=pipelineTiming;
  if(components.reactionReasons&&typeof components.reactionReasons==='object')components.reactionReasons.pipelineTiming=pipelineTiming;

  delete components.__freshPipelineDescription;
  delete components.__freshPipelineDescriptionDiagnostics;

  const providerSummary=analysisProviderSummary(env,model);
  return {
    schemaVersion:3,
    imageId:body.imageId,
    analyzedAt:new Date().toISOString(),
    provider:providerSummary.provider,
    model:providerSummary.model,
    primFusionMatrixVersion:matrixVersion(),
    promptVersions,
    researchConfiguration:{customThemeGenerationEnabled:CUSTOM_THEME_GENERATION_ENABLED,...(reactionFamilyRequested?{reactionArchitecture:'theme-derived-six-equal-slots-v1',reactionAiScan:false}:{})},
    reviewDirectives:{
      autoKeep:customThemeTriggered,
      autoFlag:customThemeTriggered,
      reason:customThemeTriggered ? 'custom-theme-use-or-creation' : null
    },
    components
  };
}


function analyzeProgressStreamResponse(routedEnv,body){
  const encoder=new TextEncoder();
  let sequence=0,closed=false;
  const diagnosticSummary=error=>{const d=providerDiagnosticOf(error)||{};return{phase:d.phase||null,failureKind:d.failureKind||null,errorName:String(error?.name||'Error'),errorMessage:String(error?.message||error).slice(0,1200)};};
  // Use Cloudflare's identity TransformStream so live progress works on older
  // compatibility dates without requiring streams_enable_constructors.
  const {readable,writable}=new TransformStream();
  const writer=writable.getWriter();
  let writeChain=Promise.resolve();
  const emit=payload=>{
    if(closed)return;
    const chunk=encoder.encode(`${JSON.stringify({sequence:++sequence,at:new Date().toISOString(),...payload})}\n`);
    writeChain=writeChain.then(()=>writer.write(chunk)).catch(()=>{closed=true;});
  };
  Object.defineProperty(routedEnv,'__GENREACTRIX_PROGRESS_SINK',{value:event=>emit({type:'progress',...event}),enumerable:false,configurable:true});
  (async()=>{
    emit({type:'progress',event:'analysis-start',stage:'request',state:'running',components:Array.isArray(body?.components)?[...body.components]:[]});
    try{
      const result=await analyze(routedEnv,body);
      emit({type:'progress',event:'analysis-complete',stage:'request',state:'success'});
      emit({type:'result',ok:true,result,providerRouting:providerRoutingSnapshot(routedEnv,routedEnv?.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL)});
    }catch(error){
      emit({type:'error',ok:false,error:error?.message||String(error),providerDiagnostic:diagnosticSummary(error),providerRouting:providerRoutingSnapshot(routedEnv,routedEnv?.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL)});
    }finally{
      try{await writeChain;}catch{}
      if(!closed){closed=true;try{await writer.close();}catch{}}
    }
  })();
  return new Response(readable,{status:200,headers:{...cors,'content-type':'application/x-ndjson; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
}

async function runThemeReportingSidecarRequest(env,body={}){
  if(!env.AI?.run)throw new Error('Workers AI binding AI is not configured');
  const validCodes=new Set(PRIMFUSION_REGISTRY.aiThemeChoices.map(row=>row.code));
  const seen=new Set(),selections=[];
  for(const [index,row] of (Array.isArray(body.themes)?body.themes:[]).slice(0,3).entries()){
    const code=String(row?.code||'').toUpperCase();if(!validCodes.has(code)||seen.has(code))continue;seen.add(code);
    selections.push({rank:Number(row?.rank)||index+1,code,rationale:String(row?.rationale||'').trim().slice(0,900)});
  }
  if(selections.length!==3)throw new Error('Theme reporting diagnostic requires exactly 3 valid Theme selections');
  const image=body.imageDataUrl?dataUrlBytes(body.imageDataUrl):await fetchBytes(body.imageUrl);
  const behavior=String(body.behavior||'analyze')==='reanalyze'?'reanalyze':'analyze';
  const model=env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL;
  const startedMs=Date.now(),diagnostic=await runThemeReportingDiagnostic(env,model,image,behavior,selections,body.themeSweep||null),endedMs=Date.now();
  diagnostic.reportingSidecar={status:'complete',protocol:'human-vote-reasoning-sidecar-v1',startedAt:timingIso(startedMs),completedAt:timingIso(endedMs),durationMs:timingDurationMs(startedMs,endedMs)};
  return{schemaVersion:1,protocol:'theme-reporting-diagnostic-background-v1',imageId:String(body.imageId||''),themeCodes:selections.map(row=>row.code),diagnostic};
}


/* --- Durable server-side AI job runner -----------------------------------
   Browser responsibility ends after manifest + local-image handoff.
   The Queue consumer reuses analyze() unchanged for each image request.
   D1 stores durable job/item state and result envelopes; R2 is temporary
   transport storage for browser-local normalized JPEGs only.
*/
let SERVER_JOB_SCHEMA_READY=false;
const SERVER_JOB_TERMINAL_STATES=new Set(['completed','completed-with-failures','failed','cancelled']);
const SERVER_JOB_ITEM_TERMINAL_STATES=new Set(['complete','failed','cancelled']);
const serverJobBindings=env=>({db:Boolean(env?.GENREACTRIX_JOBS_DB),queue:Boolean(env?.GENREACTRIX_AI_JOB_QUEUE),images:Boolean(env?.GENREACTRIX_AI_IMAGES)});
const serverJobBindingsReady=env=>{const b=serverJobBindings(env);return b.db&&b.queue&&b.images;};
const serverJobIso=()=>new Date().toISOString();
const serverJobJsonParse=(value,fallback=null)=>{try{return JSON.parse(String(value??''));}catch{return fallback;}};
const serverJobId=prefix=>`${prefix}_${crypto.randomUUID().replace(/-/g,'')}`;

async function ensureServerJobSchema(env){
  if(SERVER_JOB_SCHEMA_READY)return;
  if(!env?.GENREACTRIX_JOBS_DB)throw new Error('Server AI jobs require GENREACTRIX_JOBS_DB');
  const db=env.GENREACTRIX_JOBS_DB;
  await db.prepare(`CREATE TABLE IF NOT EXISTS ai_jobs (
    id TEXT PRIMARY KEY,
    client_job_id TEXT,
    state TEXT NOT NULL,
    total INTEGER NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    failed INTEGER NOT NULL DEFAULT 0,
    cancelled INTEGER NOT NULL DEFAULT 0,
    message TEXT NOT NULL DEFAULT '',
    config_json TEXT,
    created_at TEXT NOT NULL,
    started_at TEXT,
    completed_at TEXT,
    updated_at TEXT NOT NULL
  )`).run();
  await db.prepare(`CREATE INDEX IF NOT EXISTS ai_jobs_client_job_idx ON ai_jobs(client_job_id)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS ai_job_items (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    client_item_id TEXT,
    image_id TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    state TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    error TEXT NOT NULL DEFAULT '',
    source_kind TEXT NOT NULL,
    source_ref TEXT,
    request_json TEXT NOT NULL,
    result_json TEXT,
    created_at TEXT NOT NULL,
    started_at TEXT,
    completed_at TEXT,
    harvested_at TEXT,
    updated_at TEXT NOT NULL
  )`).run();
  await db.prepare(`CREATE INDEX IF NOT EXISTS ai_job_items_job_idx ON ai_job_items(job_id, order_index)`).run();
  await db.prepare(`CREATE INDEX IF NOT EXISTS ai_job_items_state_idx ON ai_job_items(job_id, state)`).run();
  SERVER_JOB_SCHEMA_READY=true;
}

async function serverJobImageBytes(env,key){
  if(!env?.GENREACTRIX_AI_IMAGES)throw new Error('Server AI image storage is not configured');
  const object=await env.GENREACTRIX_AI_IMAGES.get(String(key||''));
  if(!object)throw new Error('Server AI image payload is unavailable');
  const bytes=new Uint8Array(await object.arrayBuffer());
  if(!bytes.length)throw new Error('Server AI image payload is empty');
  if(bytes.length>6_000_000)throw new Error('Server AI image payload exceeds 6 MB');
  return bytes;
}

async function serverJobRow(env,jobId){
  await ensureServerJobSchema(env);
  return env.GENREACTRIX_JOBS_DB.prepare('SELECT * FROM ai_jobs WHERE id=?').bind(String(jobId)).first();
}
async function serverJobItemRow(env,jobId,itemId){
  await ensureServerJobSchema(env);
  return env.GENREACTRIX_JOBS_DB.prepare('SELECT * FROM ai_job_items WHERE job_id=? AND id=?').bind(String(jobId),String(itemId)).first();
}
async function serverJobItems(env,jobId){
  await ensureServerJobSchema(env);
  const result=await env.GENREACTRIX_JOBS_DB.prepare('SELECT id,client_item_id,image_id,order_index,state,attempts,error,source_kind,started_at,completed_at,harvested_at,updated_at FROM ai_job_items WHERE job_id=? ORDER BY order_index ASC').bind(String(jobId)).all();
  return result?.results||[];
}
async function refreshServerJobCounters(env,jobId){
  const db=env.GENREACTRIX_JOBS_DB,summary=await db.prepare(`SELECT
    COUNT(*) total,
    SUM(CASE WHEN state='complete' THEN 1 ELSE 0 END) completed,
    SUM(CASE WHEN state='failed' THEN 1 ELSE 0 END) failed,
    SUM(CASE WHEN state='cancelled' THEN 1 ELSE 0 END) cancelled,
    SUM(CASE WHEN state IN ('queued','processing') THEN 1 ELSE 0 END) active
    FROM ai_job_items WHERE job_id=?`).bind(String(jobId)).first();
  const job=await serverJobRow(env,jobId);if(!job)return null;
  const total=Number(summary?.total)||0,completed=Number(summary?.completed)||0,failed=Number(summary?.failed)||0,cancelled=Number(summary?.cancelled)||0,active=Number(summary?.active)||0;
  let state=String(job.state||'running'),message=String(job.message||'');let completedAt=job.completed_at||null;
  if(!['paused','cancelled'].includes(state)&&active===0&&completed+failed+cancelled>=total){state=failed?'completed-with-failures':'completed';message=failed?`Completed with ${failed} failure(s)`:'Completed';completedAt=completedAt||serverJobIso();}
  await db.prepare('UPDATE ai_jobs SET total=?,completed=?,failed=?,cancelled=?,state=?,message=?,completed_at=?,updated_at=? WHERE id=?').bind(total,completed,failed,cancelled,state,message,completedAt,serverJobIso(),String(jobId)).run();
  return serverJobRow(env,jobId);
}
function serverJobPublic(row){if(!row)return null;return{id:row.id,clientJobId:row.client_job_id||null,state:row.state,total:Number(row.total)||0,completed:Number(row.completed)||0,failed:Number(row.failed)||0,cancelled:Number(row.cancelled)||0,message:row.message||'',createdAt:row.created_at||null,startedAt:row.started_at||null,completedAt:row.completed_at||null,updatedAt:row.updated_at||null};}
function serverJobItemPublic(row){return{id:row.id,clientItemId:row.client_item_id||row.id,imageId:row.image_id,order:Number(row.order_index)||0,state:row.state,attempts:Number(row.attempts)||0,error:row.error||'',sourceKind:row.source_kind||'',startedAt:row.started_at||null,completedAt:row.completed_at||null,harvestedAt:row.harvested_at||null,updatedAt:row.updated_at||null};}

async function createServerAiJob(env,body={}){
  if(!serverJobBindingsReady(env))throw new Error('Server AI jobs are not fully configured (D1 + Queue + R2 required)');
  await ensureServerJobSchema(env);
  const rawItems=Array.isArray(body.items)?body.items:[];
  if(!rawItems.length||rawItems.length>1000)throw new Error('Server AI job requires 1–1000 items');
  const jobId=serverJobId('srvjob'),createdAt=serverJobIso(),clientJobId=String(body.clientJobId||'').slice(0,160)||null;
  await env.GENREACTRIX_JOBS_DB.prepare('INSERT INTO ai_jobs(id,client_job_id,state,total,completed,failed,cancelled,message,config_json,created_at,updated_at) VALUES(?,?,?,?,0,0,0,?,?,?,?)').bind(jobId,clientJobId,'preparing',rawItems.length,'Waiting for image handoff',JSON.stringify(body.config||{}),createdAt,createdAt).run();
  const statements=[];
  for(const [index,raw] of rawItems.entries()){
    const id=String(raw?.id||serverJobId('srvitem')).slice(0,220),imageId=String(raw?.imageId||'').slice(0,220),sourceKind=String(raw?.sourceKind||'').toLowerCase(),sourceRef=sourceKind==='url'?String(raw?.sourceRef||'').trim():null,request=raw?.request;
    if(!imageId)throw new Error(`Server AI item ${index+1} is missing imageId`);
    if(!['upload','url'].includes(sourceKind))throw new Error(`Server AI item ${index+1} has invalid sourceKind`);
    if(sourceKind==='url'&&!/^https:\/\//i.test(sourceRef||''))throw new Error(`Server AI item ${index+1} requires an HTTPS source URL`);
    if(!request||typeof request!=='object'||!Array.isArray(request.components)||!request.components.length)throw new Error(`Server AI item ${index+1} has no analysis request`);
    statements.push(env.GENREACTRIX_JOBS_DB.prepare('INSERT INTO ai_job_items(id,job_id,client_item_id,image_id,order_index,state,attempts,error,source_kind,source_ref,request_json,created_at,updated_at) VALUES(?,?,?,?,?,\'queued\',0,\'\',?,?,?,?,?)').bind(id,jobId,String(raw?.clientItemId||id).slice(0,220),imageId,Number(raw?.order)||index,sourceKind,sourceRef,JSON.stringify(request),createdAt,createdAt));
  }
  for(let i=0;i<statements.length;i+=50)await env.GENREACTRIX_JOBS_DB.batch(statements.slice(i,i+50));
  return{job:serverJobPublic(await serverJobRow(env,jobId)),items:await serverJobItems(env,jobId).then(rows=>rows.map(serverJobItemPublic))};
}
async function uploadServerAiJobImage(env,jobId,itemId,request){
  if(!serverJobBindingsReady(env))throw new Error('Server AI jobs are not fully configured');
  const item=await serverJobItemRow(env,jobId,itemId);if(!item)throw new Error('Server AI job item not found');
  if(item.source_kind!=='upload')throw new Error('This server AI item does not accept an image upload');
  const bytes=new Uint8Array(await request.arrayBuffer());if(!bytes.length)throw new Error('Image upload was empty');if(bytes.length>6_000_000)throw new Error('Image upload exceeds 6 MB');
  const key=`jobs/${jobId}/${itemId}.jpg`;await env.GENREACTRIX_AI_IMAGES.put(key,bytes,{httpMetadata:{contentType:'image/jpeg'}});
  await env.GENREACTRIX_JOBS_DB.prepare('UPDATE ai_job_items SET source_ref=?,updated_at=? WHERE job_id=? AND id=?').bind(key,serverJobIso(),String(jobId),String(itemId)).run();
  return{ok:true,itemId,key,bytes:bytes.length};
}
async function sendServerJobMessages(env,jobId,itemIds){
  const ids=[...new Set((itemIds||[]).map(String).filter(Boolean))];
  for(let i=0;i<ids.length;i+=100){const batch=ids.slice(i,i+100).map(itemId=>({body:{jobId:String(jobId),itemId}}));await env.GENREACTRIX_AI_JOB_QUEUE.sendBatch(batch);}
}
async function startServerAiJob(env,jobId){
  if(!serverJobBindingsReady(env))throw new Error('Server AI jobs are not fully configured');
  await ensureServerJobSchema(env);const job=await serverJobRow(env,jobId);if(!job)throw new Error('Server AI job not found');
  if(SERVER_JOB_TERMINAL_STATES.has(String(job.state)))return{job:serverJobPublic(job),items:(await serverJobItems(env,jobId)).map(serverJobItemPublic)};
  const missing=await env.GENREACTRIX_JOBS_DB.prepare("SELECT id FROM ai_job_items WHERE job_id=? AND source_kind='upload' AND (source_ref IS NULL OR source_ref='') LIMIT 1").bind(String(jobId)).first();
  if(missing)throw new Error('Server AI job cannot start until every local image has been uploaded');
  const queued=await env.GENREACTRIX_JOBS_DB.prepare("SELECT id FROM ai_job_items WHERE job_id=? AND state='queued' ORDER BY order_index ASC").bind(String(jobId)).all(),ids=(queued?.results||[]).map(row=>row.id),startedAt=job.started_at||serverJobIso();
  await env.GENREACTRIX_JOBS_DB.prepare("UPDATE ai_jobs SET state='running',message=?,started_at=?,completed_at=NULL,updated_at=? WHERE id=?").bind(`Running on server · ${ids.length} queued`,startedAt,serverJobIso(),String(jobId)).run();
  if(ids.length)await sendServerJobMessages(env,jobId,ids);
  return{job:serverJobPublic(await refreshServerJobCounters(env,jobId)),items:(await serverJobItems(env,jobId)).map(serverJobItemPublic)};
}
async function controlServerAiJob(env,jobId,action){
  if(!serverJobBindingsReady(env))throw new Error('Server AI jobs are not fully configured');
  const db=env.GENREACTRIX_JOBS_DB,job=await serverJobRow(env,jobId);if(!job)throw new Error('Server AI job not found');const at=serverJobIso();
  if(action==='pause')await db.prepare("UPDATE ai_jobs SET state='paused',message='Paused after current server image',updated_at=? WHERE id=? AND state IN ('running','preparing')").bind(at,String(jobId)).run();
  else if(action==='resume'){
    const queued=await db.prepare("SELECT id FROM ai_job_items WHERE job_id=? AND state='queued' ORDER BY order_index ASC").bind(String(jobId)).all(),ids=(queued?.results||[]).map(row=>row.id);
    await db.prepare("UPDATE ai_jobs SET state='running',message='Resuming on server',completed_at=NULL,updated_at=? WHERE id=? AND state='paused'").bind(at,String(jobId)).run();if(ids.length)await sendServerJobMessages(env,jobId,ids);
  }else if(action==='cancel'){
    await db.prepare("UPDATE ai_jobs SET state='cancelled',message='Cancelled',completed_at=?,updated_at=? WHERE id=?").bind(at,at,String(jobId)).run();
    const uploads=await db.prepare("SELECT source_ref FROM ai_job_items WHERE job_id=? AND source_kind='upload' AND source_ref IS NOT NULL").bind(String(jobId)).all();
    await db.prepare("UPDATE ai_job_items SET state='cancelled',error='Cancelled by user',completed_at=?,updated_at=? WHERE job_id=? AND state='queued'").bind(at,at,String(jobId)).run();
    await Promise.all((uploads?.results||[]).map(row=>row.source_ref?env.GENREACTRIX_AI_IMAGES.delete(row.source_ref).catch(()=>{}):null));
  }else if(action==='retry-failed'){
    await db.prepare("UPDATE ai_job_items SET state='queued',error='',result_json=NULL,started_at=NULL,completed_at=NULL,harvested_at=NULL,updated_at=? WHERE job_id=? AND state='failed'").bind(at,String(jobId)).run();
    const queued=await db.prepare("SELECT id FROM ai_job_items WHERE job_id=? AND state='queued' ORDER BY order_index ASC").bind(String(jobId)).all(),ids=(queued?.results||[]).map(row=>row.id);
    await db.prepare("UPDATE ai_jobs SET state='running',message='Retrying failed server items',completed_at=NULL,updated_at=? WHERE id=?").bind(at,String(jobId)).run();if(ids.length)await sendServerJobMessages(env,jobId,ids);
  }else throw new Error('Unknown server AI job control action');
  return{job:serverJobPublic(await refreshServerJobCounters(env,jobId)),items:(await serverJobItems(env,jobId)).map(serverJobItemPublic)};
}
async function serverAiJobStatus(env,jobId){return{job:serverJobPublic(await refreshServerJobCounters(env,jobId)),items:(await serverJobItems(env,jobId)).map(serverJobItemPublic)};}
async function serverAiJobItemResult(env,jobId,itemId){
  const item=await serverJobItemRow(env,jobId,itemId);if(!item)throw new Error('Server AI job item not found');return{item:serverJobItemPublic(item),envelope:serverJobJsonParse(item.result_json,null)};
}
async function markServerAiJobItemHarvested(env,jobId,itemId){await ensureServerJobSchema(env);const item=await serverJobItemRow(env,jobId,itemId),at=serverJobIso();await env.GENREACTRIX_JOBS_DB.prepare('UPDATE ai_job_items SET harvested_at=?,updated_at=? WHERE job_id=? AND id=?').bind(at,at,String(jobId),String(itemId)).run();if(item?.state!=='failed'&&item?.source_kind==='upload'&&item?.source_ref&&env.GENREACTRIX_AI_IMAGES)await env.GENREACTRIX_AI_IMAGES.delete(item.source_ref).catch(()=>{});return{ok:true,harvestedAt:at};}
const freshServerRetryRecommended=error=>{const d=providerDiagnosticOf(error)||{};return d?.freshRequestRecommended===true&&String(d?.failureKind||'').toLowerCase()==='timeout';};
const serverJobGlobalFailure=message=>/unauthorized|analysis access is not configured|workers ai binding ai is not configured|rate limit|quota|capacity|gateway|provider unavailable/i.test(String(message||''));
async function runServerAiJobItem(env,jobId,itemId){
  await ensureServerJobSchema(env);const db=env.GENREACTRIX_JOBS_DB;let job=await serverJobRow(env,jobId),item=await serverJobItemRow(env,jobId,itemId);if(!job||!item)return;
  if(job.state==='paused'||job.state==='preparing')return;
  if(job.state==='cancelled'||SERVER_JOB_ITEM_TERMINAL_STATES.has(String(item.state)))return;
  const at=serverJobIso();await db.prepare("UPDATE ai_job_items SET state='processing',attempts=attempts+1,error='',started_at=COALESCE(started_at,?),updated_at=? WHERE job_id=? AND id=?").bind(at,at,String(jobId),String(itemId)).run();
  item=await serverJobItemRow(env,jobId,itemId);const request=serverJobJsonParse(item.request_json,null);if(!request)throw new Error('Server AI item request is corrupt');
  const specimen={...request,imageId:String(request.imageId||item.image_id)};if(item.source_kind==='url')specimen.imageUrl=item.source_ref;else specimen.imageObjectKey=item.source_ref;
  let result=null,errorMessage='',technicalRetry=null;
  try{
    const routed=providerRoutingEnv(env,specimen);
    try{result=await analyze(routed,specimen);}catch(firstError){if(!freshServerRetryRecommended(firstError))throw firstError;technicalRetry={at:serverJobIso(),type:'diagnostic-timeout-fresh-request',firstError:String(firstError?.message||firstError),providerDiagnostic:providerDiagnosticOf(firstError)||null};result=await analyze(providerRoutingEnv(env,specimen),specimen);if(result&&typeof result==='object'){const resultAny=/** @type {any} */(result),researchConfiguration=/** @type {any} */(resultAny.researchConfiguration||{});resultAny.researchConfiguration={...researchConfiguration,technicalRetryHistory:[...(Array.isArray(researchConfiguration.technicalRetryHistory)?researchConfiguration.technicalRetryHistory:[]),technicalRetry]};}}
    job=await serverJobRow(env,jobId);if(job?.state==='cancelled'){await db.prepare("UPDATE ai_job_items SET state='cancelled',error='Cancelled by user',result_json=NULL,completed_at=?,updated_at=? WHERE job_id=? AND id=?").bind(serverJobIso(),serverJobIso(),String(jobId),String(itemId)).run();return;}
    const envelope={schemaVersion:1,serverJobId:String(jobId),serverItemId:String(itemId),imageId:item.image_id,requested:Array.isArray(request.components)?request.components:[],startedAt:item.started_at||at,completedAt:serverJobIso(),technicalRetry,result};
    await db.prepare("UPDATE ai_job_items SET state='complete',error='',result_json=?,completed_at=?,updated_at=? WHERE job_id=? AND id=?").bind(JSON.stringify(envelope),envelope.completedAt,envelope.completedAt,String(jobId),String(itemId)).run();
  }catch(error){errorMessage=String(error?.message||error);const diagnostic=providerDiagnosticOf(error)||null,envelope={schemaVersion:1,serverJobId:String(jobId),serverItemId:String(itemId),imageId:item.image_id,requested:Array.isArray(request?.components)?request.components:[],startedAt:item.started_at||at,completedAt:serverJobIso(),error:errorMessage,providerDiagnostic:diagnostic};await db.prepare("UPDATE ai_job_items SET state='failed',error=?,result_json=?,completed_at=?,updated_at=? WHERE job_id=? AND id=?").bind(errorMessage,JSON.stringify(envelope),envelope.completedAt,envelope.completedAt,String(jobId),String(itemId)).run();if(serverJobGlobalFailure(errorMessage))await db.prepare("UPDATE ai_jobs SET state='paused',message=?,updated_at=? WHERE id=? AND state='running'").bind(`Paused after provider failure: ${errorMessage}`.slice(0,1800),serverJobIso(),String(jobId)).run();}
  finally{await refreshServerJobCounters(env,jobId);}
}
async function consumeServerAiJobQueue(batch,env){
  if(!serverJobBindingsReady(env)){for(const message of batch.messages)message.retry({delaySeconds:60});return;}
  for(const message of batch.messages){
    try{
      const body=message.body||{},job=await serverJobRow(env,body.jobId),item=await serverJobItemRow(env,body.jobId,body.itemId);
      if(!job||!item){message.ack();continue;}
      if(job.state==='paused'||job.state==='preparing'){message.ack();continue;}
      if(job.state==='cancelled'||SERVER_JOB_ITEM_TERMINAL_STATES.has(String(item.state))){message.ack();continue;}
      await runServerAiJobItem(env,body.jobId,body.itemId);message.ack();
    }catch(error){console.error('Server AI queue item failed unexpectedly',error);message.retry({delaySeconds:30});}
  }
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
        providerRouting:{primaryProvider:'mistral-direct',primaryModel:mistralDescriptionModelFor(env),secondaryProvider:'openai-via-cloudflare-ai-gateway',secondaryModel:fallbackModelFor(env),thirdProvider:'cloudflare-workers-ai-qwen',thirdProviderModel:qwenThemeModelFor(env),thirdProviderThinkingMode:'disabled',themeWholeRunPolicy:THEME_WHOLE_RUN_POLICY,providerCyclePolicy:THEME_PROVIDER_CYCLE_POLICY,providerCycleOrder:[...THEME_PROVIDER_CYCLE_ORDER],providerRoster:themeProviderRoster(env,env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL),gatewayId:aiGatewayIdFor(env),triggerCode:'3040',cooldownMinutes:15},
        themeAudit:{decisionStage:'theme-decision-audit',decisionProtocol:'selected-theme-decision-audit-v4-independent-per-theme-binary-unordered',reportingStage:'theme-reporting-diagnostic',reportingProtocol:'human-vote-reasoning-sidecar-v1',reportingEndpoint:'/api/genreactrix/theme-report-diagnostic',reportingDeferred:true},
        promptDiagnostics:{enabled:true,conceptCount:PRIMFUSION_REGISTRY.themeChoices.length,batchSize:PROMPT_DIAGNOSTIC_BATCH_SIZE,batchCount:PROMPT_DIAGNOSTIC_BATCH_COUNT,waveSizes:{five:PROMPT_DIAGNOSTIC_FIVE_WAVE_SIZE,three:PROMPT_DIAGNOSTIC_THREE_WAVE_SIZE},componentChunkSize:PROMPT_DIAGNOSTIC_COMPONENT_CHUNK_SIZE,executionModes:['fifteen','five','three','compare'],responseProtocol:'numbered-flex-v4'},
        serverJobs:{enabled:serverJobBindingsReady(env),bindings:serverJobBindings(env),protocol:'d1-r2-queue-v1',queueConsumerConcurrency:1,clientOwnsCanonicalRecords:true}
      });
    }

    try{
      if (url.pathname === '/api/genreactrix/jobs' && request.method === 'POST'){
        if(!env.ANALYSIS_KEY)return json({ok:false,error:'Analysis access is not configured'},{status:503});
        if(request.headers.get('x-analysis-key')!==env.ANALYSIS_KEY)return json({ok:false,error:'Unauthorized'},{status:401});
        const body=await request.json().catch(()=>null);if(!body)return json({ok:false,error:'JSON body required'},{status:400});
        return json({ok:true,result:await createServerAiJob(env,body)});
      }
      const serverJobPath=url.pathname.match(/^\/api\/genreactrix\/jobs\/([^/]+)(?:\/items\/([^/]+)(?:\/image|\/harvest)?)?(?:\/start|\/control)?$/);
      if(serverJobPath){
        if(!env.ANALYSIS_KEY)return json({ok:false,error:'Analysis access is not configured'},{status:503});
        if(request.headers.get('x-analysis-key')!==env.ANALYSIS_KEY)return json({ok:false,error:'Unauthorized'},{status:401});
        const jobId=decodeURIComponent(serverJobPath[1]),itemId=serverJobPath[2]?decodeURIComponent(serverJobPath[2]):null;
        if(itemId&&url.pathname.endsWith('/image')&&request.method==='POST')return json({ok:true,result:await uploadServerAiJobImage(env,jobId,itemId,request)});
        if(itemId&&url.pathname.endsWith('/harvest')&&request.method==='POST')return json({ok:true,result:await markServerAiJobItemHarvested(env,jobId,itemId)});
        if(itemId&&request.method==='GET')return json({ok:true,result:await serverAiJobItemResult(env,jobId,itemId)});
        if(url.pathname.endsWith('/start')&&request.method==='POST')return json({ok:true,result:await startServerAiJob(env,jobId)});
        if(url.pathname.endsWith('/control')&&request.method==='POST'){const body=await request.json().catch(()=>({}));return json({ok:true,result:await controlServerAiJob(env,jobId,String(body?.action||''))});}
        if(request.method==='GET')return json({ok:true,result:await serverAiJobStatus(env,jobId)});
      }

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
        let upstream;
        try{upstream=await fetchImageResponse(imageUrl)}catch(error){return json({ok:false,error:String(error?.message||error)},{status:502})}
        const contentType = normalizedContentType(upstream);
        const bytes = new Uint8Array(await upstream.arrayBuffer());
        if (!bytes.length) return json({ok:false,error:'Image was empty'},{status:422});
        if (bytes.length > 6_000_000) return json({ok:false,error:'Image exceeds 6 MB'},{status:413});
        return new Response(bytes,{status:200,headers:{...cors,'content-type':contentType,'cache-control':'no-store','content-length':String(bytes.length)}});
      }

      if (request.method === 'POST' && url.pathname === '/api/genreactrix/provider-readiness'){
        if (!env.ANALYSIS_KEY){
          return json({ok:false,error:'Analysis access is not configured'},{status:503});
        }
        if (request.headers.get('x-analysis-key') !== env.ANALYSIS_KEY){
          return json({ok:false,error:'Unauthorized'},{status:401});
        }
        return json({ok:true,result:await providerReadinessProbe(env)});
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
        const routedEnv=providerRoutingEnv(env,body);
        return json({ok:true,result:await runPromptDiagnosticBatch(routedEnv,body),providerRouting:providerRoutingSnapshot(routedEnv,env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL)});
      }

      if (request.method === 'POST' && url.pathname === '/api/genreactrix/ama'){
        if (!env.ANALYSIS_KEY){
          return json({ok:false,error:'Analysis access is not configured'},{status:503});
        }
        if (request.headers.get('x-analysis-key') !== env.ANALYSIS_KEY){
          return json({ok:false,error:'Unauthorized'},{status:401});
        }
        const body = await request.json().catch(()=>null);
        if (!body) return json({ok:false,error:'JSON body required'},{status:400});
        const mode=String(body.mode||'run');
        let result;
        const routedEnv=providerRoutingEnv(env,body);
        if(mode==='followup')result=await runAmaFollowup(routedEnv,body);
        else if(mode==='visual')result=await runAmaVisualStep(routedEnv,body);
        else if(mode==='candidates')result=await runAmaCandidateStep(routedEnv,body);
        else if(mode==='question-block')result=await runAmaQuestionStep(routedEnv,body);
        else result=await runAma(routedEnv,body);
        return json({ok:true,result,providerRouting:providerRoutingSnapshot(routedEnv,env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL)});
      }

      if (request.method === 'POST' && url.pathname === '/api/genreactrix/theme-report-diagnostic'){
        if (!env.ANALYSIS_KEY){
          return json({ok:false,error:'Analysis access is not configured'},{status:503});
        }
        if (request.headers.get('x-analysis-key') !== env.ANALYSIS_KEY){
          return json({ok:false,error:'Unauthorized'},{status:401});
        }
        const body = await request.json().catch(()=>null);
        if (!body) return json({ok:false,error:'JSON body required'},{status:400});
        const routedEnv=providerRoutingEnv(env,body);
        return json({ok:true,result:await runThemeReportingSidecarRequest(routedEnv,body),providerRouting:providerRoutingSnapshot(routedEnv,env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL)});
      }

      if (request.method === 'POST' && url.pathname === '/api/genreactrix/analyze-stream'){
        if (!env.ANALYSIS_KEY){
          return json({ok:false,error:'Analysis access is not configured'},{status:503});
        }
        if (request.headers.get('x-analysis-key') !== env.ANALYSIS_KEY){
          return json({ok:false,error:'Unauthorized'},{status:401});
        }

        const body = await request.json().catch(()=>null);
        if (!body) return json({ok:false,error:'JSON body required'},{status:400});

        const routedEnv=providerRoutingEnv(env,body);
        return analyzeProgressStreamResponse(routedEnv,body);
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

        const routedEnv=providerRoutingEnv(env,body);
        return json({ok:true,result:await analyze(routedEnv,body),providerRouting:providerRoutingSnapshot(routedEnv,env.WORKERS_AI_VISION_MODEL||DEFAULT_MODEL)});
      }
    }catch(error){
      const body = {ok:false,error:error?.message || String(error)};
      const diagnostic = providerDiagnosticOf(error);
      if (diagnostic) body.providerDiagnostic = diagnostic;
      return json(body,{status:500});
    }

    return json({ok:false,error:'Not found'},{status:404});
  },
  async queue(batch,env={},ctx){
    await consumeServerAiJobQueue(batch,env);
  }
};

