"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = __importDefault(require("@octokit/rest"));
const octokit = new rest_1.default({ auth: process.env.GITHUB_TOKEN });
const getCommitDescLine = (commitDesc) => {
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
function createGithubRelease(tag, commitDescs) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.default = createGithubRelease;
//# sourceMappingURL=create-github-release.js.map