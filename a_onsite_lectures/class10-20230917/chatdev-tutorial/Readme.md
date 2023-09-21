# ChatDev Tutorial

1.  Download and install [anaconda](https://www.anaconda.com/download)

2.  Clone the ChatDev gitHub repository

    ```git
    git clone https://github.com/OpenBMB/ChatDev.git
    ```

3.  Set Up and activate Python Environment

    - Linux or MAC

      1. Ensure you have a version 3.9 or higher Python environment. Create and activate environment using the following commands, replacing `ChatDev_conda_env` with your preferred environment name

         ```py
         conda create -n ChatDev_conda_env python=3.9 -y
         conda activate ChatDev_conda_env
         ```

    - Windows

      1. Open `conda prompt` from the start menu
      2. Create and activate environment using the following commands, replacing `ChatDev_conda_env` with your preferred environment name

         ```py
         conda create -n ChatDev_conda_env python=3.9 -y
         conda activate ChatDev_conda_env
         ```

4.  Move into the `ChatDev` directory using terminal or conda prompt and install the necessary dependencies by running the following.

    ```cmd
    pip3 install -r requirements.txt
    ```

5.  Set OpenAI API Key

    1. Login to [Open AI](https://openai.com/)
    2. Navigate to API page
    3. Click your `profile` on the top right corner
    4. Check your free limit from `Usage` tab, if limit expired buy credits or use some different account
    5. Click `View API Keys`
    6. From the left sidebar open `Api Keys`
    7. Create new secret key
    8. Save your generated key

    - Linux or MAC

      1. Export your OpenAI API key as an environment variable. Replace "your_OpenAI_API_key" with your actual API key. Remember that this environment variable is session-specific, so you need to set it again.

         ```py
         export OPENAI_API_KEY="your_OpenAI_API_key"
         ```

    - Windows

      1. Export your OpenAI API key as an environment variable. Replace "your_OpenAI_API_key" with your actual API key. Remember that this environment variable is session-specific, so you need to set it again.

         ```py
         set OPENAI_API_KEY="your_OpenAI_API_key"
         ```

6.  Use the following command to initiate the building of your software, replacing `[description_of_your_idea]` with your idea's description and `[project_name]` with your desired project name. Check example in the next section

    - Linux or MAC

      ```py
      python3 run.py --task "[description_of_your_idea]" --name "[project_name]"
      ```

    - Windows

      ```py
      python run.py --task "[description_of_your_idea]" --name "[project_name]"
      ```

7.  Once generated, you can find your software in the `WareHouse` directory under a specific project folder, such as `project_name_DefaultOrganization_timestamp`. Run your software using the following command within that directory

    - Linux or MAC

      ```py
      cd WareHouse/project_name_DefaultOrganization_timestamp
      python3 main.py
      ```

    - Windows

      ```py
      cd WareHouse/project_name_DefaultOrganization_timestamp
      python main.py
      ```

## Example

1. Create a new app using following command.

   - Linux or MAC

     ```py
     python3 run.py --task "please make a flask app. app should have a web page asking for students information like name age education address city and phone number. then there should be a submit button. after submitting the record should be saved into a sqlite database" --name "student-management"
     ```

   - Linux or MAC

     ```py
     python run.py --task "please make a flask app. app should have a web page asking for students information like name age education address city and phone number. then there should be a submit button. after submitting the record should be saved into a sqlite database" --name "student-management"
     ```

2. Run the project using following command. use the folder name of the generated folder

   - Linux or MAC

     ```py
     cd WareHouse/student-management_DefaultOrganization_20230921193947
     python3 main.py
     ```

   - Windows

     ```py
     cd WareHouse/student-management_DefaultOrganization_20230921193947
     python main.py
     ```

3. Check the app at following link

   ```
   http://127.0.0.1:5000
   ```

4. If you have `TemplateNotFound` error, in the `student-management_DefaultOrganization---` folder create a new directory named `templates` and move `index.html` to this folder. Now refreshing the webpage will display a form.

5. Fill-up the form and submit. This wil create a `students.db` file in the project folder

6. Download and Install [DBeaver Community](https://dbeaver.io/download/)

7. Open dbeaver

   - from `Windows` tab open `Database Navigator`
   - from `Database` tab open `New Database Connection`
   - from the newly opened window select `SQLite` and press next
   - select the `students.db` file from the project and press finish

8. In step `step-06` if you have columns error, follow following steps otherwise move to next one

   - right click on the `students.db` from the left section
   - click `SQL editor` and press `Open sql script`
   - paste following query and run the script
     ```sql
     CREATE TABLE students (
         id SERIAL PRIMARY KEY,
         name VARCHAR(255) NOT NULL,
         age INT NOT NULL,
         education VARCHAR(255),
         address VARCHAR(255),
         city VARCHAR(255),
         phone_number VARCHAR(15)
         );
     ```
   - Now fill the form and submit.
   - Success msg will be displayed

9. Open dbeaver and expand `student.db` and then expand `tables`. Right click on `students` and click `view data`.

10. Now you can verify the stored data from the table
