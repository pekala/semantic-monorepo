import path from "path";

export default async function getPkgName(pkgDir: string) {
  const pkgJSONPath = path.resolve(
    process.env.GITHUB_WORKSPACE,
    pkgDir,
    "package.json"
  );
  const pkgJSON = await import(pkgJSONPath);
  return pkgJSON.name;
}
