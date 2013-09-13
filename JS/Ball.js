//小球类
function Ball(config){
    this.init(config);
}
Ball.prototype=function(){
    return {
	   init:function(config){
	       this.x=config.x||0;
           this.y=config.y||0;
           if(config.src){
		     this.image=new Image();
			 this.image.src=config.src;
		   }   
           this.vx=config.vx||0;
           this.vy=config.vy||0;
		   this.radius=config.radius||2.5;
		   this.distanceBoard=gameManager["board"].width/2,
           this.moveable=false;		   
	   },
	   //使用ctx绘制
	   draw:function(ctx){
	       if(this.image){
		      ctx.drawImage(this.image,this.x,this.y);
		   }else{
		      ctx.fillStyle="rgb(255,255,0)";
			  ctx.beginPath();
			  ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
			  ctx.fill();
		   }
	   },
	   //运动中
	   move:function(){
	       if(this.moveable){
		      this.x+=this.vx;
		      this.y+=this.vy;
		   }
	   },
	   //开启运动
	   enableMove:function(){
	      this.moveable=true;
	   },
	   //禁止运动
	   disableMove:function(){
	      this.moveable=false;
	   },
	   //重新开始运动(脱离被黏住的状态)
	   leaveBoard:function(){
		    this.enableMove();
		    this.vx=gameManager["ballDefaultVx"];
		    this.vy=gameManager["ballDefaultVy"];
	   },
	   //检测是否碰撞平板
	   hitTestBoard:function(){
	       var board=gameManager["board"];
	       var hitInfo=circleHitRectangle(this,board);
		   if(hitInfo.hit){
		      if(board.attachable){
				  this.vx=0;
				  this.vy=0;
				  this.distanceBoard=this.x-board.x;
				  this.y=board.y-this.radius;
				  this.disableMove();
				  gameManager["playground"].elem.addEventListener("click",gameManager.mouseClickListener,false);
			  }else{
			      if(hitInfo.horizontal){
				    this.vx*=-1;
                    this.vy*=-1;				  
			      }
			      if(hitInfo.vertical){
				    this.y=board.y-this.radius;
				    this.vy*=-1;
				    this.vx+=board.vx;
			      }		  
			  }
		   }
	   },
	   
	   //检测是否碰撞到砖块
	   hitTestBricks:function(){
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
				   brick.down=true;
				   var gm=gameManager["brickType"];
				   brick.type=[gm["normal"],gm["transform"],gm["attach"],gm["shoot"]][Math.floor(Math.random()*4)];
				   if(hitInfo.horizontal)
				      this.vx*=-1;
				   if(hitInfo.vertical)
				      this.vy*=-1;
				   break;
			  }
			}
	   }
	}
}();