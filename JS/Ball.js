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
			  var brick=bricks[i];
			  if(brick.down){
			      continue;//��Ҫ�����ש���Ѿ���ײ����ʧȥ��ײ���
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