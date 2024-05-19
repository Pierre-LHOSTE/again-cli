import { dependencies as allDependencies } from "../../config/dependencies";
import { DependencyType } from "./dependency";

const SPECIAL_DEPS = ["storybook"];

export default function getDependenciesListsObject(
  dependencies: DependencyType[]
) {
  const dependenciesObj: DependencyType[] = Object.values(allDependencies)
    .flatMap((dependencyArray) => dependencyArray)
    .filter(
      (dep: any) =>
        dependencies.includes(dep.value) && !SPECIAL_DEPS.includes(dep.value)
    );
  const devDependencies = dependenciesObj
    .filter((dep) => dep.dev)
    .map((dep) => dep.value);
  const normalDependencies = dependenciesObj
    .filter((dep) => !dep.dev)
    .map((dep) => dep.value);
  const typesDependencies = dependenciesObj
    .filter((dep) => dep.needType)
    .map((dep) => `@types/${dep.value}`);

  return {
    devDependencies,
    normalDependencies,
    typesDependencies,
  };
}
