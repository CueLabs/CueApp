package main 

import (
  "github.com/mattcarpowich1/cueapp/models"
  // "github.com/zmb3/spotify"
  "net/http"
  "encoding/json"
  "fmt"
)

var q models.SearchQuery

func Search(h *SpotifyHub) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("hello?")
    err := json.NewDecoder(r.Body).Decode(&q)
    if err != nil {
      panic(err)
    }

    fmt.Println(q.SUID)
    fmt.Println(q.Query)

    fmt.Println("1")

    client := h.clients[q.SUID]
    fmt.Printf("%+v\n", client)

    fmt.Println("2")

    // result, err := client.Search(q.Query, SearchTypeTrack)
    // if err != nil {
    //   fmt.Println("3")
    //   panic(err)
    // }

    // fmt.Printf("%+v\n", result)

    fmt.Println("4")
    
    w.WriteHeader(http.StatusOK)
  }
  return fn
}