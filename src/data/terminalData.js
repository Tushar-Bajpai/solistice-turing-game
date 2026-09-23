export const TUTORIAL_SEQUENCES = {
  LOGIC: [
    { sender: 'SYSTEM', text: 'INITIALIZING LOGIC CORE TUTORIAL...' },
    { sender: 'A.L.A.N.', text: 'Welcome to the Logic Core. Your task is to reconstruct the data path by supplying the correct Logic Gate.' },
    { sender: 'A.L.A.N.', text: 'Analyze the INPUT A and INPUT B signals. Choose the gate that produces the TARGET OUTPUT.' },
    { sender: 'SYSTEM', text: 'TUTORIAL COMPLETE. You may type > HELP anytime.' }
  ],
  MEMORY: [
    { sender: 'SYSTEM', text: 'INITIALIZING MEMORY CORE TUTORIAL...' },
    { sender: 'A.L.A.N.', text: 'Welcome to the Memory Core. This module tests your volatile data retention.' },
    { sender: 'A.L.A.N.', text: 'A sequence of bits will flash. You must replicate the sequence from memory.' },
    { sender: 'SYSTEM', text: 'TUTORIAL COMPLETE. You may type > HELP anytime.' }
  ],
  CIPHER: [
    { sender: 'SYSTEM', text: 'INITIALIZING CIPHER CORE TUTORIAL...' },
    { sender: 'A.L.A.N.', text: 'Welcome to the Cipher Core. Encrypted archives must be cracked.' },
    { sender: 'A.L.A.N.', text: 'Analyze the encrypted signal and the type of encryption to input the decrypted string.' },
    { sender: 'SYSTEM', text: 'TUTORIAL COMPLETE. You may type > HELP anytime.' }
  ],
  AI: [
    { sender: 'SYSTEM', text: 'INITIALIZING A.L.A.N. CORE TUTORIAL...' },
    { sender: 'A.L.A.N.', text: 'Welcome to the A.L.A.N. Core. This is the final neural alignment module.' },
    { sender: 'SYSTEM', text: 'TUTORIAL COMPLETE. You may type > HELP anytime.' }
  ]
};

export const HINTS_DB = {
  LOGIC: {
    1: ['Think about basic conditions.', 'Output is only 0 if any input is 0.', 'You need an AND gate.'],
    2: ['Think about inclusive logic.', 'Output is 1 if any input is 1.', 'You need an OR gate.'],
    3: ['Both inputs are true.', 'Both AND and OR would output 1 here.', 'Try an OR gate.'],
    4: ['The inputs are different.', 'Only one input is true.', 'You need an Exclusive OR (XOR).'],
    5: ['The inputs are identical.', 'If they are the same, output is 0.', 'You need an Exclusive OR (XOR).'],
    6: ['One input is true.', 'Inclusive logic.', 'You need an OR gate.'],
    7: ['Normally 1 AND 1 = 1.', 'The target is inverted.', 'You need a NAND gate.'],
    8: ['Normally 0 OR 0 = 0.', 'The target is inverted.', 'You need a NOR gate.'],
    9: ['Inputs are identical.', 'Normally XOR gives 0 here.', 'You need an Exclusive NOR (XNOR).'],
    10: ['Boss Phase.', 'Solve it step by step.', 'Synthesize previous logic.']
  },
  MEMORY: {
    DEFAULT: [
      'Chunk the sequence into blocks of 3.',
      'Visualize the pattern of 1s and 0s.',
      'Focus on the changes between bits.'
    ]
  },
  CIPHER: {
    '1_CAESAR': [
      'This is a substitution cipher.',
      'Shift each letter forward in the alphabet.',
      'A becomes D if shifted by 3.'
    ],
    '2_BINARY': [
      'These are 8-bit sequences.',
      'Convert each block of 8 bits into ASCII characters.',
      '01000001 is the letter A.'
    ],
    '3_TURING': [
      'This requires specific mapping.',
      'Hexadecimal maps base-16. Atbash mirrors A-Z. A1Z26 maps 1-26 to A-Z.',
      'Look at the ENCRYPTION_TYPE for the exact mapping rule.'
    ],
    '4_ENIGMA': [
      'This is the final test.',
      'It uses a simple shift, just like the beginning.',
      'Shift the letters by +1.'
    ]
  }
};

export const TRAINING_MODULES = {
  1: `=== LOGIC BASICS ===
Logic gates process binary signals (0 or 1).

[ AND GATE ]
A | B | OUT
0 | 0 | 0
0 | 1 | 0
1 | 0 | 0
1 | 1 | 1

[ OR GATE ]
A | B | OUT
0 | 0 | 0
0 | 1 | 1
1 | 0 | 1
1 | 1 | 1

[ XOR GATE ]
A | B | OUT
0 | 0 | 0
0 | 1 | 1
1 | 0 | 1
1 | 1 | 0

[ NAND ] (Inverted AND)
[ NOR ] (Inverted OR)
[ XNOR ] (Inverted XOR)`,
  
  2: `=== MEMORY BASICS ===
Volatile memory retention requires pattern recognition.

TECHNIQUES:
1. Chunking: Group bits into blocks of 3 or 4.
   Example: 10110011 -> 1011 0011
   
2. Spatial visualization: Map 1s to 'high' and 0s to 'low'.

3. Subvocalization: Repeat the bits verbally as they appear.`,

  3: `=== CIPHER BASICS ===
Cryptography revolves around obscuring data.

CAESAR SHIFT:
Shift letters by a fixed amount.
Example (+3): A -> D, B -> E, C -> F.

BINARY ASCII:
8 bits = 1 Byte = 1 Character.
01000001 = 65 = 'A'

ATBASH:
Mirrored alphabet.
A=Z, B=Y, C=X.`,

  4: `=== ALAN TURING KNOWLEDGE BASE ===
Alan Mathison Turing (1912 - 1954)

- Father of theoretical computer science and AI.
- Formalized the concepts of computation with the Turing machine.
- Played a pivotal role in cracking intercepted coded messages during WW2, notably the Enigma machine.
- Proposed the 'Turing Test' to assess machine intelligence.

"Sometimes it is the people no one can imagine anything of who do the things no one can imagine."`
};
