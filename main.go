package main

import (
	"bufio"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/dchest/uniuri"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

const DbFile = "data.db"

func main() {
	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	host := os.Getenv("PASTR_HOST")

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hi!")
	})
	e.GET("/=:value", func(c echo.Context) error {
		key, err := setKey(c.ParamValues()[0])
		if err != nil {
			return echo.NewHTTPError(http.StatusNotFound)
		}
		return c.String(http.StatusOK, combine(host, key))
	})
	e.GET("/:key", func(c echo.Context) error {
		value, err := getKey(c.ParamValues()[0])
		if err != nil || value == "" {
			return echo.NewHTTPError(http.StatusNotFound)
		}

		if isUrl(value) {
			return c.Redirect(302, value)
		}

		return c.String(http.StatusOK, value)
	})

	e.Logger.Fatal(e.Start(":3000"))
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

	key := uniuri.NewLen(4)
	for {
		content, err := getKey(key)
		if err != nil {
			return "", err
		}

		if content == "" {
			break
		}

		key = uniuri.NewLen(4)
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
