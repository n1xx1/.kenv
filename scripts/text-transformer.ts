// Name: Text Transformer

import "@johnlindquist/kit";

async function main() {
  const transformerKey = await arg<keyof typeof transformers>(
    "Select a transformation",
    [
      { name: "lowercase", value: "lowerCase" },
      { name: "UPPERCASE", value: "upperCase" },
      { name: "camelCase", value: "camelCase" },
      { name: "snake_case", value: "snakeCase" },
      { name: "Upper Camel Case With Space", value: "camelSpaceCase" },
      { name: "kebab-case", value: "kebabCase" },
      { name: "PascalCase", value: "pascalCase" },
      { name: "rEVERSEcASE", value: "reverseCase" },
    ]
  );

  await keyboard.config({ autoDelayMs: 0.1 });
  await replaceText((contents) => {
    const transformer = transformers[transformerKey];
    const lines = contents.split(/([\n\r]+)/g);
    for (let i = 0; i < lines.length; i += 2) {
      lines[i] = transformer(lines[i]);
    }
    return lines.join("");
  });
}

async function withRestoreHistory(fn: () => Promise<void>) {
  const saved = await clipboard.readText();
  try {
    await fn();
  } catch (e) {
    throw e;
  } finally {
    if (saved) {
      await clipboard.writeText(saved);
    } else {
      await clipboard.clear();
    }
  }
}

async function replaceText(transformer: (contents: string) => string) {
  withRestoreHistory(async () => {
    await keyboard.pressKey(Key.LeftControl, Key.C);
    await keyboard.releaseKey(Key.LeftControl, Key.C);

    let data = await clipboard.readText();
    data = transformer(data);
    await clipboard.writeText(data);

    await keyboard.pressKey(Key.LeftControl, Key.V);
    await keyboard.releaseKey(Key.LeftControl, Key.V);
  });
}

function getStringArray(text: string): string[] {
  const textGroupsMatcher = /([^\s\-_A-Z]+)|([A-Z]+[^\s\-_A-Z]*)/g;
  return text.match(textGroupsMatcher) || [];
}

const transformers = {
  kebabCase: (input: string): string => {
    return getStringArray(input).join("-").toLowerCase();
  },
  snakeCase: (input: string): string => {
    return getStringArray(input).join("_").toLowerCase();
  },
  upperCase: (input: string): string => {
    return input.toUpperCase();
  },
  lowerCase: (input: string): string => {
    return input.toLowerCase();
  },
  reverseCase: (input: string): string => {
    return Array.from(input)
      .map((char) =>
        char.toLowerCase() === char ? char.toUpperCase() : char.toLowerCase()
      )
      .join();
  },
  camelCase: (input: string) => {
    const pascalInput = transformers.pascalCase(input);
    return pascalInput.charAt(0).toLowerCase() + pascalInput.slice(1);
  },
  camelSpaceCase: (input: string) => {
    return getStringArray(input)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  },
  pascalCase: (input: string) => {
    return getStringArray(input)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  },
};

await main();
