const form = document.getElementById('loginForm');
console.log("Prueba enlace con archivo js")

//Genero el cuadro de bienvenida para el usuario logueado
function generarBienvenida(user) {
    return fetch('/layouts/welcomeUser.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ user })
            return html
        })
}

form.addEventListener('submit',evt=>{
    evt.preventDefault();
    const email= document.getElementsByName("email").item(0).value;
    console.log("EL EMAIL ES",email);
    let data = new FormData(form);
    //let obj = {};
    let obj={email:document.getElementById("email").value}
    let json;
    //data.forEach((value,key)=>obj[key]=value);
    console.log("ESTO TIENE DATA",data);
    fetch('/login',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(result=>result.json()).then(json => window.location.replace('/dashboard.html'));
    
})

// const form = document.getElementById('loginForm');

// form.addEventListener('submit',evt=>{
//     evt.preventDefault();
//     let data = new FormData(form);
//     let obj = {}
//     data.forEach((value,key)=>obj[key]=value)
//     fetch('/api/sessions/login',{
//         method:'POST',
//         body:JSON.stringify(obj),
//         headers:{
//             "Content-Type":"application/json"
//         }
//     }).then(result=>result.json()).then(json=>console.log(json));
// })