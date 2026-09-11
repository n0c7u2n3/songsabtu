"use strict";
/* Local fiction. All chat responses, journal entries, and network states are simulated. */
const Immersion = (() => {
  const { el, img, button, create, read, save, dialog } = Shell;
  function state(key, fallback) {
    try {
      return JSON.parse(read("carmen." + key, JSON.stringify(fallback)));
    } catch {
      return fallback;
    }
  }
  function persist(key, value) {
    return save("carmen." + key, JSON.stringify(value));
  }
  let restored = state("restored", []),
    away = read("carmen.away", CarmenStory.away),
    online = false;
  const fileMenu = {
    label: "File",
    items: (w) => [{ label: "Close", action: () => w.close() }],
  };
  const helpMenu = {
    label: "Help",
    items: () => [
      {
        label: "About this computer",
        action: () =>
          dialog(
            "Carmen’s computer",
            "You are exploring a fictional desktop. Chat replies and dial-up are scripted locally; nothing is sent to real people. Notes, comments and restored files stay in this browser.\n\nLook in My Documents, LiveJournal and the Recycle Bin. The little things connect.",
          ),
      },
    ],
  };
  function toolbar(items) {
    const row = el("div", "toolbar");
    for (const i of items) {
      const b = button(i.label, i.action);
      if (i.icon) b.prepend(img(i.icon));
      row.append(b);
    }
    return row;
  }
  function statusEvent() {
    document.dispatchEvent(new CustomEvent("carmen-connection"));
  }
  function time() {
    return new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  function sound() {
    if (!state("sound", false) || document.querySelector("#mute")?.checked)
      return;
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    const c = new C(),
      g = c.createGain();
    g.gain.value = 0.025;
    g.connect(c.destination);
    [750, 1100, 880, 1400].forEach((f, i) => {
      const o = c.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.connect(g);
      o.start(c.currentTime + i * 0.11);
      o.stop(c.currentTime + i * 0.11 + 0.08);
    });
    setTimeout(() => c.close(), 700);
  }
  function transcript(w, log, who, text, kind = "buddy") {
    const p = el("p", "message " + kind),
      stamp = el("span", "message-time", "(" + time() + ") ");
    p.append(stamp, el("b", "", who + ": "), document.createTextNode(text));
    log.append(p);
    log.scrollTop = log.scrollHeight;
  }
  function connection() {
    const w = create({
      id: "dialup",
      title: online ? "Connected to the Internet" : "Connect To",
      icon: "computer",
      width: 400,
      height: 365,
      x: Math.max(190, innerWidth / 2 - 200),
      y: 90,
      menus: [helpMenu],
      status: online ? "Connected at 49,333 bps" : "Ready to dial",
    });
    if (!w) return;
    w.node.classList.add("dialup-window");
    const content = el("div", "dialup-content");
    const title = el("div", "dialup-heading");
    title.append(img("computer"), el("div", "", "Carmen’s Internet"));
    content.append(title);
    for (const [label, value] of [
      ["User name:", "CarmenXCannibal"],
      ["Phone number:", "555-0198"],
      ["Connect using:", "Standard 56K Modem"],
    ]) {
      const row = el("label", "dialup-field", label),
        input = el("input");
      input.value = value;
      input.readOnly = true;
      row.append(input);
      content.append(row);
    }
    const audioLabel = el("label", "sound-option"),
      audio = el("input");
    audio.type = "checkbox";
    audio.checked = state("sound", false);
    audio.onchange = () => persist("sound", audio.checked);
    audioLabel.append(
      audio,
      document.createTextNode("Play connection and message sounds"),
    );
    const message = el(
      "div",
      "dialup-message sunken",
      online
        ? "Connected. Mom hasn’t picked up the phone yet."
        : "The phone line must be free.",
    );
    const progress = el("progress");
    progress.max = 3;
    progress.value = online ? 3 : 0;
    progress.setAttribute("aria-label", "Connection progress");
    content.append(audioLabel, message, progress);
    let timer = null,
      step = 0,
      pending = false;
    const actions = el("div", "dialog-actions"),
      connect = button(online ? "Disconnect" : "Connect", act),
      cancel = button("Close", () => w.close());
    actions.append(connect, cancel);
    w.body.append(content, actions);
    function act() {
      if (online) {
        online = false;
        progress.value = 0;
        message.textContent = "Disconnected.";
        connect.textContent = "Connect";
        w.setTitle("Connect To");
        w.setStatus("Disconnected");
        statusEvent();
        return;
      }
      if (pending) return;
      pending = true;
      step = 0;
      connect.disabled = true;
      cancel.textContent = "Cancel";
      message.textContent = "Dialing 555-0198…";
      w.setStatus("Dialing…");
      sound();
      const phases = [
        "Verifying user name and password…",
        "Logging on to network…",
        "Connected at 49,333 bps",
      ];
      timer = setInterval(() => {
        message.textContent = phases[step];
        progress.value = ++step;
        if (step === 3) {
          clearInterval(timer);
          timer = null;
          pending = false;
          online = true;
          connect.disabled = false;
          connect.textContent = "Disconnect";
          cancel.textContent = "Close";
          w.setTitle("Connected to the Internet");
          w.setStatus("Connected at 49,333 bps");
          statusEvent();
          sound();
        }
      }, 900);
    }
    w.dispose = () => {
      if (timer) clearInterval(timer);
    };
  }
  function documents() {
    const w = create({
      id: "personal-documents",
      title: "My Documents",
      icon: "folder",
      width: 690,
      height: 455,
      menus: [fileMenu, helpMenu],
      status: "C:\\My Documents",
    });
    if (!w) return;
    w.body.append(
      toolbar([
        { label: "Up", icon: "computer", action: DesktopApps.computer },
        {
          label: "Recycle Bin",
          icon: "assets/recycle_bin_full-0.png",
          action: bin,
        },
      ]),
    );
    const address = el("div", "addressbar");
    address.append(
      el("span", "", "Address"),
      el("span", "sunken", "C:\\My Documents"),
    );
    w.body.append(address);
    const frame = el("div", "explorer"),
      side = el("aside", "explorer-sidebar"),
      main = el("div", "explorer-main");
    side.append(
      img("folder"),
      el("h1", "", "My Documents"),
      el("hr"),
      el(
        "p",
        "",
        "Carmen’s stuff.\n\nPlease do not move anything. I know where it is.",
      ),
    );
    frame.append(side, main);
    w.body.append(frame);
    function render() {
      const docs = [
        ...CarmenStory.documents,
        ...CarmenStory.deleted.filter((d) => restored.includes(d.id)),
      ];
      main.replaceChildren();
      const t = el("table", "details-table"),
        h = el("thead"),
        hr = el("tr"),
        body = el("tbody");
      ["Name", "Modified", "Type"].forEach((x) => hr.append(el("th", "", x)));
      h.append(hr);
      t.append(h, body);
      for (const doc of docs) {
        const tr = el("tr");
        tr.tabIndex = 0;
        const name = el("td");
        name.append(img("note"), document.createTextNode(doc.name));
        tr.append(name, el("td", "", doc.date), el("td", "", "Text Document"));
        tr.onclick = () => {
          body
            .querySelectorAll(".selected")
            .forEach((n) => n.classList.remove("selected"));
          tr.classList.add("selected");
        };
        tr.ondblclick = () => openDocument(doc);
        tr.onkeydown = (e) => {
          if (e.key === "Enter") openDocument(doc);
        };
        tr.onpointerup = (e) => {
          if (e.pointerType === "touch") openDocument(doc);
        };
        body.append(tr);
      }
      main.append(t);
      w.setStatus(docs.length + " object(s)");
    }
    render();
    document.addEventListener("carmen-files", render);
    w.dispose = () => document.removeEventListener("carmen-files", render);
  }
  function openDocument(doc) {
    const w = create({
      id: "doc-" + doc.id,
      title: doc.name + " — Notepad",
      icon: "note",
      width: 510,
      height: 435,
      menus: [
        {
          label: "File",
          items: (w) => [
            { label: "Save", action: () => write() },
            { label: "Close", action: () => w.close() },
          ],
        },
        {
          label: "Edit",
          items: () => [
            {
              label: "Select All",
              action: () => {
                area.focus();
                area.select();
              },
            },
          ],
        },
        helpMenu,
      ],
      status: "Last modified " + doc.date,
    });
    if (!w) return;
    const area = el("textarea", "notepad-textarea");
    area.style.whiteSpace = "pre-wrap";
    area.spellcheck = false;
    area.setAttribute("aria-label", doc.name);
    area.value = read("carmen.doc." + doc.id, doc.text);
    function write() {
      w.setStatus(
        save("carmen.doc." + doc.id, area.value)
          ? "Saved"
          : "Storage is full. Copy your changes before closing.",
      );
    }
    area.oninput = write;
    w.body.append(area);
  }
  function bin() {
    const w = create({
      id: "recycle-bin",
      title: "Recycle Bin",
      icon: "assets/recycle_bin_full-0.png",
      width: 650,
      height: 365,
      menus: [fileMenu, helpMenu],
      status: "Deleted files",
    });
    if (!w) return;
    const note = el(
      "p",
      "bin-note",
      "Select a file to preview it or put it back in My Documents.",
    );
    let selected = null;
    const restore = button("Restore", () => {
      if (!selected) return;
      restored = [...new Set([...restored, selected.id])];
      if (!persist("restored", restored)) {
        restored = restored.filter((id) => id !== selected.id);
        w.setStatus("Unable to save restoration. Please free browser storage.");
        return;
      }
      selected = null;
      document.dispatchEvent(new CustomEvent("carmen-files"));
      render();
    });
    const preview = button("Preview", () => selected && openDocument(selected));
    const controls = el("div", "toolbar");
    controls.append(restore, preview);
    const main = el("div", "bin-files sunken");
    w.body.append(note, controls, main);
    function render() {
      main.replaceChildren();
      restore.disabled = preview.disabled = true;
      const remaining = CarmenStory.deleted.filter(
        (d) => !restored.includes(d.id),
      );
      if (!remaining.length) {
        main.append(el("p", "empty", "The Recycle Bin is empty."));
        w.setStatus("0 objects");
        return;
      }
      const t = el("table", "details-table"),
        head = el("thead"),
        row = el("tr"),
        body = el("tbody");
      ["Name", "Original Location", "Date Deleted"].forEach((s) =>
        row.append(el("th", "", s)),
      );
      head.append(row);
      t.append(head, body);
      for (const doc of remaining) {
        const tr = el("tr");
        tr.tabIndex = 0;
        tr.append(
          el("td", "", doc.name),
          el("td", "", "C:\\My Documents"),
          el("td", "", doc.date),
        );
        function select() {
          selected = doc;
          body
            .querySelectorAll(".selected")
            .forEach((n) => n.classList.remove("selected"));
          tr.classList.add("selected");
          restore.disabled = preview.disabled = false;
        }
        tr.onclick = select;
        tr.ondblclick = () => {
          select();
          openDocument(doc);
        };
        tr.onkeydown = (e) => {
          if (e.key === "Enter") {
            select();
            openDocument(doc);
          }
          if (e.key === " ") {
            e.preventDefault();
            select();
          }
        };
        body.append(tr);
      }
      main.append(t);
      w.setStatus(remaining.length + " object(s)");
    }
    render();
  }
  function aim() {
    const w = create({
      id: "aim",
      title: "CarmenXCannibal — Buddy List",
      icon: "aim",
      width: 280,
      height: 455,
      x: Math.max(260, innerWidth - 315),
      y: 45,
      menus: [
        {
          label: "My AIM",
          items: () => [
            { label: "Edit Away Message", action: editAway },
            {
              label: online ? "Connection status" : "Sign On",
              action: connection,
            },
          ],
        },
        helpMenu,
      ],
      status: online ? "Online" : "Offline",
    });
    if (!w) return;
    w.node.classList.add("aim-classic");
    const brand = el("div", "aim-brand");
    brand.append(img("aim"), el("b", "", "AOL Instant Messenger"));
    const tabs = el("div", "aim-tabs");
    tabs.append(el("b", "", "Online"), el("span", "", "List Setup"));
    const list = el("div", "aim-tree sunken"),
      awayPanel = el("div", "aim-away", away),
      actions = el("div", "aim-actions");
    actions.append(
      button("Set Away", editAway),
      button(online ? "Connection" : "Sign On", connection),
    );
    w.body.append(brand, tabs, list, awayPanel, actions);
    function render() {
      list.replaceChildren();
      list.append(
        el("b", "buddy-group-title", "− Buddies (" + (online ? 4 : 0) + "/5)"),
      );
      for (const buddy of CarmenStory.buddies) {
        const b = button("", () => message(buddy), "aim-buddy");
        b.append(
          el(
            "span",
            "buddy-state " + (online ? buddy.status.toLowerCase() : "offline"),
            online
              ? buddy.status === "Away"
                ? "▱"
                : buddy.status === "Online"
                  ? "●"
                  : "○"
              : "○",
          ),
          el("span", "", buddy.id),
        );
        b.title = buddy.away || buddy.status;
        list.append(b);
      }
      awayPanel.textContent = away;
      w.setStatus(
        online
          ? "Online • " + CarmenStory.screenName
          : "Offline • Sign on to send messages",
      );
    }
    render();
    document.addEventListener("carmen-connection", render);
    document.addEventListener("carmen-away", render);
    w.dispose = () => {
      document.removeEventListener("carmen-connection", render);
      document.removeEventListener("carmen-away", render);
    };
  }
  function editAway() {
    const w = create({
      id: "away-message",
      title: "Edit Away Message",
      icon: "aim",
      width: 395,
      height: 300,
      status: "CarmenXCannibal",
    });
    if (!w) return;
    w.body.classList.add("away-editor");
    w.body.append(el("label", "", "I am away because…"));
    const area = el("textarea");
    area.value = away;
    area.setAttribute("aria-label", "Away message");
    const actions = el("div", "dialog-actions");
    actions.append(
      button("I’m Away", () => {
        if (!save("carmen.away", area.value)) {
          w.setStatus("Could not save away message.");
          return;
        }
        away = area.value;
        document.dispatchEvent(new CustomEvent("carmen-away"));
        w.close();
      }),
      button("Cancel", () => w.close()),
    );
    w.body.append(area, actions);
  }
  function message(buddy) {
    const w = create({
      id: "im-" + buddy.id,
      title: buddy.id + " — Instant Message",
      icon: "aim",
      width: 545,
      height: 435,
      menus: [fileMenu, helpMenu],
      status: online ? buddy.status : "Offline",
    });
    if (!w) return;
    w.node.classList.add("instant-message");
    const banner = el("div", "im-banner");
    banner.append(img("aim"), el("b", "", buddy.id));
    const log = el("div", "chat-log sunken"),
      compose = el("form", "im-compose"),
      format = el("div", "im-format");
    format.append(
      el("span", "", "Arial"),
      el("b", "", "B"),
      el("i", "", "I"),
      el("u", "", "U"),
    );
    const input = el("textarea");
    input.setAttribute("aria-label", "Message to " + buddy.id);
    input.maxLength = 1000;
    const actions = el("div", "im-send-row"),
      send = button("Send");
    send.type = "submit";
    actions.append(el("span", "", "CarmenXCannibal"), send);
    compose.append(format, input, actions);
    w.body.append(banner, log, compose);
    let history = state(
        "im." + buddy.id,
        buddy.intro.map(([sender, text]) => ({ sender, text })),
      ),
      timer = null;
    function line(sender, text) {
      transcript(
        w,
        log,
        sender === "you" ? CarmenStory.screenName : buddy.id,
        text,
        sender,
      );
    }
    history.forEach((m) => line(m.sender, m.text));
    let busy = false;
    compose.onsubmit = (e) => {
      e.preventDefault();
      const value = input.value.trim();
      if (!value || busy) return;
      if (!online) {
        w.setStatus("You are offline. Sign on from the Buddy List.");
        connection();
        return;
      }
      if (buddy.status === "Offline") {
        w.setStatus("This buddy is offline. Message not sent.");
        return;
      }
      line("you", value);
      history.push({ sender: "you", text: value });
      input.value = "";
      busy = true;
      send.disabled = true;
      w.setStatus(
        buddy.status === "Away"
          ? "Receiving auto response…"
          : buddy.id + " is typing…",
      );
      timer = setTimeout(() => {
        timer = null;
        if (!online) {
          w.setStatus("Connection lost. No reply received.");
          busy = false;
          send.disabled = false;
          return;
        }
        const key = /cd|mix|burn/i.test(value)
          ? "cd"
          : /damon|him|boy/i.test(value)
            ? "damon"
            : /photo|picture/i.test(value)
              ? "photos"
              : "default";
        const response = buddy.replies[key] || buddy.replies.default;
        line("buddy", response);
        history.push({ sender: "buddy", text: response });
        if (!persist("im." + buddy.id, history.slice(-60)))
          w.setStatus("Conversation could not be saved.");
        else w.setStatus(buddy.status);
        busy = false;
        send.disabled = false;
        sound();
      }, 1100);
    };
    input.onkeydown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        compose.requestSubmit();
      }
    };
    w.dispose = () => {
      if (timer) clearTimeout(timer);
      persist("im." + buddy.id, history.slice(-60));
    };
  }
  function chat() {
    const w = create({
      id: "chat",
      title: "MusicLovers28 — ICQ Chat",
      icon: "chat",
      width: 700,
      height: 495,
      menus: [fileMenu, helpMenu],
      status: online
        ? "In room: MusicLovers28"
        : "Disconnected — last room conversation",
    });
    if (!w) return;
    const heading = el("div", "room-heading");
    heading.append(
      img("chat"),
      el("div", "", "MusicLovers28"),
      el("small", "", "Topic: no requests until darrell finds his adapter"),
    );
    const layout = el("div", "chat-layout"),
      pane = el("div", "room-main"),
      log = el("div", "chat-log sunken room-log"),
      users = el("aside", "chat-users sunken");
    users.append(
      el("b", "", "In this room"),
      el("div", "", "CarmenXCannibal"),
      el("div", "", "glitta_tears"),
      el("div", "", "velcro_down"),
      el("hr"),
      el("small", "", "Away"),
      el("div", "", "lizzy_love"),
    );
    let minute = 41;
    CarmenStory.room.forEach(([who, text], i) => {
      const p = el("p", who === "System" ? "room-system" : "");
      p.append(
        el(
          "span",
          "message-time",
          "[11:" + String(minute + Math.floor(i / 5)).padStart(2, "0") + "] ",
        ),
      );
      if (who !== "System")
        p.append(
          el("b", who === CarmenStory.screenName ? "self" : "", who + ": "),
        );
      p.append(document.createTextNode(text));
      log.append(p);
    });
    const saved = state("room", []);
    saved.forEach((m) =>
      transcript(
        w,
        log,
        m.who,
        m.text,
        m.who === CarmenStory.screenName ? "you" : "buddy",
      ),
    );
    const form = el("form", "room-compose"),
      input = el("input");
    input.setAttribute("aria-label", "Message to MusicLovers28");
    input.placeholder = "Say something…";
    input.maxLength = 800;
    const send = button("Send");
    send.type = "submit";
    form.append(input, send);
    pane.append(log, form);
    layout.append(pane, users);
    w.body.append(heading, layout);
    let timer = null,
      busy = false;
    const replies = [
      [
        /cd|blue|mix|burn/i,
        "glitta_tears",
        "the blue disc. the one you have relabeled three times. i am just establishing facts.",
      ],
      [
        /damon|crush|him/i,
        "glitta_tears",
        "i think he knows, carmen. he asked about the cd, not the weather.",
      ],
      [
        /photo|picture|print/i,
        "velcro_down",
        "liz said the prints are ready. bring the slip from your desk or they make you do the whole name spelling thing.",
      ],
      [
        /bus|noon|tomorrow|sweater/i,
        "glitta_tears",
        "noon by the bus stop. bring my sweater. i miss it more than i miss some people.",
      ],
      [
        /mom|phone|internet/i,
        "velcro_down",
        "if you disappear mid-sentence we will assume your mom called your aunt again.",
      ],
    ];
    form.onsubmit = (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || busy) return;
      if (!online) {
        connection();
        w.setStatus("Connect to the Internet to join the room.");
        return;
      }
      transcript(w, log, CarmenStory.screenName, text, "you");
      saved.push({ who: CarmenStory.screenName, text });
      input.value = "";
      busy = true;
      send.disabled = true;
      w.setStatus("glitta_tears is typing…");
      timer = setTimeout(() => {
        timer = null;
        busy = false;
        send.disabled = false;
        if (!online) {
          w.setStatus("Disconnected.");
          persist("room", saved.slice(-40));
          return;
        }
        const found = replies.find(([re]) => re.test(text)) || [
          null,
          "glitta_tears",
          "i am still here. tell me about the cd, the photos, or tomorrow. preferably before your phone line gives up.",
        ];
        transcript(w, log, found[1], found[2]);
        saved.push({ who: found[1], text: found[2] });
        persist("room", saved.slice(-40));
        w.setStatus("In room: MusicLovers28");
        sound();
      }, 1300);
    };
    const update = () =>
      w.setStatus(
        online ? "In room: MusicLovers28" : "Disconnected — conversation kept",
      );
    document.addEventListener("carmen-connection", update);
    w.dispose = () => {
      if (timer) clearTimeout(timer);
      persist("room", saved.slice(-40));
      document.removeEventListener("carmen-connection", update);
    };
  }
  const entries = [
    {
      id: "friday",
      title: "the last song is the problem",
      date: "Friday, September 16th, 2005 • 11:18 pm",
      mood: "restless",
      music: "the same four songs, apparently",
      body: [
        "There are twelve songs on this thing and I only meant to put ten. Taking one off feels mean, which is an embarrassing emotion to have about a compact disc.",
        "Maya says I should just give it to him. Maya also eats cereal out of a measuring cup, so I am considering the source.",
        "I changed the name of the folder. That counts as progress.",
      ],
      comments: [
        ["glitta_tears", "it has a HANDLE. it is an improved bowl."],
        ["carmenxcannibal", "please respect my deeply serious journal."],
        ["glitta_tears", "noon tomorrow. bring the sweater."],
      ],
    },
    {
      id: "photos",
      title: "four pictures survived",
      date: "Thursday, September 15th, 2005 • 9:06 pm",
      mood: "tired",
      music: "whatever is playing in liz’s car",
      body: [
        "We spent an entire afternoon trying to take one picture where nobody was blinking. The good one is the one we took while Liz was looking for her keys.",
        "I put them in selfies. The filenames are terrible. I know which one is which.",
      ],
      image: "IMG_2952.JPG",
      comments: [
        ["lizzy_love", "i found the keys. they were in my hand."],
        ["glitta_tears", "please tell me you deleted the bathroom one"],
      ],
    },
    {
      id: "phone",
      title: "disconnected",
      date: "Monday, September 12th, 2005 • 8:44 pm",
      mood: "annoyed",
      music: "nothing. the internet died.",
      body: [
        "Mom picked up the phone right when I was about to say something brave. By the time I connected again he was gone.",
        "Probably for the best. Probably not.",
      ],
      comments: [
        [
          "velcro_down",
          "save it in notepad first. this is what technology is for.",
        ],
      ],
    },
  ];
  function browser(initial = "myspace") {
    const existing = Shell.windows.get("internet-explorer");
    if (existing) {
      Shell.focus(existing);
      existing.navigate?.(initial);
      return;
    }
    const w = create({
      id: "internet-explorer",
      title: "Microsoft Internet Explorer",
      icon: "browser",
      width: 790,
      height: 590,
      x: 185,
      y: 35,
      menus: [
        fileMenu,
        {
          label: "Favorites",
          items: () => [
            { label: "Carmen’s MySpace", action: () => navigate("myspace") },
            {
              label: "paperhearts_x — LiveJournal",
              action: () => navigate("journal"),
            },
            { label: "Friends page", action: () => navigate("friends") },
          ],
        },
        helpMenu,
      ],
      status: "Done",
      secondary: "Internet",
    });
    if (!w) return;
    w.node.classList.add("ie-classic");
    let history = [],
      position = -1,
      current = "";
    const back = button("Back", () => travel(-1)),
      forward = button("Forward", () => travel(1));
    const tools = toolbar([
      { label: "Refresh", action: () => render(current) },
      { label: "Home", icon: "browser", action: () => navigate("myspace") },
      {
        label: "Favorites",
        icon: "folder",
        action: () => {
          favorites.hidden = !favorites.hidden;
        },
      },
      {
        label: "History",
        action: () => {
          favorites.hidden = false;
          favorites.replaceChildren(el("b", "", "Today"));
          [...new Set(history)].forEach((p) =>
            favorites.append(button(pageTitle(p), () => navigate(p))),
          );
        },
      },
    ]);
    tools.prepend(back, forward);
    const address = el("form", "addressbar"),
      field = el("input");
    field.setAttribute("aria-label", "Address");
    address.append(el("label", "", "Address"), field);
    const go = button("Go");
    go.type = "submit";
    address.append(go);
    const links = el("div", "ie-links");
    [
      ["MySpace", "myspace"],
      ["My journal", "journal"],
      ["Friends", "friends"],
    ].forEach(([t, p]) => links.append(button(t, () => navigate(p))));
    links.append(button("My Pictures", DesktopApps.photosApp));
    const wrap = el("div", "ie-wrap"),
      favorites = el("aside", "ie-favorites"),
      page = el("div", "browser-page");
    favorites.hidden = true;
    favorites.append(el("b", "", "Favorites"));
    [
      ["Carmen’s MySpace", "myspace"],
      ["paperhearts_x", "journal"],
      ["Friends page", "friends"],
    ].forEach(([t, p]) => favorites.append(button(t, () => navigate(p))));
    wrap.append(favorites, page);
    w.body.append(tools, address, links, wrap);
    function pageTitle(p) {
      return p === "myspace"
        ? "Carmen’s MySpace"
        : p === "friends"
          ? "Friends — paperhearts_x"
          : p.startsWith("entry:")
            ? "Comments — paperhearts_x"
            : "paperhearts_x — LiveJournal";
    }
    function url(p) {
      return p === "myspace"
        ? "http://www.myspace.com/CarmenXCannibal"
        : "http://paperhearts-x.livejournal.com/" +
            (p === "friends"
              ? "friends"
              : p.startsWith("entry:")
                ? p.slice(6) + ".html"
                : "");
    }
    function navigate(p) {
      if (current === p) return;
      history = history.slice(0, position + 1);
      history.push(p);
      position++;
      render(p);
    }
    function travel(n) {
      if (position + n < 0 || position + n >= history.length) return;
      position += n;
      render(history[position]);
    }
    function render(p) {
      current = p;
      back.disabled = position <= 0;
      forward.disabled = position >= history.length - 1;
      field.value = url(p);
      w.setTitle(pageTitle(p) + " — Microsoft Internet Explorer");
      w.setStatus(online ? "Done" : "Done • Working offline");
      page.replaceChildren();
      if (p === "myspace") {
        const brand = el("div", "browser-brand", "myspace.com");
        brand.append(el("small", "", "a place for friends"));
        const content = document
          .querySelector("#myspace-template")
          .content.querySelector(".myspace-body")
          .cloneNode(true);
        const nav = el("div", "myspace-nav");
        nav.append(
          button("Home", () => navigate("myspace")),
          button("Blog", () => navigate("journal")),
          button("View Photos", DesktopApps.photosApp),
          button("Send Message", () => message(CarmenStory.buddies[0])),
        );
        const contact = el("div", "myspace-contact");
        contact.append(
          el("b", "", "Contacting Carmen"),
          button("Read my LiveJournal", () => navigate("journal")),
          button("View away message", () =>
            dialog("CarmenXCannibal is away", away),
          ),
        );
        content.querySelector(".myspace-left-col").append(contact);
        content.querySelector(".myspace-comments-list").replaceChildren();
        [
          ["Maya", "you still have my sweater. this is a public reminder."],
          ["Liz", "prints are ready! don’t lose the slip."],
          ["Damon", "see you tomorrow. bring the cd."],
        ].forEach(([n, t]) => {
          const line = el("p");
          line.append(el("b", "", n + ": "), document.createTextNode(t));
          content.querySelector(".myspace-comments-list").append(line);
        });
        page.append(brand, nav, content);
        return;
      }
      renderJournal(p);
    }
    function renderJournal(p) {
      const journal = el("div", "livejournal"),
        mast = el("div", "lj-mast", "LiveJournal"),
        nav = el("div", "lj-nav");
      nav.append(
        button("Recent Entries", () => navigate("journal")),
        button("Friends", () => navigate("friends")),
        button("User Info", () =>
          dialog(
            "paperhearts_x",
            'Name: carmen\nLocation: somewhere between home and the bus stop\nInterests: burned cds, bad photos, bus windows, staying up too late\n\n"i know where everything is."',
          ),
        ),
      );
      const layout = el("div", "lj-layout"),
        side = el("aside", "lj-sidebar");
      const avatar = img("IMG_0444.JPG");
      avatar.alt = "Carmen";
      side.append(
        avatar,
        el("b", "", "paperhearts_x"),
        el("p", "", "carmen.\ni know where everything is."),
        el("hr"),
        el("small", "", "September 2005"),
        button("Friday, 16", () => navigate("entry:friday")),
        button("Thursday, 15", () => navigate("entry:photos")),
        button("Monday, 12", () => navigate("entry:phone")),
      );
      const main = el("div", "lj-main");
      main.append(
        el("h1", "", "this is the part i don’t say out loud"),
        el(
          "p",
          "lj-subtitle",
          p === "friends"
            ? "friends / recent entries"
            : "paperhearts_x / recent entries",
        ),
      );
      layout.append(side, main);
      journal.append(mast, nav, layout);
      page.append(journal);
      if (p === "friends") {
        [
          [
            "glitta_tears",
            "a list of things that are mine",
            "my sweater. my good eyeliner. the right to eat cereal out of whatever container i choose.",
          ],
          [
            "lizzy_love",
            "photographic evidence",
            "carmen thinks all the pictures are bad but she keeps changing her profile picture to a different one. i am counting this as a win.",
          ],
          [
            "velcro_down",
            "technical support",
            "found the adapter. nobody is allowed to ask about the adapter anymore.",
          ],
        ].forEach(([user, title, text]) => {
          const article = el("article", "lj-entry");
          article.append(
            el("div", "lj-date", user + " • September 16, 2005"),
            el("h2", "", title),
            el("p", "", text),
          );
          main.append(article);
        });
        return;
      }
      const selected = p.startsWith("entry:")
        ? entries.filter((e) => e.id === p.slice(6))
        : entries;
      for (const entry of selected) {
        const article = el("article", "lj-entry");
        article.append(
          el("div", "lj-date", entry.date),
          el("h2", "", entry.title),
        );
        entry.body.forEach((t) => article.append(el("p", "", t)));
        if (entry.image) {
          const picture = img(entry.image);
          picture.className = "lj-photo";
          picture.alt = "Photo from Carmen’s journal";
          article.append(picture);
        }
        article.append(
          el("div", "lj-mood", "Current mood: " + entry.mood),
          el("div", "lj-mood", "Current music: " + entry.music),
        );
        const own = state("comments." + entry.id, []);
        article.append(
          button(
            entry.comments.length + own.length + " comments | leave a comment",
            () => navigate("entry:" + entry.id),
            "lj-comment-link",
          ),
        );
        main.append(article);
        if (p.startsWith("entry:")) {
          const thread = el("div", "lj-comments");
          const appendComment = (user, text) => {
            const c = el("div", "lj-comment");
            c.append(el("b", "", user), el("p", "", text));
            thread.append(c);
          };
          entry.comments.forEach(([u, t]) => appendComment(u, t));
          own.forEach((t) => appendComment("carmenxcannibal", t));
          const form = el("form", "lj-comment-form");
          const input = el("textarea");
          input.setAttribute("aria-label", "Journal comment");
          input.maxLength = 2000;
          input.required = true;
          const send = button("Post Comment");
          send.type = "submit";
          const note = el("span", "lj-save-note");
          form.append(
            el("label", "", "Reply as carmenxcannibal"),
            input,
            send,
            note,
          );
          form.onsubmit = (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;
            if (!persist("comments." + entry.id, [...own, text].slice(-50))) {
              note.textContent = "Could not save your comment.";
              return;
            }
            own.push(text);
            appendComment("carmenxcannibal", text);
            input.value = "";
            note.textContent = "Comment saved.";
          };
          main.append(thread, form);
        }
      }
    }
    address.onsubmit = (e) => {
      e.preventDefault();
      const value = field.value.toLowerCase();
      if (value.includes("livejournal"))
        navigate(value.includes("friends") ? "friends" : "journal");
      else if (value.includes("myspace")) navigate("myspace");
      else
        dialog(
          "Work Offline",
          "That page is not saved on this computer. Try MySpace or LiveJournal from Favorites.",
        );
    };
    w.navigate = navigate;
    navigate(initial);
  }
  const additions = [
    { label: "My Documents", icon: "folder", action: documents },
    {
      label: "Recycle Bin",
      icon: "assets/recycle_bin_full-0.png",
      action: bin,
    },
    { label: "LiveJournal", icon: "note", action: () => browser("journal") },
    { label: "Dial-up Networking", icon: "computer", action: connection },
  ];
  for (const item of additions) {
    Shell.shortcut(item);
    const b = button(
      "",
      () => {
        Shell.closeMenus();
        item.action();
      },
      "menu-item",
    );
    b.append(img(item.icon), el("span", "", item.label));
    document
      .querySelector("#start-items")
      .insertBefore(b, document.querySelector("#start-items").lastChild);
  }
  const trayButton = button("", connection, "network-tray");
  trayButton.title = "Dial-up: disconnected";
  trayButton.setAttribute("aria-label", "Dial-up connection");
  trayButton.append(img("computer"));
  document.querySelector("#tray").prepend(trayButton);
  document.addEventListener("carmen-connection", () => {
    trayButton.title = online
      ? "Connected at 49,333 bps"
      : "Dial-up: disconnected";
    trayButton.classList.toggle("connected", online);
  });
  // A lived-in initial session, without blocking the desktop behind a login screen.
  const existing = Shell.windows.get("music-library");
  if (existing) Shell.minimize(existing);
  documents();
  aim();
  Shell.arrange();
  return { aim, chat, browser, documents, bin, connection, message };
})();
