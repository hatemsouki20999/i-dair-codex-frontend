# ri-codex-frontend 

### Run the fontend locally

After cloning the project

## 1- Create the environment variables

- **Step1:** Open the frontend project folder
- **Step2:** Create a file and name it ".env.local" ( at the same level with "src" folder )
- **Step3:** Add the environment variables to the ".env.local" file :

```
  REACT_APP_HOST=backend host
  REACT_APP_HOST_PYTHON=python host
  REACT_APP_HOST_AUTH=authentification server host
  REACT_APP_IS_LOCAL= true or false
  REACT_APP_GOOGLE_CLIENT_ID=your google client id
  REACT_APP_HOST_MLFLOW=mlflow host
```

## 2- Install the dependencies

```
 npm install

```
## 3- Run the application

```
 npm start

```

Now the application should be started at port 3000 (default port)

PS: In order to access all the features of the application, it is necessary to have all the other hosts (backend, MLflow, authentication server,python) up and running

### Run the tests

to run the tests you just have to run

```
 npm run test

```
