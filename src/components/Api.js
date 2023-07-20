import React from "react";

const baseUrl = "http://localhost:8080";

export async function getCharacter(unicode) {
    try {
      const response = await fetch(baseUrl + "/api/v1/getcoords/" + unicode);
      const data = await response.text();
      const dataObject = JSON.parse(data);
      return dataObject;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  
export async function getMatch(unicode){
    try{
        const response = await fetch(baseUrl+"/api/v1/getmatch/"+unicode);
        const data = await response.text();
        const dataObject = JSON.parse(data);
        return dataObject;
    }catch(error){
        console.log(error);
        return null;
    }
}

export async function getSimilarity(unicode1,unicode2){
    try{
        const response = await fetch(baseUrl+"/api/v1/get_similarity/"+unicode1+"/"+unicode2);
        const data = await response.text();
        const dataObject = JSON.parse(data);
        return dataObject;
    }catch(error){
        console.log(error);
        return null;
    }
}

export async function getParts(unicode){
    try{
        const response = await fetch(baseUrl+"/api/v1/getparts/"+unicode);
        const data = await response.text();
        const dataObject = JSON.parse(data);
        return dataObject;
    }catch(error){
        console.log(error);
        return null;
    }
}