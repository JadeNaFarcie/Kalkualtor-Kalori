import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-food',
  templateUrl: './search-food.component.html',
  styleUrls: ['./search-food.component.css'],
})
export class SearchFoodComponent implements OnInit {
  @ViewChild('foodItem')
  foodItem!: ElementRef;
  nutrition: any = [];
  foodItemValue: any;
  currentLat: any;
  currentLong: any;
  geolocationPosition: any;
  constructor(private _http: HttpClient) {}
  ngOnInit() {
    window.navigator.geolocation.getCurrentPosition((position) => {
      this.geolocationPosition = position;
      this.currentLat = position.coords.latitude;
      this.currentLong = position.coords.longitude;
    });
  }
  getInformation() {
    this.foodItemValue = this.foodItem.nativeElement.value;
    if (this.foodItemValue !== null && this.foodItemValue != '') {
      this._http
        .get(
          ' https://api.nutritionix.com/v1_1/search/' +
            this.foodItemValue +
            '?results=0:1&fields=*&appId=8c64d3f3&appKey=cf6e93bfdd30f35a3064a9ad0ae2c250'
        )
        .subscribe((data: any) => {
          for (var i = 0; i < data.hits.length; i++) {
            this.nutrition[i] = {
              Calories:
                100 *
                (data.hits[i].fields.nf_calories /
                  data.hits[i].fields.nf_serving_weight_grams),
              Fat:
                (100 * data.hits[i].fields.nf_total_fat) /
                data.hits[i].fields.nf_serving_weight_grams,
              Carbs:
                data.hits[i].fields.nf_total_carbohydrate /
                (data.hits[i].fields.nf_serving_weight_grams * 0.01),
              Protein:
                data.hits[i].fields.nf_protein /
                (data.hits[i].fields.nf_serving_weight_grams * 0.01),
              servingWeightGrams: data.hits[i].fields.nf_serving_weight_grams,
            };
          }
        });
    }
  }
}
