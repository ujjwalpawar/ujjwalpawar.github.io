(() => {
  const EMAIL = "U.Pawar@sms.ed.ac.uk";
  const PIPES_URL = "assets/vendor/pipes/index.html#%7B%22hideUI%22%3Atrue%7D";
  const page = document.querySelector("main.page");
  const helpButton = document.querySelector("[data-win95-help]");
  const closeButton = document.querySelector("[data-win95-close]");

  if (!(page instanceof HTMLElement) || !(helpButton instanceof HTMLButtonElement) || !(closeButton instanceof HTMLButtonElement)) {
    return;
  }

  const dialogTemplate = document.createElement("template");
  dialogTemplate.innerHTML = `
    <div class="win95-dialog-layer" hidden>
      <section class="win95-dialog" role="dialog" aria-modal="true" aria-labelledby="win95-contact-title">
        <div class="win95-dialog-titlebar">
          <span id="win95-contact-title">Contact Ujjwal Pawar</span>
          <button class="win95-dialog-close" type="button" aria-label="Close contact window">×</button>
        </div>
        <div class="win95-dialog-body">
          <img src="assets/icons/mail.svg" alt="" aria-hidden="true" />
          <div>
            <p>Send an email to:</p>
            <a href="mailto:${EMAIL}">${EMAIL}</a>
          </div>
        </div>
        <div class="win95-dialog-actions">
          <button class="win95-dialog-ok" type="button">OK</button>
        </div>
      </section>
    </div>
  `;

  const screensaverTemplate = document.createElement("template");
  screensaverTemplate.innerHTML = `
    <div class="win95-screensaver" role="dialog" aria-modal="true" aria-label="Windows 95 3D Pipes screensaver. Press any key or click to return." hidden>
      <iframe title="Classic 3D Pipes screensaver" sandbox="allow-scripts" tabindex="-1"></iframe>
      <div class="win95-screensaver-reduced">3D Pipes paused<br />Press any key or click to return</div>
      <button class="win95-screensaver-exit" type="button" aria-label="Return to website"></button>
      <p class="win95-screensaver-hint">Press any key or click to return</p>
    </div>
  `;

  document.body.append(dialogTemplate.content, screensaverTemplate.content);

  const dialogLayer = document.querySelector(".win95-dialog-layer");
  const dialogClose = document.querySelector(".win95-dialog-close");
  const dialogOk = document.querySelector(".win95-dialog-ok");
  const screensaver = document.querySelector(".win95-screensaver");
  const pipesFrame = screensaver?.querySelector("iframe");
  const exitCatcher = screensaver?.querySelector(".win95-screensaver-exit");

  if (!(dialogLayer instanceof HTMLElement) || !(dialogClose instanceof HTMLButtonElement) || !(dialogOk instanceof HTMLButtonElement) || !(screensaver instanceof HTMLElement) || !(pipesFrame instanceof HTMLIFrameElement) || !(exitCatcher instanceof HTMLButtonElement)) {
    return;
  }

  let previousFocus = helpButton;

  const setPageLocked = (locked) => {
    document.body.classList.toggle("win95-locked", locked);
    page.inert = locked;
  };

  const closeDialog = () => {
    dialogLayer.hidden = true;
    document.removeEventListener("keydown", handleDialogKeydown);
    setPageLocked(false);
    previousFocus.focus();
  };

  const handleDialogKeydown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = [dialogClose, dialogLayer.querySelector("a"), dialogOk].filter((item) => item instanceof HTMLElement);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const openDialog = () => {
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : helpButton;
    dialogLayer.hidden = false;
    setPageLocked(true);
    document.addEventListener("keydown", handleDialogKeydown);
    requestAnimationFrame(() => dialogClose.focus());
  };

  const stopScreensaver = () => {
    if (screensaver.hidden) return;
    screensaver.hidden = true;
    pipesFrame.src = "about:blank";
    document.removeEventListener("keydown", stopScreensaver);
    setPageLocked(false);
    closeButton.focus();
  };

  const startScreensaver = () => {
    if (!dialogLayer.hidden) closeDialog();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    screensaver.classList.toggle("is-reduced", reduceMotion);
    pipesFrame.src = reduceMotion ? "about:blank" : PIPES_URL;
    screensaver.hidden = false;
    setPageLocked(true);
    document.addEventListener("keydown", stopScreensaver);
    requestAnimationFrame(() => exitCatcher.focus({ preventScroll: true }));
  };

  helpButton.addEventListener("click", openDialog);
  closeButton.addEventListener("click", startScreensaver);
  dialogClose.addEventListener("click", closeDialog);
  dialogOk.addEventListener("click", closeDialog);
  exitCatcher.addEventListener("pointerdown", stopScreensaver);
  dialogLayer.addEventListener("pointerdown", (event) => {
    if (event.target === dialogLayer) closeDialog();
  });
})();

(() => {
  const TIPS = [
    {
      text: "SpotLight beats prior Open RAN anomaly detectors by 13% in F1 score.",
      paper: "SpotLight · MobiCom ’24",
      href: "https://doi.org/10.1145/3636534.3649380",
    },
    {
      text: "SpotLight points operators at 2.3–4× fewer KPIs when it explains an anomaly, so they know where to look.",
      paper: "SpotLight · MobiCom ’24",
      href: "https://doi.org/10.1145/3636534.3649380",
    },
    {
      text: "SpotLight flags anomalies at the edge with a lightweight model and confirms them in the cloud, cutting bandwidth by 4–7×.",
      paper: "SpotLight · MobiCom ’24",
      href: "https://doi.org/10.1145/3636534.3649380",
    },
    {
      text: "Campus5G is the first O-RAN-compliant private 5G testbed at campus scale, spread across the University of Edinburgh’s central campus.",
      paper: "Campus5G · SIGCOMM CCR",
      href: "https://doi.org/10.1145/3787927.3787930",
    },
    {
      text: "The Campus5G demo won the Best Demo Award at ACM MobiCom ’25 in Hong Kong.",
      paper: "Campus5G Demo · MobiCom ’25",
      href: "https://doi.org/10.1145/3680207.3765606",
    },
    {
      text: "Campus5G survived Storm Éowyn, an early proof that the deployment can take a beating.",
      paper: "Campus5G Photo Journey",
      href: "campus5g.html",
    },
    {
      text: "You can emulate a whole RAN on the public cloud to test mobile networks at scale without buying racks of hardware.",
      paper: "RAN Emulation · HotMobile ’25",
      href: "https://doi.org/10.1145/3708468.3711895",
    },
    {
      text: "Tuning Cloud RAN compute to the traffic it actually carries saves energy.",
      paper: "Energy Efficient Cloud RANs · GLOBECOM 2021",
      href: "https://doi.org/10.1109/GLOBECOM46510.2021.9685440",
    },
    {
      text: "Predicting cellular traffic lets 5G C-RAN group base stations into clusters before the load arrives.",
      paper: "Proactive Clustering · NetSoft 2022",
      href: "https://doi.org/10.1109/NetSoft54395.2022.9844048",
    },
  ];
  const DISMISS_KEY = "win95-clippy-dismissed";

  const isDismissed = () => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  };

  const template = document.createElement("template");
  template.innerHTML = `
    <aside class="clippy" aria-label="Paper facts assistant">
      <div class="clippy-bubble" role="status" aria-live="polite" hidden>
        <button class="clippy-close" type="button" aria-label="Dismiss assistant">×</button>
        <p class="clippy-heading">Did you know...</p>
        <p class="clippy-text"></p>
        <a class="clippy-paper"></a>
        <div class="clippy-actions">
          <button class="clippy-next" type="button">Next tip</button>
          <button class="clippy-hide" type="button">OK</button>
        </div>
      </div>
      <button class="clippy-character" type="button" aria-label="Show a fact about my papers">
        <svg viewBox="0 0 64 104" aria-hidden="true">
          <path class="clippy-wire" d="M38 40 V80 a8 8 0 0 1 -16 0 V30 a13 13 0 0 1 26 0 V84 a18 18 0 0 1 -36 0 V44" />
          <path class="clippy-brow" d="M14 15 q6 -6 13 -2 M37 13 q7 -4 13 2" />
          <circle class="clippy-eye" cx="21" cy="25" r="7" />
          <circle class="clippy-eye" cx="43" cy="25" r="7" />
          <circle class="clippy-pupil" cx="23" cy="26" r="3" />
          <circle class="clippy-pupil" cx="45" cy="26" r="3" />
        </svg>
      </button>
    </aside>
  `;
  document.body.append(template.content);

  const clippy = document.querySelector(".clippy");
  const bubble = clippy?.querySelector(".clippy-bubble");
  const text = clippy?.querySelector(".clippy-text");
  const paper = clippy?.querySelector(".clippy-paper");
  const character = clippy?.querySelector(".clippy-character");

  if (!(clippy instanceof HTMLElement) || !(bubble instanceof HTMLElement) || !(text instanceof HTMLElement) || !(paper instanceof HTMLAnchorElement) || !(character instanceof HTMLButtonElement)) {
    return;
  }

  let index = Math.floor(Math.random() * TIPS.length);

  const showTip = () => {
    const tip = TIPS[index];
    text.textContent = tip.text;
    paper.textContent = tip.paper;
    paper.href = tip.href;
    bubble.hidden = false;
    clippy.classList.remove("is-bouncing");
    void clippy.offsetWidth;
    clippy.classList.add("is-bouncing");
  };

  const nextTip = () => {
    index = (index + 1) % TIPS.length;
    showTip();
  };

  character.addEventListener("click", () => {
    if (bubble.hidden) showTip();
    else nextTip();
  });
  clippy.querySelector(".clippy-next")?.addEventListener("click", nextTip);
  clippy.querySelector(".clippy-hide")?.addEventListener("click", () => {
    bubble.hidden = true;
  });
  clippy.querySelector(".clippy-close")?.addEventListener("click", () => {
    clippy.hidden = true;
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  });

  if (isDismissed()) {
    clippy.hidden = true;
  } else {
    setTimeout(showTip, 2500);
  }
})();
