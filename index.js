'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

const token = "EAAUFQv6qMt0BAClyYXaLupHfsgjxQwD8vhJoYHjqqG3P0FOVDIQPR62l6iurXLyyZBCb8AVaqGmTfZALmsZCeS0NVnSypl6n9JzPFZC9pYf8TccCe1ba3ZB6wKZBelzCQbzKsZBTWTjFQwJjsVrdyaIEZC7QIGq78hhzyjSh5P841QZDZD"

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded我
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

//New code
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        if (text === 'chest workout') {
            sendGenericMessage(sender)
            continue
        }
        sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
        continue
      }
    }
    res.sendStatus(200)
  })
//New code
//this function will echo new messges
function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

//New Code 
function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Pushup",
                    "subtitle": "Perform 40 pushups",
                    "image_url": "http://vignette4.wikia.nocookie.net/parkour/images/e/e0/Push_Up.jpg/revision/latest?cb=20141122161108",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.bodybuilding.com/exercises/detail/view/name/pushups",
                        "title": "Exercise Video"
                    }],
                }, {
                    "title": "Benchpress",
                    "subtitle": "Perform 20 reps of benchpress",
                    "image_url": "http://www.bodybuilding.com/exercises/exerciseImages/sequences/360/Male/m/360_1.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.bodybuilding.com/exercises/detail/view/name/pushups",
                        "title": "Excercise Video"
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
//New Code

