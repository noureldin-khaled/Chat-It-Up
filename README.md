# Chat It Up
A wep application for chatting, where users can register for account and chat with each other.

## How to run the project
### A) You have to have the following requirments installed:
1) NodeJS, preferably v7.8.0 or higher
2) mongodb, preferably v3.4.4 or higher
3) npm, you can install it by running this command in your terminal
```bash
$ sudo apt-get install npm
```
### B) Clone the repository
```bash
$ git clone https://github.com/soofyhbk2007/Chat-It-Up/
```
### C) Navigate to the project's directory

### D) Install the project's dependencies
```bash
$ sudo npm install
```
### E) Create a file in the project's directory and name it `.env`

### F) Open the `.env` file and paste the following in it (make sure to set the variables that are in <> bracket to your own)
```
env=dev
PORT=8080
DB_URL=<PUT_DB_URL>
JWT_SECRET=<PUT_YOUR_SECRET>
```
### G) Run the project
```bash
$ npm start
```
### H) Browse to the website from this URL `http://localhost:8080`
