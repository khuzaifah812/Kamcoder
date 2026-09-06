# Khuzaifah Aine Mbabazi — Portfolio Website

A vanilla HTML/CSS/JS portfolio, designed like a code editor (tab-bar navigation, editor "chrome" windows, code-comment section labels) since the subject is a software engineering student.

## 1. Folder structure

```
portfolio/
├── index.html          → all page content and structure
├── css/
│   └── style.css       → all styling, both dark and light themes
├── js/
│   └── script.js       → theme toggle, mobile menu, animations, form
└── images/
    ├── favicon.svg      → browser tab icon (placeholder)
    └── projects/        → empty folder, ready for real project screenshots
```

## 2. How each file works

- **index.html** — one file, organized top-to-bottom in the same order as the navigation tabs: Hero → About → Skills → Projects → Development Journey → Education → Currently Learning → Career Goal → Hackathons → Contact → Footer. Every section is a `<section>` with an `id` that matches a nav link.
- **css/style.css** — starts with CSS variables (`:root`) for colors, fonts and spacing. Dark mode is the default; `[data-theme="light"]` overrides the same variables. Everything below builds off those variables, so re-theming means editing one block, not hunting through the file.
- **js/script.js** — four independent features, each in its own block: theme toggle (saved to `localStorage`), mobile nav open/close, scroll-based section highlighting + reveal animation, and the contact form's validation + mailto handoff. No frameworks, no build step.

## 3. Adding your profile photo

Currently the About section shows a placeholder with your initials ("KAM") instead of a photo, as instructed.

1. Add your photo to `images/`, e.g. `images/profile.jpg`.
2. In `index.html`, find:
   ```html
   <div class="avatar-placeholder" aria-hidden="true">KAM</div>
   ```
3. Replace it with:
   ```html
   <img src="images/profile.jpg" alt="Khuzaifah Aine Mbabazi">
   ```
4. Optional: in `style.css`, add `.avatar-placeholder{ display:none }`-style adjustment isn't needed — the `<img>` will simply fill the existing `.avatar-frame` box since it already has `object-fit` friendly sizing (add `object-fit:cover; width:100%; height:100%;` to the `<img>` if the photo isn't square).

## 4. Adding GitHub project links

Each project card currently has a placeholder GitHub button pointing to `#`. For example, for Project 1:

```html
<a href="#" class="btn btn-small btn-outline">GitHub</a>
```

Replace `#` with the real repository URL once you publish it, e.g.:

```html
<a href="https://github.com/khuzaifah812/attendance-system" class="btn btn-small btn-outline" target="_blank" rel="noopener">GitHub</a>
```

Do this for each project card in the **Projects** section of `index.html`.

## 5. Adding live demo links

Where a project isn't deployed yet, the button is deliberately shown as disabled text (e.g. "Live Demo — coming soon") so the site never claims something untrue. Once you deploy a project:

1. Find that project's disabled span, e.g.:
   ```html
   <span class="btn btn-small btn-ghost" aria-disabled="true">Live Demo — coming soon</span>
   ```
2. Replace it with a real link:
   ```html
   <a href="https://your-deployed-url.com" class="btn btn-small btn-outline" target="_blank" rel="noopener">Live Demo</a>
   ```

The **E-Consent & Student Verification System** card is marked with an "In Progress" badge since you're still building it — update that badge and its buttons the same way once it's ready.

## 6. Deploying the site

**GitHub Pages**
1. Create a repository (e.g. `khuzaifah812.github.io` for a root domain, or any name for a project page).
2. Push these files to it.
3. In the repo, go to **Settings → Pages**, set the source branch to `main` (or `master`) and folder to `/root`.
4. Your site will be live at `https://khuzaifah812.github.io` (or `https://khuzaifah812.github.io/repo-name`).

**Netlify**
1. Go to netlify.com → "Add new site" → "Deploy manually".
2. Drag the whole `portfolio` folder onto the upload area.
3. Netlify gives you a live URL immediately; you can add a custom domain later.

**Vercel**
1. Go to vercel.com → "Add New Project".
2. Import the folder/repository (no build command needed — it's static HTML).
3. Deploy; Vercel gives you a live URL.

## 7. Connecting the contact form

Right now, clicking "Send Message" validates the fields, then opens the visitor's own email app with a pre-filled message addressed to you (`mailto:`). This actually works with no setup, but it depends on the visitor having an email client configured — it does **not** send email from your server, and no message is stored anywhere.

To get a "real" form that sends you an email without opening the visitor's mail app, connect a form backend later:

- **Formspree** (easiest): create a free form at formspree.io, then change the `<form>` tag's behavior to POST to your Formspree endpoint instead of using the JS `mailto` handler.
- **EmailJS**: lets you send email straight from JavaScript using their SDK and a connected email account.
- **Netlify Forms**: if you deploy on Netlify, add `netlify` and `data-netlify="true"` attributes to the `<form>` tag and Netlify handles submissions automatically — no JS changes needed.

## 8. Updating the portfolio later

- **New project** → duplicate one `<article class="project-card">` block in the Projects section, edit its text, snippet, tech tags, and links.
- **New skill** → add a `<li>` inside the relevant `<ul class="tag-list">` in the Skills section.
- **Learning roadmap** → add or remove a `<span class="roadmap-chip">` in the Currently Learning section.
- **Colors/fonts** → change the CSS variables at the top of `style.css` (`--blue`, `--font-display`, etc.) — the rest of the site follows automatically.
- **Content tone** → everything is plain text in `index.html`; no build step or compiler is involved, so edits are visible immediately on refresh.

---

Everything here was written to be honest about your current stage: no fabricated jobs, clients, certifications, or completed deployments — only what you told me. Update placeholders as things become real.
