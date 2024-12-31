# news-aggregator-test

Directives on how to run news-aggregator-bk

1. open your terminal and navigate to /news-aggregator-bk
2. run cp .env.example .env for mac/linux or copy .env.example .env for windows
3. run docker-compose build to build the docker image
4. run docker-compose up -d to run the docker image
5. run docker ps to see running containers and copy the container id of news-app-bk
6. run docker exec -it container-id bash to access the container terminal. Replace container id in this command docker exec -it container-id bash with the container id you got from the above instruction.
7. run composer install to install composer in the container.
8. run php artisan migrate:fresh --seed to create the required tables in the db and seed categories to the db
9. run php artisan fetch:news to fetch news from various apis and save to the db. not this takes a while depending on your network
10. run php artisan serve to start the serve
11. access phpmyadmin on localhost:8080


Directives on how to run news-aggregator-fe

1. open your terminal and navigate to /news-aggregator-fe
2. run docker build -t news-app . to build the docker image
3. run docker run -p 3000:3000 news-app
4. access the site on http://localhost:3000