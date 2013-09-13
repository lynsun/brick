if(!window.gameManager){
    window.gameManager={};
}
//场景类
function Playground(config){
   this.init(config);
}
Playground.prototype=function(){
    gameManager.mouseMoveListener=function(e){
	    var con=gameManager["playground"].elem;
		var ball=gameManager["ball"];
		var board=gameManager["board"];
	    var mouseX=e.pageX-getLeft(con);
		if((mouseX+board.width<=gameManager["playground"].width)&&mouseX>=0){
		    gameManager["board"].x=mouseX;
		}
		if(!ball.moveable){
		    ball.x=gameManager["board"].x+ball.distanceBoard;
		}
	}
	gameManager.mouseClickListener=function(){
	    var ball=gameManager["ball"];
		ball.leaveBoard();
		console.log("leave");
		gameManager["playground"].elem.removeEventListener("click",gameManager.mouseClickListener,false);
	}
    return {
	   //初始化id,elem,width,height,image,canvas
	   init:function(config){
	       this.elem=document.createElement("div");
		   this.elem.id=config.id||"playground";
		   this.width=config.width||500;
		   this.height=config.height||500;
		   this.elem.style.width=this.width+"px";
		   this.elem.style.height=this.height+"px";
		   this.elem.style.position="relative";
		   if(config.src){
		      this.image=new Image();
		      this.image.src=config.src;
		   }
		   this.elem.innerHTML="<canvas width='"+this.width+"' height='"+this.height+"'></canvas>";
	       this.canvas=this.elem.getElementsByTagName("canvas")[0];
		   this.elem.addEventListener("mousemove",gameManager.mouseMoveListener,false);
		   this.elem.addEventListener("click",gameManager.mouseClickListener,false);
	   },
	   //绘制场景
	   draw:function(ctx){
	       ctx.fillRect(0,0,gameManager["stageWidth"],gameManager["stageHeight"]);
	       if(this.image){
		      ctx.drawImage(this.image,this.x,this.y);
		   }
	   },
	   //呈现
	   renderTo:function(elem){
	       if(!elem){
               elem=document.body;
		   }
		   elem.appendChild(this.elem);
	   },
	   //检测小球是否碰撞墙壁
	   hitTestPlayground:function(ball){
	       //上边界
		   if(ball.y<=ball.radius){
		       ball.y=ball.radius;
			   ball.vy*=-1;
		   }
		   //左边界
		   if(ball.x<=ball.radius){
		       ball.vx*=-1;
		   }
		   //右边界
		   if(ball.x+ball.radius>this.width){
		       ball.vx*=-1;
		   }
		   //下边界
		   if(ball.y+ball.radius>=this.height){
		       //game over
			   gameManager.gameOver();
		    }
	   },
	   showDialog:function(){
	       var dialog=document.createElement("div");
		   dialog.id="dialog";
		   dialog.innerHTML="<p>sorry you lose it,do you want to restart?</p><input type='button' value='restart' id='restart'/>";
		   dialog.style.cssText="z-index:100;width:200px;height:120px;background-color:Aqua;position:absolute;top:100px;left:120px;opacity:0.7";
		   var layer=document.createElement("div");
		   layer.id="layer";
		   layer.style.cssText="width:"+this.width+"px;height:"+this.height+"px;opacity:0.8;background-color:#000;z-index:10;position:absolute;left:0;top:0;";
		   this.elem.appendChild(dialog);
		   this.elem.appendChild(layer);
		   document.getElementById("restart").onclick=function(){
			   gameManager.restart();
		   }
	   }
	}
}();