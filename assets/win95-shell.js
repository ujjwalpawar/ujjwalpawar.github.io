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
      text: "Campus5G reaches up to 800 Mbps downlink, and each server has 200 Gbps of network capacity for fronthaul.",
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
        <svg viewBox="0 0 23 50" shape-rendering="crispEdges" aria-hidden="true"><path fill="#14171c" d="M12 5h1v1h-1zM11 6h1v1h-1zM12 8h1v1h-1zM11 9h1v1h-1zM21 9h1v1h-1zM22 10h1v1h-1zM22 11h1v1h-1zM22 12h1v1h-1zM6 13h1v1h-1zM9 13h1v1h-1zM19 13h1v1h-1zM22 13h1v1h-1zM6 14h1v1h-1zM8 14h1v1h-1zM20 14h1v1h-1zM22 14h1v1h-1zM6 15h1v1h-1zM8 15h1v1h-1zM20 15h1v1h-1zM22 15h1v1h-1zM6 16h1v1h-1zM8 16h1v1h-1zM15 16h1v1h-1zM20 16h1v1h-1zM22 16h1v1h-1zM6 17h1v1h-1zM8 17h1v1h-1zM14 17h1v1h-1zM16 17h1v1h-1zM20 17h1v1h-1zM22 17h1v1h-1zM6 18h1v1h-1zM8 18h1v1h-1zM14 18h1v1h-1zM16 18h1v1h-1zM20 18h1v1h-1zM22 18h1v1h-1zM6 19h1v1h-1zM8 19h1v1h-1zM14 19h1v1h-1zM16 19h1v1h-1zM20 19h1v1h-1zM22 19h1v1h-1zM1 20h1v1h-1zM6 20h1v1h-1zM8 20h1v1h-1zM14 20h1v1h-1zM16 20h1v1h-1zM20 20h1v1h-1zM22 20h1v1h-1zM0 21h1v1h-1zM2 21h1v1h-1zM6 21h1v1h-1zM8 21h1v1h-1zM14 21h1v1h-1zM16 21h1v1h-1zM20 21h1v1h-1zM22 21h1v1h-1zM0 22h1v1h-1zM2 22h1v1h-1zM6 22h1v1h-1zM8 22h1v1h-1zM14 22h1v1h-1zM16 22h1v1h-1zM20 22h1v1h-1zM22 22h1v1h-1zM0 23h1v1h-1zM2 23h1v1h-1zM6 23h1v1h-1zM8 23h1v1h-1zM14 23h1v1h-1zM16 23h1v1h-1zM20 23h1v1h-1zM22 23h1v1h-1zM0 24h1v1h-1zM2 24h1v1h-1zM6 24h1v1h-1zM8 24h1v1h-1zM14 24h1v1h-1zM16 24h1v1h-1zM20 24h1v1h-1zM22 24h1v1h-1zM0 25h1v1h-1zM2 25h1v1h-1zM6 25h1v1h-1zM8 25h1v1h-1zM14 25h1v1h-1zM16 25h1v1h-1zM20 25h1v1h-1zM22 25h1v1h-1zM0 26h1v1h-1zM2 26h1v1h-1zM6 26h1v1h-1zM8 26h1v1h-1zM14 26h1v1h-1zM16 26h1v1h-1zM20 26h1v1h-1zM22 26h1v1h-1zM0 27h1v1h-1zM2 27h1v1h-1zM6 27h1v1h-1zM8 27h1v1h-1zM14 27h1v1h-1zM16 27h1v1h-1zM20 27h1v1h-1zM22 27h1v1h-1zM0 28h1v1h-1zM2 28h1v1h-1zM6 28h1v1h-1zM8 28h1v1h-1zM14 28h1v1h-1zM16 28h1v1h-1zM20 28h1v1h-1zM22 28h1v1h-1zM0 29h1v1h-1zM2 29h1v1h-1zM6 29h1v1h-1zM8 29h1v1h-1zM14 29h1v1h-1zM16 29h1v1h-1zM20 29h1v1h-1zM22 29h1v1h-1zM0 30h1v1h-1zM2 30h1v1h-1zM6 30h1v1h-1zM8 30h1v1h-1zM14 30h1v1h-1zM16 30h1v1h-1zM20 30h1v1h-1zM22 30h1v1h-1zM0 31h1v1h-1zM2 31h1v1h-1zM6 31h1v1h-1zM8 31h1v1h-1zM14 31h1v1h-1zM16 31h1v1h-1zM20 31h1v1h-1zM22 31h1v1h-1zM0 32h1v1h-1zM2 32h1v1h-1zM6 32h1v1h-1zM8 32h1v1h-1zM14 32h1v1h-1zM16 32h1v1h-1zM20 32h1v1h-1zM22 32h1v1h-1zM0 33h1v1h-1zM2 33h1v1h-1zM6 33h1v1h-1zM8 33h1v1h-1zM14 33h1v1h-1zM16 33h1v1h-1zM20 33h1v1h-1zM22 33h1v1h-1zM0 34h1v1h-1zM2 34h1v1h-1zM6 34h1v1h-1zM9 34h1v1h-1zM13 34h1v1h-1zM16 34h1v1h-1zM20 34h1v1h-1zM22 34h1v1h-1zM0 35h1v1h-1zM2 35h1v1h-1zM6 35h1v1h-1zM9 35h1v1h-1zM13 35h1v1h-1zM16 35h1v1h-1zM20 35h1v1h-1zM22 35h1v1h-1zM0 36h1v1h-1zM2 36h1v1h-1zM6 36h1v1h-1zM10 36h1v1h-1zM11 36h1v1h-1zM12 36h1v1h-1zM16 36h1v1h-1zM20 36h1v1h-1zM22 36h1v1h-1zM0 37h1v1h-1zM2 37h1v1h-1zM7 37h1v1h-1zM15 37h1v1h-1zM20 37h1v1h-1zM22 37h1v1h-1zM0 38h1v1h-1zM3 38h1v1h-1zM8 38h1v1h-1zM14 38h1v1h-1zM19 38h1v1h-1zM22 38h1v1h-1zM0 39h1v1h-1zM3 39h1v1h-1zM9 39h1v1h-1zM10 39h1v1h-1zM11 39h1v1h-1zM12 39h1v1h-1zM13 39h1v1h-1zM19 39h1v1h-1zM22 39h1v1h-1zM0 40h1v1h-1zM3 40h1v1h-1zM19 40h1v1h-1zM22 40h1v1h-1zM0 41h1v1h-1zM3 41h1v1h-1zM19 41h1v1h-1zM22 41h1v1h-1zM0 42h1v1h-1zM4 42h1v1h-1zM18 42h1v1h-1zM22 42h1v1h-1zM1 43h1v1h-1zM4 43h1v1h-1zM18 43h1v1h-1zM21 43h1v1h-1zM2 44h1v1h-1zM5 44h1v1h-1zM6 44h1v1h-1zM16 44h1v1h-1zM17 44h1v1h-1zM20 44h1v1h-1zM2 45h1v1h-1zM7 45h1v1h-1zM8 45h1v1h-1zM14 45h1v1h-1zM15 45h1v1h-1zM20 45h1v1h-1zM3 46h1v1h-1zM4 46h1v1h-1zM9 46h1v1h-1zM10 46h1v1h-1zM11 46h1v1h-1zM12 46h1v1h-1zM13 46h1v1h-1zM18 46h1v1h-1zM19 46h1v1h-1zM5 47h1v1h-1zM17 47h1v1h-1zM6 48h1v1h-1zM7 48h1v1h-1zM15 48h1v1h-1zM16 48h1v1h-1zM8 49h1v1h-1zM9 49h1v1h-1zM10 49h1v1h-1zM11 49h1v1h-1zM12 49h1v1h-1zM13 49h1v1h-1zM14 49h1v1h-1z" /><path fill="#000000" d="M5 0h1v1h-1zM6 0h1v1h-1zM7 0h1v1h-1zM8 0h1v1h-1zM15 0h1v1h-1zM16 0h1v1h-1zM17 0h1v1h-1zM18 0h1v1h-1zM5 1h1v1h-1zM6 1h1v1h-1zM7 1h1v1h-1zM8 1h1v1h-1zM15 1h1v1h-1zM16 1h1v1h-1zM17 1h1v1h-1zM18 1h1v1h-1zM4 2h1v1h-1zM9 2h1v1h-1zM14 2h1v1h-1zM19 2h1v1h-1zM3 3h1v1h-1zM10 3h1v1h-1zM13 3h1v1h-1zM20 3h1v1h-1zM3 5h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM9 5h1v1h-1zM10 5h1v1h-1zM13 5h1v1h-1zM14 5h1v1h-1zM15 5h1v1h-1zM16 5h1v1h-1zM17 5h1v1h-1zM18 5h1v1h-1zM19 5h1v1h-1zM20 5h1v1h-1zM3 6h1v1h-1zM10 6h1v1h-1zM13 6h1v1h-1zM20 6h1v1h-1zM3 7h1v1h-1zM10 7h1v1h-1zM13 7h1v1h-1zM20 7h1v1h-1zM3 8h1v1h-1zM10 8h1v1h-1zM13 8h1v1h-1zM20 8h1v1h-1zM3 9h1v1h-1zM10 9h1v1h-1zM13 9h1v1h-1zM20 9h1v1h-1zM3 10h1v1h-1zM10 10h1v1h-1zM13 10h1v1h-1zM20 10h1v1h-1zM3 11h1v1h-1zM10 11h1v1h-1zM13 11h1v1h-1zM20 11h1v1h-1zM3 12h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM6 12h1v1h-1zM7 12h1v1h-1zM8 12h1v1h-1zM9 12h1v1h-1zM10 12h1v1h-1zM13 12h1v1h-1zM14 12h1v1h-1zM15 12h1v1h-1zM16 12h1v1h-1zM17 12h1v1h-1zM18 12h1v1h-1zM19 12h1v1h-1zM20 12h1v1h-1z" /><path fill="#a9b2bb" d="M8 36h1v1h-1zM14 36h1v1h-1zM9 37h1v1h-1zM13 37h1v1h-1zM2 42h1v1h-1zM20 42h1v1h-1zM6 46h1v1h-1zM16 46h1v1h-1zM8 47h1v1h-1zM14 47h1v1h-1z" /><path fill="#6b7580" d="M12 7h1v1h-1zM11 8h1v1h-1zM21 11h1v1h-1zM21 12h1v1h-1zM8 13h1v1h-1zM21 13h1v1h-1zM15 34h1v1h-1zM8 35h1v1h-1zM15 35h1v1h-1zM15 36h1v1h-1zM14 37h1v1h-1zM10 38h1v1h-1zM11 38h1v1h-1zM12 38h1v1h-1zM13 38h1v1h-1zM21 38h1v1h-1zM2 39h1v1h-1zM21 39h1v1h-1zM2 40h1v1h-1zM21 40h1v1h-1zM2 41h1v1h-1zM21 41h1v1h-1zM21 42h1v1h-1zM3 43h1v1h-1zM20 43h1v1h-1zM19 44h1v1h-1zM4 45h1v1h-1zM18 45h1v1h-1zM19 45h1v1h-1zM17 46h1v1h-1zM7 47h1v1h-1zM15 47h1v1h-1zM16 47h1v1h-1zM9 48h1v1h-1zM10 48h1v1h-1zM11 48h1v1h-1zM12 48h1v1h-1zM13 48h1v1h-1zM14 48h1v1h-1z" /><path fill="#f2f5f7" d="M12 6h1v1h-1zM11 7h1v1h-1zM21 10h1v1h-1zM7 13h1v1h-1zM20 13h1v1h-1zM7 14h1v1h-1zM21 14h1v1h-1zM7 15h1v1h-1zM21 15h1v1h-1zM7 16h1v1h-1zM21 16h1v1h-1zM7 17h1v1h-1zM15 17h1v1h-1zM21 17h1v1h-1zM7 18h1v1h-1zM15 18h1v1h-1zM21 18h1v1h-1zM7 19h1v1h-1zM15 19h1v1h-1zM21 19h1v1h-1zM7 20h1v1h-1zM15 20h1v1h-1zM21 20h1v1h-1zM1 21h1v1h-1zM7 21h1v1h-1zM15 21h1v1h-1zM21 21h1v1h-1zM1 22h1v1h-1zM7 22h1v1h-1zM15 22h1v1h-1zM21 22h1v1h-1zM1 23h1v1h-1zM7 23h1v1h-1zM15 23h1v1h-1zM21 23h1v1h-1zM1 24h1v1h-1zM7 24h1v1h-1zM15 24h1v1h-1zM21 24h1v1h-1zM1 25h1v1h-1zM7 25h1v1h-1zM15 25h1v1h-1zM21 25h1v1h-1zM1 26h1v1h-1zM7 26h1v1h-1zM15 26h1v1h-1zM21 26h1v1h-1zM1 27h1v1h-1zM7 27h1v1h-1zM15 27h1v1h-1zM21 27h1v1h-1zM1 28h1v1h-1zM7 28h1v1h-1zM15 28h1v1h-1zM21 28h1v1h-1zM1 29h1v1h-1zM7 29h1v1h-1zM15 29h1v1h-1zM21 29h1v1h-1zM1 30h1v1h-1zM7 30h1v1h-1zM15 30h1v1h-1zM21 30h1v1h-1zM1 31h1v1h-1zM7 31h1v1h-1zM15 31h1v1h-1zM21 31h1v1h-1zM1 32h1v1h-1zM7 32h1v1h-1zM15 32h1v1h-1zM21 32h1v1h-1zM1 33h1v1h-1zM7 33h1v1h-1zM15 33h1v1h-1zM21 33h1v1h-1zM1 34h1v1h-1zM7 34h1v1h-1zM8 34h1v1h-1zM14 34h1v1h-1zM21 34h1v1h-1zM1 35h1v1h-1zM7 35h1v1h-1zM14 35h1v1h-1zM21 35h1v1h-1zM1 36h1v1h-1zM7 36h1v1h-1zM9 36h1v1h-1zM13 36h1v1h-1zM21 36h1v1h-1zM1 37h1v1h-1zM8 37h1v1h-1zM10 37h1v1h-1zM11 37h1v1h-1zM12 37h1v1h-1zM21 37h1v1h-1zM1 38h1v1h-1zM2 38h1v1h-1zM9 38h1v1h-1zM20 38h1v1h-1zM1 39h1v1h-1zM20 39h1v1h-1zM1 40h1v1h-1zM20 40h1v1h-1zM1 41h1v1h-1zM20 41h1v1h-1zM1 42h1v1h-1zM3 42h1v1h-1zM19 42h1v1h-1zM2 43h1v1h-1zM19 43h1v1h-1zM3 44h1v1h-1zM4 44h1v1h-1zM18 44h1v1h-1zM3 45h1v1h-1zM5 45h1v1h-1zM6 45h1v1h-1zM16 45h1v1h-1zM17 45h1v1h-1zM5 46h1v1h-1zM7 46h1v1h-1zM8 46h1v1h-1zM14 46h1v1h-1zM15 46h1v1h-1zM6 47h1v1h-1zM9 47h1v1h-1zM10 47h1v1h-1zM11 47h1v1h-1zM12 47h1v1h-1zM13 47h1v1h-1zM8 48h1v1h-1z" /><rect class="clippy-eye-white" x="4" y="6" width="6" height="6" fill="#ffffff" /><rect class="clippy-eye-white" x="14" y="6" width="6" height="6" fill="#ffffff" /><g class="clippy-pupils"><rect x="6" y="7" width="2" height="3" fill="#000000" /><rect x="16" y="7" width="2" height="3" fill="#000000" /></g><g class="clippy-lids"><rect x="4" y="6" width="6" height="4" fill="#c9d0d6" /><rect x="4" y="10" width="6" height="1" fill="#000000" /><rect x="4" y="11" width="6" height="1" fill="#c9d0d6" /><rect x="14" y="6" width="6" height="4" fill="#c9d0d6" /><rect x="14" y="10" width="6" height="1" fill="#000000" /><rect x="14" y="11" width="6" height="1" fill="#c9d0d6" /></g></svg>
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

  const showTip = () => {
    const tip = tips[index];
    text.textContent = tip.text;
    paper.textContent = tip.paper;
    if (tip.href) paper.href = tip.href;
    else paper.removeAttribute("href");
    bubble.hidden = false;
    clippy.classList.remove("is-bouncing");
    void clippy.offsetWidth;
    clippy.classList.add("is-bouncing");
  };

  const nextTip = () => {
    index = (index + 1) % tips.length;
    showTip();
  };

  // Pupils follow the pointer; with no pointer around, Clippy glances and blinks on its own.
  const pupils = clippy.querySelector(".clippy-pupils");
  let lastPointer = 0;

  const look = (dx, dy) => {
    pupils?.setAttribute("transform", `translate(${dx} ${dy})`);
  };

  document.addEventListener("pointermove", (event) => {
    lastPointer = Date.now();
    const box = character.getBoundingClientRect();
    const vx = event.clientX - (box.left + box.width / 2);
    const vy = event.clientY - (box.top + box.height * 0.2);
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    look(clamp(Math.round(vx / 120), -2, 2), clamp(Math.round(vy / 160), -1, 2));
  });

  const blink = () => {
    clippy.classList.add("is-blinking");
    setTimeout(() => clippy.classList.remove("is-blinking"), 140);
  };

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(() => {
      if (Math.random() < 0.6) blink();
      if (Date.now() - lastPointer > 4000) {
        const glances = [[-2, 0], [-2, 1], [0, 0], [1, -1], [-1, 2]];
        look(...glances[Math.floor(Math.random() * glances.length)]);
      }
    }, 3000);
  }

  look(-2, 0);

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
