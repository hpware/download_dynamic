FROM oven/bun:latest
WORKDIR /app
COPY package.json ./
COPY bun.lock* ./
RUN bun install --production
COPY . .
RUN bun run style:generate
EXPOSE 3000
CMD ["bun", "start"]
