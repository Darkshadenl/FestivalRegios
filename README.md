**Magazijn_assessment**

**VOORDAT JE BEGINT MET OOK MAAR IETS:**

Zorg dat je Node.js geïnstalleerd hebt.
Zorg dat je in de root van het proj bent (a.k.a. Magazijn_assessment).


Run dan.

```` 
npm ci
````

Voordat je dan gaat programmeren:

````
npm run dev
````

Voor de rest moet je weten dat je niet met je handen 
aan de dist folder en zijn bestanden mag komen.

Korte uitleg over webpack:

Omdat browsers nog veel nieuwe syntax van JS niet snappen, is webpack er.

Hierdoor kan je classes etc. over meerdere bestanden verdelen. 
Ik heb het ook zo opgezet dat je css, scss, images allemaal niet 
meer in de html hoeft te importen. Dit doe je gewoon 
met een import statement in index.js.

index.js is zeg maar het entry point van waaruit de website start.
Uiteindelijk moet we dit meer in een mvc structuur gooien maar is niet required
volgens mij. 

Blijkbaar is Parcel gemakkelijker dan Webpack maar school naait ons.

----------------------------

Voor later:

Installeren van npm packages doen met 

````
npm install --save-dev [plugin]
````