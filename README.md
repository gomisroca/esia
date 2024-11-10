<p align="center">
  <img src="banner.png" />
</p>


## About
ESIA is an art gallery website, where visitors can find the artworks available, the past, current and upcoming exhibitions as well as updates on what's happening in the gallery.

## Built With
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)  
![tRPC](https://img.shields.io/badge/tRPC-%232596BE.svg?style=for-the-badge&logo=tRPC&logoColor=white)  
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)  
  
## Usage
You can run the project in development mode from the main folder with **npm run dev**.

To initialize the database, run **npm run db:push**. 
Optionally, run **npm run db:seed** to seed the database with some sample data taken from the [*Art Institute of Chicago API*](https://api.artic.edu/docs).

All necessary environment variables can be found in **.env.example**.

Commit messages must follow the [*Conventional Commits*](https://www.conventionalcommits.org/en/v1.0.0/) specification.

To get started uploading your own data directly from the website, initialize the database and log into the website. Afterwards, find your user in the database and give yourself admin privileges. You can now access the admin panel at **/admin**.
While the image uploading process has been tuned to Supabase's storage service, it should be fairly simple to migrate to process to any other service.


