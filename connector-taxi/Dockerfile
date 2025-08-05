FROM node:18-alpine AS builder

# Устанавливаем зависимости для сборки
RUN apk add --no-cache python3 make g++

#Устанавливаем глобально Typescript
RUN npm install -g typescript

# Рабочая дерриктория
WORKDIR /app

# Копирование всех файлов с .json
COPY package*.json .
COPY tsconfig.json .

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 3202
CMD [ "node", "dist/app.js" ]