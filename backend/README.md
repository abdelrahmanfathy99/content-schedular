## About Content-Schedular

This application is a simplified content scheduling application that lets users create and schedule posts 
across multiple social platforms.

## Features

- Authentication using Laravel Sanctum
- CRUD for Posts
- Post scheduling
- Platform assignment
- Dashboard for posts statistics.
- Handle basic validation for platform requirements
- Activity logging (Spatie)

## Tech Stack

- PHP ^8.3
- Laravel ^12
- MySQL
- Sanctum (for API authentication)
- Spatie Activity Log

## Installation

- clone the repo (git clone https://github.com/abdelrahmanfathy99/content-schedular.git)
- composer install
- cp .env.example .env
- configuration of database in .env file
- php artisan key:generate
- php artisan migrate --seed
- php artisan serve

## API Testing with Postman

A Postman collection is included to help you test all API endpoints easily.

- You can find the collection in the `/postman` folder
- Import the collection into Postman to get started quickly.
- Remember to update the environment variables such as `base_url` and authentication tokens as needed.

