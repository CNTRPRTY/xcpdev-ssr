FROM node:18-alpine

RUN mkdir /xcpdev-ssr/

COPY ./package.json /xcpdev-ssr/package.json
WORKDIR /xcpdev-ssr

RUN npm install

COPY ./src ./src

CMD ["npm", "run", "main"]
