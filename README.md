# [Pajarito Azul] (Twitter Clone)
<p align="center">
  <img src="https://i.ibb.co/mBW7r1p/Screen-Shot-2023-09-17-at-16-50-34.png" />
</p>

***


   This project has the purpose to create an open source twitter clone that can be deployed by anyone who requires an internal social tool or a community with no internet access.

   The first functionalities that will be added are the following:

      Login / Create account	
         -User
         - Password
 
      Users	
         - Follow / Unfollow
         - Profile image
         - Profile name
         - @User
         - Description

      Profile	
         - View profile image
         - View profile name
         - View @User
         - View Description
         - Tweet buttton
         - Edit profile button

      Tweet	  
         - List own tweets
         - Create tweet 
         - Delete tweet
         - Like / Dislike

      Edit profile	
         - Edit name
         - Edit description
         - Change password
         - Change profile image

      Home	
         - Show tweets from following profiles

      Explore	
         - User search by @User
         
      Notifications	
         - Follows
         - Likes
***


# [Frontend] React + TypeScript + Vite
   ## How to start Frontend server:
      
      -Inside projecto folder "Frontend/" run the following command:
         `npm run dev``
      
      -This will start a react server on the local network (`--host`` its used)
***


# [Backend] Python + Flask + Jinja
   ## How to start Backend server
      
      -Restore the DB backup located inside "Backend/DB" (MYSQL / MariaDB)
      
      -Create the .env file in the location "Backend/src/.env" with the following data:
         `SECRET_KEY= GPS2023`
         `DBHOST= [db host]`
         `DBUSER= [db user]`
         `DBPASS= [db password]`
         `DBNAME= [db name]`

      -Install all the dependencies inside requeriments.txt file located at "Backend/src/requeriments.txt"
         `pip install -r requirements.txt`
      
      -Start the backend client runnign the following command inside "Backend/src/"
         `python index.py`
***

# [Endpoint testing] Postman
   ## Postman collection
      
  -The postman collection its located at "Backend/Postman" containing all the endpoints and http methods used int he software
