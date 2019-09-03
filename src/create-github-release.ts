import { CommitDescription } from "types";
import Octokit from "@octokit/rest";
import getPkgJSON from "./get-pkg-json";
import execa = require("execa");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const getCommitDescLine = (commitDesc: CommitDescription) => {
  let descLine = "";
  const commit = commitDesc.commit;
  if (commit.header.type === "fix") {
    descLine += "*Fix*";
  }
  if (commit.header.type === "feat") {
    descLine += "*Functionality*";
  }

  if (commit.isBreaking) {
    descLine += " **BREAKING!**";
  }
  descLine += ` ${commitDesc.hash.substr(0, 7)}: ${commit.header.subject}`;
  return descLine;
};

export default async function createGithubRelease(
  pkgDir: string,
  commitDescs: CommitDescription[]
) {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const pkgJSON = await getPkgJSON(pkgDir);

  // undo GH damage
  const excessRelease = await octokit.repos.getReleaseByTag({
    owner,
    repo,
    tag: pkgJSON.version
  });
  await octokit.repos.deleteRelease({
    owner,
    repo,
    release_id: excessRelease.data.id
  });
  await execa("git", [
    "push",
    `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`,
    `:refs/tags/${pkgJSON.version}`
  ]);
  // end undo GH damage

  await octokit.repos.createRelease({
    owner,
    repo,
    tag_name: `${pkgJSON.name}@v${pkgJSON.version}`,
    body: commitDescs
      .filter(commitDesc => commitDesc.commit.increment)
      .map(getCommitDescLine)
      .join("\n")
  });
}
