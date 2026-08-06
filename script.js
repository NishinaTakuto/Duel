const CONFIG = {
    DECK_SIZE: 40,

    DECK1_X: 50,
    DECK1_Y: 75,

    DECK2_RIGHT: 50,
    DECK2_BOTTOM: 75,

    CARD_WIDTH: 40,
    CARD_HEIGHT: 60,

    DECK_WIDTH: 80,
    DECK_HEIGHT: 120
};

const table = document.getElementById("table");

let highestZ = 100;

const gameState = {
    deck1: [],
    deck2: [],
    fieldCards: []
};

// カード生成
for (let i = 1; i <= 40; i++) {
    gameState.deck1.push({ id: i });
}

for (let i = 41; i <= 80; i++) {
    gameState.deck2.push({ id: i });
}

// シャッフル
gameState.deck1.sort(() => Math.random() - 0.5);
gameState.deck2.sort(() => Math.random() - 0.5);

// 左上の山札
const deckView1 = document.createElement("div");
deckView1.className = "card back";

deckView1.style.left = CONFIG.DECK1_X + "px";
deckView1.style.top = CONFIG.DECK1_Y + "px";

deckView1.style.width =
    CONFIG.CARD_WIDTH + "px";

deckView1.style.height =
    CONFIG.CARD_HEIGHT + "px";

table.appendChild(deckView1);

// 右下の山札
const deckView2 = document.createElement("div");
deckView2.className = "card back";

deckView2.style.right = CONFIG.DECK2_RIGHT + "px";
deckView2.style.bottom = CONFIG.DECK2_BOTTOM + "px";

deckView2.style.width =
    CONFIG.CARD_WIDTH + "px";

deckView2.style.height =
    CONFIG.CARD_HEIGHT + "px";

table.appendChild(deckView2);

function updateDeckViews() {
    deckView1.textContent = gameState.deck1.length;
    deckView2.textContent = gameState.deck2.length;
}

updateDeckViews();

// 山札1からドロー
deckView1.addEventListener("pointerdown", (e) => {

    if (gameState.deck1.length === 0) return;

    const cardData = gameState.deck1.pop();

    const card = createCard(
        cardData,
        e.clientX - CONFIG.CARD_WIDTH / 2,
        e.clientY - CONFIG.CARD_HEIGHT / 2
    );

    startDragging(card, e);

    updateDeckViews();
});

// 山札2からドロー
deckView2.addEventListener("pointerdown", (e) => {

    if (gameState.deck2.length === 0) return;

    const cardData = gameState.deck2.pop();

    const card = createCard(
        cardData,
        e.clientX - CONFIG.CARD_WIDTH / 2,
        e.clientY - CONFIG.CARD_HEIGHT / 2
    );

    startDragging(card, e);

    updateDeckViews();
});

function createCard(cardData, startX, startY) {

    const card = document.createElement("div");

    card.className = "card front";
    card.textContent = cardData.id;

    card.cardData = cardData;

    card.dataset.faceUp = "true";
    card.dataset.rotated = "false";

    card.style.left = startX + "px";
    card.style.top = startY + "px";

    card.style.width =
        CONFIG.CARD_WIDTH + "px";

    card.style.height =
        CONFIG.CARD_HEIGHT + "px";

    card.style.zIndex = ++highestZ;

    table.appendChild(card);

    setupCardEvents(card);

    gameState.fieldCards.push({
        id: cardData.id,
        x: startX,
        y: startY,
        faceUp: true,
        zone: "field",
        element: card
    });

    makeDraggable(card);

    return card;
}

function makeDraggable(card) {

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    card.addEventListener("pointerdown", (e) => {

        dragging = true;

        card.style.zIndex = ++highestZ;

        offsetX = e.clientX - card.offsetLeft;
        offsetY = e.clientY - card.offsetTop;
    });

    card.addEventListener("pointermove", (e) => {

        if (!dragging) return;

        card.style.left =
            (e.clientX - offsetX) + "px";

        card.style.top =
            (e.clientY - offsetY) + "px";
    });

    card.addEventListener("pointerup", () => {

    dragging = false;

    const cardRect = card.getBoundingClientRect();

    const deck1Rect = deckView1.getBoundingClientRect();
    const deck2Rect = deckView2.getBoundingClientRect();

    if (isOverlapping(cardRect, deck1Rect)) {

        const isTop =
            confirm("OK:山札の上\nキャンセル:山札の下");

        if (isTop) {
            gameState.deck1.push(card.cardData);
        } else {
            gameState.deck1.unshift(card.cardData);
        }

        gameState.fieldCards =
            gameState.fieldCards.filter(
                c => c.element !== card
            );

        card.remove();

        updateDeckViews();

        return;
    }


    if (isOverlapping(cardRect, deck2Rect)) {

        const isTop =
            confirm("OK:山札の上\nキャンセル:山札の下");

        if (isTop) {
            gameState.deck2.push(card.cardData);
        } else {
            gameState.deck2.unshift(card.cardData);
        }

        gameState.fieldCards =
            gameState.fieldCards.filter(
                c => c.element !== card
            );

        card.remove();

        updateDeckViews();

        return;
    }
});

    card.addEventListener("pointercancel", () => {
        dragging = false;
    });
}

function startDragging(card) {

    card.style.zIndex = ++highestZ;

    let dragging = true;

    const offsetX = CONFIG.CARD_WIDTH / 2;
    const offsetY = CONFIG.CARD_HEIGHT / 2;

    function moveHandler(ev) {

        if (!dragging) return;

        card.style.left =
            (ev.clientX - offsetX) + "px";

        card.style.top =
            (ev.clientY - offsetY) + "px";
    }

    function upHandler() {

        dragging = false;

        window.removeEventListener(
            "pointermove",
            moveHandler
        );

        window.removeEventListener(
            "pointerup",
            upHandler
        );
    }

    window.addEventListener(
        "pointermove",
        moveHandler
    );

    window.addEventListener(
        "pointerup",
        upHandler
    );
}

function isOverlapping(rect1, rect2) {

    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

function setupCardEvents(card) {

    setupCardTap(card);

    setupCardLongPress(card);
}


function toggleRotate(card) {

    const rotated =
        card.dataset.rotated === "true";

    if (rotated) {

        card.dataset.rotated = "false";

        card.style.transform =
            "rotate(0deg)";

    } else {

        card.dataset.rotated = "true";

        card.style.transform =
            "rotate(90deg)";
    }
}

function setupCardTap(card) {

    let tapTimer = null;

    card.addEventListener("click", (e) => {

        e.stopPropagation();

        if (tapTimer) {

            clearTimeout(tapTimer);

            tapTimer = null;

            toggleRotate(card);

            return;
        }

        tapTimer = setTimeout(() => {

            const faceUp =
                card.dataset.faceUp === "true";

            if (faceUp) {

                card.dataset.faceUp = "false";

                card.className = "card back";

                card.textContent = "🂠";

            } else {

                card.dataset.faceUp = "true";

                card.className = "card front";

                card.textContent =
                    card.cardData.id;
            }

            tapTimer = null;

        }, 300);
    });
}

function setupCardLongPress(card) {

    let timer = null;
    let moved = false;

    card.addEventListener("pointerdown", () => {

        moved = false;

        timer = setTimeout(() => {

            if (!moved) {

                showCardPreview(card);
            }

        }, 500);
    });

    card.addEventListener("pointermove", () => {

        moved = true;

        clearTimeout(timer);
    });

    card.addEventListener("pointerup", () => {

        clearTimeout(timer);
    });

    card.addEventListener("pointercancel", () => {

        clearTimeout(timer);
    });
}

function showCardPreview(card) {

    let preview =
        document.getElementById("card-preview");

    if (!preview) {

        preview = document.createElement("div");

        preview.id = "card-preview";

        preview.innerHTML = `
            <button id="close-preview">
                ×
            </button>

            <div id="preview-card"></div>
        `;

        document.body.appendChild(preview);

        document
            .getElementById("close-preview")
            .addEventListener("click", () => {

                hideCardPreview();
            });
    }

    preview.style.display = "flex";

    const previewCard =
        document.getElementById("preview-card");

    previewCard.textContent =
        card.textContent;

    if (card.classList.contains("back")) {

        previewCard.className = "back";

    } else {

        previewCard.className = "front";
    }
}

function hideCardPreview() {

    const preview =
        document.getElementById("card-preview");

    if (preview) {

        preview.style.display = "none";
    }
}