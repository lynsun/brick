//平板类
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
		   this.oldX=this.x;//记录平板的上一帧的位置
		   this.vx=0;
           if(config.src){
		     this.image=new Image();
			 this.image.src=config.src;
		   } 
           this.attachable=false;//是否可以黏住小球		
		   this.shootable=false;//是否可以射击
		   this.length="normal"//初始状态为normal，其他值可以是lengthen
		   gameManager["boardNormalwidth"]=this.width;
	   },
	   //根据自己的x,y,image使用ctx绘制
	   draw:function(ctx){
		   if(this.image){
		       ctx.drawImage(this.image,this.x,this.y);
		   }else{
		       ctx.fillStyle = "rgba(200,0,0,0.5)";
			   ctx.fillRect(this.x,this.y,this.width,this.height);
		   }
		   if(this.shootable){
		       ctx.fillStyle="rgb(255,255,0)";
		       ctx.fillRect(this.x+10,this.y-15,5,15);
			   ctx.fillRect(this.x+this.width-10,this.y-15,5,15);
		   }
	   },
	   //计算平板的速度
	   calculateSpeed:function(){
	       this.vx=(this.x-this.oldX)*0.1;
		   this.oldX=this.x;
	   },
	   //板变形
	   transform:function(){
	         if(this.length=="lengthen"){
			       if(this.width<2*gameManager["boardNormalwidth"]){
				       this.width++;
					   this.x--;
				   }else{
				       this.length="normal";
				   }
			 }else  if(this.length=="shorten"){
				   if(this.width>gameManager["boardNormalwidth"]){
				       this.width--;
					   this.x++;
				   }else{
				       this.length="normal";
				   }
			 }
	   },
	   //板可以发射子弹
	   enableShoot:function(){
	         this.shootable=true;
			 if(!Board.shoot){
			     Board.shoot=this.shoot.bind(this);
			 }
			 gameManager["playground"].elem.addEventListener("click",Board.shoot,false);
	   },
	   //禁止发射
	   disableShoot:function(){
	         this.shootable=false;
			 gameManager["playground"].elem.removeEventListener("click",Board.shoot,false);
	   },
	   //发射子弹
	   shoot:function(){
	         console.log("shoot");
			 var bullet1=new Bullet({
			      x:this.x+10+3,
				  y:this.y-15-3,
				  radius:3,
				  vy:-3
			 });
			 
			 var bullet2=new Bullet({
			      x:this.x+this.width-10-3,
				  y:this.y-15-3,
				  radius:3,
				  vy:-3
			 });
			 gameManager["bullets"].push(bullet1);
			 gameManager["bullets"].push(bullet2);
			 
	   },
	   //处理板被砖块撞击
	   hitByBrick:function(brick){
	        switch(brick.type){
			     case "normal":break;
				 case "transform":this.length=(this.width==gameManager["boardNormalwidth"])?"lengthen":"shorten";break; 
				 case "attach":this.attachable=this.attachable?false:true;break;
				 case "shoot":this.shootable?this.disableShoot():this.enableShoot();break;
				 default:break;
			}
	   }

	}
}();