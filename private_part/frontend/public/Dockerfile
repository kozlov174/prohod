FROM node
WORKDIR /app
COPY . ./
EXPOSE 5173
RUN npm install
RUN npm install rollup@latest
CMD ["npm", "run", "dev"]