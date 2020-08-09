Cash in/out commission calculation
==================================
## Development Enviroment
*   OS : Windows 10 Pro 64bit(Build 19041)
*   Editor: VS Code (Latest)
*   NodeJs : 14.7.0
*   JS : ECMAScript 6
* Dependencies
   * dotenv 8.2.0 -> To detect Environment and Configuration
   * jsonschema 1.2.6 -> To validate input json data
   * node-fetch 2.6.0 -> To API call
* DevDependencies (All for Unit testing)
    * chai 4.2.0
    * istanbul 0.4.5
    * mocha 8.1.1
    * nyc  15.1.0
    * sinon 9.0.2
## How to run and unit test (After clone the code) 
* Go to Project folder
* Open command prompt/ powershell in the project folder
* Run the follwing command; this command will install the project dependencies.
```
npm install
```
## Run the system
* Please write the follwing command, here input.json is the input file that included in the project folder.
```
node .\src\app.js input.json
```
* If you want to input different file then you can run the follwing command, assume your input file in this location **D:/input_files/input.json**
```
node .\src\app.js D:/input_files/input.json
```

## Run the unit test
* Please run the following command
```
npm run test
```

