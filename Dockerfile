# Этап сборки фронтенда
FROM node:22-alpine AS build

WORKDIR /app

# Копируем только package* для установки зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci || npm install

# Копируем весь фронт внутрь контейнера
COPY . .

# Vite читает переменные с префиксом VITE_ на этапе сборки
# Здесь можно хардкоднуть localhost для dev (потом поменяешь на прод-URL)
ENV VITE_API_BASE_URL=http://host.docker.internal:8000

# Собираем production build
RUN npm run build

# Этап рантайма — отдаем статику через nginx
FROM nginx:1.27-alpine

# Очищаем дефолтный html
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Копируем собранный фронт
COPY --from=build /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
