import React from 'react';
import Message from "../Message/Message";

function Chat(props) {
    const messageRef = React.useRef('');

    function handleSubmit(evt) {
        evt.preventDefault();

        props.sendMessage(messageRef.current.value);
    }

    return (
        <div>
            <button onClick={props.quitChat}>Выйти из чата</button>
            {
                props.list.map((message) =>
                    <Message
                        key={message._id}
                        text={message.text}
                    />
                )
            }
            <form onSubmit={handleSubmit}>
                <input ref={messageRef}/>
                <button type={"submit"}>Отправить сообщение</button>
            </form>
        </div>
    );
}

export default Chat;