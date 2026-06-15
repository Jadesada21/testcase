FROM node:22-alpine AS builder

WORKDIR /APP

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM ngnix:alpine

COPY --from=builder /app/dist /usr/share/ngnix/html

EXPOSE 80

CMD ["nxinx" , "-g" , "daemon off;"]
