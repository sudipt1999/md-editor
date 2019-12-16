const fs = require('fs')
const path = require('path')
const showdown = require('showdown')
window.$ = window.jQuery = require('jquery'); 
window.Bootstrap = require('bootstrap');

const directoryPath = path.join(__dirname, '/files')
const convertor = new showdown.Converter()

const showFileContent = (file) => {
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


//event listener to add file content to browser
const showFileContentListener = (event, file) => {
    event.preventDefault()
    showFileContent(file)
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







// for listing to NEW_DOCUMENT_NEEDED event in the renderer process
const {ipcRenderer} = require('electron')
ipcRenderer.on("NEW_DOCUMENT_NEEDED", (event , data) => {
    let createFileModal = document.getElementById('create-new-file')
    $("#create-new-file").modal("show");

    let fileName = document.getElementById('newFileName')
    let createFileConfirmButton = document.getElementById('create-file')

    createFileConfirmButton.addEventListener('click',(e)=>{
        e.preventDefault();
        let fn = fileName.value
        console.log("FILE NAME ", fn)

        ipcRenderer.send("WRITE_NEW_FILE_NEEDED", {
            dir: `./static/files/${fn}.md`,
        })
        $("#create-new-file").modal("hide");
    })

})


ipcRenderer.on("NEW_FILE_WRITTEN", function (event, message) {
   console.log("NEW FILE SUCCEFULLY ADDED !");
});

let isEditing = false

ipcRenderer.on('EDIT_DOCUMENT', function (event, message) {
    console.log(message);
    let filePath = document.getElementById('file-path').innerText.toString().trim()
    console.log(filePath)
    // check if some file is opened or not
    if(filePath.length<1)
        return

    // edit the currently opened file
    let workArea = document.getElementById('work-area')
    
    let fileContent = document.getElementById('file-content')
    let fileHtml  = fileContent.innerHTML
    console.log(fileHtml);
    fileContent.style.display = "none"
    

    let editableTextArea = document.createElement('textarea')
    editableTextArea.setAttribute('id', 'edit-area')
    editableTextArea.setAttribute('class', 'edit-area-work')

    let textAreaContent = convertor.makeMarkdown(fileHtml)
    console.log(textAreaContent)
    editableTextArea.innerHTML = textAreaContent
    workArea.appendChild(editableTextArea)
    
    editableTextArea.addEventListener("keypress",function(){
        let newValue = editableTextArea.value;
        console.log(newValue);
        editableTextArea.innerHTML = ""
        editableTextArea.innerText = ""
        editableTextArea.innerHTML = newValue;

    });

    
    isEditing = true
})

// when saving the edited document
ipcRenderer.on('SAVE_DOCUMENT', function (event, message) {
    // if not editing
    if(!isEditing)
        return

    let editableTextAreaContent = document.getElementById('edit-area').innerHTML
    console.log("consoling : ",editableTextAreaContent);
    let fileName = document.getElementById('file-path').innerText.toString().split("\\").reverse()[0]
    console.log(fileName);
    ipcRenderer.send("SAVE_CURRENT_WORK_TO_FILE",{
        dir: `./static/files/${fileName}`,
        content: editableTextAreaContent,
        fileName: fileName
    })

})

//saved file
ipcRenderer.on('SAVED_EDITING_FILE', function (event, message) {
    console.log(message)
    let editableTextArea = document.getElementById('edit-area')
    editableTextArea.parentNode.removeChild(editableTextArea);
    let fileContent = document.getElementById('file-content')
    fileContent.style.display = "block"
    showFileContent(message.fileName)
})