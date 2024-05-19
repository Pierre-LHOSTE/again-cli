import c from "chalk";

export const dependencies = {
  frontend: [
    {
      name: generateName("Ant-design", "󰜌", c.blue),
      value: "antd",
      dev: false,
      needType: false,
    },
    {
      name: generateName("colord", "󰆥", c.yellow),
      value: "colord",
      dev: false,
      needType: false,
    },
    {
      name: generateName("Dart-sass", "", c.magenta),
      value: "sass",
      dev: false,
      needType: false,
    },
    {
      name: generateName("Tabler-icons", "", c.blue),
      value: "@tabler/icons-react",
      dev: false,
      needType: false,
    },
    {
      name: generateName("react-beautiful-dnd || dnd-kit", "󱟱", c.white),
      value: "react-beautiful-dnd",
      dev: false,
      needType: true,
    },
    {
      name: generateName("OverlayScrollbars", "", c.blueBright),
      value: "overlayscrollbars-react",
      dev: false,
      needType: false,
    },
  ],
  backend: [
    {
      name: generateName("Prisma", "", c.cyan),
      value: "prisma",
      dev: true,
      needType: false,
    },
    {
      name: generateName("NextAuth.js", "", c.blue),
      value: "next-auth",
      dev: false,
      needType: false,
    },
    {
      name: generateName("Bcrypt.js", "󰢶", c.yellow),
      value: "bcryptjs",
      dev: false,
      needType: true,
    },
    {
      name: generateName("Zod", "󰮊", c.blue),
      value: "zod",
      dev: false,
      needType: false,
    },
    {
      name: generateName("Antd Zod validation", "󰮋", c.redBright),
      value: "antd-zod",
      dev: false,
      needType: false,
    },
  ],
  tools: [
    {
      name: generateName("Storybook", "", c.magenta),
      value: "storybook",
      dev: true,
      needType: false,
    },
    {
      name: generateName("Vitest", "󰠠", c.yellow),
      value: "vitest",
      dev: true,
      needType: false,
    },
  ],
};

function generateName(name: string, icon: string, color: c.Chalk) {
  return " " + color(icon) + "  " + name;
}
