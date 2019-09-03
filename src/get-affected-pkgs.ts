import { promisify } from "util";
import glob from "glob";
import path from "path";
const asyncGlob = promisify(glob);

function isInDirectory(directory: string, file: string) {
  const relative = path.relative(directory, file);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

export default async function getAffectedPkgs(affectedFiles: string[]) {
  const repoPkgJSON = await import(
    path.resolve(process.env.GITHUB_WORKSPACE, "package.json")
  );
  const pkgDirs = await asyncGlob(repoPkgJSON.workspaces[0]);

  const getAffectedPkg = (file: string) =>
    pkgDirs.find(pkgDir => isInDirectory(pkgDir, file));

  const affectedPkgs = affectedFiles.map(getAffectedPkg).filter(pkg => !!pkg);

  return [...new Set(affectedPkgs)];
}
