FROM oven/bun:latest
WORKDIR /app
COPY package.json ./
COPY bun.lock* ./
RUN bun install --production
COPY . .
EXPOSE 3000
CMD ["bun", "start"]
