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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const glob_1 = __importDefault(require("glob"));
const path_1 = __importDefault(require("path"));
const asyncGlob = util_1.promisify(glob_1.default);
function isInDirectory(directory, file) {
    const relative = path_1.default.relative(directory, file);
    return relative && !relative.startsWith("..") && !path_1.default.isAbsolute(relative);
}
function getAffectedPkgs(affectedFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        const pkgJSON = yield Promise.resolve().then(() => __importStar(require(path_1.default.resolve(process.env.GITHUB_WORKSPACE, "package.json"))));
        const pkgDirs = yield asyncGlob(pkgJSON.workspaces[0]);
        const getAffectedPkg = (file) => pkgDirs.find(pkgDir => isInDirectory(pkgDir, file));
        const affectedPkgs = affectedFiles.map(getAffectedPkg).filter(pkg => !!pkg);
        return [...new Set(affectedPkgs)];
    });
}
exports.default = getAffectedPkgs;
//# sourceMappingURL=get-affected-pkgs.js.map