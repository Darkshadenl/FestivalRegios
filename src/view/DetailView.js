import extractXYPosition from "../helpers/extractXYPosition";

export default class  DetailView {

    #controller;
    #mainDiv;
    #containerDiv;
    #details;
    #gridSpot;

    constructor(controller) {
      this.#controller = controller;
    }

    buildZIndexWindow(data){
        this.#disableBackground();
        let xy = extractXYPosition(data.target.id);
        this.#gridSpot = this.#controller.getCurrentRegion().getGridSpot(xy.col, xy.row);

        const container = document.getElementsByClassName('regionsContainer')[0];
        this.#mainDiv = document.createElement('div');
        this.#mainDiv.className = "zIndex";
        this.#containerDiv = document.createElement("div");
        this.#containerDiv.className = "formDetails";
        this.#buildBasicForm();
        this.#buildGridSpotDetails(this.#gridSpot);
        this.#buildSaveButton();
        this.#buildCancelButton();
        this.#mainDiv.appendChild(this.#containerDiv);

        // appending
        container.appendChild(this.#mainDiv);
    }

    #buildCancelButton(){
        const cancelDiv = document.createElement("div");
        const cancelBtn = document.createElement("button");
        cancelBtn.innerText = "Cancel";
        cancelDiv.appendChild(cancelBtn);
        this.#containerDiv.appendChild(cancelDiv);

        cancelBtn.addEventListener("click", (d) => this.#handleCancel(d));
    }

    #handleCancel(event){
        const zindex = document.getElementsByClassName("zIndex")[0];
        zindex.parentNode.removeChild(zindex);
        this.#enableBackground();
    }

    #buildSaveButton(){
        const saveDiv = document.createElement("div");
        const saveBtn = document.createElement("button");
        saveBtn.innerText = "Sla wijzigingen op en sluit venster";
        saveDiv.appendChild(saveBtn);
        this.#containerDiv.appendChild(saveDiv);
        saveBtn.addEventListener("click", (d) => this.#handleSave(d));
    }

    #handleSave(){
        const gridItem = this.#gridSpot.getGridItem();
        const toBeValidated = {};

        this.#containerDiv.childNodes.forEach(e => {
            e.childNodes.forEach(n => {
                if (n.nodeName === "INPUT") {
                    if (n.id === "OpeningAt")
                        toBeValidated.opens_at = n.value;
                    if (n.id === "ClosingAt")
                        toBeValidated.closes_at = n.value;
                    if (n.id === "Visitors")
                        gridItem.max_visitors = n.value;
                    if (n.id === "Details")
                        gridItem.details = n.value;
                    if (n.id === "Capacity")
                        toBeValidated.capacity_in_kilo = n.value;
                    if (n.id === "Seconds")
                        toBeValidated.empty_moment_in_seconds = n.value;
                    if (n.id === "Full") {
                        gridItem.toilet_full = n.checked
                    }
                }
            });
        });

        if (this.#details.type == "tent"){
            this.#saveTent(toBeValidated, gridItem);
        }
        if (this.#details.type == "prullenbak"){
            this.#savePrullenbak(toBeValidated, gridItem);
        } else {
            console.log(gridItem)
            this.#controller.UpdateLocalStorage();
            this.#handleCancel();
        }
    }

    #savePrullenbak(toBeValidated, gridItem) {
        if (toBeValidated.capacity_in_kilo == "" && toBeValidated.empty_moment_in_seconds == ""){
            this.#handleCancel();
        } else {
            const capacity = document.getElementById("Capacity");
            const emptySec = document.getElementById("Seconds");
            if (!capacity.validity.valid || !emptySec.validity.valid) {
                window.alert("Foutieve data ingevoerd. Probeer opnieuw.");
            } else {
                gridItem.capacity_in_kilo = toBeValidated.capacity_in_kilo;
                gridItem.empty_moment_in_seconds = toBeValidated.empty_moment_in_seconds;
                console.log(gridItem);
                this.#controller.UpdateLocalStorage();
                this.#handleCancel();
            }
        }
    }

    #saveTent(toBeValidated, gridItem){
        if (toBeValidated.opens_at == "" && toBeValidated.closes_at == ""){
            this.#controller.UpdateLocalStorage();
            this.#handleCancel();
        } else {
            const valid = this.#validateOpenClose(toBeValidated.opens_at, toBeValidated.closes_at);
            if (valid){
                console.log('valid')
                gridItem.opens_at = toBeValidated.opens_at;
                gridItem.closes_at = toBeValidated.closes_at;
                this.#controller.UpdateLocalStorage();
                this.#handleCancel();
            } else {
                window.alert("Foutieve data ingevoerd. Probeer opnieuw.")
            }
        }
    }

    #validateOpenClose(starttime, endtime) {
        if (starttime && endtime) {
            const startDom = document.getElementById('OpeningAt');
            const endDom = document.getElementById('ClosingAt');
            console.log(startDom.validity.valid);
            console.log(endDom.validity.valid);
            if (startDom.validity.valid && endDom.validity.valid){
                return true;
            }
        }
        return false;
    }

    #buildBasicForm() {
        let title = document.createElement('h1');
        title.innerText = "Details";
        title.className = "detailsTitle";

        this.#mainDiv.appendChild(title);
    }

    #buildTent() {
        this.#containerDiv = document.createElement("div");
        this.#containerDiv.className = "formDetails";
        const typeDiv = document.createElement("div");
        const type_label = document.createElement("label");
        const type_input = document.createElement("input");
        type_label.innerHTML = "Type tent:";
        type_input.setAttribute("id", "type");
        type_input.value = this.#details.type;
        type_input.disabled = true;
        typeDiv.appendChild(type_label);
        typeDiv.appendChild(type_input);

        const openingAtDiv = document.createElement("div");
        const openingsAt_label = document.createElement("label");
        const opening_at_input = document.createElement("input");
        openingsAt_label.innerHTML = "Opent om (tussen 12:00 en 18:00):";
        opening_at_input.setAttribute("id", "OpeningAt");
        opening_at_input.setAttribute("type", "time");
        opening_at_input.setAttribute("min", "12:00");
        opening_at_input.setAttribute("max", "18:00");
        opening_at_input.value = this.#details.opens_at;
        openingAtDiv.appendChild(openingsAt_label);
        openingAtDiv.appendChild(opening_at_input);

        const closingAtDiv = document.createElement("div");
        const closingAt_label = document.createElement("label");
        const closing_at_input = document.createElement("input");
        closingAt_label.innerHTML = "Gaat dicht om (tussen 20:00 en 03:00):";
        closing_at_input.setAttribute("id", "ClosingAt");
        closing_at_input.setAttribute("type", "time");
        closing_at_input.setAttribute("min", "20:00");
        closing_at_input.setAttribute("max", "03:00");
        closing_at_input.value = this.#details.closes_at;
        closingAtDiv.appendChild(closingAt_label);
        closingAtDiv.appendChild(closing_at_input);

        const maxVisitorsDiv = document.createElement("div");
        const visitors_label = document.createElement("label");
        const visitors_input = document.createElement("input");
        visitors_label.innerHTML = "Maximaal aantal bezoekers:";
        visitors_input.setAttribute("id", "Visitors");
        visitors_input.value = this.#details.max_visitors;
        maxVisitorsDiv.appendChild(visitors_label);
        maxVisitorsDiv.appendChild(visitors_input);

        this.#containerDiv.appendChild(typeDiv);
        this.#containerDiv.appendChild(openingAtDiv);
        this.#containerDiv.appendChild(closingAtDiv);
        this.#containerDiv.appendChild(maxVisitorsDiv);
    }

    #buildPrullenbak(){
        const emptyMomentDiv = document.createElement("div");
        const emptyMoment_label = document.createElement("label");
        const emptyMoment_input = document.createElement("input");
        emptyMoment_label.innerHTML = "Seconden tot legen:";
        emptyMoment_input.setAttribute("id", "Seconds");
        emptyMoment_input.value = this.#details.empty_moment_in_seconds;
        emptyMomentDiv.appendChild(emptyMoment_label);
        emptyMomentDiv.appendChild(emptyMoment_input);

        const capacityDiv = document.createElement("div");
        const capacity_label = document.createElement("label");
        const capacity_input = document.createElement("input");
        capacity_label.innerHTML = "Capaciteit (0-100):";
        capacity_input.setAttribute("id", "Capacity");
        capacity_input.setAttribute("type", "number");
        capacity_input.setAttribute("min", "0");
        capacity_input.setAttribute("max", "100");
        capacity_input.value = this.#details.capacity;
        capacityDiv.appendChild(capacity_label);
        capacityDiv.appendChild(capacity_input);

        this.#containerDiv.appendChild(emptyMomentDiv);
        this.#containerDiv.appendChild(capacityDiv);
    }

    #buildKraampje(){
        const detailsDiv = document.createElement("div");
        const details_label = document.createElement("label");
        const details_input = document.createElement("input");
        details_label.innerHTML = "Details:";
        details_input.setAttribute("id", "Details");
        details_input.value = this.#details.details;
        detailsDiv.appendChild(details_label);
        detailsDiv.appendChild(details_input);

        const maxVisitorsDiv = document.createElement("div");
        const maxVisitors_label = document.createElement("label");
        const maxVisitors_input = document.createElement("input");
        maxVisitors_label.innerHTML = "Maximaal aantal bezoekers:";
        maxVisitors_input.setAttribute("id", "Visitors");
        maxVisitors_input.setAttribute("type", "number");
        maxVisitors_input.value = this.#details.max_visitors;
        maxVisitorsDiv.appendChild(maxVisitors_label);
        maxVisitorsDiv.appendChild(maxVisitors_input);

        this.#containerDiv.appendChild(detailsDiv);
        this.#containerDiv.appendChild(maxVisitorsDiv);
    }

    #buildToilet(){
        const toiletFullDiv = document.createElement("div");
        const toilet_label = document.createElement("label");
        const toilet_input = document.createElement("input");
        toilet_label.innerHTML = "Toilet vol:";
        toilet_input.setAttribute("id", "Full")
        toilet_input.setAttribute("type", "radio");
        toilet_input.checked = this.#details.full;
        toiletFullDiv.appendChild(toilet_label);
        toiletFullDiv.appendChild(toilet_input);

        this.#containerDiv.appendChild(toiletFullDiv);
    }

    #buildGridSpotDetails(gridSpot) {
        const gridItem = gridSpot.getGridItem();

        this.#details = {
            type: gridItem.type
        };

        switch (gridItem.type) {
            case "prullenbak":
                this.#details.empty_moment_in_seconds = gridItem.empty_moment_in_seconds;
                this.#details.capacity = gridItem.capacity_in_kilo;
                this.#buildPrullenbak();
                break;
            case "eetkraampje":
                this.#details.max_visitors = gridItem.max_visitors;
                this.#details.details = gridItem.details;
                this.#buildKraampje();
                break;
            case "drankkraampje":
                this.#details.max_visitors = gridItem.max_visitors;
                this.#details.details = gridItem.details;
                this.#buildKraampje();
                break;
            case "tent":
                this.#details.max_visitors = gridItem.max_visitors;
                this.#details.opens_at = gridItem.opens_at;
                this.#details.closes_at = gridItem.closes_at;
                this.#buildTent();
                break;
            case "toilet":
                this.#details.full = gridItem.toilet_full;
                this.#buildToilet();
                break;
        }
    }


    #disableBackground() {
        const menuOne = document.getElementById("menuDiv");
        const dropZone = document.getElementById("dropZoneDiv");
        menuOne.setAttribute("style", "pointer-events:none;");
        dropZone.setAttribute("style", "pointer-events:none;");
    }

    #enableBackground() {
        const menuOne = document.getElementById("menuDiv");
        const dropZone = document.getElementById("dropZoneDiv");
        menuOne.setAttribute("style", "");
        dropZone.setAttribute("style", "");
    }
}