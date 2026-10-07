FROM eclipse-temurin:21-jdk-jammy

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y --no-install-recommends nodejs && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production

CMD ["npm","start"]
