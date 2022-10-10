const form = document.getElementById('registerForm');
console.log("Prueba enlace registro con archivo js")
form.addEventListener('submit',evt=>{
    evt.preventDefault();
    let data = new FormData(form);
    let obj = {}
    console.log("ESTO TIENE DATA",data)
    data.forEach((value,key)=>obj[key]=value)
    console.log("ESTO TIENE DATA",data);
    fetch('/registro',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(result=>result.json()).then(json => console.log(json));
    //console.log(json)
})