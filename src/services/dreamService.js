function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function join(items) {
  return items.length === 2 ? items.join(" et ") : `${items.slice(0, -1).join(", ")} et ${items.at(-1)}`;
}

export async function generateDreamBubble(selections) {
  const choices = selections.choices ?? [];
  const [first, second, third] = choices;
  const firstAssociation = pick(first?.associations ?? ["une porte sans mur"]);
  const secondAssociation = pick(second?.associations ?? ["un nuage plié"]);
  const thirdAssociation = pick(third?.associations ?? ["une tasse qui écoute"]);
  const subject = join(choices.map((choice) => choice.emoji));

  return `${subject} traversaient la pièce sur ${firstAssociation}. Au plafond, ${secondAssociation} apprenait à nager pendant que ${thirdAssociation} comptait les ombres.`;
}
