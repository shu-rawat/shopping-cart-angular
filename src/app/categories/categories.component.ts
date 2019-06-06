import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories:Array<any> = [];
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getCategories().subscribe((categories:Array<any>)=>{
      this.categories = categories.filter(categ=>categ.enabled).map((categ,ind)=>({...categ,even:ind%2==1}));
    });
  }

}
