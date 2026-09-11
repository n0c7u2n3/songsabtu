/* Original playlists and story content, preserved from the original site. */
const previewUrls = [
  "https://audio.jukehost.co.uk/4PdvbbpsRsua2yHB3LPWXlu6NhjIlx3s",
  "https://audio.jukehost.co.uk/VmqnQJKSdlL4BaHyW2gJUOJgI5huQLLG",
  "https://audio.jukehost.co.uk/GQetsVFQ8URoQT2qkbBwwkRjg9kB7IE0",
  "https://audio.jukehost.co.uk/uVi0Ph3bA7Qe2JzgNHwqsrEbcJTFOzVM",
  "https://audio.jukehost.co.uk/4A1Rkjkyy1cwyPD340W64LKutgq2RVj8",
  "https://audio.jukehost.co.uk/Hs7P8oaHxkWwToOAxHrUZFBp32XNGH8k",
  "https://audio.jukehost.co.uk/gVqBncKhAx2pgcZcb00wztePEKjMiiHr",
  "https://audio.jukehost.co.uk/bBFSKlFW2V8QpRzYi3qLgrltlltzBs1a",
  "https://audio.jukehost.co.uk/NECL7RqgG4fCAxiO4b2OAh6r7kSU8GI2",
  "https://audio.jukehost.co.uk/F6qxHNX1m80Sm1g5bM6BKL630pM1TWNT",
  "https://audio.jukehost.co.uk/6KwnbTWOxb6jzJ430uDyiGd4sKABUgUF",
  "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/menu.ogg",
  "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race1.ogg",
  "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race2.ogg",
  "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race3.ogg",
];

const albums = [
  {
    bandName: "Episode 1",
    albumTitle: "Songs About Brock",
    tracks: [
      { trackNumber: 1, title: "I'm Yours – Jason Mraz" },
      { trackNumber: 2, title: "Swing Life Away – Rise Against" },
      { trackNumber: 3, title: "So Contagious – Acceptance" },
      { trackNumber: 4, title: "Drive – Incubus" },
      { trackNumber: 5, title: "Wonderwall (Remastered) – Oasis" },
      { trackNumber: 6, title: "Sex & Candy – Marcy Playground" },
      { trackNumber: 7, title: "Work – Jimmy Eat World" },
      { trackNumber: 8, title: "If You Could Only See – Tonic" },
      { trackNumber: 9, title: "Hello – Adele" },
      {
        trackNumber: 10,
        title: "Someday You Will Be Loved – Death Cab for Cutie",
      },
      {
        trackNumber: 11,
        title: "The Boy Who Blocked His Own Shot – Brand New",
      },
    ],
  },
  {
    bandName: "Episode 2",
    albumTitle: "Songs About Jessica",
    tracks: [
      { trackNumber: 1, title: "Como La Flor – Selena" },
      { trackNumber: 2, title: "Boyfriend – Best Coast" },
      { trackNumber: 3, title: "We Sink – CHVRCHES" },
      { trackNumber: 4, title: "Want You Back – HAIM" },
      { trackNumber: 5, title: "Dreams - 2004 Remaster – Fleetwood Mac" },
      { trackNumber: 6, title: "Cranes in the Sky – Solange" },
      { trackNumber: 7, title: "Location – Khalid" },
      { trackNumber: 8, title: "Salad Days – Mac DeMarco" },
      { trackNumber: 9, title: "Warm Thoughts – Flume" },
      { trackNumber: 10, title: "California English – Vampire Weekend" },
      { trackNumber: 11, title: "Stop the Fu*king Car – Circa Survive" },
      { trackNumber: 12, title: "Yes I'm Changing – Tame Impala" },
      { trackNumber: 13, title: "Chamber Of Reflection – Mac DeMarco" },
    ],
  },
  {
    bandName: "Episode 3",
    albumTitle: "Songs About Peter",
    tracks: [
      { trackNumber: 1, title: "Mother & Father – BROODS" },
      { trackNumber: 2, title: "I Love You – Faith Evans" },
      { trackNumber: 3, title: "Bad Religion – Frank Ocean" },
      { trackNumber: 4, title: "I Wanna Be Yours – Arctic Monkeys" },
      { trackNumber: 5, title: "When The Sun Don't Shine – Best Coast" },
      { trackNumber: 6, title: "Ivy – Frank Ocean" },
      { trackNumber: 7, title: "Cada Que... – Belanova" },
      { trackNumber: 8, title: "Lies – MARINA" },
      { trackNumber: 9, title: "Try – The xx" },
      { trackNumber: 10, title: "Not In That Way – Sam Smith" },
      { trackNumber: 11, title: "iT's YoU – ZAYN" },
      { trackNumber: 12, title: "Good Thing – Sam Smith" },
      { trackNumber: 13, title: "With Every Heartbeat – Robyn, Kleerup" },
      { trackNumber: 14, title: "Cobarde – Selena" },
      { trackNumber: 15, title: "Golden – Jill Scott" },
    ],
  },
  {
    bandName: "Episode 4",
    albumTitle: "Songs About Jess",
    tracks: [
      { trackNumber: 1, title: "Other Voices – The Orwells" },
      {
        trackNumber: 2,
        title: "Mallrats - Audiotree Live Session – The Orwells",
      },
      { trackNumber: 3, title: "Clash the Truth – Beach Fossils" },
      { trackNumber: 4, title: "Maxed out on Distractions – Corners" },
      { trackNumber: 5, title: "Lets Go Surfing – The Drums" },
      {
        trackNumber: 6,
        title: "Why Don't You Lie? – The King Khan & BBQ Show",
      },
      { trackNumber: 7, title: "Your Graduation – Modern Baseball" },
      { trackNumber: 8, title: "Secret Society – Title Fight" },
      { trackNumber: 9, title: "Bad Apple – Basement" },
      { trackNumber: 10, title: "Dog – Wavves" },
      {
        trackNumber: 11,
        title: "I'll Never Belong – The King Khan & BBQ Show",
      },
      { trackNumber: 12, title: "Hit & Run – King Tuff" },
      { trackNumber: 13, title: "Girl Afraid - 2011 Remaster – The Smiths" },
      { trackNumber: 14, title: "Derailed – Joyce Manor" },
      { trackNumber: 15, title: "Beach Community – Joyce Manor" },
      { trackNumber: 16, title: "Someday – The Growlers" },
    ],
  },
  {
    bandName: "Episode 5",
    albumTitle: "Songs About Paige",
    tracks: [
      { trackNumber: 1, title: "Come On Eileen – Dexys Midnight Runners" },
      { trackNumber: 2, title: "Read My Mind – The Killers" },
      {
        trackNumber: 3,
        title: "Nearly Witches (Ever Since We Met...) – Panic! At The Disco",
      },
      {
        trackNumber: 4,
        title: "I Went To The Store One Day – Father John Misty",
      },
      { trackNumber: 5, title: "Medicine – The 1975" },
      { trackNumber: 6, title: "Jackie and Wilson – Hozier" },
      { trackNumber: 7, title: "Fallingforyou – The 1975" },
      { trackNumber: 8, title: "King Kunta – Kendrick Lamar" },
      {
        trackNumber: 9,
        title: "Chateau Lobby #4 (in C for Two Virgins) – Father John Misty",
      },
      { trackNumber: 10, title: "Heavy Feet – Local Natives" },
      {
        trackNumber: 11,
        title: "You're Gonna Live Forever in Me – John Mayer",
      },
      { trackNumber: 12, title: "Romeo And Juliet – The Killers" },
      { trackNumber: 13, title: "Can't Help Falling in Love – Haley Reinhart" },
      { trackNumber: 14, title: "Northern Wind – City and Colour" },
      {
        trackNumber: 15,
        title: "Falling Slowly – Glen Hansard, Markéta Irglová",
      },
      { trackNumber: 16, title: "A Lack Of Color – Death Cab for Cutie" },
      { trackNumber: 17, title: "Re: Stacks – Bon Iver" },
    ],
  },
  {
    bandName: "Episode 6",
    albumTitle: "Songs About Henry",
    tracks: [
      {
        trackNumber: 1,
        title: "Tonight I'm Getting Over You – Carly Rae Jepsen",
      },
      { trackNumber: 2, title: "Happy Idiot – TV On The Radio" },
      { trackNumber: 3, title: "Elastic Heart – Sia" },
      {
        trackNumber: 4,
        title:
          "Details in the Fabric (feat. James Morrison) – Jason Mraz, James Morrison",
      },
      { trackNumber: 5, title: "Up&Up – Coldplay" },
      { trackNumber: 6, title: "Everglow – Coldplay" },
      { trackNumber: 7, title: "Clean – Taylor Swift" },
      { trackNumber: 8, title: "Shutter Island – Jessie Reyez" },
      { trackNumber: 9, title: "FIGURES – Jessie Reyez" },
      { trackNumber: 10, title: "Last Goodbye – Kesha" },
      { trackNumber: 11, title: "Goodbye to You – Michelle Branch" },
      {
        trackNumber: 12,
        title:
          "We Don't Talk Anymore (feat. Selena Gomez) – Charlie Puth, Selena Gomez",
      },
      { trackNumber: 13, title: "He Wasn't – Avril Lavigne" },
      { trackNumber: 14, title: "Ghost – Katy Perry" },
      { trackNumber: 15, title: "Emoji of a Wave – John Mayer" },
    ],
  },
  {
    bandName: "Episode 7",
    albumTitle: "Songs About Owen",
    tracks: [
      { trackNumber: 1, title: "Archie, Marry Me – Alvvays" },
      { trackNumber: 2, title: "Someday – The Growlers" },
      { trackNumber: 3, title: "I Belong in Your Arms – Chairlift" },
      {
        trackNumber: 4,
        title: "Chateau Lobby #4 (in C for Two Virgins) – Father John Misty",
      },
      { trackNumber: 5, title: "Love On Top – Beyoncé" },
      { trackNumber: 6, title: "Talking Backwards – Real Estate" },
      {
        trackNumber: 7,
        title: "So Good At Being in Trouble – Unknown Mortal Orchestra",
      },
      { trackNumber: 8, title: "Down By The Water – The Drums" },
      { trackNumber: 9, title: "Warm Water – BANKS" },
      { trackNumber: 10, title: "for him. – Troye Sivan, Allday" },
    ],
  },
  {
    bandName: "Episode 8",
    albumTitle: "Songs About Justin",
    tracks: [
      { trackNumber: 1, title: "Magnetism – Vacationer" },
      { trackNumber: 2, title: "Broken Clocks – SZA" },
      { trackNumber: 3, title: "No Love Allowed – Rihanna" },
      { trackNumber: 4, title: "Curious – Hayley Kiyoko" },
      { trackNumber: 5, title: "Closer – Tegan and Sara" },
      { trackNumber: 6, title: "Velvet Elvis – Kacey Musgraves" },
      {
        trackNumber: 7,
        title:
          "Femmebot (feat. Dorian Electra and Mykki Blanco) – Charli xcx, Dorian Electra, Mykki Blanco",
      },
      { trackNumber: 8, title: "Tiny Little Bows – Carly Rae Jepsen" },
      { trackNumber: 9, title: "Dreams – The Cranberries" },
      {
        trackNumber: 10,
        title:
          "Twerkin!!! (feat. Diplo & Sissy Nobby) – Kreayshawn, Diplo, Sissy Nobby",
      },
      { trackNumber: 11, title: "Better Off – Ashlee Simpson" },
      { trackNumber: 12, title: "Shakespeare – Miranda Cosgrove" },
      { trackNumber: 13, title: "Cool People – Chloe x Halle" },
      { trackNumber: 14, title: "Don't You Pretend – Kelly Clarkson" },
      { trackNumber: 15, title: "Rock the Boat – Hues Corporation" },
      { trackNumber: 16, title: "Flower Tattoo – Mind Bath, Forever" },
      { trackNumber: 17, title: "Delicate – Taylor Swift" },
      { trackNumber: 18, title: "Brick by Boring Brick – Paramore" },
    ],
  },
];

const photos = [
  { filename: "stickam :p", url: "IMG_2952.JPG" },
  { filename: "pfp", url: "IMG_0444.JPG" },
  { filename: "hxc", url: "IMG_0433.JPG" },
  { filename: "stikammm", url: "IMG_2951.JPG" },
];

const aimConversations = {
  mixCDz4U: {
    displayName: "julian",
    log: [
      { sender: "buddy", message: "got the new audio stitched" },
      { sender: "you", message: "aye" },
      {
        sender: "buddy",
        message: "intro’s clean. voice cracked a little at 01:32 tho",
      },
      { sender: "you", message: "leave it" },
      { sender: "buddy", message: "figured" },
    ],
  },
  velcro_down: {
    displayName: "darrell",
    log: [
      { sender: "buddy", message: "just heard the cut!" },
      { sender: "you", message: "cool, you got the limewire link!" },
      {
        sender: "buddy",
        message:
          "downloaded it at the same time i was getting that new paramore album lol",
      },
      { sender: "you", message: "had to put it on there, file too large ugh" },
      { sender: "buddy", message: "so cool" },
      { sender: "you", message: "we’re just... with the times" },
      {
        sender: "buddy",
        message: "no literally. i’m burning it to a disc now",
      },
    ],
  },
  glitta_tears: {
    displayName: "maya",
    log: [
      { sender: "buddy", message: "can i borrow ur cd player for the bus" },
      { sender: "you", message: "the anti-skip one or the scratched up one" },
      { sender: "buddy", message: "anti-skip. obviously." },
      { sender: "you", message: "don’t leave it in your locker this time" },
      { sender: "buddy", message: "no promises" },
    ],
  },
  glowstickriotx: {
    displayName: "jess",
    log: [
      { sender: "buddy", message: "party at javi’s friday" },
      { sender: "you", message: "are they letting ppl in this time" },
      { sender: "buddy", message: "no gatekeeping this time. bring cds" },
      { sender: "you", message: "i’ll bring the good ones" },
      {
        sender: "buddy",
        message:
          "don’t bring the ones u made w the weird voicemail intros again",
      },
      { sender: "you", message: "those are the good ones..." },
    ],
  },
  snarehungry: {
    displayName: "aaron",
    log: [
      { sender: "buddy", message: "we’re meeting at the gates at 9" },
      { sender: "you", message: "i thought doors opened at 11" },
      {
        sender: "buddy",
        message: "yeah but sarah’s trying to meet nfg at the signing tent",
      },
      {
        sender: "you",
        message: "okay. i’ll bring sunscreen and you bring snacks",
      },
      { sender: "buddy", message: "i’m not your dad" },
      { sender: "you", message: "hater" },
    ],
  },
};

const emailData = {
  Inbox: [
    {
      from: "julian@saypodcast.com",
      subject: "interview questions draft",
      preview: "yo here’s that first draft of Qs...",
      body: `hii <br>
attached a draft of the questions. feel free to move things around. i think we should open with something softer so they don’t freeze up, but it's up to you<br><br>also don’t forget, the studio space we usually use downtown is blocked off bc they’re filming some scenes for Veronica Mars or something, so the whole alley’s shut down. we're at the other spot near the old Tower Records instead. same time, 3pm.`,
    },
    {
      from: "jimmy@hogmail.com",
      subject: "yo i found the this on limewire lol",
      preview: "heyy looking for the new death c...",
      body: `heyy<br>looking for the new death cab album and downloaded the first cut of ur internet radio show<br>good shiit!<br>cool if i put it on some flash drives and pass them out at coachella this year? lol`,
    },
    {
      from: "MDara@sjsu.edu",
      subject: "can i borrow ur cd player??",
      preview: "yo can i borrow your cd player?...",
      body: `yo can i borrow your cd player?\nmine broke and i got that burned mix i still haven’t heard.\ni promise i’ll bring it back by friday, unless we’re hanging before then.`,
    },
    {
      from: "kyle@hotmess.net",
      subject: "party @ tasha’s",
      preview: "friday night starts at 9. tash...",
      body: `friday night \nstarts at 9. tasha said she’s doing a full vinyl set so bring a blank tape if you want a copy.\nalso liam’s gonna be there so don’t be weird lol`,
    },
    {
      from: "zoe@pop-punk.org",
      subject: "warped tour planzzz",
      preview: "we’re hitting shoreline around 11...",
      body: `gates open at 11.\nwe’re meeting at the gas station across from safeway at like 9.\nalso i printed the schedule and circled all the bands we care about so we don’t miss anyone.\ntext me if u flake.`,
    },
  ],
  Sent: [],
  Drafts: [],
  Spam: [
    {
      from: "winaplayer1999@freesounds.ru",
      subject: "FREE MP3s NOW",
      preview: "click here to unlock 10,000 mp3 files (virus free)",
      body: `you’ve been selected to try our newest p2p downloader.\nget 10,000 mp3s now — totally free. no credit card required. not a scam.`,
    },
    {
      from: "ringtonez4u@b0ingmail.com",
      subject: "custom ringtone waiting",
      preview: "your crush thinks you’re cute. download Crazy Frog now.",
      body: `your custom ringtone is ready!\ndownload now to get:\n\n    Crazy Frog\n\n    Hollaback Girl\n\n    The OC Theme\n\nfirst 25 downloads also get a free AIM away message pack.`,
    },
  ],
};

const chatLog = [
  {
    user: "Sk8rBoi_82",
    color: "#00FFFF",
    message: "yo is this thing even working? haha",
  },
  {
    user: "SpiceFan_97",
    color: "#FF00FF",
    message:
      "lmao yeah you’re on. just got back from blockbuster. chaos as usual.",
  },
  {
    user: "AltGirl_J9",
    color: "#A52A2A",
    message: "ugh, did they even have *Reality Bites* this time?",
  },
  {
    user: "CD_Master",
    color: "#FFFF00",
    message:
      "nope. but I snagged the Empire Records soundtrack on cassette lol",
  },
  {
    user: "CD_Master",
    color: "#FFFF00",
    message:
      'tell me about it. anyway, did you guys hear that new radio show? "Songs About You"?',
  },
  {
    user: "Sk8rBoi_82",
    color: "#00FFFF",
    message:
      "NO WAY! I heard the commercial on the radio. the one where they talk about mix tapes?",
  },
  {
    user: "SpiceFan_97",
    color: "#FF00FF",
    message:
      "not mix tapes, dork. BURNED CDs. get with the times! it is 1997!!",
  },
  {
    user: "DJ_MellowTone",
    color: "#7FFFD4",
    message:
      "yo has anyone else been listening to that radio show “Songs About You”?",
  },
  {
    user: "SpiceFan_97",
    color: "#FF00FF",
    message:
      "yesss! they were talking about burned CDs last night. it was all so dramatic haha",
  },
  {
    user: "Sk8rBoi_82",
    color: "#00FFFF",
    message:
      "wait I heard the ad! they were like “what did *you* put on your CD for your crush?” lmao",
  },
  {
    user: "Indie_Chi",
    color: "#BC8F8F",
    message:
      "I’d die if someone gave me a CD with Mazzy Star on it. just float away into the fog",
  },
  {
    user: "CD_Master",
    color: "#FFFF00",
    message:
      "this guy on the show made one for some girl named Sarah and led with “Wonderwall”… like bruh, try harder",
  },
  {
    user: "Sk8rBoi_82",
    color: "#00FFFF",
    message:
      "Jewel better be track 2 tho. can’t go wrong with “You Were Meant for Me”",
  },
  {
    user: "VinylVampire",
    color: "#FF4500",
    message:
      "lol y’all and your CDs. I’ll stick to mixtapes on Maxell. analog forever",
  },
  {
    user: "DJ_MellowTone",
    color: "#7FFFD4",
    message:
      "nah I burned one for my neighbor and opened with “Return of the Mack.” 90s R&B supremacy.",
  },
  {
    user: "AltGirl_J9",
    color: "#A52A2A",
    message:
      "mine would start with “Fade Into You” and end with Radiohead. if you don’t cry, you’re not the one.",
  },
  {
    user: "GrungeCore88",
    color: "#708090",
    message: "ngl, I’d just put Soundgarden on repeat. mood setter.",
  },
  {
    user: "SpiceFan_97",
    color: "#FF00FF",
    message: "as long as there’s no Limp Bizkit I’m good 🙃",
  },
  {
    user: "CD_Master",
    color: "#FFFF00",
    message:
      "I just finished mine. it starts with “Semi-Charmed Life” then fades into “Criminal” by Fiona Apple. a journey.",
  },
  {
    user: "VinylVampire",
    color: "#FF4500",
    message:
      "respect. as long as you didn’t put Smash Mouth on there, we’re still friends",
  },
  {
    user: "Sk8rBoi_82",
    color: "#00FFFF",
    message: "yo don’t hate on “Walkin’ on the Sun” 👀",
  },
  {
    user: "Indie_Chi",
    color: "#BC8F8F",
    message:
      "ugh this makes me wanna go to Tower Records and blow $40 I don’t have",
  },
  {
    user: "System",
    color: "#FF6347",
    message: "*** Sk8rBoi_82 is experiencing severe lag. ***",
  },
  {
    user: "Sk8rBoi_82",
    color: "#00FFFF",
    message: "ok dial-up is being a jerk. catch ya later",
  },
  {
    user: "System",
    color: "#FF6347",
    message: "*** Sk8rBoi_82 has left the chat. ***",
  },
  { user: "GrungeCore88", color: "#708090", message: "peace out sk8rboi" },
  {
    user: "AltGirl_J9",
    color: "#A52A2A",
    message: "gonna burn a CD now and pretend someone asked for it",
  },
  { user: "SpiceFan_97", color: "#FF00FF", message: "mood." },
  {
    user: "System",
    color: "#FF6347",
    message: "*** chat will auto-log out in 5 minutes due to inactivity ***",
  },
];
