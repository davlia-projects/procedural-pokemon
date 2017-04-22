package main

import "github.com/gorilla/websocket"

// Client encapsulates all player connection contexts
type Client struct {
	Conn *websocket.Conn
	ID   int
}

// NewClient creates a new client
func NewClient(conn *websocket.Conn, id int) *Client {
	c := &Client{
		Conn: conn,
		ID:   id,
	}
	return c
}

// ReadJSON wraps around the connection method
func (C *Client) ReadJSON(v interface{}) error {
	return C.Conn.ReadJSON(v)
}

// WriteJSON wraps around the connection method
func (C *Client) WriteJSON(v interface{}) error {
	return C.Conn.WriteJSON(v)
}
