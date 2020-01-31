-> Download the wiki app folder and enter the wiki app folder
-> use the following command to activate the virtual environment and execute our backend wiki app
-> 1. source venv/bin/activate
-> 2. flask run

In order to enable or disable the keyoword ranking algorithm, we can change the value in the init.txt file . If the value is 'False' in the init.txt file
the app will not implement the keyword ranking algorithm other wise it will implement the algorithm. In order to implement the algorithm, we use the 
pre-trained model downloaded and stored locally in the directory. 

To enable to use the wiki plugin, we need to use the plugin, we go to the chrome://extensions in the chrome browser and click on the 'Load unpacked extension'
button and select the location to the Untitled Folder. 