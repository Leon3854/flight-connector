FROM node:18-alpine

WORKDIR /app

# Копируем package.json первым для кэширования
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы (игнорируя отсутствующие)
COPY . .

# Собираем проект
# --- так ка у нас идет пока development это не надо
RUN npm run build

EXPOSE 3202
CMD ["node", "dist/app.js"]
# CMD ["npm", "run", "dev"]
# CMD ["node", "--loader", "ts-node/esm", "dist/app.js"]