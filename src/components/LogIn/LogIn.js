import React from 'react';

function LogIn(props) {
    const idRef = React.useRef('');
    const tokenRef = React.useRef('');

    function handleSubmit(evt) {
        evt.preventDefault();

        props.onLogin(idRef.current.value, tokenRef.current.value);
    }

    return (
        <div className='sign'>
            <h1 className='sign__header'>Введите данные аккаунта GreenAPI</h1>
            <form className='sign__form' onSubmit={handleSubmit}>
                <label className='sign__text'>IdInstance</label>
                <input className='sign__form_input' ref={idRef}/>
                <label className='sign__text'>ApiTokenInstance</label>
                <input className='sign__form_input' ref={tokenRef}/>
                <button className='sign__form_button' type={"submit"}>Войти</button>
            </form>
            <p className='sign__text'>Для регистрации и решения возможных проблем с аккаунтом перейдите на сайт <a
                className='sign__link'
                href="https://green-api.com/" target="_blank">GreenAPI</a></p>
        </div>
    );
}

export default LogIn;