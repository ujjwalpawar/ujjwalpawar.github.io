(() => {
  const EMAIL = "U.Pawar@sms.ed.ac.uk";
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
      <canvas aria-hidden="true"></canvas>
      <p class="win95-screensaver-hint">Press any key or click to return</p>
    </div>
  `;

  document.body.append(dialogTemplate.content, screensaverTemplate.content);

  const dialogLayer = document.querySelector(".win95-dialog-layer");
  const dialogClose = document.querySelector(".win95-dialog-close");
  const dialogOk = document.querySelector(".win95-dialog-ok");
  const screensaver = document.querySelector(".win95-screensaver");
  const canvas = screensaver?.querySelector("canvas");

  if (!(dialogLayer instanceof HTMLElement) || !(dialogClose instanceof HTMLButtonElement) || !(dialogOk instanceof HTMLButtonElement) || !(screensaver instanceof HTMLElement) || !(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const context = canvas.getContext("2d");
  let previousFocus = helpButton;
  let frameId = 0;
  let lastStepAt = 0;
  let segmentCount = 0;
  let pipes = [];

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

  const randomPipe = () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    direction: Math.floor(Math.random() * 4),
    hue: Math.floor(Math.random() * 360),
  });

  const resetCanvas = () => {
    if (!context) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.fillStyle = "#000000";
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    pipes = Array.from({ length: 6 }, randomPipe);
    segmentCount = 0;
  };

  const drawJoint = (x, y, hue) => {
    if (!context) return;
    const gradient = context.createRadialGradient(x - 3, y - 3, 1, x, y, 10);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.3, `hsl(${hue} 90% 65%)`);
    gradient.addColorStop(1, `hsl(${hue} 85% 20%)`);
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, 10, 0, Math.PI * 2);
    context.fill();
  };

  const drawSegment = (pipe) => {
    if (!context) return;
    if (Math.random() < 0.38) {
      pipe.direction = (pipe.direction + (Math.random() < 0.5 ? 1 : 3)) % 4;
      drawJoint(pipe.x, pipe.y, pipe.hue);
    }

    const vectors = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    const [dx, dy] = vectors[pipe.direction];
    const distance = 34;
    const nextX = pipe.x + dx * distance;
    const nextY = pipe.y + dy * distance;

    if (nextX < -20 || nextX > window.innerWidth + 20 || nextY < -20 || nextY > window.innerHeight + 20) {
      Object.assign(pipe, randomPipe());
      return;
    }

    context.lineCap = "round";
    context.beginPath();
    context.moveTo(pipe.x, pipe.y);
    context.lineTo(nextX, nextY);
    context.strokeStyle = `hsl(${pipe.hue} 85% 18%)`;
    context.lineWidth = 18;
    context.stroke();
    context.strokeStyle = `hsl(${pipe.hue} 86% 54%)`;
    context.lineWidth = 12;
    context.stroke();
    context.strokeStyle = "rgba(255,255,255,0.65)";
    context.lineWidth = 3;
    context.stroke();
    pipe.x = nextX;
    pipe.y = nextY;
    segmentCount += 1;
  };

  const animatePipes = (time) => {
    if (time - lastStepAt > 75) {
      pipes.forEach(drawSegment);
      lastStepAt = time;
      if (segmentCount > 720) resetCanvas();
    }
    frameId = requestAnimationFrame(animatePipes);
  };

  const stopScreensaver = () => {
    if (screensaver.hidden) return;
    cancelAnimationFrame(frameId);
    screensaver.hidden = true;
    screensaver.removeEventListener("pointerdown", stopScreensaver);
    document.removeEventListener("keydown", stopScreensaver);
    window.removeEventListener("resize", resetCanvas);
    setPageLocked(false);
    closeButton.focus();
  };

  const startScreensaver = () => {
    if (!dialogLayer.hidden) closeDialog();
    screensaver.hidden = false;
    setPageLocked(true);
    resetCanvas();
    screensaver.addEventListener("pointerdown", stopScreensaver);
    document.addEventListener("keydown", stopScreensaver);
    window.addEventListener("resize", resetCanvas);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (let index = 0; index < 18; index += 1) pipes.forEach(drawSegment);
      return;
    }

    frameId = requestAnimationFrame(animatePipes);
  };

  helpButton.addEventListener("click", openDialog);
  closeButton.addEventListener("click", startScreensaver);
  dialogClose.addEventListener("click", closeDialog);
  dialogOk.addEventListener("click", closeDialog);
  dialogLayer.addEventListener("pointerdown", (event) => {
    if (event.target === dialogLayer) closeDialog();
  });
})();
