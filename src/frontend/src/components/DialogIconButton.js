
import React, { useState } from 'react'
import {
    Dialog,
    IconButton,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Tooltip
} from '@mui/material'


export default function DialogIconButton({ icon, title, text, ...props }) {

    const [open, setOpen] = useState(false)

    return <>
        <Tooltip title={title} arrow>
            <IconButton
                onClick={() => setOpen(true)}>
                {icon}
            </IconButton>
        </Tooltip>
        <Dialog {...props} sx={{zIndex: '100000'}} open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {text}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    </>
}

