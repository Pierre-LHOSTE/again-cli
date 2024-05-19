import { Project } from "ts-morph";
import { gitignore } from "../config/gitignore";
import { logD, logN } from "./log/log";
import logWithIcon from "./log/logWithIcon";
import logWithSuccess from "./log/logWithSuccess";

const TYPE = "git";

export default function updateGitignore(project: Project) {
  try {
    logWithIcon("Updating .gitignore file …", TYPE);
    logN("Finding .gitignore file …", TYPE);
    const sourceFile = project.addSourceFileAtPath("./.gitignore");
    if (!sourceFile) throw new Error("File .gitignore not found");
    logD();
    sourceFile.addStatements(
      gitignore.map((category) => {
        logN(`- Adding ${category.category}\n`, TYPE);
        return `\n# ${category.category}\n${category.value
          .map((value) => `${value}\n`)
          .join("")}`;
      })
    );
    logN("Saving .gitignore file …", TYPE);
    sourceFile.saveSync();
    logD();
    logWithSuccess("File .gitignore updated", TYPE);
  } catch (error) {
    console.error("Error updating .gitignore file", error);
  }
}
