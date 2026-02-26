/* ============================================================
   FunEnglish Kids – Listening Game
   Listen to the word and choose the matching picture!
   ============================================================ */

(function () {
  const container   = document.getElementById('listeningContainer');
  const resultPanel = document.getElementById('listenResult');
  const elNum       = document.getElementById('listenNum');
  const elScore     = document.getElementById('listenScore');
  const elOptions   = document.getElementById('listenOptions');
  const elFeedback  = document.getElementById('listenFeedback');
  const btnStart    = document.getElementById('listenStart');
  const btnPlay     = document.getElementById('listenPlayBtn');
  const btnAgain    = document.getElementById('listenPlayAgain');
  const elResultEmoji = document.getElementById('listenResultEmoji');
  const elResultTitle = document.getElementById('listenResultTitle');
  const elFinal     = document.getElementById('listenFinalScore');

  if (!container) return;

  const TOTAL = 10;
  let questions = [];
  let current   = 0;
  let score     = 0;
  let answered  = false;

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

  function showQuestion() {
    answered = false;
    var q = questions[current];
    elNum.textContent = current + 1;
    elFeedback.innerHTML = '';

    // Shuffle options
    var shuffled = shuffle(q.options);
    elOptions.innerHTML = '';
    shuffled.forEach(function (emoji) {
      var btn = document.createElement('button');
      btn.className = 'listen-option';
      btn.innerHTML = '<span class="listen-option-emoji">' + emoji + '</span>';
      btn.dataset.emoji = emoji;
      btn.addEventListener('click', function () {
        if (answered) return;
        selectAnswer(emoji, q.emoji, q.word);
      });
      elOptions.appendChild(btn);
    });

    // Auto-play the word
    setTimeout(function () { speak(q.word); }, 300);
  }

  function selectAnswer(selected, correct, word) {
    answered = true;

    // Highlight all options
    var btns = elOptions.querySelectorAll('.listen-option');
    btns.forEach(function (btn) {
      btn.disabled = true;
      if (btn.dataset.emoji === correct) {
        btn.classList.add('listen-correct');
      } else if (btn.dataset.emoji === selected && selected !== correct) {
        btn.classList.add('listen-wrong');
      }
    });

    if (selected === correct) {
      score++;
      elScore.textContent = score;
      elFeedback.innerHTML = '<span class="spell-correct">✅ Correct! It\'s <strong>' + word + '</strong>!</span>';
      speak('Correct! ' + word);
    } else {
      elFeedback.innerHTML = '<span class="spell-wrong">❌ The answer is <strong>' + word + '</strong> ' + correct + '</span>';
      speak('The answer is ' + word);
    }

    setTimeout(function () {
      current++;
      if (current < TOTAL) {
        showQuestion();
      } else {
        showResult();
      }
    }, 2000);
  }

  function showResult() {
    container.classList.add('hidden');
    resultPanel.classList.remove('hidden');
    elFinal.textContent = score;

    if (score >= 9) {
      elResultEmoji.textContent = '🏆';
      elResultTitle.textContent = 'Super Listener!';
    } else if (score >= 7) {
      elResultEmoji.textContent = '🎉';
      elResultTitle.textContent = 'Great Ears!';
    } else if (score >= 5) {
      elResultEmoji.textContent = '👍';
      elResultTitle.textContent = 'Good Try!';
    } else {
      elResultEmoji.textContent = '📚';
      elResultTitle.textContent = 'Keep Practicing!';
    }
  }

  function startGame() {
    questions = shuffle(LISTENING_WORDS).slice(0, TOTAL);
    current = 0;
    score = 0;
    elScore.textContent = '0';
    container.classList.remove('hidden');
    resultPanel.classList.add('hidden');
    showQuestion();
  }

  btnStart.addEventListener('click', startGame);
  if (btnAgain) btnAgain.addEventListener('click', startGame);

  if (btnPlay) {
    btnPlay.addEventListener('click', function () {
      if (questions[current]) speak(questions[current].word);
    });
  }

  // Auto-start
  startGame();
})();
