import React from 'react';

function Message(props) {
    return (
        <>
            <p className= {`message ${props.sender==='outgoing'? 'message_outgoing':''}`}>{props.text}</p>
        </>
    );
}

export default Message;