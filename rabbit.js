// ==UserScript==
// @name         rabbit mq action
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  rabbit mq action
// @author       mgzu
// @include      http://193.112.63.187/*
// @match        http://193.112.63.187/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let action = createElement('rabbit-action')

    let countQueue = createElement('count-queue')
    countQueue.innerHTML = "count-queue"

    $(countQueue).on('click', function() {
        alert(`queue message count: ${rabbitCount()}`)
    })

    action.appendChild(countQueue)

    let clearExchanges = createElement('clear-exchanges')
    clearExchanges.innerHTML = "clear-exchanges"

    $(clearExchanges).on('click', function() {
        deleteAllExchange()
        alert('exchanges cleared')
    })

    action.appendChild(clearExchanges)

    let clearQueues = createElement('clear-queues')
    clearQueues.innerHTML = "clear-queues"

    $(clearQueues).on('click', function() {
        deleteAllQueue()
        alert('queues cleared')
    })

    action.appendChild(clearQueues)

    document.body.insertBefore(action, document.body.childNodes[0])

    function createElement(id) {
        let ele = document.createElement("div")
        ele.setAttribute("id", id)
        return ele
    }

    function rabbitCount() {
        let totalIndex
        let list = $('.list')
        list.find('.sort').each((i, e) => {
            if (e.innerHTML === 'Total') {
                totalIndex = i + 1
            }
        })
        let count = 0
        list.find('tbody > tr').each((i, e) => {
            let content = $(e).children()[totalIndex].innerHTML
            count += new Number(content.replaceAll(',', ''))
        })
        console.log(count)
        return count
    }

    function deleteAllExchange() {
        let totalIndex
        let list = $('.list')
        list.find('.sort').each((i, e) => {
            if (e.innerHTML === 'Type') {
                totalIndex = i
            }
        })
        list.find('tbody > tr').each((i, e) => {
            let exchange_name = $($(e).children()[0]).text()
            let content = $(e).children()[totalIndex].innerHTML
            if (!exchange_name.startsWith('amq') && content === 'topic') {
                console.log(exchange_name, content)
                sync_req('DELETE', {name: exchange_name, vhost: "/"}, "/exchanges/:vhost/:name", undefined)
            }
        })
    }

    function deleteAllQueue() {
        let list = $('.list')
        list.find('tbody > tr').each((i, e) => {
            let queue_name = $($(e).children()[0]).text()
            console.log(queue_name)
            sync_req('DELETE', {name: queue_name, vhost: "/"}, "/queues/:vhost/:name", undefined)
        })
    }
})();