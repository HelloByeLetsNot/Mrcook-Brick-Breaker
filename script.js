const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const ballImage = new Image();
ballImage.src = 'https://media.discordapp.net/attachments/891069113458360320/1246696900317544559/1717306090565.png?ex=665d5477&is=665c02f7&hm=b43fb257680d4cad33803c13462cab41afdf48f7a10a89df077010c0e44a29f5';

const brickImages = [
    'https://cdn.discordapp.com/attachments/891069113458360320/891698638517067856/Screenshots_2021-09-26-07-51-43.png?ex=665d2fd2&is=665bde52&hm=c6c0705b311d8d60efc0c4ea4995dd0e7848b4ffe268cf3a1147723feae932db&',
    'https://cdn.discordapp.com/attachments/891069113458360320/891700900580687952/Screenshots_2021-09-26-08-00-53.png?ex=665d31ed&is=665be06d&hm=4b7b5f858c01f43c44b974b7d0f7c294f5333a8ddaad7af024e07cb982a86017&',
    'https://cdn.discordapp.com/attachments/891069113458360320/893685797725810698/1633141629311.png?ex=665d2a42&is=665bd8c2&hm=ec5f1f79e0b4c501457a1ba063d4c57a67cc3dbc93e9f7e334692ce59339b0c0&'
];

let score = 0;
let lives = 3;
const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, image: new Image() };
        bricks[c][r].image.src = brickImages[(c + r) % brickImages.length];
    }
}

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 2,
    dy: 2,
    radius: 30, // 50% bigger than the previous 20
    draw: function () {
        ctx.drawImage(ballImage, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    },
    update: function () {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y - this.radius < 0) {
            this.dy = -this.dy;
        } else if (this.y + this.radius > canvas.height) {
            if (this.x > paddle.x && this.x < paddle.x + paddle.width) {
                this.dy = -this.dy;
            } else {
                lives--;
                if (lives === 0) {
                    alert("Game Over");
                    document.location.reload();
                } else {
                    this.reset();
                }
            }
        }

        this.checkCollisionWithBricks();
    },
    checkCollisionWithBricks: function () {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r];
                if (b.status === 1) {
                    if (this.x > b.x && this.x < b.x + brickWidth && this.y > b.y && this.y < b.y + brickHeight) {
                        this.dy = -this.dy;
                        b.status = 0;
                        score++;
                        if (score === brickRowCount * brickColumnCount) {
                            alert("Did you see that actavis?");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    },
    reset: function () {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.dx = 2;
        this.dy = -2;
    }
};

const paddle = {
    height: 10,
    width: 75,
    x: (canvas.width - 75) / 2,
    draw: function () {
        ctx.beginPath();
        ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    },
    moveLeft: function () {
        this.x -= 7;
        if (this.x < 0) {
            this.x = 0;
        }
    },
    moveRight: function () {
        this.x += 7;
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
    }
};

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.drawImage(bricks[c][r].image, brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    ball.draw();
    ball.update();
    paddle.draw();
    drawScore();
    drawLives();
    requestAnimationFrame(draw);
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Right" || event.key === "ArrowRight") {
        paddle.moveRight();
    } else if (event.key === "Left" || event.key === "ArrowLeft") {
        paddle.moveLeft();
    }
});

ballImage.onload = function () {
    draw();
};