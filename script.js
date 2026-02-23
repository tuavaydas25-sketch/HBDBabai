const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.5;

// CANVAS BACKGROUND
const canvas=document.getElementById("bgCanvas");
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let stars = [];

for (let i = 0; i < 300; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 1.5 + 0.2,
        opacity: Math.random()
    });
}
let waveOffset = 0;

function drawBackground(){
ctx.clearRect(0,0,canvas.width,canvas.height);

// ⭐ Deep Cinematic Star Movement
stars.forEach(star => {

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();

    // Move downward like driving
    star.y += star.speed;

    // Reset when off screen
    if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
    }

    // Subtle twinkle
    star.opacity += (Math.random() - 0.5) * 0.05;
    if (star.opacity < 0.2) star.opacity = 0.2;
    if (star.opacity > 1) star.opacity = 1;
});

// Smooth moving ocean
waveOffset += 0.02;
ctx.fillStyle = "rgba(0,31,63,0.9)";

ctx.beginPath();
ctx.moveTo(0,canvas.height-100);
for(let x=0;x<canvas.width;x++){
ctx.lineTo(
x,
canvas.height-100 + Math.sin(x*0.01 + waveOffset) * 10
);
}
ctx.lineTo(canvas.width,canvas.height);
ctx.lineTo(0,canvas.height);
ctx.fillStyle="#001f3f";
ctx.fill();

requestAnimationFrame(drawBackground);
}
drawBackground();
// PASSWORD
function checkPassword(){
let pass=document.getElementById("passwordInput").value;
if(pass === "iloveyou"){

    document.getElementById("passwordScreen").classList.add("hidden");
    document.getElementById("starGame").classList.remove("hidden");

    // Instant play
    bgMusic.volume = 0.5;
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});

    spawnMovingStars();

}else{
    alert("Wrong password 😜");
}
}

// STAR GAME
let collected=0;
function spawnMovingStars(){
for(let i=0;i<5;i++){
let star=document.createElement("div");
star.innerHTML="⭐";
star.style.position="absolute";
star.style.left=Math.random()*90+"%";
star.style.top=Math.random()*70+"%";
star.style.fontSize="30px";
star.style.cursor="pointer";

let move=setInterval(()=>{
star.style.left=Math.random()*90+"%";
star.style.top=Math.random()*70+"%";
},1000);

star.onclick=function(){
collected++;
star.remove();
clearInterval(move);
document.getElementById("starCount").innerText=collected+" / 5";
if(collected===5){
document.getElementById("starGame").classList.add("hidden");
document.getElementById("loveMeter").classList.remove("hidden");
}
};

document.body.appendChild(star);
}
}

// LOVE SLIDER
document.getElementById("loveSlider").oninput=function(){
document.getElementById("loveValue").innerText=this.value+"%";
if(this.value==100){
setTimeout(()=>{
document.getElementById("loveMeter").classList.add("hidden");
document.getElementById("holdScreen").classList.remove("hidden");
},1000);
}
};

// HOLD BUTTON
let holdBtn = document.getElementById("holdBtn");
let progressCircle = document.getElementById("progressCircle");
let holdDuration = 5000;
let startTime;
let animationFrame;

function startHold(e){
e.preventDefault();
startTime = Date.now();

function animate(){
let elapsed = Date.now() - startTime;
let progress = Math.min(elapsed / holdDuration, 1);
let offset = 408 - (408 * progress);
progressCircle.style.strokeDashoffset = offset;

if(progress < 1){
animationFrame = requestAnimationFrame(animate);
}else{
document.getElementById("holdStatus").innerText = "You proved your patience 💙";
setTimeout(()=>{
document.getElementById("holdScreen").classList.add("hidden");
document.getElementById("questionScreen").classList.remove("hidden");
showQuestions();
},1000);
}
}

animate();
}

function stopHold(){
if(animationFrame){
cancelAnimationFrame(animationFrame);
animationFrame = null;
}
progressCircle.style.strokeDashoffset = 408;
}
holdBtn.addEventListener("mousedown", startHold);
holdBtn.addEventListener("mouseup", stopHold);
holdBtn.addEventListener("mouseleave", stopHold);
holdBtn.addEventListener("touchstart", startHold);
holdBtn.addEventListener("touchend", stopHold);

// QUESTIONS
const questions=[
"What was your first thought about me? 💭",
"What is your favorite memory with me? ✨",
"When do you miss me the most? 💕",
"What makes you smile about us? 😊",
"Are you ready for your surprise? 💙"
];

let currentQuestion=0;

function showQuestions(){
document.getElementById("questionText").innerText=questions[currentQuestion];
}

function nextQuestion(){
let ans=document.getElementById("answerInput").value;
if(ans.trim()===""){
alert("You must write something 😌");
return;
}
document.getElementById("answerInput").value="";
currentQuestion++;

if(currentQuestion<questions.length){
showQuestions();
}else{
document.getElementById("questionScreen").classList.add("hidden");
bigMessage();
}
}

function bigMessage(){

let message=document.createElement("div");
message.className="screen";
message.id="bigMessage";

message.innerHTML=`
<h2 id="typedText"></h2>
<button id="continueBtn" style="display:none;">Continue ✨</button>
`;

document.body.appendChild(message);

let text = `
Babai… 💙

From the moment you entered my life,
everything felt different.

You didn’t just stay —
you became my favorite part of every day.

And today, I celebrate you.
`;


typeWriter(text, "typedText", 70, () => {
document.getElementById("continueBtn").style.display="block";
});

document.getElementById("continueBtn").onclick = fakeReveal;
}

function typeWriter(text, elementId, speed, callback){
let i = 0;
let element = document.getElementById(elementId);
element.innerHTML = "";
element.style.opacity = 1;

function typing(){
if(i < text.length){
element.innerHTML += text.charAt(i);
i++;

let randomSpeed = speed + Math.random()*40; // natural typing feel
setTimeout(typing, randomSpeed);
}else{
if(callback) callback();
}
}
typing();
}

function fakeReveal(){

document.getElementById("bigMessage").remove();

let fake=document.createElement("div");
fake.className="screen";
fake.id="fakeScreen";

fake.innerHTML=`
<h2>✨ GRAND REVEAL ✨</h2>
<p style="margin-top:20px;">Preparing something unforgettable...</p>
`;

document.body.appendChild(fake);

setTimeout(()=>{
fake.innerHTML=`
<h2>Almost there... 😌</h2>
<p>But first... one sweet moment.</p>
<button onclick="cakeScene()">Continue 💙</button>
`;
},3000);
}


function cakeScene(){

document.getElementById("fakeScreen").remove();

let cake=document.createElement("div");
cake.className="screen";
cake.id="cakeScreen";

cake.innerHTML=`
<h2 style="font-family:'Parisienne',cursive;font-size:2rem;">
Make a wish and cut the cake 
</h2>
<div id="cake">🎂</div>
<p>Tap the cake to cut it</p>
`;

document.body.appendChild(cake);

document.getElementById("cake").onclick = function(){

    this.innerHTML = "🍰";
    this.style.transform = "scale(1.2)";

    setTimeout(() => {
        document.getElementById("cakeScreen").remove();
        smoothReveal();
    }, 800);   // shorter delay
};
}

function smoothReveal(){

    let overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "#000";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 1.5s ease";
    overlay.style.zIndex = "9999";

    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.style.opacity = "1";
    });

    setTimeout(() => {
        reveal();
        overlay.style.opacity = "0";
    }, 1500);

    setTimeout(() => {
        overlay.remove();
    }, 3000);
}


function reveal(){

let content=document.getElementById("mainContent");
content.classList.remove("hidden");
document.body.style.overflow="auto";

let lines = [
"Happy Birthday My Beautiful Babai 💙",
"You are my calm.",
"My chaos.",
"My Greece under a starry sky.",
"And I will always choose you."
];

let container=document.querySelector(".birthday-text");
container.innerHTML="";

lines.forEach((line,index)=>{
let div=document.createElement("div");
div.className="dropLine";
div.style.animationDelay=(index*0.8)+"s";
div.innerText=line;
container.appendChild(div);
});


animatePhotos();

}

function animatePhotos(){

let photos = document.querySelectorAll(".gallery img");

photos.forEach((photo, index) => {

    photo.style.opacity = "0";
    photo.style.transform = "translateY(80px)";
    photo.style.transition = "all 1.2s ease";

    setTimeout(() => {
        photo.style.opacity = "1";
        photo.style.transform = "translateY(0)";
    }, index * 900);

});
}


// HEARTS
function loveExplosion(){
for(let i=0;i<60;i++){
let heart=document.createElement("div");
heart.innerHTML="💖";
heart.style.position="fixed";
heart.style.left=Math.random()*100+"%";
heart.style.top="100%";
heart.style.fontSize="22px";
heart.style.animation="floatUp 3s linear";
document.body.appendChild(heart);
setTimeout(()=>{heart.remove();},3000);
}
}

// ANIMATION CSS
const style=document.createElement("style");
style.innerHTML=`
@keyframes floatUp{
0%{transform:translateY(0);opacity:1;}
100%{transform:translateY(-900px);opacity:0;}
}
@keyframes fadeOut{
0%{opacity:1;}
100%{opacity:0;}
}`;
document.head.appendChild(style);

// Stop music when page is closed or refreshed
window.addEventListener("beforeunload", function () {
    bgMusic.pause();
    bgMusic.currentTime = 0;
});

// Handle mobile background / return properly
document.addEventListener("visibilitychange", function () {

    if (document.hidden) {
        // Pause when app goes background
        bgMusic.pause();
    } else {
        // Resume only if user had already unlocked
        if (!document.getElementById("passwordScreen").classList.contains("hidden")) {
            return; // still locked, don't play
        }

        bgMusic.play().catch(() => {});
    }
});
//for full close
window.addEventListener("beforeunload", function () {
    bgMusic.pause();
});