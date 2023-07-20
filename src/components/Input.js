import React, {useEffect, useState} from "react";
import CanvasComponent from "./CanvasComponent";
import "./Input.css"
import {getCharacter,getMatch,getParts} from "./Api.js";
import BitmapFactory from "./BitmapFactory";
import {getCenterPoints} from "./BitmapAnalyzer.js"


export default function Input(){
    const baseUrl = "http://localhost:8080";
    const [charactersData, setCharactersData] = useState([]);
    const [dataObject, setDataObject] = useState({
        definition: "",
        definitions:"",
        frequency_rank: 0,
        hsk_levl: 0,
        pinyin: "",
        stroke_count:"15",
        unicode: 25000
    });
    const bitmapWidth = 100;
    const bitmapHeight = 100;
    const size = 300;
    const partSize = 200;

    const [parts, setParts] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(()=>{
        fetch(process.env.PUBLIC_URL + "./data/hanziDB.json")
        .then(response => response.json())
        .then(data => {
            setCharactersData(data);
        })
        .catch(error => {
            console.error("Error fetching JSON:", error);
        });
        setIndex(0);
    },[])

    const handleClickGetCharacter = ()=>{
        const text = document.getElementById("inputhere").value;
        getCharacter(parseInt(text)).then(dataObject=>{
            document.getElementById("inputhere").value = "";
            updateTheDataObject(dataObject);
        })
    }
    function updateTheDataObject(dataObject){
        let bmfactory = new BitmapFactory(JSON.parse(dataObject.graphicData),bitmapWidth,bitmapHeight);
        dataObject.bitmap = bmfactory.getBitmap();
        setDataObject(dataObject);
    }

    const handleClickNext = (direction)=>{
        const newIndex = index + direction;
        setParts([]);
        getCharacter(charactersData[newIndex].charcter.charCodeAt(0))
        .then(dataObject=>{
            updateTheDataObject(dataObject);
            setIndex(newIndex);
        })
    }

    const handleClickParts = ()=>{
        getParts(dataObject.unicode)
        .then(dataObjects=>{
           // calculateDimensionsToParts(dataObjects,dataObject.bitmap);
           dataObjects.map(part=>{
            let bmfactory = new BitmapFactory(JSON.parse(part.graphicData),bitmapWidth,bitmapHeight);
            part.bitmap = bmfactory.getBitmap();
           })
            setParts(dataObjects);
        })
    }
   

   function calculateDimensionsToParts(dataObjects,bitmap){
        const centerPoints = getCenterPoints(bitmap);
        const center = bitmapWidth/2;
        let leftParts = [];
        let rightParts = [];
        const leftMargin = 20;
        let extra = 0;

        for(let i=0; i<dataObjects.length; i++){
            const part = dataObjects[i];
            if(part==null || centerPoints[i]==null){
                continue;
            }
            if(centerPoints[i].x>center){
                part.leftX = size+leftMargin;
            }else{
                part.leftX = -partSize-leftMargin;
            }
            part.lineX = size*centerPoints[i].x / bitmapWidth;
            part.lineY = size*centerPoints[i].y / bitmapHeight;
            part.topY = part.lineY+leftMargin;
            part.lineWidth =Math.abs( part.leftX - part.lineX + partSize/2);
            if(part.leftX<part.lineX){
                part.lineX -= part.lineWidth;
                leftParts.push(part);
            }else{
                rightParts.push(part);
            }
            if(part.leftX===0){
                part.topY = 300*extra;
                extra++;
            }
            
        }
        const margin = 20;
        let level = 0;
        leftParts.map((part,index)=>{
            if(part.topY<level){
                 part.topY = level;
            }
            if(part.topY<part.lineY){
                part.lineType = "topLeft";
            }else{
                part.lineType = "bottomLeft"
            }
            part.lineHeight = Math.abs(part.topY-part.lineY)+partSize/2;
            level = part.topY+partSize+margin;
        })
        level = 0;
        rightParts.map((part,index)=>{
            if(part.topY<level){
                 part.topY = level;
            }
            if(part.topY<part.lineY){
                part.lineType = "topRight";
            }else{
                part.lineType = "bottomRight"
            }
            part.lineHeight = Math.abs(part.topY-part.lineY)+partSize/2;
            level = part.topY+partSize+margin;
        })
        
}

    return(
        <div className="data-div">
            <input className="inputhere" id="inputhere" type="text"></input>
            <button className="a-button" onClick={handleClickGetCharacter}>get</button>
            <button className="a-button" onClick={()=>handleClickNext(-1)}>previous</button>   
            <button className="a-button" onClick={()=>handleClickNext(1)}>next</button> 
            <button className="a-button" onClick={handleClickParts}>parts</button>  
            <div className="metadata-div">
                <span className="definition">{dataObject.definition}</span>
                <h4 className="data">{dataObject.definitions}</h4>
                <h4 className="data">{"pinyin: "+dataObject.pinyin}</h4>
                <h4 className="data">{"unicode: "+dataObject.unicode}</h4>
                <h4 className="data">{"hsk level: "+dataObject.hsk_levl}</h4>
                <h4 className="data">{"frequency rank: "+dataObject.frequency_rank}</h4>
                <h4 className="data">{"stroke count: "+dataObject.stroke_count}</h4>
            </div>
            <div className="canvas-container">
                <CanvasComponent size={size} partSize={partSize} color={dataObject.color} bitmap={dataObject.bitmap} parts={parts}/>
            </div>
        </div>
    )
}