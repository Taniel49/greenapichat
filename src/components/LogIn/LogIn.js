import React from 'react';

function LogIn(props) {
    const idRef = React.useRef('');
    const tokenRef = React.useRef('');

    function handleSubmit (evt){
        evt.preventDefault();

        props.onLogin(idRef.current.value, tokenRef.current.value);
    }

    return (
        <div>
            <h1>Введите данные аккаунта GreenAPI</h1>
            <form onSubmit={handleSubmit}>
                <label>IdInstance</label>
                <input ref={idRef}/>
                <label>ApiTokenInstance</label>
                <input ref={tokenRef}/>
                <button type={"submit"}>Войти</button>
            </form>
            <p>Для регистрации и решения возможных проблем с аккаунтом перейдите на сайт <a href="https://green-api.com/" target="_blank">GreenAPI</a></p>
        </div>
    );
}

export default LogIn;