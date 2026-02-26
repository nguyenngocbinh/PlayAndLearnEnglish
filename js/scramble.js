/* ============================================================
   FunEnglish Kids – Word Scramble Game
   Unscramble the letters to form the correct word!
   ============================================================ */

(function () {
  const container   = document.getElementById('scrambleContainer');
  const resultPanel = document.getElementById('scrResult');
  const elNum       = document.getElementById('scrNum');
  const elScore     = document.getElementById('scrScore');
  const elTimer     = document.getElementById('scrTimer');
  const elEmoji     = document.getElementById('scrEmoji');
  const elHint      = document.getElementById('scrHint');
  const elAnswer    = document.getElementById('scrAnswer');
  const elLetters   = document.getElementById('scrLetters');
  const elFeedback  = document.getElementById('scrFeedback');
  const btnStart    = document.getElementById('scrStart');
  const btnClear    = document.getElementById('scrClear');
  const btnHintBtn  = document.getElementById('scrHintBtn');
  const btnAgain    = document.getElementById('scrPlayAgain');
  const elResultEmoji = document.getElementById('scrResultEmoji');
  const elResultTitle = document.getElementById('scrResultTitle');
  const elFinal     = document.getElementById('scrFinalScore');
  const elFinalTime = document.getElementById('scrFinalTime');

  if (!container) return;

  const TOTAL = 10;
  let words       = [];
  let current     = 0;
  let score       = 0;
  let answered    = false;
  let timerInterval = null;
  let seconds     = 0;
  let selectedLetters = []; // track which scrambled letter indices are used
  let answerArr   = [];     // built answer letters

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.85;
    utter.pitch = 1.1;
    window.speechSynthesis.speak(utter);
  }

  function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    elTimer.textContent = '0';
    timerInterval = setInterval(function () {
      seconds++;
      elTimer.textContent = seconds;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  // Scramble letters ensuring they're not in original order
  function scrambleWord(word) {
    var letters = word.split('');
    var scrambled;
    var attempts = 0;
    do {
      scrambled = shuffle(letters);
      attempts++;
    } while (scrambled.join('') === word && attempts < 20);
    return scrambled;
  }

  function renderScrambled() {
    var w = words[current];
    var scrambled = w._scrambled;
    elLetters.innerHTML = '';
    for (var i = 0; i < scrambled.length; i++) {
      var btn = document.createElement('button');
      btn.className = 'scr-letter';
      btn.textContent = scrambled[i];
      btn.dataset.index = i;
      if (selectedLetters.indexOf(i) !== -1) {
        btn.classList.add('scr-letter-used');
        btn.disabled = true;
      }
      btn.addEventListener('click', function () {
        if (answered) return;
        var idx = parseInt(this.dataset.index);
        selectLetter(idx);
      });
      elLetters.appendChild(btn);
    }
  }

  function renderAnswer() {
    var w = words[current].word.toUpperCase();
    elAnswer.innerHTML = '';
    for (var i = 0; i < w.length; i++) {
      var span = document.createElement('span');
      span.className = 'scr-slot';
      span.textContent = answerArr[i] || '';
      if (answerArr[i]) {
        span.classList.add('scr-slot-filled');
        // Click to remove letter
        span.dataset.pos = i;
        span.addEventListener('click', function () {
          if (answered) return;
          removeLetter(parseInt(this.dataset.pos));
        });
      }
      elAnswer.appendChild(span);
    }
  }

  function selectLetter(scrIndex) {
    var w = words[current].word.toUpperCase();
    if (answerArr.length >= w.length) return;
    selectedLetters.push(scrIndex);
    answerArr.push(words[current]._scrambled[scrIndex]);
    renderScrambled();
    renderAnswer();

    // Auto-check when all letters placed
    if (answerArr.length === w.length) {
      setTimeout(checkAnswer, 400);
    }
  }

  function removeLetter(pos) {
    if (pos >= answerArr.length) return;
    // Find which scrambled index was this letter
    var letter = answerArr[pos];
    // remove from answer
    answerArr.splice(pos, 1);
    // find the first matching index in selectedLetters
    for (var i = 0; i < selectedLetters.length; i++) {
      if (words[current]._scrambled[selectedLetters[i]] === letter) {
        selectedLetters.splice(i, 1);
        break;
      }
    }
    renderScrambled();
    renderAnswer();
  }

  function checkAnswer() {
    if (answered) return;
    var w = words[current].word.toUpperCase();
    var attempt = answerArr.join('');
    answered = true;

    if (attempt === w) {
      score++;
      elScore.textContent = score;
      elFeedback.innerHTML = '<span class="spell-correct">✅ Correct! <strong>' + words[current].word + '</strong></span>';
      speak('Correct! ' + words[current].word);
    } else {
      elFeedback.innerHTML = '<span class="spell-wrong">❌ The word is <strong>' + words[current].word + '</strong></span>';
      speak('The word is ' + words[current].word);
    }

    // Highlight slots
    var slots = elAnswer.querySelectorAll('.scr-slot');
    for (var i = 0; i < w.length; i++) {
      if (answerArr[i] === w[i]) {
        slots[i].classList.add('slot-correct');
      } else if (answerArr[i]) {
        slots[i].classList.add('slot-wrong');
      }
    }

    setTimeout(function () {
      current++;
      if (current < TOTAL) {
        showWord();
      } else {
        showResult();
      }
    }, 2000);
  }

  function showWord() {
    answered = false;
    selectedLetters = [];
    answerArr = [];
    var w = words[current];
    w._scrambled = scrambleWord(w.word.toUpperCase());
    elNum.textContent = current + 1;
    elEmoji.textContent = w.emoji;
    elHint.style.display = 'none';
    elHint.textContent = '💡 Hint: ' + w.hint;
    elFeedback.innerHTML = '';
    renderScrambled();
    renderAnswer();
  }

  function showResult() {
    stopTimer();
    container.classList.add('hidden');
    resultPanel.classList.remove('hidden');
    elFinal.textContent = score;
    elFinalTime.textContent = seconds;

    if (score >= 9) {
      elResultEmoji.textContent = '🏆';
      elResultTitle.textContent = 'Word Master!';
    } else if (score >= 7) {
      elResultEmoji.textContent = '🎉';
      elResultTitle.textContent = 'Awesome!';
    } else if (score >= 5) {
      elResultEmoji.textContent = '👍';
      elResultTitle.textContent = 'Good Try!';
    } else {
      elResultEmoji.textContent = '📚';
      elResultTitle.textContent = 'Keep Practicing!';
    }
  }

  function startGame() {
    words = shuffle(SCRAMBLE_WORDS).slice(0, TOTAL);
    current = 0;
    score = 0;
    elScore.textContent = '0';
    container.classList.remove('hidden');
    resultPanel.classList.add('hidden');
    startTimer();
    showWord();
  }

  btnStart.addEventListener('click', startGame);
  if (btnAgain) btnAgain.addEventListener('click', startGame);

  if (btnClear) {
    btnClear.addEventListener('click', function () {
      if (answered) return;
      selectedLetters = [];
      answerArr = [];
      renderScrambled();
      renderAnswer();
    });
  }

  if (btnHintBtn) {
    btnHintBtn.addEventListener('click', function () {
      elHint.style.display = 'block';
    });
  }

  // Auto-start
  startGame();
})();
