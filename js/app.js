// JavaScript 语法 1
// 在画布上定位图像：
// context.drawImage(img,x,y);

// JavaScript 语法 2
// 在画布上定位图像，并规定图像的宽度和高度：
// context.drawImage(img,x,y,width,height);

// JavaScript 语法 3
// 剪切图像，并在画布上定位被剪切的部分：
// context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);

// 初始化
window.onload = init;
// 鼠标移动
window.onmousemove = mouseMoveHandler;

var context;

var cW = 520;
var cH = 800;
var bgH = 1400;
function init(){
	console.log("开始");
	var canvas = document.getElementById("gameCanvas");
	context = canvas.getContext("2d");
	// 游戏背景
	bg = loadImage("res/map/map0.jpg");
	bg2 = loadImage("res/map/map0.jpg");
	crtBg = bg;
	nextBg = bg2;
	// 玩家背景
	player.img = loadImage("res/player/p1-1.png");
	// 添加循环机制
	setInterval(loop,1000/60);
}

// ------------------------ 游戏主循环逻辑 ------------------------ 
var count = 0;
function loop(){
	count++;
	// 清屏
	clearScreen();
	// 绘制背景
	drawBG();
	// 绘制玩家
	drawPlayer();
	// 生成玩家子弹
	playerShoot(count);
	// 绘制玩家子弹
	drawPlayerBullets();
	// 生成敌人
	spawnEnemy();
	// 绘制敌人
	drawEnemy();
	// 碰撞检测
	hitTest();
	// 绘制爆炸
	drawExplosion();
}

// ------------------------ 爆炸效果 ------------------------ 
var explosionArr = [];
// 加载爆炸图片
function explode(x,y){
	var explosion = {};
	explosion.img = loadImage("res/effect/boom01.png");
	explosion.w = 90;
	explosion.h = 100;
	var ran = (1 + Math.random()) * 0.5;
	explosion.wR = explosion.w * ran;
	explosion.hR = explosion.h * ran;
	explosion.x = x - explosion.wR/2;
	explosion.y = y - explosion.hR/2;
	explosion.i = 0;
	explosionArr.push(explosion);
}
// 绘制爆炸
function drawExplosion(){
	for (var i = explosionArr.length - 1; i >= 0; i--) {
		var explosion = explosionArr[i];
		if(explosion.i < 6){
			var explosionClipX = explosion.w * explosion.i;
			context.drawImage(explosion.img,
			explosionClipX,0,explosion.w,explosion.h,
			explosion.x,explosion.y,explosion.wR,explosion.hR);
			explosion.i = explosion.i + 1;
		}else{
			explosionArr.splice(i,1);
		}
	}
}

// ------------------------ 碰撞检测 ------------------------ 
function hitTest(){
	hitTestPlayerBulletAndEnemies();
}
// 检测 玩家子弹 & 敌人
function hitTestPlayerBulletAndEnemies(){
	// 玩家子弹
	for (var i = playerBullets.length - 1; i >= 0; i--) {
		var bullet = playerBullets[i];
		// 敌人
		for (var j = enemyArr.length - 1; j >= 0; j--) {
			var enemy = enemyArr[j];
			if(hitTestObject(enemy,bullet)){
				explode(bullet.x,bullet.y);
				playerBullets.splice(i,1);
				enemyArr.splice(j,1);
				break;
			}
		}
	}
}
function hitTestObject(obj1,obj2){
	return hitTestPoint(obj1.x,obj1.y,obj2.x,obj2.y,obj1.w,obj1.h);
}
// 检测方法
function hitTestPoint(x1,y1,x2,y2,w1,h1){
	if(x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1){
		return true;
	}else{
		return false;
	}
}


// ------------------------ 敌人飞机 ------------------------ 
var enemyArr = []; 	//敌人集合
// 生成敌人
function spawnEnemy(){
	var enemy = {};
	enemy.i = parseInt(Math.random() * 12 );
	enemy.img = loadImage("res/enemy/ep_"+enemy.i+".png");
	enemy.h = 30 * (1 + Math.random());
	enemy.w = enemy.h * (1 + Math.random());
	enemy.x = (cW - enemy.w) * Math.random();
	enemy.y = 0;
	enemy.vx = 0;
	enemy.vy = 1 + 5 * Math.random();
	enemy.hp = 100;
	enemy.qty = 2;   //每秒飞机数量
	enemy.qtys = Math.ceil(60/enemy.qty);
	if(count % enemy.qtys == 0){
		enemyArr.push(enemy);
	}
}
// 绘制敌人
function drawEnemy(){
	for (var i = enemyArr.length - 1; i >= 0; i--) {
		var enemy = enemyArr[i];
		enemy.x += enemy.vx;
		enemy.y += enemy.vy;
		if(enemy.y > cH){
			enemyArr.splice(i,1);
			continue;
		}
		context.drawImage(enemy.img,
		enemy.x,enemy.y,enemy.w,enemy.h);
	}
}

// ------------------------ 生成玩家子弹 ------------------------ 
var playerBullets = []; 	//子弹集合
// 生成玩家子弹
function playerShoot(){
	var bullet = {};
	bullet.img = loadImage("res/bullet/3-1.png");
	bullet.w = 16;
	bullet.h = 16;
	bullet.x = player.x + player.w/2 - bullet.w/2;
	bullet.y = player.y - bullet.h;
	bullet.vx = 0;
	bullet.vy = -10;
	bullet.qty = 5;   //每秒子弹数量
	bullet.qtys = Math.ceil(60/bullet.qty);
	if(count % bullet.qtys == 0){
		playerBullets.push(bullet);
	}
}
// 绘制玩家子弹
function drawPlayerBullets(){
	for (var i = playerBullets.length - 1; i >= 0; i--) {
		var bullet = playerBullets[i];
		bullet.x += bullet.vx;
		bullet.y += bullet.vy;
		if(bullet.y < 0){
			playerBullets.splice(i,1);
			continue;
		}
		var bulletClipX = (i % 2 == 0) ? 0 : 16;
		context.drawImage(bullet.img,
		bulletClipX,0,bullet.w,bullet.h,
		bullet.x,bullet.y,bullet.w,bullet.h);
	}
}

// ------------------------ 玩家控制 ------------------------ 
var player = {};			//玩家飞机
player.w = 60;		//玩家飞机宽度
player.h = 70;		//玩家飞机高度
player.x = 100;
player.y = 300;		//玩家飞机坐标
player.i = 0;		//玩家飞机素材切片索引
// 绘制玩家
function drawPlayer(){
	var playerClipX = player.w * player.i;
	context.drawImage(player.img,
	playerClipX,0,player.w,player.h,
	player.x,player.y,player.w,player.h);
	player.i = (player.i + 1) % 4;
}
// 鼠标移动玩家
function mouseMoveHandler(e){
	player.x = e.x - player.w / 2;
	player.y = e.y - player.h / 2;
}

// ------------------------ 背景滚动 ------------------------ 
var bg,bg2;
var crtBg,nextBg;
var bgMoveSpeed = 1; 	//背景移动速度
var crtBgY = cH-bgH; 
function drawBG(){
	crtBgY += bgMoveSpeed;
	context.drawImage(crtBg,0,crtBgY);
	context.drawImage(nextBg,0,crtBgY-bgH);
	if(crtBgY==cH){
		crtBgY = cH-bgH;
	}
}

// ------------------------ 其他 ------------------------ 
// 清理全部
function clearScreen(){
	context.clearRect(0,0,cW,cH);
}
// 加载图片
function loadImage(src){
	var img = new Image();
	img.src = src;
	return img;
}