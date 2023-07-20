import React, {useRef, useEffect, useState} from "react";
import './Card.css'
import { getSimilarity } from "./Api";
export default function Card({character,width,table,color}){
    const cardRef = useRef(null);
    const [isCardRefAdded, setIsCardRefAdded] = useState(false);
    const [lastClickTime, setLastClickTime] = useState(0);
    const delayThreshold = 300;

    useEffect(() => {
        const cardElement = cardRef.current;
        let cardX = 0;
        let cardY = 0;
        let onCell = false;
        let activeCell = null;
        const handleMouseDown = (event) => {
          event.preventDefault();
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
          const cardRect = cardElement.getBoundingClientRect();
          cardX = cardRect.x +cardRect.width/2;
          cardY = cardRect.y +cardRect.height/2;
        };
    
        const handleMouseMove = (event) => {
          let offsetX = event.clientX- cardX;
          let offsetY = event.clientY- cardY;
          onCell = false;
            table.map(cell=>{
                const distX = Math.abs(cell.middleX - event.clientX);
                const distY = Math.abs( cell.middleY - event.clientY );
                if(!cell.occupied && distX<cell.rect.width/2 && distY<cell.rect.height/2){
                    offsetX = cell.middleX - cardX;
                    offsetY = cell.middleY - cardY;
                    onCell = true;
                    activeCell = cell;
                }
            })
          cardElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
          cardElement.style.zIndex = "200";
        };
    
        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
          if(!onCell){
              cardElement.style.transform = "";
          }else{
            activeCell.occupied = true;
            activeCell.unicode = character.charcter.charCodeAt(0);
            calculateRelations(activeCell.number);
            
          }
          cardElement.style.zIndex = "0";
        };
    
        cardElement.addEventListener("mousedown", handleMouseDown);
    
        setIsCardRefAdded(true);
        return () => {
          cardElement.removeEventListener("mousedown", handleMouseDown);
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    function calculateRelations(index){
        const minDist = table[0].rect.height+2;
        let neighbors = [];
        for(let i=0; i<table.length; i++){
            if(i==index) continue;
            let distX = Math.abs(table[index].middleX-table[i].middleX);
            let distY = Math.abs(table[index].middleY-table[i].middleY);
            if(distX<minDist && distY<minDist){
                if(table[i].occupied){
                    neighbors.push(table[i]);
                }
            }
        }
        neighbors.map(n=>{
            getSimilarity(n.unicode,character.charcter.charCodeAt(0))
            .then(dataObject=>{
                console.log(dataObject);
            })
        })
        return neighbors;
    }


    function handleDoubleClick(){
        const currentTime = new Date().getTime();
        if (currentTime - lastClickTime < delayThreshold) {

            let y = 0;
            if(color==="white"){y = 100;}else{y=-100;}
            const cardElement = cardRef.current;
            const textElement = cardElement.children[0];
            const textElement2 = cardElement.children[1];
            const halfTime = 90;
            cardElement.style.transition = "0.3s";
            cardElement.style.transform = `translateY(${y}px) scale(5)`;
            cardElement.style.zIndex = "200";
            setTimeout(()=>{
                cardElement.style.transform = `translateY(${y}px) scale(5) rotateY(180deg)`;
                setTimeout(()=>{
                    textElement.style.opacity = 0;
                    textElement2.style.opacity = 1;
                },halfTime)
            },500)
            setTimeout(()=>{
                cardElement.style.transform = "";
                cardElement.style.zIndex = "0";
                setTimeout(()=>{
                    textElement.style.opacity = 1;
                    textElement2.style.opacity = 0;
                },halfTime)
            },3000)
            setTimeout(()=>{
                cardElement.style.transition = "0.1s";
            },3500)
            
        }
        setLastClickTime(currentTime);
    }
    

    return(
        <div ref={cardRef} 
            onClick={handleDoubleClick}
            style={{
            background:color,
            color:getColor(),
            borderColor:getColor(), 
            borderRadius:getBorderRadius(),
            width:width,height:getHeight()}} className="card-div">
            <span style={{fontSize:getTextSize()}} className="card-text">{character.charcter}</span>
            <div className="definitions" >
                {getWords().map((word,index)=>{
                    return <span key={index} style={{color:getColor(), fontSize:3}} className="definition">{(index+1)+". "+word}</span>
                })}
            </div>
        </div>
    )
    
    function getWords(){
        let str = character.definition;
        if(str==="") return ["..."];
        let words = str.split(/[,;]\s+/);
        return words;
    }

   

    function getBorderRadius(){
        return width*0.05;
    }
    function getHeight(){
        return width*1.5;
    }
    function getTextSize(){
        return width*3+"%";
    }
    function getColor(){
        if(color==="white"){
            return "black"
        }else{
            return "white"
        }
    }

    

}