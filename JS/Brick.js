/*
     砖块类
*/
function Brick(config){
     this.init(config);
}
Brick.prototype=function(){
    return {
	   init:function(config){
		   this.id=config.id||gameManager["GUID"]++;
	       this.x=config.x||0;
           this.y=config.y||0;
		   this.width=config.width||50;
		   this.height=config.height||50;
           this.image=config.image||null;	 
		   this.down=false;//是否被击中，被击中down=true,并失去碰撞体积
           this.vy=config.vy||0;
           this.ay=config.ay||0;
		   this.type=config.type||"normal";
	   },
	   //使用ctx绘制
	   draw:function(ctx){
		   if(this.image){
		      ctx.drawImage(this.image,this.x,this.y);
		   }else{
			  ctx.fillStyle="rgb(200,200,200)";
		      ctx.fillRect(this.x,this.y,this.width,this.height);
			  switch(this.type){
			       case "normal":     ctx.fillStyle="rgb(236,139,0)";break;
				   case "transform":   ctx.fillStyle="rgb(0,0,255)";break;
				   case "attach":      ctx.fillStyle="rgb(0,255,0)";break;
				   case "shoot":       ctx.fillStyle="rgb(255,255,0)";break;
				   default: ctx.fillStyle="rgb(236,139,0)";break;
			  }
		      ctx.fillRect(this.x+2,this.y+2,this.width-4,this.height-4);
		   }
	   }
	}
}();

//初始化砖块
Brick.initBricks=function(){
            var count=0;
	        gameManager["bricks"]=[];
			var brickImage=new Image();
			brickImage.src=gameManager["brickImage"];
			for(var i=0;i<gameManager["brickRows"];i++){
			    for(var j=0;j<gameManager["brickCols"];j++){
				    var brick=new Brick({
					    id:count++,
					    x:65+j*35,
						y:15*i,
						width:35,
						height:15
						//image:brickImage
					});
					gameManager["bricks"].push(brick);
				}
			}
			
}

//绘制所有存在的砖块
Brick.drawAll=function(ctx){
   var board=gameManager["board"];
   for(var i=0;i<gameManager["bricks"].length;i++){
       var brick=gameManager["bricks"][i];
	   if(brick.down){
	        brick.ay=0.005;
         	brick.vy+=brick.ay;
			brick.y+=brick.vy;
			if(hitTestRectangle(brick,board)){
				 board.hitByBrick(brick);
				 Brick.removeBrick(brick);
				 i--;
				 console.log("hit");
				 continue;
			}
	   }
	   brick.draw(ctx);
   }
}
//移除指定的砖块
Brick.removeBrick=function(brick){
	for(var i=0;i<gameManager["bricks"].length;i++){
	    if(brick==gameManager["bricks"][i]){
		   gameManager["bricks"].splice(i,1);
		   return true;
		}
	}
}