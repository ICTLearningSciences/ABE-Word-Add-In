# ABE-Word-Add-In
Microsoft Word Add-In for ABE

Gotchas
 - Word Add-In's do not support .css files. You have to use:
    - (Recommended) css-in-js solution like styled-components
    - Inline styles
    - Global stylesheet


## Development
 - node version 18.13.0
 - update access token in .env
 - NOTE: on first run, you may need to open https://127.0.0.1:3000/manifest.xml in a separate browser and move past security warnings
 - `make develop` to start the dev server
 - `npm run start` to start the dev server and open a new Word document on desktop OR 
 - `npm run start:web -- --document 'url_of_document'` to start the dev server and open the document in the browser


