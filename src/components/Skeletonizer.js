export default class Skeletonizer {
  
  static deepCopyArray(array) {
    if (!Array.isArray(array)) {
      return array;
    }
    return array.map((item) => this.deepCopyArray(item));
  }

  static skeletonize(bitmap,width,height){
    let skeleton = this.deepCopyArray(bitmap);
    let step = 1;
    while(true){
      let changed = false;
      let bmapCopy = this.deepCopyArray(skeleton);
      for(let x=1; x<width-1; x++){
        for(let y=1; y<height-1; y++){
          const nCount = this.neighborCount(x,y,bmapCopy);
          if(bmapCopy[x][y]!=0){
            if(nCount>1 && nCount<7 && this.whiteToBlackTransitionCount(x,y,bmapCopy)===1 && this.checkConnectivity(x,y,bmapCopy,step)){
              skeleton[x][y]=0;
              changed = true;
            }else{
              skeleton[x][y]=3;
              if(nCount===1){
                skeleton[x][y]=-1;
              }
            }
          }
          
        }
      }
      if(step===1) step = 2; else step = 1;
     
      if(!changed) break;
    }

  
    
    return skeleton;
  }

  static neighborCount(x,y,bitmap){
    let count = 0;
    if(bitmap[x-1][y-1]!=0) count ++;
    if(bitmap[x][y-1]!=0) count ++;
    if(bitmap[x+1][y-1]!=0) count ++;
    if(bitmap[x-1][y]!=0) count ++;
    if(bitmap[x+1][y]!=0) count ++;
    if(bitmap[x-1][y+1]!=0) count ++;
    if(bitmap[x][y+1]!=0) count ++;
    if(bitmap[x+1][y+1]!=0) count ++;
    return count;
  }
  static whiteToBlackTransitionCount(x, y, bitmap) {
    const offsets = [
      [-1, -1], [0, -1], [1, -1],
      [1, 0], [1, 1], [0, 1],
      [-1, 1], [-1, 0],[-1,-1]
    ];
    let count = 0;
    let white = false;
    for (const [offsetX, offsetY] of offsets) {
      const pixel = bitmap[x + offsetX][y + offsetY];
      if (pixel !== 0) {
        if (white) {
          count++;
          white = false;
        }
      } else {
        white = true;
      }
    }
    return count;
  }
  static checkConnectivity(x,y,bitmap,step){
    if(step===1){
      if(bitmap[x][y-1]!=0 && bitmap[x+1][y]!=0 && bitmap[x][y+1]!=0){
        return false;
      }
      if(bitmap[x+1][y]==0 || bitmap[x][y+1]==0 || bitmap[x-1][y]==0){
        return true;
      }
      return false;
    }else{
      if(bitmap[x][y-1]!=0 && bitmap[x+1][y]!=0 && bitmap[x-1][y]!=0){
        return false;
      }
      if(bitmap[x][y-1]==0 || bitmap[x][y+1]==0 || bitmap[x-1][y]==0){
        return true;
      }
      return false;
    }
   
  }

  
}
