const canvas = document.getElementById("gameCanvas")
const context = canvas.getContext("2d")

// Canvas ölçülerini ekran ölçüleri ile eşitliyoruz.
canvas.width = innerWidth
canvas.height = innerHeight

// Arkaplanı ayarlıyoruz: Burada yaptığımız şey aslında img etiketi oluşturmak
const background = new Image();
background.src = "../assets/Background.jpg";
// onload fonksiyonuna bir atama yapma sebebimiz, fotoğrafların bazen geç yüklenebilmesidir
background.onload = () => {
    context.drawImage(background, 0, 0)
}

// Bir oyuncu sınıfı oluşturuyoruz.
class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0

        const image = new Image()
        image.src = "../assets/Plane.png"
        image.onload = () => {
            this.image = image
            this.width = image.width * .05
            this.height = image.height * .05

            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    // Bu fonksiyon uçağın her bir adımda çizilebilmesini sağlıyor.
    draw() {
        context.save()

        context.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2)

        context.rotate(this.rotation)

        context.translate(
            -player.position.x - player.width / 2,
            -player.position.y - player.height / 2)

        context.drawImage(
            this.image,
            this.position.x, this.position.y,
            this.width, this.height)

        context.restore()
    }

    // Bu her bir adımda uçağı tekrar çizmemizi sağlayan fonksiyon.
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}

const player = new Player()
const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    }
}

// Tuşlara basıldığının anlaşılmasını sağlayan eventListener
addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'a':
            keys.a.pressed = true
            break;
        case 'd':
            keys.d.pressed = true
            break;
        case 'w':
            keys.w.pressed = true
            break;
        case 's':
            keys.s.pressed = true
            break;

        default:
            break;
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
            keys.a.pressed = false
            break;
        case 'd':
            keys.d.pressed = false
            break;
        case 'w':
            keys.w.pressed = false
            break;
        case 's':
            keys.s.pressed = false
            break;

        default:
            break;
    }
})

function movePlayer() {
    if (keys.a.pressed && (player.position.x > 0)) {
        player.velocity.x = -5
        player.rotation = -0.15
    } else if (keys.d.pressed && ((player.position.x + player.width) < canvas.width)) {
        player.velocity.x = +5
        player.rotation = 0.15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }

    if (keys.w.pressed && player.position.y > 0) {
        player.velocity.y = -5
    } else if (keys.s.pressed && ((player.position.y + player.height) <= canvas.height)) {
        player.velocity.y = +5
    } else {
        player.velocity.y = 0
    }
}

const gameSpeed = 3

class Obstacle {
    constructor(x, imageSource) {
        this.x = x;
        this.y = 0
        this.dy = +gameSpeed;

        const image = new Image()
        image.src = imageSource
        image.onload = () => {
            this.image = image
            this.w = image.width * .6
            this.h = image.height * .6
        }
    }

    update() {
        this.y += this.dy;
        this.draw();
        this.dy = +gameSpeed;
    }

    draw() {
        context.drawImage(
            this.image,
            this.x, this.y,
            this.w, this.h)
    }
}

const obstacles = ["../assets/BigCloud.png", "../assets/SmallCloud.png"]

function start() {
    requestAnimationFrame(update)
}

let createdObstacles = []
let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;
function update() {
    requestAnimationFrame(update)
    context.drawImage(background, 0, 0)
    player.update()
    movePlayer()


    spawnTimer--;
    if (spawnTimer <= 0) {
        // 0 veya bir döndürür. Böylece büyük veya küçük bulut engel olarak karşımıza çıkar.
        let randomIndex = Math.floor(Math.random() * 2);
        currentObstacle = obstacles[randomIndex]

        // random bir alanda oluştur.
        let randomXAxisValue = Math.floor(Math.random() * canvas.width)
        let obstacle = new Obstacle(randomXAxisValue, currentObstacle)
        createdObstacles.push(obstacle)

        spawnTimer = initialSpawnTimer - gameSpeed * 8;

        if (spawnTimer < 60) {
            spawnTimer = 60;
        }
    }

    for (let i = 0; i < createdObstacles.length; i++) {
        let o = createdObstacles[i];
        o.update();
    }
}

start()

