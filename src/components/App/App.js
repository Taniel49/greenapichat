import React, {useRef} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import LogIn from "../LogIn/LogIn";
import ChatCreator from "../ChatCreator/ChatCreator";
import Chat from "../Chat/Chat";
import InfoTooltip from "../InfoTooltip/InfoTooltip";
import {delNotification, getAccountState, getNotification, getRecentMessages, postMessage} from "../utils/MainAPI";

function App() {
    const navigate = useNavigate()
    const [idInstance, setIdInstance] = React.useState('');
    const [apiTokenInstance, setApiTokenInstance] = React.useState('');
    const [number, setNumber] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [errorMassage, setErrorMassage] = React.useState('');
    const [isOpenPopup, setIsOpenPopup] = React.useState(false);
    const [messageList, setMessageList] = React.useState([]);
    const chatMessagesNumber = 10;
    const reference = useRef();
    reference.current = number;

    React.useEffect(() => {
        if (isLoggedIn) {
            navigate('/createchat');
        } else {
            navigate('/');
        }
    }, [isLoggedIn]);

    React.useEffect(() => {
        if (number) {
            getChat();
            handleNotifications();
        }
    }, [number]);


    async function handleLogin(id, token) {
        try {
            let response = await getAccountState(id, token);
            const responseJson = await response.json();
            if (responseJson.stateInstance === 'authorized') {
                setIdInstance(id);
                setApiTokenInstance(token);
                setIsLoggedIn(true);
            } else if (responseJson.stateInstance === 'notAuthorized') {
                errorHandler('Аккаунт не авторизован');
            } else if (responseJson.stateInstance === 'blocked') {
                errorHandler('Аккаунт заблокирован');
            } else if (responseJson.stateInstance === 'sleepMode') {
                errorHandler('Аккаунт в спящем режиме');
            } else if (responseJson.stateInstance === 'starting') {
                errorHandler('Аккаунт в процессе запуска');
            } else {
                errorHandler();
            }
        } catch (e) {
            errorHandler();
            console.log(e);
        }
    }

    /*     fetch(`https://api.green-api.com/waInstance${id}/getStateInstance/${token}`, {
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
     }*/

    async function sendMessage(text) {
        try {
            let response = await postMessage(idInstance, apiTokenInstance, number, text);
            const responseJson = await response.json();
            let newArray = [...messageList];
            setMessageList([...newArray, {
                text: text,
                _id: responseJson.idMessage,
                sender: 'outgoing'
            }])
        } catch (e) {
            errorHandler();
            console.log(e);
        }
    }

    /*function sendMessage(text) {
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
    }*/

    async function receiveNotification() {
        try {
            let response = await getNotification(idInstance, apiTokenInstance);
            return await response.json();
        } catch (e) {
            errorHandler();
            console.log(e);
        }
    }

    /*function receiveNotification() {
        return fetch(`https://api.green-api.com/waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`, {
            method: `GET`, headers: {
                'Content-Type': `application/json`
            }
        }).then((res) => {
            return res.json();
        }).catch((err) => {
            errorHandler();
            console.log(err);
        });
    }*/

    async function deleteNotification(receiptId) {
        try {
            let response = await delNotification(idInstance, apiTokenInstance, receiptId);
            return await response.json();
        } catch (e) {
            errorHandler();
            console.log(e);
        }
    }

    /*function deleteNotification(receiptId) {
        fetch(`https://api.green-api.com/waInstance${idInstance}/DeleteNotification/${apiTokenInstance}/${receiptId}`, {
            method: `DELETE`, headers: {
                'Content-Type': `application/json`
            }
        }).catch((err) => {
            errorHandler();
            console.log(err);
        });
    }*/

    async function getChat() {
        try {
            let response = await getRecentMessages(idInstance, apiTokenInstance, number, chatMessagesNumber);
            const responseJson = await response.json();
            let list = [];
            responseJson.forEach((message) => {
                list = [{
                    text: message.textMessage,
                    _id: message.idMessage,
                    sender: message.type
                }, ...list]
            });
            setMessageList(list);
        } catch (e) {
            errorHandler();
            console.log(e);
        }
    }

    /*function getChat() {
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
    }*/

    async function handleNotifications() {
        try {
            while (reference.current) {
                let response = await receiveNotification();
                if (response === null) {
                    continue
                }
                if (response.body.typeWebhook === 'incomingMessageReceived') {
                    setMessageList([...messageList, {
                        text: response.body.messageData.textMessageData.textMessage,
                        _id: response.body.idMessage,
                        sender: 'incoming'
                    }])
                    await deleteNotification(response.receiptId);
                } else if (response.body.typeWebhook === 'stateInstanceChanged') {
                    console.log('stateInstanceChanged')
                    await deleteNotification(response.receiptId);
                } else if (response.body.typeWebhook === 'outgoingMessageStatus') {
                    console.log('outgoingMessageStatus')
                    await deleteNotification(response.receiptId);
                } else if (response.body.typeWebhook === 'deviceInfo') {
                    console.log('deviceInfo')
                    await deleteNotification(response.receiptId);
                }
            }
        } catch (ex) {
            console.error(ex)
        }
    }

    function handleNumber(number) {
        setNumber(number);
        navigate('/chat');
    }

    function quitChat() {
        setNumber(false);
        navigate('/createchat');
    }

    function handleLogout() {
        setIsLoggedIn(false);
        setIdInstance('');
        setApiTokenInstance('');
        navigate('/');
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
                />}/>
                <Route path="/createchat" element={<ChatCreator onNumber={handleNumber}
                                                                handleLogout={handleLogout}
                />}/>
                <Route path="/chat" element={<Chat sendMessage={sendMessage}
                                                   list={messageList}
                                                   number={number}
                                                   quitChat={quitChat}
                />}/>
            </Routes>
            <InfoTooltip isOpen={isOpenPopup}
                         onClose={closePopup}
                         caption={errorMassage}/>
        </div>
    );
}

export default App;



