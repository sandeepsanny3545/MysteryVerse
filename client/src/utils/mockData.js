// Mock Mystery Cases and Presets for MysteryVerse

export const PRESET_PREMISES = [
  {
    id: 'preset-1',
    title: 'The Midnight Masquerade',
    tag: 'Victorian Noir',
    difficulty: 'Medium',
    premise: 'During an exclusive masquerade ball at Blackwood Manor, eccentric billionaire Lord Sterling was discovered poisoned in his private study. The heavy mahogany door was bolted from the inside, and three guests had visited him just minutes before the midnight toast.',
    estimatedTime: '15 Mins',
    victim: 'Lord Alistair Sterling (Age 62, Mining Magnate)'
  },
  {
    id: 'preset-2',
    title: 'The Neon Cipher Poisoning',
    tag: 'Cyberpunk Tech Noir',
    difficulty: 'Hard',
    premise: 'Inside the ultra-secure biometric vault of Aegis Quantum, lead architect Dr. Aris Thorne was found dead with synthetic neuro-toxin traces in his bloodstream. The vault logs show no unauthorized entries, yet his top-secret project drive has been wiped clean.',
    estimatedTime: '20 Mins',
    victim: 'Dr. Aris Thorne (Age 45, Chief Cryptographer)'
  },
  {
    id: 'preset-3',
    title: 'The Crimson Velvet Express',
    tag: 'Classic Rail Mystery',
    difficulty: 'Easy',
    premise: 'A luxury vintage train is stranded in an Alpine blizzard. In compartment 4B, renowned art appraiser Evelyn Vance is found fatally stabbed with an ornate silver letter opener. Her personal journal detailing a stolen Renaissance masterpiece is missing.',
    estimatedTime: '10 Mins',
    victim: 'Evelyn Vance (Age 38, Fine Art Appraiser)'
  }
];

export const MOCK_CASES = {
  'the-midnight-masquerade': {
    id: 'the-midnight-masquerade',
    title: 'The Midnight Masquerade',
    difficulty: 'Medium',
    themeTag: 'Victorian Noir',
    location: 'Blackwood Manor – High Gallery & Private Study',
    dispatchTime: '23:55 HRS – OCT 31',
    briefing: {
      synopsis: 'At the stroke of midnight during Lord Sterling\'s annual masquerade, chimes echoed through the ballroom, but the host never emerged for the toast. The head butler forced open the study door after hearing faint glass shatter. Lord Sterling was slumped over his antique mahogany desk, a half-empty glass of vintage port beside him emitting the faint aroma of bitter almonds. Three individuals were observed entering and exiting the study corridor between 11:20 PM and 11:50 PM.',
      autopsy: 'Coroner Report: Death occurred between 11:35 PM and 11:45 PM. Cause of death is acute potassium cyanide poisoning. Traces of crystalline residue detected on the rim of the crystal glass and on the deceased\'s quill pen.',
      victim: {
        name: 'Lord Alistair Sterling',
        age: 62,
        role: 'Eccentric Mining Tycoon & Philanthropist',
        knownFeuds: 'Recently altered his family will, disinheriting his debt-ridden nephew and threatening to audit his private physician\'s charity ledger.'
      }
    },
    suspects: [
      {
        id: 'suspect-1',
        name: 'Victoria Vance',
        role: 'Heiress & Business Partner',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
        relationship: 'Co-investor in Sterling Southern African Mines',
        alibi: 'Claims she was conversing with the French Ambassador on the ballroom terrace from 11:15 PM until the midnight toast.',
        initialStress: 30,
        behavioralTell: 'Constantly adjusts her emerald silk gloves; avoids looking toward the study gallery.',
        secret: 'She discovered Lord Sterling was secretly liquidating the mining conglomerate, leaving her bankrupt.',
        statement: 'Alistair and I had our commercial disagreements, detective, but poisoning his vintage port? Barbaric. I was on the terrace the entire evening—the ambassador can vouch for my presence, though he did step away for cigars.',
        dialogueResponses: [
          {
            query: 'Did you enter the study corridor around 11:30 PM?',
            answer: 'I may have passed through the east portico to fetch fresh champagne, but I never crossed the threshold into Alistair\'s study. Whoever claimed to see me must have confused my peacock mask.'
          },
          {
            query: 'What do you know about the revised will?',
            answer: 'Alistair bluffed about disinheriting everyone whenever he drank too much. It meant nothing. I had no motive to hasten his demise.'
          }
        ],
        isGuilty: false
      },
      {
        id: 'suspect-2',
        name: 'Dr. Julian Croft',
        role: 'Personal Physician & Confidant',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
        relationship: 'Sterling Family Doctor for 14 years',
        alibi: 'Claims he was in the conservatory treating a guest who fainted from the ballroom heat between 11:25 PM and 11:45 PM.',
        initialStress: 75,
        behavioralTell: 'Hands tremble noticeably when reaching for his spectacle case; wipes cold perspiration from his collar.',
        secret: 'He has been embezzling Sterling\'s medical foundation funds and faced immediate criminal exposure on Monday morning.',
        statement: 'Alistair had a frail heart, detective! I warned him constantly against heavy ports and ballroom excitement. When I heard the commotion, I rushed from the conservatory to administer cardiac resuscitation, but it was already far too late.',
        dialogueResponses: [
          {
            query: 'Why do pharmacy records show you requisitioned potassium cyanide on Thursday?',
            answer: '*(Pauses, voice cracking)* Cyanide? That was... for entomological preservation of botanical specimens in the manor greenhouse! It is standard laboratory compound protocol!'
          },
          {
            query: 'A fountain pen soaked in cyanide was found behind the drapery. Do you recognize the initials J.C. engraved on the gold clip?',
            answer: '*(Eyes dart wildly, hands trembling)* I... I misplaced that pen days ago! Someone is framing me! You have no proof I entered his study at 11:35!'
          }
        ],
        isGuilty: true
      },
      {
        id: 'suspect-3',
        name: 'Arthur Pendelton',
        role: 'The Disowned Nephew',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
        relationship: 'Sole surviving blood nephew',
        alibi: 'Claims he was in the billiards salon nursing scotch after a heated argument with his uncle at 10:45 PM.',
        initialStress: 55,
        behavioralTell: 'Defensive, sarcastic posture; nervously taps a heavy brass lighter against his knuckles.',
        secret: 'He owed £45,000 to Monte Carlo loan sharks arriving to collect at the end of the week.',
        statement: 'Look, Uncle Alistair was a tyrannical miser. We had a shouting match at 10:45 because he refused my bridge loan. I slammed his door, went to the billiards room, and drank myself numb. If I wanted him dead, I\'d have done it with my bare fists, not coward\'s powder.',
        dialogueResponses: [
          {
            query: 'Witnesses saw you arguing in the hall outside the study at 11:20 PM.',
            answer: 'I came back once to apologize and ask for a second chance! He laughed in my face through the cracked door and locked it. I never went in!'
          },
          {
            query: 'Did you know you were completely removed from the will?',
            answer: 'I suspected as much. That\'s why I was furious. But dead, he leaves me nothing at all. Killing him seals my bankruptcy.'
          }
        ],
        isGuilty: false
      }
    ],
    clues: [
      {
        id: 'clue-1',
        title: 'Tainted Crystal Goblet',
        category: 'Toxicology',
        location: 'Study Desk, right of the victim',
        description: 'A heavy Baccarat crystal goblet with remnants of vintage port wine and an oily film floating on the surface.',
        forensicReport: 'Chemical analysis confirms high concentration of Potassium Cyanide dissolved in the vintage port. Fingerprints on the base belong strictly to the deceased.',
        isSmokingGun: false,
        iconName: 'Wine'
      },
      {
        id: 'clue-2',
        title: 'Engraved Fountain Pen (J.C.)',
        category: 'Physical Weapon',
        location: 'Behind heavy velvet drapery near the study balcony',
        description: 'A gold-nibbed fountain pen with initials "J.C." stamped on the barrel. The internal ink reservoir holds traces of transparent liquid instead of black ink.',
        forensicReport: 'The syringe-dropper of this pen was used to transfer concentrated liquid cyanide directly into the victim\'s open decanter. Thumbprint on the gold clip matches Dr. Julian Croft.',
        isSmokingGun: true,
        iconName: 'PenTool'
      },
      {
        id: 'clue-3',
        title: 'Torn Botanical Requisition Slip',
        category: 'Document',
        location: 'Fireplace grate in the medical dispensary',
        description: 'A charred slip from St. Jude Pharmaceutical Supply dated 3 days ago for 500mg Potassium Cyanide.',
        forensicReport: 'Requisition authorization was signed by Chief Medical Officer Julian Croft, MD. Reason listed: "Specimen fixing" without mandatory hospital board countersignature.',
        isSmokingGun: false,
        iconName: 'FileText'
      },
      {
        id: 'clue-4',
        title: 'Conservatory Guest Register',
        category: 'Forensic Trace',
        location: 'Manor Conservatory Entry',
        description: 'The guest registry in the conservatory where Dr. Croft claimed to be treating a fainting guest between 11:25 and 11:45 PM.',
        forensicReport: 'The guest who supposedly fainted, Lady Danbury, signed into the conservatory at 11:10 PM and was escorted back to the ballroom by 11:22 PM. Croft was absent from the conservatory between 11:25 PM and 11:48 PM.',
        isSmokingGun: true,
        iconName: 'Clock'
      },
      {
        id: 'clue-5',
        title: 'Lord Sterling\'s Blackmail Ledger',
        category: 'Document',
        location: 'Hidden compartment beneath the desk blotter',
        description: 'A leather-bound diary opened to an entry dated this morning, listing extensive financial discrepancies.',
        forensicReport: 'Entry notes: "Croft has diverted £80,000 from the Miners\' Tuberculosis Ward into his private offshore bond accounts. I shall demand his resignation tonight and notify Scotland Yard on Monday."',
        isSmokingGun: false,
        iconName: 'BookOpen'
      }
    ],
    hints: [
      {
        id: 1,
        title: 'Examine Medical Access',
        content: 'Potassium cyanide is a restricted apothecary poison. Which suspect had direct legitimate access to medical grade toxins?',
        penalty: 50
      },
      {
        id: 2,
        title: 'Scrutinize the Conservatory Alibi',
        content: 'Check the Conservatory Guest Register timestamps carefully against the coroner\'s estimated time of death (11:35 PM - 11:45 PM).',
        penalty: 75
      },
      {
        id: 3,
        title: 'Inspect the Delivery Mechanism',
        content: 'The poison was not in the bottle—it was introduced via a fine syringe or dropper into the victim\'s glass. Look closely at the Engraved Fountain Pen.',
        penalty: 100
      }
    ],
    solution: {
      culpritId: 'suspect-2',
      culpritName: 'Dr. Julian Croft',
      motive: 'Desperate concealment of an £80,000 embezzlement scam that Lord Sterling was threatening to report to Scotland Yard.',
      weapon: 'Potassium cyanide administered via an ink-dropper fountain pen into Lord Sterling\'s private port glass.',
      explanation: 'Dr. Julian Croft learned during the week that Lord Sterling had discovered his £80,000 embezzlement of hospital charity funds and was delivering an ultimatum tonight before notifying the authorities. Croft utilized his clinical credentials to acquire potassium cyanide, hollowed out his personalized gold fountain pen as a clandestine dropper, slipped into the study at 11:34 PM while Sterling stepped into the washroom, laced the port goblet, and slipped back out. His conservatory alibi dissolved when records proved Lady Danbury had already returned to the ballroom at 11:22 PM.',
      baseScore: 1000
    }
  },

  'the-neon-cipher-poisoning': {
    id: 'the-neon-cipher-poisoning',
    title: 'The Neon Cipher Poisoning',
    difficulty: 'Hard',
    themeTag: 'Cyberpunk Tech Noir',
    location: 'Aegis Quantum Tower – Level 88 Server Vault',
    dispatchTime: '02:14 HRS – NOV 12',
    briefing: {
      synopsis: 'Inside the airtight biometric cleanroom of Aegis Quantum, senior cryptographic architect Dr. Aris Thorne was discovered slumped over terminal 04. No signs of physical struggle were present, but thermal cameras recorded an irregular vapor discharge from his neural interface cradle at 01:40 AM.',
      autopsy: 'Coroner Report: Fatal respiratory paralysis caused by aerosolized synthetic peptide toxin (Neuro-V). Estimated time of exposure: 01:38 AM.',
      victim: {
        name: 'Dr. Aris Thorne',
        age: 45,
        role: 'Chief Quantum Cryptographer',
        knownFeuds: 'Threatened to leak corporate backdoor exploits to open-source watchdogs.'
      }
    },
    suspects: [
      {
        id: 'suspect-cyber-1',
        name: 'Kira Vance (V-09)',
        role: 'Hardware Security Specialist',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
        relationship: 'Direct subordinate and collaborator',
        alibi: 'Monitored the external firewall grid from terminal 01 on Level 87.',
        initialStress: 40,
        behavioralTell: 'Taps her cybernetic ocular implant when pressed on security logs.',
        secret: 'She had scheduled a high-value encrypted data transfer to rival conglomerate OmniCorp.',
        statement: 'Aris was paranoid, but he was a genius. I wouldn\'t kill him—I needed his decryption keys alive.',
        dialogueResponses: [
          { query: 'Why did the firewall logs go dark at 01:35 AM?', answer: 'It was a scheduled firmware patch! Standard protocol.' }
        ],
        isGuilty: false
      },
      {
        id: 'suspect-cyber-2',
        name: 'Director Marcus Vance',
        role: 'Executive Vice President of Operations',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
        relationship: 'Overseeing Corporate Executive',
        alibi: 'Claims he was in a videoconference with European investors until 02:00 AM.',
        initialStress: 80,
        behavioralTell: 'Clutches his encrypted titanium comms tablet; voice remains icy and calculated.',
        secret: 'He personally authorized the fabrication of the military-grade Neuro-V canister to silence Dr. Thorne before the leak.',
        statement: 'Dr. Thorne was an invaluable asset to our quantum supremacy initiative. His death is an immeasurable corporate loss. Accusing management of this tragedy is ludicrous.',
        dialogueResponses: [
          { query: 'Who authorized the atmospheric coolant purge at 01:38 AM?', answer: '*(Eyes narrow)* Emergency thermal cycles are automated when server core temps spike.' }
        ],
        isGuilty: true
      },
      {
        id: 'suspect-cyber-3',
        name: 'Nix (Elena Rostova)',
        role: 'Rogue Data Infiltrator',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
        relationship: 'Informant who contracted Thorne for the backdoor leak',
        alibi: 'Hidden in the ventilation duct maintenance sub-level.',
        initialStress: 60,
        behavioralTell: 'Nervously checks her portable EMP jammer; speaks in quick, clipped jargon.',
        secret: 'She saw Director Vance enter the atmospheric maintenance room at 01:32 AM.',
        statement: 'I didn\'t flatline Thorne! He was my ticket to exposing Aegis to the world! I was waiting for his handoff when the alarms shrieked.',
        dialogueResponses: [
          { query: 'What did you witness from the vent sub-level?', answer: 'I saw Vance override the coolant canister bay with his executive gold badge at 01:32 AM.' }
        ],
        isGuilty: false
      }
    ],
    clues: [
      {
        id: 'clue-c1',
        title: 'Empty Neuro-V Aerosol Canister',
        category: 'Toxicology',
        location: 'HVAC Vent Bay behind Server Rack 09',
        description: 'Military-grade pressurized aerosol canister with Aegis Executive Seal.',
        forensicReport: 'Traces of synthetic Neuro-V peptide matches the victim\'s lung tissue sample.',
        isSmokingGun: true,
        iconName: 'Skull'
      },
      {
        id: 'clue-c2',
        title: 'Executive Biometric Override Log',
        category: 'Digital Log',
        location: 'Central Vault Security Subsystem',
        description: 'Encrypted audit trail of terminal activations.',
        forensicReport: 'Override badge #001 (Director Marcus Vance) bypassed HVAC safety filters at 01:32 AM.',
        isSmokingGun: true,
        iconName: 'Key'
      },
      {
        id: 'clue-c3',
        title: 'Dr. Thorne\'s Dead-Man Switch Memo',
        category: 'Document',
        location: 'Terminal 04 Local Cache',
        description: 'Drafted whistleblowing memo addressed to the Federal Cyber Bureau.',
        forensicReport: 'Names Director Vance as the orchestrator of illegal surveillance backdoors.',
        isSmokingGun: false,
        iconName: 'FileText'
      }
    ],
    hints: [
      { id: 1, title: 'Check the HVAC Access', content: 'The poison was delivered as gas through the server rack ventilation. Who had executive clearance to override the vents?', penalty: 50 },
      { id: 2, title: 'Review the Biometric Logs', content: 'Look at the timestamp of the ventilation override at 01:32 AM against the videoconference alibi.', penalty: 75 }
    ],
    solution: {
      culpritId: 'suspect-cyber-2',
      culpritName: 'Director Marcus Vance',
      motive: 'Silencing Dr. Thorne before he could transmit the whistleblower dead-man switch exposing corporate espionage.',
      weapon: 'Aerosolized Neuro-V synthetic peptide injected directly into Vault Server Rack HVAC.',
      explanation: 'Director Marcus Vance discovered Thorne had compiled evidence of Aegis Quantum\'s illegal surveillance backdoors and was minutes away from broadcasting it. Utilizing his Level 5 Executive override badge, Vance accessed the climate control ducts at 01:32 AM, slipped the Neuro-V canister into the localized intake for Terminal 04, and triggered the coolant cycle to aerosolize the poison directly into Thorne\'s breathing space.',
      baseScore: 1200
    }
  },

  'the-crimson-velvet-express': {
    id: 'the-crimson-velvet-express',
    title: 'The Crimson Velvet Express',
    difficulty: 'Easy',
    themeTag: 'Classic Rail Mystery',
    location: 'The Continental Express – Compartment 4B',
    dispatchTime: '21:10 HRS – DEC 24',
    briefing: {
      synopsis: 'As the luxury train sits trapped in snow drifts along the Swiss border, fine art appraiser Evelyn Vance is found dead in her private sleeper compartment, clutching a ripped scrap of canvas.',
      autopsy: 'Coroner Report: Single fatal puncture wound to the chest caused by a slender silver blade. Time of death: approximately 20:30 PM.',
      victim: {
        name: 'Evelyn Vance',
        age: 38,
        role: 'Prominent Art Historian & Authenticator',
        knownFeuds: 'Recently deemed a $10M portrait held by Count Moretti to be a forgery.'
      }
    },
    suspects: [
      {
        id: 'suspect-train-1',
        name: 'Count Luciano Moretti',
        role: 'Disgraced Art Collector',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80',
        relationship: 'Former client whose masterpiece she declared fake',
        alibi: 'Claims he was in the dining car playing bridge with the conductor until 21:00 PM.',
        initialStress: 85,
        behavioralTell: 'Nervously cleans his monocle; a crimson stain marks his white cuff.',
        secret: 'He faced total ruin and debtor\'s prison if the fake painting wasn\'t certified authentic.',
        statement: 'Signora Vance ruined my family\'s prestige with her reckless slander! But to murder her on a passenger train? Preposterous!',
        dialogueResponses: [
          { query: 'What is that reddish smudge on your shirt cuff, Count?', answer: '*(Pales)* It is Chianti wine from dinner! The waiter spilled it during the sudden stop!' }
        ],
        isGuilty: true
      },
      {
        id: 'suspect-train-2',
        name: 'Helena Drake',
        role: 'Evelyn\'s Rival Authenticator',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
        relationship: 'Academic rival',
        alibi: 'Reading in her compartment with earplugs due to the snowstorm.',
        initialStress: 35,
        behavioralTell: 'Calm, sharp gaze; exhibits open contempt for Evelyn\'s theories.',
        secret: 'She had hoped Evelyn would resign so she could take the museum directorship.',
        statement: 'Evelyn was pedantic and arrogant, but her eye for canvas was unmatched. Her murder is an intellectual tragedy.',
        dialogueResponses: [
          { query: 'Did you leave your compartment around 20:30 PM?', answer: 'Not once. The carriage attendant brought me chamomile tea at 20:15.' }
        ],
        isGuilty: false
      }
    ],
    clues: [
      {
        id: 'clue-t1',
        title: 'Engraved Silver Letter Opener',
        category: 'Physical Weapon',
        location: 'Stuffed behind heating radiator in Dining Car corridor',
        description: 'Ornate antique letter opener with Moretti family crest embossed on the hilt.',
        forensicReport: 'Blood type matches the victim. Clear partial thumbprint matches Count Moretti.',
        isSmokingGun: true,
        iconName: 'Shield'
      },
      {
        id: 'clue-t2',
        title: 'Torn Canvas Scrap',
        category: 'Document',
        location: 'Clutched in victim\'s left hand',
        description: 'A 2-inch scrap of aged linen canvas showing blue pigment.',
        forensicReport: 'Chemical analysis reveals modern synthetic phthalocyanine pigment—proving the painting was a modern fake.',
        isSmokingGun: false,
        iconName: 'Image'
      }
    ],
    hints: [
      { id: 1, title: 'Check the Weapon Crest', content: 'Look for the weapon hidden near the radiator and inspect the heraldic crest on the handle.', penalty: 50 }
    ],
    solution: {
      culpritId: 'suspect-train-1',
      culpritName: 'Count Luciano Moretti',
      motive: 'Preventing the public announcement that his $10M family portrait was an worthless forgery.',
      weapon: 'Antique silver family letter opener hidden behind the dining car radiator.',
      explanation: 'Count Moretti cornered Evelyn Vance in Compartment 4B at 20:30 PM demanding she sign the certificate of authenticity. When she adamantly refused and brandished a scrap proving the paint was modern synthetic, Moretti plunged his silver letter opener into her chest in a fit of rage, stuffed the weapon behind the corridor heater, and attempted to fabricate a dining car alibi.',
      baseScore: 800
    }
  }
};

// Helper function to generate a dynamic mystery based on a custom premise and difficulty
export function generateDynamicMystery(premiseText, difficulty = 'Medium') {
  const diffMultiplier = difficulty === 'Easy' ? 0.8 : difficulty === 'Hard' ? 1.4 : 1.0;
  const baseScore = Math.round(1000 * diffMultiplier);

  return {
    id: `custom-case-${Date.now()}`,
    title: `The Case of the ${difficulty} Conundrum`,
    difficulty,
    themeTag: 'Generated Investigation',
    location: 'Restricted Crime Scene Area',
    dispatchTime: '00:30 HRS – ACTIVE INCIDENT',
    briefing: {
      synopsis: premiseText || 'An unexpected high-stakes crime has taken place under suspicious circumstances. Foul play is evident, and forensic teams have sealed all exits while the lead detective conducts emergency interrogations.',
      autopsy: 'Coroner Report: Demise precipitated by targeted violence under locked room or deceptive circumstances. Specific forensic indicators show premeditated intent.',
      victim: {
        name: 'The Fallen Subject',
        age: 48,
        role: 'Key Figure at the Center of the Premise',
        knownFeuds: 'Harbored deeply divisive rivalries with close associates.'
      }
    },
    suspects: [
      {
        id: 'dyn-suspect-1',
        name: 'Damian Vance',
        role: 'The Ambitious Deputy',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
        relationship: 'Stood to inherit leadership immediately upon the victim\'s removal',
        alibi: 'Claims to have been reviewing financial contracts alone in the secondary lounge.',
        initialStress: 78,
        behavioralTell: 'Bites his lower lip when pressed about the sequence of events; glances at security cameras.',
        secret: 'He forged the victim\'s signature on a secret transfer deed hours before the incident.',
        statement: 'I admired the deceased, detective. Sure, we clashed over direction, but I have no reason to jeopardize my career with bloodshed!',
        dialogueResponses: [
          { query: 'Why are your footprints recorded outside the scene at 11:40 PM?', answer: '*(Pauses nervously)* I was... looking for my misplaced phone! I never entered the chamber!' }
        ],
        isGuilty: true
      },
      {
        id: 'dyn-suspect-2',
        name: 'Corinne Chen',
        role: 'The Chief Archivist',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
        relationship: 'Long-time confidant who recently quarreled over missing records',
        alibi: 'Checking system logs and cataloging entries in the central hub.',
        initialStress: 35,
        behavioralTell: 'Speaks with clinical calm; neatly organizes papers in front of her.',
        secret: 'She discovered Damian Vance\'s fraudulent documents and was preparing an audit.',
        statement: 'Whoever committed this crime lacked subtlety. The evidence was left carelessly, as if the perpetrator panicked under time pressure.',
        dialogueResponses: [
          { query: 'Did you notice anyone acting strangely tonight?', answer: 'Damian Vance was sweating profusely and hurried past the archives with concealed documents at 11:45 PM.' }
        ],
        isGuilty: false
      },
      {
        id: 'dyn-suspect-3',
        name: 'Lucas Richter',
        role: 'The Security Overseer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
        relationship: 'In charge of monitoring all entrance and exit logs',
        alibi: 'Patrolling the outer perimeter gate.',
        initialStress: 50,
        behavioralTell: 'Arms tightly crossed, defensive posture.',
        secret: 'He disabled a perimeter sensor to take an unauthorized personal break.',
        statement: 'My sensors don\'t lie, detective. But someone with insider override codes bypassed the main door.',
        dialogueResponses: [
          { query: 'Who had authorization to override the security door?', answer: 'Only the victim and Damian Vance held master override keys.' }
        ],
        isGuilty: false
      }
    ],
    clues: [
      {
        id: 'dyn-clue-1',
        title: 'Tampered Master Override Keycard',
        category: 'Digital Log',
        location: 'Trash receptacle near Damian Vance\'s office',
        description: 'A magnetic card with scratched serial numbers, recently used at the crime scene door.',
        forensicReport: 'Digital log reveals badge was registered to Damian Vance, logged at the crime scene at 11:42 PM.',
        isSmokingGun: true,
        iconName: 'Key'
      },
      {
        id: 'dyn-clue-2',
        title: 'Forged Asset Transfer Deed',
        category: 'Document',
        location: 'Damian Vance\'s leather briefcase',
        description: 'Legal agreement bequeathing company assets to Damian Vance upon the victim\'s death.',
        forensicReport: 'Ink analysis confirms signature was drafted with a modern ballpoint pen within the last 4 hours—a blatant forgery.',
        isSmokingGun: false,
        iconName: 'FileText'
      },
      {
        id: 'dyn-clue-3',
        title: 'Shattered Chemical Vial',
        category: 'Toxicology',
        location: 'Behind the radiator in the crime scene room',
        description: 'Glass shards containing traces of fast-acting sedative compound.',
        forensicReport: 'Fingerprints on the glass neck match Damian Vance.',
        isSmokingGun: true,
        iconName: 'FlaskConical'
      }
    ],
    hints: [
      { id: 1, title: 'Check Keycard Access', content: 'Examine who held master override credentials to enter without triggering the outer alarm.', penalty: 50 },
      { id: 2, title: 'Scrutinize the Motive', content: 'Follow the money: look for newly drafted asset agreements or forged signatures.', penalty: 75 }
    ],
    solution: {
      culpritId: 'dyn-suspect-1',
      culpritName: 'Damian Vance',
      motive: 'Greed and fear of exposure: attempting to seize company assets through forged deeds before his embezzlement was discovered.',
      weapon: 'Fast-acting sedative compound administered in secret, followed by stage-managed asphyxiation.',
      explanation: 'Damian Vance forged the asset transfer documents to seize control of the enterprise. Realizing the victim was preparing an audit that would expose his fraud, Damian used his master override keycard to enter the chamber at 11:42 PM, administered the fast-acting sedative, and attempted to hide the vial behind the radiator.',
      baseScore
    }
  };
}
