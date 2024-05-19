import prompts from "prompts";
import { dependenciesQuestion } from "../../config/questions";

export default async function getDependencies() {
  let { dependencies } = await prompts(dependenciesQuestion);
  if (dependencies) {
    dependencies = dependencies.filter((dep: string) => dep !== "");
  } else {
    process.exit();
  }
  return dependencies;
}
