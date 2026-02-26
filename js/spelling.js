/* ============================================================
   FunEnglish Kids – Spelling Bee Game
   Listen to the word, then spell it letter by letter!
   ============================================================ */

(function () {
  const container   = document.getElementById('spellingContainer');
  const resultPanel = document.getElementById('spellResult');
  const elNum       = document.getElementById('spellNum');
  const elScore     = document.getElementById('spellScore');
  const elEmoji     = document.getElementById('spellEmoji');
  const elInput     = document.getElementById('spellInput');
  const elKeyboard  = document.getElementById('spellKeyboard');
  const elFeedback  = document.getElementById('spellFeedback');
  const btnStart    = document.getElementById('spellStart');
  const btnListen   = document.getElementById('spellListen');
  const btnAgain    = document.getElementById('spellPlayAgain');
  const elResultEmoji = document.getElementById('spellResultEmoji');
  const elResultTitle = document.getElementById('spellResultTitle');
  const elFinal     = document.getElementById('spellFinalScore');

  if (!container) return;

  const TOTAL = 10;
  let words   = [];
  let current = 0;
  let score   = 0;
  let typed   = '';
  let answered = false;

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
    utter.rate = 0.75;
    utter.pitch = 1.1;
    window.speechSynthesis.speak(utter);
  }

  function buildKeyboard() {
    elKeyboard.innerHTML = '';
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 0; i < letters.length; i++) {
      var btn = document.createElement('button');
      btn.className = 'spell-key';
      btn.textContent = letters[i];
      btn.dataset.letter = letters[i];
      btn.addEventListener('click', function () {
        if (answered) return;
        typeLetter(this.dataset.letter);
      });
      elKeyboard.appendChild(btn);
    }
    // Backspace button
    var bksp = document.createElement('button');
    bksp.className = 'spell-key spell-key-special';
    bksp.textContent = '⌫';
    bksp.addEventListener('click', function () {
      if (answered) return;
      backspace();
    });
    elKeyboard.appendChild(bksp);

    // Submit button
    var submit = document.createElement('button');
    submit.className = 'spell-key spell-key-submit';
    submit.textContent = '✓ Check';
    submit.addEventListener('click', function () {
      if (answered) return;
      checkSpelling();
    });
    elKeyboard.appendChild(submit);
  }

  function renderInput() {
    var word = words[current].word.toUpperCase();
    var html = '';
    for (var i = 0; i < word.length; i++) {
      var letter = typed[i] || '';
      var cls = 'spell-slot';
      if (i === typed.length && !answered) cls += ' spell-slot-active';
      html += '<span class="' + cls + '">' + letter + '</span>';
    }
    elInput.innerHTML = html;
  }

  function typeLetter(letter) {
    var word = words[current].word.toUpperCase();
    if (typed.length >= word.length) return;
    typed += letter;
    renderInput();
    // Auto-check when all letters typed
    if (typed.length === word.length) {
      setTimeout(checkSpelling, 300);
    }
  }

  function backspace() {
    if (typed.length === 0) return;
    typed = typed.slice(0, -1);
    renderInput();
  }

  function checkSpelling() {
    if (answered) return;
    var word = words[current].word.toUpperCase();
    answered = true;

    if (typed === word) {
      score++;
      elScore.textContent = score;
      elFeedback.innerHTML = '<span class="spell-correct">✅ Correct! <strong>' + words[current].word + '</strong></span>';
      speak('Correct! ' + words[current].word);
    } else {
      elFeedback.innerHTML = '<span class="spell-wrong">❌ The correct spelling is <strong>' + words[current].word + '</strong></span>';
      speak('The correct spelling is ' + words[current].word);
    }

    // Highlight correct/wrong slots
    var slots = elInput.querySelectorAll('.spell-slot');
    for (var i = 0; i < word.length; i++) {
      if (typed[i] === word[i]) {
        slots[i].classList.add('slot-correct');
      } else {
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
    typed = '';
    var w = words[current];
    elNum.textContent = current + 1;
    elEmoji.textContent = w.emoji;
    elFeedback.innerHTML = '';
    renderInput();
    speak(w.word);
  }

  function showResult() {
    container.classList.add('hidden');
    resultPanel.classList.remove('hidden');
    elFinal.textContent = score;

    if (score >= 9) {
      elResultEmoji.textContent = '🏆';
      elResultTitle.textContent = 'Spelling Champion!';
    } else if (score >= 7) {
      elResultEmoji.textContent = '🎉';
      elResultTitle.textContent = 'Great Speller!';
    } else if (score >= 5) {
      elResultEmoji.textContent = '👍';
      elResultTitle.textContent = 'Good Try!';
    } else {
      elResultEmoji.textContent = '📚';
      elResultTitle.textContent = 'Keep Practicing!';
    }
  }

  function startGame() {
    words = shuffle(SPELLING_WORDS).slice(0, TOTAL);
    current = 0;
    score = 0;
    elScore.textContent = '0';
    container.classList.remove('hidden');
    resultPanel.classList.add('hidden');
    buildKeyboard();
    showWord();
  }

  btnStart.addEventListener('click', startGame);
  if (btnAgain) btnAgain.addEventListener('click', startGame);
  if (btnListen) {
    btnListen.addEventListener('click', function () {
      if (words[current]) speak(words[current].word);
    });
  }

  // Auto-start
  startGame();
})();
