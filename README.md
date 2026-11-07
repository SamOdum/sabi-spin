# Sabi Spin

A live classroom quiz game. The facilitator runs it on a phone (passed around) or on a laptop mirrored to a projector. Players pick an age group and a topic, spin the wheel, answer out loud, then tap to reveal the answer and a one-line explanation.

- 3 age groups (6–9, 10–13, 14–17) × 8 topics × 8 questions = 192 questions
- Topics: Living Things, Earth & Space, Matter & Energy, Human Body, Geography of Africa, African History, African Scientists & Inventors, African Nature & Wildlife
- Used questions are greyed out on the wheel and can't come up again until you reset
- Optional 2–4 teams with correct/wrong scoring; optional 20/30/45 s answer timer
- Sound effects with a mute toggle; fullscreen button for projectors
- Installable as a home-screen app (PWA) and works offline after the first load

## Run it

No build step. It is one HTML file plus a manifest, a service worker and two icons.

Locally:

```sh
npx serve .          # or: python3 -m http.server 8080
```

Open the printed URL. (Opening `index.html` directly from Finder also works, but the service worker and fonts only load over http.)

## Play it on your phone

Easiest: host it on GitHub Pages, then "Add to Home Screen".

1. Create a repo on GitHub and push this folder:
   ```sh
   git remote add origin git@github.com:<you>/sabi-spin.git
   git push -u origin main
   ```
2. On GitHub: Settings → Pages → Source: "Deploy from a branch", Branch: `main` / `/ (root)`. Wait a minute.
3. Open `https://<you>.github.io/sabi-spin/` on the phone.
4. iPhone: Share → Add to Home Screen. Android: menu → Install app / Add to Home screen.

After that it opens full-screen like an app and keeps working with no signal. Used questions, scores and the mute setting are saved on the device.

## Edit the questions

Everything lives in `index.html` under `const BANK = { ... }`. Each topic has three arrays (`j`, `m`, `s` for the three age groups) of `{ q, a, w }`: question, answer, and the one-line explanation shown with the answer. The wheel always has 8 segments, so keep 8 questions per array.

After changing questions, bump `CACHE` in `sw.js` (e.g. `sabi-spin-v2`) so installed phones pick up the new version.
