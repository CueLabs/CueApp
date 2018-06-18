package models 

import (
  "database/sql"
)

func FindTrackBySURI(db *sql.DB, s string) (TrackWithID, error) {
  query := "SELECT trackid, suri FROM tracks WHERE suri=$1"
  
  t := TrackWithID{}

  rows, err := db.Query(query, s)
  if err != nil {
    return t, err
  }
  
  for rows.Next() {
    rows.Scan(&t.ID, &t.SURI)
  }

  return t, nil
}

func InsertTrack(db *sql.DB, s string) (TrackWithID, error) {
  query := `
    INSERT INTO tracks (suri) VALUES ($1) RETURNING trackid, suri
  `

  t := TrackWithID{}

  err := db.QueryRow(query, s).Scan(&t.ID, &t.SURI)
  if err != nil {
    return t, err
  }

  return t, nil
}

func UpsertTrackInCue(db *sql.DB, cid int, tid int) error {
  query := `
    INSERT INTO cues_tracks (ct_cueid, ct_trackid)
    VALUES ($1, $2)
    ON CONFLICT (ct_trackid) DO UPDATE SET numvotes=EXCLUDED.numvotes + 1
  `

  _, err := db.Exec(query, cid, tid)
  if err != nil {
    return err
  }

  return nil
}