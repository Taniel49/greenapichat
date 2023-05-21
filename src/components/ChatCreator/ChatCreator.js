import React from 'react';
import InfoTooltip from "../InfoTooltip/InfoTooltip";

function ChatCreator(props) {
    const numberRef = React.useRef('');

    function handleSubmit(evt) {
        evt.preventDefault();

        props.onNumber(numberRef.current.value);
    }

    return (
        <div>
            <button onClick={props.handleLogout}>Сменить аккаунт</button>
            <h1>Введите номер</h1>
            <form onSubmit={handleSubmit}>
                <label>Введите номер</label>
                <input ref={numberRef}/>
                <button type={"submit"}>Создать чат</button>
            </form>
            <InfoTooltip isOpen={props.isOpen}
                         onClose={props.onClose}
                         caption={props.caption}/>
        </div>
    );
}

export default ChatCreator;