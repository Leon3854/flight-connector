FROM node:18-alpine

# The working derrectoria
WORKDIR /app

# The coping all files with .json
COPY package*.json ./
# The installing all products for the project
RUN npm install

# The copping all in the project
COPY . .

# The command for the building
RUN npm run build

# The address
EXPOSE 3202

# The commands starts
CMD ["node", "dist/app.js"]