export default class BitmapFactory{
    constructor(graphicData,width,height){
        this.paths = [];
        this.bitmap = [];
        this.width = width;
        this.height = height;
        this.yOff = height/1.2;
        this.bottoms = [];
       
        for(let i=0; i<graphicData.length; i++){
            const command = graphicData[i];
            if(command.type === "LINETO"){
                const p0 = graphicData[i-1].coords;
                const p1 = graphicData[i].coords;
                this.paths.push(new Path("LINETO",[p0[p0.length-1],p1[0]]));
            }
            if(command.type === "QUADTO"){
                const p0 = graphicData[i-1].coords;
                const p1 = graphicData[i].coords;
                this.paths.push(new Path("QUADTO",[p0[p0.length-1],p1[0],p1[1]]));
            }
            if(command.type === "CUBICTO"){
                const p0 = graphicData[i-1].coords;
                const p1 = graphicData[i].coords;
                this.paths.push(new Path("CUBICTO",[p0[p0.length-1],p1[0],p1[1],p1[2]]));
            }
        }        
    }
    
    getBitmap(){
        for(let x=0; x<this.width; x++){
            this.bitmap[x] = [];
            for(let y=0; y<this.height; y++){
                this.bitmap[x][y] = 0;       
            }
        }
        this.drawPath();
        this.fillMap();
        return this.bitmap;
    }

    drawPath(){
        this.paths.map(path =>{
            if(path.type==="LINETO"){
                this.drawLine(path);
            }
            if(path.type==="QUADTO"){
                this.drawQuadCurve(path);
            }
            if(path.type==="CUBICTO"){
                this.drawCubicCurve(path);
            }
        })
    }

    drawLine(path){
        let x1 = Math.round( path.coordinates[0].x *this.width );
        let y1 = Math.round( path.coordinates[0].y *this.height +this.yOff );
        const x2 = Math.round( path.coordinates[1].x *this.width );
        const y2 = Math.round( path.coordinates[1].y *this.height +this.yOff );

        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);
        const sx = x1 <= x2 ? 1 : -1;
        const sy = y1 <= y2 ? 1 : -1;
        const startX = x1;
        const startY = y1;

        let direction = 0;
        if(sx>0){
            direction=1;
        }else{
            direction=-1;
        }
        
        let err = dx - dy;
        
        while (x1 !== x2 || y1 !== y2) {
            if(this.bitmap[x1][y1]!=-1){
                this.bitmap[x1][y1] = direction; 
            }
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
        if(direction<0){
            this.bitmap[startX][startY]= -1;
            this.bitmap[x2][y2] = -1;
        }
    }
    drawQuadCurve(path) {
        const x1 = Math.round(path.coordinates[0].x * this.width);
        const y1 = Math.round(path.coordinates[0].y * this.height + this.yOff);
        const cx = Math.round(path.coordinates[1].x * this.width);
        const cy = Math.round(path.coordinates[1].y * this.height + this.yOff);
        const x2 = Math.round(path.coordinates[2].x * this.width);
        const y2 = Math.round(path.coordinates[2].y * this.height + this.yOff);
        const startX = x1;
        const startY = y1;

        let direction = 1;
        if(x1<x2){
            direction=1;
        }else{
            direction=-1;
        }
      
        let t = 0.0;
        const step = 0.01;
        let px = 0;
        let py = 0;
        while (t <= 1) {
          const tx = Math.pow(1 - t, 2) * x1 + 2 * (1 - t) * t * cx + Math.pow(t, 2) * x2;
          const ty = Math.pow(1 - t, 2) * y1 + 2 * (1 - t) * t * cy + Math.pow(t, 2) * y2;
      
          px = Math.round(tx);
          py = Math.round(ty);
          if(this.bitmap[px][py]!=-1){
              this.bitmap[px][py] = direction; 
          }
          t += step;
        }
        if(direction<0){
            this.bitmap[startX][startY]= -1;
            this.bitmap[px][py]= -1;
        }
      }

    drawCubicCurve(path) {
        const x1 = Math.round(path.coordinates[0].x * this.width);
        const y1 = Math.round(path.coordinates[0].y * this.height + this.yOff);
        const cx1 = Math.round(path.coordinates[1].x * this.width);
        const cy1 = Math.round(path.coordinates[1].y * this.height + this.yOff);
        const cx2 = Math.round(path.coordinates[2].x * this.width);
        const cy2 = Math.round(path.coordinates[2].y * this.height + this.yOff);
        const x2 = Math.round(path.coordinates[3].x * this.width);
        const y2 = Math.round(path.coordinates[3].y * this.height + this.yOff);
      
        let t = 0.0;
        const step = 0.01;
      
        while (t <= 1) {
          const tx =
            Math.pow(1 - t, 3) * x1 +
            3 * Math.pow(1 - t, 2) * t * cx1 +
            3 * (1 - t) * Math.pow(t, 2) * cx2 +
            Math.pow(t, 3) * x2;
          const ty =
            Math.pow(1 - t, 3) * y1 +
            3 * Math.pow(1 - t, 2) * t * cy1 +
            3 * (1 - t) * Math.pow(t, 2) * cy2 +
            Math.pow(t, 3) * y2;
      
          const px = Math.round(tx);
          const py = Math.round(ty);
          this.bitmap[px][py] = 1;
      
          t += step;
        }
    }

    fillMap(){
        for(let x=1; x<this.width-1; x++){
            let state = 0;
            for(let y=1; y<this.height-1; y++){
                const value = this.bitmap[x][y];
                if(value===-1 ){
                    state=0;
                }else if(value===1){
                    state = 1;
                }else if(value===0 && state===1){
                    this.bitmap[x][y]=2;
                } 
                if(x>0 && value===0 && this.bitmap[x-1][y]>=1  && this.hasBottom(x,y)){
                    this.bitmap[x][y]=2;
                }
            }
        }
        
    }

  
   

    hasBottom(x,y){
        if(this.bitmap[x][y+1]===-1){
            return true;
        }else if(this.bitmap[x][y+1]===0){
            return this.hasBottom(x,y+1);
        }else{
            return false;
        }
    }
}



class Path{
    constructor(type,coordinates){
        this.type = type;
        this.coordinates = coordinates;
    }
}