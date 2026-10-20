// Generated from the client's Google Doc (Mehr Dhawan - Swachh Kal App). Edit the doc, not this file's text, where possible.
export type Block =
  | { k: 'h1' | 'h2' | 'p' | 'b' | 'note' | 'herb'; t: string }
  | { k: 'bin'; color: string; title: string; items: string[]; notes: string[] }
  | { k: 'step'; title: string; t: string };

export interface DocTheme {
  storyTitle: string;
  storyLines: string[];
  completeMessage: string;
  badgeName: string;
  microHabits: string[];
  quickFacts: string[];
  articles: { title: string; url: string }[];
  explainer: Block[];
}

export const DOC: Record<'vayu' | 'tarun' | 'dharti' | 'jal', DocTheme> = {
  "vayu": {
    "storyTitle": "Vayu and the Hawa Hero",
    "storyLines": [
      "One morning, the air felt heavy and grey.",
      "Vayu, the air all around us, was struggling.",
      "He whispered softly,",
      "“Why is it so hard to breathe?”",
      "Smoke from cars, burning waste, and firecrackers had made him weak.",
      "The sky looked dull, and the air felt thick.",
      "Just then, a bright figure appeared in the distance.",
      "It was the Hawa Hero",
      "The Hawa Hero was known across the city, someone who protected the air and helped everyone make better choices.",
      "“Vayu, I’m here,” said the Hawa Hero gently.",
      "Vayu looked up and said,",
      "“I need help… I can’t breathe properly anymore.”",
      "The Hawa Hero nodded and turned to the people around.",
      "“Every small action matters,” they said.",
      "“Let’s help Vayu together.”",
      "The Hawa Hero showed everyone what to do:",
      "Walk instead of using cars for short distances",
      "Never burn waste",
      "Plant and care for trees",
      "Slowly, people began to follow.",
      "With every good choice, something magical happened.",
      "The grey smoke started to fade…",
      "The air became lighter… clearer… fresher.",
      "Vayu took a deep breath and smiled,",
      "“I feel better!”",
      "The Hawa Hero turned to everyone and said,",
      "“You don’t need powers to help the air.",
      "You just need to make the right choices.”",
      "And from that day on, people everywhere tried to follow the Hawa Hero.",
      "Because they knew,",
      "Even the smallest actions can help Vayu breathe again.",
      "Will you follow the Hawa Hero and help Vayu too?"
    ],
    "completeMessage": "You helped Vayu breathe again!",
    "badgeName": "Hawa Hero",
    "microHabits": [
      "I walked or cycled for a short trip today (under 1 km)",
      "I reminded someone to switch off the vehicle engine while waiting",
      "I opened windows for fresh air at home/school today",
      "I did NOT burn any waste today",
      "I avoided firecrackers today",
      "I used or supported public/shared transport today",
      "I told at least one person why clean air matters",
      "I kept my surroundings clean to reduce dust and pollution",
      "I avoided using products that create smoke (like incense/sprays) indoors today",
      "I switched off unnecessary electricity (fans/lights) when not in use"
    ],
    "quickFacts": [
      "You take around 20,000 breaths every day, what you breathe matters every second.",
      "One car in traffic doesn’t just pollute, it affects everyone around it.",
      "The air outside isn’t always worse, indoor air can sometimes be more polluted.",
      "A single tree doesn’t just give oxygen, it helps clean the air around it.",
      "Your lungs are like sponges, clean air keeps them strong, polluted air weakens them.",
      "Burning waste releases harmful gases you can’t see, but your body feels them.",
      "Air has no boundaries, pollution in one place can travel far away.",
      "Children breathe faster than adults, so polluted air affects them more."
    ],
    "articles": [
      {
        "title": "UN Goal 13 — Climate Action",
        "url": "https://sdgs.un.org/goals/goal13"
      },
      {
        "title": "Climate, health & policy: media coverage and solutions",
        "url": "https://sdgresources.relx.com/articles/inaction-integration-media-coverage-climate-health-policy-approaches-and-solution-target"
      },
      {
        "title": "Air pollution research (ScienceDirect)",
        "url": "https://www.sciencedirect.com/science/article/pii/S0959652624017207"
      },
      {
        "title": "UN India — Sustainable Development Goals",
        "url": "https://india.un.org/en/sdgs"
      }
    ],
    "explainer": [
      {
        "k": "h1",
        "t": "The Air You Breathe"
      },
      {
        "k": "p",
        "t": "We often think air pollution is only outside."
      },
      {
        "k": "p",
        "t": "But the air inside our homes and classrooms also matters."
      },
      {
        "k": "p",
        "t": "You are always surrounded by air, both indoors and outdoors."
      },
      {
        "k": "h2",
        "t": "Indoor Air"
      },
      {
        "k": "h2",
        "t": "What’s Inside Matters"
      },
      {
        "k": "p",
        "t": "Indoor air can become polluted because of:"
      },
      {
        "k": "b",
        "t": "Closed spaces with no fresh air"
      },
      {
        "k": "b",
        "t": "Smoke from incense, sprays, or cooking"
      },
      {
        "k": "b",
        "t": "Dust and poor ventilation"
      },
      {
        "k": "p",
        "t": "When fresh air cannot enter, the air inside becomes heavy and unhealthy."
      },
      {
        "k": "h2",
        "t": "Outdoor Air"
      },
      {
        "k": "h2",
        "t": "What’s Outside Matters Too"
      },
      {
        "k": "p",
        "t": "Outdoor air gets polluted due to:"
      },
      {
        "k": "b",
        "t": "Vehicle smoke"
      },
      {
        "k": "b",
        "t": "Burning waste"
      },
      {
        "k": "b",
        "t": "Firecrackers"
      },
      {
        "k": "b",
        "t": "Dust and construction"
      },
      {
        "k": "p",
        "t": "This polluted air can also enter indoor spaces."
      },
      {
        "k": "h2",
        "t": "Why This Matters"
      },
      {
        "k": "b",
        "t": "You breathe it all"
      },
      {
        "k": "b",
        "t": "You move between indoor and outdoor spaces everyday"
      },
      {
        "k": "b",
        "t": "If the air in both places is polluted, your body is constantly exposed to it"
      },
      {
        "k": "h2",
        "t": "What can you do?"
      },
      {
        "k": "b",
        "t": "Open the windows to let the fresh air in"
      },
      {
        "k": "b",
        "t": "Avoid creating smoke indoors"
      },
      {
        "k": "b",
        "t": "Do not burn any type of waste"
      },
      {
        "k": "b",
        "t": "Choose cleaner ways to travel whenever possible"
      }
    ]
  },
  "tarun": {
    "storyTitle": "Little Tarun is Very Important For Our Lives",
    "storyLines": [
      "In a quiet corner of the city, a tiny sapling stood alone.",
      "It was Tarun.",
      "He was small, with just a few leaves, trying to grow between concrete and dust.",
      "“I want to become a big tree one day,” Tarun said softly,",
      "“But it’s not easy…”",
      "The sun was harsh.",
      "The soil was dry.",
      "And no one seemed to notice him.",
      "Days passed.",
      "Tarun tried his best to grow—but he needed help.",
      "One day, someone stopped.",
      "They looked closely… and smiled.",
      "It was the Pedh Rakshak",
      "The Pedh Rakshak gently touched the soil and said,",
      "“You’re not alone anymore.”",
      "They brought water and poured it carefully.",
      "They placed a small guard around Tarun to protect him.",
      "They made sure no one stepped on him.",
      "People nearby watched.",
      "“What difference will one small plant make?” someone asked.",
      "The Pedh Rakshak replied,",
      "“Every big tree starts small.”",
      "Days turned into weeks.",
      "Others began to help too:",
      "Someone watered Tarun in the morning",
      "Someone protected him from damage",
      "Someone planted another sapling nearby",
      "Slowly… Tarun began to grow.",
      "His leaves became greener.",
      "His stem became stronger.",
      "One day, Tarun stood taller than before, his leaves dancing in the wind.",
      "“I feel stronger,” he said happily.",
      "The Pedh Rakshak smiled,",
      "“Growth takes time, but care makes it possible.”",
      "And from that day on, people understood",
      "When we care for small plants today, we grow a greener tomorrow.",
      "Will you help Tarun grow and become a Pedh Rakshak too?"
    ],
    "completeMessage": "You helped Tarun smile again!",
    "badgeName": "Pedh Rakshak",
    "microHabits": [
      "I watered at least one plant/tree today",
      "I checked soil before watering (did not overwater)",
      "I protected a plant/tree (did not damage it or let others harm it)",
      "I did NOT pluck leaves/flowers unnecessarily today",
      "I cared for plants at home/school (cleaning, adjusting pots, etc.)",
      "I moved a plant to proper sunlight/shade if needed",
      "I noticed a dry/damaged plant and took action (watered/reported it)",
      "I used both sides of paper to reduce cutting of trees",
      "I encouraged at least one person to care for plants or trees today",
      "I spent time in a green area (park/garden) and respected it (no littering/damage)"
    ],
    "quickFacts": [
      "The air you breathe today depends on trees planted years ago.",
      "A small plant today can become a big tree—but only if someone cares for it.",
      "Trees are homes for birds and animals—not just plants.",
      "Areas with more trees are cooler than areas with only buildings.",
      "Trees help bring rain and keep the soil healthy.",
      "Every sheet of paper comes from trees—using less helps protect them.",
      "Cutting trees is easy—growing them takes time and care.",
      "More trees don’t just help nature—they make life better for people too."
    ],
    "articles": [
      {
        "title": "WHO — SDG 12: Responsible Consumption and Production",
        "url": "https://www.who.int/tools/your-life-your-health/a-healthy-world/planet/SDG-12-Responsible-Consumption-and-Production"
      },
      {
        "title": "National Geographic — Sustainable Development Goals",
        "url": "https://education.nationalgeographic.org/resource/sustainable-development-goals/"
      },
      {
        "title": "Down To Earth — Race to SDGs: why India is lagging behind",
        "url": "https://www.downtoearth.org.in/governance/race-to-sdgs-why-india-is-lagging-behind"
      },
      {
        "title": "India's SDG struggle: uneven and slow progress",
        "url": "https://www.newindianexpress.com/xplore/2025/Feb/28/indias-sdg-struggle-uneven-and-slow-progress-casts-shadow-on-2030-deadline"
      }
    ],
    "explainer": [
      {
        "k": "h1",
        "t": "Be a Pedh Rakshak"
      },
      {
        "k": "note",
        "t": "Be a Tree-Messenger: Tell an adult immediately or call the Delhi Green Helpline to report it.  Helpline Number: 1800-11-8600"
      },
      {
        "k": "h2",
        "t": "When Trees Disappear"
      },
      {
        "k": "p",
        "t": "Trees are an important part of our environment."
      },
      {
        "k": "p",
        "t": "But in many places, they are being cut down faster than they can grow."
      },
      {
        "k": "h2",
        "t": "What Is Happening?"
      },
      {
        "k": "p",
        "t": "Forests and green areas are slowly disappearing."
      },
      {
        "k": "p",
        "t": "Land is being cleared for roads, buildings, and other uses."
      },
      {
        "k": "p",
        "t": "When too many trees are cut, the balance of nature is affected."
      },
      {
        "k": "h2",
        "t": "Why Does It Matter?"
      },
      {
        "k": "p",
        "t": "Trees do more than just grow—they support life."
      },
      {
        "k": "b",
        "t": "They help clean the air"
      },
      {
        "k": "b",
        "t": "They keep the surroundings cool"
      },
      {
        "k": "b",
        "t": "They provide homes for birds and animals"
      },
      {
        "k": "p",
        "t": "Without enough trees, the environment becomes hotter, less healthy, and less balanced."
      },
      {
        "k": "h2",
        "t": "What Can You Do?"
      },
      {
        "k": "b",
        "t": "Take care of plants and trees around you."
      },
      {
        "k": "b",
        "t": "Do not damage or pluck plants unnecessarily."
      },
      {
        "k": "b",
        "t": "Use paper carefully and avoid waste."
      },
      {
        "k": "b",
        "t": "Encourage others to protect and grow trees."
      },
      {
        "k": "herb",
        "t": "How to Grow Your Magic Herbs (The 5-Step Mission)"
      },
      {
        "k": "step",
        "title": "Find a Secret Base",
        "t": "You don't need fancy pots! Use an old plastic bottle or a tin can. Ask an adult to help you poke small holes in the bottom so water can flow through easily."
      },
      {
        "k": "step",
        "title": "Fill with Earth-Magic",
        "t": "Scoop up some soft, brown soil. Mix in some old fruit peels or crushed dried leaves to give your plants \"super-fuel\" to grow."
      },
      {
        "k": "step",
        "title": "Tuck in the Seeds",
        "t": "Gently press your seeds or small saplings into the soil. Imagine you are tucking them into a cozy bed!"
      },
      {
        "k": "step",
        "title": "A Gentle Rain",
        "t": "Give them a small sip of water. Remember, plants like a \"sprinkle,\" not a \"flood\"!"
      },
      {
        "k": "step",
        "title": "Chasing the Sun",
        "t": "Place your pots where they can see the sun for a few hours every day. Watch them sprout a little bit more every single morning."
      }
    ]
  },
  "dharti": {
    "storyTitle": "Fight Kachra, Save Dharti",
    "storyLines": [
      "One morning, something unusual appeared.",
      "On the streets, in parks, near homes",
      "piles of waste were everywhere.",
      "Plastic wrappers, bottles, and paper covered the ground.",
      "Dharti felt heavy.",
      "She whispered,",
      "“Why am I carrying so much?”",
      "People walked past it.",
      "Some didn’t notice.",
      "Some didn’t know what to do.",
      "And slowly… the mess kept growing.",
      "Just then, a bold voice spoke up:",
      "“Enough.”",
      "It was the Kachra Fighter",
      "The Kachra Fighter didn’t have superpowers",
      "but they had something stronger: discipline.",
      "They picked up one piece of waste… and then another.",
      "People stopped and watched.",
      "“What are you doing?” someone asked.",
      "“Helping Dharti breathe,” the Kachra Fighter replied.",
      "Then they showed everyone something simple—but powerful:",
      "“This goes in the green bin.”",
      "“This goes in the blue bin.”",
      "“This needs special care.”",
      "At first, only a few people joined.",
      "Then more.",
      "Soon, something incredible happened.",
      "The streets became cleaner.",
      "The bins were used correctly.",
      "The piles of waste began to disappear.",
      "Dharti felt lighter.",
      "She smiled and said,",
      "“This is how I’m meant to be.”",
      "The Kachra Fighter looked around and said,",
      "“You don’t need to clean everything.",
      "Just don’t ignore anything.”",
      "And from that day on, people remembered:",
      "When everyone takes responsibility, Dharti stays clean.",
      "Will you become a Kachra Fighter and help Dharti?"
    ],
    "completeMessage": "You made Dharti happy and healthy!",
    "badgeName": "Kachra Fighter",
    "microHabits": [
      "I threw all my waste in a dustbin today (no littering)",
      "I separated wet and dry waste at home/school today",
      "I put plastic and dry waste in the correct bin (blue bin)",
      "I put food waste/peels in the correct bin (green bin)",
      "I did NOT use any single-use plastic item today (bags, straws, etc.)",
      "I carried or used a reusable bag/bottle/lunch box today",
      "I cleaned (rinsed) a plastic item before throwing it for recycling",
      "I picked up at least one piece of litter and disposed of it properly",
      "I did NOT throw waste on roads, in parks, or public places today",
      "I told or reminded someone to use the correct bin today"
    ],
    "quickFacts": [
      "Plastic you throw today can stay on Earth longer than your lifetime.",
      "If waste is not separated, most of it cannot be recycled.",
      "Animals often mistake plastic for food, and it can harm them.",
      "Throwing waste outside doesn’t make it disappear, it just moves the problem.",
      "Wet waste can turn into compost, but only if we separate it.",
      "Cleaner surroundings don’t happen automatically, someone has to make the right choice.",
      "One wrong habit (like littering) can affect many people, not just you.",
      "Waste management starts at home, not at the landfill."
    ],
    "articles": [
      {
        "title": "WHO — SDG 15: Life on Land",
        "url": "https://www.who.int/tools/your-life-your-health/a-healthy-world/planet/SDG-15-Life-on-Land"
      },
      {
        "title": "Waste and sustainability research (Springer)",
        "url": "https://link.springer.com/article/10.1007/s43621-024-00289-0"
      },
      {
        "title": "Waste and SDGs research (Taylor & Francis)",
        "url": "https://www.tandfonline.com/doi/full/10.1080/21665095.2022.2163677#abstract"
      },
      {
        "title": "UNDP India — Ten years, 10 milestones: how India turned SDGs into action",
        "url": "https://www.undp.org/india/blog/ten-years-10-milestones-how-india-turned-sdgs-action"
      }
    ],
    "explainer": [
      {
        "k": "h1",
        "t": "WASTE MANAGEMENT"
      },
      {
        "k": "p",
        "t": "There is a different bin for each type of waste!"
      },
      {
        "k": "p",
        "t": "If we use the right bin, we can help Dharti stay clean and healthy."
      },
      {
        "k": "bin",
        "color": "green",
        "title": "Wet Waste",
        "items": [
          "Food scraps",
          "Vegetable and fruit peels",
          "Flowers"
        ],
        "notes": [
          "This waste can turn into compost (manure)",
          "It helps plants grow"
        ]
      },
      {
        "k": "bin",
        "color": "blue",
        "title": "Dry Waste",
        "items": [
          "Paper and cardboard",
          "Plastic bottles and wrappers",
          "Metal and glass"
        ],
        "notes": [
          "This waste can be recycled and reused",
          "It should always be clean and dry"
        ]
      },
      {
        "k": "bin",
        "color": "red",
        "title": "Sanitary Waste",
        "items": [
          "Used tissues",
          "Sanitary waste"
        ],
        "notes": [
          "This waste must be wrapped properly",
          "It needs special handling"
        ]
      },
      {
        "k": "bin",
        "color": "black",
        "title": "Hazardous Waste",
        "items": [
          "Batteries",
          "Expired medicines",
          "Bulbs and tube lights"
        ],
        "notes": [
          "This waste is dangerous",
          "It should never be mixed with other waste"
        ]
      }
    ]
  },
  "jal": {
    "storyTitle": "The Day Jal Went Missing",
    "storyLines": [
      "One afternoon, something strange happened.",
      "At school, the taps ran dry.",
      "At home, the water stopped flowing.",
      "In the park, the fountain was silent.",
      "Everyone asked,",
      "“Where did the water go?”",
      "Jal was hiding.",
      "He was tired of being wasted…",
      "left running, spilled, and dirtied without care.",
      "“I don’t feel valued anymore,” Jal whispered.",
      "The world began to feel different.",
      "Plants started to droop.",
      "People waited with empty bottles.",
      "Everything felt a little harder.",
      "Just then, someone stepped forward.",
      "It was the Paani Protector",
      "The Paani Protector understood what was wrong.",
      "They said,",
      "“Jal hasn’t disappeared… he’s waiting for us to change.”",
      "The Paani Protector gathered everyone and showed them simple steps:",
      "Turn off taps tightly",
      "Use only what you need",
      "Fix leaks quickly",
      "Keep water clean",
      "People listened.",
      "They started being careful.",
      "They stopped wasting even a single drop.",
      "Slowly… something changed.",
      "A drop appeared.",
      "Then another.",
      "Soon, water began to flow again.",
      "Jal returned clear, fresh, and happy.",
      "“I came back because you cared,” he said.",
      "The Paani Protector smiled,",
      "“Water stays where it is respected.”",
      "And from that day on, everyone remembered:",
      "If we take care of Jal, Jal will take care of us.",
      "Will you help bring every drop back?"
    ],
    "completeMessage": "You helped Jal!",
    "badgeName": "Paani Protector",
    "microHabits": [
      "I turned off the tap while brushing my teeth today",
      "I only took as much water as I could finish (no wastage)",
      "I kept my bath/shower under 10 minutes today",
      "I used a bucket instead of a long shower (if possible)",
      "I turned off the tap while soaping hands or washing dishes",
      "I did NOT throw any waste into drains, sinks, or toilets today",
      "I reused leftover water (for plants/cleaning) today",
      "I carried my own water bottle and avoided wasting water outside",
      "I reminded at least one person to save water today",
      "I reported or informed someone about water wastage (overflowing tank/tap left open)"
    ],
    "quickFacts": [
      "Less than 1% of all water on Earth is available for us to use.",
      "A dripping tap can waste more water than you expect, every drop adds up.",
      "The water you waste today is the water someone else might need tomorrow.",
      "Dirty water doesn’t just look bad, it spreads diseases you can’t see.",
      "Your body is mostly water, clean water keeps your body working properly.",
      "It takes water to grow your food, wasting water also affects what we eat.",
      "Water wasted in one place can affect supply in another.",
      "Water never really disappears, it just becomes harder to use if we pollute it."
    ],
    "articles": [
      {
        "title": "UN Goal 6 — Clean Water and Sanitation",
        "url": "https://sdgs.un.org/goals/goal6"
      },
      {
        "title": "UNEP — SDG report, Chapter 3",
        "url": "https://sdgs.unep.org/article/chapter-3"
      },
      {
        "title": "How microplastics disrupt aquatic ecosystems",
        "url": "https://sdgresources.relx.com/articles/microplastics-disrupt-microbial-functions-aquatic-ecosystems"
      },
      {
        "title": "NITI Aayog — Sustainable Development Goals",
        "url": "https://www.niti.gov.in/divisions/division/sustainable-development-goal"
      }
    ],
    "explainer": [
      {
        "k": "h1",
        "t": "Flooding And Pollution"
      },
      {
        "k": "h2",
        "t": "When Water Overflows"
      },
      {
        "k": "p",
        "t": "Flooding happens when there is too much water in one place and it has nowhere to go."
      },
      {
        "k": "p",
        "t": "It can happen suddenly and affect homes, roads, and entire communities."
      },
      {
        "k": "h2",
        "t": "What Is Flooding?"
      },
      {
        "k": "p",
        "t": "Flooding occurs when rainwater collects on the ground instead of flowing away."
      },
      {
        "k": "p",
        "t": "Streets fill with water, drains overflow, and daily life gets disrupted."
      },
      {
        "k": "p",
        "t": "Floods are not always caused by heavy rain alone."
      },
      {
        "k": "p",
        "t": "They often happen because water cannot move properly."
      },
      {
        "k": "h2",
        "t": "What Causes Flooding?"
      },
      {
        "k": "p",
        "t": "There are several reasons why flooding happens:"
      },
      {
        "k": "b",
        "t": "Blocked drains: Plastic and waste clog drains, stopping water from flowing"
      },
      {
        "k": "b",
        "t": "Too much concrete: Roads and buildings prevent water from soaking into the ground"
      },
      {
        "k": "b",
        "t": "Fewer trees: Without trees, less water is absorbed into the soil"
      },
      {
        "k": "b",
        "t": "Poor waste management: Litter and garbage block natural water paths"
      },
      {
        "k": "p",
        "t": "When water cannot flow or soak into the ground, it starts to collect, leading to floods."
      },
      {
        "k": "h2",
        "t": "Flooding and Pollution"
      },
      {
        "k": "p",
        "t": "Floodwater is not clean."
      },
      {
        "k": "p",
        "t": "When it moves through streets, it picks up:"
      },
      {
        "k": "b",
        "t": "Garbage and plastic"
      },
      {
        "k": "b",
        "t": "Chemicals and dirt"
      },
      {
        "k": "b",
        "t": "Waste from drains"
      },
      {
        "k": "p",
        "t": "This makes floodwater polluted and unsafe."
      },
      {
        "k": "p",
        "t": "It can spread diseases and harm people, animals, and the environment."
      },
      {
        "k": "h2",
        "t": "What Can You Do?"
      },
      {
        "k": "b",
        "t": "Do not throw waste on roads or into drains."
      },
      {
        "k": "b",
        "t": "Make sure garbage is disposed of properly."
      },
      {
        "k": "b",
        "t": "Keep your surroundings clean so water can flow freely."
      },
      {
        "k": "b",
        "t": "Small actions can help prevent big problems like flooding."
      }
    ]
  }
};
