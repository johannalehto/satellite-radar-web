FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL=https://satellite-radar.fly.dev
ARG VITE_USE_RADAR_FIXTURE=false

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_USE_RADAR_FIXTURE=$VITE_USE_RADAR_FIXTURE

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
