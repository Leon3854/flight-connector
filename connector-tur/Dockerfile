FROM node:18-alpine AS builder

# Устанавливаем зависимости для сборки
RUN apk add --no-cache python3 make g++

# Устанавливаем глобально TypeScript
RUN npm install -g typescript

# The working derrectoria
WORKDIR /app

# The coping all files with .json
COPY package*.json .
COPY tsconfig.json .

# Устанавливаем ВСЕ зависимости (включая dev)
RUN npm install

# The copping all in the project
COPY . .

# The command for the building
RUN npm run build

# Финальный образ
FROM node:18-alpine

WORKDIR /app

# Копируем только необходимое из builder-стадии
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Очищаем dev-зависимости
RUN npm prune --production

EXPOSE 3202
CMD ["node", "dist/app.js"]