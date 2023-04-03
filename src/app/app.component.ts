import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { Food } from './food';
import { FOODS } from './food-list';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  foods = FOODS;
  sumCal = 0;
  sumFat = 0;
  sumCarbs = 0;
  sumProtein = 0;
  newid = 4;
  @ViewChild('foodItem')
  foodItem!: ElementRef;
  nutrition: any = [];
  foodItemValue: any;
  currentLat: any;
  currentLong: any;
  geolocationPosition: any;
  Foodss = {
    newDescription: '',
    newCalories: '',
    newFat: '',
    newCarbs: '',
    newProtein: ''
  }
  constructor(private _http: HttpClient) {
    this.foods.forEach((a) => (this.sumCal += a.calories));
    this.foods.forEach((a) => (this.sumFat += a.fat));
    this.foods.forEach((a) => (this.sumCarbs += a.carbs));
    this.foods.forEach((a) => (this.sumProtein += a.protein));


  }

  ngOnInit() {
    window.navigator.geolocation.getCurrentPosition((position) => {
      this.geolocationPosition = position;
      this.currentLat = position.coords.latitude;
      this.currentLong = position.coords.longitude;
    });
  }
  addFood(
    newDescription: any,
    newCalories: any,
    newFat: any,
    newCarbs: any,
    newProtein: any
  ) {

      var newFood = {
        id: this.newid,
        description: newDescription,
        calories: newCalories,
        fat: newFat,
        carbs: newCarbs,
        protein: newProtein,
      };

      this.foods.push(newFood);
      this.newid += 1;
      this.sumCal += Number(newCalories);
      this.sumFat += Number(newFat);
      this.sumCarbs += Number(newCarbs);
      this.sumProtein += Number(newProtein);
    }


  deleteFood(food: { id: number }) {
    this.foods = this.foods.filter((t) => t.id !== food.id);
    this.sumCal = 0;
    this.sumFat = 0;
    this.sumCarbs = 0;
    this.sumProtein = 0;
    this.foods.forEach((a) => (this.sumCal += a.calories));
    this.foods.forEach((a) => (this.sumFat += a.fat));
    this.foods.forEach((a) => (this.sumCarbs += a.carbs));
    this.foods.forEach((a) => (this.sumProtein += a.protein));
  }

  getInformation(    newDescription: any) {
    this.foodItemValue = newDescription;
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
              newCalories:
                100 *
                (data.hits[i].fields.nf_calories /
                  data.hits[i].fields.nf_serving_weight_grams),
                newFat:
                (100 * data.hits[i].fields.nf_total_fat) /
                data.hits[i].fields.nf_serving_weight_grams,
                newCarbs:
                data.hits[i].fields.nf_total_carbohydrate /
                (data.hits[i].fields.nf_serving_weight_grams * 0.01),
                newProtein:
                data.hits[i].fields.nf_protein /
                (data.hits[i].fields.nf_serving_weight_grams * 0.01),
              servingWeightGrams: data.hits[i].fields.nf_serving_weight_grams,
            };
          }
        });
      }

      this.Foodss.newCalories = this.nutrition[0].newCalories;
      this.Foodss.newFat = this.nutrition[0].newFat;
      this.Foodss.newCarbs = this.nutrition[0].newCarbs;
      this.Foodss.newProtein = this.nutrition[0].newProtein;
    }

}
