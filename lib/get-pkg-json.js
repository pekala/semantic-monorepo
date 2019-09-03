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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const readFile = util_1.promisify(fs_1.default.readFile);
function getPkgJSON(pkgDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const pkgJSONPath = path_1.default.resolve(process.env.GITHUB_WORKSPACE, pkgDir, "package.json");
        const rawJSON = yield readFile(pkgJSONPath, "utf8");
        return JSON.parse(rawJSON);
    });
}
exports.default = getPkgJSON;
//# sourceMappingURL=get-pkg-json.js.map