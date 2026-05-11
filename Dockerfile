# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm build

# Stage 2: Prod
FROM node:22-alpine AS prod

WORKDIR /app

RUN corepack enable

COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

CMD ["node", "dist/main.js"]