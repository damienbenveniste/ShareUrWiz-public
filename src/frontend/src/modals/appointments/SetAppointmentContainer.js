
import React from 'react'
import SetAppointment from 'modals/appointments/SetAppointment'
import CustomModal from 'components/CustomModal'



export default function SetAppointmentContainer(props) {

    return (
        <CustomModal
            open={props.open}
            onClose={props.onClose}
            fullScreen={true}
            >
            <SetAppointment userId={props.userId}/>
        </CustomModal>
    )
}

