// Whittle for Mac: the page's working fragments and its entrances.

const GB = 1e9;
const TOTAL = 494 * GB;
const USED = 374 * GB;

function formatSize(bytes) {
  // Like the app: up to two decimals, no trailing zeros.
  if (bytes >= GB) return `${Number((bytes / GB).toFixed(2))} GB`;
  return `${Math.round(bytes / 1e6)} MB`;
}

// Smart Scan: ticking rows changes the hatched part of the bar and the button.
const scan = document.getElementById("scan");
if (scan) {
  const rows = [...scan.querySelectorAll("#scan-rows input")];
  const move = document.getElementById("scan-move");
  const hatch = document.getElementById("bar-hatch");
  const used = document.getElementById("bar-used");
  const bar = document.getElementById("disk-bar");
  const ready = document.getElementById("legend-ready");
  const done = document.getElementById("scan-done");
  const doneTitle = document.getElementById("done-title");
  const putBack = document.getElementById("scan-putback");
  let moved = [];

  const update = () => {
    const live = rows.filter((input) => !input.closest("li").classList.contains("is-gone"));
    const ticked = live.filter((input) => input.checked);
    const bytes = ticked.reduce((sum, input) => sum + Number(input.dataset.bytes), 0);
    used.style.width = `${((USED - bytes) / TOTAL) * 100}%`;
    hatch.style.width = `${(bytes / TOTAL) * 100}%`;
    ready.textContent = formatSize(bytes);
    move.textContent = bytes > 0 ? `Move ${formatSize(bytes)} to Trash` : "Move to Trash";
    move.disabled = bytes === 0;
    bar.setAttribute("aria-label", `Used 374 GB, of which ${formatSize(bytes)} can be cleaned. Free 120 GB.`);
  };

  rows.forEach((input) => input.addEventListener("change", update));

  move.addEventListener("click", () => {
    moved = rows.filter((input) => input.checked && !input.closest("li").classList.contains("is-gone"));
    if (!moved.length) return;
    const bytes = moved.reduce((sum, input) => sum + Number(input.dataset.bytes), 0);
    moved.forEach((input) => input.closest("li").classList.add("is-gone"));
    doneTitle.textContent = `Moved ${formatSize(bytes)} to the Trash`;
    putBack.textContent = `Put back ${moved.length} ${moved.length === 1 ? "item" : "items"}`;
    done.hidden = false;
    update();
    putBack.focus();
  });

  putBack.addEventListener("click", () => {
    moved.forEach((input) => input.closest("li").classList.remove("is-gone"));
    moved = [];
    done.hidden = true;
    update();
    move.focus();
  });

  // Start from an empty bar so the first fill is seen.
  requestAnimationFrame(() => requestAnimationFrame(update));
}

// Inside Whittle: the screen names switch the screenshot.
const tabs = [...document.querySelectorAll(".screens [role=tab]")];
const shot = document.querySelector(".shot");
const shotImg = document.getElementById("shot-img");
const shotDark = document.getElementById("shot-dark");
const note = document.getElementById("screen-note");
const alts = {
  "overview": "Whittle's Overview screen with demo data: 15.63 GB ready to clean, Macintosh HD with 120 GB available, and live CPU, memory and network.",
  "smart-scan": "Smart Scan results: user caches and logs with sizes, nine items ticked, and a button to move 15.63 GB to the Trash.",
  "large-old": "Large and old files: macOS Installer.dmg 13 GB, Trip 2019.mov 8.2 GB and others, listed by size and last opened date, none ticked.",
  "space-lens": "Space Lens: a tile map of the home folder, Movies 182 GB, Library 96 GB, Pictures 64 GB, with a size list beside it.",
  "duplicates": "Duplicates: Wedding.mov in three places and Taxes 2024.pdf in two, with one copy ticked and the rest kept.",
  "uninstaller": "Uninstaller: Slack selected, with its cache, settings and saved window state ticked, and its app data marked Check first.",
  "history": "History: past cleanups with dates and sizes, one with Put back 2 items, and a Trash emptied entry that can't be undone.",
};

function select(tab, focus) {
  tabs.forEach((other) => {
    const on = other === tab;
    other.setAttribute("aria-selected", String(on));
    other.tabIndex = on ? 0 : -1;
  });
  if (focus) tab.focus();
  const name = tab.dataset.shot;
  note.textContent = tab.dataset.note;
  shot.classList.add("is-swapping");
  setTimeout(() => {
    shotImg.src = `img/${name}-light.jpg`;
    shotDark.srcset = `img/${name}-dark.jpg`;
    shotImg.alt = alts[name];
    shot.classList.remove("is-swapping");
  }, 200);
  tab.scrollIntoView({ block: "nearest", inline: "nearest" });
}

tabs.forEach((tab, index) => {
  tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
  tab.addEventListener("click", () => select(tab, false));
  tab.addEventListener("keydown", (event) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    select(tabs[(index + step + tabs.length) % tabs.length], true);
  });
});
Object.keys(alts).forEach((name) => { new Image().src = `img/${name}-light.jpg`; });

// Menu bar: each switch fills its band.
document.querySelectorAll(".switch").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const on = toggle.getAttribute("aria-checked") !== "true";
    toggle.setAttribute("aria-checked", String(on));
    toggle.closest(".band").classList.toggle("is-on", on);
  });
});

// Download: the app's language.
const preview = document.getElementById("lang-preview");
const langNote = document.getElementById("lang-note");
const words = {
  en: ["Move 15.63 GB to Trash", "It follows your Mac's language."],
  id: ["Pindahkan 15,63 GB ke Tong Sampah", "Mengikuti bahasa Mac Anda."],
};
document.querySelectorAll(".segmented [role=radio]").forEach((choice, index, all) => {
  choice.addEventListener("click", () => {
    all.forEach((other) => other.setAttribute("aria-checked", String(other === choice)));
    const [label, line] = words[choice.dataset.lang];
    preview.textContent = label;
    langNote.textContent = line;
  });
  choice.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = all[(index + 1) % all.length];
    next.click();
    next.focus();
  });
});

// Entrances: each part of a section rises in turn, once.
const reveal = [...document.querySelectorAll(".reveal")];
const groups = new Map();
reveal.forEach((element) => {
  const section = element.closest("section") || document.body;
  const index = groups.get(section) || 0;
  element.style.setProperty("--i", index);
  groups.set(section, index + 1);
});
const stage = document.querySelector(".hero-stage");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add(entry.target === stage ? "is-open" : "is-in");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  reveal.forEach((element) => observer.observe(element));
  if (stage) observer.observe(stage);
} else {
  reveal.forEach((element) => element.classList.add("is-in"));
  if (stage) stage.classList.add("is-open");
}
