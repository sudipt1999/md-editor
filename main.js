const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const menu = require('./components/Menu')
const {ipcMain} = require('electron')
const fs = require('fs')

let currentWindow = null


const createWindow = () => {
    currentWindow = new BrowserWindow ({
        width: 800,
        height: 800,
        minWidth:800,
        minHeight:800,
        webPreferences: {
            nodeIntegration: true,
        }
    })

    currentWindow.webContents.openDevTools()
    currentWindow.loadURL(path.join('file://', __dirname, 'static/index.html'))
    Menu.setApplicationMenu(menu(currentWindow))

}



ipcMain.on("WRITE_NEW_FILE_NEEDED", (event, {dir}) => {
    console.log("DIR :",dir)
    
    fs.writeFile(dir, `Start editing ${dir}`, function(err){
        if(err){ return console.log('error is writing new file') }
        currentWindow.reload()
        currentWindow.webContents.send("NEW_FILE_WRITTEN", `Start editing ${dir}`)
    });
})


ipcMain.on('SAVE_CURRENT_WORK_TO_FILE', (event, {dir, content, fileName}) => {
    fs.writeFile(dir, content, function(err){
        if(err){ return console.log('error is writing new file') }
        //currentWindow.reload()
        currentWindow.webContents.send("SAVED_EDITING_FILE", {
            msg: `Saved File Successfully`,
            fileName: fileName
        })
    });
})


app.on('ready', createWindow)

app.on('close', ()=>{
    currentWindow = null;
})

