import React,{useState,useEffect} from "react";

export default function Connection({cell1,cell2}){
    const [value, setValue] = useState(0);
    useEffect(()=>{
        
    })

    return(
        <div className="connection-div">
            <span className="connection-value">{value+"%"}</span>
        </div>
    )
}