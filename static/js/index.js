const fs = require('fs')
const path = require('path')
const showdown = require('showdown')


const directoryPath = path.join(__dirname, '/files')
const convertor = new showdown.Converter()


//event listener to add file content to browser
const showFileContentListener = (event, file) => {
    event.preventDefault();
    let filePath = path.join(directoryPath, file)
    console.log(filePath)
    fs.readFile(filePath, (err, data) => {
        if (err) throw err
       
       //console.log(data.toString())
       let fileData = data.toString()
       let fileDataInHtml = convertor.makeHtml(fileData)

        document.getElementById('file-content').innerHTML = fileDataInHtml
        document.getElementById('file-path').innerText = filePath
    });


}






//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err)
    } 

    const fileList = document.getElementById('file-list')
    
    //listing all files using forEach
    files.forEach(function (file) {
        // file
        console.log(file); 
        let fn = file.split('.')[0].toString()
        let fileName = document.createElement('li')
        fileName.setAttribute('class', 'file-name')
        fileName.setAttribute('id', file)
        fileName.innerText = file
        // adding event listener to add content of file to browser
        fileName.addEventListener('click', (e)=>showFileContentListener(e, file))
        fileList.appendChild(fileName)
     
    });
});