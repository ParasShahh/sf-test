import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SurveyTemplateService {
  constructor(private http: HttpClient) { }
  private url = 'http://localhost:8080/api/survey/create';
  private getUrl = 'http://localhost:8080/api/survey/'

  //Save Survey form to the database
  saveSurveyForm(form): Observable<any> {
    return this.http.post<any>(this.url, form, httpOptions);
  }

  //Get data of form from id
  getFormById(id): Observable<any> {
    return this.http.get(this.getUrl + id, httpOptions);
  }
}
