APP_NAME := nextjs-app
PORT := 3000

.PHONY: docker docker-run docker-stop

# Dockerイメージのビルド
docker:
	docker build -t $(APP_NAME) .

# コンテナの起動
docker-run:
	docker run -d -p $(PORT):3000 --name $(APP_NAME)-container $(APP_NAME)

# 実行中のコンテナの停止
docker-stop:
	docker stop $$(docker ps -q --filter "name=$(APP_NAME)-container") && \
	docker rm $$(docker ps -a -q --filter "name=$(APP_NAME)-container")