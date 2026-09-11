# Songs About You

A Windows 98 inspired music-and-memory desktop, rebuilt from the original site. All eight mixtapes (115 tracks), four gallery photographs, profile/friend artwork, archived conversations, messages, and animated scenes are retained.

## Run

This is a dependency-free static site. Serve this directory with any static web server (for example, `python3 -m http.server 8000`) and open `http://localhost:8000`. GitHub Pages can serve the repository root directly. Microphone recording needs HTTPS or localhost and the visitor's permission.

## Desktop

- Double-click desktop shortcuts and files; tap on touch devices, or focus and press Enter/Space.
- Drag a title bar to move a window. Resize from its lower-right corner. Double-click the title bar to maximize or restore.
- Minimize, maximize, close, and switch windows through their controls and taskbar buttons.
- Right-click the desktop for Properties. Wallpaper, color, and image placement save on the current device.
- Notepad saves locally as you type. File → Save As downloads a text copy.
- Sound Recorder requests microphone access only after Record is pressed. Stop then use File → Save recording. Closing the app releases the microphone.

## Project structure

- `index.html`: desktop mounting points and preserved authored content templates.
- `desktop.js`: shared window management, menus, taskbar, keyboard/pointer handling, storage helpers.
- `apps.js`: Explorer, mixtapes, player, gallery, Notepad, display settings, Internet Explorer/MySpace, AIM, chat, Outlook Express, LimeWire archive, Sims scene, SkiFree embed, and recorder.
- `content.js`: original playlist and story data.
- `desktop.css`: Windows 98 chrome and app layouts.
- `profile.css`: the original MySpace profile styling.
- `assets/`: locally cached original external imagery and system icons. Attribution URLs are in `assets/SOURCES.md`.

## Content boundaries

The original site cyclically assigned 15 audio URLs to 115 song titles, including unrelated demonstration music. That mapping is preserved, but the player and track lists identify these as **original samples that may not match the listed song**. Replace the mappings with verified, authorized audio if exact song playback is wanted. Original audio hosts remain external, with visible failure feedback.

AIM, ICQ, and email are read-only story archives; they do not contact anyone. LimeWire searches the local music/archive entries and opens available samples; it does not connect to a peer-to-peer network or download the fictional executables. The Sims window retains the original animation. SkiFree retains the external Internet Archive embed and an explicit fallback link.

This is a browser desktop simulation, not a Windows virtual machine. The Windows 98 shell intentionally contains the original project's later-era music and apps.

## Validation performed

JavaScript syntax checks and DOM-based interaction checks cover all 20 desktop shortcuts, window/taskbar lifecycle, singleton apps, message/folder selection, sample playback queue (with mocked audio), search, notes and wallpaper persistence, show-desktop behavior, and 375px window bounds. Local image references and unchanged original image hashes were checked. The DOM checks do not verify browser rendering, real audio delivery, microphone hardware, or the third-party SkiFree service.
