const fs = require("fs");
const path = require("path");

function writeVersion() {
  const pkgPath = path.resolve(process.cwd(), "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.error("package.json not found");
    process.exit(0);
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const version = pkg.version || "0.0.0";
  const commit = process.env.GITHUB_SHA ? String(process.env.GITHUB_SHA).slice(0,7) : "";
  const stamp = new Date().toISOString();
  const publicDir = path.resolve(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  const out = { version, commit, date: stamp };
  fs.writeFileSync(path.join(publicDir, "version.json"), JSON.stringify(out));
  console.log("Wrote public/version.json", out);
}

writeVersion();
