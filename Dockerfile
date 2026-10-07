FROM node:22-bookworm

RUN apt-get update \
  && apt-get install -y --no-install-recommends openjdk-21-jdk \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=production

CMD ["npm","start"]
