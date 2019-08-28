import { Commit } from "parse-commit-message";

export type Increment = false | "patch" | "minor" | "major" | "init";

export type CommitDescription = {
  commit: Commit;
  hash: string;
  affectedFiles: string[];
  affectedPkgs: string[];
};
