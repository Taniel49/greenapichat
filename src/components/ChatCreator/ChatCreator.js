import React from 'react';

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
        </div>
    );
}

export default ChatCreator;