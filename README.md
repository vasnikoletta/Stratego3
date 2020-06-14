Vas Nikoletta
Neptun ID: h8hvzx
Kliensoldali webprogramozás, Stratego c. beadandó feladat (2. felvonás)
Beküldés ideje: 2020. 06. 01.
Ezt a megoldást Vas Nikoletta (h8hvzx) küldte be és készítette a Kliensoldali webprogramozás kurzus Stratego feladatához.
Kijelentem, hogy ez a megoldás a saját munkám.
Nem másoltam vagy használtam harmadik féltől származó megoldásokat.
Nem továbbítottam megoldást hallgatótársaimnak, és nem is tettem közzé.
Az Eötvös Loránd Tudományegyetem Hallgatói Követelményrendszere (ELTE szervezeti és működési szabályzata, II. Kötet, 74/C. §) kimondja, 
hogy mindaddig, amíg egy hallgató egy másik hallgató munkáját - vagy legalábbis annak jelentős részét - saját munkájaként mutatja be, 
az fegyelmi vétségnek számít. A fegyelmi vétség legsúlyosabb következménye a hallgató elbocsátása az egyetemről.

Codesandbox:
https://codesandbox.io/s/github/vasnikoletta/stratego2

Az utolsó verziót határidőn túl adtam be (gyakorlatvezetővel egyeztetve).
A korábbihoz képest javítva:
- Csak katonával lehet lépni, bombával és zászlóval nem.
- A játék véget ér, ha valaki megszerezte a zászlót vagy egy játékos minden katonája lekerült a tábláról.
- A támadó azonosításával (1. vagy 2. játékos) nem keverednek a két játékos lekerült bábui.

Részleges megoldások:
- A játéktáblán ütközet továbbra is úgy lehetséges, ha a cellán belül és a bábun kívül kattint a játékos.
- Ütközetkor a csak konzolon jelennek meg az erőviszonyok.
- A főoldalra való visszatérés után a korábbi lépések a tábláról törlődnek. 

Hiba:
- ha a játék valamelyik játékos győzelmével ért véget, a 'Vissza' gombra kattintva, majd az előkészítő oldalra jutva, a bábuk disabled-ek, nem tehetők fel újra a táblára, ehhez frissíteni kell az oldalt. A probléma okát nem találtam.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
# stratego2
