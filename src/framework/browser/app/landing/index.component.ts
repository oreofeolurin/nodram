

import {OnInit, Component} from "@angular/core";
import {RConstants} from "../helpers/RConstants";


@Component({
    templateUrl: 'index.component.html',
    styleUrls: ["../../styles/app/landing/index.css"]
})

export class IndexComponent implements OnInit{

    public toolbarType: string = RConstants.TOOLBAR_INDEX_TYPE;

    public ngOnInit(): void {
    }

}