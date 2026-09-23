#Parte de una imagen base de Node.js
FROM node:20 
#Definir el directorio de trabajo dentro del contenedor
WORKDIR /app
#Copiar los archivos de dependencias al contenedor
COPY package*.json ./
#Instalar las dependencias del proyecto
RUN npm install
#Copiar el resto de los archivos del proyecto al contenedor
COPY . .
#Construir la aplicación para producción
RUN npm run build
#Exponer el puerto en el que la aplicación se ejecutará
EXPOSE 3000
#Definir el comando que se ejecutará al iniciar el contenedor
CMD ["npm", "run", "start:prod"]