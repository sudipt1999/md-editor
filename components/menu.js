const {app, Menu} = require('electron')

module.exports = function(win){
    return Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                { label: `Hello`, click: () => console.log("Hello world") }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {label: 'Undo', role: 'undo'  },
                {label: 'Redo', role: 'redo'  },
                {label: 'Cut', role: 'cut'  },
                {label: 'Copy', role: 'copy'  },
                {label: 'Paste', role:'paste'  },
            ]
        },
        {
            label: 'Custom Menu', 
            submenu: [
                {
                    label: 'New',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        win.webContents.send("NEW_DOCUMENT_NEEDED", 'Create new document')
                    }
                },
                {
                    label: 'Edit',
                    accelerator: 'CmdOrCtrl+E',
                    click: () => {
                        win.webContents.send("EDIT_DOCUMENT", 'Edit currently open document')
                    }
                },
                {
                    label: 'Save',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        win.webContents.send("SAVE_DOCUMENT", 'Edit currently open document')
                    }
                }
            ]
        }

    ])    
}
