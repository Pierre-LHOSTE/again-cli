export default function makeCommand(command: string): [string, string[]] {
  const mainCommand = command.split(" ")[0] as string;
  const args = command.split(" ").slice(1);
  return [mainCommand, args];
}
