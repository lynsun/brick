if(!window.gameManager){
    window.gameManager={};
}
//������
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
		gameManager["playground"].elem.removeEventListener("click",gameManager.mouseClickListener,false);
	}
    return {
	   //��ʼ��id,elem,width,height,image,canvas
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
	   //���Ƴ���
	   draw:function(ctx){
	       ctx.fillRect(0,0,gameManager["stageWidth"],gameManager["stageHeight"]);
	       if(this.image){
		      ctx.drawImage(this.image,this.x,this.y);
		   }
	   },
	   //����
	   renderTo:function(elem){
	       if(!elem){
               elem=document.body;
		   }
		   elem.appendChild(this.elem);
	   },
	   //���С���Ƿ���ײǽ��
	   hitTestPlayground:function(ball){
	       //�ϱ߽�
		   if(ball.y<=ball.radius){
		       ball.y=ball.radius;
			   ball.vy*=-1;
		   }
		   //��߽�
		   if(ball.x<=ball.radius){
		       ball.vx*=-1;
		   }
		   //�ұ߽�
		   if(ball.x+ball.radius>this.width){
		       ball.vx*=-1;
		   }
		   //�±߽�
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

//ƽ����
function Board(config){
    this.init(config);
}
Board.prototype=function(){
    return {
	   init:function(config){
	       this.x=config.x||0;
           this.y=config.y||0;
		   this.width=config.width||50;
		   this.height=config.height||50;
		   this.oldX=this.x;//��¼ƽ�����һ֡��λ��
		   this.vx=0;
           if(config.src){
		     this.image=new Image();
			 this.image.src=config.src;
		   } 
           this.attachable=false;//�Ƿ�����סС��		   
	   },
	   //�����Լ���x,y,imageʹ��ctx����
	   draw:function(ctx){
		   if(this.image){
		       ctx.drawImage(this.image,this.x,this.y);
		   }else{
		       ctx.fillStyle = "rgba(200,0,0,0.5)";
			   ctx.fillRect(this.x,this.y,this.width,this.height);
		   }
	   },
	   //����ƽ����ٶ�
	   calculateSpeed:function(){
	       this.vx=(this.x-this.oldX)*0.1;
		   this.oldX=this.x;
	   }
	}
}();

//С����
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
	   //ʹ��ctx����
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
	   //�˶���
	   move:function(){
	       if(this.moveable){
		      this.x+=this.vx;
		      this.y+=this.vy;
			  console.log(this.vx+","+this.vy);
		   }
	   },
	   //�����˶�
	   enableMove:function(){
	      this.moveable=true;
	   },
	   //��ֹ�˶�
	   disableMove:function(){
	      this.moveable=false;
	   },
	   //���¿�ʼ�˶�(���뱻�ס��״̬)
	   leaveBoard:function(){
		    this.enableMove();
		    this.vx=gameManager["ballDefaultVx"];
		    this.vy=gameManager["ballDefaultVy"];
	   },
	   //����Ƿ���ײƽ��
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
	   //����Ƿ���ײ��ש��
	   hitTestBricks:function(){
	        var i=0;
			var bricks=gameManager["bricks"];
			var hit=false;
			for(var i=0;i<bricks.length;i++){
			  if(bricks[i].down){
			      continue;//��Ҫ�����ש���Ѿ���ײ����ʧȥ��ײ���
			  }
			  var hitInfo=circleHitRectangle(this,bricks[i]);
			  if(hitInfo.hit){
				   bricks[i].down=true;
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

//ש����
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
		   this.down=false;//�Ƿ񱻻��У�������down=true,��ʧȥ��ײ���
           this.vy=0;
           this.ay=config.ay||0;		   
	   },
	   //ʹ��ctx����
	   draw:function(ctx){
		   if(this.image){
		      ctx.drawImage(this.image,this.x,this.y);
		   }else{
		      ctx.fillStyle="rgb(200,200,200)";
		      ctx.fillRect(this.x,this.y,this.width,this.height);
			  ctx.fillStyle="rgb(236,139,0)";
		      ctx.fillRect(this.x+2,this.y+2,this.width-4,this.height-4);
		   }
	   }
	}
}();

//��ʼ��ש��
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

//�������д��ڵ�ש��
Brick.drawAll=function(ctx){
   var len=gameManager["bricks"].length;
   for(var i=0;i<len;i++){
       var brick=gameManager["bricks"][i];
	   if(brick.down){
	        brick.ay=0.01;
         	brick.vy+=brick.ay;
			brick.y+=brick.vy;
			if(brick.y>gameManager["stageHeight"]){
			     Brick.removeBrick(this);
			}
	   }
	   brick.draw(ctx);
   }
}
//�Ƴ�ָ����ש��
Brick.removeBrick=function(brick){
	for(var i=0;i<gameManager["bricks"].length;i++){
	    if(brick==gameManager["bricks"][i]){
		   gameManager["bricks"].splice(i,1);
		   return true;
		}
	}
}