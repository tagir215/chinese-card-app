import React, {useEffect,useState} from "react";
import Card from "./Card";
import "./CardTable.css"
import { getSimilarity } from "./Api";
import TableCell from "./TableCell";

export default function CardTable(){
    const cardWidth = 30;
    const [charactersData,setCharactersData] = useState([]);
    const [unicodes, setUnicodes] = useState([]);
    const [deck1, setDeck1] = useState([]);    
    const [deck2, setDeck2] = useState([]);   
    const [table, setTable] = useState([]);

    useEffect(()=>{
        fetch(process.env.PUBLIC_URL + "/data/hanziDB.json")
        .then(response => response.json())
        .then(data => {
            setCharactersData(data);
            setDeck1(randomDeck(data));
            setDeck2(randomDeck(data));
        })
        .catch(error => {
            console.error("Error fetching JSON:", error);
        });
        let newTable = [];
        for(let i=0; i<16; i++){
            newTable.push({number:i});
        }
        setTable(newTable);
    },[])

    function randomDeck(data){
        const deck = [];
        const deckSize = 8;
        const min = 0;
        const max = data.length-1;
        for(let i=0; i<deckSize; i++){
            const index = Math.floor(Math.random()*max);
            deck.push(data[index]);
        }
        return deck;
    }

    function handleClick(unicode){
        let newUnicodes = unicodes;
        newUnicodes.push(unicode);

        if(newUnicodes.length>1){
            getSimilarity(newUnicodes[0],newUnicodes[1])
            .then(dataArray=>{
                console.log(dataArray);
            })
            setUnicodes([]);
        }else{
            setUnicodes(newUnicodes);
        }
    }
    
   
    
    return(
        <div className="card-table">
            <div className="hand">
                {charactersData.length>0 &&  deck1.map((char,index) =>{
                    return (<div key={index} >
                            <Card width={cardWidth} character={char} table={table} color={"white"}/>
                        </div>
                    )
                })}
            </div>

            <div className="table">
                {table && table.map((cell, index) => (
                     <TableCell key={index} width={cardWidth} i={index+1} cell={table[index]}/>
                ))}
            </div>
            
            <div className="hand">    
                {charactersData.length>0 &&  deck2.map((char,index) =>{
                    return (<div key={index} >
                            <Card width={cardWidth} character={char} table={table} color={"black"}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )


}