# gitCraft
## Summer 2024 CSDS393 Group 2 project

A central location for handmade crafters to gather, to share and inspire others, and to be creative with other projects as a springboard

gitCraft is an app for sharing craft projects with the user community, with the ability to copy, or "fork", other posts into a private collection, where they are free to edit the project with personal customizations. When a project is completed, the user can create a post to submit to the community feed.


## Tech Description
gitCraft is a backend application designed to manage various functionalities. This application leverages technologies such as Express.js, MongoDB, and JSON Web Tokens (JWT) for secure authentication and other backend services.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Dev Dependencies](#dev-dependencies)
- [Author](#author)
- [License](#license)

## Installation
To install and set up the project, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/cwru-courses/gitCraft.git
    cd git-craft
    ```

2. **Set up environment :**
    #### Installs nvm (Node Version Manager)
     ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```


#### download and install Node.js (you may need to restart the terminal)

```bash
nvm install 20
```

#### verifies the right Node.js version is in the environment

```bash
node -v # should print `v20.16.0`
```

#### verifies the right npm version is in the environment
```bash
npm -v # should print `10.8.1`
```   


3. **Build and run the project:**
    ```bash
    npm start
    ```

npm start will install and build both client and server




The above script will install all the application and dependencies for both Angular and Node 

## Usage
After installation, you can run the application. Ensure that all the environment variables are correctly set up before starting the application.



## Dependencies
- **bcryptjs:** ^2.4.3
- **cors:** ^2.8.5
- **dotenv:** ^16.4.5
- **express:** ^4.19.2
- **jsonwebtoken:** ^9.0.2
- **mongoose:** ^8.5.1
- **multer:** ^1.4.5-lts.1
- **nodemailer:** ^6.9.14
- **swagger-jsdoc:** ^6.2.8
- **swagger-ui-express:** ^5.0.1

## Dev Dependencies
- **nodemon:** ^3.1.4

## Author
- Lulu Sun 
- Andrew Ziets
- Shrabani Sen
- Shanmuga Ganesh Thiruppathy
- Lokesh Poluru Velayudham

## License
This project is licensed under the ISC License.
