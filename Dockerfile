FROM node:lts-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk add --update --no-cache openssl1.1-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:lts-alpine AS runner
RUN apk add --no-cache libc6-compat
RUN apk add --update --no-cache openssl1.1-compat
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

COPY --from=builder /app/dist /app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN npm ci
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma

EXPOSE 3000

CMD [ "node", "./src/main.js" ]
