FROM node:12.18.2 as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install
COPY . ./
RUN npm run build

FROM nginx:1.23.3
COPY --from=build /app/public /usr/share/nginx/html