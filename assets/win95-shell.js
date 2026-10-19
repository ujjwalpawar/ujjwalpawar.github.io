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
      text: "Campus5G has 20 radio units across 6 university buildings, so most spots on campus see 2–3 cells at once.",
      paper: "Campus5G · SIGCOMM CCR",
      group: "campus5g",
      href: "https://doi.org/10.1145/3787927.3787930",
    },
    {
      text: "Chronos emulates 10,000 base stations and 10,000 phones on 130 cloud instances, two orders of magnitude bigger than existing RAN emulators.",
      paper: "Chronos · MobiCom ’26",
      group: "chronos",
      href: "https://doi.org/10.1145/3795866.3844156",
    },
    {
      text: "Panoramic traced a 5G cell missing radio slots to a Kubernetes audit log being flushed on the same CPU cores. Fixing log rotation fixed the radio.",
      paper: "Panoramic · Open AI-RAN ’26",
      group: "panoramic",
      href: "https://doi.org/10.1145/3842655.3844894",
    },
    {
      text: "Campus5G covers the University of Edinburgh’s central campus, over 50 acres, and won the Best Demo Award at MobiCom ’25.",
      paper: "Campus5G Demo · MobiCom ’25",
      group: "campus5g",
      href: "https://doi.org/10.1145/3680207.3765606",
    },
    {
      text: "Chronos virtualizes emulation time, so cloud hiccups like VM preemption and network latency don’t break the RAN’s sub-millisecond deadlines.",
      paper: "Chronos · MobiCom ’26",
      group: "chronos",
      href: "https://doi.org/10.1145/3795866.3844156",
    },
    {
      text: "Panoramic tags every metric with the cell, server, and switch port it belongs to, so a dropped-throughput alarm can be traced to a faulty switch port.",
      paper: "Panoramic · Open AI-RAN ’26",
      group: "panoramic",
      href: "https://doi.org/10.1145/3842655.3844894",
    },
    {
      text: "SpotLight beats prior Open RAN anomaly detectors by 13% in F1 score.",
      paper: "SpotLight · MobiCom ’24",
      group: "spotlight",
      href: "https://doi.org/10.1145/3636534.3649380",
    },
    {
      text: "The team walked 15 km of walk tests to map Campus5G’s real-world coverage.",
      paper: "Campus5G · SIGCOMM CCR",
      group: "campus5g",
      href: "https://doi.org/10.1145/3787927.3787930",
    },
    {
      text: "Using a lower MCS during quiet hours lets Cloud RAN CPUs clock down, saving 25% energy on average and up to 40% at low load.",
      paper: "Energy Efficient Cloud RANs · GLOBECOM 2021",
      group: "globecom",
      href: "https://doi.org/10.1109/GLOBECOM46510.2021.9685440",
    },
    {
      text: "The first Chronos prototype already emulated 250 base stations and 1,000 UEs on public cloud using 468 CPU cores.",
      paper: "RAN Emulation · HotMobile ’25",
      group: "chronos",
      href: "https://doi.org/10.1145/3708468.3711895",
    },
    {
      text: "SpotLight points operators to 2.3–4× fewer KPIs when explaining an anomaly, and cuts bandwidth by 4–7×.",
      paper: "SpotLight · MobiCom ’24",
      group: "spotlight",
      href: "https://doi.org/10.1145/3636534.3649380",
    },
    {
      text: "Campus5G reaches up to 800 Mbps downlink, and each server has 4 × 100G links for fronthaul.",
      paper: "Campus5G · SIGCOMM CCR",
      group: "campus5g",
      href: "https://doi.org/10.1145/3787927.3787930",
    },
    {
      text: "Predicting traffic first lets 5G C-RAN run up to 18% fewer active CU servers than reactive clustering, without overloading.",
      paper: "Proactive Clustering · NetSoft 2022",
      group: "netsoft",
      href: "https://doi.org/10.1109/NetSoft54395.2022.9844048",
    },
    {
      text: "SpotLight pairs two generative models: JVGAN screens KPIs cheaply at the edge, and MRPI confirms anomalies in the cloud.",
      paper: "SpotLight Demo · MobiCom ’24",
      group: "spotlight",
      href: "https://doi.org/10.1145/3636534.3698854",
    },
    {
      text: "Campus5G survived Storm Éowyn.",
      paper: "Campus5G Photo Journey",
      group: "campus5g",
      href: "campus5g.html",
    },
    {
      text: "Picking 5G numerologies and bandwidth parts to match live traffic cuts delay by up to 36% and packet loss by up to 18.5% compared with a static setup.",
      paper: "Bandwidth Segmentation · ANTS 2021",
      group: "ants",
      href: "https://doi.org/10.1109/ANTS52808.2021.9936957",
    },
    {
      text: "A ConvLSTM trained on two months of Milan mobile data forecasts traffic with up to 26% better RMSE than prior models.",
      paper: "Proactive Clustering · NetSoft 2022",
      group: "netsoft",
      href: "https://doi.org/10.1109/NetSoft54395.2022.9844048",
    },
    {
      text: "On a real OpenAirInterface C-RAN testbed, some lower CPU clock frequencies save energy without hurting throughput.",
      paper: "C-RAN Energy Study · 5GWF 2020",
      group: "5gwf",
      href: "https://ieeexplore.ieee.org/abstract/document/9221114",
    },
  ];
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
        <img class="clippy-sprite" src="assets/vendor/clippy/Default.png" width="124" height="93" alt="" />
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

  // Shuffle so no two tips from the same paper appear back to back, including on wrap-around.
  const shuffle = (items) => {
    let order = items;
    for (let attempt = 0; attempt < 500; attempt += 1) {
      order = [...items];
      for (let i = order.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      if (order.every((tip, i) => tip.group !== order[(i + 1) % order.length].group)) break;
    }
    return order;
  };
  const tips = shuffle(TIPS);
  let index = 0;

  // Animations are looping APNGs; each is shown for its length, then Clippy returns to rest.
  const SPRITES = "assets/vendor/clippy/";
  const ANIMATIONS = {
    Greeting: 4450,
    Explain: 1500,
    GoodBye: 4450,
    GetAttention: 2650,
    LookLeft: 1800,
    LookRight: 1800,
    LookUp: 1800,
    LookDown: 1800,
    LookUpLeft: 1800,
    LookUpRight: 1800,
    LookDownLeft: 1800,
    LookDownRight: 1800,
    IdleEyeBrowRaise: 1500,
    IdleHeadScratch: 1900,
    IdleSideToSide: 5700,
    IdleFingerTap: 1150,
    IdleAtom: 4500,
  };
  const IDLES = ["IdleEyeBrowRaise", "IdleHeadScratch", "IdleSideToSide", "IdleFingerTap", "IdleAtom"];
  const sprite = clippy.querySelector(".clippy-sprite");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const blobs = {};
  let restTimer = 0;
  let busyUntil = 0;
  let plays = 0;
  let spriteUrl = "";

  // A fresh URL restarts the APNG from its first frame; blob URLs avoid refetching it.
  const freshUrl = async (name) => {
    try {
      blobs[name] ??= await fetch(`${SPRITES}${name}.png`).then((response) => response.blob());
      return URL.createObjectURL(blobs[name]);
    } catch {
      plays += 1;
      return `${SPRITES}${name}.png?play=${plays}`;
    }
  };

  const setSprite = (url) => {
    if (spriteUrl.startsWith("blob:")) URL.revokeObjectURL(spriteUrl);
    spriteUrl = url;
    sprite.src = url;
  };

  const play = async (name, { force = false, done } = {}) => {
    if (!(sprite instanceof HTMLImageElement) || reduceMotion) {
      done?.();
      return;
    }
    if (!force && Date.now() < busyUntil) return;
    busyUntil = Date.now() + ANIMATIONS[name];
    clearTimeout(restTimer);
    setSprite(await freshUrl(name));
    restTimer = setTimeout(() => {
      setSprite(`${SPRITES}Default.png`);
      busyUntil = 0;
      done?.();
    }, ANIMATIONS[name]);
  };

  let greeted = false;
  let opening = false;

  const fillTip = () => {
    const tip = tips[index];
    text.textContent = tip.text;
    paper.textContent = tip.paper;
    if (tip.href) paper.href = tip.href;
    else paper.removeAttribute("href");
  };

  // Automatic greetings open after the animation; direct clicks reveal the bubble immediately.
  const showTip = ({ immediate = false } = {}) => {
    fillTip();
    const animation = greeted ? "Explain" : "Greeting";
    greeted = true;
    if (!bubble.hidden) {
      play(animation, { force: true });
      return;
    }
    if (opening) return;
    if (immediate) {
      bubble.hidden = false;
      play(animation, { force: true });
      return;
    }
    opening = true;
    play(animation, {
      force: true,
      done: () => {
        opening = false;
        if (!clippy.hidden) bubble.hidden = false;
      },
    });
  };

  const nextTip = () => {
    index = (index + 1) % tips.length;
    showTip();
  };

  // Clippy looks toward the pointer when it moves to a new side of him.
  let lastLook = "";
  let lastLookAt = 0;
  document.addEventListener("pointermove", (event) => {
    if (clippy.hidden || !(sprite instanceof HTMLImageElement)) return;
    const box = sprite.getBoundingClientRect();
    const vx = event.clientX - (box.left + box.width / 2);
    const vy = event.clientY - (box.top + box.height * 0.35);
    if (Math.hypot(vx, vy) < 90) return;
    const vertical = vy < -box.height ? "Up" : vy > box.height ? "Down" : "";
    const horizontal = vx < -box.width / 2 ? "Left" : vx > box.width / 2 ? "Right" : "";
    const look = `Look${vertical}${horizontal}`;
    if (look === "Look") return;
    if (look === lastLook && Date.now() - lastLookAt < 8000) return;
    if (Date.now() < busyUntil) return;
    lastLook = look;
    lastLookAt = Date.now();
    play(look);
  });

  if (!reduceMotion) {
    setInterval(() => {
      if (!clippy.hidden && Math.random() < 0.5) play(IDLES[Math.floor(Math.random() * IDLES.length)]);
    }, 15000);
  }

  character.addEventListener("click", () => {
    if (bubble.hidden) showTip({ immediate: true });
    else nextTip();
  });
  clippy.querySelector(".clippy-next")?.addEventListener("click", nextTip);
  clippy.querySelector(".clippy-hide")?.addEventListener("click", () => {
    bubble.hidden = true;
  });
  clippy.querySelector(".clippy-close")?.addEventListener("click", () => {
    bubble.hidden = true;
    play("GoodBye", {
      force: true,
      done: () => {
        clippy.hidden = true;
      },
    });
  });

  const desktopLayout = window.matchMedia("(min-width: 1180px)");
  desktopLayout.addEventListener?.("change", (event) => {
    if (!event.matches) bubble.hidden = true;
  });
  if (desktopLayout.matches) {
    setTimeout(() => {
      if (desktopLayout.matches) showTip();
    }, 2500);
  }
})();
