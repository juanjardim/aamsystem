#Authentication and Authorization Management System (AAMSystem)#

This project will allow to different web applications, written in PHP, JavaScript (Node), etc, to authenticate users and get all the permissions that the user has for that application.

To run this project please run the following commands: 
- npm install
- npm start
    
If you want to run all the tests, after the npm install command, run: npm test.

Be aware that this project need a mongo database where will be storage all the information that **AAMSystem** needs.

The User authentication could be directly made by a frontend (that will be ready in the second phase of this project) in order to edit any particular data related with the user. Also, the Admin user, could Add, Edit or Remove Users, Groups, Applications and Permissions.

If the authentication occurs through another aplication, let say, a PHP application, then, this application would have a token (generated by the Admin of **AAMSystem**) and with that token, the application can request an authorization to **AAMSystem** for that particular user. If the user has access to that application, the **AAMSystem** would return a new token that the PHP application can storage or validate against the secret  phrase that **AAMSystem** generated when the PHP aplication was created in the AAMSystem.

