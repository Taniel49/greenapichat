import React from 'react';
import InfoTooltip from "../InfoTooltip/InfoTooltip";

function Chat(props) {
    const messageRef = React.useRef('');

    function handleSubmit(evt) {
        evt.preventDefault();

        props.sendMessage(messageRef.current.value);
    }

    (async () => {
            try {
                console.log("Waiting incoming notifications...")
                let response
                while (response = await restAPI.webhookService.receiveNotification()) {
                    let webhookBody = response.body;
                    if (webhookBody.typeWebhook === 'incomingMessageReceived') {
                        console.log('incomingMessageReceived')
                        console.log(webhookBody.messageData.textMessageData.textMessage)
                        await restAPI.webhookService.deleteNotification(response.receiptId);
                    } else if (webhookBody.typeWebhook === 'stateInstanceChanged') {
                        console.log('stateInstanceChanged')
                    } else if (webhookBody.typeWebhook === 'outgoingMessageStatus') {
                        console.log('outgoingMessageStatus')
                    } else if (webhookBody.typeWebhook === 'deviceInfo') {
                        console.log('deviceInfo')
                    }
                }
            } catch (ex) {
                console.error(ex)
            }

            console.log("End")
        })()

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input ref={messageRef}/>
                <button type={"submit"}>Отправить сообщение</button>
            </form>
            <InfoTooltip isOpen={props.isOpen}
                         onClose={props.onClose}
                         caption={props.caption}/>
        </div>
    );
}

export default Chat;