import { CommitDescription } from "types";
import Octokit from "@octokit/rest";
import getPkgJSON from "./get-pkg-json";
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
