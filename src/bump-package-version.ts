import path from "path";
import fs from "fs";
import { promisify } from "util";
import execa from "execa";
import { Increment } from "types";
import getPkgJSON from "./get-pkg-json";

const writeFile = promisify(fs.writeFile);

export default async function bumpPkgVersion(
  pkgDir: string,
  increment: Increment
) {
  const pkgJSON = await getPkgJSON(pkgDir);
  const cwd = path.resolve(process.env.GITHUB_WORKSPACE, pkgDir);

  await writeFile(
    path.resolve(cwd, ".npmrc"),
    `//npm.pkg.github.com/:_authToken=${process.env.GITHUB_TOKEN}`
  );

  await execa(
    "yarn",
    [
      "version",
      increment === "init"
        ? `--new-version=${pkgJSON.version}`
        : `--${increment}`
    ],
    {
      cwd,
      env: {
        YARN_VERSION_GIT_MESSAGE: `chore(release): ${pkgJSON.name}@v%s`,
        YARN_VERSION_TAG_PREFIX: `${pkgJSON.name}@v`,
        GIT_AUTHOR_NAME: "Semantic Monorepo",
        GIT_COMMITTER_NAME: process.env.GITHUB_ACTOR,
        GIT_AUTHOR_EMAIL: "dev@pleo.io",
        GIT_COMMITTER_EMAIL: "dev@pleo.io"
      }
    }
  );
  await execa("yarn", ["publish", `--non-interactive`], { cwd });

  await execa("git", [
    "push",
    "--follow-tags",
    `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`,
    `HEAD:${process.env.GITHUB_REF}`
  ]);
}
