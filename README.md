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


# Deployment
https://docs.google.com/document/d/1I_RPuA8-IxUuQTXNIrBa9_bPCkMSTcQiMeMRW8DISMk/edit?tab=t.0#heading=h.hzlqf0j4bzgy
in repo:
 - `npm run build`
 - copy dist folder to azure blob storage previously created
Note, if this is your first time deploying:
 - Update manifest.xml to point to the resources in the bucket instead of localhost
 - Update Azure App Registration Redirect URI to include the Azure Blob Storage hosted taskpane.html fully qualified domain URL

