const allTargets=['😃','🙂','😊','😀'];
const allDistractors=['😐','☹️','😟','😕','😮','😒','😠','😑'];

let score=0, timeLeft=30, gameActive=false,timerInterval;
let dynamicTexts={};
let isPaused = false;

const currentLang= document.documentElement.lang.toLowerCase() || 'en';
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const tutorialOverlay = document.getElementById('tutorial-overlay'), historyListUI = document.getElementById('history-list');

let highScore = localStorage.getItem('smileHighScore') || 0;
let history = JSON.parse(localStorage.getItem('smileHistory')) || [];

fetch('/locales.json')
    .then(response => response.json())
    .then(data => {
        dynamicTexts = data[currentLang] || data['en'];

        if (highScore && dynamicTexts.returnTitle){
            const startTitle = document.querySelector('#tutorial-overlay h2');
            const startDesc = document.querySelector('#tutorial-overlay p');
            const startBtn = document.querySelector('#tutorial-overlay button');

            if(startTitle) startTitle.innerText = dynamicTexts.returnTitle;
            if(startDesc) startDesc.innerText = dynamicTexts.returnDesc.replace('{best}',highScore);
            if(startBtn) startBtn.innerText = dynamicTexts.returnBtn;
        }
    })
    .catch(error => console.error("Error Loading locales: ",error));

document.addEventListener("DOMContentLoaded", ()=>{
    const currentLang = document.documentElement.lang.toLowerCase();
    const params = new URLSearchParams(window.location.search);
    if (currentLang.includes('zh-han')){
        localStorage.setItem('user_lang_pref',currentLang);
    } else {
        if(params.get('lang' === 'en')){
            localStorage.setItem('user_lang_pref','en')
        }
    }
    if (params.get('autoplay') === 'true'){
        startGame();
    }
    document.getElementById('best').innerText = highScore;
    updateHistoryUI();
});

function playSound(freq,type){
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type; //sine, square, triangle, sawtooth
    osc.frequency.setValueAtTime(freq,audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01,audioCtx.currentTime+0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime+0.1);
}

function startGame(){
    score=0,timeLeft=30;gameActive=true;isPaused=false;
    document.body.style.background="#1a1a2e";
    document.getElementById('score').innerText=score;
    document.getElementById('timer').innerText=timeLeft;
    document.getElementById('tutorial-overlay').style.display='none';
    document.getElementById('overlay').style.display='none';

    if (audioCtx.state === 'suspended') audioCtx.resume();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (isPaused) return;
        timeLeft--;
        document.getElementById('timer').innerText=timeLeft;
        if(timeLeft<=0) endGame();
    }, 1000);
    renderGrid();
}

function renderGrid(){
    const grid=document.getElementById('grid');
    let activeTargets = [allTargets[0]],numSmiles=1,gridSize=4,distCount=4;

    if(score>=25){document.body.style.background="#432818";activeTargets=allTargets;numSmiles=3;gridSize=6;distCount=8;}
    else if(score>=15){document.body.style.background="#132a13";activeTargets=allTargets.slice(0,3);numSmiles=2;gridSize=5;distCount=6;}
    else if(score>=8){document.body.style.background="#240046";activeTargets=allTargets.slice(0,2);numSmiles=2;gridSize=4;distCount=5;}
    else if(score>=4){numSmiles=2;}

    document.getElementById('target-list').innerText=activeTargets.join(' ');
    grid.innerText=''; grid.style.gridTemplateColumns = `repeat(${gridSize},1fr)`;
    const total = gridSize * gridSize;
    let positions = Array.from(Array(total).keys()).sort(()=>Math.random()-0.5);
    const smilePositions=positions.slice(0,numSmiles);
    const currentDists = allDistractors.slice(0,distCount);

    for(let i=0;i<total;i++){
        const div = document.createElement('div');
        div.classList.add('face');
        div.style.fontSize = gridSize > 5 ? '1.6rem' : '2.2rem';
        if (smilePositions.includes(i)){
            div.innerText=activeTargets[Math.floor(Math.random()*activeTargets.length)];
            div.dataset.target = "true";
            div.onclick = function(){
                if(!gameActive || this.dataset.clicked === "true") return;
                this.style.opacity="0.2"; this.dataset.clicked="true";
                score++;
                document.getElementById('score').innerText=score;
                playSound(800,'sine'); //high beep for correct
                if(navigator.vibrate) navigator.vibrate(40);
                if(document.querySelectorAll('.face[data-target="true"]:not([data-clicked="true"])').length === 0) renderGrid();
            };
        } else {
            div.innerText = currentDists[Math.floor(Math.random()*currentDists.length)];
            div.onclick = () => {
                if (!gameActive) return;
                timeLeft = Math.max(0, timeLeft-2); // 2-second penalty
                document.getElementById('timer').innerText = timeLeft;
                playSound(200,'square'); //low buz for wrong
                grid.style.borderColor = "rgba(233,69,96,0.5)";
                setTimeout(() => {
                    grid.style.borderColor = "rgba(255,255,255,0.1)"
                }, 200);
                if(navigator.vibrate) navigator.vibrate(200);
            };
        }
        grid.appendChild(div);
    }
}

function shareGame(){
    if(!dynamicTexts.shareTpl) return;
    const shareText = dynamicTexts.shareTpl.replace('{score}', score);
    if(navigator.share){
        navigator.share({text: shareText, url: window.location.href});
    } else {
        navigator.clipboard.writeText(shareText);
        alert(dynamicTexts.copySuccess);
    }
}

function endGame(){
    gameActive = false; clearInterval(timerInterval);
    playSound(100,'sawtooth'); //game over sound
    document.getElementById('final-score').innerText=score;
    history.unshift(score); history=history.slice(0,5);
    localStorage.setItem('smileHistory',JSON.stringify(history));
    updateHistoryUI();
    document.getElementById('overlay').style.display = 'flex';
    if(score>highScore){localStorage.setItem('smileHighScore',score);document.getElementById('best').innerText=score;}
}

function showPrivacy(){
    if (gameActive) isPaused = true;
    document.getElementById('privacy-modal').style.display = 'flex';
}

function hidePrivacy(){
    isPaused = false;
    document.getElementById('privacy-modal').style.display = 'none';
}

function updateHistoryUI(){
    historyListUI.innerHTML = history.length > 0 ? history.map(s => `<li class="history-item">${s}</li>`).join('') : `<li>No sessions yet</li>`;
}

function closeTutorial(){
    localStorage.setItem('smileTutorialSeen','true');
    tutorialOverlay.style.display = 'none';
    startGame();
}

// if(localStorage.getItem('smileTutorialSeen')){ tutorialOverlay.style.display = 'none';setTimeout(startGame, 300);}