import { plugins, applyPlugins, parse } from "parse-commit-message";
import getRawCommit from "./get-raw-commit";
import getAffectedFiles from "./get-affected-files";
import getAffectedPkgs from "./get-affected-pkgs";
import { Increment } from "types";

async function parseCommit(rawMessage: string) {
  try {
    const commit = await parse(rawMessage);
    return applyPlugins(plugins, commit)[0];
  } catch (error) {
    return {
      header: {
        type: "invalid",
        subject: rawMessage
      },
      increment: false as Increment,
      isBreaking: false
    };
  }
}

export default async function* walkCommits() {
  let cursor = "HEAD";
  while (true) {
    try {
      const { hash, rawMessage } = await getRawCommit(cursor);
      const commit = await parseCommit(rawMessage);
      const affectedFiles = await getAffectedFiles(hash);
      const affectedPkgs = await getAffectedPkgs(affectedFiles);

      yield { hash, commit, affectedFiles, affectedPkgs };
      cursor = `${hash}^1`;
    } catch (error) {
      if (error.exitCode === 128) {
        return;
      }
      throw error;
    }
  }
}
