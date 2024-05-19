import prompts from "prompts";
import { nameQuestion, newDirQuestion } from "../config/questions";

export default async function getProjectPath() {
  let projectPath: string = "";
  const { dir } = await prompts(newDirQuestion);
  if (typeof dir !== "boolean") process.exit();
  if (dir) {
    const { name } = await prompts(nameQuestion);
    if (!name) process.exit();
    projectPath = name.trim();
    if (!projectPath) process.exit();
    if (dir) {
      projectPath = `./${projectPath}`;
    }
  } else {
    projectPath = ".";
  }
  if (typeof projectPath !== "string") {
    process.exit();
  }
  return projectPath;
}
