FROM oven/bun:latest
WORKDIR /app
COPY package.json ./
COPY bun.lock* ./
RUN bun install --production
COPY . .
RUN bun run styles:generate
RUN bun run scripts:optimize
EXPOSE 3000
CMD ["bun", "service:start"]
