//��ȡԪ�ص�������   
function getTop(e){   
            var offset=e.offsetTop;   
            if(e.offsetParent!=null) offset+=getTop(e.offsetParent);   
            return offset;   
}   

//��ȡԪ�صĺ�����   
function getLeft(e){   
            var offset=e.offsetLeft;   
            if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);   
            return offset;   
}
/*
   �������ε���ײ���
   �������α������x,y,width,height����
*/
function hitTestRectangle(rect1,rect2){
    var c1x=rect1.x+rect1.width/2;
	var c1y=rect1.y+rect1.height/2;
	var c2x=rect2.x+rect2.width/2;
	var c2y=rect2.y+rect2.height/2;
	var w=rect1.width/2+rect2.width/2;
	var h=rect1.height/2+rect2.height/2;
	if((Math.abs(c1x-c2x)<w)&&(Math.abs(c1y-c2y)<h)){
		      return true;
	}
}
/*
   Բ�κ;��ε���ײ
   c:Բ����
   r:���ζ���
   ����һ��json:{hit:true,horizontal:true,vertical:true}
   */
function circleHitRectangle(c,r){
	var json={hit:false,horizontal:false,vertical:false};
	if((Math.abs(c.x-r.x-r.width/2)<(c.radius+r.width/2))&&(Math.abs(c.y-r.y-r.height/2)<(c.radius+r.height/2))){
	     //������ײ
		 json.hit=true;
		 if((c.y<(r.y+r.height))&&(c.y>r.y)){
		     json.horizontal=true;//ˮƽ������ײ
		 }else if((c.x>r.x)&&(c.x<(r.x+r.width))){
		     json.vertical=true;//��ֱ������ײ
		 }else{
		     json.horizontal=true;
			 json.vertical=true;
		 }
	}
	return json;
}
/*
   Ϊ������this�Ͳ���
*/
Function.prototype.bind = function() {
    var __method = this;
    var args = Array.prototype.slice.call(arguments);
    var object=args.shift();
    return function() {
        return __method.apply(object,
             args.concat(Array.prototype.slice.call(arguments)));
}
}