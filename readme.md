# PANW GROP Dashboard

A lightweight Angular-in-the-browser dashboard for office release tracking. It mirrors the provided React mock with a roadmap timeline, initiatives carousel, and birthdays panel—all running without a build step by using Angular UMD bundles from a CDN.

## Running the dashboard
1. Open `index.html` in a modern browser (or serve the folder locally, e.g., `python -m http.server 8000`).
2. The app bootstraps automatically via `platformBrowserDynamic` and reads data from `app.js`.

## Customizing content
- **Release info:** Update the `versionData` object in `app.js`.
- **Roadmap:** Edit the `drops` array (status can be `completed`, `current`, or `upcoming`).
- **Teams & features:** Adjust the `teams` array entries and feature lists.
- **Birthdays:** Modify the `birthdays` array to change the highlighted colleagues.

Because dependencies load from CDNs, no `npm install` is required. Ensure your environment can access external assets if you want the dashboard to render icons and photos.
