import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Maroc } from '../../../maroc.model';

@Injectable({
  providedIn: 'root'
})
export class EmploiService {


    private apiUrl = 'http://localhost:8080/api/auth/'; // L'URL de votre API backend
  
    constructor(private http: HttpClient) { }
  
    getJobs(): Observable<any[]> {
      const scrapeUrl = `${this.apiUrl}scrape`; // Ajoutez /scrape à l'URL de base
      return this.http.get<any[]>(scrapeUrl);
    }

    scrapeIn(): Observable<any[]> {
      const scrapeUrl = `${this.apiUrl}scrapeIn`; // Ajoutez /scrape à l'URL de base
      return this.http.get<any[]>(scrapeUrl);
    }
    scrapeMaroc(): Observable<Maroc[]> {
      const scrapeUrl = `${this.apiUrl}scrapeMaroc`;
      return this.http.get<Maroc[]>(scrapeUrl);
    }
  }
  
