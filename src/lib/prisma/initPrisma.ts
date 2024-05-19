import { spawn } from "child_process";
import handleProcessEvents from "../log/handleProcessEvents";
import logWithCommand from "../log/logWithCommand";
import logWithSuccess from "../log/logWithSuccess";
import makeCommand from "../makeCommand";

const TYPE = "prisma";

export default async function initPrisma() {
  const rawCommand = `npx prisma init`;
  logWithCommand("Initializing Prisma", TYPE, rawCommand);
  const commandArgs = makeCommand(rawCommand);
  const initPrisma = spawn(...commandArgs);
  await handleProcessEvents(initPrisma, TYPE);
  logWithSuccess("Prisma initialized", TYPE);
}
