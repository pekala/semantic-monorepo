import * as core from "@actions/core";
import walkCommits from "./walk-commits";
import { Increment, CommitDescription } from "types";
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
      console.log("Make a release", byPkg[pkgDir].commits);
      // const tag = await bumpPkgVersions(pkgDir, byPkg[pkgDir].increment);
      // await createGithubRelease(tag, byPkg[pkgDir].commits);
    }

    return byPkg;
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
