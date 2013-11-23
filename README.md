jams
====
*A HackNY 2013F Project*

Snippet-based music composition webapp.

### Setup

First install MongoDB

	$ brew install mongo
	
If you don't have `brew` installed, you can get it [here](http://brew.sh/), or install mongo in another way.

In the top level directory type all the commands that are preceded by `$`:

	# Don't forget the "."
	$ virtualenv --no-site-packages . 
	$ source bin/activate
	$ pip install -r requirements.txt
	

	
### Running

	# Run Mongo DB in the background
	$ mongod &
	
	# Run the app
	$ python app.py