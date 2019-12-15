const {app, BrowserWindow} = require('electron')
const path = require('path')

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


}





app.on('ready', createWindow)

app.on('close', ()=>{
    currentWindow = null;
})