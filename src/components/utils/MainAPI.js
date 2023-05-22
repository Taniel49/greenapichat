const url = 'https://api.green-api.com';

export function getAccountState(id, token) {
    return fetch(`${url}/waInstance${id}/getStateInstance/${token}`, {
        method: `GET`, headers: {
            'Content-Type': `application/json`
        }
    })}

export function postMessage(id, token, number, text) {
    return fetch(`${url}/waInstance${id}/SendMessage/${token}`, {
        method: `POST`, headers: {
            'Content-Type': `application/json`
        },
        body: JSON.stringify({
            'chatId': `${number}`,
            'message': `${text}`
        })
    })}

export function getNotification(id, token) {
    return fetch(`${url}/waInstance${id}/ReceiveNotification/${token}`, {
        method: `GET`, headers: {
            'Content-Type': `application/json`
        }
    })}

export function delNotification(id, token, receiptId) {
    return fetch(`${url}/waInstance${id}/DeleteNotification/${token}/${receiptId}`, {
        method: `DELETE`, headers: {
            'Content-Type': `application/json`
        }
    })}

export function getRecentMessages(id, token, number, count) {
    return fetch(`${url}/waInstance${id}/GetChatHistory/${token}`, {
        method: `POST`, headers: {
            'Content-Type': `application/json`
        },
        body: JSON.stringify({
            'chatId': `${number}`,
            "count": count
        })
    })}