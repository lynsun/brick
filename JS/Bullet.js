//子弹类
function Bullet(config){
     this.init(config);
}
Bullet.prototype=function(){
    return {
	   init:function(config){
	       this.x=config.x||0;
           this.y=config.y||0;
		   this.radius=config.radius||3;
		   this.vy=config.vy||-1;
           if(config.src){
		     this.image=new Image();
			 this.image.src=config.src;
		   }
		   this.exist=true;//是否还存在
	   },
	   draw:function(ctx){
	       if(this.image){
		       ctx.drawImage(this.image,this.x,this.y);
		   }else{
		       ctx.fillStyle = "rgb(255,255,255)";
			   ctx.beginPath();
			   ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
			   ctx.fill();
		   }
	   },
	   //子弹移动
	   move:function(){
	       this.y+=this.vy;
		   this.hitTestBrick();
		   this.hitTestPg();
	   },
	   //检测是否碰撞砖块
	   hitTestBrick:function(){
	        var i=0;
			var bricks=gameManager["bricks"];
			var hit=false;
			for(var i=0;i<bricks.length;i++){
			  var brick=bricks[i];
			  if(brick.down){
			      continue;//重要，如果砖块已经碰撞，则失去碰撞体积
			  }
			  var hitInfo=circleHitRectangle(this,brick);
			  if(hitInfo.hit){
				   this.exist=false;
				   Brick.removeBrick(brick);
				   break;
			  }
			}
	   },
	   //检测是否碰撞墙壁
	   hitTestPg:function(){
	        if(this.y-this.radius<0){
			     this.exist=false;
			}
	   }
	}
}();
//绘制所有存在的子弹
Bullet.drawAll=function(ctx){
   var bullets=gameManager["bullets"];
   for(var i=0;i<bullets.length;i++){
       var bullet=bullets[i];
	   if(bullet.exist){
	       bullet.draw(ctx)
	   }else{
	       Bullet.removeBullet(bullet);
	   }
   }
}

//移除指定的子弹
Bullet.removeBullet=function(bullet){
    var bullets=gameManager["bullets"];
	for(var i=0,n=bullets.length;i<n;i++){
	    if(bullet==bullets[i]){
		   bullets.splice(i,1);
		   return true;
		}
	}
}
	