import { plugins, applyPlugins, parse } from "parse-commit-message";
import getRawCommit from "./get-raw-commit";
import getAffectedFiles from "./get-affected-files";

async function parseCommit(rawMessage: string) {
  try {
    const commit = await parse(rawMessage);
    return applyPlugins(plugins, commit)[0];
  } catch (error) {
    return {};
  }
}

export default async function* walkCommits() {
  let cursor = "HEAD";
  while (true) {
    try {
      const { hash, rawMessage } = await getRawCommit(cursor);
      const commit = await parseCommit(rawMessage);
      const affectedFiles = await getAffectedFiles(hash);

      yield { hash, commit, affectedFiles };
      cursor = `${hash}^1`;
    } catch (error) {
      if (error.exitCode === 128) {
        return;
      }
      throw error;
    }
  }
}
