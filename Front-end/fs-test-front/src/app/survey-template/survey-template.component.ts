import { Component, OnInit } from '@angular/core';
import { SurveyTemplate } from './survey-template.model';

@Component({
  selector: 'app-survey-template',
  templateUrl: './survey-template.component.html',
  styleUrls: ['./survey-template.component.css']
})
export class SurveyTemplateComponent implements OnInit {
  form: any = {};
  surveyTemplateArray: SurveyTemplate[] = [];
  constructor() {
  }

  ngOnInit() {
  }
  onSubmit() {
    console.log(this.form)
    if (this.form.options) {
      this.form.options = this.form.options.split(",");
    }
    const item = { ...this.form };
    this.form = {}
    this.surveyTemplateArray.push(item);
  }

}
