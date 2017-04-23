package main

import (
	"log"
	"math/rand"

	"github.com/gorilla/websocket"
)

// InboundMessage is used to unmarshal incoming events
type InboundMessage struct {
	Type   string `json:"type"`
	Data   Data   `json:"data"`
	Sender int    `json:"id"`
}

// OutboundMessage is used to marshal outgoing events
type OutboundMessage struct {
	Type     string `json:"type"`
	Data     Data   `json:"data"`
	Receiver int    `json:"id"`
}

// Data stores the payload of each message
type Data struct {
	Message string `json:"message"`
	Player  Player `json:"player"`
}

// Controller handles all ws connection events and is the driver module
type Controller struct {
	ReceiveChan chan InboundMessage
	SendChan    chan OutboundMessage
	Clients     map[int]*Client
}

// NewController creates a new controller
func NewController() Controller {
	c := Controller{
		ReceiveChan: make(chan InboundMessage, 128),
		SendChan:    make(chan OutboundMessage, 128),
		Clients:     make(map[int]*Client),
	}
	return c
}

func (C *Controller) run() {
	go C.handleInboundMessages()
	go C.handleOutboundMessages()
}

func (C *Controller) handleInboundMessages() {
	for {
		msg := <-C.ReceiveChan
		switch msg.Type {
		case "init":
			d := Data{
				Message: "assigning id to your bougie ass",
			}
			C.sendMessage("init", d, msg.Sender)
			u := Data{
				Message: "a new challenger approaches",
				Player:  Player{X: 10, Y: 10},
			}
			C.broadcastMessage("update", u, msg.Sender)
		case "update":
			d := Data{
				Message: "updating stuff lol",
				Player:  msg.Data.Player,
			}
			C.broadcastMessage("update", d, msg.Sender)
		default:
			log.Printf("message unhandled: %+v\n", msg)
		}
	}
}

func (C *Controller) sendMessage(t string, data Data, id int) {
	send := OutboundMessage{
		Type:     t,
		Data:     data,
		Receiver: id,
	}
	C.SendChan <- send
}

func (C *Controller) broadcastMessage(t string, data Data, sender int) {
	for id := range C.Clients {
		if id == sender {
			continue
		}
		C.sendMessage(t, data, id)
	}
}

func (C *Controller) handleOutboundMessages() {
	for {
		msg := <-C.SendChan
		client, ok := C.Clients[msg.Receiver]
		log.Printf("%+v\n", msg)
		if !ok {
			log.Printf("error: could not find connection by id\n")
			continue
		}
		client.WriteJSON(msg)
	}
}

// AddConn adds connections to be tracked and listened to
func (C *Controller) AddConn(conn *websocket.Conn) {
	id := C.nextID()
	client := NewClient(conn, id)
	C.Clients[id] = client
	go C.readFromClient(client)
}

func (C *Controller) readFromClient(client *Client) {
	for {
		var msg InboundMessage
		err := client.ReadJSON(&msg)
		if err != nil {
			log.Printf("Connection closed by %d\n", client.ID)
			delete(C.Clients, client.ID)
			return
		}
		// TODO: this is sort of hacky IMO? should refactor in future
		msg.Sender = client.ID
		C.ReceiveChan <- msg
	}
}

func (C *Controller) nextID() int {
	// TODO: do something else here that doesn't put your 4 years of higher education to fucking shame
	for {
		id := rand.Int()
		if _, ok := C.Clients[id]; !ok {
			return id
		}
	}
}
