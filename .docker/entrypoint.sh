#!/bin/sh 

if [ ! -f ".env"]; then
    echo "No .env file found. Creating one..."
    cp .env.example .env
fi

npm install

npm run start:dev