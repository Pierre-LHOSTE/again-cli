import c from "chalk";
import path from "path";
import { PromptObject } from "prompts";
import { DependencyType, dependencies } from "./dependencies";
import { validateNpmName } from "./validate-pkg";

export const nameQuestion: PromptObject = {
  type: "text",
  name: "name",
  message: c.greenBright("󰓹  ") + c.reset.white("Project name ?"),
  initial: "my-again-app",
  validate: (name) => {
    const validation = validateNpmName(path.basename(path.resolve(name)));
    if (validation.valid) {
      return true;
    }
    return "Invalid project name: " + validation.problems[0];
  },
};

export const newDirQuestion: PromptObject = {
  type: "toggle",
  name: "dir",
  message: c.cyanBright("  ") + c.reset.white("New directory ?"),
  initial: true,
  active: "Oui",
  inactive: "Non",
};

export const dependenciesQuestion: PromptObject = {
  type: "multiselect",
  name: "dependencies",
  message: c.redBright("  ") + c.reset.white("Select dependencies"),
  choices: [
    ...dependenciesMap(dependencies.frontend, "Frontend"),
    ...dependenciesMap(dependencies.backend, "Backend"),
    ...dependenciesMap(dependencies.tools, "Tools"),
  ],
  optionsPerPage: 20,
  hint: "",
  instructions: false,
};

function dependenciesMap(dependencies: DependencyType[], title: string) {
  const deps = dependencies.map((dep: DependencyType, i: number) => ({
    title:
      i === dependencies.length - 1 ? " " + dep.name + "\n" : " " + dep.name,
    value: dep.value,
    selected: false,
  }));

  return [
    {
      title: "  " + title,
      value: "",
    },
    ...deps,
  ];
}
