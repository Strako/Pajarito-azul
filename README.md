# [Frontend] React + TypeScript + Vite
   How to start Frontend server:
      
      -Inside projecto folder "Frontend/" run the following command:
         npm run dev
      
      -This will start a react server on the local network (--host its used)

# [Backend] Python + Flask + Jinja
   How to start Backend server
      
      -Restore the DB backup located inside "Backend/DB" (MYSQL / MariaDB)
      
      -Create the .env file in the location "Backend/src/.env" with the following data:
         SECRET_KEY= GPS2023
         DBHOST= [db host]
         DBUSER= [db user]
         DBPASS= [db password]
         DBNAME= [db name]

      -Install all the dependencies inside requeriments.txt file located at "Backend/src/requeriments.txt"
         pip install -r requirements.txt
      
      -Start the backend client runnign the following command inside "Backend/src/"
         python index.py
      
