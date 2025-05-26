FROM node:22-alpine
WORKDIR /app


RUN mkdir -p /app/cred
ARG KEY_CREDENTIALS
RUN echo "$_KEY_CREDENTIALS_JSON" > /app/cred/key_credentials.json


COPY . .
RUN npm install

EXPOSE 5000
CMD ["node", "index.js"]