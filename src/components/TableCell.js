import React, {useRef,useEffect} from "react";
import "./TableCell.css";
export default function TableCell({width, i, cell}){

    const cellRef = useRef(null);
    
    useEffect(()=>{
        const cellElement = cellRef.current;
        const rect = cellElement.getBoundingClientRect();
        cell.rect = rect;
        cell.middleX = rect.x+rect.width/2;
        cell.middleY = rect.y+rect.height/2;
    })

    function getHeight(){
        return width*1.5;
    }
 
    function getColor(){
        const rounded = Math.ceil(i / 4) * 4;
        let index = i;
        if(rounded%8 == 0){
            index++;
        }
        if(index%2==0) return "white"; else return "black";
    }
    return (
        <div ref={cellRef} className={"table-cell-div "+getColor()} style={{width:width,height:getHeight()}}>

        </div>
    )
}