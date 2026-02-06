FROM node
WORKDIR /app
COPY . ./
EXPOSE 5174
RUN npm install
RUN npm install rollup@latest
CMD ["npm", "run", "dev"]