FROM node as development

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine as production

COPY --from=development /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY env.sh /docker-entrypoint.d/env.sh
RUN dos2unix /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]