FROM node:18-alpine

WORKDIR /app

# Копируем package.json первым для кэширования
COPY package*.json ./
COPY tsconfig.json .

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы (игнорируя отсутствующие)
COPY . .

# Собираем проект
RUN npm run build




# Копируем package.json в dist и устанавливаем только production зависимости
# WORKDIR /app/dist
# COPY ./dist ./dist
# COPY package*.json ./
# RUN npm install --production

# Удаляем devDependencies (если нужно)
RUN npm prune --production

EXPOSE 3202
CMD ["node", "dist/app.js"]