// Random strong username & password generators (using crypto.randomInt / built-in)

import { randomInt } from 'node:crypto';

const WORD_LIST = [
  'Sky', 'Pixel', 'Dragon', 'Shadow', 'Blaze',
  'Storm', 'Wolf', 'Raven', 'Frost', 'Ghost',
  'Titan', 'Knight', 'Fire', 'Star', 'Moon',
  'Light', 'Hunter', 'Nova', 'Rocket', 'Comet',
];

function randInt(maxInclusiveMin1: number): number {
  return randomInt(maxInclusiveMin1);
}

function pickWord(): string {
  return WORD_LIST[randInt(WORD_LIST.length)];
}

export function generateNovaUsername(): string {
  const word = pickWord();
  // 3 or 4 digit number (100-9999)
  const num = randInt(2) === 0 ? randInt(9000) + 1000 : randInt(900) + 100;
  return `Nova${word}${num}`;
}

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
const SYMBOLS = '!@#$%^&*';

export function generateStrongPassword(): string {
  const word1 = pickWord();
  const word2 = pickWord();
  const sym1 = SYMBOLS[randInt(SYMBOLS.length)];
  const sym2 = SYMBOLS[randInt(SYMBOLS.length)];
  const num = randInt(90) + 10;

  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += CHARS[randInt(CHARS.length)];
  }

  return `Nova${sym1}${word1}${num}${suffix}${sym2}`;
}

