// Name: D2PT

import "@johnlindquist/kit";

const heroData: Record<string, HeroData> = await (
  await fetch(
    "https://raw.githubusercontent.com/odota/dotaconstants/refs/heads/master/build/heroes.json"
  )
).json();

type HeroData = {
  icon: string;
  primary_attr: "str" | "int" | "agi" | "all";
  localized_name: string;
};

const heroes = Object.values(heroData).sort((a, b) =>
  a.localized_name.localeCompare(b.localized_name)
);

const hero = await arg(
  "Select an hero",
  heroes.map((h) => {
    return {
      name: h.localized_name,
      value: h.localized_name,
      html: `
<img height="32" width="32" src="https://media.steampowered.com${h.icon}">
<div class="flex-1 pl-1">${h.localized_name}</div>`,
    };
  })
);

browse(`https://dota2protracker.com/hero/${encodeURIComponent(hero)}`);
