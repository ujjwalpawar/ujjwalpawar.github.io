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
