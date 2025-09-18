document.addEventListener('DOMContentLoaded', () => {

    const envelopeScreen = document.getElementById('envelope-screen');
    const openBtn = document.getElementById('open-btn');
    const mainContent = document.getElementById('main-content');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');

    // --- 1. Envelope Opening Logic ---
    openBtn.addEventListener('click', () => {
        envelopeWrapper.classList.add('open');
        setTimeout(() => {
            envelopeScreen.style.transition = 'opacity 0.5s';
            envelopeScreen.style.opacity = '0';
            setTimeout(() => {
                envelopeScreen.classList.add('hidden');
                mainContent.classList.remove('hidden');
            }, 500); // Wait for fade out
        }, 1000); // Wait for envelope animation
    });

    // --- 2. Modal (Letter) Logic ---
    const letterModal = document.getElementById('letter-modal');
    const readLetterBtn = document.getElementById('read-letter-btn');
    const letterCloseBtn = document.querySelector('.letter-close');

    readLetterBtn.addEventListener('click', () => letterModal.classList.remove('hidden'));
    letterCloseBtn.addEventListener('click', () => letterModal.classList.add('hidden'));

    // --- 3. Little Notes Logic ---
    const notes = document.querySelectorAll('.note');
    notes.forEach(note => {
        const originalText = note.textContent;
        note.addEventListener('click', () => {
            note.textContent = note.dataset.message;
            setTimeout(() => {
                note.textContent = originalText;
            }, 2500); // Show message for 2.5 seconds
        });
    });

    // --- 4. Music Playlist Logic ---
    const playBtns = document.querySelectorAll('.play-btn');
    const audioPlayers = document.querySelectorAll('.audio-player');

    playBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            audioPlayers.forEach((player, playerIndex) => {
                if (index !== playerIndex) player.pause();
            });
            playBtns.forEach((otherBtn, otherIndex) => {
                if (index !== otherIndex) {
                    otherBtn.textContent = 'Play';
                    otherBtn.classList.remove('playing');
                }
            });

            const audio = audioPlayers[index];
            if (audio.paused) {
                audio.play();
                btn.textContent = 'Now Playing...';
                btn.classList.add('playing');
            } else {
                audio.pause();
                btn.textContent = 'Play';
                btn.classList.remove('playing');
            }
        });
        audioPlayers[index].addEventListener('ended', () => {
            btn.textContent = 'Play';
            btn.classList.remove('playing');
        });
    });

    // --- 5. Floating Hearts on Touch/Click ---
    document.addEventListener('click', (e) => {
        if (e.target.closest('.modal-content, .card')) return; // Don't create hearts inside cards/modals
        let heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerHTML = '❤️';
        document.body.appendChild(heart);
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        setTimeout(() => heart.remove(), 1000);
    });
    
    // --- NEW: Game Logic ---
    const gameModal = document.getElementById('game-modal');
    const playGameBtn = document.getElementById('play-game-btn');
    const gameCloseBtn = document.querySelector('.game-close');
    const startGameBtn = document.getElementById('start-game-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    
    const gameStartScreen = document.getElementById('game-start-screen');
    const gamePlayScreen = document.getElementById('game-play-screen');
    const gameEndScreen = document.getElementById('game-end-screen');
    
    const scoreDisplay = document.getElementById('score-display');
    const timerDisplay = document.getElementById('timer-display');
    const gameArea = document.getElementById('game-area');
    
    const gameEndTitle = document.getElementById('game-end-title');
    const gameEndMessage = document.getElementById('game-end-message');
    const winningMessage = "Thank you for playing! I hope this little game shows how much I care. My heart is yours to catch, always.";
    const losingMessage = "Time's up! Give it another try.";

    let score = 0;
    let timeLeft = 30;
    const targetScore = 15;
    let gameInterval;
    let timerInterval;

    function openGame() {
        gameStartScreen.classList.remove('hidden');
        gamePlayScreen.classList.add('hidden');
        gameEndScreen.classList.add('hidden');
        gameModal.classList.remove('hidden');
    }

    function closeGame() {
        endGame(false); // Stop the game if it's running
        gameModal.classList.add('hidden');
    }

    function startGame() {
        score = 0;
        timeLeft = 30;
        updateScore();
        updateTimerDisplay();

        gameStartScreen.classList.add('hidden');
        gameEndScreen.classList.add('hidden');
        gamePlayScreen.classList.remove('hidden');

        timerInterval = setInterval(updateTimer, 1000);
        gameInterval = setInterval(spawnHeart, 700); // Spawn heart faster
    }

    function updateTimer() {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            endGame(false); // Lost
        }
    }
    
    function updateTimerDisplay() {
        timerDisplay.textContent = `Time: ${timeLeft}s`;
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}/${targetScore}`;
    }

    function spawnHeart() {
        const heart = document.createElement('div');
        heart.className = 'game-item';
        heart.innerHTML = '💖';

        const x = Math.random() * (gameArea.clientWidth - 30);
        const y = Math.random() * (gameArea.clientHeight - 30);
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;

        heart.addEventListener('click', () => {
            score++;
            updateScore();
            heart.remove();
            if (score >= targetScore) {
                endGame(true); // Won
            }
        });
        
        gameArea.appendChild(heart);
        setTimeout(() => heart.remove(), 2000); // Heart disappears after 2 seconds
    }

    function endGame(didWin) {
        clearInterval(timerInterval);
        clearInterval(gameInterval);
        gameArea.innerHTML = ''; // Clear any remaining hearts

        gamePlayScreen.classList.add('hidden');
        gameEndScreen.classList.remove('hidden');

        if (didWin) {
            gameEndTitle.textContent = "You did it! 🎉";
            gameEndMessage.textContent = winningMessage;
        } else {
            gameEndTitle.textContent = "Time's Up!";
            gameEndMessage.textContent = losingMessage;
        }
    }
    
    playGameBtn.addEventListener('click', openGame);
    gameCloseBtn.addEventListener('click', closeGame);
    startGameBtn.addEventListener('click', startGame);
    restartGameBtn.addEventListener('click', startGame);

    // Close modal if clicking outside
    window.addEventListener('click', (event) => {
        if (event.target == letterModal) letterModal.classList.add('hidden');
        if (event.target == gameModal) closeGame();
    });
});
