/* eslint-env browser */
/* eslint-disable no-param-reassign, no-plusplus, no-mixed-operators */
import audioData from '!file!../data/aud_lq.ogg';  // eslint-disable-line import/no-unresolved
import TimedLyrics from './TimedLyrics';
import words from '../data/putitinmyvideo.json';
import { birandint, randint, rand, createWaveGenerator, v3lerp, flerp } from './util';

require('!style!css!stylus!./style.styl');  // eslint-disable-line import/no-unresolved

let timedLyrics;
const verses = [];
let currentVerse = null;
const cameraPosition = { x: 0, y: 0, z: 0 };
const cameraRotation = { x: 0, y: 0, z: 0 };
const xAG = createWaveGenerator(6, 6, 0.2);
const yAG = createWaveGenerator(6, 6, 0.2);
const zAG = createWaveGenerator(6, 15, 1);
const rxAG = createWaveGenerator(3, 0.1, 0.2);
const ryAG = createWaveGenerator(3, 0.1, 0.2);
let t0;
let container;


function renderWord(word) {
  if (!currentVerse || word.verse) {
    currentVerse = Object.assign(
      document.createElement('div'),
      { className: 'verse' }
    );
    container.appendChild(currentVerse);
    const lastVerse = (verses.length ? verses[verses.length - 1] : null);
    currentVerse.x = (lastVerse ? lastVerse.x : 0) + birandint(256, 512);
    currentVerse.y = (lastVerse ? lastVerse.y : 0) + birandint(256, 512);
    currentVerse.z = (lastVerse ? lastVerse.z : 0) + randint(32, 192);
    currentVerse.rotation = (lastVerse ? lastVerse.rotation : 0) + rand(-1.5, 1.5);
    verses.push(currentVerse);
  }
  currentVerse.appendChild(Object.assign(
    document.createElement('span'),
    {
      innerText: `${word.word} `,
    }
  ));
}

function handleEvent(event, word) {
  if (event === 'show') {
    renderWord(word);
  }
}


function animate() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const t = (+new Date() - t0) / 1000;

  if (verses.length) {
    const lastVerse = verses[verses.length - 1];
    v3lerp(cameraPosition, {
      x: lastVerse.x,
      y: lastVerse.y,
      z: lastVerse.z + 70,
    }, 0.1);
    cameraPosition.x += xAG(t);
    cameraPosition.y += yAG(t);
    cameraPosition.z += zAG(t);
    cameraRotation.x = rxAG(t);
    cameraRotation.y = ryAG(t);
    cameraRotation.z = flerp(cameraRotation.z, lastVerse.rotation, 0.1);
  }
  document.body.style.transform = `rotateZ(${cameraRotation.z * -57.2}deg)`;
  verses.forEach((verse) => {
    const z = verse.z - cameraPosition.z;
    const op = Math.min(1, Math.max(0, 1.0 - (z / -1200)));
    verse.style.opacity = op;
    if (op <= 0) return;
    const x = verse.x - cameraPosition.x + vw / 2;
    const y = verse.y - cameraPosition.y + vh / 2;
    const r = verse.rotation * 57.2;
    const blur = 15 * (1 - op);
    verse.style.textShadow = `#353129 0px 0px ${blur}px`;
    verse.style.transform = `translate3d(${x}px,${y}px,${z}px) rotateZ(${r}deg)`;
  });

  while (verses.length >= 20) {
    const verse = verses.shift();
    verse.parentNode.removeChild(verse);
  }

  requestAnimationFrame(animate);
}

function play() {
  timedLyrics.play();
  animate();
}

function init() {
  const audio = Object.assign(
    document.createElement('audio'),
    { src: audioData, preload: 'auto' }
  );
  container = Object.assign(
    document.createElement('div'),
    { id: 'container' },
  );
  timedLyrics = new TimedLyrics(audio, words, handleEvent);
  document.body.appendChild(audio);
  document.body.appendChild(container);

  t0 = +new Date();
  play();
}

window.addEventListener('load', init);
