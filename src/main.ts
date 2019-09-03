import * as core from "@actions/core";
import walkCommits from "./walk-commits";
import { Increment, CommitDescription } from "types";
import bumpPkgVersion from "./bump-package-version";
import createGithubRelease from "./create-github-release";
const BUMPS: Increment[] = [false, "patch", "minor", "major", "init"];

async function run() {
  try {
    let byPkg: {
      [pkgDir: string]: { commits: CommitDescription[]; increment: Increment };
    } = {};

    for await (let data of walkCommits()) {
      data.affectedPkgs.forEach(affectedPkg => {
        byPkg[affectedPkg] = byPkg[affectedPkg] || {
          commits: [],
          increment: BUMPS[0]
        };
        const commits = byPkg[affectedPkg];
        commits.commits.push(data);
        commits.increment =
          BUMPS.indexOf(data.commit.increment) >
          BUMPS.indexOf(commits.increment)
            ? data.commit.increment
            : commits.increment;
      });
    }

    for await (let pkgDir of Object.keys(byPkg)) {
      await bumpPkgVersion(pkgDir, byPkg[pkgDir].increment);
      await createGithubRelease(pkgDir, byPkg[pkgDir].commits);
    }

    return byPkg;
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

run();
