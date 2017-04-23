package main

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
	World   World  `json:"world"`
}

// Player encapsulates data for users
type Player struct {
	Pos Point `json:"pos"`
	ID  int   `json:"id"`
}

// World encapsulates data for the world state
type World struct {
	Size int `json:"size"`
	Seed int `json:"seed"`
}

type Game struct {
	World World `json:"world"`
}

// Point is a cartesian tuple
type Point struct {
	X int `json:"x"`
	Y int `json:"y"`
}
