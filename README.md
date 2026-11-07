# Sabi Spin

A live classroom quiz game. The facilitator runs it on a phone (passed around) or on a laptop with a projector. Players pick an age group and a topic, spin the wheel, answer out loud, then tap to reveal the answer and a one-line explanation.

- 3 age groups (6–9, 10–13, 14–17) × 10 topics × 24 questions = 720 questions, plus any you add yourself
- Topics: Living Things, Earth & Space, Matter & Energy, Human Body, Geography of Africa, African History, African Scientists & Inventors, African Nature & Wildlife, Government & Civics, African Cultures & Languages
- Mix modes: All Science, All Africa, or Everything, so the wheel picks the topic too
- Each wheel holds up to 8 questions. When it's finished, spin up the next round. Used questions stay out until you reset them
- Optional 2–4 teams with scoring, **steals** (a wrong answer opens the question to the other teams) and **wheel specials** (×2 Double points, ↻ Bonus spin, ALL Anyone can answer)
- Undo the last score, or adjust any score by hand
- Optional answer timer (20/30/45 s), optional **answer choices** (juniors only or everyone), optional **read aloud**
- **Results screen** with final standings and a recap of every question and answer, ready to copy or print for revision
- **Audience screen** for projectors (see below)
- **Keyboard and presentation-clicker control** (press `?` in the game for the list)
- The whole game is saved on the device, so an accidental refresh puts you back where you were
- Installable as a home-screen app (PWA) and works offline after the first load

## Run it

No build step. It is `index.html`, the question bank in `questions.js`, a manifest, a service worker and two icons.

```sh
npx serve .          # or: python3 -m http.server 8080
```

Open the printed URL. (Opening `index.html` directly from Finder works for basic play, but the service worker, fonts and audience screen need http.)

## Using a projector

1. Open Sabi Spin on the laptop and start a game.
2. Press the screen button (🖥) in the top bar. A second "audience" window opens. Drag it onto the projector and press `F` (or double-click) for fullscreen.
3. The class sees the wheel, the question and the scores. Your window also shows the answer early, marked "only you can see this", so you can judge answers without revealing them. That button turns green while the audience screen is connected.

If you only have one screen, just use the main window. The answer stays hidden until you press Reveal.

## Keyboard and clicker

| Key | Does |
| --- | --- |
| `Space` `Enter` `→` `PgDn` | Next step: spin, reveal, mark correct, next round |
| `←` `PgUp` | Wrong / not this time (opens a steal when steals are on) |
| `Y` / `N` | Correct / wrong |
| `1`–`4` | That team got it (steals and "Anyone can answer") |
| `U` | Undo the last score |
| `R` | Read the question aloud |
| `M` / `F` / `?` | Sound, fullscreen, shortcut list |

Presentation clickers send `PgDn`/`PgUp` or the arrow keys, so a two-button clicker runs a whole game: forward moves the game on and marks an answer correct, back marks it wrong.

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

After that it opens full-screen like an app and keeps working with no signal. Used questions, the game in progress (scores, wheel, recap), your settings and your own questions are saved on the device.

## Add your own questions (no coding)

On the setup screen, open **My questions**. Paste rows straight from a spreadsheet (Excel and Google Sheets both copy as tab-separated text), or choose a CSV or JSON file. **Download template** gives you the layout:

| topic | age | question | answer | why | wrong1 | wrong2 | wrong3 | icon |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Times Tables | j | What is 6 × 7? | 42 | Six groups of seven make forty-two. | 36 | 48 | 49 | ✖️ |

- `age` is `j`, `m`, `s` (or `juniors`, `10-13`…) or `all`.
- `wrong1`–`wrong3` are optional and are used when answer choices are on.
- Other languages: add columns such as `question_yo`, `answer_yo` and `why_yo` (any language code). A **Language** picker then appears on the setup screen, and read aloud uses that language when the device has a voice for it.
- Your topics appear under "My questions" and in the Everything mix. **Export my questions** saves them as a CSV you can share with another teacher.

They are stored on this device only. Export them to back them up.

## Edit the built-in questions

They live in `questions.js`. Each topic has three arrays (`j`, `m`, `s` for the three age groups) of `{ q, a, w, c }`: question, answer, the one-line explanation shown with the answer, and the wrong answers for answer-choice mode. Arrays can be any length. Any text can be `{ en: '…', yo: '…' }` to add translations.

After changing files, bump `CACHE` in `sw.js` (e.g. `sabi-spin-v3`). Installed phones pick up changes in the background and show them on the next launch.

## Feedback and analytics

Both are set at the top of the script in `index.html` (search for `FEEDBACK` and `GOATCOUNTER`).

**Feedback** goes to a Google Form. Teachers see a 👍 / 👎 prompt and a "Tell us more" button on the results screen, a "⚑ Report" button on each revealed question and in the recap, and a "Send feedback" link on the setup screen and in the shortcuts list. The form opens in a new tab with the details already filled in: what kind of feedback it is, the rating, the game settings (age group, topic, number of teams, timer and so on, never team names), and for a report, the question and the answer that was shown.

- `url` is the form's public link (Send → link icon). Never use the `/edit` link: it lets anyone edit the form.
- `fields` are the form's entry IDs. In the form, open ⋮ → Get pre-filled link, fill each question with any text, click Get link, and copy the `entry.123…` numbers. A field left blank is just not pre-filled.
- Multiple-choice answers only pre-fill when the text matches an option exactly, so keep `kinds` and `ratings` the same as the form's options.
- With no `url`, every feedback button is hidden.

**Analytics** use [GoatCounter](https://www.goatcounter.com): free for non-commercial use, no cookies, so no consent banner. Sign up, then put your site code (the `sabispin` in `sabispin.goatcounter.com`) in `GOATCOUNTER`. It counts visits and these events. None of them carry names, question text, or teachers' own topic names:

| Event | When |
| --- | --- |
| `start-<age>-<topic>` | A game starts or continues (teachers' own topics show as `own`) |
| `setting-…` | Settings that are on at the start: teams, steals, specials, timer, choices, read aloud, language |
| `next-round` | A fresh wheel is spun up |
| `results-<n>` | The results screen, with how many questions were played (`0`, `1-4`, `5-8`, `9-16`, `17+`) |
| `feedback-up` / `feedback-down` | The 👍 / 👎 on the results screen |
| `feedback-form`, `report-question` | The form was opened |
| `audience-screen`, `recap-copy`, `recap-print`, `own-questions-added` | Those features were used |
| `installed`, `launch-installed` | Installed to the home screen, and opened from it |

The audience window is never counted, and GoatCounter skips `localhost`, so testing at home does not count. With no internet, events are simply not sent.
