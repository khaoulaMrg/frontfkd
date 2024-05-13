import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../customer/customer-services/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  categories: any = [];
  validateForm: FormGroup;
  isSpinning: boolean = false;
  noCategoriesFound: boolean = false;

  constructor(private service: CustomerService, private fb: FormBuilder,private router: Router,private adminService: AdminService) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      title: ['', Validators.required],  // Assurez-vous que le champ est non-null au début
    });

    // Récupère toutes les catégories initialement
    this.getAllCategories();

    // Écoute les changements du champ 'title'
    this.validateForm.get('title').valueChanges.pipe(
      debounceTime(300),        // Attend 300ms après le dernier événement avant de lancer la recherche
      distinctUntilChanged()    // Lance la recherche seulement si la valeur a changé
    ).subscribe(value => {
      this.isSpinning = true;
      if (value) {
        this.service.getAllCategoriesByTitle(value).subscribe({
          next: (res) => {
            if (res.length === 0) {
              this.noCategoriesFound = true;
              this.categories = [];
            } else {
              this.noCategoriesFound = false;
              this.categories = res;
            }
            this.isSpinning = false;
          },
          error: () => {
            this.isSpinning = false;
            alert('Erreur lors de la récupération des données');
          }
        });
      } else {
        this.noCategoriesFound = false;
        this.getAllCategories(); // Si aucun texte n'est entré, affiche toutes les catégories
      }
    });
  }

  submitForm(): void {
    if (!this.validateForm.valid) {
      return;
    }
    const title = this.validateForm.controls['title'].value;
    this.isSpinning = true;
    this.service.getAllCategoriesByTitle(title).subscribe({
      next: (res) => {
        this.categories = res;
        this.isSpinning = false;
      },
      error: () => {
        this.isSpinning = false;
        alert('Erreur lors de la récupération des données');
      }
    });
  }


  

  getAllCategories() {
    this.categories= [];
    this.service.getAllCategories().subscribe((res) => {
      this.categories = res; // Assignez les données récupérées à la variable categories
      console.log(this.categories);
    });
  }



  
  approveAndPostCategory(categoryId: number) {
    this.adminService.approveCategory(categoryId).pipe(
      catchError(approvalError => {
        console.error('Erreur lors de l\'approbation de la catégorie:', approvalError);
        throw approvalError; // Renvoyer l'erreur pour la gestion ultérieure
      })
    ).subscribe(approvalResponse => {
      console.log('Catégorie approuvée avec succès:', approvalResponse);
  
      this.adminService.sendCategory(approvalResponse.id).pipe(
        catchError(postError => {
          console.error('Erreur lors de la post de la catégorie:', postError);
          throw postError; // Renvoyer l'erreur pour la gestion ultérieure
        })
      ).subscribe(postResponse => {
        console.log('Catégorie postée avec succès:', postResponse);
        // Peut-être que vous devez effectuer d'autres actions après avoir approuvé et posté la catégorie
      });
    });
  
  }
  
}