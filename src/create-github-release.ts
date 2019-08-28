import { CommitDescription } from "types";
import Octokit from "@octokit/rest";
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
  tag: string,
  commitDescs: CommitDescription[]
) {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

  octokit.repos.createRelease({
    owner,
    repo,
    tag_name: tag,
    body: commitDescs
      .filter(commitDesc => commitDesc.commit.increment)
      .map(getCommitDescLine)
      .join("\n")
  });
}
