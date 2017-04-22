package main

import (
	"fmt"
	"log"
	"math/rand"

	"github.com/gorilla/websocket"
)

// InboundMessage is used to unmarshal incoming events
type InboundMessage struct {
	Type    string `json:"type"`
	Message string `json:"message"`
	Sender  int    `json:"sender"`
}

// OutboundMessage is used to marshal outgoing events
type OutboundMessage struct {
	Type     string `json:"type"`
	Message  string `json:"Message"`
	Receiver int    `json:"receiver"`
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
			fmt.Printf("%+v\n", msg)
			C.sendMessage(
				"init",
				"assigning id to your bougie ass",
				msg.Sender,
			)
		default:
			log.Printf("message unhandled: %+v\n", msg)
		}
	}
}

func (C *Controller) sendMessage(t, msg string, id int) {
	send := OutboundMessage{
		Type:     t,
		Message:  msg,
		Receiver: id,
	}
	C.SendChan <- send
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
			log.Printf("error in readFromClient: %+v\n", err)
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
