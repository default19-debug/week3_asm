# Appliance Energy Consumption Website

A small, three-page static website demonstrating HTML, CSS, JavaScript and Git/GitHub
workflow. Built for **COS30049 Computing Technology Innovation Project**, Week 3.

The site explains how everyday household appliances consume electricity in the Australian
market, and includes an interactive **Appliance Energy Calculator** written in vanilla
JavaScript.

---

## Live pages

| Page | File | Contents |
| --- | --- | --- |
| Home | `index.html` | Introduction, household statistics, and a collapsible FAQ section |
| Televisions | `televisions.html` | Television energy content, a power-rating table, and the energy calculator |
| About Us | `about.html` | Project purpose, author, structure, and GenAI acknowledgement |

---

## Running the site

No build step, package manager or server is required.

**Option 1 — open directly**

Open `index.html` in any modern browser.

**Option 2 — serve locally** (recommended, matches how a browser treats a real site)

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

---

## Folder structure

```
/
├── index.html              Home page
├── televisions.html        Televisions page + energy calculator
├── about.html              About Us page
├── README.md               This file
└── assets/
    ├── css/
    │   └── styles.css      All styling for every page
    ├── js/
    │   ├── main.js         Footer year + FAQ accordion
    │   └── calculator.js   Energy calculator logic and validation
    └── img/
        └── PowerIcon.png   Site logo and favicon
```

---

## Requirements checklist

### Pages and navigation
- [x] Three HTML pages: Home, Televisions, About Us
- [x] Top navigation menu present on all three pages
- [x] Navigation links move between all three pages
- [x] Logo displayed in the navigation bar
- [x] Clicking the logo returns the user to the Home page
- [x] Mouse-over (hover) effect on navigation links — colour change, background tint and an underline that scales in
- [x] Current page clearly indicated — highlighted background, darker text, a solid brown underline and `aria-current="page"`

### Home page
- [x] Placeholder content about appliance energy consumption in the Australian market
- [x] FAQ section hidden by default
- [x] FAQ can be revealed and hidden by the user (accordion behaviour)
- [x] FAQ interactivity implemented in JavaScript

### Styling
- [x] All styling in an external CSS file (`assets/css/styles.css`) — no inline styles
- [x] Colours taken from the logo
- [x] Styling applied consistently across all pages

### Footer
- [x] Footer on all pages
- [x] Current year, inserted dynamically by JavaScript
- [x] Author name
- [x] Generative AI acknowledgement

---

## Colour palette

Every colour in the stylesheet is derived from `assets/img/PowerIcon.png`, sampled directly
from the image file:

| Token | Hex | Source in the logo |
| --- | --- | --- |
| `--brand-brown` | `#7D6744` | Outer ring and bolt outline |
| `--brand-cream` | `#F8E8A5` | Circular face of the badge |
| `--brand-amber` | `#EBA746` | Lightning bolt |

Supporting tones (`--ink`, `--page`, `--line`, `--amber-dark`) are darker or lighter
variations of those three, so the whole site stays consistent with the logo.

---

## JavaScript extension — Appliance Energy Calculator

Implemented in `assets/js/calculator.js` on the **Televisions** page. No external libraries
are used.

### Inputs
- **Appliance model** — a `<select>` of televisions, each carrying a known wattage in a
  `data-watts` attribute. Choosing one fills in the power rating automatically.
- **Power rating (watts)** — a number input, 1 to 10,000 W. Typing here switches the model
  dropdown back to *Custom*.
- **Average hours of use per day** — a number input, 0 to 24 hours.
- **Electricity price (cents per kWh)** — a number input, 0.1 to 200 c/kWh.

### Calculations

```
daily kWh   = (watts ÷ 1000) × hours per day
monthly kWh = daily kWh × 30.44        (average month)
yearly kWh  = daily kWh × 365
cost        = kWh × (cents per kWh ÷ 100)
```

All five outputs — daily, monthly and yearly energy, plus monthly and yearly cost — are
calculated client-side and formatted for an Australian audience using `Intl.NumberFormat`
with AUD currency.

### Dynamic results panel
Results render into a `<dl>` inside the page — **never** a browser `alert()`. The same
elements are updated in place on every recalculation, so results are replaced rather than
duplicated. The panel stays hidden until the first valid calculation.

### Input validation
Each field is validated for presence, numeric type and allowed range. Problems are reported
in two places: a message directly beneath the offending field, and a summary in the results
status line. Invalid fields receive `aria-invalid="true"` and a red border, and the status
line uses `role="status"` with `aria-live="polite"` so screen readers announce changes.

### Behaviour after refresh
Input values are saved to `localStorage` and restored on load, so the calculator returns to
its previous state after a page refresh. All storage access is wrapped in `try/catch`, so the
calculator still works normally in private browsing or when storage is blocked.

### JavaScript concepts demonstrated
- Event handling — `submit`, `reset`, `change`, `input` and `blur` listeners
- Reading values from the DOM via `getElementById` and element `.value`
- Calculations performed with JavaScript variables and functions
- Updating existing DOM elements dynamically (`textContent`, `hidden`, `classList`,
  `setAttribute`)
- Defensive handling of invalid input and unavailable browser storage

---

## Accessibility notes

- Skip link to the main content on every page
- Visible keyboard focus styles throughout
- Accordion buttons use `aria-expanded` / `aria-controls`, with panels marked `hidden` by
  default so they are hidden from assistive technology too
- Decorative images use empty `alt` attributes; the logo carries a descriptive one
- `prefers-reduced-motion` is respected — animations and smooth scrolling are disabled
- Colour pairings in the palette were chosen to keep body text legible against its background

---

## Author

**Tri Tran** — Computer Science, Swinburne University of Technology
Repository: <https://github.com/default19-debug/week3_asm>

---

## Generative AI acknowledgement

Generative AI was used in the development of this website. **Claude (Anthropic)** assisted
with drafting the HTML structure, writing the CSS stylesheet, implementing the FAQ accordion
and the energy calculator, and reviewing the code for accessibility and validation issues.

All generated output was reviewed, tested in a browser and adjusted by the author before
inclusion. The author takes full responsibility for the submitted work.

Placeholder statistics throughout the site are illustrative values written for this exercise
and are not sourced from published data.
