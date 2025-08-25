
# Web Versioning Kit (Next.js/Vercel, GitHub, Conventional Commits, Release Please)

This kit sets up **simple, safe versioning** for a web-only app (e.g., Next.js on Vercel).
It gives you:
- Conventional Commits + Husky (commit messages checked)
- GitHub Actions: CI on pull requests
- GitHub Releases & tags **automated** with **release-please**
- A build step that writes `public/version.json` so you can show the app version in your UI
- Git LFS for images/videos

---

## 1) Add these files to your repo
Copy the files from this kit into the root of your web project (at the same level as your `package.json`).

> Tip: You can unzip this kit and paste files right away. If a file already exists in your project, merge the content carefully.

---

## 2) Install Husky & Commitlint (once)
```bash
npm i -D husky @commitlint/cli @commitlint/config-conventional
npx husky init
# Create the commit-msg hook
printf 'npx --no commitlint --edit "$1"\n' > .husky/commit-msg
git add .husky/commit-msg
git commit -m "chore: enable conventional commits enforcement"
```

You can now write commits like:
- `feat(web): add party mode`
- `fix(ui): button radius`
- `feat!: break rooms schema` (the `!` means breaking change)

---

## 3) Release automation (release-please)
We already added the workflow `.github/workflows/release-please.yml`.

How it works:
1. You push conventional commits to **main** (via PR).
2. The workflow opens a PR: **chore(main): release X.Y.Z**.
3. When you **merge** that PR, it:
   - Updates `package.json` version
   - Creates a **Git tag** (e.g., `v1.2.3`) & **GitHub Release**
   - Triggers your Vercel build (if your repo is connected)
4. Our build step writes `/public/version.json` so you can display the version in your app.

---

## 4) CI on Pull Requests
We run a basic CI on PRs (`.github/workflows/ci.yml`):
- Install
- Optional: `lint`, `typecheck`, `test` (it skips if scripts are missing)
- `build`

> If you don't have ESLint/TypeScript/Tests yet, the workflow won't fail; it prints a message and continues.

---

## 5) Show the app version in your UI
This kit adds `scripts/inject-version.js` and wires it in `prebuild` so every build writes `public/version.json` like:
```json
{"version":"1.2.3","commit":"abc1234","date":"2025-08-25T12:34:56Z"}
```

**Example React (Next.js app dir, client component):**
```tsx
"use client";
import { useEffect, useState } from "react";

export default function AppVersion() {
  const [v, setV] = useState<null | {version:string,commit?:string,date?:string}>(null);
  useEffect(() => {
    fetch("/version.json").then(r => r.json()).then(setV).catch(() => setV(null));
  }, []);
  if (!v) return null;
  return <div style={fontSize:12,opacity:0.7}>v{v.version} ({v.commit?.slice(0,7)})</div>;
}
```

Place it in your footer/layout.

---

## 6) Git LFS for assets
We added `.gitattributes` to store big images/videos with LFS to keep your repo fast:
```bash
git lfs install
git add .gitattributes
git commit -m "chore: enable LFS for media"
git push
```

---

## 7) Vercel
- Connect your GitHub repo to Vercel (one click).
- Each Pull Request => **Preview URL**.
- Merge to `main` => **Production** deploy.
- The version in your UI updates automatically thanks to `public/version.json`.

---

## 8) Optional protections
- Protect `main` (PR required, 1 review)
- Add required status checks: the PR CI workflow

---

## 9) Troubleshooting
- **No lint/test scripts?** CI prints "No script" and continues.
- **Version not showing?** Ensure `prebuild` runs before `build` and your app serves `/public`.
- **Release PR doesn't appear?** Make sure the workflow file is on `main` and your commits follow conventional commits.

---

Happy shipping! 🦄
