const resonances = {
  "🌊": [
    ["Polynésie", "Dans de nombreuses traditions polynésiennes, l’océan relie les îles, les ancêtres et les voyages de navigation."],
    ["Grèce antique", "Océanos y figure comme le grand fleuve qui entoure le monde : une frontière mouvante entre les terres connues et l’ailleurs."],
    ["Japon", "La grande vague est aussi une image du changement : puissante, passagère, elle rappelle que tout mouvement finit par se transformer."],
  ],
  "🌲": [
    ["Europe celtique", "Les bosquets sacrés étaient des lieux de passage et de parole, où le vivant pouvait être regardé comme un allié."],
    ["Japon", "Dans le shinto, certains arbres anciens sont entourés d’une corde sacrée : ils signalent la présence du kami, l’esprit du lieu."],
    ["Scandinavie", "L’arbre-monde Yggdrasil relie les différents plans de l’existence dans les récits nordiques."],
  ],
  "🌙": [
    ["Monde islamique", "Le croissant lunaire rythme les mois du calendrier hégirien et les temps de jeûne, de fête et de rassemblement."],
    ["Grèce antique", "Séléné traverse le ciel dans son char ; la lune devient une présence qui éclaire les seuils de la nuit."],
    ["Chine", "La fête de la Mi-Automne rassemble les familles sous la pleine lune et fait vivre le récit de Chang’e."],
  ],
  "🔥": [
    ["Inde", "Lors de Diwali, les lampes allumées célèbrent la lumière, l’accueil et la victoire du discernement sur l’obscurité."],
    ["Grèce antique", "Prométhée offre le feu aux humains : le mythe associe sa flamme à la technique, au savoir et à la responsabilité."],
    ["Japon", "Les feux de certains matsuri accompagnent purification, protection et passage d’une saison à l’autre."],
  ],
  "🌷": [
    ["Perse", "Dans la poésie persane, le jardin est un espace de beauté, de rencontre et de contemplation, souvent traversé par le parfum des fleurs."],
    ["Mexique", "Les fleurs de cempasúchil du Día de Muertos tracent, par leur couleur et leur odeur, un chemin symbolique pour les défunts."],
    ["Japon", "Le hanami invite à contempler les cerisiers en fleurs et la beauté brève des choses."],
  ],
  "🕊️": [
    ["Mésopotamie", "La colombe est liée à Inanna-Ishtar, déesse de l’amour et de la souveraineté, dans l’imaginaire ancien du Proche-Orient."],
    ["Tradition biblique", "La colombe portant un rameau à Noé devient une image de terre retrouvée, de paix et de recommencement."],
    ["Antiquité grecque", "Les oiseaux accompagnent les messages divins ; leur vol pouvait être observé comme un langage à interpréter."],
  ],
  "🫧": [
    ["Japon", "Le savon et l’eau des rites de purification rappellent que se délester peut préparer une nouvelle rencontre avec le monde."],
    ["Grèce antique", "Les sources et les bains sont associés aux nymphes : l’eau vive devient un seuil entre soin, nature et récit."],
    ["Europe", "La bulle de savon a souvent servi de vanité poétique : sa fragilité rend visible la préciosité de l’instant."],
  ],
  "🏠": [
    ["Rome antique", "Le foyer domestique était honoré par les Lares et les Pénates, gardiens symboliques de la maison et de ses réserves."],
    ["Japon", "Le genkan, seuil de la maison, marque le passage entre dehors et dedans : on y retire ses chaussures avant d’entrer."],
    ["Peuples autochtones d’Amérique du Nord", "Selon les nations et les époques, la maison longue a pu incarner une parenté élargie et une vie collective."],
  ],
  "✨": [
    ["Australie aborigène", "Dans de nombreuses traditions aborigènes, le ciel nocturne garde la mémoire de récits du Temps du Rêve, transmis selon les communautés."],
    ["Égypte ancienne", "Les étoiles participent au voyage nocturne du soleil et à l’ordre cosmique que les rites cherchent à renouveler."],
    ["Maya", "L’observation du ciel guidait calendriers et cérémonies ; les astres étaient liés à des récits et à l’organisation du temps."],
  ],
  "💗": [
    ["Égypte ancienne", "Le cœur était pesé dans l’au-delà : il portait la mémoire des actes et la justesse d’une vie."],
    ["Soufisme", "La poésie mystique décrit volontiers le cœur comme un lieu de transformation, d’écoute et d’amour spirituel."],
    ["Europe médiévale", "Le cœur devient progressivement un signe visuel d’affection dans l’art et la littérature courtoise."],
  ],
  "🪶": [
    ["Égypte ancienne", "La plume de Maât sert à peser le cœur : elle évoque vérité, équilibre et juste parole."],
    ["Peuples autochtones des Amériques", "Dans plusieurs cultures, les plumes peuvent avoir des usages cérémoniels précis et des significations propres à chaque nation."],
    ["Grèce antique", "Les plumes rappellent les ailes d’Hermès et d’Icare : messages rapides, élévation et prudence face au désir de voler."],
  ],
  "🦁": [
    ["Inde", "Narasimha, forme de Vishnou à tête de lion, incarne une protection qui surgit lorsque l’ordre du monde est menacé."],
    ["Mésopotamie", "Le lion accompagne souvent les images de puissance royale et de la déesse Ishtar dans les arts anciens."],
    ["Chine", "Les lions gardiens, placés devant certains édifices, forment un seuil symbolique de protection."],
  ],
  "🌫️": [
    ["Irlande", "Les brumes des récits celtiques signalent parfois l’approche de l’Autre Monde, un espace voisin mais invisible."],
    ["Japon", "Dans les contes, la brume transforme les paysages familiers et ouvre la voie aux yōkai et aux apparitions."],
    ["Grèce antique", "Le brouillard peut protéger, dissimuler ou dérouter les héros : il fait hésiter la frontière entre vision et illusion."],
  ],
  "🐋": [
    ["Peuples māori", "Les récits de Paikea racontent une arrivée sur le dos d’une baleine et lient l’animal à l’ascendance et à la traversée."],
    ["Tradition biblique", "L’histoire de Jonas fait de la grande créature marine un temps d’épreuve, de retrait et de retour."],
    ["Inuit", "Dans plusieurs récits inuit, les animaux marins participent à des relations de respect, de subsistance et de réciprocité."],
  ],
  "🏮": [
    ["Japon", "Pendant Obon, les lanternes aident symboliquement à accueillir puis à raccompagner les esprits des ancêtres."],
    ["Chine", "La fête des Lanternes clôt les célébrations du Nouvel An lunaire par des lumières, énigmes et rassemblements."],
    ["Thaïlande", "Lors de Yi Peng, des lanternes lumineuses peuvent accompagner des vœux et le geste de laisser partir ce qui pèse."],
  ],
  "🗝️": [
    ["Rome antique", "Janus, dieu des commencements et des seuils, est souvent associé aux portes et aux passages entre deux temps."],
    ["Grèce antique", "Hécate veille aux croisements et aux seuils : la clé devient l’image d’un accès aux mondes cachés."],
    ["Europe médiévale", "Les clés confiées à saint Pierre représentent la garde symbolique des portes du paradis."],
  ],
  "🦋": [
    ["Grèce antique", "Psyché signifie à la fois papillon et âme : l’insecte devient une image de métamorphose intérieure."],
    ["Mexique", "Les papillons monarques arrivent au moment du Día de Muertos ; certaines communautés y reconnaissent un signe lié au retour des ancêtres."],
    ["Japon", "Le papillon apparaît dans les arts et récits comme une figure de légèreté, de transformation et parfois de visite des âmes."],
  ],
};

function signature(value = "") {
  return [...String(value)].reduce((total, character) => total + character.codePointAt(0), 0);
}

export function getCulturalResonances(choices = []) {
  return choices.slice(0, 3).map((choice, index) => {
    const references = resonances[choice.emoji];
    if (!references) return null;
    const [tradition, text] = references[(signature(choice.id) + index) % references.length];
    return { emoji: choice.emoji, label: choice.text ?? choice.label, tradition, text };
  }).filter(Boolean);
}

export const culturalResonanceSymbols = Object.keys(resonances);
