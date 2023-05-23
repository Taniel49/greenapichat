import React from 'react';
import Message from "../Message/Message";

function Chat(props) {
    const messageRef = React.useRef('');

    function handleSubmit(evt) {
        evt.preventDefault();

        props.sendMessage(messageRef.current.value);
        messageRef.current.value='';
    }

    return (
        <div className='chat'>
            <section className='chat__messages'>
            {
                props.list.map((message) =>
                    <Message
                        key={message._id}
                        text={message.text}
                        sender={message.sender}
                    />
                )
            }
            </section>
            <form className='sign__form' onSubmit={handleSubmit}>
                <input className='sign__form_input' ref={messageRef}/>
                <button className='sign__form_button' type={"submit"}>Отправить сообщение</button>
                <button className='sign__form_button' onClick={props.quitChat}>Выйти из чата</button>
            </form>
        </div>
    );
}

export default Chat;