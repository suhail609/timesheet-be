# ⏱️ Time-Sheet App (NestJS)

This is a time-sheet tracking application built with **NestJS**.  
It uses **PostgreSQL** as the main relational database and **MongoDB** for logging purposes.

---

## 📦 Requirements

- Node.js
- npm
- PostgreSQL
- MongoDB

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repo-url>
cd time-sheet
npm install
```

🗄️ Database Setup
This app requires a PostgreSQL database named time-sheet.

Option 1: Create the database manually
Log into your PostgreSQL CLI or use a GUI like pgAdmin and run:

CREATE DATABASE "time-sheet";



Option 2: Use the create_db.sh script
Open create_db.sh

Edit the file and replace the placeholders with your actual PostgreSQL username and password

Run the script:
```bash
./create_db.sh
```





🔄 Migrations
This project uses Sequelize migrations for managing database schema.

Create a migration file
```bash
npm run migration:generate
```
🔧 The generated file will be empty — you need to edit it to define your table or schema change

Run migrations
```bash
npm run migrate
```
This applies all pending migrations to your database.




▶️ Run the App
Start the development server:
```bash
npm run dev
```



🧰 Technologies Used
NestJS – Backend framework

PostgreSQL – Main database

MongoDB – Used for logging to a separate database




## 📜 Scripts Summary

| Command                          | Description                                                   |
|----------------------------------|---------------------------------------------------------------|
| ```npm run dev```         | 🔹 Run the app in development mode                            |
| ```npm run migration:generat``` | 🔹 Generate a new (empty) migration file *(must be edited)*   |
| ```npm run migrate```     | 🔹 Run all pending migrations                                 |
| ```./create_db.sh```      | 🔹 Create the PostgreSQL `time-sheet` database *(edit credentials first)* |
