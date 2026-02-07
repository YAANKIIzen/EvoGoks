// ==============================
// GAME VARIABLES
// ==============================
let gameStarted = false;
let gameOver = false;
let isPaused = false;
let isAnswering = false;
let score = 0;
let timeLeft = 180; // 3 menit
let evo = 0; // Evolusi stage (0-5)
let level = 1;
let currentQuestion = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let consecutiveCorrect = 0;
let playerName = "Player";
let hintsRemaining = 3;
let soundEnabled = true;
let questionTime = 15;
let questionTimerInterval;
let gameTimerInterval;
let currentExplanation = "";
let characterAnimationActive = true;

// Audio elements
let bgmAudio, correctSound, wrongSound, evolveSound, warningSound;

// Character images and backgrounds
const stages = [
    {
        name: "Kera Purba",
        desc: "Cikal bakal primata manusia (15 juta tahun lalu)",
        image: "assets/characters/stage1_ape.png",
        bg: "assets/bg/jungle.png",
        color: "#8B4513",
        facts: [
            "Hidup di hutan Afrika",
            "Berjalan dengan 4 kaki",
            "Memakan buah dan daun",
            "Hidup berkelompok"
        ],
        period: "15 juta tahun lalu"
    },
    {
        name: "Australopithecus",
        desc: "Manusia kera yang sudah berjalan tegak (4 juta tahun lalu)",
        image: "assets/characters/stage2_australo.png",
        bg: "assets/bg/savanna.png",
        color: "#A0522D",
        facts: [
            "Fosil Lucy terkenal",
            "Berjalan dengan 2 kaki",
            "Tinggi sekitar 1.2 meter",
            "Otak kecil (400-500 cc)"
        ],
        period: "4 juta tahun lalu"
    },
    {
        name: "Homo Habilis",
        desc: "Manusia purba pembuat alat batu (2.5 juta tahun lalu)",
        image: "assets/characters/stage3_habilis.PNG",
        bg: "assets/bg/cave.png",
        color: "#CD853F",
        facts: [
            "Pembuat alat batu pertama",
            "Otak lebih besar (600-700 cc)",
            "Pengumpul makanan",
            "Hidup di savana"
        ],
        period: "2.5 juta tahun lalu"
    },
    {
        name: "Homo Erectus",
        desc: "Manusia purba penjelajah pertama (1.8 juta tahun lalu)",
        image: "assets/characters/stage4_erectus.png",
        bg: "assets/bg/fire.png",
        color: "#D2691E",
        facts: [
            "Manusia pertama keluar Afrika",
            "Pengguna api pertama",
            "Pemburu terampil",
            "Tinggi hingga 1.8 meter"
        ],
        period: "1.8 juta tahun lalu"
    },
    {
        name: "Homo Sapiens",
        desc: "Manusia modern awal (300.000 tahun lalu)",
        image: "assets/characters/stage5_sapiens.PNG",
        bg: "assets/bg/cave.png",
        color: "#DEB887",
        facts: [
            "Otak besar (1200-1400 cc)",
            "Pembuat seni gua",
            "Penguburan jenazah",
            "Alat dari tulang"
        ],
        period: "300.000 tahun lalu"
    },
    {
        name: "Manusia Modern",
        desc: "Manusia dengan peradaban maju (10.000 tahun lalu - sekarang)",
        image: "assets/characters/stage6_modern.PNG",
        bg: "assets/bg/city.png",
        color: "#F5DEB3",
        facts: [
            "Bercocok tanam",
            "Membangun kota",
            "Teknologi maju",
            "Bahasa kompleks"
        ],
        period: "10.000 tahun lalu - sekarang"
    }
];

const questions = [
    {
        q: "Tahap evolusi manusia yang paling primitif adalah...",
        a: ["Homo Sapiens", "Kera Purba", "Australopithecus", "Homo Erectus", "Homo Habilis"],
        c: 1,
        explanation: "Kera Purba adalah tahap paling primitif dalam evolusi manusia, hidup sekitar 15 juta tahun lalu di hutan Afrika sebagai cikal bakal primata manusia.",
        category: "Evolusi Dasar",
        difficulty: 1
    },
    {
        q: "Manusia yang pertama kali membuat alat batu disebut...",
        a: ["Homo Sapiens", "Homo Habilis", "Homo Erectus", "Australopithecus", "Kera Purba"],
        c: 1,
        explanation: "Homo Habilis disebut 'manusia terampil' karena pertama kali membuat alat batu sederhana dari batu pecahan sekitar 2.5 juta tahun lalu.",
        category: "Perkembangan Alat",
        difficulty: 2
    },
    {
        q: "Manusia pertama yang keluar dari Afrika adalah...",
        a: ["Homo Sapiens", "Homo Habilis", "Homo Erectus", "Kera Purba", "Neanderthal"],
        c: 2,
        explanation: "Homo Erectus adalah manusia purba pertama yang bermigrasi keluar dari Afrika menuju Asia sekitar 1.8 juta tahun lalu, menjadikannya penjelajah pertama.",
        category: "Migrasi",
        difficulty: 3
    },
    {
        q: "Fosil manusia purba 'Lucy' termasuk dalam spesies...",
        a: ["Homo Sapiens", "Homo Habilis", "Australopithecus", "Homo Erectus", "Homo Neanderthalensis"],
        c: 2,
        explanation: "Lucy adalah fosil Australopithecus afarensis yang ditemukan di Ethiopia tahun 1974, berusia 3.2 juta tahun, menunjukkan postur berjalan tegak.",
        category: "Fosil Penting",
        difficulty: 2
    },
    {
        q: "Manusia pertama yang menggunakan api adalah...",
        a: ["Homo Sapiens", "Homo Habilis", "Homo Erectus", "Kera Purba", "Neanderthal"],
        c: 2,
        explanation: "Homo Erectus adalah manusia pertama yang menggunakan api sekitar 1.7 juta tahun lalu untuk memasak, menghangatkan tubuh, dan mengusir hewan buas.",
        category: "Teknologi Api",
        difficulty: 3
    },
    {
        q: "Otak terbesar dimiliki oleh...",
        a: ["Homo Habilis", "Homo Erectus", "Homo Sapiens", "Australopithecus", "Homo Neanderthalensis"],
        c: 2,
        explanation: "Homo Sapiens memiliki otak terbesar (1200-1400 cc) yang memungkinkan perkembangan bahasa kompleks, seni, dan teknologi canggih.",
        category: "Anatomi",
        difficulty: 2
    },
    {
        q: "Manusia pertama yang melakukan penguburan jenazah adalah...",
        a: ["Homo Erectus", "Homo Sapiens", "Neanderthal", "Homo Habilis", "Kera Purba"],
        c: 1,
        explanation: "Homo Sapiens adalah manusia pertama yang melakukan ritual penguburan dengan memberikan bekal kubur sekitar 100.000 tahun lalu, menunjukkan kepercayaan akan kehidupan setelah mati.",
        category: "Budaya",
        difficulty: 3
    },
    {
        q: "Manusia yang hidup bersamaan dengan Homo Sapiens adalah...",
        a: ["Homo Habilis", "Homo Erectus", "Neanderthal", "Australopithecus", "Homo Floresiensis"],
        c: 2,
        explanation: "Neanderthal hidup bersamaan dengan Homo Sapiens di Eropa antara 400.000 hingga 40.000 tahun lalu sebelum punah, kemungkinan karena kompetisi dengan Homo Sapiens.",
        category: "Koeksistensi",
        difficulty: 3
    },
    {
        q: "Manusia purba yang ditemukan di Pulau Flores disebut...",
        a: ["Homo Erectus", "Homo Sapiens", "Homo Habilis", "Homo Floresiensis", "Australopithecus"],
        c: 3,
        explanation: "Homo Floresiensis ditemukan tahun 2003 di Flores, Indonesia. Tingginya hanya 1 meter sehingga dijuluki 'Hobbit', hidup hingga 50.000 tahun lalu.",
        category: "Fosil Unik",
        difficulty: 3
    },
    {
        q: "Manusia pertama yang membuat seni gua adalah...",
        a: ["Homo Erectus", "Homo Sapiens", "Neanderthal", "Homo Habilis", "Kera Purba"],
        c: 1,
        explanation: "Homo Sapiens membuat seni gua pertama sekitar 40.000 tahun lalu di Eropa, seperti di gua Lascaux Prancis dan Altamira Spanyol.",
        category: "Seni Purba",
        difficulty: 2
    },
    {
        q: "Kapasitas otak Homo Habilis sekitar...",
        a: ["400-500 cc", "500-600 cc", "600-700 cc", "700-800 cc", "900-1000 cc"],
        c: 2,
        explanation: "Homo Habilis memiliki otak 600-700 cc, lebih besar dari Australopithecus (400-500 cc) tapi lebih kecil dari Homo Erectus (800-1100 cc).",
        category: "Kapasitas Otak",
        difficulty: 3
    },
    {
        q: "Manusia purba yang hidup di Eropa selama Zaman Es adalah...",
        a: ["Homo Erectus", "Homo Sapiens", "Neanderthal", "Homo Habilis", "Australopithecus"],
        c: 2,
        explanation: "Neanderthal beradaptasi dengan iklim dingin Eropa selama Zaman Es dengan tubuh kekar, hidung besar, dan kemampuan membuat alat batu yang baik.",
        category: "Adaptasi Lingkungan",
        difficulty: 3
    },
    {
        q: "Australopithecus terkenal karena...",
        a: ["Berdiri tegak", "Menggunakan api", "Membuat alat logam", "Berlayar", "Menulis"],
        c: 0,
        explanation: "Australopithecus adalah hominid pertama yang berjalan tegak dengan dua kaki (bipedal), meski masih menghabiskan waktu di pohon.",
        category: "Ciri-ciri",
        difficulty: 1
    },
    {
        q: "Homo Erectus adalah manusia pertama yang...",
        a: ["Menggunakan bahasa", "Tinggal di gua", "Berburu besar", "Membuat perahu", "Bercocok tanam"],
        c: 2,
        explanation: "Homo Erectus mengembangkan teknik berburu besar dengan tombak kayu dan bekerja sama dalam kelompok untuk memburu hewan seperti gajah dan kuda nil.",
        category: "Kemampuan",
        difficulty: 2
    },
    {
        q: "Manusia modern awal (Homo Sapiens) muncul pertama kali di...",
        a: ["Asia", "Eropa", "Afrika", "Australia", "Amerika"],
        c: 2,
        explanation: "Homo Sapiens muncul pertama kali di Afrika sekitar 300.000 tahun lalu, kemudian menyebar ke seluruh dunia dalam migrasi besar.",
        category: "Asal Usul",
        difficulty: 2
    },
    {
        q: "Ciri khas Australopithecus adalah...",
        a: ["Berdiri tegak dengan 2 kaki", "Menggunakan api", "Membuat alat logam", "Bahasa kompleks", "Teknologi canggih"],
        c: 0,
        explanation: "Ciri utama Australopithecus adalah bipedalisme (berjalan dengan 2 kaki), meski lengannya masih panjang untuk memanjat pohon.",
        category: "Ciri-ciri",
        difficulty: 1
    },
    {
        q: "Homo Habilis disebut 'manusia terampil' karena...",
        a: ["Berdiri tegak", "Menggunakan api", "Membuat alat batu", "Berburu besar", "Bercocok tanam"],
        c: 2,
        explanation: "Nama 'Homo Habilis' berarti 'manusia terampil' karena mereka membuat alat batu Oldowan untuk memotong daging dan mengolah bahan makanan.",
        category: "Kemampuan",
        difficulty: 2
    },
    {
        q: "Homo Erectus menyebar hingga ke wilayah...",
        a: ["Afrika saja", "Afrika dan Asia", "Seluruh dunia", "Eropa saja", "Australia saja"],
        c: 1,
        explanation: "Homo Erectus menyebar dari Afrika ke Asia (Indonesia, China) dan mungkin Eropa, menunjukkan kemampuan adaptasi yang luar biasa.",
        category: "Migrasi",
        difficulty: 2
    },
    {
        q: "Homo Sapiens memiliki kapasitas otak sekitar...",
        a: ["500-600 cc", "700-800 cc", "900-1000 cc", "1100-1300 cc", "1200-1400 cc"],
        c: 4,
        explanation: "Otak Homo Sapiens (1200-1400 cc) memungkinkan perkembangan bahasa simbolik, pemikiran abstrak, dan teknologi kompleks.",
        category: "Anatomi",
        difficulty: 2
    },
    {
        q: "Manusia modern mulai bercocok tanam sekitar...",
        a: ["1 juta tahun lalu", "500.000 tahun lalu", "100.000 tahun lalu", "10.000 tahun lalu", "1.000 tahun lalu"],
        c: 3,
        explanation: "Revolusi Neolitik dimulai sekitar 10.000 tahun lalu dengan domestikasi tanaman dan hewan, mengubah manusia dari pemburu-pengumpul menjadi petani.",
        category: "Peradaban",
        difficulty: 3
    },
    {
        q: "Manusia purba yang membuat alat dari tulang adalah...",
        a: ["Australopithecus", "Homo Habilis", "Homo Erectus", "Homo Sapiens", "Kera Purba"],
        c: 3,
        explanation: "Homo Sapiens membuat berbagai alat dari tulang, termasuk jarum untuk menjahit pakaian, mata tombak, dan alat musik pertama.",
        category: "Teknologi",
        difficulty: 2
    },
    {
        q: "Zaman ketika manusia mulai hidup menetap adalah...",
        a: ["Paleolitikum", "Mesolitikum", "Neolitikum", "Megalitikum", "Logam"],
        c: 2,
        explanation: "Zaman Neolitikum (Batu Muda) ditandai dengan kehidupan menetap, pertanian, dan peternakan, dimulai sekitar 10.000 tahun lalu.",
        category: "Periode",
        difficulty: 2
    }
];

// ==============================
// AUDIO FUNCTIONS
// ==============================
function initializeAudio() {
    bgmAudio = document.getElementById('bgmAudio');
    correctSound = document.getElementById('correctSound');
    wrongSound = document.getElementById('wrongSound');
    evolveSound = document.getElementById('evolveSound');
    warningSound = document.getElementById('warningSound');
    
    // Set volume
    if (bgmAudio) bgmAudio.volume = 0.3;
    if (correctSound) correctSound.volume = 0.5;
    if (wrongSound) wrongSound.volume = 0.5;
    if (evolveSound) evolveSound.volume = 0.5;
    if (warningSound) warningSound.volume = 0.5;
}

function playSound(soundType) {
    if (!soundEnabled) return;
    
    try {
        switch(soundType) {
            case 'bgm':
                if (bgmAudio) {
                    bgmAudio.currentTime = 0;
                    bgmAudio.play().catch(e => console.log("BGM play error:", e));
                }
                break;
            case 'correct':
                if (correctSound) {
                    correctSound.currentTime = 0;
                    correctSound.play().catch(e => console.log("Correct sound error:", e));
                }
                break;
            case 'wrong':
                if (wrongSound) {
                    wrongSound.currentTime = 0;
                    wrongSound.play().catch(e => console.log("Wrong sound error:", e));
                }
                break;
            case 'evolve':
                if (evolveSound) {
                    evolveSound.currentTime = 0;
                    evolveSound.play().catch(e => console.log("Evolve sound error:", e));
                }
                break;
            case 'warning':
                if (warningSound) {
                    warningSound.currentTime = 0;
                    warningSound.play().catch(e => console.log("Warning sound error:", e));
                }
                break;
        }
    } catch (e) {
        console.log(`Error playing ${soundType} sound:`, e);
    }
}

function stopBGM() {
    if (bgmAudio) {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
    }
}

// ==============================
// BACKGROUND FUNCTIONS
// ==============================
function updateBackground() {
    const stage = stages[evo];
    if (!stage) return;
    
    // Update body background
    document.body.style.backgroundImage = `url('${stage.bg}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
}

// ==============================
// CHARACTER FUNCTIONS
// ==============================
function updateCharacter() {
    const stage = stages[evo];
    if (!stage) return;
    
    // Update game screen character
    const characterImg = document.getElementById('characterImg');
    if (characterImg) {
        characterImg.src = stage.image;
        characterImg.alt = stage.name;
        characterImg.classList.add('evolve');
        setTimeout(() => characterImg.classList.remove('evolve'), 800);
    }
    
    // Update menu character
    const menuCharacterImg = document.getElementById('menuCharacterImg');
    if (menuCharacterImg) {
        menuCharacterImg.src = stage.image;
        menuCharacterImg.alt = stage.name;
    }
    
    // Update character info
    document.getElementById('stageName').textContent = stage.name;
    document.getElementById('stageDesc').textContent = stage.desc;
    
    // Update menu character info
    document.getElementById('menuStageName').textContent = stage.name;
    document.getElementById('menuStageDesc').textContent = stage.desc;
    
    // Update badge
    document.getElementById('characterStageBadge').querySelector('span').textContent = evo + 1;
    
    // Update background
    updateBackground();
}

// ==============================
// CHARACTER ANIMATION FUNCTIONS
// ==============================
function startCharacterAnimation() {
    if (window.characterAnimationInterval) {
        clearInterval(window.characterAnimationInterval);
    }
    
    let currentStageIndex = 0;
    const menuCharacterImg = document.getElementById('menuCharacterImg');
    const menuStageName = document.getElementById('menuStageName');
    const menuStageDesc = document.getElementById('menuStageDesc');
    
    if (!menuCharacterImg || !menuStageName || !menuStageDesc) return;
    
    // Set interval untuk animasi slide karakter
    const animationInterval = setInterval(() => {
        // Update ke stage berikutnya
        currentStageIndex = (currentStageIndex + 1) % stages.length;
        const stage = stages[currentStageIndex];
        
        // Tambahkan efek fade out
        menuCharacterImg.style.opacity = '0.5';
        menuCharacterImg.style.transform = 'translateX(-20px) scale(0.9)';
        
        // Update gambar dan info setelah delay
        setTimeout(() => {
            menuCharacterImg.src = stage.image;
            menuCharacterImg.alt = stage.name;
            menuStageName.textContent = stage.name;
            menuStageDesc.textContent = stage.desc;
            
            // Efek fade in dengan animasi
            menuCharacterImg.style.opacity = '1';
            menuCharacterImg.style.transform = 'translateX(0) scale(1)';
            menuCharacterImg.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            // Tambahkan efek bounce
            menuCharacterImg.classList.add('bounce');
            setTimeout(() => {
                menuCharacterImg.classList.remove('bounce');
            }, 500);
        }, 300);
    }, 4000); // Ganti karakter setiap 4 detik
    
    // Simpan interval ID untuk dihentikan nanti
    window.characterAnimationInterval = animationInterval;
    characterAnimationActive = true;
}

function stopCharacterAnimation() {
    if (window.characterAnimationInterval) {
        clearInterval(window.characterAnimationInterval);
        window.characterAnimationInterval = null;
    }
    characterAnimationActive = false;
    
    // Reset karakter ke tahap pertama
    const menuCharacterImg = document.getElementById('menuCharacterImg');
    if (menuCharacterImg) {
        menuCharacterImg.style.opacity = '1';
        menuCharacterImg.style.transform = 'translateX(0) scale(1)';
        menuCharacterImg.style.transition = 'none';
    }
}

function toggleCharacterAnimation() {
    const animationToggle = document.getElementById('animationToggle');
    if (!animationToggle) return;
    
    if (animationToggle.checked) {
        startCharacterAnimation();
        showToast("▶️ Animasi karakter diaktifkan", "info");
    } else {
        stopCharacterAnimation();
        showToast("⏸️ Animasi karakter dimatikan", "warning");
    }
}

// ==============================
// INITIALIZATION
// ==============================
function initGame() {
    console.log("🎮 Initializing Evo Goks v2.3...");
    
    // Setup network detection
    setupNetworkDetection();
    
    // Initialize audio
    initializeAudio();
    
    // Setup loading progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 20;
        const progressBar = document.getElementById('loadingProgress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            
            // Hide loading screen and show menu
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                const menuScreen = document.getElementById('menuScreen');
                
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
                if (menuScreen) {
                    menuScreen.classList.remove('hidden');
                }
                
                // Setup event listeners
                setupEventListeners();
                
                // Update character and background
                updateCharacter();
                
                // Mulai animasi slide karakter
                startCharacterAnimation();
                
                // Start BGM
                if (soundEnabled) {
                    playSound('bgm');
                }
                
                showToast("🎮 Selamat bermain Evo Goks v2.3!", "info");
                
            }, 500);
        }
    }, 100);
    
    // Setup event listeners early
    setupBasicEventListeners();
}

function setupBasicEventListeners() {
    // Skip loading button
    const skipBtn = document.getElementById('skipLoadingBtn');
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            const loadingScreen = document.getElementById('loadingScreen');
            const menuScreen = document.getElementById('menuScreen');
            
            if (loadingScreen) loadingScreen.classList.add('hidden');
            if (menuScreen) menuScreen.classList.remove('hidden');
            
            // Initialize audio
            initializeAudio();
            setupEventListeners();
            updateCharacter();
            
            // Mulai animasi
            startCharacterAnimation();
            
            if (soundEnabled) {
                playSound('bgm');
            }
        });
    }
}

// ==============================
// SCREEN MANAGEMENT
// ==============================
function showScreen(screenName) {
    // Hide all screens
    const screens = ['loadingScreen', 'menuScreen', 'gameScreen', 'rankingScreen', 'resultScreen', 'rulesScreen'];
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (screen) screen.classList.add('hidden');
    });
    
    // Hide explanation box
    const explanationBox = document.getElementById('explanationBox');
    if (explanationBox) explanationBox.classList.add('hidden');
    
    // Show requested screen
    switch(screenName) {
        case 'menu':
            const menuScreen = document.getElementById('menuScreen');
            if (menuScreen) menuScreen.classList.remove('hidden');
            closeMobileMenu();
            closeGameMenu();
            updateCharacter();
            // Mulai animasi karakter di menu
            if (characterAnimationActive) {
                startCharacterAnimation();
            }
            break;
        case 'game':
            const gameScreen = document.getElementById('gameScreen');
            if (gameScreen) gameScreen.classList.remove('hidden');
            closeGameMenu();
            // Hentikan animasi karakter saat game dimulai
            stopCharacterAnimation();
            break;
        case 'ranking':
            const rankingScreen = document.getElementById('rankingScreen');
            if (rankingScreen) rankingScreen.classList.remove('hidden');
            loadRanking();
            stopCharacterAnimation();
            break;
        case 'result':
            const resultScreen = document.getElementById('resultScreen');
            if (resultScreen) resultScreen.classList.remove('hidden');
            showResult();
            stopCharacterAnimation();
            break;
        case 'rules':
            const rulesScreen = document.getElementById('rulesScreen');
            if (rulesScreen) rulesScreen.classList.remove('hidden');
            stopCharacterAnimation();
            break;
    }
}

// ==============================
// GAME LOGIC
// ==============================
function startGame() {
    // Get player name
    const nameInput = document.getElementById('playerName');
    playerName = nameInput?.value || "Player";
    
    // Reset game state
    resetGame();
    
    // Show game screen
    showScreen('game');
    
    // Update player name in game screen
    document.getElementById('mobilePlayerName').textContent = playerName;
    
    // Start game
    gameStarted = true;
    gameOver = false;
    
    // Load first question
    loadQuestion();
    startQuestionTimer();
    startGameTimer();
    
    showToast("🎮 Game dimulai! Semangat!", "success");
    playSound('bgm');
}

function resetGame() {
    score = 0;
    timeLeft = 180;
    evo = 0;
    level = 1;
    currentQuestion = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    consecutiveCorrect = 0;
    hintsRemaining = 3;
    gameStarted = false;
    gameOver = false;
    isPaused = false;
    isAnswering = false;
    currentExplanation = "";
    
    // Clear timers
    clearInterval(gameTimerInterval);
    clearInterval(questionTimerInterval);
    
    // Update UI
    updateUI();
    updateCharacter();
}

function loadQuestion() {
    const q = questions[currentQuestion];
    if (!q) {
        currentQuestion = 0;
        loadQuestion();
        return;
    }
    
    // Set question
    document.getElementById('question').textContent = q.q;
    document.getElementById('questionNumber').textContent = currentQuestion + 1;
    
    // Clear answers
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';
    
    // Store explanation for this question
    currentExplanation = q.explanation || "";
    
    // Shuffle answers
    const shuffledAnswers = [...q.a];
    for (let i = shuffledAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
    }
    
    // Create answer buttons (5 opsi)
    shuffledAnswers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn-mobile';
        btn.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
        btn.dataset.index = shuffledAnswers.indexOf(answer);
        btn.dataset.answer = answer;
        
        btn.addEventListener('click', function() {
            if (!isAnswering && !isPaused) {
                checkAnswer(parseInt(this.dataset.index));
            }
        });
        
        answersContainer.appendChild(btn);
    });
    
    // Reset question timer
    questionTime = 15;
    document.getElementById('timeLeft').textContent = questionTime;
    document.getElementById('questionTimeMobile').style.width = '100%';
    document.getElementById('questionTimeMobile').style.background = 'linear-gradient(90deg, var(--info), var(--primary))';
    
    // Hide explanation box
    document.getElementById('explanationBox').classList.add('hidden');
    
    // Update status
    showStatus(`Kategori: ${q.category} | Kesulitan: ${'⭐'.repeat(q.difficulty)}`, "info");
}

function checkAnswer(selectedIndex) {
    if (isAnswering || isPaused || gameOver) return;
    
    isAnswering = true;
    clearInterval(questionTimerInterval);
    
    const q = questions[currentQuestion];
    const isCorrect = selectedIndex === q.c;
    const buttons = document.querySelectorAll('.answer-btn-mobile');
    const correctAnswer = q.a[q.c];
    
    // Calculate time bonus
    const timeBonus = questionTime > 10 ? 75 : questionTime > 5 ? 50 : 25;
    
    // Disable all buttons
    buttons.forEach(btn => {
        btn.style.pointerEvents = 'none';
    });
    
    // Highlight correct answer
    const correctBtn = Array.from(buttons).find(btn => parseInt(btn.dataset.index) === q.c);
    if (correctBtn) correctBtn.classList.add('correct');
    
    if (isCorrect) {
        // Play correct sound
        playSound('correct');
        
        // Correct answer
        let points = 150 + timeBonus + 50; // 150 base + time bonus + 50 bonus 5 opsi
        
        consecutiveCorrect++;
        if (consecutiveCorrect >= 5) {
            points += 300;
            showToast(`🔥 5 JAWABAN BERUNTUN! +300 Bonus!`, "success");
            playSound('evolve');
        }
        
        score += points;
        correctAnswers++;
        
        if (score >= (evo + 1) * 250 && evo < stages.length - 1) {
            evo++;
            showToast(`🎉 BEREVOLUSI! Sekarang ${stages[evo].name}`, "info");
            playSound('evolve');
        }
        
        // Update level
        if (score >= level * 600) {
            level++;
            showToast(`🎯 LEVEL UP! Level ${level}`, "info");
        }
        
        // Show status
        let statusMsg = `✅ Benar! +${points} poin`;
        if (timeBonus > 0) statusMsg += ` (+${timeBonus} cepat)`;
        if (consecutiveCorrect > 1) statusMsg += ` | ${consecutiveCorrect} beruntun`;
        
        showStatus(statusMsg, "success");
        
        // Highlight selected answer as correct
        const selectedBtn = Array.from(buttons).find(btn => parseInt(btn.dataset.index) === selectedIndex);
        if (selectedBtn) selectedBtn.classList.add('correct');
        
        // Show brief explanation
        if (currentExplanation) {
            setTimeout(() => {
                showExplanation(currentExplanation);
            }, 1000);
        }
        
    } else {
        // Play wrong sound
        playSound('wrong');
        
        // Wrong answer
        score = Math.max(0, score - 50);
        wrongAnswers++;
        consecutiveCorrect = 0;
        
        if (evo > 0) evo--;
        
        // Show explanation for wrong answer
        showExplanation(`Jawaban yang benar adalah: <strong>${correctAnswer}</strong><br><br>${currentExplanation}`);
        
        showStatus("❌ Salah! -50 poin", "danger");
        
        // Highlight selected answer as wrong
        const selectedBtn = Array.from(buttons).find(btn => parseInt(btn.dataset.index) === selectedIndex);
        if (selectedBtn) selectedBtn.classList.add('wrong');
    }
    
    // Update UI
    updateUI();
    updateCharacter();
    
    // Next question after delay
    setTimeout(() => {
        currentQuestion = (currentQuestion + 1) % questions.length;
        isAnswering = false;
        
        if (!gameOver) {
            loadQuestion();
            startQuestionTimer();
        }
    }, 3000);
}

function showExplanation(text) {
    const explanationBox = document.getElementById('explanationBox');
    const explanationText = document.getElementById('explanationText');
    
    if (explanationBox && explanationText) {
        explanationText.innerHTML = text;
        explanationBox.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            explanationBox.classList.add('hidden');
        }, 5000);
    }
}

function useHint() {
    if (hintsRemaining <= 0 || isAnswering || gameOver) return;
    
    const q = questions[currentQuestion];
    const buttons = document.querySelectorAll('.answer-btn-mobile');
    const wrongAnswers = [];
    
    // Find wrong answers
    buttons.forEach((btn, index) => {
        if (parseInt(btn.dataset.index) !== q.c) {
            wrongAnswers.push(btn);
        }
    });
    
    // Remove three wrong answers (karena 5 opsi)
    if (wrongAnswers.length >= 3) {
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * wrongAnswers.length);
            wrongAnswers[randomIndex].style.opacity = '0.3';
            wrongAnswers[randomIndex].style.pointerEvents = 'none';
            wrongAnswers.splice(randomIndex, 1);
        }
        
        hintsRemaining--;
        updateUI();
        showToast(`💡 Petunjuk digunakan. Tersisa: ${hintsRemaining}`, "info");
    }
}

function skipQuestion() {
    if (isAnswering || isPaused || gameOver) return;
    
    if (confirm("Lewati pertanyaan ini? Skor tidak akan bertambah.")) {
        clearInterval(questionTimerInterval);
        currentQuestion = (currentQuestion + 1) % questions.length;
        loadQuestion();
        startQuestionTimer();
        showToast("⏭️ Pertanyaan dilewati", "warning");
    }
}

// ==============================
// TIMER FUNCTIONS
// ==============================
function startGameTimer() {
    clearInterval(gameTimerInterval);
    
    gameTimerInterval = setInterval(() => {
        if (!isPaused && !gameOver) {
            timeLeft--;
            
            if (timeLeft <= 0) {
                endGame();
                return;
            }
            
            // Update timer display
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Warning when 30 seconds left
            if (timeLeft === 30) {
                showToast("⚠️ 30 detik tersisa!", "warning");
                playSound('warning');
            }
            
            // Danger when 10 seconds left
            if (timeLeft <= 10) {
                document.getElementById('mobileTimer').style.background = 
                    'linear-gradient(135deg, rgba(255, 71, 87, 0.4), rgba(255, 71, 87, 0.2))';
            }
        }
    }, 1000);
}

function startQuestionTimer() {
    clearInterval(questionTimerInterval);
    questionTime = 15;
    
    questionTimerInterval = setInterval(() => {
        if (!isPaused && !gameOver && !isAnswering) {
            questionTime--;
            document.getElementById('timeLeft').textContent = questionTime;
            
            const percent = (questionTime / 15) * 100;
            document.getElementById('questionTimeMobile').style.width = `${percent}%`;
            
            // Change color based on time
            const timeFill = document.getElementById('questionTimeMobile');
            if (questionTime <= 5) {
                timeFill.style.background = 'linear-gradient(90deg, var(--danger), #ff6b6b)';
            } else if (questionTime <= 10) {
                timeFill.style.background = 'linear-gradient(90deg, var(--warning), #ffcc00)';
            }
            
            if (questionTime <= 0) {
                clearInterval(questionTimerInterval);
                
                // Play wrong sound
                playSound('wrong');
                
                // Time's up - treat as wrong answer
                score = Math.max(0, score - 50);
                consecutiveCorrect = 0;
                wrongAnswers++;
                
                if (evo > 0) evo--;
                
                const q = questions[currentQuestion];
                const correctAnswer = q.a[q.c];
                
                // TAMPILKAN PENJELASAN LENGKAP
                const explanationBox = document.getElementById('explanationBox');
                if (explanationBox) {
                    explanationBox.classList.add('time-up');
                }
                
                showExplanation(`⏰ <strong>Waktu habis!</strong><br><br>Jawaban yang benar adalah: <strong>${correctAnswer}</strong><br><br>${currentExplanation}`);
                
                showStatus("⏰ Waktu habis! -50 poin", "danger");
                
                // Highlight correct answer
                const buttons = document.querySelectorAll('.answer-btn-mobile');
                buttons.forEach(btn => {
                    btn.style.pointerEvents = 'none';
                    if (parseInt(btn.dataset.index) === q.c) {
                        btn.classList.add('correct');
                    }
                });
                
                // Next question after delay
                setTimeout(() => {
                    currentQuestion = (currentQuestion + 1) % questions.length;
                    isAnswering = false;
                    updateUI();
                    updateCharacter();
                    
                    if (!gameOver) {
                        loadQuestion();
                        startQuestionTimer();
                    }
                }, 4000);
            }
        }
    }, 1000);
}

// ==============================
// UI UPDATE FUNCTIONS
// ==============================
function updateUI() {
    // Update score
    document.getElementById('score').textContent = score;
    
    // Update level
    document.getElementById('level').textContent = level;
    
    // Update evolution stage
    document.getElementById('evoStage').textContent = `${evo + 1}/${stages.length}`;
    
    // Update progress bars
    const evoProgress = ((evo + 1) / stages.length) * 100;
    document.getElementById('mobileEvoProgress').style.width = `${evoProgress}%`;
    
    // Update timeline progress
    updateTimelineProgress();
    
    // Update hint count
    document.getElementById('mobileHintCount').textContent = hintsRemaining;
}

function updateTimelineProgress() {
    const timelineContainer = document.querySelector('.timeline-track');
    if (!timelineContainer) return;
    
    // Calculate progress percentage
    const progressPercentage = (evo / (stages.length - 1)) * 100;
    document.getElementById('timelineProgressMobile').style.width = `${progressPercentage}%`;
    
    // Update active steps
    document.querySelectorAll('.timeline-step-mobile').forEach((step, index) => {
        if (index <= evo) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function showStatus(message, type = "info") {
    const statusBox = document.getElementById('statusBox');
    const statusText = document.getElementById('status');
    
    if (statusText) {
        statusText.textContent = message;
        statusText.style.color = {
            success: '#00d4aa',
            danger: '#ff4757',
            warning: '#ffb347',
            info: '#00d4ff'
        }[type] || '#ffffff';
    }
    
    // Update status icon
    const statusIcon = document.querySelector('.status-content-mobile i');
    if (statusIcon) {
        switch(type) {
            case 'success': statusIcon.className = 'fas fa-check-circle'; break;
            case 'danger': statusIcon.className = 'fas fa-times-circle'; break;
            case 'warning': statusIcon.className = 'fas fa-exclamation-triangle'; break;
            default: statusIcon.className = 'fas fa-info-circle';
        }
        statusIcon.style.color = statusText.style.color;
    }
}

// ==============================
// GAME CONTROL FUNCTIONS
// ==============================
function togglePause() {
    if (gameOver) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        clearInterval(gameTimerInterval);
        clearInterval(questionTimerInterval);
        document.getElementById('pauseText').textContent = "Lanjutkan Game";
        showToast("⏸️ Game dijeda", "warning");
        
        // Pause BGM
        if (bgmAudio) {
            bgmAudio.pause();
        }
    } else {
        startGameTimer();
        startQuestionTimer();
        document.getElementById('pauseText').textContent = "Jeda Game";
        showToast("▶️ Game dilanjutkan", "success");
        
        // Resume BGM
        if (soundEnabled && bgmAudio) {
            bgmAudio.play().catch(e => console.log("BGM resume error:", e));
        }
    }
    
    closeGameMenu();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    
    if (soundEnabled) {
        showToast("🔊 Sound ON", "success");
        playSound('bgm');
    } else {
        showToast("🔇 Sound OFF", "warning");
        stopBGM();
    }
    
    // Update sound button icon
    const soundIcons = document.querySelectorAll('.fa-volume-up');
    soundIcons.forEach(icon => {
        if (soundEnabled) {
            icon.className = 'fas fa-volume-up';
        } else {
            icon.className = 'fas fa-volume-mute';
        }
    });
    
    // Update sound status text
    const soundStatus = document.getElementById('soundStatusMenu');
    if (soundStatus) {
        soundStatus.textContent = soundEnabled ? "ON" : "OFF";
    }
}

function backToMenu() {
    if (gameStarted && !gameOver) {
        if (confirm("Kembali ke menu? Game saat ini akan hilang.")) {
            gameStarted = false;
            clearInterval(gameTimerInterval);
            clearInterval(questionTimerInterval);
            stopBGM();
            showScreen('menu');
        }
    } else {
        stopBGM();
        showScreen('menu');
    }
}

// ==============================
// MOBILE MENU FUNCTIONS
// ==============================
function openMobileMenu() {
    document.getElementById('mobileMenu').classList.add('open');
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
}

function toggleGameMenu() {
    const gameMenu = document.getElementById('mobileGameMenu');
    gameMenu.classList.toggle('open');
}

function closeGameMenu() {
    document.getElementById('mobileGameMenu').classList.remove('open');
}

function toggleControls() {
    const controlsInfo = document.getElementById('mobileControlsInfo');
    const toggleBtn = document.getElementById('controlsToggle');
    const icon = toggleBtn.querySelector('i');
    
    controlsInfo.classList.toggle('open');
    toggleBtn.classList.toggle('active');
    
    if (icon.classList.contains('fa-chevron-down')) {
        icon.className = 'fas fa-chevron-up';
    } else {
        icon.className = 'fas fa-chevron-down';
    }
}

// ==============================
// KEYBOARD CONTROLS
// ==============================
function handleKeyPress(e) {
    if (!gameStarted || isAnswering || isPaused || gameOver) return;
    
    const key = e.key.toLowerCase();
    
    // Number keys 1-5 for answers
    if (key >= '1' && key <= '5') {
        const index = parseInt(key) - 1;
        const buttons = document.querySelectorAll('.answer-btn-mobile');
        if (buttons[index]) {
            buttons[index].click();
        }
    }
    
    // Letter keys for game controls
    switch(key) {
        case 'h':
            useHint();
            break;
        case 'm':
            toggleSound();
            break;
        case 'p':
        case ' ':
            if (e.target.tagName !== 'INPUT') {
                togglePause();
            }
            break;
        case 's':
            skipQuestion();
            break;
    }
}

// ==============================
// NETWORK DETECTION
// ==============================
function setupNetworkDetection() {
    const networkStatus = document.createElement('div');
    networkStatus.className = 'network-status';
    networkStatus.id = 'networkStatus';
    document.body.appendChild(networkStatus);
    
    function updateNetworkStatus() {
        const isOnline = navigator.onLine;
        const statusEl = document.getElementById('networkStatus');
        
        if (isOnline) {
            statusEl.textContent = '📶 Online';
            statusEl.className = 'network-status online';
        } else {
            statusEl.textContent = '📴 Offline';
            statusEl.className = 'network-status offline';
        }
        
        // Show for 3 seconds then hide
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 3000);
    }
    
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    // Initial update
    setTimeout(updateNetworkStatus, 1000);
}

// ==============================
// RESULT & RANKING FUNCTIONS
// ==============================
function endGame() {
    gameOver = true;
    gameStarted = false;
    
    clearInterval(gameTimerInterval);
    clearInterval(questionTimerInterval);
    
    // Stop BGM
    stopBGM();
    
    // Calculate final score
    const timeBonus = Math.floor(timeLeft / 10) * 15;
    score += timeBonus;
    
    // Determine result title
    let resultTitle = "";
    let badgeColor = "";
    
    if (score >= 1500) {
        resultTitle = "EVOLUSI LEGENDA! 🏆";
        badgeColor = "linear-gradient(135deg, #FFD700, #FFA500)";
    } else if (score >= 1000) {
        resultTitle = "EVOLUSI MASTER! 🥇";
        badgeColor = "linear-gradient(135deg, #C0C0C0, #808080)";
    } else if (score >= 600) {
        resultTitle = "PINTAR SEKALI! 🥈";
        badgeColor = "linear-gradient(135deg, #CD7F32, #8B4513)";
    } else if (score >= 300) {
        resultTitle = "LUMAYAN BAIK! 🎯";
        badgeColor = "linear-gradient(135deg, var(--primary), var(--secondary))";
    } else {
        resultTitle = "PERLU BELAJAR LAGI! 📚";
        badgeColor = "linear-gradient(135deg, var(--gray), #495057)";
    }
    
    // Update result screen
    document.getElementById('resultTitleMobile').innerHTML = `<h3>${resultTitle}</h3>`;
    document.getElementById('resultSubtitle').textContent = `Skor akhir: ${score}`;
    document.getElementById('resultName').textContent = playerName;
    document.getElementById('resultScore').textContent = score;
    document.getElementById('resultStage').textContent = stages[evo].name;
    
    // Update badge color
    const resultBadge = document.getElementById('resultBadgeMobile');
    if (resultBadge) {
        resultBadge.style.background = badgeColor;
    }
    
    // Tampilkan penjelasan materi setelah waktu habis
    showMaterialAfterTimeUp();
    
    // Auto-calculate rank
    updateRankInResult();
    
    // Show result screen
    showScreen('result');
    
    // Auto-save score after 2 seconds
    setTimeout(() => {
        autoSaveScore();
    }, 2000);
}

// ==============================
// MATERI FUNCTIONS
// ==============================
function showMaterialAfterTimeUp() {
    // Load material seperti biasa
    loadMaterialContent();
    
    // Tampilkan pesan khusus tentang penjelasan materi
    showToast("📚 Materi evolusi telah tersedia di bawah!", "info");
    
    // Auto-expand material section
    setTimeout(() => {
        const materialContent = document.getElementById('materialContentMobile');
        const collapseBtn = document.getElementById('collapseMaterialBtn');
        const icon = collapseBtn.querySelector('i');
        
        if (materialContent && !materialContent.classList.contains('open')) {
            materialContent.classList.add('open');
            collapseBtn.classList.add('active');
            icon.className = 'fas fa-chevron-up';
            
            // Scroll ke materi
            setTimeout(() => {
                materialContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
    }, 1000);
}

function loadMaterialContent() {
    const materialContent = document.getElementById('materialContentMobile');
    if (!materialContent) return;
    
    let html = '';
    
    // Header dengan pesan khusus
    html += `
        <div class="material-header-note">
            <i class="fas fa-clock"></i>
            <p><strong>Waktu permainan telah habis!</strong> Berikut adalah materi evolusi yang telah Anda pelajari selama permainan:</p>
        </div>
    `;
    
    stages.forEach((stage, index) => {
        if (index <= evo) {
            // Tambahan: Info berapa soal yang dijawab dengan benar untuk tahap ini
            const stageQuestions = questions.filter(q => 
                q.difficulty === index + 1 || 
                (index === 0 && q.difficulty === 1) ||
                (index === 5 && q.difficulty >= 3)
            );
            
            html += `
                <div class="material-item-mobile ${index === evo ? 'current-stage' : ''}">
                    <div class="material-stage-header">
                        <h4><i class="fas fa-dna"></i> Tahap ${index + 1}: ${stage.name}</h4>
                        <span class="stage-status">${index === evo ? '🏁 Tahap terakhir' : '✅ Telah berevolusi'}</span>
                    </div>
                    <p class="stage-period"><i class="fas fa-calendar-alt"></i> ${stage.period}</p>
                    <p class="stage-desc">${stage.desc}</p>
                    
                    <div class="stage-achievements">
                        <div class="achievement-badge">
                            <i class="fas fa-brain"></i>
                            <span>${stageQuestions.length} soal terkait</span>
                        </div>
                        <div class="achievement-badge">
                            <i class="fas fa-check-circle"></i>
                            <span>${Math.floor((index + 1) * 250)} poin</span>
                        </div>
                    </div>
                    
                    <div class="material-facts">
                        <div class="facts-header">
                            <i class="fas fa-graduation-cap"></i>
                            <strong>Fakta penting yang telah dipelajari:</strong>
                        </div>
                        <ul>
                            ${stage.facts.map(fact => `<li>${fact}</li>`).join('')}
                        </ul>
                    </div>
                    
                    ${index === evo && evo < stages.length - 1 ? `
                        <div class="next-stage-info">
                            <i class="fas fa-arrow-right"></i>
                            <p>Untuk berevolusi ke <strong>${stages[evo + 1].name}</strong>, butuh <strong>${(evo + 2) * 250 - score}</strong> poin lagi!</p>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    });
    
    // Tips belajar
    html += `
        <div class="learning-tips">
            <div class="tips-header">
                <i class="fas fa-lightbulb"></i>
                <h4>Tips Belajar Evolusi Manusia</h4>
            </div>
            <div class="tips-content">
                <p>Untuk meningkatkan pemahaman tentang evolusi manusia:</p>
                <ul>
                    <li>Perhatikan <strong>urutan kronologis</strong> dari Kera Purba ke Manusia Modern</li>
                    <li>Hafalkan <strong>ciri khas</strong> setiap tahap evolusi</li>
                    <li>Pahami <strong>penemuan penting</strong> seperti alat batu, api, dan seni</li>
                    <li>Pelajari <strong>fosil terkenal</strong> seperti Lucy (Australopithecus)</li>
                </ul>
                <div class="tips-note">
                    <i class="fas fa-bullseye"></i>
                    <p><strong>Strategi game:</strong> Fokus pada jawaban cepat (bonus waktu) dan pertahankan streak 5 jawaban benar untuk bonus besar!</p>
                </div>
            </div>
        </div>
    `;
    
    materialContent.innerHTML = html;
}

function toggleMaterial() {
    const materialContent = document.getElementById('materialContentMobile');
    const collapseBtn = document.getElementById('collapseMaterialBtn');
    const icon = collapseBtn.querySelector('i');
    
    materialContent.classList.toggle('open');
    collapseBtn.classList.toggle('active');
    
    if (icon.classList.contains('fa-chevron-down')) {
        icon.className = 'fas fa-chevron-up';
    } else {
        icon.className = 'fas fa-chevron-down';
    }
}

function showEvolutionInfo() {
    const currentStage = stages[evo];
    showToast(`🧬 ${currentStage.name}: ${currentStage.desc}`, "info");
}

function updateMaterialContent() {
    loadMaterialContent();
}

// ==============================
// RANKING FUNCTIONS
// ==============================
function showResult() {
    updateMaterialContent();
}

async function loadRanking() {
    const filter = document.querySelector('.filter-chip.active')?.dataset.filter || 'all';
    
    // Show loading
    const rankingList = document.getElementById('rankingListMobile');
    rankingList.innerHTML = `
        <div class="loading-ranking">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Memuat ranking...</p>
        </div>
    `;
    
    try {
        let rankingData = loadRankingFromLocalStorage(filter);
        
        // Update stats
        updateRankingStats(rankingData);
        
        // Update ranking list
        displayRankingList(rankingData);
        
    } catch (error) {
        console.error("Error loading ranking:", error);
        showToast("❌ Gagal memuat ranking", "danger");
        
        // Fallback
        const localData = loadRankingFromLocalStorage(filter);
        updateRankingStats(localData);
        displayRankingList(localData);
    }
}

function updateRankingStats(rankingData) {
    document.getElementById('totalPlayers').textContent = rankingData.length;
    
    if (rankingData.length > 0) {
        const highest = Math.max(...rankingData.map(r => r.score));
        const average = Math.round(rankingData.reduce((sum, r) => sum + r.score, 0) / rankingData.length);
        
        document.getElementById('highestScore').textContent = highest;
        document.getElementById('averageScore').textContent = average;
    } else {
        document.getElementById('highestScore').textContent = 0;
        document.getElementById('averageScore').textContent = 0;
    }
}

function displayRankingList(rankingData) {
    const rankingList = document.getElementById('rankingListMobile');
    
    if (rankingData.length === 0) {
        rankingList.innerHTML = `
            <div class="empty-ranking-mobile">
                <i class="fas fa-trophy"></i>
                <h3>Belum ada ranking</h3>
                <p>Mainkan game untuk tampil di sini!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    // Display top 15
    rankingData.slice(0, 15).forEach((player, index) => {
        let medal = "";
        let medalClass = "";
        
        if (index === 0) {
            medal = "🥇";
            medalClass = "gold";
        } else if (index === 1) {
            medal = "🥈";
            medalClass = "silver";
        } else if (index === 2) {
            medal = "🥉";
            medalClass = "bronze";
        } else {
            medal = (index + 1) + ".";
        }
        
        // Check if this is current player
        const isCurrentPlayer = player.name === playerName && Math.abs(player.score - score) < 10;
        const playerClass = isCurrentPlayer ? "current-player" : "";
        
        html += `
            <div class="ranking-item-mobile ${playerClass}">
                <div class="rank-medal-mobile ${medalClass}">${medal}</div>
                <div class="player-info-mobile">
                    <div class="player-name-mobile">
                        ${player.name}
                        ${isCurrentPlayer ? '<span class="you-badge">(Anda)</span>' : ''}
                    </div>
                    <div class="player-time-mobile">
                        ${player.date || 'Belum lama'}
                    </div>
                </div>
                <div class="player-score-mobile">${player.score}</div>
            </div>
        `;
    });
    
    // Add sync info
    const isOnline = navigator.onLine;
    
    html += `
        <div class="sync-info">
            <i class="fas fa-database"></i>
            <span>Ranking lokal | ${isOnline ? 'Online' : 'Offline'}</span>
        </div>
    `;
    
    rankingList.innerHTML = html;
}

function updateRankInResult() {
    // This will be updated after save
    document.getElementById('resultRank').textContent = "Menghitung...";
}

async function saveScore() {
    const playerData = {
        name: playerName,
        score: score,
        stage: stages[evo].name,
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers,
        timeLeft: timeLeft,
        version: "2.3"
    };
    
    // Show loading
    const saveBtn = document.getElementById('saveScoreBtn');
    const originalHTML = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    saveBtn.disabled = true;
    
    try {
        // Save to localStorage
        saveScoreToLocalStorage(playerData);
        showToast("📱 Skor disimpan secara lokal", "info");
        
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Tersimpan';
        saveBtn.disabled = true;
        
        // Refresh ranking
        setTimeout(() => {
            loadRanking();
        }, 1000);
        
        // Update rank display
        setTimeout(() => {
            document.getElementById('resultRank').textContent = "Diperbarui!";
        }, 500);
        
    } catch (error) {
        console.error("Error saving score:", error);
        saveBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Gagal';
        showToast("❌ Gagal menyimpan skor", "danger");
        
        setTimeout(() => {
            saveBtn.innerHTML = originalHTML;
            saveBtn.disabled = false;
        }, 2000);
    }
}

function autoSaveScore() {
    const playerData = {
        name: playerName,
        score: score,
        stage: stages[evo].name,
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers,
        timeLeft: timeLeft,
        version: "2.3"
    };
    
    try {
        // Save to localStorage
        saveScoreToLocalStorage(playerData);
        
        // Update rank display
        updateRankInResult();
        
    } catch (error) {
        console.error("Auto-save error:", error);
    }
}

function saveScoreToLocalStorage(playerData) {
    try {
        let ranking = JSON.parse(localStorage.getItem('evoGoksRanking')) || [];
        
        // Add local timestamp
        playerData.localTimestamp = Date.now();
        playerData.deviceId = getDeviceId();
        playerData.isOnline = false;
        
        ranking.push(playerData);
        
        // Keep only last 100 records
        if (ranking.length > 100) {
            ranking = ranking.slice(-100);
        }
        
        localStorage.setItem('evoGoksRanking', JSON.stringify(ranking));
        return true;
        
    } catch (error) {
        console.error("Error saving to localStorage:", error);
        return false;
    }
}

function loadRankingFromLocalStorage(filter = 'all') {
    try {
        let ranking = JSON.parse(localStorage.getItem('evoGoksRanking')) || [];
        
        // Filter data
        const now = Date.now();
        if (filter !== 'all') {
            ranking = ranking.filter(player => {
                const playerTime = player.localTimestamp || player.timestamp || 0;
                const timeDiff = now - playerTime;
                
                switch(filter) {
                    case 'today':
                        return timeDiff < 24 * 60 * 60 * 1000;
                    case 'week':
                        return timeDiff < 7 * 24 * 60 * 60 * 1000;
                    case 'month':
                        return timeDiff < 30 * 24 * 60 * 60 * 1000;
                    default:
                        return true;
                }
            });
        }
        
        // Format date
        ranking = ranking.map(player => ({
            ...player,
            date: player.localTimestamp ? 
                new Date(player.localTimestamp).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : 'Tanggal tidak tersedia',
            isOnline: false
        }));
        
        // Sort by score
        return ranking.sort((a, b) => b.score - a.score);
        
    } catch (error) {
        console.error("Error loading from localStorage:", error);
        return [];
    }
}

function getDeviceId() {
    let deviceId = localStorage.getItem('evoGoks_deviceId');
    
    if (!deviceId) {
        // Generate unique ID
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('evoGoks_deviceId', deviceId);
    }
    
    return deviceId;
}

function clearLocalRanking() {
    if (confirm("Hapus semua data ranking lokal? Data tidak dapat dikembalikan.")) {
        localStorage.removeItem('evoGoksRanking');
        showToast("🗑️ Data ranking lokal dihapus", "info");
        loadRanking();
    }
}

// ==============================
// UTILITY FUNCTIONS
// ==============================
function showRules() {
    showScreen('rules');
}

function showRanking() {
    showScreen('ranking');
}

function showToast(message, type = "info") {
    const toast = document.getElementById('toast');
    const toastMessage = document.querySelector('.toast-message');
    const toastIcon = document.querySelector('.toast-icon');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    
    // Set icon based on type
    let iconClass = 'fas fa-info-circle';
    switch(type) {
        case 'success': iconClass = 'fas fa-check-circle'; break;
        case 'warning': iconClass = 'fas fa-exclamation-triangle'; break;
        case 'error': iconClass = 'fas fa-times-circle'; break;
    }
    
    toastIcon.className = `${iconClass} toast-icon`;
    
    // Show toast
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }, 3000);
}

// ==============================
// EVENT LISTENERS SETUP
// ==============================
function setupEventListeners() {
    console.log("Setting up event listeners...");
    
    // Menu buttons
    document.getElementById('startBtn')?.addEventListener('click', startGame);
    document.getElementById('rankingBtn')?.addEventListener('click', showRanking);
    document.getElementById('rulesBtn')?.addEventListener('click', showRules);
    document.getElementById('playerName')?.addEventListener('input', function() {
        playerName = this.value || "Player";
    });
    
    // Kontrol animasi karakter
    const animationToggle = document.getElementById('animationToggle');
    if (animationToggle) {
        animationToggle.addEventListener('change', toggleCharacterAnimation);
    }
    
    // Mobile menu
    document.getElementById('mobileMenuBtn')?.addEventListener('click', openMobileMenu);
    document.getElementById('closeMenuBtn')?.addEventListener('click', closeMobileMenu);
    document.getElementById('mobileSoundBtn')?.addEventListener('click', toggleSound);
    document.getElementById('soundToggleMenu')?.addEventListener('click', toggleSound);
    
    // Game controls
    document.getElementById('backGameBtn')?.addEventListener('click', backToMenu);
    document.getElementById('mobileGameMenuBtn')?.addEventListener('click', toggleGameMenu);
    document.getElementById('pauseGameBtn')?.addEventListener('click', togglePause);
    document.getElementById('hintGameBtn')?.addEventListener('click', useHint);
    document.getElementById('soundGameBtn')?.addEventListener('click', toggleSound);
    document.getElementById('backToMenuBtnGame')?.addEventListener('click', backToMenu);
    
    // Mobile quick actions
    document.getElementById('mobileHintBtn')?.addEventListener('click', useHint);
    document.getElementById('mobilePauseBtn')?.addEventListener('click', togglePause);
    document.getElementById('mobileSkipBtn')?.addEventListener('click', skipQuestion);
    
    // Navigation buttons
    document.getElementById('backFromRankingMobile')?.addEventListener('click', () => showScreen('menu'));
    document.getElementById('backFromRules')?.addEventListener('click', () => showScreen('menu'));
    document.getElementById('refreshRanking')?.addEventListener('click', loadRanking);
    document.getElementById('clearLocalRanking')?.addEventListener('click', clearLocalRanking);
    
    // Result buttons
    document.getElementById('playAgainBtn')?.addEventListener('click', startGame);
    document.getElementById('saveScoreBtn')?.addEventListener('click', saveScore);
    document.getElementById('backToMenuBtnResult')?.addEventListener('click', () => showScreen('menu'));
    
    // Controls toggle
    document.getElementById('controlsToggle')?.addEventListener('click', toggleControls);
    
    // Material collapse
    document.getElementById('collapseMaterialBtn')?.addEventListener('click', toggleMaterial);
    document.getElementById('evolutionInfoTouch')?.addEventListener('click', showEvolutionInfo);
    
    // Filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            loadRanking();
        });
    });
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyPress);
    
    // Mobile menu options
    document.querySelectorAll('.mobile-menu-option[data-action]').forEach(option => {
        option.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            switch(action) {
                case 'start': startGame(); break;
                case 'ranking': showRanking(); break;
                case 'rules': showRules(); break;
                case 'about': 
                    showToast("Evo Goks v2.3 - Game Edukasi Evolusi Manusia dengan Animasi & Materi Lengkap", "info"); 
                    break;
            }
            closeMobileMenu();
        });
    });
    
    // Network status click
    document.getElementById('networkStatus')?.addEventListener('click', function() {
        loadRanking();
    });
    
    console.log("Event listeners setup complete");
}

// ==============================
// STARTUP
// ==============================
// Initialize game when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // DOM already loaded
    setTimeout(initGame, 100);
}

// Fallback initialization
window.addEventListener('load', function() {
    console.log("📱 Evo Goks v2.3 Loaded");
    
    // Check if loading is stuck
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            console.log("Auto-showing menu due to timeout");
            loadingScreen.classList.add('hidden');
            const menuScreen = document.getElementById('menuScreen');
            if (menuScreen) {
                menuScreen.classList.remove('hidden');
                initializeAudio();
                setupEventListeners();
                updateCharacter();
                startCharacterAnimation();
                if (soundEnabled) {
                    playSound('bgm');
                }
            }
        }
    }, 3000);
});

// Debug functions for testing
window.debugEvoGoks = {
    resetRanking: function() {
        localStorage.removeItem('evoGoksRanking');
        localStorage.removeItem('evoGoks_syncQueue');
        showToast("Ranking telah direset", "warning");
        loadRanking();
    },
    addTestScores: function() {
        const testScores = [
            {name: "Player1", score: 1500, stage: "Manusia Modern", date: "01/02/2024"},
            {name: "Player2", score: 1200, stage: "Homo Sapiens", date: "02/02/2024"},
            {name: "Player3", score: 800, stage: "Homo Erectus", date: "03/02/2024"},
            {name: "Player4", score: 500, stage: "Homo Habilis", date: "03/02/2024"},
            {name: "Player5", score: 300, stage: "Australopithecus", date: "03/02/2024"}
        ];
        
        let ranking = JSON.parse(localStorage.getItem('evoGoksRanking')) || [];
        ranking.push(...testScores);
        localStorage.setItem('evoGoksRanking', JSON.stringify(ranking));
        showToast("Test scores added", "info");
        loadRanking();
    },
    setEvo: function(evoLevel) {
        if (evoLevel >= 0 && evoLevel < stages.length) {
            evo = evoLevel;
            updateCharacter();
            updateUI();
            showToast(`Evo set to ${stages[evo].name}`, "info");
        }
    },
    toggleAnimation: function() {
        const toggle = document.getElementById('animationToggle');
        if (toggle) {
            toggle.checked = !toggle.checked;
            toggleCharacterAnimation();
        }
    }
};