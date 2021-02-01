

Een nieuwe startup CROWDR wil graag software aanbieden waarbij grote groepen mensen goed gemanaged kunnen worden. De eerste test is het managen van een festival.

Paarspop is de eerste kandidaat. Om een beeld te schetsen, er is een entree voor ticket scan.  Er zijn tenten die altijd open zijn, tenten die op een bepaald moment pas opengaan en een maximaal aantal bezoekers kan hebben. En bepaalde gebieden op het festival terrein waar ook een maximaal aantal personen kunnen staan. Meer info in de specificaties hieronder.

Je mag het helemaal mobile maken, of tablet of desktop. Het hoeft niet responsive te zijn zolang maar op 1 van de devices het goed werkt. Daag jezelf uit! :)Sommige functionaliteiten zijn niet volledig qua beschrijving hoe het er uit moet komen te zien, dat mag je zelf bepalen. 

​​Algemene werking Part I - Setup

Het festival terrein van Paarspop is verdeeld in 6 regios. Deze zien er ook anders uit, denk aan bomen die in de weg staan en andere obstakels (prullenbakken). Een regio bestaat uit 15x15 vlakken.

De regios zijn apart te benaderen via tabjes of gewoon een menu !zonder page refresh!

Een regio is te configureren via een "Stap voor Stap" Formulier. Dat betekent dat je niet in 1x alles ziet maar per stap een nieuw formulier veld (of velden) te zien krijgt. Er is een reset knop aanwezig om opnieuw te beginnen.
De velden worden dynamisch aangemaakt/verwijderd door middel van javascript. Dus geen CSS 'hiding'!

Een configuratie gaat als volgt:

    Naam van de regio. Deze komt dan ook bij het tabje/menu te staan om een regio te selecteren + Maximaal aantal bezoekers
    Bepaal hoeveel tenten er staan. Een tent is 3x3 vlakjes.
    Bepaal het aantal eetkraampjes. Als er al een tent in de regio staat is dit maximaal 3, anders maximaal 6. (1x1)
    Bepaal het aantal drankkraampjes. Als er al een tent in de regio staat is dit maximaal 2, anders maximaal 4. (1x2)
    Bepaal het aantal bomen in de regio. Je kan kiezen uit 3 verschillende types: Hogeboom (1x1), brede boom (2x1), Schaduwboom (3x3) (de bomen worden random in de regio geplaatst)
    Bepaal het aantal toilet gebouwen in de regio. Een toilet gebouw is 1x3 vakjes. Maximaal 5.
    Bepaal hoeveel prullenbakken er gaan staan. Dit is maximaal 5% van de overgebleven vlakjes. Laat het maximale getal ook zien.

Na het bepalen van de objecten worden deze als 'puzzelstukjes' aangemaakt op het scherm. Deze kunnen dan worden gebruikt om op de regio te zetten via 'drag & drop'.

Denk aan validatie / of alles wel past of kan passen.

Maak gebruik van localstorage om alles per regio op te slaan (JSON format).

Wanneer de objecten geplaatst zijn kan je de regio 'locken' waardoor er geen positie veranderingen meer plaatsvinden. Alleen specifieke configuratie is mogelijk door te klikken op de objecten:

Tent: Maximaal bezoekers, openingstijden.

Eettent: Maximaal bezoekers en type eettent

Prullenbak: Capaciteit in kilo's, tijdstip legen (mooie visuele aanvulling om te laten zien dat ze vollopen en leegworden gemaakt iedere x seconden. Het assessment duurt niet zo lang dus hou het kort...)

Algemene werking Part II - Simulatie

De entree is live te configureren hoeveel rijen open zijn voor een ticket scan. Niet iedere rij heeft altijd een even snelle jongen staan voor het scannen. Zorg voor een random scantijd tussen de 0 en 3 seconden

Simuleer nu een crowd waarbij iedere xx seconde nieuwe mensen voor de deur staan en binnen worden gelaten. Let op! er komen niet alleen enkele personen maar ook soms groepen van 2, 3 en 4. Die willen tegelijk naar binnen en blijven ook altijd bij elkaar.

De personen/groepen die door de ticketscan komen worden random geplaatst in de regios. Maar let op! vol = vol. er komt dus een wachtrij.

Per vlakje in een regio kunnen maximaal 7 personen staan.

Speciale zaken:

Maak connectie met een Weer API. Zorg ervoor dat je als test een dropdown of textbox hebt om een andere locatie in te vullen. Dit is de locatie van het evenement. 
Elk weerstype moet je visueel laten zien (icoontje). Als het regent worden er sneller mensen in een tent geplaatst, als het zonnig is gaan de mensen om een boom of drankkraam staan. Dit moet je kunnen laten zien tijdens het assessment.

Alle objecten zijn een beetje saai als je alleen een kleur laat zien. Gebruik Canvas om per object een andere plaatje te laten zien of nog beter -> zelf tekenen. zie een van de tutorials.

Alle bezoekers/groepen hebben ook eigenschappen. deze zijn te zien als je er overheen hovered. gebruik https://randomuser.me/ voor de informatie.

Technisch

-De code heeft een duidelijk OO en eventueel een MVC (of ander architectuur) opzet. 

- Alleen puur javascript is toegestaan (dus geen coffeescript, typescript etc)

- Er zijn -geen- frameworks toegestaan zoals Jquery, VueJS etc. Je bent gewaarschuwd!

- Je mag wel kleine plugins/modules gebruiken om wat kleine zaken makkelijker te maken. Graag beperkt gebruiken! Een moment.js voor datum verwerking is ok. Maar een hele MVC library die de helft van je opdracht oplost niet. Bij twijfel -> Vragen aan docent.

- Webpack is verplicht. Dit is in principe een tool en geen programmeer library/framework.

- Responsiveness is geen specifiek toets item. Niet verplicht, wel gewenst. Je mag ook alleen een mobile variant maken! Let wel op de drag&drop functionaliteit..die moet je dan aanpassen.

- De HTML en CSS code ziet er netjes uit. Een CSS framework mag (Bootstrap, Foundation, Materialize). Mocht een framework jQuery of andere frameworks verplicht stellen is dat geen probleem. Maar in de logica van de app willen we het niet terugzien!

- Er is correcte foutafhandeling geimplementeerd (dus ook als een API niet beschikbaar is!)

- Gebruik zoveel mogelijk onderwerpen uit de lesstof. dat levert punten op.

Mocht je nog weer willen met je intellect, check de uitleg van een aantal designpatterns https://www.maxwellantonucci.com/tag/design-pattern-fairy-tales 

Visueel

Let er op dat we geen specifieke afbeeldingen aanleveren. Je kan dit met Canvas regelen, placeholders, icons .. whatever. Zorg voor een leuke invulling.

Probeer zoveel mogelijk met webfonts, icons, svg en png te werken.

Er wordt van je verwacht dat je HTML/CSS kennis hebt. Je wordt hier in het algemeen niet op getoetst maar slechte code is slechte code en dat willen we niet!

Eigen invulling,hoewel we de focus hebben op de onderwerpen uit de lesstof mag je zelf ook toevoegingen maken. Denk aan animatie etc.
Je wordt alleen beloond voor deze activitieiten als je voldoende punten haalt per speciek onderdeel. Meer info vind je bij het beoordelingsformulier op blackboard bij de inleverlink.
