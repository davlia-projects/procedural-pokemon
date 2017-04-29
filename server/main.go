package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

var (
	addr     = ":8000"
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	certFile = "./ssl/davidliao_me.crt"
        keyFile  = "./ssl/davidliao.me.key"
	c        = NewController()
)

func main() {
	env := os.Getenv("environment")

	go c.run()
	r := mux.NewRouter()

	r.HandleFunc("/health", health)
	r.HandleFunc("/play", handleConnection)

	s := http.Server{
		Handler:      r,
		Addr:         addr,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	log.Printf("Listening and serving on %s\n", addr)
	if env == "production" {
		log.Fatal(s.ListenAndServeTLS("server.crt", "server.key"))
//		log.Fatal(http.ListenAndServeTLS(addr, certFile, keyFile, r))
	} else {
		log.Fatal(s.ListenAndServe())
//		log.Fatal(http.ListenAndServeTLS(addr, certFile, keyFile, r))
	}
}

// health reports 200 if services is up and running
func health(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "we healthy bois")
}

// handleConnection handles websocket requests from client
func handleConnection(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", 405)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	c.AddConn(conn)
}
