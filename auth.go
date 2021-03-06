 package main

import (
  "log"
  "net/http"
  "github.com/zmb3/spotify"
  "github.com/mattcarpowich1/cueapp/models"
  "database/sql"
  "time"
  "fmt"
)

const redirectURI = "https://cueapp2.herokuapp.com/callback"

var (
  Auth      = spotify.NewAuthenticator(redirectURI, "user-read-private", "user-read-birthdate", "user-modify-playback-state", "streaming", "user-read-birthdate", "user-read-email")
  State     = "abc1234"
  id        models.User
  err2      error
  u         models.SpotifyUserData
)

func CompleteAuth(dbCon *sql.DB) http.HandlerFunc {
  fn := func(w http.ResponseWriter, r *http.Request) {
    tok, err := Auth.Token(State, r)
    if err != nil {
      http.Error(w, "Couldn't get token", http.StatusForbidden)
      log.Fatal(err)
      return
    }
    if st := r.FormValue("state"); st != State {
      http.NotFound(w, r)
      log.Fatalf("State mismatch: %s != %s\n", st, State)
      return
    }

    // Use the token to get an authenticated client
    client := Auth.NewClient(tok)
    user, err3 := client.CurrentUser()
    if err3 != nil {
      log.Fatal(err3)
      return
    }

    fmt.Println("token")
    fmt.Println(tok.AccessToken)

    // Check if authenticated user exists in DB
    u, err4 := models.FindUserBySUID(dbCon, user.ID)
    if err4 != nil {
      panic(err4)
      return
    }

    if u.ID > 0 {
      err2 = models.UpdateToken(dbCon, user.ID, tok.AccessToken)
      if err2 != nil {
        panic(err2)
        return
      } 

      sub := &spotifySubscription{client: &client, suid: user.ID}
      S.register <- sub
    }  else {
      fmt.Println("image situation")
      fmt.Println(user.Images)
      var imgUrl = ""
      if len(user.Images) > 0 {
        imgUrl = user.Images[0].URL
      } 
      // Insert new user in the database with the authenticated users SUID
      newUser := models.NewSpotifyUser{
        SUID: user.ID,
        DisplayName: user.DisplayName,
        DisplayImage: imgUrl,
        CreatedAt: time.Now(),
      }

      _, err := models.InsertSpotifyUser(dbCon, &newUser)
      if err != nil {
        panic(err)
        return
      }

      err2 = models.UpdateToken(dbCon, user.ID, tok.AccessToken)
      if err2 != nil {
        panic(err2)
        return
      } 

      // Send client to spotifyHub
      sub := &spotifySubscription{client: &client, suid: user.ID}
      S.register <- sub
    }

    http.Redirect(w, r, ("/user/" + user.ID), 301)
  }
  return fn
}
