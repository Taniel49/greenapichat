import React from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import LogIn from "../LogIn/LogIn";
import ChatCreator from "../ChatCreator/ChatCreator";
import Chat from "../Chat/Chat";

function App() {
    const navigate = useNavigate()
    const [idInstance, setIdInstance] = React.useState('');
    const [apiTokenInstance, setApiTokenInstance] = React.useState('');
    const [number, setNumber] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [errorMassage, setErrorMassage] = React.useState('');
    const [isOpenPopup, setIsOpenPopup] = React.useState(false);
    const [messageList, setMessageList] = React.useState([]);

    React.useEffect(() => {
        if (isLoggedIn) {
            navigate('/createchat')
        } else {
            navigate('/')
        }
    }, [isLoggedIn]);

    React.useEffect(() => {
        if (number) {
            getChat();
            handleNotifications();
        }
    }, [number]);


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
            body: JSON.stringify({
                'chatId': `${number}`,
                'message': `${text}`
            })
        }).then((res) => {
            return res.json();
        }).then((res) => {
            let newArray = [...messageList];
            setMessageList([...newArray, {
                text: text,
                _id: res.idMessage,
                sender: 'outgoing'
            }])
        }).catch((err) => {
            errorHandler();
            console.log(err);
        });
    }

    function receiveNotification() {
        let response;

        fetch(`https://api.green-api.com/waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`, {
            method: `GET`, headers: {
                'Content-Type': `application/json`
            }
        }).then((res) => {
            return res.json();
        }).then((res) => {
            response=res;
        }).catch((err) => {
            errorHandler();
            console.log(err);
        });

        return response;
    }

    function deleteNotification(receiptId) {
        fetch(`https://api.green-api.com/waInstance${idInstance}/DeleteNotification/${apiTokenInstance}/${receiptId}`, {
            method: `DELETE`, headers: {
                'Content-Type': `application/json`
            }
        }).catch((err) => {
            errorHandler();
            console.log(err);
        });
    }

    function getChat() {
        fetch(`https://api.green-api.com/waInstance${idInstance}/GetChatHistory/${apiTokenInstance}`, {
            method: `POST`, headers: {
                'Content-Type': `application/json`
            },
            body: JSON.stringify({
                'chatId': `${number}`,
                "count": 10
            })
        }).then((res) => {
            return res.json()
        }).then((res) => {
            let list = [];
            res.forEach((message) => {
                list = [{
                    text: message.textMessage,
                    _id: message.idMessage,
                    sender: message.type
                }, ...list]
            });
            setMessageList(list);
        }).catch((err) => {
            errorHandler();
            console.log(err);
        });
    }

    async function handleNotifications() {
        try {
            console.log("Waiting incoming notifications...");
            let response
            while (response = await receiveNotification()) {
                console.log("в цикле")
                if (response.body.typeWebhook === 'incomingMessageReceived') {
                    console.log('incomingMessageReceived');
                    let newArray = [...messageList];
                    setMessageList([...newArray, {
                        text: response.body.messageData.textMessageData.textMessage,
                        _id: response.body.idMessage,
                        sender: 'incoming'
                    }])
                    await deleteNotification(response.receiptId);
                } else if (response.body.typeWebhook === 'stateInstanceChanged') {
                    console.log('stateInstanceChanged')
                } else if (response.body.typeWebhook === 'outgoingMessageStatus') {
                    console.log('outgoingMessageStatus')
                } else if (response.body.typeWebhook === 'deviceInfo') {
                    console.log('deviceInfo')
                }
            }
        } catch (ex) {
            console.error(ex)
        }
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
                                                   list={messageList}
                                                   number={number}
                                                   isOpen={isOpenPopup}
                                                   onClose={closePopup}
                                                   caption={errorMassage}/>}/>
            </Routes>
        </div>
    );
}

export default App;



