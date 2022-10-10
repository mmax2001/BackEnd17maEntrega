export const dict={}
function getRandomInt(min, max,MAX_QUANTITY) {
  min = Math.ceil(min);
  max = Math.floor(max);
  for(let i=1;i<=MAX_QUANTITY;i++){
    let numberRandom = Math.floor(Math.random() * (max - min + 1) + min); 
    //console.log(numberRandom)
    if(numberRandom in dict){
        //console.log("ENTRO")
        dict[numberRandom]=dict[numberRandom]+1;
    }else{
        dict[numberRandom]=1;
    }
    
  }
  //console.log(dict)
}

getRandomInt(1,1000,10)
