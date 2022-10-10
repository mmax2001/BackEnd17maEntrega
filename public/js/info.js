import os from 'os'
const numCPUs= os.cpus().length;
const info={
    'args':process.args,
    'path':process.execPath,
    'so':process.platform,
    'processID':process.id,
    'folderWork':process.cwd,
    'memory':JSON.stringify(process.memoryUsage(),null,'\t'),
    'versionNode':process.version,
    'cpus':numCPUs
}

// function generarTablaInformativa(info) {
//     return fetch('/layouts/views/info.hbs')
//         .then(respuesta => respuesta.text())
//         .then(plantilla => {
//             const template = Handlebars.compile(plantilla);
//             const html = template({ info })
//             return html
//         })
// }
// generarTablaInformativa(info);
//console.log(info)
export default info;