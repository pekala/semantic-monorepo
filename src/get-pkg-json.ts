import path from "path";

export default async function getPkgJSON(pkgDir: string) {
  const pkgJSONPath = path.resolve(
    process.env.GITHUB_WORKSPACE,
    pkgDir,
    "package.json"
  );
  return await import(pkgJSONPath);
}
