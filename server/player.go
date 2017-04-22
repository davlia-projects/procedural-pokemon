package main

import "github.com/gorilla/websocket"

// Player encapsulates data for users
type Player struct {
	X          int `json:"x"`
	Y          int `json:"y"`
	ID         int `json:"id"`
	Connection websocket.Conn
}
