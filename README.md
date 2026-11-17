# AI Box — public legal & support pages

Static website (HTML, CSS, vanilla JS) for **AI Box**, providing the Privacy Policy, Terms of Service,
User Data Deletion Instructions and Contact pages required for Meta Developer App configuration.

No build step, backend, database, environment variables or API keys. Works directly on GitHub Pages.

> **Status: DRAFT.** Every page contains `{{PLACEHOLDER}}` tokens and "Review required" notes that must be
> completed before the URLs are used in Meta App Settings. When viewed in a browser, placeholders are
> highlighted in yellow and a "Draft" notice appears. Both disappear automatically once everything is filled in.

## Structure

```
ai-box-meta-pages/
├── index.html               Home
├── privacy-policy.html      Privacy Policy
├── data-deletion.html       User Data Deletion Instructions
├── terms.html               Terms of Service
├── contact.html             Contact (mailto links only — no fake form)
├── assets/
│   ├── css/style.css
│   ├── js/main.js           Mobile menu, icons, placeholder highlighting (pages work without it)
│   └── images/logo.svg
├── README.md
└── .nojekyll
```

All links and assets are **relative**, so the site works under a GitHub Pages project path such as
`/ai-box-meta-pages/`. Icons load from a pinned Lucide CDN build (`unpkg.com/lucide@0.460.0`); they are
decorative, so pages remain fully readable if the CDN is unavailable.

## 1. Complete the placeholders

Find and replace each token across **all** `.html` files (VS Code: *Edit → Replace in Files*).

| Token | What to enter | Used in |
|---|---|---|
| `{{OPERATOR_LEGAL_NAME}}` | Registered legal name of the business that operates AI Box | All pages |
| `{{OPERATOR_ADDRESS}}` | Registered business address | Privacy, Terms, Contact |
| `{{SUPPORT_EMAIL}}` | Real, monitored support mailbox | Terms, Contact |
| `{{PRIVACY_EMAIL}}` | Real, monitored mailbox for privacy enquiries (may equal support) | Privacy, Contact |
| `{{DELETION_EMAIL}}` | Real, monitored mailbox for deletion requests (may equal privacy) | Privacy, Data Deletion, Contact |
| `{{LAST_UPDATED}}` | Date the policies were finalised, e.g. `17 November 2026` | Privacy, Terms, Data Deletion |
| `{{DISCONNECT_INSTRUCTIONS}}` | Exact in-app path to disconnect an account, **or** "In-app disconnection is not yet available; use the platform settings below." | Privacy, Data Deletion |
| `{{DELETION_RESPONSE_TIME}}` | A processing time you can actually meet, e.g. `30 days` (check local law) | Data Deletion |
| `{{AI_PROVIDER}}` | The AI model provider that processes report data | Privacy |
| `{{HOSTING_PROVIDER}}` | Hosting / database provider for the AI Box app (not GitHub Pages) | Privacy |
| `{{DATA_STORAGE_LOCATION}}` | Country/region where app data is stored | Privacy |
| `{{RETENTION_ACCOUNT}}` | Real retention period for AI Box account data | Privacy |
| `{{RETENTION_TOKENS}}` | Real retention period for access tokens | Privacy |
| `{{RETENTION_ANALYTICS}}` | Real retention period for retrieved analytics | Privacy |
| `{{RETENTION_REPORTS}}` | Real retention period for generated reports | Privacy |
| `{{RETENTION_LOGS}}` | Real retention period for technical logs | Privacy |
| `{{MINIMUM_AGE}}` | Minimum user age (typically 18 for a business tool; confirm with counsel) | Terms |
| `{{GOVERNING_LAW}}` | Jurisdiction whose law governs the Terms | Terms |

Check nothing is left (run from this folder):

```bash
grep -rn "{{" --include=*.html .
```

## 2. Resolve review notes and the launch blocker

Search for these HTML comment markers:

```bash
grep -rn "REVIEW-REQUIRED\|LAUNCH-BLOCKER" --include=*.html .
```

- **`LAUNCH-BLOCKER`** (data-deletion.html) — remove the red callout only when the deletion mailbox is live and
  monitored, someone owns the process, and you have tested deleting a connected account's data end-to-end.
- **`REVIEW-REQUIRED`** — each grey dashed "Review required" callout asks you to confirm something about how the app
  really works (permissions requested, WhatsApp message content, AI provider data use, security measures, service
  providers) or a clause needing a lawyer (liability, termination, governing law). Edit the surrounding text to
  match reality, then delete the callout and comment.
- In privacy-policy.html §4, keep **only** the Meta permissions your app actually requests; Meta reviewers compare
  this against your App Review submission.
- Confirm the commitments already written in plain text are true for your app, notably privacy-policy.html §6
  ("We do not use data obtained from Facebook, Instagram or WhatsApp for advertising targeting…").

## 3. Deploy to GitHub Pages

1. Create a **public** repository named `ai-box-meta-pages` on GitHub.
2. Push the contents of this folder to the repository root:
   ```bash
   git init
   git add .
   git commit -m "AI Box legal and support pages"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/ai-box-meta-pages.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   Branch: `main`, folder: `/ (root)` → **Save**.
4. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/ai-box-meta-pages/`.
5. Open each URL below in a private browser window and confirm it loads with no highlighted placeholders.

## 4. URLs for Meta App Settings

In the Meta App Dashboard → **App settings → Basic**:

| Field | URL |
|---|---|
| Privacy Policy URL | `https://YOUR-USERNAME.github.io/ai-box-meta-pages/privacy-policy.html` |
| Terms of Service URL | `https://YOUR-USERNAME.github.io/ai-box-meta-pages/terms.html` |
| User data deletion → *Data deletion instructions URL* | `https://YOUR-USERNAME.github.io/ai-box-meta-pages/data-deletion.html` |
| App domain / Site URL (if needed) | `https://YOUR-USERNAME.github.io/ai-box-meta-pages/` |

Use the **instructions URL** option, not "Data deletion callback URL" — this site has no backend, so no automated
deletion callback exists. Implement a callback in the AI Box backend later if you want automated deletion.

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```bash
python -m http.server 8000   # then visit http://localhost:8000/
```

## Notes

- No secrets, tokens or API keys are stored in this repository. Keep it that way — it is public.
- AI Box is not affiliated with or endorsed by Meta; the site says so in every footer. Do not add Meta logos.
