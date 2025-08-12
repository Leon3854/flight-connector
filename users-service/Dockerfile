FROM node:20-alpine
WORKDIR /app

# Установка зависимостей
COPY package*.json .
COPY tsconfig.json .
COPY jest.config.cjs .
COPY src/config/knex/knexfile.ts ./knexfile.ts
COPY src/database ./src/database


RUN npm set strict-ssl false
RUN npm config set registry https://registry.npmjs.org/

RUN npm install

# Копирование исходного кода
COPY . .

RUN mkdir -p /database && \
    ln -s /app/src/database/migrations /database/migrations && \
    ln -s /app/src/database/seeds /database/seeds

# RUN npm run build && \
#     mkdir -p dist/config/knex dist/database dist/types dist/lib && \
#     cp -r src/config/knex/* dist/config/knex/ && \
#     cp -r src/database/* dist/database/ && \
#     cp -r src/types/* dist/types/ && \
#     cp -r src/lib/* dist/lib/

CMD ["node", "dist/src/app.js"]

# FROM node:18-alpine

# WORKDIR /app

# # Копируем только необходимые для установки зависимостей файлы
# COPY package*.json .
# COPY tsconfig.json .

# # Устанавливаем зависимости
# RUN npm install

# # Копируем остальные файлы
# COPY . .

# # Создаем симлинк (теперь с правильным путем)
# RUN mkdir -p /app/src/config/knex && \
#     ln -sf /app/src/config/knex/knexfile.ts /app/src/config/knex/knexfile.js


# # Собираем проект
# RUN npm run build && \
#     mkdir -p /app/dist/config/knex && \
#     cp /app/src/config/knex/*.stub.ts /app/dist/config/knex/

# # Указываем правильный путь к точке входа
# CMD ["node", "dist/src/app.js"]