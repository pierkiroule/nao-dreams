export const futureDream = {
  title: "La ville qui rêvait sous les eaux",
  symbols: ["🌊", "🚪", "🌙", "🪽", "🪞"],
  story: "Dans une ville endormie sous les eaux, une porte veillait au fond d'une avenue de nacre. Chaque nuit, la lune y déposait une aile de lumière. Un miroir gardait le souvenir d'un monde encore à venir, et la mer attendait que quelqu'un ose l'écouter.",
};
export const riddles = [
  { text:"Je traverse le monde sans jamais marcher. Que suis-je ?", choices:["🌊","🚪","🪨"], answer:"🌊" },
  { text:"Beaucoup me cherchent. Peu me trouvent. Que suis-je ?", choices:["🚪","🌙","🧭"], answer:"🚪" },
  { text:"Je veille sans fermer les yeux. Que suis-je ?", choices:["🌙","🔥","🪞"], answer:"🌙" },
  { text:"Je porte le ciel sans avoir de bras. Que suis-je ?", choices:["🪽","🌳","🎈"], answer:"🪽" },
  { text:"Je montre un autre monde sans y entrer. Que suis-je ?", choices:["🪞","🌊","🔔"], answer:"🪞" },
  { text:"Je garde une lumière quand tout devient calme. Que suis-je ?", choices:["🕯️","🚪","🌫️"], answer:"🕯️" },
  { text:"Je reviens toujours, sans reprendre la même forme. Que suis-je ?", choices:["🌙","🌀","🪨"], answer:"🌙" },
];
export function riddlesForPasser(index) { return [riddles[(index * 2) % riddles.length], riddles[(index * 2 + 1) % riddles.length]]; }
