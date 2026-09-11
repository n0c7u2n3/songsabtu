"use strict";
/* Shared desktop/window lifecycle. Apps own content; the shell owns all chrome. */
const Shell = (() => {
  const desktop = document.querySelector("#desktop");
  const layer = document.querySelector("#windows");
  const tasks = document.querySelector("#tasks");
  const popup = document.querySelector("#popup");
  const start = document.querySelector("#start-menu");
  const startButton = document.querySelector("#start-button");
  const windows = new Map();
  let z = 20,
    active = null,
    cascade = 0;
  const icons = {
    computer: "assets/computer_explorer-4.png",
    disc: "assets/cd_audio_cd_a-4.png",
    folder: "assets/directory_closed-4.png",
    note: "assets/notepad-0.png",
    browser: "assets/msie1-2.png",
    mail: "assets/envelope_closed-0.png",
    recorder: "assets/microphone_2-0.png",
    display: "assets/display_properties-1.png",
    chat: "Logo_ICQ.svg.png",
    aim: "assets/Aim.png",
    sims: "assets/051928341be67dcba03f0e04104d9047.png",
    ski: "assets/3216817-icon_ski.png",
    lime: "assets/LimeWire.png",
    player: "assets/media_player-0.png",
    help: "assets/help_book_cool-4.png",
  };
  function el(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function img(src) {
    const n = el("img");
    n.src = icons[src] || src;
    n.alt = "";
    n.draggable = false;
    return n;
  }
  function button(label, action, className = "") {
    const n = el("button", className, label);
    n.type = "button";
    if (action) n.addEventListener("click", action);
    return n;
  }
  function read(key, fallback = "") {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  }
  function save(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }
  function announce(text) {
    document.querySelector("#announcer").textContent = text;
  }
  function closeMenus() {
    popup.hidden = true;
    start.hidden = true;
    startButton.classList.remove("pressed");
    startButton.setAttribute("aria-expanded", "false");
    document
      .querySelectorAll(".menubar button")
      .forEach((b) => b.setAttribute("aria-expanded", "false"));
  }
  function focus(w) {
    if (!w || !windows.has(w.id)) return;
    for (const other of windows.values()) {
      other.node.classList.remove("active");
      other.task.classList.remove("active");
    }
    w.node.hidden = false;
    w.node.classList.add("active");
    w.task.classList.add("active");
    w.node.style.zIndex = ++z;
    active = w;
  }
  function nextFocus() {
    const remaining = [...windows.values()]
      .filter((w) => !w.node.hidden)
      .sort((a, b) => +b.node.style.zIndex - +a.node.style.zIndex);
    active = null;
    if (remaining[0]) focus(remaining[0]);
  }
  function minimize(w) {
    w.node.hidden = true;
    w.task.classList.remove("active");
    if (active === w) nextFocus();
  }
  function close(w) {
    if (w.beforeClose && w.beforeClose() === false) return;
    w.dispose?.();
    w.node.remove();
    w.task.remove();
    windows.delete(w.id);
    if (active === w) nextFocus();
    announce(w.title + " closed");
  }
  function maximize(w) {
    w.node.classList.toggle("maximized");
    const on = w.node.classList.contains("maximized");
    w.maxButton.title = on ? "Restore" : "Maximize";
    w.maxButton.setAttribute("aria-label", w.maxButton.title);
    focus(w);
  }
  function clamp(w) {
    if (w.node.classList.contains("maximized")) return;
    const width = desktop.clientWidth,
      height = desktop.clientHeight;
    w.node.style.width =
      Math.min(parseFloat(w.node.style.width) || 500, width - 8) + "px";
    w.node.style.height =
      Math.min(parseFloat(w.node.style.height) || 400, height - 8) + "px";
    w.node.style.left =
      Math.max(
        0,
        Math.min(
          parseFloat(w.node.style.left) || 0,
          width - w.node.offsetWidth,
        ),
      ) + "px";
    w.node.style.top =
      Math.max(
        0,
        Math.min(
          parseFloat(w.node.style.top) || 0,
          height - w.node.offsetHeight,
        ),
      ) + "px";
  }
  function menu(items, x, y) {
    closeMenus();
    popup.replaceChildren();
    for (const item of items) {
      if (!item) {
        popup.append(el("div", "menu-separator"));
        continue;
      }
      const b = button(
        item.label,
        () => {
          closeMenus();
          item.action?.();
        },
        "menu-item",
      );
      b.disabled = !!item.disabled;
      popup.append(b);
    }
    popup.hidden = false;
    popup.style.left =
      Math.max(2, Math.min(x, innerWidth - popup.offsetWidth - 3)) + "px";
    popup.style.top =
      Math.max(2, Math.min(y, innerHeight - popup.offsetHeight - 36)) + "px";
    popup.querySelector("button:not(:disabled)")?.focus();
  }
  function create({
    id,
    title,
    icon = "folder",
    width = 600,
    height = 430,
    x,
    y,
    menus = [],
    status = "Ready",
    secondary = "",
  }) {
    if (windows.has(id)) {
      focus(windows.get(id));
      return null;
    }
    const node = el("section", "window");
    node.id = id;
    node.setAttribute("role", "region");
    node.setAttribute("aria-label", title);
    node.tabIndex = -1;
    const titlebar = el("div", "titlebar"),
      titleText = el("span", "title-text", title),
      controls = el("div", "window-controls");
    titlebar.append(img(icon), titleText, controls);
    const body = el("div", "window-body");
    const task = button(
      "",
      () => (active === w && !node.hidden ? minimize(w) : focus(w)),
      "task-button",
    );
    task.append(img(icon), el("span", "", title));
    task.title = title;
    const w = {
      id,
      title,
      node,
      body,
      task,
      titlebar,
      setTitle(t) {
        w.title = t;
        titleText.textContent = t;
        task.lastChild.textContent = t;
        task.title = t;
        node.setAttribute("aria-label", t);
      },
      setStatus(t) {
        statusText.textContent = t;
      },
      close() {
        close(w);
      },
      focus() {
        focus(w);
      },
    };
    const min = button("_", () => minimize(w)),
      max = button("", () => maximize(w)),
      exit = button("×", () => close(w));
    max.append(el("span", "maximize-symbol"));
    w.maxButton = max;
    for (const [b, label] of [
      [min, "Minimize"],
      [max, "Maximize"],
      [exit, "Close"],
    ]) {
      b.title = label;
      b.setAttribute("aria-label", label);
      controls.append(b);
    }
    node.append(titlebar);
    if (menus.length) {
      const bar = el("div", "menubar");
      for (const group of menus) {
        const b = button(group.label, () => {
          const r = b.getBoundingClientRect();
          menu(group.items(w), r.left, r.bottom);
          b.setAttribute("aria-expanded", "true");
        });
        b.setAttribute("aria-haspopup", "menu");
        b.setAttribute("aria-expanded", "false");
        bar.append(b);
      }
      node.append(bar);
    }
    const statusbar = el("div", "statusbar"),
      statusText = el("span", "", status);
    statusbar.append(statusText);
    if (secondary) statusbar.append(el("span", "", secondary));
    node.append(body, statusbar, el("div", "resize-grip"));
    const offset = (cascade++ % 6) * 24;
    node.style.cssText = `width:${width}px;height:${height}px;left:${x ?? Math.min(238 + offset, innerWidth - width - 20)}px;top:${y ?? 54 + offset}px;z-index:${++z}`;
    windows.set(id, w);
    layer.append(node);
    tasks.append(task);
    clamp(w);
    focus(w);
    node.addEventListener("pointerdown", () => focus(w));
    node.addEventListener("focusin", () => {
      if (active !== w) focus(w);
    });
    titlebar.addEventListener("dblclick", (e) => {
      if (!e.target.closest("button")) maximize(w);
    });
    titlebar.addEventListener("pointerdown", (e) => {
      if (
        e.button !== 0 ||
        e.target.closest("button") ||
        node.classList.contains("maximized")
      )
        return;
      e.preventDefault();
      titlebar.setPointerCapture(e.pointerId);
      const startX = e.clientX,
        startY = e.clientY,
        left = node.offsetLeft,
        top = node.offsetTop;
      const move = (ev) => {
        node.style.left =
          Math.max(
            0,
            Math.min(
              left + ev.clientX - startX,
              desktop.clientWidth - node.offsetWidth,
            ),
          ) + "px";
        node.style.top =
          Math.max(
            0,
            Math.min(top + ev.clientY - startY, desktop.clientHeight - 28),
          ) + "px";
      };
      const end = () => {
        titlebar.removeEventListener("pointermove", move);
        titlebar.removeEventListener("pointerup", end);
        titlebar.removeEventListener("pointercancel", end);
      };
      titlebar.addEventListener("pointermove", move);
      titlebar.addEventListener("pointerup", end);
      titlebar.addEventListener("pointercancel", end);
    });
    titlebar.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      menu(
        [
          {
            label: "Restore",
            action: () => {
              if (node.classList.contains("maximized")) maximize(w);
              else focus(w);
            },
          },
          { label: "Minimize", action: () => minimize(w) },
          {
            label: "Maximize",
            action: () => {
              if (!node.classList.contains("maximized")) maximize(w);
            },
          },
          null,
          { label: "Close", action: () => close(w) },
        ],
        e.clientX,
        e.clientY,
      );
    });
    announce(title + " opened");
    return w;
  }
  function shortcut(
    { label, icon, action },
    parent = document.querySelector("#desktop-icons"),
    cls = "desktop-icon",
  ) {
    const b = button("", null, cls);
    b.append(img(icon), el("span", "", label));
    b.title = label;
    const select = () => {
      parent
        .querySelectorAll(".selected")
        .forEach((n) => n.classList.remove("selected"));
      b.classList.add("selected");
    };
    b.addEventListener("click", (e) => {
      select();
      if (e.detail === 0) action();
    });
    b.addEventListener("dblclick", action);
    b.addEventListener("pointerup", (e) => {
      if (e.pointerType === "touch") {
        select();
        action();
      }
    });
    parent.append(b);
    return b;
  }
  function arrange() {
    document
      .querySelector("#desktop-icons")
      .style.setProperty(
        "--rows",
        Math.max(3, Math.floor((desktop.clientHeight - 16) / 88)),
      );
    for (const w of windows.values()) clamp(w);
  }
  function dialog(title, message) {
    const id = "dialog-" + title;
    const w = create({
      id,
      title,
      icon: "help",
      width: 370,
      height: 220,
      status: "Songs About You",
    });
    if (!w) return;
    const content = el("div", "dialog-content");
    content.append(img("help"), el("p", "", message));
    w.body.append(content);
    const actions = el("div", "dialog-actions");
    actions.append(button("OK", () => w.close()));
    w.body.append(actions);
    actions.firstChild.focus();
  }
  function showDesktop() {
    const visible = [...windows.values()].filter((w) => !w.node.hidden);
    if (visible.length) visible.forEach(minimize);
    else for (const w of windows.values()) focus(w);
  }
  startButton.onclick = (e) => {
    e.stopPropagation();
    const wasOpen = !start.hidden;
    closeMenus();
    if (!wasOpen) {
      start.hidden = false;
      startButton.classList.add("pressed");
      startButton.setAttribute("aria-expanded", "true");
      start.querySelector("button")?.focus();
    }
  };
  document.addEventListener("pointerdown", (e) => {
    if (!e.target.closest("#start-menu,#start-button,#popup,.menubar"))
      closeMenus();
    if (!e.target.closest("#volume-panel,#volume-button"))
      document.querySelector("#volume-panel").hidden = true;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenus();
      document.querySelector("#volume-panel").hidden = true;
      active?.node.focus();
    }
    if (e.altKey && e.key === "F4" && active) {
      e.preventDefault();
      close(active);
    }
    const host = e.target.closest("#popup,#start-menu");
    if (host && ["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const buttons = [...host.querySelectorAll("button:not(:disabled)")];
      let i = buttons.indexOf(document.activeElement);
      i =
        e.key === "Home"
          ? 0
          : e.key === "End"
            ? buttons.length - 1
            : (i + (e.key === "ArrowDown" ? 1 : -1) + buttons.length) %
              buttons.length;
      buttons[i]?.focus();
    }
  });
  document.querySelector("#show-desktop").onclick = showDesktop;
  document.querySelector("#volume-button").onclick = () => {
    const panel = document.querySelector("#volume-panel");
    panel.hidden = !panel.hidden;
  };
  function clock() {
    const now = new Date(),
      clock = document.querySelector("#clock");
    clock.textContent = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    clock.dateTime = now.toISOString();
    clock.title = now.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  clock();
  setInterval(clock, 1000);
  addEventListener("resize", arrange);
  arrange();
  return {
    create,
    el,
    img,
    button,
    icons,
    windows,
    focus,
    minimize,
    maximize,
    close,
    shortcut,
    menu,
    closeMenus,
    read,
    save,
    dialog,
    arrange,
    desktop,
    showDesktop,
  };
})();
