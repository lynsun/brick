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
		   this.shootable=false;//�Ƿ�������
		   this.length="normal"//��ʼ״̬Ϊnormal������ֵ������lengthen
		   gameManager["boardNormalwidth"]=this.width;
	   },
	   //�����Լ���x,y,imageʹ��ctx����
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
	   //����ƽ����ٶ�
	   calculateSpeed:function(){
	       this.vx=(this.x-this.oldX)*0.1;
		   this.oldX=this.x;
	   },
	   //�����
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
	   //����Է����ӵ�
	   enableShoot:function(){
	         this.shootable=true;
			 if(!Board.shoot){
			     Board.shoot=this.shoot.bind(this);
			 }
			 gameManager["playground"].elem.addEventListener("click",Board.shoot,false);
	   },
	   //��ֹ����
	   disableShoot:function(){
	         this.shootable=false;
			 gameManager["playground"].elem.removeEventListener("click",Board.shoot,false);
	   },
	   //�����ӵ�
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
	   //����屻ש��ײ��
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