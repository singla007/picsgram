# React & Apollo Tutorial

This is the Picsgram project that belongs to the [Yogesh Singla]

## How to use
 ### node needs to be installed with npm 

### 1. Clone repository

```sh
git clone 
```


### 2. Start the backend server

Go to the `server` folder, install dependencies and start the server. 

```sh
cd picsgram/server
npm install
npm run dev
```




### 3. Run the react app

Now that the server is running, you can start the React app as well. The commands need to be run in a new terminal tab/window inside the root directory `react-apollo` (because the current tab is blocked by the process running the server):

```sh
npm install
npm run start
```

You can now open your browser and use the app on [http://localhost:3000](http://localhost:3000).

### 4. Edit the database schema optional for clean experience

Go to the `server/prisma` folder. 1st command to make migartions and it will make sql file in migrations folder, 2nd command is ued for executing the given change in schema.prisma file:

sh
npx prisma migrate dev --name rename-migration --create-only
npx prisma migrate dev 
