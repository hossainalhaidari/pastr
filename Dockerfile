FROM golang:alpine AS build
WORKDIR /src
COPY *.go go.* /src
RUN CGO_ENABLED=0 go build -o /bin/pastr

FROM scratch
WORKDIR /app
COPY --from=build /bin/pastr ./pastr
EXPOSE 3000
ENTRYPOINT ["/app/pastr"]
