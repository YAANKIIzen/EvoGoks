// ==============================
// FIREBASE CONFIGURATION
// ==============================
const firebaseConfig = {
  apiKey: "AIzaSyAzREQ3mlM-CPbgMIzJFbtO8lnPEfXz70Q",
  authDomain: "evo-goks-global-ranking.firebaseapp.com",
  databaseURL: "https://evo-goks-global-ranking-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "evo-goks-global-ranking",
  storageBucket: "evo-goks-global-ranking.firebasestorage.app",
  messagingSenderId: "1073317748722",
  appId: "1:1073317748722:web:f4c392c955d7357f78956b",
  measurementId: "G-29C84663QE"
};

// ==============================
// GAME VARIABLES
// ==============================
let gameStarted = false;
let gameOver = false;
let isPaused = false;
let isAnswering = false;
let score = 0;
let timeLeft = 180;
let evo = 0;
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

// Firebase Variables
let firebaseApp = null;
let database = null;
let isFirebaseConnected = false;
let globalRankingListener = null;

// Audio Elements
let bgmAudio, correctSound, wrongSound, evolveSound, warningSound;

// ==============================
// GAME DATA
// ==============================
const stages = [
    {
        name: "Kera Purba",
        desc: "Cikal bakal primata manusia (15 juta tahun lalu)",
        image: "assets/characters/stage1_ape.png",
        bg: "assets/bg/jungle.png",
        color: "#8B4513",
        facts: ["Hidup di hutan Afrika", "Berjalan dengan 4 kaki", "Memakan buah dan daun", "Hidup berkelompok"],
        period: "15 juta tahun lalu"
    },
    {
        name: "Australopithecus",
        desc: "Manusia kera yang sudah berjalan tegak (4 juta tahun lalu)",
        image: "assets/characters/stage2_australo.png",
        bg: "assets/bg/savanna.png",
        color: "#A0522D",
        facts: ["Fosil Lucy terkenal", "Berjalan dengan 2 kaki", "Tinggi sekitar 1.2 meter", "Otak kecil (400-500 cc)"],
        period: "4 juta tahun lalu"
    },
    {
        name: "Homo Habilis",
        desc: "Manusia purba pembuat alat batu (2.5 juta tahun lalu)",
        image: "assets/characters/stage3_habilis.PNG",
        bg: "assets/bg/cave.png",
        color: "#CD853F",
        facts: ["Pembuat alat batu pertama", "Otak lebih besar (600-700 cc)", "Pengumpul makanan", "Hidup di savana"],
        period: "2.5 juta tahun lalu"
    },
    {
        name: "Homo Erectus",
        desc: "Manusia purba penjelajah pertama (1.8 juta tahun lalu)",
        image: "assets/characters/stage4_erectus.png",
        bg: "assets/bg/fire.png",
        color: "#D2691E",
        facts: ["Manusia pertama keluar Afrika", "Pengguna api pertama", "Pemburu terampil", "Tinggi hingga 1.8 meter"],
        period: "1.8 juta tahun lalu"
    },
    {
        name: "Homo Sapiens",
        desc: "Manusia modern awal (300.000 tahun lalu)",
        image: "assets/characters/stage5_sapiens.PNG",
        bg: "assets/bg/cave.png",
        color: "#DEB887",
        facts: ["Otak besar (1200-1400 cc)", "Pembuat seni gua", "Penguburan jenazah", "Alat dari tulang"],
        period: "300.000 tahun lalu"
    },
    {
        name: "Manusia Modern",
        desc: "Manusia dengan peradaban maju (10.000 tahun lalu - sekarang)",
        image: "assets/characters/stage6_modern.PNG",
        bg: "assets/bg/city.png",
        color: "#F5DEB3",
        facts: ["Bercocok tanam", "Membangun kota", "Teknologi maju", "Bahasa kompleks"],
        period: "10.000 tahun lalu - sekarang"
    }
];

const questions = [
    {
        q: "Tahap evolusi manusia yang paling primitif adalah...",
        a: ["Homo Sapiens", "Kera Purba", "Australopithecus", "Homo Erectus", "Homo Habilis"],
        c: 1,
        explanation: "Kera Purba adalah tahap paling primitif dalam evolusi manusia, hidup sekitar 15 juta tahun lalu.",
        category: "Evolusi Dasar",
        difficulty: 1
    },
    {
        q: "Manusia yang pertama kali membuat alat batu disebut...",
        a: ["Homo Sapiens", "Homo Habilis", "Homo Erectus", "Australopithecus", "Kera Purba"],
        c: 1,
        explanation: "Homo Habilis disebut 'manusia terampil' karena pertama kali membuat alat batu sederhana.",
        category: "Perkembangan Alat",
        difficulty: 2
    },
    {
        q: "Manusia pertama yang keluar dari Afrika adalah...",
        a: ["Homo Sapiens", "Homo Habilis", "Homo Erectus", "Kera Purba", "Neanderthal"],
        c: 2,
        explanation: "Homo Erectus adalah manusia purba pertama yang bermigrasi keluar dari Afrika.",
        category: "Migrasi",
        difficulty: 3
    },
    {
        q: "Fosil manusia purba 'Lucy' termasuk dalam spesies...",
        a: ["Homo Sapiens", "Homo Habilis", "Australopithecus", "Homo Erectus", "Homo Neanderthalensis"],
        c: 2,
        explanation: "Lucy adalah fosil Australopithecus afarensis yang ditemukan di Ethiopia tahun 1974.",
        category: "Fosil Penting",
        difficulty: 2
    },
    {
        q: "Manusia pertama yang menggunakan api adalah...",
        a: ["Homo Sapiens", "Homo Habilis", "Homo Erectus", "Kera Purba", "Neanderthal"],
        c: 2,
        explanation: "Homo Erectus adalah manusia pertama yang menggunakan api sekitar 1.7 juta tahun lalu.",
        category: "Teknologi Api",
        difficulty: 3
    },
    {
        q: "Otak terbesar dimiliki oleh...",
        a: ["Homo Habilis", "Homo Erectus", "Homo Sapiens", "Australopithecus", "Homo Neanderthalensis"],
        c: 2,
        explanation: "Homo Sapiens memiliki otak terbesar (1200-1400 cc).",
        category: "Anatomi",
        difficulty: 2
    }
];

// ==============================
// FIREBASE INITIALIZATION
// ==============================
function initializeFirebase() {
    try {
        if (typeof firebase !== 'undefined' && !firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
            database = firebase.database();
            
            const connectedRef = database.ref('.info/connected');
            connectedRef.on('value', (snap) => {
                isFirebaseConnected = snap.val();
                updateFirebaseConnectionStatus();
                
                if (isFirebaseConnected) {
                    console.log("🔥 Firebase Connected!");
                    setupPlayerPresence();
                }
            });
            
            return true;
        } else if (firebase.apps.length) {
            database = firebase.database();
            return true;
        }
    } catch (error) {
        console.error("Firebase Error:", error);
        return false;
    }
}

// ==============================
// PLAYER PRESENCE
// ==============================
function setupPlayerPresence() {
    if (!database || !playerName) return;
    
    try {
        const playerId = getDeviceId();
        const presenceRef = database.ref(`presence/${playerId}`);
        
        presenceRef.set({
            name: playerName,
            timestamp: Date.now(),
            status: 'online',
            score: score,
            stage: stages[evo].name,
            device: /Mobile/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
        });
        
        presenceRef.onDisconnect().remove();
        updateOnlinePlayersCount();
        
    } catch (error) {
        console.error("Presence Error:", error);
    }
}

function updateOnlinePlayersCount() {
    if (!database) return;
    
    database.ref('presence').on('value', (snapshot) => {
        const players = snapshot.val();
        const onlineCount = players ? Object.keys(players).length : 0;
        document.getElementById('globalTotalPlayers').textContent = onlineCount;
        
        const statusEl = document.getElementById('firebaseStatus');
        if (statusEl) {
            statusEl.innerHTML = `<i class="fas fa-circle"></i> ${onlineCount} pemain online`;
            statusEl.className = 'connection-status connected';
        }
    });
}

// ==============================
// GLOBAL RANKING FUNCTIONS
// ==============================
function saveScoreToGlobal(playerData) {
    if (!database || !isFirebaseConnected) {
        showToast("📱 Offline - Skor disimpan lokal", "warning");
        return saveScoreToLocalStorage(playerData);
    }
    
    try {
        const playerId = getDeviceId();
        const timestamp = Date.now();
        
        const scoreData = {
            name: playerData.name,
            score: playerData.score,
            stage: playerData.stage,
            correctAnswers: playerData.correctAnswers || 0,
            wrongAnswers: playerData.wrongAnswers || 0,
            timestamp: timestamp,
            date: new Date(timestamp).toISOString(),
            deviceId: playerId,
            version: "3.0"
        };
        
        // Save to global ranking
        database.ref('globalRanking').child(playerId).set(scoreData);
        
        // Save to daily ranking
        const today = new Date().toISOString().split('T')[0];
        database.ref(`dailyRanking/${today}/${playerId}`).set(scoreData);
        
        // Save to weekly ranking
        const weekNumber = getWeekNumber(new Date());
        database.ref(`weeklyRanking/${weekNumber}/${playerId}`).set(scoreData);
        
        // Save to monthly ranking
        const monthYear = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        database.ref(`monthlyRanking/${monthYear}/${playerId}`).set(scoreData);
        
        showToast("🌍 Skor tersimpan ke ranking global!", "success");
        
        if (!document.getElementById('globalRankingModal').classList.contains('hidden')) {
            loadGlobalRanking();
        }
        
        return true;
        
    } catch (error) {
        console.error("Global Save Error:", error);
        showToast("❌ Gagal menyimpan ke server", "error");
        return saveScoreToLocalStorage(playerData);
    }
}

function loadGlobalRanking(filter = 'all') {
    if (!database || !isFirebaseConnected) {
        showGlobalRankingOffline();
        return;
    }
    
    const rankingList = document.getElementById('globalRankingList');
    rankingList.innerHTML = `<div class="loading-ranking"><i class="fas fa-spinner fa-spin"></i><p>Memuat ranking global...</p></div>`;
    
    try {
        let queryRef;
        
        switch(filter) {
            case 'today':
                const today = new Date().toISOString().split('T')[0];
                queryRef = database.ref(`dailyRanking/${today}`);
                break;
            case 'week':
                const weekNumber = getWeekNumber(new Date());
                queryRef = database.ref(`weeklyRanking/${weekNumber}`);
                break;
            case 'month':
                const monthYear = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
                queryRef = database.ref(`monthlyRanking/${monthYear}`);
                break;
            default:
                queryRef = database.ref('globalRanking');
        }
        
        if (globalRankingListener) {
            queryRef.off('value', globalRankingListener);
        }
        
        globalRankingListener = queryRef.orderByChild('score').limitToLast(50);
        globalRankingListener.on('value', (snapshot) => {
            const rankingData = [];
            snapshot.forEach((childSnapshot) => {
                rankingData.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            rankingData.sort((a, b) => b.score - a.score);
            
            updateGlobalRankingStats(rankingData);
            displayGlobalRankingList(rankingData);
            showPlayerGlobalRank(rankingData);
            
            document.getElementById('globalLastUpdate').textContent = 
                new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        });
        
    } catch (error) {
        console.error("Load Ranking Error:", error);
        showGlobalRankingOffline();
    }
}

function displayGlobalRankingList(rankingData) {
    const rankingList = document.getElementById('globalRankingList');
    const playerId = getDeviceId();
    
    if (rankingData.length === 0) {
        rankingList.innerHTML = `
            <div class="empty-ranking-mobile">
                <i class="fas fa-globe-asia"></i>
                <h3>Belum ada pemain</h3>
                <p>Jadilah yang pertama bermain!</p>
                <button onclick="window.startGame()" class="menu-btn primary" style="margin-top: 1rem;">
                    <i class="fas fa-play"></i> Main Sekarang
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    let rank = 1;
    
    rankingData.slice(0, 20).forEach((player) => {
        const isCurrentPlayer = player.deviceId === playerId || player.id === playerId;
        let medal = '';
        let medalClass = '';
        
        if (rank === 1) { medal = '🥇'; medalClass = 'gold'; }
        else if (rank === 2) { medal = '🥈'; medalClass = 'silver'; }
        else if (rank === 3) { medal = '🥉'; medalClass = 'bronze'; }
        else { medal = `${rank}.`; }
        
        const initials = player.name ? player.name.substring(0, 2).toUpperCase() : '??';
        const playTime = player.timestamp ? 
            new Date(player.timestamp).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) 
            : 'Baru saja';
        
        html += `
            <div class="global-ranking-item ${isCurrentPlayer ? 'current-player' : ''}">
                <div class="rank-badge ${medalClass}">${medal}</div>
                <div class="player-avatar">${initials}</div>
                <div class="player-detail">
                    <div class="player-name-global">
                        ${escapeHtml(player.name || 'Player')}
                        ${isCurrentPlayer ? '<span class="player-badge">Anda</span>' : ''}
                    </div>
                    <div class="player-stage">
                        <i class="fas fa-dna"></i> ${player.stage || 'Kera Purba'}
                        <span style="margin-left: 0.5rem;"><i class="fas fa-clock"></i> ${playTime}</span>
                    </div>
                </div>
                <div class="player-score-global">${player.score}</div>
            </div>
        `;
        
        rank++;
    });
    
    rankingList.innerHTML = html;
}

function showPlayerGlobalRank(rankingData) {
    const playerId = getDeviceId();
    const playerRankCard = document.getElementById('playerGlobalRank');
    
    const playerIndex = rankingData.findIndex(p => p.deviceId === playerId || p.id === playerId);
    
    if (playerIndex !== -1) {
        const player = rankingData[playerIndex];
        const rank = playerIndex + 1;
        
        playerRankCard.innerHTML = `
            <div class="rank-position">
                <span>#${rank}</span>
                <span>Rank</span>
            </div>
            <div class="rank-info">
                <h4>${escapeHtml(player.name || 'Player')}</h4>
                <p><i class="fas fa-star"></i> Skor: ${player.score}</p>
            </div>
            <button onclick="window.shareGlobalScore()" class="share-score-btn" style="padding: 0.6rem 1rem;">
                <i class="fas fa-share-alt"></i>
            </button>
        `;
    } else {
        playerRankCard.innerHTML = `
            <div style="text-align: center; width: 100%; padding: 1rem;">
                <i class="fas fa-trophy" style="font-size: 2rem; color: var(--warning);"></i>
                <p>Mainkan game untuk masuk ranking global!</p>
                <button onclick="window.startGame(); closeGlobalRankingModal();" class="menu-btn primary" style="margin-top: 0.5rem;">
                    <i class="fas fa-play"></i> Main Sekarang
                </button>
            </div>
        `;
    }
}

function updateGlobalRankingStats(rankingData) {
    if (rankingData.length > 0) {
        document.getElementById('globalHighestScore').textContent = rankingData[0].score;
    }
}

function showGlobalRankingOffline() {
    const rankingList = document.getElementById('globalRankingList');
    rankingList.innerHTML = `
        <div class="empty-ranking-mobile">
            <i class="fas fa-wifi-slash"></i>
            <h3>Tidak terhubung ke server</h3>
            <p>Periksa koneksi internet Anda</p>
            <button onclick="window.loadGlobalRanking()" class="refresh-btn" style="margin-top: 1rem;">
                <i class="fas fa-sync-alt"></i> Coba Lagi
            </button>
        </div>
    `;
    
    const statusEl = document.getElementById('firebaseStatus');
    if (statusEl) {
        statusEl.innerHTML = '<i class="fas fa-circle"></i> Offline';
        statusEl.className = 'connection-status disconnected';
    }
}

function updateFirebaseConnectionStatus() {
    const statusEl = document.getElementById('firebaseStatus');
    if (!statusEl) return;
    
    if (isFirebaseConnected) {
        statusEl.innerHTML = '<i class="fas fa-circle"></i> Terhubung ke server global';
        statusEl.className = 'connection-status connected';
    } else {
        statusEl.innerHTML = '<i class="fas fa-circle"></i> Offline - menggunakan data lokal';
        statusEl.className = 'connection-status disconnected';
    }
}

// ==============================
// SHARE FUNCTIONS
// ==============================
function shareGlobalScore() {
    const playerId = getDeviceId();
    
    if (!database || !isFirebaseConnected) {
        shareLocalScore();
        return;
    }
    
    database.ref(`globalRanking/${playerId}`).once('value', (snapshot) => {
        const playerData = snapshot.val();
        
        if (playerData) {
            const shareText = `🎮 Saya mendapatkan skor ${playerData.score} di Evo Goks! Berevolusi menjadi ${playerData.stage}. Main yuk! 🌍`;
            
            if (navigator.share) {
                navigator.share({ title: 'Evo Goks', text: shareText, url: window.location.href })
                    .catch(() => copyToClipboard(shareText));
            } else {
                copyToClipboard(shareText);
            }
        } else {
            shareLocalScore();
        }
    });
}

function shareLocalScore() {
    const shareText = `🎮 Skor saya: ${score} di Evo Goks! ${stages[evo].name}. Main yuk! 🧬`;
    
    if (navigator.share) {
        navigator.share({ title: 'Evo Goks', text: shareText, url: window.location.href })
            .catch(() => copyToClipboard(shareText));
    } else {
        copyToClipboard(shareText);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast("📋 Tautan disalin ke clipboard!", "success");
    }).catch(() => {
        showToast("❌ Gagal menyalin", "error");
    });
}

// ==============================
// LOCAL STORAGE RANKING
// ==============================
function saveScoreToLocalStorage(playerData) {
    try {
        let ranking = JSON.parse(localStorage.getItem('evoGoksRanking')) || [];
        
        playerData.localTimestamp = Date.now();
        playerData.deviceId = getDeviceId();
        
        ranking.push(playerData);
        
        if (ranking.length > 100) {
            ranking = ranking.slice(-100);
        }
        
        localStorage.setItem('evoGoksRanking', JSON.stringify(ranking));
        return true;
        
    } catch (error) {
        console.error("Local Storage Error:", error);
        return false;
    }
}

function loadRankingFromLocalStorage(filter = 'all') {
    try {
        let ranking = JSON.parse(localStorage.getItem('evoGoksRanking')) || [];
        
        const now = Date.now();
        if (filter !== 'all') {
            ranking = ranking.filter(player => {
                const playerTime = player.localTimestamp || 0;
                const timeDiff = now - playerTime;
                
                switch(filter) {
                    case 'today': return timeDiff < 24 * 60 * 60 * 1000;
                    case 'week': return timeDiff < 7 * 24 * 60 * 60 * 1000;
                    case 'month': return timeDiff < 30 * 24 * 60 * 60 * 1000;
                    default: return true;
                }
            });
        }
        
        ranking = ranking.map(player => ({
            ...player,
            date: player.localTimestamp ? 
                new Date(player.localTimestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) 
                : 'Tanggal tidak tersedia'
        }));
        
        return ranking.sort((a, b) => b.score - a.score);
        
    } catch (error) {
        console.error("Load Local Error:", error);
        return [];
    }
}

function loadRanking() {
    const filter = document.querySelector('.filter-chip.active')?.dataset.filter || 'all';
    const rankingList = document.getElementById('rankingListMobile');
    
    rankingList.innerHTML = `<div class="loading-ranking"><i class="fas fa-spinner fa-spin"></i><p>Memuat ranking...</p></div>`;
    
    try {
        let rankingData = loadRankingFromLocalStorage(filter);
        
        document.getElementById('totalPlayers').textContent = rankingData.length;
        document.getElementById('highestScore').textContent = rankingData.length > 0 ? rankingData[0].score : 0;
        
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
        rankingData.slice(0, 15).forEach((player, index) => {
            let medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            let medalClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
            const isCurrentPlayer = player.name === playerName && Math.abs(player.score - score) < 10;
            
            html += `
                <div class="ranking-item-mobile ${isCurrentPlayer ? 'current-player' : ''}">
                    <div class="rank-medal-mobile ${medalClass}">${medal}</div>
                    <div class="player-info-mobile">
                        <div class="player-name-mobile">
                            ${escapeHtml(player.name || 'Player')}
                            ${isCurrentPlayer ? '<span class="you-badge">(Anda)</span>' : ''}
                        </div>
                        <div class="player-time-mobile">${player.date || 'Baru saja'}</div>
                    </div>
                    <div class="player-score-mobile">${player.score}</div>
                </div>
            `;
        });
        
        rankingList.innerHTML = html;
        
    } catch (error) {
        console.error("Load Ranking Error:", error);
    }
}

function clearLocalRanking() {
    if (confirm("Hapus semua data ranking lokal?")) {
        localStorage.removeItem('evoGoksRanking');
        showToast("🗑️ Data ranking lokal dihapus", "info");
        loadRanking();
    }
}

// ==============================
// MODAL FUNCTIONS
// ==============================
function openGlobalRankingModal() {
    const modal = document.getElementById('globalRankingModal');
    modal.classList.remove('hidden');
    
    initializeFirebase();
    
    const activeFilter = document.querySelector('#globalFilterScroll .filter-chip.active');
    const filter = activeFilter ? activeFilter.dataset.filter : 'all';
    loadGlobalRanking(filter);
}

function closeGlobalRankingModal() {
    const modal = document.getElementById('globalRankingModal');
    modal.classList.add('hidden');
    
    if (globalRankingListener && database) {
        database.ref('globalRanking').off('value', globalRankingListener);
        globalRankingListener = null;
    }
}

// ==============================
// AUDIO FUNCTIONS
// ==============================
function initializeAudio() {
    bgmAudio = document.getElementById('bgmAudio');
    correctSound = document.getElementById('correctSound');
    wrongSound = document.getElementById('wrongSound');
    evolveSound = document.getElementById('evolveSound');
    warningSound = document.getElementById('warningSound');
    
    if (bgmAudio) bgmAudio.volume = 0.3;
    if (correctSound) correctSound.volume = 0.5;
    if (wrongSound) wrongSound.volume = 0.5;
    if (evolveSound) evolveSound.volume = 0.5;
    if (warningSound) warningSound.volume = 0.5;
}

function playSound(soundType) {
    if (!soundEnabled) return;
    
    try {
        const sound = {
            'bgm': bgmAudio,
            'correct': correctSound,
            'wrong': wrongSound,
            'evolve': evolveSound,
            'warning': warningSound
        }[soundType];
        
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log(`${soundType} play error:`, e));
        }
    } catch (e) {
        console.log(`Error playing ${soundType}:`, e);
    }
}

function stopBGM() {
    if (bgmAudio) {
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
    }
}

// ==============================
// CHARACTER FUNCTIONS
// ==============================
function updateCharacter() {
    const stage = stages[evo];
    if (!stage) return;
    
    const characterImg = document.getElementById('characterImg');
    if (characterImg) {
        characterImg.src = stage.image;
        characterImg.alt = stage.name;
    }
    
    const menuCharacterImg = document.getElementById('menuCharacterImg');
    if (menuCharacterImg) {
        menuCharacterImg.src = stage.image;
        menuCharacterImg.alt = stage.name;
    }
    
    document.getElementById('stageName').textContent = stage.name;
    document.getElementById('stageDesc').textContent = stage.desc;
    document.getElementById('menuStageName').textContent = stage.name;
    document.getElementById('menuStageDesc').textContent = stage.desc;
    document.getElementById('characterStageBadge').textContent = evo + 1;
    
    updateBackground();
}

function updateBackground() {
    const stage = stages[evo];
    if (!stage) return;
    
    document.body.style.backgroundImage = `url('${stage.bg}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
}

// ==============================
// CHARACTER ANIMATION
// ==============================
function startCharacterAnimation() {
    if (window.characterAnimationInterval) {
        clearInterval(window.characterAnimationInterval);
    }
    
    let currentStageIndex = 0;
    const menuCharacterImg = document.getElementById('menuCharacterImg');
    const menuStageName = document.getElementById('menuStageName');
    const menuStageDesc = document.getElementById('menuStageDesc');
    
    if (!menuCharacterImg) return;
    
    window.characterAnimationInterval = setInterval(() => {
        currentStageIndex = (currentStageIndex + 1) % stages.length;
        const stage = stages[currentStageIndex];
        
        menuCharacterImg.style.opacity = '0.5';
        menuCharacterImg.style.transform = 'translateX(-20px) scale(0.9)';
        
        setTimeout(() => {
            menuCharacterImg.src = stage.image;
            menuCharacterImg.alt = stage.name;
            menuStageName.textContent = stage.name;
            menuStageDesc.textContent = stage.desc;
            
            menuCharacterImg.style.opacity = '1';
            menuCharacterImg.style.transform = 'translateX(0) scale(1)';
            menuCharacterImg.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, 300);
    }, 4000);
    
    characterAnimationActive = true;
}

function stopCharacterAnimation() {
    if (window.characterAnimationInterval) {
        clearInterval(window.characterAnimationInterval);
        window.characterAnimationInterval = null;
    }
    characterAnimationActive = false;
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
// GAME FUNCTIONS
// ==============================
function startGame() {
    const nameInput = document.getElementById('playerName');
    playerName = nameInput?.value.trim() || "Player";
    if (playerName === "") playerName = "Player";
    
    resetGame();
    showScreen('game');
    
    document.getElementById('mobilePlayerName').textContent = playerName;
    
    gameStarted = true;
    gameOver = false;
    
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
    
    clearInterval(gameTimerInterval);
    clearInterval(questionTimerInterval);
    
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
    
    document.getElementById('question').textContent = q.q;
    document.getElementById('questionNumber').textContent = currentQuestion + 1;
    
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';
    
    currentExplanation = q.explanation || "";
    
    const shuffledAnswers = [...q.a];
    for (let i = shuffledAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
    }
    
    shuffledAnswers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn-mobile';
        btn.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
        btn.dataset.index = q.a.indexOf(answer);
        btn.dataset.answer = answer;
        
        btn.addEventListener('click', function() {
            if (!isAnswering && !isPaused && !gameOver) {
                checkAnswer(parseInt(this.dataset.index));
            }
        });
        
        answersContainer.appendChild(btn);
    });
    
    questionTime = 15;
    document.getElementById('timeLeft').textContent = questionTime;
    document.getElementById('questionTimeMobile').style.width = '100%';
    
    document.getElementById('explanationBox').classList.add('hidden');
}

function checkAnswer(selectedIndex) {
    if (isAnswering || isPaused || gameOver) return;
    
    isAnswering = true;
    clearInterval(questionTimerInterval);
    
    const q = questions[currentQuestion];
    const isCorrect = selectedIndex === q.c;
    const buttons = document.querySelectorAll('.answer-btn-mobile');
    const correctAnswer = q.a[q.c];
    
    const timeBonus = questionTime > 10 ? 75 : questionTime > 5 ? 50 : 25;
    
    buttons.forEach(btn => { btn.style.pointerEvents = 'none'; });
    
    const correctBtn = Array.from(buttons).find(btn => parseInt(btn.dataset.index) === q.c);
    if (correctBtn) correctBtn.classList.add('correct');
    
    if (isCorrect) {
        playSound('correct');
        
        let points = 150 + timeBonus + 50;
        
        consecutiveCorrect++;
        if (consecutiveCorrect >= 5) {
            points += 300;
            showToast("🔥 5 JAWABAN BERUNTUN! +300 Bonus!", "success");
            playSound('evolve');
        }
        
        score += points;
        correctAnswers++;
        
        if (score >= (evo + 1) * 250 && evo < stages.length - 1) {
            evo++;
            showToast(`🎉 BEREVOLUSI! Sekarang ${stages[evo].name}`, "info");
            playSound('evolve');
        }
        
        if (score >= level * 600) {
            level++;
            showToast(`🎯 LEVEL UP! Level ${level}`, "info");
        }
        
        let statusMsg = `✅ Benar! +${points} poin`;
        if (timeBonus > 0) statusMsg += ` (+${timeBonus} cepat)`;
        if (consecutiveCorrect > 1) statusMsg += ` | ${consecutiveCorrect} beruntun`;
        
        showStatus(statusMsg, "success");
        
        const selectedBtn = Array.from(buttons).find(btn => parseInt(btn.dataset.index) === selectedIndex);
        if (selectedBtn) selectedBtn.classList.add('correct');
        
        if (currentExplanation) {
            setTimeout(() => showExplanation(currentExplanation), 1000);
        }
        
    } else {
        playSound('wrong');
        
        score = Math.max(0, score - 50);
        wrongAnswers++;
        consecutiveCorrect = 0;
        
        if (evo > 0) evo--;
        
        showExplanation(`Jawaban yang benar: <strong>${correctAnswer}</strong><br><br>${currentExplanation}`);
        showStatus("❌ Salah! -50 poin", "danger");
        
        const selectedBtn = Array.from(buttons).find(btn => parseInt(btn.dataset.index) === selectedIndex);
        if (selectedBtn) selectedBtn.classList.add('wrong');
    }
    
    updateUI();
    updateCharacter();
    
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
        
        setTimeout(() => explanationBox.classList.add('hidden'), 5000);
    }
}

function useHint() {
    if (hintsRemaining <= 0 || isAnswering || gameOver) return;
    if (!gameStarted) return;
    
    const q = questions[currentQuestion];
    const buttons = document.querySelectorAll('.answer-btn-mobile');
    const wrongAnswers = [];
    
    buttons.forEach((btn, index) => {
        if (parseInt(btn.dataset.index) !== q.c) {
            wrongAnswers.push(btn);
        }
    });
    
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
    if (isAnswering || isPaused || gameOver || !gameStarted) return;
    
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
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft === 30) {
                showToast("⚠️ 30 detik tersisa!", "warning");
                playSound('warning');
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
            
            if (questionTime <= 5) {
                document.getElementById('questionTimeMobile').style.background = 'linear-gradient(90deg, var(--danger), #ff6b6b)';
            } else if (questionTime <= 10) {
                document.getElementById('questionTimeMobile').style.background = 'linear-gradient(90deg, var(--warning), #ffcc00)';
            }
            
            if (questionTime <= 0) {
                clearInterval(questionTimerInterval);
                
                playSound('wrong');
                
                score = Math.max(0, score - 50);
                consecutiveCorrect = 0;
                wrongAnswers++;
                
                if (evo > 0) evo--;
                
                const q = questions[currentQuestion];
                const correctAnswer = q.a[q.c];
                
                showExplanation(`⏰ <strong>Waktu habis!</strong><br><br>Jawaban yang benar: <strong>${correctAnswer}</strong><br><br>${currentExplanation}`);
                showStatus("⏰ Waktu habis! -50 poin", "danger");
                
                const buttons = document.querySelectorAll('.answer-btn-mobile');
                buttons.forEach(btn => {
                    btn.style.pointerEvents = 'none';
                    if (parseInt(btn.dataset.index) === q.c) {
                        btn.classList.add('correct');
                    }
                });
                
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
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('evoStage').textContent = `${evo + 1}/${stages.length}`;
    
    const evoProgress = ((evo + 1) / stages.length) * 100;
    document.getElementById('mobileEvoProgress').style.width = `${evoProgress}%`;
    document.getElementById('timelineProgressMobile').style.width = `${(evo / (stages.length - 1)) * 100}%`;
    
    document.getElementById('mobileHintCount').textContent = hintsRemaining;
    
    document.querySelectorAll('.timeline-step-mobile').forEach((step, index) => {
        if (index <= evo) step.classList.add('active');
        else step.classList.remove('active');
    });
}

function showStatus(message, type = "info") {
    const statusText = document.getElementById('status');
    const statusIcon = document.querySelector('.status-content-mobile i');
    
    if (statusText) {
        statusText.textContent = message;
        const colors = { success: '#00d4aa', danger: '#ff4757', warning: '#ffb347', info: '#00d4ff' };
        statusText.style.color = colors[type] || '#ffffff';
    }
    
    if (statusIcon) {
        const icons = { success: 'fa-check-circle', danger: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
        statusIcon.className = `fas ${icons[type] || 'fa-info-circle'}`;
    }
}

// ==============================
// GAME CONTROL FUNCTIONS
// ==============================
function togglePause() {
    if (gameOver || !gameStarted) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        clearInterval(gameTimerInterval);
        clearInterval(questionTimerInterval);
        document.getElementById('pauseText').textContent = "Lanjutkan Game";
        showToast("⏸️ Game dijeda", "warning");
        if (bgmAudio) bgmAudio.pause();
    } else {
        startGameTimer();
        startQuestionTimer();
        document.getElementById('pauseText').textContent = "Jeda Game";
        showToast("▶️ Game dilanjutkan", "success");
        if (soundEnabled && bgmAudio) bgmAudio.play().catch(e => console.log("BGM resume error:", e));
    }
    
    closeGameMenu();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    
    showToast(soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF", soundEnabled ? "success" : "warning");
    
    if (soundEnabled) {
        playSound('bgm');
    } else {
        stopBGM();
    }
    
    const soundIcons = document.querySelectorAll('.fa-volume-up, .fa-volume-mute');
    soundIcons.forEach(icon => {
        icon.className = soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    });
    
    const soundStatus = document.getElementById('soundStatusMenu');
    if (soundStatus) soundStatus.textContent = soundEnabled ? "ON" : "OFF";
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
// SCREEN MANAGEMENT
// ==============================
function showScreen(screenName) {
    const screens = ['loadingScreen', 'menuScreen', 'gameScreen', 'rankingScreen', 'resultScreen', 'rulesScreen'];
    screens.forEach(id => {
        document.getElementById(id)?.classList.add('hidden');
    });
    
    document.getElementById('explanationBox')?.classList.add('hidden');
    
    switch(screenName) {
        case 'menu':
            document.getElementById('menuScreen').classList.remove('hidden');
            closeMobileMenu();
            closeGameMenu();
            updateCharacter();
            if (characterAnimationActive) startCharacterAnimation();
            break;
        case 'game':
            document.getElementById('gameScreen').classList.remove('hidden');
            closeGameMenu();
            stopCharacterAnimation();
            break;
        case 'ranking':
            document.getElementById('rankingScreen').classList.remove('hidden');
            loadRanking();
            stopCharacterAnimation();
            break;
        case 'result':
            document.getElementById('resultScreen').classList.remove('hidden');
            showResult();
            stopCharacterAnimation();
            break;
        case 'rules':
            document.getElementById('rulesScreen').classList.remove('hidden');
            stopCharacterAnimation();
            break;
    }
}

// ==============================
// RESULT FUNCTIONS
// ==============================
function endGame() {
    gameOver = true;
    gameStarted = false;
    
    clearInterval(gameTimerInterval);
    clearInterval(questionTimerInterval);
    stopBGM();
    
    const timeBonus = Math.floor(timeLeft / 10) * 15;
    score += timeBonus;
    
    let resultTitle = "";
    if (score >= 1500) resultTitle = "EVOLUSI LEGENDA! 🏆";
    else if (score >= 1000) resultTitle = "EVOLUSI MASTER! 🥇";
    else if (score >= 600) resultTitle = "PINTAR SEKALI! 🥈";
    else if (score >= 300) resultTitle = "LUMAYAN BAIK! 🎯";
    else resultTitle = "PERLU BELAJAR LAGI! 📚";
    
    document.getElementById('resultTitleMobile').innerHTML = `<h3>${resultTitle}</h3>`;
    document.getElementById('resultSubtitle').textContent = `Skor akhir: ${score}`;
    document.getElementById('resultName').textContent = playerName;
    document.getElementById('resultScore').textContent = score;
    document.getElementById('resultStage').textContent = stages[evo].name;
    
    showScreen('result');
    loadMaterialContent();
    
    setTimeout(() => autoSaveScore(), 2000);
}

function showResult() {
    loadMaterialContent();
}

function loadMaterialContent() {
    const materialContent = document.getElementById('materialContentMobile');
    if (!materialContent) return;
    
    let html = `
        <div class="material-header-note">
            <i class="fas fa-clock"></i>
            <p><strong>Materi Evolusi yang Telah Dipelajari:</strong></p>
        </div>
    `;
    
    stages.forEach((stage, index) => {
        if (index <= evo) {
            html += `
                <div class="material-item-mobile ${index === evo ? 'current-stage' : ''}">
                    <div class="material-stage-header">
                        <h4><i class="fas fa-dna"></i> Tahap ${index + 1}: ${stage.name}</h4>
                        <span class="stage-status">${index === evo ? '🏁 Tahap terakhir' : '✅ Telah berevolusi'}</span>
                    </div>
                    <p class="stage-period"><i class="fas fa-calendar-alt"></i> ${stage.period}</p>
                    <p class="stage-desc">${stage.desc}</p>
                    <div class="material-facts">
                        <ul>${stage.facts.map(fact => `<li>${fact}</li>`).join('')}</ul>
                    </div>
                </div>
            `;
        }
    });
    
    html += `
        <div class="learning-tips">
            <div class="tips-header">
                <i class="fas fa-lightbulb"></i>
                <h4>Tips Belajar Evolusi Manusia</h4>
            </div>
            <p>Perhatikan urutan kronologis dan ciri khas setiap tahap evolusi!</p>
        </div>
    `;
    
    materialContent.innerHTML = html;
}

function toggleMaterial() {
    const materialContent = document.getElementById('materialContentMobile');
    const collapseBtn = document.getElementById('collapseMaterialBtn');
    const icon = collapseBtn.querySelector('i');
    
    materialContent.classList.toggle('open');
    
    if (icon.classList.contains('fa-chevron-down')) {
        icon.className = 'fas fa-chevron-up';
    } else {
        icon.className = 'fas fa-chevron-down';
    }
}

// ==============================
// SAVE SCORE FUNCTIONS
// ==============================
function saveScore() {
    const playerData = {
        name: playerName,
        score: score,
        stage: stages[evo].name,
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers,
        timeLeft: timeLeft,
        version: "3.0"
    };
    
    const saveBtn = document.getElementById('saveScoreBtn');
    const originalHTML = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    saveBtn.disabled = true;
    
    if (initializeFirebase()) {
        saveScoreToGlobal(playerData);
    } else {
        saveScoreToLocalStorage(playerData);
    }
    
    setTimeout(() => {
        saveBtn.innerHTML = '<i class="fas fa-check"></i> Tersimpan';
        setTimeout(() => {
            saveBtn.innerHTML = originalHTML;
            saveBtn.disabled = false;
        }, 2000);
    }, 1500);
    
    document.getElementById('resultRank').textContent = "Disimpan!";
}

function autoSaveScore() {
    const playerData = {
        name: playerName,
        score: score,
        stage: stages[evo].name,
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers,
        timeLeft: timeLeft,
        version: "3.0"
    };
    
    saveScoreToLocalStorage(playerData);
    
    if (initializeFirebase()) {
        saveScoreToGlobal(playerData);
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
    document.getElementById('mobileGameMenu').classList.toggle('open');
}

function closeGameMenu() {
    document.getElementById('mobileGameMenu').classList.remove('open');
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

function getDeviceId() {
    let deviceId = localStorage.getItem('evoGoks_deviceId');
    
    if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('evoGoks_deviceId', deviceId);
    }
    
    return deviceId;
}

function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showToast(message, type = "info") {
    const toast = document.getElementById('toast');
    const toastMessage = document.querySelector('.toast-message');
    const toastIcon = document.querySelector('.toast-icon');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    
    const icons = { success: 'fa-check-circle', warning: 'fa-exclamation-triangle', error: 'fa-times-circle', info: 'fa-info-circle' };
    toastIcon.className = `${icons[type] || 'fa-info-circle'} toast-icon`;
    
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

// ==============================
// KEYBOARD CONTROLS
// ==============================
function handleKeyPress(e) {
    if (!gameStarted || isAnswering || isPaused || gameOver) return;
    
    const key = e.key.toLowerCase();
    
    if (key >= '1' && key <= '5') {
        const index = parseInt(key) - 1;
        const buttons = document.querySelectorAll('.answer-btn-mobile');
        if (buttons[index]) buttons[index].click();
    }
    
    switch(key) {
        case 'h': useHint(); break;
        case 'm': toggleSound(); break;
        case 'p':
        case ' ': togglePause(); break;
        case 's': skipQuestion(); break;
    }
}

// ==============================
// EVENT LISTENERS SETUP
// ==============================
function setupEventListeners() {
    // Menu Buttons
    document.getElementById('startBtn')?.addEventListener('click', startGame);
    document.getElementById('rankingBtn')?.addEventListener('click', showRanking);
    document.getElementById('rulesBtn')?.addEventListener('click', showRules);
    document.getElementById('globalRankingBtn')?.addEventListener('click', openGlobalRankingModal);
    
    // Mobile Menu
    document.getElementById('mobileMenuBtn')?.addEventListener('click', openMobileMenu);
    document.getElementById('closeMenuBtn')?.addEventListener('click', closeMobileMenu);
    document.getElementById('mobileSoundBtn')?.addEventListener('click', toggleSound);
    document.getElementById('soundToggleMenu')?.addEventListener('click', toggleSound);
    document.getElementById('mobileGlobalRankingBtn')?.addEventListener('click', function() {
        closeMobileMenu();
        openGlobalRankingModal();
    });
    
    // Player Name
    document.getElementById('playerName')?.addEventListener('input', function() {
        playerName = this.value.trim() || "Player";
    });
    
    // Animation Toggle
    document.getElementById('animationToggle')?.addEventListener('change', toggleCharacterAnimation);
    
    // Game Controls
    document.getElementById('backGameBtn')?.addEventListener('click', backToMenu);
    document.getElementById('mobileGameMenuBtn')?.addEventListener('click', toggleGameMenu);
    document.getElementById('pauseGameBtn')?.addEventListener('click', togglePause);
    document.getElementById('hintGameBtn')?.addEventListener('click', useHint);
    document.getElementById('soundGameBtn')?.addEventListener('click', toggleSound);
    document.getElementById('backToMenuBtnGame')?.addEventListener('click', backToMenu);
    
    // Mobile Quick Actions
    document.getElementById('mobileHintBtn')?.addEventListener('click', useHint);
    document.getElementById('mobilePauseBtn')?.addEventListener('click', togglePause);
    document.getElementById('mobileSkipBtn')?.addEventListener('click', skipQuestion);
    
    // Navigation
    document.getElementById('backFromRankingMobile')?.addEventListener('click', () => showScreen('menu'));
    document.getElementById('backFromRules')?.addEventListener('click', () => showScreen('menu'));
    document.getElementById('refreshRanking')?.addEventListener('click', loadRanking);
    document.getElementById('clearLocalRanking')?.addEventListener('click', clearLocalRanking);
    
    // Result Buttons
    document.getElementById('playAgainBtn')?.addEventListener('click', startGame);
    document.getElementById('saveScoreBtn')?.addEventListener('click', saveScore);
    document.getElementById('backToMenuBtnResult')?.addEventListener('click', () => showScreen('menu'));
    
    // Material Collapse
    document.getElementById('collapseMaterialBtn')?.addEventListener('click', toggleMaterial);
    
    // Local Ranking Filters
    document.querySelectorAll('.ranking-filters-mobile .filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('.ranking-filters-mobile .filter-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            loadRanking();
        });
    });
    
    // Global Ranking Modal
    document.getElementById('closeGlobalRanking')?.addEventListener('click', closeGlobalRankingModal);
    document.getElementById('shareGlobalScore')?.addEventListener('click', shareGlobalScore);
    
    // Global Ranking Filters
    document.querySelectorAll('#globalFilterScroll .filter-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            document.querySelectorAll('#globalFilterScroll .filter-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            loadGlobalRanking(this.dataset.filter);
        });
    });
    
    // Close modal on click outside
    document.getElementById('globalRankingModal')?.addEventListener('click', function(e) {
        if (e.target === this) closeGlobalRankingModal();
    });
    
    // Keyboard Controls
    document.addEventListener('keydown', handleKeyPress);
    
    // Mobile Menu Options
    document.querySelectorAll('.mobile-menu-option[data-action]').forEach(option => {
        option.addEventListener('click', function() {
            const action = this.dataset.action;
            switch(action) {
                case 'start': startGame(); break;
                case 'ranking': showRanking(); break;
                case 'rules': showRules(); break;
                case 'about': showToast("Evo Goks v3.0 - Ranking Global Realtime", "info"); break;
            }
            closeMobileMenu();
        });
    });
}

// ==============================
// INITIALIZATION
// ==============================
function initGame() {
    console.log("🎮 Evo Goks v3.0 Initializing...");
    
    initializeAudio();
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 20;
        document.getElementById('loadingProgress').style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            
            setTimeout(() => {
                document.getElementById('loadingScreen').classList.add('hidden');
                document.getElementById('menuScreen').classList.remove('hidden');
                
                setupEventListeners();
                updateCharacter();
                startCharacterAnimation();
                
                if (soundEnabled) playSound('bgm');
                
                showToast("🎮 Selamat bermain Evo Goks v3.0!", "info");
            }, 500);
        }
    }, 100);
    
    setupBasicEventListeners();
}

function setupBasicEventListeners() {
    document.getElementById('skipLoadingBtn')?.addEventListener('click', () => {
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('menuScreen').classList.remove('hidden');
        
        initializeAudio();
        setupEventListeners();
        updateCharacter();
        startCharacterAnimation();
        if (soundEnabled) playSound('bgm');
    });
}

// ==============================
// WINDOW EXPOSED FUNCTIONS
// ==============================
window.startGame = startGame;
window.loadGlobalRanking = loadGlobalRanking;
window.closeGlobalRankingModal = closeGlobalRankingModal;
window.shareGlobalScore = shareGlobalScore;

// ==============================
// START GAME
// ==============================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    setTimeout(initGame, 100);
}

window.addEventListener('load', function() {
    console.log("📱 Evo Goks v3.0 Loaded");
    
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
            document.getElementById('menuScreen')?.classList.remove('hidden');
            
            initializeAudio();
            setupEventListeners();
            updateCharacter();
            startCharacterAnimation();
            if (soundEnabled) playSound('bgm');
        }
    }, 3000);
});

// Debug Functions
window.debugEvoGoks = {
    resetRanking: function() {
        localStorage.removeItem('evoGoksRanking');
        showToast("Ranking telah direset", "warning");
        loadRanking();
    },
    addTestScores: function() {
        const testScores = [
            {name: "Player1", score: 1500, stage: "Manusia Modern"},
            {name: "Player2", score: 1200, stage: "Homo Sapiens"},
            {name: "Player3", score: 800, stage: "Homo Erectus"}
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
    }
};
