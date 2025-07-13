package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/fsnotify/fsnotify"
)

func main() {
	var totalFileNum int = 0
	// Create new watcher.
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
	}
	defer watcher.Close()

	// Start listening for events.
	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				switch {
				case event.Has(fsnotify.Create):
					totalFileNum++
					log.Printf("New file created: %s (Total files: %d)", event.Name, totalFileNum)
				case event.Has(fsnotify.Remove):
					totalFileNum--
					log.Printf("File removed: %s (Total files: %d)", event.Name, totalFileNum)
				case event.Has(fsnotify.Write):
					log.Printf("Modified file: %s", event.Name)
				case event.Has(fsnotify.Chmod):
					return
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("error:", err)
			}
		}
	}()

	// Construct path to /data directory
	dataPath := filepath.Join("../../", "data")

	// Create the data directory if it doesn't exist
	if err := os.MkdirAll(dataPath, 0755); err != nil {
		log.Fatal(err)
	}

	// Add the data directory to watch
	err = watcher.Add(dataPath)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Monitoring directory: %s\n", dataPath)

	// Block main goroutine forever.
	<-make(chan struct{})
}
