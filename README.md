# Hermes
office bot

## How to run

* Build image: 

`docker build -t vilnius/breakfast-bot:1.0.0 .`

* Run image:

`docker run -e SLACK_KEY=<YOUR_SLACK_API_KEY> GOOGLE_SHEET_ID=<GOOGLE_SHEET_ID> vilnius/breakfast-bot:1.0.0`