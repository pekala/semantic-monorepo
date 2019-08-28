import path from "path";
import execa from "execa";
import getPkgName from "./get-pkg-name";
import { Increment } from "types";
import pkgJSON from "../package.json";

export default async function bumpPkgVersion(
  pkgDir: string,
  increment: Increment
) {
  if (increment === false) {
    return;
  }
  const pkgName = await getPkgName(pkgDir);
  const cwd = path.resolve(process.env.GITHUB_WORKSPACE, pkgDir);
  await execa("yarn", ["version", `--${increment}`], {
    cwd,
    env: {
      YARN_VERSION_GIT_MESSAGE: `chore(release): ${pkgName}@v%s`,
      YARN_VERSION_TAG_PREFIX: `${pkgName}@v`
    }
  });
  await execa("yarn", ["publish", `--non-interactive`], { cwd });
  await execa("git", [
    "push",
    "--follow-tags",
    `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/${pkgJSON.repository}.git`
  ]);
  const { stdout: tag } = await execa("git", [
    "describe",
    "--abbrev=0",
    "--tags"
  ]);
  return tag;
}
