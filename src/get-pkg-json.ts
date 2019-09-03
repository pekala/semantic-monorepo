import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

export default async function getPkgJSON(pkgDir: string) {
  const pkgJSONPath = path.resolve(
    process.env.GITHUB_WORKSPACE,
    pkgDir,
    "package.json"
  );
  const rawJSON = await readFile(pkgJSONPath, "utf8");
  return JSON.parse(rawJSON);
}
