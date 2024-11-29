// Name: Notion

import "@johnlindquist/kit";

const link = await arg("Select an option", [
  {
    name: "Personale",
    value: "https://www.notion.so/n1xx1/5f625c50f1864d6889cb5ca25d16fa31",
  },
  {
    name: "SSWS",
    value:
      "https://www.notion.so/2b00f043e6e94a22afc8c968f3ae3121?v=3a86e21087da4407ba5100a8806467a0",
  },
  {
    name: "Stolen Fate",
    value:
      "https://www.notion.so/n1xx1/Stolen-Fate-4250e4c42cdd444696fe3bcfb8e64962",
  },
  {
    name: "Lovvini",
    value: "https://www.notion.so/Lovvini-Hub-7a678daf8afb4768ae3897fd392a902e",
  },
]);

await browse(link);
