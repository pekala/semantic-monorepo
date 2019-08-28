"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const walk_commits_1 = __importDefault(require("./walk-commits"));
const BUMPS = [false, "patch", "minor", "major"];
function run() {
    var e_1, _a, e_2, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let byPkg = {};
            try {
                for (var _c = __asyncValues(walk_commits_1.default()), _d; _d = yield _c.next(), !_d.done;) {
                    let data = _d.value;
                    data.affectedPkgs.forEach(affectedPkg => {
                        byPkg[affectedPkg] = byPkg[affectedPkg] || {
                            commits: [],
                            increment: BUMPS[0]
                        };
                        const commits = byPkg[affectedPkg];
                        commits.commits.push(data);
                        commits.increment =
                            BUMPS.indexOf(data.commit.increment) >
                                BUMPS.indexOf(commits.increment)
                                ? data.commit.increment
                                : commits.increment;
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) yield _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var _e = __asyncValues(Object.keys(byPkg)), _f; _f = yield _e.next(), !_f.done;) {
                    let pkgDir = _f.value;
                    console.log("Bump pkg version", pkgDir, byPkg[pkgDir].increment);
                    console.log("Make a release", byPkg[pkgDir].commits);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return byPkg;
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
//# sourceMappingURL=main.js.map