FROM node

WORKDIR /usr/app

COPY ./. .
RUN npm cache verify && \
    rm -rf ./node_modules && \
    npm install


EXPOSE 3000
