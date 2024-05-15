# include env file
ifneq (,$(wildcard ./.env))
	include .env
endif

# include env specific file
ifdef ENV
ifneq (,$(wildcard ./.env-${ENV}))
	include .env-${ENV}
endif
endif

# default
.DEFAULT_GOAL := help

.PHONY: setup
setup: ## no clobber copy .env-local to .env
	@cp -n .env-local .env

.PHONY: start
start: ## start the http server with .env
	npm run start
	# node server.ts

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
