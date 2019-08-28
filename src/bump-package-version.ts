import path from "path";
import fs from "fs";
import { promisify } from "util";
import execa from "execa";
import getPkgName from "./get-pkg-name";
import { Increment } from "types";

const writeFile = promisify(fs.writeFile);

export default async function bumpPkgVersion(
  pkgDir: string,
  increment: Increment
) {
  if (increment === false) {
    return;
  }
  const pkgName = await getPkgName(pkgDir);
  const cwd = path.resolve(process.env.GITHUB_WORKSPACE, pkgDir);

  await writeFile(
    path.resolve(cwd, ".npmrc"),
    `//npm.pkg.github.com/:_authToken=${process.env.GITHUB_TOKEN}`
  );

  await execa("yarn", ["version", `--${increment}`], {
    cwd,
    env: {
      YARN_VERSION_GIT_MESSAGE: `chore(release): ${pkgName}@v%s`,
      YARN_VERSION_TAG_PREFIX: `${pkgName}@v`,
      GIT_AUTHOR_NAME: "Semantic Monorepo",
      GIT_COMMITTER_NAME: process.env.GITHUB_ACTOR,
      GIT_AUTHOR_EMAIL: "dev@pleo.io",
      GIT_COMMITTER_EMAIL: "dev@pleo.io"
    }
  });
  await execa("yarn", ["publish", `--non-interactive`], { cwd });
  await execa("git", [
    "push",
    "--follow-tags",
    `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`,
    `HEAD:${process.env.GITHUB_REF}`
  ]);
  const { stdout: tag } = await execa("git", [
    "describe",
    "--abbrev=0",
    "--tags"
  ]);
  return tag;
}
