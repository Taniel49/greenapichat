import React from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import LogIn from "../LogIn/LogIn";
import ChatCreator from "../ChatCreator/ChatCreator";
import Chat from "../Chat/Chat";

function App() {
    const navigate = useNavigate()
    const [idInstance, setIdInstance] = React.useState('');
    const [apiTokenInstance, setApiTokenInstance] = React.useState('');
    const [number, setNumber] = React.useState('');
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [errorMassage, setErrorMassage] = React.useState('');
    const [isOpenPopup, setIsOpenPopup] = React.useState(false);

    React.useEffect(() => {
        if (isLoggedIn) {
            navigate('/createchat')
        } else {
            navigate('/')
        }
    }, [isLoggedIn])

    function handleLogin(id, token) {
        fetch(`https://api.green-api.com/waInstance${id}/getStateInstance/${token}`, {
            method: `GET`, headers: {
                'Content-Type': `application/json`
            }
        }).then((res) => {
            return res.json()
        }).then((res) => {
            if (res.stateInstance === 'authorized') {
                setIdInstance(id);
                setApiTokenInstance(token);
                setIsLoggedIn(true);
                console.log('success');
            } else if (res.stateInstance === 'notAuthorized') {
                errorHandler('Аккаунт не авторизован');
            } else if (res.stateInstance === 'blocked') {
                errorHandler('Аккаунт заблокирован');
            } else if (res.stateInstance === 'sleepMode') {
                errorHandler('Аккаунт в спящем режиме');
            } else if (res.stateInstance === 'starting') {
                errorHandler('Аккаунт в процессе запуска');
            } else {
                errorHandler();
            }
        }).catch((err) => {
            errorHandler();
            console.log(err);
        });
    }

    function sendMessage(text) {
        fetch(`https://api.green-api.com/waInstance${idInstance}/SendMessage/${apiTokenInstance}`, {
            method: `POST`, headers: {
                'Content-Type': `application/json`
            },
            body: {
                'chatId': `${number}`,
                'message': `${text}`
            }
        }).catch((err) => {
            errorHandler();
            console.log(err);
        });
    }

    function handleNumber(number) {
        setNumber(number);
        navigate('/chat')
    }

    function errorHandler(errMassage = 'Непредвиденная ошибка') {
        setIdInstance('');
        setApiTokenInstance('');
        setErrorMassage(errMassage);
        handlePopup();
    }

    function handlePopup() {
        setIsOpenPopup(true)
    }

    function closePopup() {
        setIsOpenPopup(false)
    }

    return (
        <div>
            <Routes>
                <Route path="/" element={<LogIn onLogin={handleLogin}
                                                isOpen={isOpenPopup}
                                                onClose={closePopup}
                                                caption={errorMassage}/>}/>
                <Route path="/createchat" element={<ChatCreator onNumber={handleNumber}
                                                                isOpen={isOpenPopup}
                                                                onClose={closePopup}
                                                                caption={errorMassage}/>}/>
                <Route path="/chat" element={<Chat sendMessage={sendMessage}
                                                   isOpen={isOpenPopup}
                                                   onClose={closePopup}
                                                   caption={errorMassage}/>}/>
            </Routes>
        </div>
    );
}

export default App;



