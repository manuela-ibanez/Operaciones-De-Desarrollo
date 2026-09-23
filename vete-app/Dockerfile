#Parte de una imagen de Docker que contiene Node.js 20
FROM node:20
#Define el directorio de trabajo dentro del contenedor
WORKDIR /app
#Copia los archivos package.json y package-lock.json al directorio de trabajo
COPY package*.json ./
#Instala las dependencias del proyecto
RUN npm install
#Copia todos los archivos del proyecto al directorio de trabajo
COPY . .
#Expone el puerto 4200 para que la aplicación sea accesible desde fuera del contenedor
EXPOSE 4200
#Define el comando que se ejecutará cuando se inicie el contenedor
CMD ["npm", "start", "--", "--host", "0.0.0.0"]