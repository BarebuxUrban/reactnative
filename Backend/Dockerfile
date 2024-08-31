# Указываем базовый образ
FROM node:14

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы приложения
COPY . .

# Открываем порт приложения
EXPOSE 5000

# Команда для запуска приложения с nodemon
CMD ["npx", "nodemon", "--exec", "babel-node", "app.js"]
