function join(items) {
  return items.length === 2 ? items.join(" et ") : `${items.slice(0, -1).join(", ")} et ${items.at(-1)}`;
}

export function generateDreamScenes(selections) {
  const choices = selections.choices ?? [];
  const [first, second, third] = choices;
  const firstAssociations = first?.associations ?? ["une porte sans mur", "un tapis qui flotte"];
  const secondAssociations = second?.associations ?? ["un nuage plié", "un plafond de sable"];
  const thirdAssociations = third?.associations ?? ["une tasse qui écoute", "une ombre en papier"];
  const subject = join(choices.map((choice) => choice.emoji));

  return [
    `${subject} traversaient la pièce sur ${firstAssociations[0]}. Au plafond, ${secondAssociations[0]} apprenait à nager pendant que ${thirdAssociations[0]} comptait les ombres.`,
    `Dans un ascenseur de brume, ${thirdAssociations[1]} portait ${subject}. ${firstAssociations[1]} ouvrait ses yeux au son de ${secondAssociations[1]}.`,
    `${secondAssociations[0]} servait le thé à ${subject}. Derrière la fenêtre, ${firstAssociations[1]} devenait lentement ${thirdAssociations[0]}.`,
  ];
}
