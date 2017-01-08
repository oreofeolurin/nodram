import {Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import {Marker} from "../../models/Marker";

@Component({
    selector: 'google-map',
    templateUrl: 'google-map.component.html',
    styleUrls: ['../../../styles/app/shared/widgets/google-map.css'],
})

export class GoogleMapComponent implements OnDestroy, OnInit, OnChanges {

    @Input()
    private markers: Array<Marker> = [];

    public centerLat: number = 6.45306;
    public centerLng: number = 3.39583;
    public zoom: number = 8;

    ngOnInit() {

    }


    ngOnChanges(changes: SimpleChanges){

     }

    ngOnDestroy() {

    }
}