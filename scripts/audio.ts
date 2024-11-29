// Name: Audio Settings

import "@johnlindquist/kit";
import { VBANClient } from "../lib/vban";

type Config = {
  musicOutput: boolean;
};

const configPresetIndex: Record<keyof Config, number> = {
  musicOutput: 2,
};

const scriptDb = await db<Config>({
  musicOutput: false,
});

const configText = (name: string, key: keyof Config) => {
  const action = scriptDb[key] ? "DISABLE" : "ENABLE";
  return {
    name: `${action} ${name}`,
    html: `<div><b>${action}</b> ${name}</div>`,
    value: key,
  };
};

let configKey = await arg<keyof Config>("Select an option", [
  configText("Music Output", "musicOutput"),
]);

const vban = new VBANClient("127.0.0.1", 6980);

scriptDb[configKey] = !scriptDb[configKey];
const index = configPresetIndex[configKey];
if (scriptDb[configKey]) {
  vban.text("Command1", `PresetPatch[${index}].Mute = 0`);
} else {
  vban.text("Command1", `PresetPatch[${index}].Mute = 1`);
}

await scriptDb.write();
process.exit();
