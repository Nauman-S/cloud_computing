include ./lib/go.mk

INSTALL_DIR := ~/go/bin

BUILD_DIR := out
BIN_NAME := ipos

.PHONY: run
run:
	@docker run -d --network host --name ipos ipos:latest


.PHONY: $(BUILD_DIR)
$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

.PHONY: build
build: $(BUILD_DIR) tidy
	go build -ldflags "$(VERSION_FLAGS)" -o $(BUILD_DIR)/$(BIN_NAME) main.go

.PHONY: clean
clean:
	$(RM) $(INSTALL_DIR)/$(BIN_NAME)

.PHONY: install
install: build
	mkdir -p $(INSTALL_DIR)
	cp $(BUILD_DIR)/$(BIN_NAME) $(INSTALL_DIR)/

.PHONY: build-docker
build-docker:
	@docker build -t ipos -f ./Dockerfile .

.PHONY: stop
stop:
	@docker rm -f ipos


