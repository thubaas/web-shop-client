import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryModel } from '../category.model';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css'],
})
export class CategoryItemComponent implements OnInit {
  @Input() category: CategoryModel;
  @Input() index: number;
  hide: boolean = true;
  toggledText: string;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  toggleText() {
    this.hide = !this.hide;
  }

  onEdit() {
    console.log('Category : ', this.category);
    this.router.navigate([`${this.index}/edit`], { relativeTo: this.route });
  }
}
