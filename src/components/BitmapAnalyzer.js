import React from "react";
import Skeletonizer from "./Skeletonizer";

export function getCenterPoints(bitmap){
    let bitmapCopy = Skeletonizer.deepCopyArray(bitmap);
    let paths = [];
    for(let y=0; y<bitmapCopy.length; y++){
        for(let x=0; x<bitmapCopy[y].length; x++){
            if(bitmapCopy[x][y]!==0){
                paths.push(getPath(x,y,bitmapCopy));
            }
        }
    }
    let centerPoints = [];
    for(let i=0; i<paths.length; i++){
        const middle = paths[i].length/2;
        const point = paths[i][parseInt(middle)];
        centerPoints.push({path:i,x:point[0],y:point[1]});
    }
    return centerPoints;
}



function getPath(x,y,bitmap){
    let path = [];
    let stack = [];
    
    const offsetsX = [-1,0,1,1,1,0,-1,-1];
    const offsetsY = [-1,-1,-1,0,1,1,1,0];
    bitmap[x][y] = 0;
    stack.push([x,y]);
    while(stack.length>0){
        let point = stack.pop();
        path.push(point);
        for(let i=0; i<offsetsX.length; i++){
            let xx = point[0]+offsetsX[i];
            let yy = point[1]+offsetsY[i];
            if(bitmap[xx][yy]!==0){
                bitmap[xx][yy] = 0;
                stack.push([xx,yy]);
            }
        }
    }
    return path;
}

