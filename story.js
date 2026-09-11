"use strict";
/* Fictional, local story data. No messages are sent to real people. */
const CarmenStory = {
  screenName: "CarmenXCannibal",
  away: "at the kitchen counter pretending i am not waiting for someone to sign on. leave it here.",
  documents: [
    {
      id: "journal",
      name: "september.txt",
      date: "9/16/2005 11:42 PM",
      text: `friday, september 16\n\ni moved him out of my top friends and then moved him back before anyone could notice. maya noticed. of course she noticed.\n\nmom left half a peach on a plate next to the keyboard. there is a fork with it like this is a restaurant and not me eating over the space bar again.\n\ni keep making the same mix with a different first song. i think i want the first song to do the talking so i don't have to.\n\nsaturday: get on the 26 before 12. bring maya's sweater. ask for my cd back without making it a thing.\n\n11:42\nhe's online. i'm going to finish the mix.`,
    },
    {
      id: "mix",
      name: "tracklist_final_FINAL.txt",
      date: "9/16/2005 10:58 PM",
      text: `FOR THE DRIVE HOME\n\n01. something that doesn't immediately give me away\n02. the one from the bus\n03. his song. maybe.\n04. something loud so there is no weird silence\n\nDO NOT use the silver disc. that one skips.\nblue sharpie = the real one\nblack sharpie = backup\n\nput the photos on a separate disc this time.\n\nfile under: perfectly normal things to spend three hours on.`,
    },
    {
      id: "weekend",
      name: "before i leave.txt",
      date: "9/16/2005 8:13 PM",
      text: `SATURDAY\n\n[ ] maya's green sweater\n[ ] two AA batteries\n[ ] burn the actual mix, not the folder shortcut\n[ ] $6 for bus + food\n[ ] pick up the prints with liz\n[ ] call mom from maya's house\n\nthere is $3 in the old sims case. don't forget.`,
    },
    {
      id: "passwords",
      name: "important!!!.txt",
      date: "9/14/2005 6:20 PM",
      text: `if the internet stops working:\n\n1. check if mom picked up the phone\n2. stop clicking Connect twelve times\n3. wait\n\nprinter only works if you unplug it and make it feel threatened.\n\nliz's photo is in selfies, under stikammm. stop asking her to send it again.`,
    },
    {
      id: "bio",
      name: "about_me_draft.txt",
      date: "9/15/2005 12:09 AM",
      text: `carmen.\n\ni like people who give the cd back in its case.\n\nno. too bitter.\n\ni like bus windows at night and the first ten seconds of a song you forgot you loved.\n\nthat sounds like a candle.\n\nunder construction.`,
    },
  ],
  deleted: [
    {
      id: "unsent",
      name: "dont_send_this.txt",
      date: "9/16/2005 11:36 PM",
      text: `damon,\n\ni wasn't mad that you left early. i was mad that i kept looking at the door after you left.\n\ni know that isn't really something you did.\n\ni still have your cd. you can get it tomorrow.\n\n— c\n\n\nno. delete this.`,
    },
    {
      id: "oldmix",
      name: "tracklist_old.txt",
      date: "9/16/2005 9:47 PM",
      text: `FOR DAMON\n\nnope.\n\nrename the folder.\n\nFOR THE DRIVE HOME.\n\nbetter.`,
    },
  ],
  room: [
    ["System", "*** You have entered MusicLovers28. ***"],
    ["velcro_down", "who has my headphone adapter"],
    ["glitta_tears", "you asked this yesterday"],
    ["velcro_down", "and yet i remain adapterless"],
    ["CarmenXCannibal", "check the pocket on your guitar case"],
    ["velcro_down", "..."],
    ["velcro_down", "thank you"],
    ["lizzy_love", "carmen did the photos come out"],
    [
      "CarmenXCannibal",
      "four survived. the flash made everyone else look like a hostage",
    ],
    ["glitta_tears", "put mine up anyway i look mysterious"],
    ["lizzy_love", "you look like you’re looking for the bathroom"],
    ["glitta_tears", "mysteriously"],
    ["DamonXDisasteR", "are we still meeting tomorrow"],
    ["CarmenXCannibal", "yeah. noon?"],
    ["DamonXDisasteR", "cool. bring the cd if you finished it"],
    ["CarmenXCannibal", "which cd"],
    ["glitta_tears", "carmen"],
    ["CarmenXCannibal", "i have a lot of cds"],
    ["DamonXDisasteR", "the blue one. anyway gotta go. sister needs the phone"],
    ["System", "*** DamonXDisasteR has left the room. ***"],
    ["lizzy_love", "i need to log off too. pick up prints tomorrow?"],
    ["System", "*** lizzy_love is away. ***"],
    ["glitta_tears", "so. which cd, huh"],
    ["CarmenXCannibal", "do not start"],
    ["glitta_tears", "i am being so normal right now"],
  ],
  buddies: [
    {
      id: "glitta_tears",
      name: "maya",
      status: "Online",
      away: "if found, return to the food court.",
      intro: [
        ["buddy", "did you finish burning it or are we on version eleven"],
        ["you", "the file is literally called final"],
        ["buddy", "how many finals"],
        ["you", "two. irrelevant."],
      ],
      replies: {
        cd: "use the blue sharpie one. the silver one sounds like it fell down the stairs.",
        damon:
          "you can just say you wanted him to have it. i promise the earth will continue rotating.",
        photos: "the bathroom one stays between us. please.",
        default:
          "okay. noon tomorrow. sweater, cd, bus money. i am making you a list because i love you.",
      },
    },
    {
      id: "DamonXDisasteR",
      name: "damon",
      status: "Away",
      away: "phone line hostage situation. back later.",
      intro: [
        ["buddy", "hey i found the case for your cd"],
        ["you", "keep it with the cd this time"],
        ["buddy", "i deserved that"],
        ["buddy", "see you tomorrow?"],
      ],
      replies: {
        default:
          "Auto response from DamonXDisasteR: phone line hostage situation. back later.",
      },
    },
    {
      id: "lizzy_love",
      name: "liz",
      status: "Away",
      away: "picking a profile picture is a full time job.",
      intro: [
        ["buddy", "prints are ready btw"],
        ["you", "are they terrible"],
        ["buddy", "one is good. two if you squint."],
        ["you", "ill take it"],
      ],
      replies: {
        default:
          "Auto response from lizzy_love: picking a profile picture is a full time job.",
      },
    },
    {
      id: "velcro_down",
      name: "darrell",
      status: "Online",
      away: "recording. probably clipping.",
      intro: [
        ["buddy", "found the adapter"],
        ["you", "i know. i was there"],
        ["buddy", "wanted to update all concerned parties"],
      ],
      replies: {
        cd: "burn it at the slow speed. trust me on this one.",
        default:
          "tell maya i can give you both a ride if the bus is late. not waiting forever though.",
      },
    },
    {
      id: "mixCDz4U",
      name: "julian",
      status: "Offline",
      away: "",
      intro: [
        ["buddy", "got the new audio stitched"],
        ["you", "leave the voice crack in"],
        ["buddy", "figured. it sounds like you."],
      ],
      replies: { default: "This buddy is offline. Your message was not sent." },
    },
  ],
};
