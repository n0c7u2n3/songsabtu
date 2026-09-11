"use strict";
(() => {
  const { el, img, button, create, shortcut, dialog, read, save } = Shell;
  const menuFile = (extra) => ({
    label: "File",
    items: (w) => [
      ...(extra ? extra(w) : []),
      { label: "Close", action: () => w.close() },
    ],
  });
  const menuHelp = {
    label: "Help",
    items: () => [
      { label: "Using this desktop", action: help },
      {
        label: "About Songs About You",
        action: () =>
          dialog(
            "About Songs About You",
            "Songs About You\nA desktop full of mixtapes and memories.\n\nWindows 98 inspired interface. Original playlists, photographs, and story content preserved.",
          ),
      },
    ],
  };
  const media = new Audio();
  media.preload = "metadata";
  media.volume = 0.7;
  let repeat = false;
  let playerWindow = null,
    queue = [],
    queueIndex = 0,
    playerUI = null;
  const sampleTracks = albums
    .flatMap((a) => a.tracks)
    .map((t, i) => ({ ...t, previewUrl: previewUrls[i % previewUrls.length] }));
  function fmt(n) {
    if (!Number.isFinite(n)) return "00:00";
    return (
      `${Math.floor(n / 60)}`.padStart(2, "0") +
      ":" +
      `${Math.floor(n % 60)}`.padStart(2, "0")
    );
  }
  function help() {
    dialog(
      "Desktop Help",
      "Double-click a desktop icon or a file to open it. On a touch screen, tap once.\n\nDrag a title bar to move a window. Drag its lower-right corner to resize it. Use the taskbar to switch windows; double-click a title bar to maximize or restore.\n\nRight-click the desktop for display settings. Notes save on this device. Conversations and mail are an archive.",
    );
  }
  function table(headers) {
    const t = el("table", "details-table"),
      head = el("thead"),
      row = el("tr"),
      body = el("tbody");
    headers.forEach((h) => row.append(el("th", "", h)));
    head.append(row);
    t.append(head, body);
    return { t, body };
  }
  function openable(row, action, parent) {
    row.tabIndex = 0;
    row.addEventListener("click", () => {
      parent
        .querySelectorAll(".selected")
        .forEach((n) => n.classList.remove("selected"));
      row.classList.add("selected");
    });
    row.addEventListener("dblclick", action);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        action();
      }
    });
    row.addEventListener("pointerup", (e) => {
      if (e.pointerType === "touch") action();
    });
  }
  function address(text) {
    const bar = el("div", "addressbar");
    const input = el("input");
    input.value = text;
    input.readOnly = true;
    input.setAttribute("aria-label", "Address");
    bar.append(el("span", "", "Address"), input);
    return bar;
  }
  function explorerFrame(w, title, description, icon = "disc") {
    const frame = el("div", "explorer"),
      side = el("aside", "explorer-sidebar"),
      main = el("div", "explorer-main");
    side.append(
      img(icon),
      el("h1", "", title),
      el("hr"),
      el("p", "", description),
    );
    frame.append(side, main);
    w.body.append(frame);
    return main;
  }
  function toolbar(items) {
    const bar = el("div", "toolbar");
    items.forEach((i) => {
      const b = button("", i.action);
      if (i.icon) b.append(img(i.icon));
      b.append(el("span", "", i.label));
      bar.append(b);
    });
    return bar;
  }
  function library() {
    let view = "icons";
    const w = create({
      id: "music-library",
      title: "Songs About You",
      icon: "disc",
      width: 660,
      height: 450,
      x: 238,
      y: 54,
      menus: [
        menuFile(),
        {
          label: "View",
          items: () => [
            {
              label: "Large Icons",
              action: () => {
                view = "icons";
                render();
              },
            },
            {
              label: "Details",
              action: () => {
                view = "details";
                render();
              },
            },
          ],
        },
        menuHelp,
      ],
      status: `${albums.length} objects`,
      secondary: "My Computer",
    });
    if (!w) return;
    w.body.append(
      toolbar([
        { label: "My Computer", icon: "computer", action: computer },
        {
          label: "Properties",
          icon: "display",
          action: () =>
            dialog(
              "Songs About You Properties",
              `${albums.length} mixtapes\n${sampleTracks.length} tracks\n\nA collection of songs about people. Open a disc to explore its tracklist.`,
            ),
        },
      ]),
      address("C:\\My Documents\\Songs About You"),
    );
    const main = explorerFrame(
      w,
      "Songs About You",
      "Select a disc to view its tracklist.\n\nDouble-click an item to open it.",
    );
    function render() {
      main.replaceChildren();
      if (view === "icons") {
        const grid = el("div", "file-grid");
        albums.forEach((a, i) => {
          const b = shortcut(
            { label: a.albumTitle, icon: "disc", action: () => album(i) },
            grid,
            "file-icon",
          );
          b.lastChild.prepend(el("small", "", a.bandName));
        });
        main.append(grid);
      } else {
        const { t, body } = table(["Name", "Episode", "Tracks"]);
        albums.forEach((a, i) => {
          const tr = el("tr");
          tr.append(
            el("td", "", a.albumTitle),
            el("td", "", a.bandName),
            el("td", "", a.tracks.length),
          );
          openable(tr, () => album(i), body);
          body.append(tr);
        });
        main.append(t);
      }
    }
    render();
  }
  function album(index) {
    const a = albums[index];
    const offset = albums
        .slice(0, index)
        .reduce((n, a) => n + a.tracks.length, 0),
      list = sampleTracks.slice(offset, offset + a.tracks.length);
    const w = create({
      id: "album-" + index,
      title: a.albumTitle + " — CD contents",
      icon: "disc",
      width: 680,
      height: 465,
      menus: [
        menuFile(),
        {
          label: "Play",
          items: () => [
            { label: "Play original sample", action: () => play(list, 0) },
            {
              label: "Stop",
              action: () => {
                media.pause();
                media.currentTime = 0;
              },
            },
          ],
        },
        menuHelp,
      ],
      status: `${a.tracks.length} tracks • ${a.bandName}`,
      secondary: "Audio CD",
    });
    if (!w) return;
    w.body.append(
      toolbar([
        { label: "Back", icon: "folder", action: library },
        { label: "Play sample", icon: "player", action: () => play(list, 0) },
      ]),
      address("D:\\" + a.albumTitle),
    );
    const main = explorerFrame(
      w,
      a.albumTitle,
      a.bandName +
        "\n\nThe original site uses shared audio samples. Samples may not match the listed song.",
    );
    const { t, body } = table(["Track", "Name", "Type"]);
    list.forEach((track, i) => {
      const tr = el("tr");
      const title = el("td", "track-title", track.title);
      tr.append(
        el("td", "", String(i + 1).padStart(2, "0")),
        title,
        el("td", "", "Audio sample"),
      );
      openable(tr, () => play(list, i), body);
      body.append(tr);
    });
    main.append(t);
  }
  function player() {
    if (playerWindow && Shell.windows.has(playerWindow.id)) {
      Shell.focus(playerWindow);
      return;
    }
    const w = create({
      id: "media-player",
      title: "WINAMP",
      icon: "player",
      width: 420,
      height: 360,
      x: Math.max(290, innerWidth - 450),
      y: Math.max(120, innerHeight - 330),
      menus: [
        menuFile(),
        {
          label: "Playback",
          items: () => [
            { label: "Play / Pause", action: togglePlayback },
            {
              label: "Stop",
              action: () => {
                media.pause();
                media.currentTime = 0;
              },
            },
          ],
        },
        menuHelp,
      ],
      status: "Ready",
      secondary: "Stereo",
    });
    if (!w) return;
    playerWindow = w;
    w.node.classList.add("winamp-window");
    w.body.classList.add("player");
    const display = el("div", "player-display"),
      digits = el("div", "player-digits", "00:00"),
      readout = el("div", "player-readout"),
      track = el("div", "player-track", "No sample selected"),
      meta = el("div", "player-meta", "ORIGINAL SAMPLE  •  STEREO");
    readout.append(track, meta);
    display.append(digits, readout);
    const seek = el("input", "seek");
    seek.type = "range";
    seek.min = 0;
    seek.max = 100;
    seek.step = 0.1;
    seek.value = 0;
    seek.disabled = true;
    seek.setAttribute("aria-label", "Playback position");
    seek.oninput = () => {
      if (Number.isFinite(media.duration))
        media.currentTime = (+seek.value / 100) * media.duration;
    };
    const controls = el("div", "player-controls"),
      previous = button("⏮", () => advance(-1)),
      playButton = button("▶", togglePlayback),
      stop = button("■", () => {
        media.pause();
        media.currentTime = 0;
      }),
      next = button("⏭", () => advance(1));
    for (const [b, title] of [
      [previous, "Previous sample"],
      [playButton, "Play or pause"],
      [stop, "Stop"],
      [next, "Next sample"],
    ]) {
      b.title = title;
      b.setAttribute("aria-label", title);
    }
    controls.append(previous, playButton, stop, next);
    const volume = el("input");
    volume.type = "range";
    volume.min = 0;
    volume.max = 1;
    volume.step = 0.05;
    volume.value = media.volume;
    volume.setAttribute("aria-label", "Player volume");
    volume.oninput = () => {
      media.volume = +volume.value;
      document.querySelector("#master-volume").value = media.volume;
    };
    controls.append(el("label", "", "Volume"), volume);
    w.body.append(
      display,
      seek,
      controls,
      el(
        "p",
        "player-note",
        "Original site audio samples; these may not match the track titles.",
      ),
    );
    const playlist = el("div", "winamp-playlist");
    const head = el("div", "winamp-playlist-head", "PLAYLIST EDITOR");
    const repeatButton = button("REPEAT", () => {
      repeat = !repeat;
      repeatButton.classList.toggle("pressed", repeat);
      repeatButton.setAttribute("aria-pressed", String(repeat));
    });
    repeatButton.classList.toggle("pressed", repeat);
    repeatButton.setAttribute("aria-pressed", String(repeat));
    head.append(repeatButton);
    w.body.append(head, playlist);
    playerUI = { digits, track, seek, playButton, volume, playlist };
    w.dispose = () => {
      media.pause();
      playerWindow = null;
      playerUI = null;
    };
    updatePlayer();
  }
  function updatePlayer() {
    if (!playerUI) return;
    playerUI.digits.textContent = fmt(media.currentTime);
    playerUI.track.textContent =
      queue[queueIndex]?.title || "No sample selected";
    playerUI.track.title = playerUI.track.textContent;
    playerUI.seek.disabled = !Number.isFinite(media.duration);
    playerUI.seek.value = Number.isFinite(media.duration)
      ? (media.currentTime / media.duration) * 100
      : 0;
    playerUI.playButton.textContent = media.paused ? "▶" : "Ⅱ";
    playerUI.volume.value = media.volume;
    const queueKey = queue.map((t) => t.title).join("|");
    if (playerUI.playlist.dataset.queue !== queueKey) {
      playerUI.playlist.dataset.queue = queueKey;
      playerUI.playlist.replaceChildren();
      queue.forEach((t, i) => {
        const b = button(String(i + 1).padStart(2, "0") + ". " + t.title, () =>
          play(queue, i),
        );
        b.title = t.title;
        playerUI.playlist.append(b);
      });
    }
    [...playerUI.playlist.children].forEach((b, i) =>
      b.classList.toggle("selected", i === queueIndex),
    );
  }
  function tryPlay() {
    media
      .play()
      .then(() => playerWindow?.setStatus("Playing original sample"))
      .catch(() =>
        playerWindow?.setStatus("Unable to play this sample. Try another."),
      );
  }
  function play(list, index) {
    queue = list;
    queueIndex = index;
    player();
    media.src = queue[index].previewUrl;
    playerWindow.setStatus("Opening sample…");
    updatePlayer();
    tryPlay();
  }
  function togglePlayback() {
    if (!queue.length) {
      play(sampleTracks, 0);
      return;
    }
    if (media.paused) tryPlay();
    else media.pause();
  }
  function advance(delta) {
    if (!queue.length) return;
    play(queue, (queueIndex + delta + queue.length) % queue.length);
  }
  for (const event of [
    "timeupdate",
    "loadedmetadata",
    "play",
    "pause",
    "volumechange",
  ])
    media.addEventListener(event, updatePlayer);
  media.addEventListener("ended", () => {
    if (repeat) {
      media.currentTime = 0;
      tryPlay();
    } else if (queueIndex < queue.length - 1) advance(1);
    else playerWindow?.setStatus("Playlist finished");
  });
  media.addEventListener("error", () =>
    playerWindow?.setStatus("Sample unavailable. Try the next track."),
  );
  document.querySelector("#master-volume").oninput = (e) => {
    media.volume = +e.target.value;
  };
  document.querySelector("#mute").onchange = (e) => {
    media.muted = e.target.checked;
  };
  function computer() {
    const w = create({
      id: "my-computer",
      title: "My Computer",
      icon: "computer",
      width: 530,
      height: 345,
      menus: [menuFile(), menuHelp],
      status: "4 objects",
    });
    if (!w) return;
    w.body.append(address("My Computer"));
    const main = explorerFrame(
        w,
        "My Computer",
        "Open a folder to see what is inside.",
        "computer",
      ),
      grid = el("div", "file-grid");
    for (const item of [
      { label: "Songs About You (D:)", icon: "disc", action: library },
      { label: "selfies :)", icon: "folder", action: photosApp },
      { label: "Notepad", icon: "note", action: () => notepad() },
      { label: "Control Panel", icon: "display", action: display },
    ])
      shortcut(item, grid, "file-icon");
    main.append(grid);
  }
  function photosApp() {
    const w = create({
      id: "photos",
      title: "selfies :)",
      icon: "folder",
      width: 600,
      height: 390,
      menus: [menuFile(), menuHelp],
      status: `${photos.length} objects`,
    });
    if (!w) return;
    w.body.append(address("C:\\My Documents\\My Pictures\\selfies :)"));
    const main = explorerFrame(
        w,
        "selfies :)",
        "A few pictures worth keeping.",
        "folder",
      ),
      grid = el("div", "file-grid photo-grid");
    photos.forEach((p, i) =>
      shortcut(
        { label: p.filename, icon: p.url, action: () => photo(i) },
        grid,
        "file-icon",
      ),
    );
    main.append(grid);
  }
  function photo(index) {
    const w = create({
      id: "photo-" + index,
      title: photos[index].filename + " — Image Preview",
      icon: "folder",
      width: 530,
      height: 480,
      menus: [menuFile(), menuHelp],
      status: "JPEG image",
    });
    if (!w) return;
    let i = index;
    const stage = el("div", "photo-stage"),
      picture = img(photos[i].url);
    picture.alt = photos[i].filename;
    stage.append(picture);
    function move(delta) {
      i = (i + delta + photos.length) % photos.length;
      picture.src = photos[i].url;
      picture.alt = photos[i].filename;
      w.setTitle(photos[i].filename + " — Image Preview");
    }
    w.body.append(
      toolbar([
        { label: "Previous", action: () => move(-1) },
        { label: "Next", action: () => move(1) },
        { label: "Open folder", icon: "folder", action: photosApp },
      ]),
      stage,
    );
  }
  function download(text, name, type = "text/plain") {
    const url = URL.createObjectURL(new Blob([text], { type })),
      a = el("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function notepad(heart = false) {
    const w = create({
      id: heart ? "my-heart" : "notepad",
      title: heart ? "My Heart.txt — Notepad" : "Untitled — Notepad",
      icon: "note",
      width: 490,
      height: 390,
      menus: [
        menuFile((w) => [
          {
            label: "Save As…",
            action: () =>
              download(
                w.body.querySelector("textarea").value,
                heart ? "My Heart.txt" : "Notes.txt",
              ),
          },
        ]),
        {
          label: "Edit",
          items: (w) => [
            {
              label: "Select All",
              action: () => {
                const t = w.body.querySelector("textarea");
                t.focus();
                t.select();
              },
            },
          ],
        },
        {
          label: "Format",
          items: (w) => [
            {
              label: "Word Wrap",
              action: () => {
                const t = w.body.querySelector("textarea");
                t.style.whiteSpace =
                  t.style.whiteSpace === "pre-wrap" ? "pre" : "pre-wrap";
              },
            },
          ],
        },
        menuHelp,
      ],
      status: heart ? "Read-only" : "All changes saved",
    });
    if (!w) return;
    const area = el("textarea", "notepad-textarea");
    area.spellcheck = false;
    area.setAttribute("aria-label", heart ? "My Heart text" : "Notes");
    area.value = heart
      ? document
          .querySelector("#readme-template")
          .content.querySelector("textarea").value
      : read("notepadContent", read("say.notes"));
    area.readOnly = heart;
    area.oninput = () =>
      w.setStatus(
        save("notepadContent", area.value)
          ? "All changes saved"
          : "Could not save locally. Use File → Save As.",
      );
    w.body.append(area);
  }
  function display() {
    const w = create({
      id: "display",
      title: "Display Properties",
      icon: "display",
      width: 430,
      height: 445,
      menus: [],
      status: "Desktop appearance",
    });
    if (!w) return;
    w.body.classList.add("settings");
    const tab = el("div", "tab-strip");
    tab.append(el("span", "", "Background"));
    const preview = el("div", "wallpaper-preview");
    const label = el("label", "", "Wallpaper: "),
      select = el("select");
    select.setAttribute("aria-label", "Wallpaper");
    const options = [
      ["", "(None)"],
      ["assets/SC_WALL.JPG", "Original wallpaper"],
      ["cropped-paramore-25440-26122-hd-wallpapers.jpg", "Paramore"],
    ];
    let custom = read("desktopWallpaper");
    if (custom && !options.some(([v]) => v === custom))
      options.push([custom, "Custom wallpaper"]);
    options.forEach(([v, t]) => {
      const o = el("option", "", t);
      o.value = v;
      select.append(o);
    });
    select.value = custom;
    label.append(select);
    const color = el("input");
    color.type = "color";
    color.value = read("say.color", "#008080");
    color.setAttribute("aria-label", "Desktop color");
    const fit = el("select");
    fit.setAttribute("aria-label", "Picture display");
    for (const t of ["Cover", "Center", "Tile"]) {
      const o = el("option", "", t);
      o.value = t.toLowerCase();
      fit.append(o);
    }
    fit.value = read("say.fit", "cover");
    const fields = el("fieldset");
    fields.append(
      el("legend", "", "Display"),
      el("label", "", "Color"),
      color,
      fit,
    );
    const upload = el("input");
    upload.type = "file";
    upload.accept = "image/*";
    upload.hidden = true;
    function previewUpdate() {
      paint(preview, select.value, color.value, fit.value);
    }
    select.onchange = previewUpdate;
    color.oninput = previewUpdate;
    fit.onchange = previewUpdate;
    upload.onchange = () => {
      const file = upload.files[0];
      if (!file) return;
      if (file.size > 4 * 1024 * 1024) {
        dialog(
          "Wallpaper",
          "Choose an image smaller than 4 MB for local wallpaper storage.",
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const o = el("option", "", file.name);
        o.value = reader.result;
        select.append(o);
        select.value = reader.result;
        previewUpdate();
      };
      reader.readAsDataURL(file);
    };
    function apply() {
      const ok =
        save("desktopWallpaper", select.value) &
        save("say.color", color.value) &
        save("say.fit", fit.value);
      paint(Shell.desktop, select.value, color.value, fit.value);
      w.setStatus(
        ok ? "Appearance saved" : "Applied for this session; storage is full.",
      );
    }
    const actions = el("div", "dialog-actions");
    actions.append(
      button("OK", () => {
        apply();
        w.close();
      }),
      button("Cancel", () => w.close()),
      button("Apply", apply),
    );
    w.body.append(
      tab,
      preview,
      label,
      button("Browse…", () => upload.click()),
      upload,
      fields,
      actions,
    );
    previewUpdate();
  }
  function paint(node, url, color, fit) {
    node.style.backgroundColor = color;
    node.style.backgroundImage = url ? `url(${JSON.stringify(url)})` : "none";
    node.style.backgroundSize = fit === "cover" ? "cover" : "auto";
    node.style.backgroundRepeat = fit === "tile" ? "repeat" : "no-repeat";
    node.style.backgroundPosition = "center";
  }
  paint(
    Shell.desktop,
    read("desktopWallpaper"),
    read("say.color", "#008080"),
    read("say.fit", "cover"),
  );
  function myspace() {
    Immersion.browser();
  }
  function aim() {
    Immersion.aim();
  }
  function chat() {
    Immersion.chat();
  }
  function mail() {
    const w = create({
      id: "mail",
      title: "Inbox — Outlook Express",
      icon: "mail",
      width: 760,
      height: 480,
      menus: [menuFile(), menuHelp],
      status: "Mail archive",
      secondary: "Working offline",
    });
    if (!w) return;
    w.body.append(
      toolbar([
        {
          label: "Folders",
          icon: "folder",
          action: () => {
            folders.hidden = !folders.hidden;
          },
        },
        {
          label: "Address Book",
          icon: "mail",
          action: () =>
            dialog(
              "Address Book",
              emailData.Inbox.map((m) => m.from).join("\n"),
            ),
        },
      ]),
    );
    const layout = el("div", "mail-layout"),
      folders = el("aside", "mail-folders sunken"),
      main = el("div", "mail-main sunken"),
      list = el("div", "mail-list"),
      message = el("div", "mail-message");
    folders.append(el("h3", "", "Local Folders"));
    main.append(list, message);
    layout.append(folders, main);
    w.body.append(layout);
    function showMessage(m) {
      message.replaceChildren();
      const header = el("div", "mail-header");
      header.append(
        el("div", "", "From: " + m.from),
        el("div", "", "Subject: " + m.subject),
      );
      const body = el("div", "mail-body"); // Authored, static archive only. Never render user input as HTML.
      body.innerHTML = m.body;
      message.append(header, body);
    }
    function folder(name) {
      folders
        .querySelectorAll("button")
        .forEach((b) =>
          b.classList.toggle("selected", b.dataset.name === name),
        );
      list.replaceChildren();
      message.replaceChildren();
      w.setTitle(name + " — Outlook Express");
      w.setStatus(`${emailData[name].length} message(s) • Archive`);
      if (!emailData[name].length) {
        message.append(
          el("p", "empty", "There are no messages in this folder."),
        );
        return;
      }
      const { t, body } = table(["From", "Subject"]);
      emailData[name].forEach((m, i) => {
        const row = el("tr");
        row.tabIndex = 0;
        row.append(el("td", "", m.from), el("td", "", m.subject));
        const choose = () => {
          body
            .querySelectorAll(".selected")
            .forEach((n) => n.classList.remove("selected"));
          row.classList.add("selected");
          showMessage(m);
        };
        row.onclick = choose;
        row.onkeydown = (e) => {
          if (e.key === "Enter") choose();
        };
        body.append(row);
        if (!i) choose();
      });
      list.append(t);
    }
    Object.keys(emailData).forEach((name) => {
      const b = button(name, () => folder(name));
      b.dataset.name = name;
      folders.append(b);
    });
    folder("Inbox");
  }
  function sims() {
    const w = create({
      id: "sims",
      title: "The Sims 2",
      icon: "sims",
      width: 540,
      height: 440,
      menus: [menuFile(), menuHelp],
      status: "Original animated scene",
    });
    if (!w) return;
    const stage = el("div", "embed-stage"),
      image = document
        .querySelector("#sims-window-template")
        .content.querySelector(".window-content img")
        .cloneNode();
    stage.append(image);
    w.body.append(stage);
  }
  function ski() {
    const w = create({
      id: "skifree",
      title: "SkiFree",
      icon: "ski",
      width: 660,
      height: 520,
      menus: [menuFile(), menuHelp],
      status: "Internet Archive game",
    });
    if (!w) return;
    const stage = el("div", "embed-stage"),
      frame = document
        .querySelector("#skifree-template")
        .content.querySelector("iframe")
        .cloneNode();
    frame.title = "SkiFree on Internet Archive";
    stage.append(frame);
    const notice = el("div", "app-notice");
    notice.append(
      document.createTextNode(
        "Click the game to start. If the archive does not load, ",
      ),
    );
    const a = el("a", "", "open SkiFree on Internet Archive");
    a.href = "https://archive.org/details/abandonware_skifree";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    notice.append(a);
    w.body.append(stage, notice);
  }
  function limewire() {
    const w = create({
      id: "limewire",
      title: "LimeWire",
      icon: "lime",
      width: 750,
      height: 465,
      menus: [menuFile(), menuHelp],
      status: "Local archive • No peer-to-peer connection",
    });
    if (!w) return;
    const form = el("form", "lime-search"),
      input = el("input");
    input.placeholder = "Search the music archive";
    input.setAttribute("aria-label", "Search music");
    const search = button("Search");
    search.type = "submit";
    form.append(img("lime"), input, search);
    form.firstChild.style.width = "24px";
    const results = el("div", "lime-results sunken"),
      downloadList = el("div", "downloads sunken");
    downloadList.append(el("p", "", "No samples queued."));
    w.body.append(
      form,
      el("div", "lime-head", "Audio • Songs About You"),
      results,
      el("div", "lime-head", "Sample queue"),
      downloadList,
    );
    const legacyRows = [
      "A.Cinderella.Story.2004.DVDRip.XviD-NeDiVx.avi",
      "CinderellaStory_2004_HilaryDuff_DVD_Screener.avi",
      "Cinderella Story (Soundtrack)",
      "hilaryduff_movie_fullversion.exe.zip",
      "cinderellastory_by_hotmailguy2006_finalcut.avi",
      "cinderella.exe",
      "Hilary_duff_dance_scene_cinderella_rare.avi",
      "TH.Duff_CinderellaStory_2004_[RomanianSubs]_Final.avi",
      "Coldplay - Viva La Vida.mp3",
    ];
    function render() {
      results.replaceChildren();
      const { t, body } = table(["Name", "Type", "Source"]);
      const q = input.value.toLowerCase();
      const matching = sampleTracks.filter((t) =>
        t.title.toLowerCase().includes(q),
      );
      matching.forEach((track) => {
        const tr = el("tr");
        tr.append(
          el("td", "", track.title),
          el("td", "", "Audio"),
          el("td", "", "Original sample"),
        );
        openable(
          tr,
          () => {
            downloadList.replaceChildren(
              el("p", "", track.title + " — queued for playback"),
            );
            play([track], 0);
          },
          body,
        );
        body.append(tr);
      });
      legacyRows
        .filter((t) => t.toLowerCase().includes(q))
        .forEach((name) => {
          const tr = el("tr");
          tr.append(
            el("td", "", name),
            el("td", "", "Archive entry"),
            el("td", "", "No file attached"),
          );
          openable(
            tr,
            () =>
              dialog(
                "Archived search result",
                "This is a preserved entry from the original LimeWire scene. No downloadable file was attached.",
              ),
            body,
          );
          body.append(tr);
        });
      results.append(t);
      if (!body.children.length)
        results.append(el("p", "empty", "No matching files."));
      w.setStatus(body.children.length + " results • Local archive");
    }
    form.onsubmit = (e) => {
      e.preventDefault();
      render();
    };
    input.oninput = render;
    render();
  }
  function recorder() {
    const w = create({
      id: "recorder",
      title: "Sound — Sound Recorder",
      icon: "recorder",
      width: 410,
      height: 310,
      menus: [
        menuFile((w) => [
          {
            label: "Save recording…",
            action: () => {
              if (!recordingUrl) {
                dialog(
                  "Sound Recorder",
                  "Record a sound first, then stop recording to save it.",
                );
                return;
              }
              const a = el("a");
              a.href = recordingUrl;
              a.download =
                "Sound." + (recordingType.includes("mp4") ? "m4a" : "webm");
              a.click();
            },
          },
        ]),
        menuHelp,
      ],
      status: "Ready",
    });
    if (!w) return;
    w.body.classList.add("recorder");
    const canvas = el("canvas", "waveform");
    canvas.width = 360;
    canvas.height = 80;
    const ctx = canvas.getContext("2d");
    const times = el("div", "recorder-times"),
      position = el("span", "", "Position: 0.00 sec."),
      length = el("span", "", "Length: 0.00 sec.");
    times.append(position, length);
    const controls = el("div", "recorder-controls"),
      rewind = button("⏮", () => {
        playback.currentTime = 0;
      }),
      playBtn = button("▶", () =>
        playback.play().catch(() => w.setStatus("Unable to play recording.")),
      ),
      stopBtn = button("■", stop),
      recordBtn = button("●", record, "record-dot");
    for (const [b, t] of [
      [rewind, "Rewind"],
      [playBtn, "Play recording"],
      [stopBtn, "Stop"],
      [recordBtn, "Record"],
    ]) {
      b.title = t;
      b.setAttribute("aria-label", t);
    }
    controls.append(rewind, playBtn, stopBtn, recordBtn);
    w.body.append(canvas, times, controls);
    let stream,
      rec,
      audioContext,
      analyser,
      raf,
      timer,
      recordingUrl,
      recordingType = "",
      chunks = [],
      startTime = 0,
      elapsed = 0,
      closed = false,
      pending = false;
    const playback = new Audio();
    playBtn.disabled = true;
    rewind.disabled = true;
    stopBtn.disabled = true;
    function draw() {
      if (!ctx) return;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, 360, 80);
      ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (analyser) {
        const data = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(data);
        for (let i = 0; i < data.length; i++) {
          const x = (i / data.length) * 360,
            y = (data[i] / 255) * 80;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
      } else {
        ctx.moveTo(0, 40);
        ctx.lineTo(360, 40);
      }
      ctx.stroke();
      if (rec?.state === "recording") raf = requestAnimationFrame(draw);
    }
    function stop() {
      playback.pause();
      if (rec?.state === "recording") {
        elapsed = (Date.now() - startTime) / 1000;
        rec.stop();
      }
      stream?.getTracks().forEach((t) => t.stop());
      stream = null;
      clearInterval(timer);
      cancelAnimationFrame(raf);
      recordBtn.disabled = pending;
      stopBtn.disabled = true;
      w.setStatus("Stopped");
    }
    async function record() {
      if (pending || rec?.state === "recording") return;
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        w.setStatus("Recording requires HTTPS and microphone support.");
        return;
      }
      pending = true;
      recordBtn.disabled = true;
      w.setStatus("Waiting for microphone permission…");
      try {
        playback.pause();
        const acquired = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (closed) {
          acquired.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = acquired;
        chunks = [];
        if (recordingUrl) URL.revokeObjectURL(recordingUrl);
        recordingUrl = null;
        playBtn.disabled = true;
        rewind.disabled = true;
        rec = new MediaRecorder(stream);
        recordingType = rec.mimeType;
        rec.ondataavailable = (e) => {
          if (e.data.size) chunks.push(e.data);
        };
        rec.onstop = () => {
          if (closed) return;
          const blob = new Blob(chunks, { type: recordingType });
          recordingUrl = URL.createObjectURL(blob);
          playback.src = recordingUrl;
          playBtn.disabled = false;
          rewind.disabled = false;
          length.textContent = "Length: " + elapsed.toFixed(2) + " sec.";
          w.setStatus("Recording ready • File → Save recording");
        };
        rec.start();
        startTime = Date.now();
        stopBtn.disabled = false;
        w.setStatus("Recording…");
        timer = setInterval(() => {
          position.textContent =
            "Position: " +
            ((Date.now() - startTime) / 1000).toFixed(2) +
            " sec.";
        }, 100);
        const Context = window.AudioContext || window.webkitAudioContext;
        if (Context) {
          if (audioContext) await audioContext.close();
          if (closed) return;
          audioContext = new Context();
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          audioContext.createMediaStreamSource(stream).connect(analyser);
        }
        draw();
      } catch {
        stop();
        w.setStatus("Microphone unavailable. Check browser permissions.");
      } finally {
        pending = false;
        if (!closed) recordBtn.disabled = rec?.state === "recording";
      }
    }
    playback.ontimeupdate = () =>
      (position.textContent =
        "Position: " + playback.currentTime.toFixed(2) + " sec.");
    playback.onplay = () => {
      stopBtn.disabled = false;
      w.setStatus("Playing recording");
    };
    playback.onended = () => {
      stopBtn.disabled = true;
      w.setStatus("Ready");
    };
    w.dispose = () => {
      closed = true;
      stop();
      audioContext?.close();
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    };
    draw();
  }
  function shutdown() {
    const w = create({
      id: "shutdown",
      title: "Shut Down Windows",
      icon: "computer",
      width: 385,
      height: 230,
      status: "Songs About You",
    });
    if (!w) return;
    const content = el("div", "dialog-content");
    content.append(
      img("computer"),
      el(
        "p",
        "",
        "Are you sure you want to shut down this desktop? Your saved notes and display settings will be kept.",
      ),
    );
    const actions = el("div", "dialog-actions");
    actions.append(
      button("Shut down", () => {
        for (const open of [...Shell.windows.values()]) open.close();
        media.pause();
        const screen = el("div", "shutdown-screen");
        screen.append(
          el("p", "", "It is now safe to turn off your computer."),
          button("Restart desktop", () => {
            screen.remove();
            library();
          }),
        );
        document.body.append(screen);
      }),
      button("Cancel", () => w.close()),
    );
    w.body.append(content, actions);
  }
  const apps = [
    { label: "My Computer", icon: "computer", action: computer },
    { label: "Songs About You", icon: "disc", action: library },
    { label: "Internet Explorer", icon: "browser", action: myspace },
    { label: "selfies :)", icon: "folder", action: photosApp },
    { label: "My Heart.txt", icon: "note", action: () => notepad(true) },
    { label: "AIM", icon: "aim", action: aim },
    { label: "Mail", icon: "mail", action: mail },
    { label: "LimeWire", icon: "lime", action: limewire },
    { label: "Chat", icon: "chat", action: chat },
    { label: "Sims 2", icon: "sims", action: sims },
    { label: "SkiFree", icon: "ski", action: ski },
    { label: "Sound Recorder", icon: "recorder", action: recorder },
  ];
  apps.forEach((item) => shortcut(item));
  albums.forEach((a, i) =>
    shortcut({ label: a.albumTitle, icon: "disc", action: () => album(i) }),
  );
  const startItems = document.querySelector("#start-items");
  function startItem(item) {
    const b = button(
      "",
      () => {
        Shell.closeMenus();
        item.action();
      },
      "menu-item",
    );
    b.append(img(item.icon), el("span", "", item.label));
    startItems.append(b);
  }
  startItem({ label: "Songs About You", icon: "disc", action: library });
  startItems.append(el("div", "menu-separator"));
  for (const item of apps.filter(
    (a) =>
      !["My Computer", "Songs About You", "My Heart.txt"].includes(a.label),
  ))
    startItem(item);
  startItem({ label: "Notepad", icon: "note", action: () => notepad() });
  startItems.append(el("div", "menu-separator"));
  startItem({ label: "Settings", icon: "display", action: display });
  startItem({ label: "Help", icon: "help", action: help });
  startItem({
    label: "saypodcast.com",
    icon: "recorder",
    action: () =>
      window.open("https://saypodcast.com", "_blank", "noopener,noreferrer"),
  });
  startItems.append(el("div", "menu-separator"));
  startItem({
    label: "Shut Down…",
    icon: "assets/shut_down_cool-4.png",
    action: shutdown,
  });
  Shell.desktop.addEventListener("contextmenu", (e) => {
    if (e.target.closest(".window")) return;
    e.preventDefault();
    Shell.menu(
      [
        { label: "Arrange Icons", action: Shell.arrange },
        { label: "Show Desktop", action: Shell.showDesktop },
        null,
        { label: "Properties", action: display },
      ],
      e.clientX,
      e.clientY,
    );
  });
  Shell.desktop.addEventListener("pointerdown", (e) => {
    if (!e.target.closest(".desktop-icon,.window"))
      document
        .querySelectorAll(".desktop-icon.selected")
        .forEach((n) => n.classList.remove("selected"));
  });
  window.DesktopApps = {
    library,
    player,
    play,
    photosApp,
    notepad,
    display,
    mail,
    computer,
  };
  Shell.arrange();
  library();
})();
