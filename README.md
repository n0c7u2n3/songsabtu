# Songs About You

A Windows 98 inspired music-and-memory desktop, rebuilt from the original site. All eight mixtapes (115 tracks), four gallery photographs, profile/friend artwork, and animated scenes are retained. Carmen’s social desktop now has connected fictional conversations, journal entries, and personal files.

## Carmen’s desktop update

Four additions make the computer more personal:

- **My Documents:** editable journal entries, a weekend checklist, a mixtape draft, and a discarded profile bio. Changes save locally.
- **Recycle Bin:** preview two deleted text files and restore them into My Documents. Restoration persists between visits.
- **LiveJournal:** three journal entries, a friends page, mood/music fields, and comment threads. New comments save on this device.
- **Dial-up Networking:** connect/disconnect sequence, optional sounds, and a taskbar indicator. This controls the fictional online state of AIM and ICQ.

AIM now has its own buddy list, separate message windows, editable away messages, and scripted contextual replies. ICQ has a rewritten room conversation. Internet Explorer includes address navigation for the saved pages, history, favorites, and back/forward controls. The music player has a Winamp-inspired appearance, selectable playlist, and repeat control. Paint is not included.

Start with **Dial-up Networking → Connect**, then open AIM or Chat. Explore **My Documents**, **Recycle Bin**, and **LiveJournal** to follow Carmen’s Friday-night story. All social interactions are local fiction; they never send messages to external services.

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
- `content.js`: original playlists and retained archive data.
- `story.js`: Carmen’s new fictional documents and conversations.
- `immersion.js` / `immersion.css`: personal applications and period social interfaces.
- `desktop.css`: Windows 98 chrome and app layouts.
- `profile.css`: the original MySpace profile styling.
- `assets/`: locally cached original external imagery and system icons. Attribution URLs are in `assets/SOURCES.md`.

## Content boundaries

The original site cyclically assigned 15 audio URLs to 115 song titles, including unrelated demonstration music. That mapping is preserved, but the player and track lists identify these as **original samples that may not match the listed song**. Replace the mappings with verified, authorized audio if exact song playback is wanted. Original audio hosts remain external, with visible failure feedback.

AIM and ICQ use authored, scripted replies. LiveJournal comments, conversations, personal documents, and away messages persist locally. Email remains a read-only archive. None of these apps contact anyone. LimeWire searches the local music/archive entries and opens available samples; it does not connect to a peer-to-peer network or download the fictional executables. The Sims window retains the original animation. SkiFree retains the external Internet Archive embed and an explicit fallback link.

This is a browser desktop simulation, not a Windows virtual machine. The Windows 98 shell intentionally contains the original project's later-era music and apps.

## Validation performed

JavaScript syntax checks and DOM-based interaction checks cover all 24 desktop shortcuts, window/taskbar lifecycle, singleton apps, message/folder selection, sample playback queue (with mocked audio), search, notes and wallpaper persistence, show-desktop behavior, and 375px window bounds. Local image references and unchanged original image hashes were checked. Additional checks cover restored files, editable documents, away messages, online/offline messaging, contextual chat, LiveJournal navigation and comments, safe handling of typed text, playlist repeat, and cancellation of pending timers. The DOM checks do not verify browser rendering, real audio delivery, microphone hardware, or the third-party SkiFree service.
