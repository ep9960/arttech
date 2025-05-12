const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mainCharacter = { x: canvas.width / 2, y: canvas.height / 2, size: 80, emoji: "😞" }; // Increased size

let npcs = [];
let lifeTime = 30; // 30 seconds countdown
let hugging = false;
let hugCount = 0; // Counter for hugs

function initializeGame() {
    npcs = [];
    for (let i = 0; i < 12; i++) {
        let npc = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 50,
            emoji: "😞",
            dragging: false
        };
        npcs.push(npc);
    }
    hugCount = 0;
    lifeTime = 30; // Reset timer
    mainCharacter.emoji = "😞";
}

initializeGame();

function drawCharacter(character) {
    ctx.font = `${character.size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(character.emoji, character.x, character.y);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCharacter(mainCharacter);
    npcs.forEach(npc => drawCharacter(npc));
    
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(`Life Time: ${lifeTime.toFixed(1)}s`, canvas.width - 250, 40);
    ctx.fillText(`Hugs: ${hugCount}`, canvas.width - 250, 80);
    
    // Instruction text
    ctx.fillStyle = "yellow";
    ctx.font = "24px Arial";
    ctx.fillText("Drag to hug!", canvas.width / 2, 50);
}

function update() {
    npcs.forEach(npc => {
        const dx = npc.x - mainCharacter.x;
        const dy = npc.y - mainCharacter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mainCharacter.size / 2 + npc.size / 2) {
            if (!hugging && npc.emoji === "😞") {
                lifeTime += 3; // Add time on hug
                hugging = true;
                mainCharacter.emoji = "😊";
                npc.emoji = "😊";
                hugCount++; // Increment hug count
                showHugMessage();
                setTimeout(() => { hugging = false; }, 1000);
            }
        }
    });
    
    lifeTime -= 0.1; // Countdown timer
    if (lifeTime <= 0) {
        let message;
        if (hugCount >= 12) {
            message = "You're growing in life!";
        } else if (hugCount >= 8) {
            message = "You're maintaining your life.";
        } else if (hugCount >= 4) {
            message = "You're barely surviving life.";
        } else {
            message = "You didn't get enough hugs! Try again?";
        }
        
        let retry = confirm(`${message}\nYou got ${hugCount} hugs! Try again?`);
        if (retry) {
            initializeGame();
        } else {
            document.location.reload();
        }
    }
}

function showHugMessage() {
    ctx.fillStyle = "yellow";
    ctx.font = "40px Arial";
    ctx.fillText("+3s!", mainCharacter.x, mainCharacter.y - 50);
    setTimeout(() => { draw(); }, 500);
}

let draggingNpc = null;

canvas.addEventListener("mousedown", (e) => {
    npcs.forEach(npc => {
        const dx = e.clientX - npc.x;
        const dy = e.clientY - npc.y;
        if (Math.sqrt(dx * dx + dy * dy) < npc.size) {
            draggingNpc = npc;
        }
    });
});

canvas.addEventListener("mousemove", (e) => {
    if (draggingNpc) {
        draggingNpc.x = e.clientX;
        draggingNpc.y = e.clientY;
    }
});

canvas.addEventListener("mouseup", () => { draggingNpc = null; });

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
