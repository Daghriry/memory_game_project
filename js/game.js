// متغيرات عامة
let gameLevel = 'easy'; // المستوى الافتراضي
let cards = []; // مصفوفة البطاقات
let flippedCards = []; // البطاقات المقلوبة حاليًا
let matchedPairs = 0; // عدد الأزواج المتطابقة
let attempts = 0; // عدد المحاولات
let isProcessing = false; // للتحكم في توقيت قلب البطاقات
let totalPairs = 6; // عدد الأزواج الافتراضي (للمستوى السهل)

// الصور المستخدمة في اللعبة
const cardImages = {
    animals: [
        'https://cdn-icons-png.flaticon.com/512/616/616430.png', // قطة
        'https://cdn-icons-png.flaticon.com/512/616/616408.png', // كلب
        'https://cdn-icons-png.flaticon.com/512/3069/3069172.png', // أرنب
        'https://cdn-icons-png.flaticon.com/512/1998/1998610.png', // فيل
        'https://cdn-icons-png.flaticon.com/512/1998/1998713.png', // أسد
        'https://cdn-icons-png.flaticon.com/512/2395/2395796.png', // زرافة
        'https://cdn-icons-png.flaticon.com/512/1998/1998627.png', // سمكة
        'https://cdn-icons-png.flaticon.com/512/1998/1998679.png', // طائر
    ],
    fruits: [
        'https://cdn-icons-png.flaticon.com/512/415/415682.png', // تفاحة
        'https://cdn-icons-png.flaticon.com/512/2909/2909761.png', // موزة
        'https://cdn-icons-png.flaticon.com/512/415/415731.png', // برتقالة
        'https://cdn-icons-png.flaticon.com/512/590/590685.png', // فراولة
        'https://cdn-icons-png.flaticon.com/512/2909/2909761.png', // عنب
        'https://cdn-icons-png.flaticon.com/512/874/874997.png', // بطيخ
    ]
};

// كلمات التشجيع
const encouragementWords = [
    'أحسنت!',
    'ممتاز!',
    'رائع!',
    'ذكي!',
    'عبقري!'
];

// عناصر DOM
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const gameBoard = document.getElementById('game-board');
const attemptsElement = document.getElementById('attempts');
const finalAttemptsElement = document.getElementById('final-attempts');
const successSound = document.getElementById('success-sound');

// أزرار المستوى
const easyLevelBtn = document.getElementById('easy-level');
const mediumLevelBtn = document.getElementById('medium-level');

// أزرار التحكم
const startGameBtn = document.getElementById('start-game');
const restartGameBtn = document.getElementById('restart-game');
const backToMenuBtn = document.getElementById('back-to-menu');
const playAgainBtn = document.getElementById('play-again');
const backToMenuEndBtn = document.getElementById('back-to-menu-end');

// تهيئة اللعبة
function init() {
    // تعيين المستوى الافتراضي
    setLevel('easy');
    
    // إضافة مستمعي الأحداث للأزرار
    easyLevelBtn.addEventListener('click', () => setLevel('easy'));
    mediumLevelBtn.addEventListener('click', () => setLevel('medium'));
    
    startGameBtn.addEventListener('click', startGame);
    restartGameBtn.addEventListener('click', restartGame);
    backToMenuBtn.addEventListener('click', backToMenu);
    playAgainBtn.addEventListener('click', restartGame);
    backToMenuEndBtn.addEventListener('click', backToMenu);
    
    // تعيين المستوى السهل كافتراضي
    easyLevelBtn.classList.add('active');
}

// تعيين مستوى اللعبة
function setLevel(level) {
    gameLevel = level;
    
    // إزالة الفئة النشطة من جميع الأزرار
    easyLevelBtn.classList.remove('active');
    mediumLevelBtn.classList.remove('active');
    
    // إضافة الفئة النشطة للزر المحدد
    if (level === 'easy') {
        easyLevelBtn.classList.add('active');
        totalPairs = 6;
    } else {
        mediumLevelBtn.classList.add('active');
        totalPairs = 8;
    }
}

// بدء اللعبة
function startGame() {
    // إعادة تعيين متغيرات اللعبة
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    attemptsElement.textContent = attempts;
    
    // إخفاء شاشة البداية وإظهار شاشة اللعب
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    endScreen.classList.add('hidden');
    
    // إنشاء البطاقات
    createCards();
}

// إعادة تشغيل اللعبة
function restartGame() {
    // إخفاء شاشة النهاية إذا كانت ظاهرة
    endScreen.classList.add('hidden');
    
    // بدء لعبة جديدة
    startGame();
}

// العودة إلى القائمة الرئيسية
function backToMenu() {
    // إخفاء شاشة اللعب وشاشة النهاية وإظهار شاشة البداية
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

// إنشاء البطاقات
function createCards() {
    // تفريغ لوحة اللعب
    gameBoard.innerHTML = '';
    
    // تحديد مجموعة الصور (الحيوانات للمستوى السهل، الفواكه للمستوى المتوسط)
    const imageSet = gameLevel === 'easy' ? cardImages.animals.slice(0, totalPairs) : cardImages.animals.slice(0, totalPairs);
    
    // إنشاء مصفوفة من أزواج البطاقات
    cards = [];
    for (let i = 0; i < totalPairs; i++) {
        cards.push({
            id: i,
            image: imageSet[i]
        });
        cards.push({
            id: i,
            image: imageSet[i]
        });
    }
    
    // خلط البطاقات
    shuffleCards();
    
    // إنشاء عناصر البطاقات في DOM
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.id = card.id;
        cardElement.dataset.index = index;
        
        // إنشاء وجهي البطاقة (الأمامي والخلفي)
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        
        const cardImage = document.createElement('img');
        cardImage.src = card.image;
        cardImage.alt = `بطاقة ${card.id}`;
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        
        // إضافة العناصر إلى البطاقة
        cardFront.appendChild(cardImage);
        cardElement.appendChild(cardFront);
        cardElement.appendChild(cardBack);
        
        // إضافة مستمع الحدث للنقر
        cardElement.addEventListener('click', () => flipCard(cardElement, card));
        
        // إضافة البطاقة إلى لوحة اللعب
        gameBoard.appendChild(cardElement);
    });
    
    // تعديل عدد الأعمدة في الشبكة بناءً على المستوى
    const columns = gameLevel === 'easy' ? 3 : 4;
    gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

// خلط البطاقات
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

// قلب البطاقة
function flipCard(cardElement, card) {
    // التحقق من أن البطاقة ليست مقلوبة بالفعل وأن العملية ليست قيد التنفيذ
    if (cardElement.classList.contains('flipped') || isProcessing || flippedCards.length >= 2) {
        return;
    }
    
    // قلب البطاقة
    cardElement.classList.add('flipped');
    
    // إضافة البطاقة إلى قائمة البطاقات المقلوبة
    flippedCards.push({ element: cardElement, card: card });
    
    // التحقق من وجود بطاقتين مقلوبتين
    if (flippedCards.length === 2) {
        // زيادة عدد المحاولات
        attempts++;
        attemptsElement.textContent = attempts;
        
        // التحقق من تطابق البطاقات
        checkForMatch();
    }
}

// التحقق من تطابق البطاقات
function checkForMatch() {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];
    
    isProcessing = true;
    
    // التحقق من تطابق البطاقات
    if (card1.card.id === card2.card.id) {
        // البطاقات متطابقة
        setTimeout(() => {
            // إضافة فئة التطابق
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            
            // تشغيل صوت النجاح
            successSound.play();
            
            // عرض كلمة تشجيع عشوائية
            showEncouragement();
            
            // زيادة عدد الأزواج المتطابقة
            matchedPairs++;
            
            // التحقق من انتهاء اللعبة
            if (matchedPairs === totalPairs) {
                setTimeout(endGame, 1000);
            }
            
            // إعادة تعيين البطاقات المقلوبة
            flippedCards = [];
            isProcessing = false;
        }, 500);
    } else {
        // البطاقات غير متطابقة
        setTimeout(() => {
            // إعادة قلب البطاقات
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            
            // إعادة تعيين البطاقات المقلوبة
            flippedCards = [];
            isProcessing = false;
        }, 1000);
    }
}

// عرض كلمة تشجيع عشوائية
function showEncouragement() {
    // إنشاء عنصر للتشجيع
    const encouragement = document.createElement('div');
    encouragement.className = 'encouragement';
    encouragement.textContent = encouragementWords[Math.floor(Math.random() * encouragementWords.length)];
    
    // تعيين نمط العنصر
    encouragement.style.position = 'fixed';
    encouragement.style.top = '50%';
    encouragement.style.left = '50%';
    encouragement.style.transform = 'translate(-50%, -50%)';
    encouragement.style.fontSize = '2rem';
    encouragement.style.fontWeight = 'bold';
    encouragement.style.color = '#ff6b6b';
    encouragement.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.2)';
    encouragement.style.zIndex = '1000';
    encouragement.style.animation = 'fadeOut 1s forwards';
    
    // إضافة تأثير الاختفاء التدريجي
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
        }
    `;
    
    // إضافة العناصر إلى الصفحة
    document.head.appendChild(style);
    document.body.appendChild(encouragement);
    
    // إزالة العنصر بعد انتهاء التأثير
    setTimeout(() => {
        document.body.removeChild(encouragement);
    }, 1000);
}

// إنهاء اللعبة
function endGame() {
    // إخفاء شاشة اللعب وإظهار شاشة النهاية
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    
    // عرض عدد المحاولات النهائي
    finalAttemptsElement.textContent = attempts;
}

// تشغيل اللعبة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', init);

// منع التكبير على الأجهزة المحمولة
document.addEventListener('touchmove', function(event) {
    if (event.scale !== 1) {
        event.preventDefault();
    }
}, { passive: false });

// منع السحب للأسفل لتحديث الصفحة على الأجهزة المحمولة
document.body.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });
