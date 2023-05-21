import React from 'react';
import InfoTooltip from "../InfoTooltip/InfoTooltip";

function Chat(props) {
    const messageRef = React.useRef('');

    function handleSubmit(evt) {
        evt.preventDefault();

        props.sendMessage(messageRef.current.value);
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input ref={messageRef}/>
                <button type={"submit"}>Отправить сообщение</button>
            </form>
            <InfoTooltip isOpen={props.isOpen}
                         onClose={props.onClose}
                         caption={props.caption}/>
        </div>
    );
}

export default Chat;