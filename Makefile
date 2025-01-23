
.PHONY: develop
develop:
	echo "Server running, run npm run start in another terminal to start the Office client"
	npm run dev-server

.PHONY: deploy
deploy:
	cp -r ./dist ./deploy/dist
	docker build -t deploy ./deploy
	docker run -it deploy