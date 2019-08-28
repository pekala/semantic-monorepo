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
const execa_1 = __importDefault(require("execa"));
const get_pkg_name_1 = __importDefault(require("./get-pkg-name"));
function bumpPkgVersion(pkgDir, increment) {
    return __awaiter(this, void 0, void 0, function* () {
        if (increment === false) {
            return;
        }
        const pkgName = yield get_pkg_name_1.default(pkgDir);
        const cwd = path_1.default.resolve(process.env.GITHUB_WORKSPACE, pkgDir);
        console.log(pkgName, cwd);
        yield execa_1.default("yarn", ["version", `--${increment}`], {
            cwd,
            env: {
                YARN_VERSION_GIT_MESSAGE: `chore(release): ${pkgName}@v%s`,
                YARN_VERSION_TAG_PREFIX: `${pkgName}@v`
            }
        });
        yield execa_1.default("yarn", ["publish", `--non-interactive`], { cwd });
        yield execa_1.default("git", [
            "push",
            "--follow-tags",
            `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`
        ]);
        const { stdout: tag } = yield execa_1.default("git", [
            "describe",
            "--abbrev=0",
            "--tags"
        ]);
        return tag;
    });
}
exports.default = bumpPkgVersion;
//# sourceMappingURL=bump-package-version.js.map