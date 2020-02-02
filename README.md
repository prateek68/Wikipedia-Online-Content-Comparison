# Wikipedia-Online-Content-Comparison
Follow the steps to run the extension

1. Download the wiki app folder and enter the wiki app folder download the pretrained model of wikipedia2vec from the follwing link https://drive.google.com/file/d/1neOKxdv9uN71kUmYf3ksvX2UINMqPScC/view?usp=sharing

Use can also download the file from the following link and unzip it.
http://wikipedia2vec.s3.amazonaws.com/models/en/2018-04-20/enwiki_20180420_100d.pkl.bz2

2. After downloading the file in the wiki-app folder, change directory to wiki-app and execute the commands below to activate the virtual environment and execute our backend wiki app.
```
> source venv/bin/activate

> flask run
```
3. In order to enable or disable the keyword ranking algorithm, we can change the value in the init.txt file. Set the value to 'True' in init.txt file to implement the keyword ranking algorithm. In order to implement the algorithm, we use the pre-trained model downloaded and stored locally in the directory.

4. To use the wiki plugin, we go to the chrome://extensions in the chrome browser and click on the 'Load unpacked extension' button and select the location to the Chrome Extension Folder.

Please note that the virtual environment was created and executed on Ubuntu 16.04. In case of any query, please email at prateek16068@iiitd.ac.in.
