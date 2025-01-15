// DetailedMenu.js
import Menu from './Menu';

export default class DetailedMenu extends Menu {
    constructor(mid, name, shortDescription, price, deliveryTime, imageVersion, location, longDescription) {
        super(mid, name, shortDescription, price, deliveryTime, imageVersion, location);
        this.longDescription = longDescription;
    }
}
