FROM nginx
RUN mkdir /app
ADD . /app
RUN cp /app/nginx.conf /etc/nginx/conf.d/default.conf
