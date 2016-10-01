/* eslint-env browser */
/* eslint-disable no-param-reassign, no-plusplus */
const noop = function noop() {

};

module.exports = (function TimedLyrics(audioEl, words, eventFunc = noop) {
  let nextWordToView = 0;
  let initialized = false;

  function init() {
    for (let i = 0; i < words.length; i++) {
      words[i].id = i;
      eventFunc('init', words[i], words);
    }
    initialized = true;
  }

  function maybeShowNext() {
    const word = words[nextWordToView];
    if (!word) {
      eventFunc('lastWord');
      return;
    }
    if (audioEl.currentTime >= word.time) {
      eventFunc('show', word, words);
      nextWordToView++;
    }
    requestAnimationFrame(maybeShowNext);
  }


  function play() {
    if (!initialized) init();
    eventFunc('play');
    nextWordToView = 0;
    audioEl.currentTime = 0;
    audioEl.play();
    requestAnimationFrame(maybeShowNext);
  }

  this.play = play;
  this.audioEl = audioEl;
});
