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
const execa_1 = __importDefault(require("execa"));
const DELIMITER = ">>><<<";
function getRawCommit(cursor) {
    return __awaiter(this, void 0, void 0, function* () {
        const { stdout } = yield execa_1.default("git", [
            "log",
            `--format=%H${DELIMITER}%B`,
            "-n",
            "1",
            cursor
        ]);
        const [hash, rawMessage] = stdout.split(DELIMITER);
        return { hash, rawMessage };
    });
}
exports.default = getRawCommit;
//# sourceMappingURL=get-raw-commit.js.map