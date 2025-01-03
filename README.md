<div align="center" id="readme-top">
  <a href="https://github.com/gomisroca/esia">
    <img src="banner.webp" alt="Logo" width="300" height="100">
  </a>

<h3 align="center">ESIA Gallery</h3>

  <p align="center">
    ESIA is an art gallery website, where visitors can find the artworks available, the past, current and upcoming exhibitions as well as updates on what's happening in the gallery.
    <br />
    <a href="https://github.com/gomisroca/esia"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://esia.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/gomisroca/esia/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/gomisroca/esia/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li>
      <a href="#api-specification">API Specification (tRPC)</a>
      <ul>
        <li><a href="#procedure-types">Procedure Types</a></li>
        <li><a href="#artworks">Artworks</a></li>
        <li><a href="#artsyles">Artstyles</a></li>
        <li><a href="#artists">Artists</a></li>
        <li><a href="#blogs">Blogs</a></li>
        <li><a href="#exhibitions">Exhibitions</a></li>
      </ul>
    </li>
    <li>
      <a href="#adjustments">Adjusting the Codebase</a>
      <ul>
        <li><a href="#login-providers">Login Providers</a></li>
        <li><a href="#database-options">Database Options</a></li>
        <li><a href="#image-handling">Image Handling</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
<h2 id="about-the-project">📡 About The Project</h2>

![Screen Shot](screenshot.webp)

The project is a web application that allows the creation of a full-fledged art gallery site.  
The users will be able to navigate through the different artworks, artists and styles offered in the gallery, as well as any exhibitions and news.

### Built With
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase Badge](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff&style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)  
![tRPC](https://img.shields.io/badge/tRPC-%232596BE.svg?style=for-the-badge&logo=tRPC&logoColor=white)
![Zod Badge](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=fff&style=for-the-badge)  
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)  

<p align="right">[<a href="#readme-top">back to top</a>]</p>



<!-- GETTING STARTED -->
<h2 id="getting-started">📋 Getting Started</h2>

Follow these steps to get your own local copy of the project up and running.

<h3 id="prerequisites">Prerequisites</h3>

Make sure you have node.js and npm installed on your machine.
* npm
  ```sh
  npm install npm@latest -g
  ```
Beyond this, if you plan on adjusting the codebase, you might need some knowledge of TypeScript, React, Next.js, Next Auth, tRPC, Zod or Prisma depending on the changes you want to make.

<h3 id="installation">Installation</h3>

1. Set up your login providers for admin accounts. By default, we use [Google OAuth](https://console.cloud.google.com). If you want to use different login methods, you will have to adjust the codebase accordingly. More details [here](#login-providers).
2. Set up your database. By default, we use PostgreSQL via Prisma. If you want to use a different database, you will have to adjust the codebase accordingly. More details [here](#database-options).
3. Set up image hosting. By default, we use Supabase Buckets. If you want to use a different image hosting service, you will have to adjust the codebase accordingly. More details [here](#image-hosting).
4. Clone the repo
   ```sh
   git clone https://github.com/gomisroca/esia.git
   ```
5. Install NPM packages
   ```sh
   npm install
   ```
6. Check `.env.example` and create an `.env` file
   ```js
   DATABASE_URL="postgresql://postgres:password@localhost:5432/esia"
   DIRECT_URL="postgresql://postgres:password@localhost:5432/esia"
   etc...
   ```
7. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

<p align="right">[<a href="#readme-top">back to top</a>]</p>



<!-- USAGE EXAMPLES -->
<h2 id="usage">💠 Usage</h2>

You can run the project in development mode from the main folder with **npm run dev**.  

After initializing the database, run **npm run db:push** to apply the Prisma schema.  
Optionally, run **npm run db:seed** to seed the database with some sample data from the [Art Institute of Chicago API](https://api.artic.edu/docs/#introduction).  

All necessary environment variables can be found in **.env.example**.

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

To get started uploading your own data directly from the website, initialize the database and log into the website via **/sign-in**. Afterwards, find your user in the database, give yourself admin privileges and add the account's email to your **.env** ADMIN_ACCOUNTS. You can now access the admin panel at **/admin**.

<p align="right">[<a href="#readme-top">back to top</a>]</p>



<!-- API SPECIFICATION -->
<h2 id="api-specification">🚀 API Specification (tRPC)</h2>
  This project uses **tRPC** for type-safe API procedures. All API calls are end-to-end type-checked, providing compile-time safety and excellent developer experience.

<h3 id="procedure-types">Procedure Types</h3>

  * **QUERY**: Read operations (fetching data)  
  * **CREATE**: Create new resources  
  * **UPDATE**: Modify existing resources  
  * **DELETE**: Remove resources  

<h3 id="artworks">🎨 Artworks</h3>
<details>
  <summary>Methods and Procedures</summary>

| Procedure | Method | Description | Input | Output |
| --- | --- | --- | --- | --- |
| QUERY | `getUnique` | Get a unique artwork | ID | Artwork |
| QUERY | `getAll` | Get paginated artworks | Limit?, Cursor? | Artwork[] |
| QUERY | `search` | Get all artworks by search query | Search Term | Artwork[]? |
| CREATE | `create` | Create new artwork | Artwork Data | Artwork |
| UPDATE | `update` | Update an existing artwork | Artwork Data | Artwork |
| DELETE | `delete` | Delete an existing artwork | ID | Boolean |


</details>

<h3 id="artsyles">💄 Artstyles</h3>
<details>
  <summary>Methods and Procedures</summary>

| Procedure | Method | Description | Input | Output |
| --- | --- | --- | --- | --- |
| QUERY | `getUnique` | Get all artworks in a style | Name | Artwork[] |
| QUERY | `getAll` | Get all styles | | Artstyle[] |

</details>

<h3 id="artists">👨‍🎨 Artists</h3>
<details>
  <summary>Methods and Procedures</summary>

| Procedure | Method | Description | Input | Output |
| --- | --- | --- | --- | --- |
| QUERY | `getUnique` | Get a unique artist and their artworks | ID | Artist + Artwork[] |
| QUERY | `getAll` | Get all artists | | Artist[] |
| CREATE | `create` | Create new artist entry | Artist Data | Artist |
| UPDATE | `update` | Update an existing artist | Artist Data | Artist |
| DELETE | `delete` | Delete an existing artist | ID | Boolean |

</details>

<h3 id="blogs">📚 Blogs</h3>
<details>
  <summary>Methods and Procedures</summary>

| Procedure | Method | Description | Input | Output |
| --- | --- | --- | --- | --- |
| QUERY | `getUnique` | Get a unique blog entry | ID | Blog |
| QUERY | `getAll` | Get paginated blog entries | Limit?, Cursor? | Blog[] |
| CREATE | `create` | Create new blog entry | Blog Data | Blog |
| UPDATE | `update` | Update an existing blog entry | Blog Data | Blog |
| DELETE | `delete` | Delete an existing blog entry | ID | Boolean |

</details>

<h3 id="exhibitions">📅 Exhibitions</h3>
<details>
  <summary>Methods and Procedures</summary>

| Procedure | Method | Description | Input | Output |
| --- | --- | --- | --- | --- |
| QUERY | `getUnique` | Get a unique exhibition | ID | Exhibition |
| QUERY | `getAll` | Get paginated exhibitions | Limit?, Cursor? | Exhibition[] |
| CREATE | `create` | Create new exhibition | Exhibition Data | Exhibition |
| UPDATE | `update` | Update an existing exhibition | Exhibition Data | Exhibition |
| DELETE | `delete` | Delete an existing exhibition | ID | Boolean |

</details>


<p align="right">[<a href="#readme-top">back to top</a>]</p>



<!-- ADJUSTMENTS -->
<h2 id="adjustments">🔨 Adjusting the Codebase</h2>

  <h3 id="login-providers">🔑 Login Providers</h3>

  By default, we use [Google OAuth](https://console.cloud.google.com) via [NextAuth](https://next-auth.js.org/).  
  If you wish to keep using NextAuth, you can easily add more login providers to your project. You can read more about how to do this [here](https://next-auth.js.org/providers/).  

  However, if you wish to move away from Next Auth, you will have to remove its package and remove *app/api/auth/[...nextauth]* and *server/auth.ts* (or modify them).
  Then, you can implement your own authentication logic. Depending on the needs of your authentication process, you might need to adjust the database schemas.
  Afterwards, you will want to modify the sign in and out logic, as well as any instances of 'session' in the codebase.
  
  <h3 id="database-options">💾 Database Options</h3>

  By default, we use PostgreSQL via Prisma. If you wish to use a different relational database, the switch should be mostly trivial, having only to adjust the settings in *prisma/schema.prisma*.

  If you wish to use a non-relational database (e.g. MongoDB), Prisma will help make the transition easier, but you will have to tinker the schema. You can read more about it in this [MongoDB article](https://www.mongodb.com/resources/compare/mongodb-postgresql/dsl-migrating-postgres-to-mongodb) and in the [Prisma documentation](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/mongodb-typescript-mongodb).

  <h3 id="image-handling">🖼️ Image Handling</h3>

  By default we use [Supabase Buckets](https://supabase.com/docs/guides/storage) for image handling. If you want to switch to a different method, you can remove the *src/supabase.js* file and adjust the settings in *src/utils/uploadImage.ts*. Furthermore, in *src/utils/uploadChecks.ts* you can modify which types of files and sizes are allowed.

  The implementation of each image hosting method is beyond the scope of this documentation, but easy steps to follow should be provided by the option you choose.

<p align="right">[<a href="#readme-top">back to top</a>]</p>



<!-- ROADMAP -->
<h2 id="roadmap">📍 Roadmap</h2>

- [ ] Optimize images
  - [ ] Adjust fetch methods
  - [ ] Adjust formats
- [ ] Improve Database efficiency
  - [ ] Artist => Artist relation

See the [open issues](https://github.com/gomisroca/esia/issues) for a full list of proposed features (and known issues).

<p align="right">[<a href="#readme-top">back to top</a>]</p>


<!-- LICENSE -->
<h2 id="license">🔒 License</h2>

Distributed under the MIT License. See `LICENSE.txt` for more information.


<!-- CONTACT -->
<h2 id="contact">📧 Contact</h2>

Adrià Gomis - [@gomisroca](https://github.com/gomisroca) - gomisroca@gmail.com


<p align="right">[<a href="#readme-top">back to top</a>]</p>