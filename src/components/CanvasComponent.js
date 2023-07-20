import React, {useRef,useEffect, useState, createContext} from "react";
import "./CanvasComponent.css"

export default function CanvasComponent({bitmap,color,size,partSize,parts}){
    const canvasRef = useRef(null);
    const canvasSize = 1000;
    const rootStyles = getComputedStyle(document.documentElement);
    const colorCanvas = rootStyles.getPropertyValue('--color-canvas');
    const colorShadow = rootStyles.getPropertyValue('--color-shadow');
    let colorCharacter =rootStyles.getPropertyValue('--color-character');
    const [animationId, setAnimationId] = useState(0);
    
    if(color){
        colorCharacter = color;
    }
    const yOff = canvasSize/1.2;
    
    useEffect(()=>{
        const canvas = canvasRef.current;
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        const ctx = canvas.getContext("2d");

        if(bitmap){
            animateBitmap(bitmap,ctx);        
        }
        

        
    },[bitmap])

   

    function drawMap(graphicData,ctx){
        if(graphicData.length>0){
            let points = [];
            let CW = 0.0;
            
            for(let i=0; i<graphicData.length; i++){

                const p = graphicData[i].coords;

                switch(graphicData[i].type){
                    case "MOVETO":
                        ctx.beginPath();
                        ctx.moveTo(p[0].x*canvasSize,p[0].y*canvasSize+yOff);
                        CW += calculateCW(points,p[0].x,p[0].y);
                        break;
                    case "LINETO":
                        ctx.lineTo(p[0].x*canvasSize,p[0].y*canvasSize+yOff);
                        CW += calculateCW(points,p[0].x,p[0].y);
                        break;
                    case "QUADTO":
                        ctx.quadraticCurveTo(p[0].x*canvasSize,p[0].y*canvasSize+yOff,p[1].x*canvasSize,p[1].y*canvasSize+yOff);
                        CW += calculateCW(points,p[1].x,p[1].y);
                        break;  
                    case "CUBICTO":
                        ctx.bezierCurveTo(p[0].x*canvasSize,p[0].y*canvasSize+yOff , p[1].x*canvasSize,p[1].y*canvasSize+yOff , p[2].x*canvasSize,p[2].y*canvasSize+yOff);
                        CW += calculateCW(points,p[0].x,p[0].y);
                        CW += calculateCW(points,p[1].x,p[1].y);
                        CW += calculateCW(points,p[2].x,p[2].y);
                        break;
                    case "CLOSE":
                        ctx.closePath();
                        if(CW<=0){
                            ctx.fillStyle=colorCanvas;
                        }else{
                            ctx.fillStyle=colorCharacter;
                        }
                        ctx.fill();
                        CW = 0;
                        points = [];
                        break; 
                }
                
                        
            }
        
        }
    }

   
    function animateBitmap(bitmap,ctx){
        const activePixels = [];
        for(let x=0; x<bitmap.length; x++){
            for(let y=0; y<bitmap[x].length; y++){
                if(bitmap[x][y]!=0){
                    const value = bitmap[x][y];
                    activePixels.push({type:value,x:x,y:y});
                }
            }
        }
        if(activePixels.length===0){
            return;
        }
        const pixels = [];
        let length = activePixels.length/200;
        let i=0;
        while(activePixels.length>0){
            if(pixels[i]==null){
                pixels[i]=[];
            }
            let max = activePixels.length-1;
            let random = Math.floor(Math.random() * max);
            pixels[i].push(activePixels[random]);
            activePixels.splice(random,1);
            i++;
            if(i>length){
                i=0;
            }
        }
        cancelAnimationFrame(animationId);
        animateBitmap2(pixels,ctx,0);
    }

    function animateBitmap2(pixels, ctx, frameCount) {
        
        const s = 3;
        const off = 10;
        pixels[frameCount].forEach(pixel => {
            const type = pixel.type;
            const x = pixel.x;
            const y = pixel.y;
            if (type === -1) {
                ctx.fillStyle = colorShadow;
            }
            if (type === 1) {
                ctx.fillStyle = colorCharacter;
            }
            if (type === 2) {
                ctx.fillStyle = colorCharacter;
            }
            if (type === 3) {
                ctx.fillStyle = 'blue';
            }
            ctx.beginPath();
            ctx.arc(x*off, y*off, s, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        });
        
         
        if (frameCount < pixels.length-1) {
                
            const id = requestAnimationFrame(() => animateBitmap2(pixels, ctx, frameCount + 1));
            setAnimationId(id);
        }
      }


    

    function calculateCW(points,x,y){
      
        points.push([x,y]);
        if(points.length>3){
            points.shift();
        }
        if(points.length === 3){
            return crossProduct(points[0][0],points[0][1],points[1][0],points[1][1],points[2][0],points[2][1]);
        }
        return 0;
    }

    function crossProduct(startX, startY,prevX, prevY, currentX,currentY) {
        const pxv = prevX - startX; 
        const pyv = prevY - startY;
        const xv = currentX -startX;
        const yv = currentY -startY;
        const cp = pxv * yv - pyv * xv;
        if(cp>0)
            return 1
        else    
            return -1;
      }

    function getPartDef(part){
        if(part===null) return "";
        else return part.definition;
    }

    function getLineSkew(part){
        const skew = 10;
        if(part.lineX<part.leftX){
            return skew;
        }else{
            return -skew;
        }
    }   
    

    return(
        <div className="canvas-div">
            <canvas className="canvas1" ref={canvasRef} style={{width:size,height:size}}></canvas>
            {parts && parts.map((part,index)=>{
                return(
                    <div className={"line "+part.lineType} style={part && {transform:"skew("+getLineSkew(part)+"deg) translate("+part.lineX+"px,"+part.lineY+"px)",
                    width:part.lineWidth,
                    height:part.lineHeight
                }}/>
                )
            })}
            <div className="parts-div">
                    {parts && parts.map((part,index)=>{
                        return (
                        <div key={index+"p"} className="part" style={{transform: 'translate('+part.leftX+'px,'+part.topY+'px)'}} > 
                            <p style={{width:partSize}} className="part-text">{getPartDef(part)}</p>
                            <CanvasComponent key={index} size={partSize} color={part.color} bitmap={part.bitmap} />
                        </div>
                        )
                    })}
                </div>
        </div>
    )
}