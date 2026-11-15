#Parte de una imagen de Docker que contiene Node.js 20
FROM node:20-alpine AS build
#Define el directorio de trabajo dentro del contenedor
WORKDIR /app
#Copia los archivos package.json y package-lock.json al directorio de trabajo
COPY package*.json ./
RUN npm ci
#Copia todos los archivos del proyecto al directorio de trabajo
COPY . .
#Instala las dependencias del proyecto
RUN npm run build

FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/*/browser/ /usr/share/nginx/html/

# Compatibilidad con compilaciones Angular que generan index.csr.html
RUN if [ -f /usr/share/nginx/html/index.csr.html ]; then \
      cp /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html; \
    fi
RUN test -f /usr/share/nginx/html/index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf
#Expone el puerto 80 para que la aplicación sea accesible desde fuera del contenedor
EXPOSE 80
#Define el comando que se ejecutará cuando se inicie el contenedor
CMD ["nginx", "-g", "daemon off;"]