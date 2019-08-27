"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_commit_message_1 = require("parse-commit-message");
const get_raw_commit_1 = __importDefault(require("./get-raw-commit"));
function parseCommit(rawMessage) {
    return __awaiter(this, void 0, void 0, function* () {
        const commit = yield parse_commit_message_1.parse(rawMessage);
        return parse_commit_message_1.applyPlugins(parse_commit_message_1.plugins, commit)[0];
    });
}
function walkCommits() {
    return __asyncGenerator(this, arguments, function* walkCommits_1() {
        let cursor = "HEAD";
        while (true) {
            try {
                const { hash, rawMessage } = yield __await(get_raw_commit_1.default(cursor));
                const commit = yield __await(parseCommit(rawMessage));
                yield yield __await({ hash, commit });
                cursor = `${hash}^1`;
            }
            catch (error) {
                if (error.exitCode === 128) {
                    return yield __await(void 0);
                }
                throw error;
            }
        }
    });
}
exports.default = walkCommits;
