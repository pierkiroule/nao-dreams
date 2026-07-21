const effects = {
  "🐋": ["Une ombre immense passe sous l'eau.", "La porte s'est entrouverte. Une baleine chantait de l'autre côté."],
  "🔥": ["La mer reflète une lumière rouge.", "La mer n'a pas brûlé. Elle s'est souvenue du soleil."],
  "👁️": ["Quelque chose observe derrière la porte.", "Dans l'entrebâillement, un œil a cligné — puis la nuit a retenu son souffle."],
  "🦋": ["La porte commence à respirer.", "Ses gonds battent comme des ailes, et l'horizon change imperceptiblement."],
  "🚪": ["Une seconde porte apparaît dans l'écume.", "Elle ne mène nulle part encore, mais son seuil est déjà tiède."],
  "🌀": ["L'eau dessine un cercle autour de la porte.", "Le cercle tourne doucement, comme s'il cherchait un souvenir."],
};
const generic = ["Le rêve change de texture.", "Un détail nouveau tremble à la lisière de la scène."];
export function getDreamEffect(emoji) { return effects[emoji.symbol] ?? [`${emoji.symbol} ${emoji.label.toLowerCase()} dans le paysage.`, generic[1]]; }
export function initialScene() { return "Cette nuit, Noa a rêvé d'une porte au milieu de la mer. Quelque chose attend derrière."; }
export function nextScene(effect) { return `${effect} Le rêve reste incomplet, comme s'il attendait le prochain regard.`; }
export function selectIntuitionTarget(previousContributions) { return previousContributions.find((contribution) => contribution.isSeed) ?? previousContributions[0] ?? null; }
export function buildIntuitionChoices(target, constellation) { const seedChoice = { symbol: target.emoji, label: target.label }; const decoys = constellation.emojis.filter((emoji) => emoji.symbol !== target.emoji).slice(0, 2); return [seedChoice, ...decoys].sort((left, right) => left.symbol.localeCompare(right.symbol)); }
