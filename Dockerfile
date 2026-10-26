FROM node:22-alpine

WORKDIR /app

COPY simulator/package*.json ./simulator/
RUN cd simulator && npm install --save-dev nodemon

COPY simulator ./simulator

WORKDIR /app/simulator

EXPOSE 3002

CMD ["npm", "run", "dev"]
