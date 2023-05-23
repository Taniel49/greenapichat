import React from 'react';

function ChatCreator(props) {
    const numberRef = React.useRef('');

    function handleSubmit(evt) {
        evt.preventDefault();

        props.onNumber(numberRef.current.value);
    }

    return (
        <div className='sign'>
            <form className='sign__form' onSubmit={handleSubmit}>
                <label className='sign__text'>Введите номер</label>
                <input className='sign__form_input' ref={numberRef}/>
                <button className='sign__form_submit-button' type={"submit"}>Создать чат</button>
                <p className='sign__text'>Информация о формате номера - <a className='sign__link'
                                                                           href='https://green-api.com/docs/api/chat-id/'
                                                                           target="_blank">GreenAPI</a></p>
                <button className='sign__form_submit-button' onClick={props.handleLogout}>Сменить аккаунт</button>
            </form>

        </div>
    );
}

export default ChatCreator;