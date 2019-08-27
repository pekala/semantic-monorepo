import { plugins, applyPlugins, parse } from "parse-commit-message";
import getRawCommit from "./get-raw-commit";

async function parseCommit(rawMessage: string) {
  const commit = await parse(rawMessage);
  return applyPlugins(plugins, commit)[0];
}

export default async function* walkCommits() {
  let cursor = "HEAD";
  while (true) {
    try {
      const { hash, rawMessage } = await getRawCommit(cursor);
      const commit = await parseCommit(rawMessage);

      yield { hash, commit };
      cursor = `${hash}^1`;
    } catch (error) {
      if (error.exitCode === 128) {
        return;
      }
      throw error;
    }
  }
}
