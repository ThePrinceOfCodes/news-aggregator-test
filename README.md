# news-aggregator-test

Directives on how to run news-aggregator-bk

1. open your terminal and navigate to /news-aggregator-bk
2. run composer install to install all required packages
3. ./vendor/bin/sail up to start the app in docker. note for this to work, you need to have docker installed and running on your device
4. open a new terminal, navigate to /news-aggregator-bk and run ./vendor/bin/sail artisan migrate:fresh --seed to migrate the tables and seed categories data to the db.
5. 

Directives on how to run news-aggregator-fe

1. open your terminal and navigate to /news-aggregator-fe
2. run npm install to install required packages
3.