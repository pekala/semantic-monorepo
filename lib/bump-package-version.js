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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const execa_1 = __importDefault(require("execa"));
const get_pkg_json_1 = __importDefault(require("./get-pkg-json"));
const writeFile = util_1.promisify(fs_1.default.writeFile);
function bumpPkgVersion(pkgDir, increment) {
    return __awaiter(this, void 0, void 0, function* () {
        if (increment === false) {
            return;
        }
        const pkgJSON = yield get_pkg_json_1.default(pkgDir);
        const cwd = path_1.default.resolve(process.env.GITHUB_WORKSPACE, pkgDir);
        yield writeFile(path_1.default.resolve(cwd, ".npmrc"), `//npm.pkg.github.com/:_authToken=${process.env.GITHUB_TOKEN}`);
        yield execa_1.default("yarn", [
            "version",
            increment === "init"
                ? `--new-version=${pkgJSON.version}`
                : `--${increment}`
        ], {
            cwd,
            env: {
                YARN_VERSION_GIT_MESSAGE: `chore(release): ${pkgJSON.name}@v%s`,
                YARN_VERSION_TAG_PREFIX: `${pkgJSON.name}@v`,
                GIT_AUTHOR_NAME: "Semantic Monorepo",
                GIT_COMMITTER_NAME: process.env.GITHUB_ACTOR,
                GIT_AUTHOR_EMAIL: "dev@pleo.io",
                GIT_COMMITTER_EMAIL: "dev@pleo.io"
            }
        });
        yield execa_1.default("yarn", ["publish", `--non-interactive`], { cwd });
        const updatedPkgJson = yield get_pkg_json_1.default(pkgDir);
        const repoUrl = `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`;
        yield execa_1.default("git", ["push", repoUrl, `:refs/tags/${updatedPkgJson.version}`]);
        yield execa_1.default("git", [
            "push",
            "--follow-tags",
            repoUrl,
            `HEAD:${process.env.GITHUB_REF}`
        ]);
    });
}
exports.default = bumpPkgVersion;
//# sourceMappingURL=bump-package-version.js.map