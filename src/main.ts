import * as core from "@actions/core";
import walkCommits from "./walk-commits";
import { Increment, CommitDescription } from "types";
import bumpPkgVersion from "./bump-package-version";
const BUMPS: Increment[] = [false, "patch", "minor", "major"];

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
      console.log("Bump pkg version", pkgDir, byPkg[pkgDir].increment);
      const tag = await bumpPkgVersion(pkgDir, byPkg[pkgDir].increment);
      console.log("published!", tag);
      console.log("Make a release", byPkg[pkgDir].commits);
      // await createGithubRelease(tag, byPkg[pkgDir].commits);
    }

    return byPkg;
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
