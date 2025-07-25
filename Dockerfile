FROM --platform=linux/arm64 node:18-alpine

WORKDIR /app

# Копируем package.json первым для кэширования
COPY package*.json /

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы (игнорируя отсутствующие)
COPY . .

# Собираем проект
RUN npm run build

EXPOSE 3202
# CMD ["npm", "run", "dev"]
CMD ["node", "--loader", "ts-node/esm", "dist/app.js"]