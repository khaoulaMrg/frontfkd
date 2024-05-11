import { Component, OnInit } from '@angular/core';
import { EmploiService } from './emploi-services/emploi.service';
import { Subscription } from 'rxjs';
import { Maroc } from '../../maroc.model';

@Component({
  selector: 'app-emploi',
  templateUrl: './emploi.component.html',
  styleUrls: ['./emploi.component.css']
})

export class EmploiComponent implements OnInit {
  jobs: any[];
  subscription: Subscription;
  annouces: any[];
  marocList: Maroc[];

  constructor(private emploiService: EmploiService) { }

  ngOnInit(): void {
    this.fetchMaroc();

    this.subscription = this.emploiService.getJobs().subscribe({
      next: (data: any[]) => {
        this.jobs = data;
      },
      error: (error) => {
        console.error('Une erreur est survenue lors de la récupération des annonces d\'emploi : ', error);
      }
    });
  
   this.subscription= this.emploiService.scrapeIn().subscribe({
        next:  (data: any[]) => {
        this.annouces = data;
      },
      error:(error) => {
        console.error('Une erreur est survenue lors de la récupération des annonces d\'emploi : ', error);
      }
  });
  }
  

  fetchMaroc(): void {
  this.subscription=  this.emploiService.scrapeMaroc().subscribe({
    next:  (data: Maroc[]) => {
        this.marocList = data;
      },
      error:(error) => {
        console.error('Une erreur est survenue lors de la récupération des annonces Maroc : ', error);
      }
   } );
  }
  

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
