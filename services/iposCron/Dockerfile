FROM golang:1.23.6-bullseye AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . ./

RUN make install

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates

COPY --from=BUILDER /root/go/bin/ipos /usr/bin/ipos

ENTRYPOINT ["ipos"]

CMD ["historic"]