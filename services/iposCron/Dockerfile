FROM golang:1.23.6-bullseye AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . ./

RUN make install

ENTRYPOINT ["sleep", "3600"]

FROM debian:bookworm-slim

COPY --from=BUILDER /root/go/bin/ipos /usr/bin/ipos

ENTRYPOINT ["ipos"]

CMD ["historic"]