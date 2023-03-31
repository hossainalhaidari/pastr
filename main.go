package main

import (
	"bufio"
	"fmt"
	"math/rand"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

const DbFile = "data.db"

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
var host = ""
var keyLength = 4

func init() {
	rand.Seed(time.Now().UnixNano())
	host = os.Getenv("PASTR_HOST")
	newKeyLength, err := strconv.Atoi(os.Getenv("PASTR_KEY_LENGTH"))
	if err == nil && newKeyLength >= 4 && newKeyLength <= 12 {
		keyLength = newKeyLength
	}
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Path[1:]

		if query != "" {
			if strings.HasPrefix(query, "=") {
				key, err := setKey(query[1:])
				if err == nil {
					fmt.Fprint(w, combine(host, key))
					return
				}
			} else {
				value, err := getKey(query)

				if err == nil && value != "" {
					if isUrl(value) {
						http.Redirect(w, r, value, http.StatusFound)
					}

					fmt.Fprint(w, value)
					return
				}
			}

		}

		w.WriteHeader(http.StatusNotFound)
	})

	http.ListenAndServe(":3000", nil)
}

func getKey(key string) (string, error) {
	file, err := os.Open(DbFile)
	if err != nil {
		return "", err
	}

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		text := scanner.Text()
		if strings.HasPrefix(text, key+" ") {
			return text[len(key+" "):], scanner.Err()
		}
	}

	return "", scanner.Err()
}

func setKey(value string) (string, error) {
	file, err := os.OpenFile(DbFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return "", err
	}
	defer file.Close()

	key := genKey()
	for {
		content, err := getKey(key)
		if err != nil {
			return "", err
		}

		if content == "" {
			break
		}

		key = genKey()
	}
	_, err2 := file.WriteString(key + " " + value + "\n")

	if err2 != nil {
		return "", err2
	}

	return key, nil
}

func isUrl(value string) bool {
	_, err := url.ParseRequestURI(value)
	return err == nil
}

func combine(host string, key string) string {
	url, err := url.JoinPath(host, key)
	if err != nil {
		return key
	}
	return url
}

func genKey() string {
	bytes := make([]rune, keyLength)
	for i := range bytes {
		bytes[i] = letters[rand.Intn(len(letters))]
	}
	return string(bytes)
}
