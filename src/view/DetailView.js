import extractXYPosition from "../helpers/extractXYPosition";

export default class  DetailView {

    buildZIndexWindow(data){
        let xy = extractXYPosition(data.target.id);
        const gridspot = this.controller.getCurrentRegion().getGridSpot(xy.col, xy.row);

        const container = document.getElementsByClassName('regionsContainer')[0];
        let div = document.createElement('div');
        let title = document.createElement('h1');
        title.innerText = "Details";
        title.className = "detailsTitle"
        div.className = "zIndex";


        // appending
        div.appendChild(title)
        container.appendChild(div);
    }
}