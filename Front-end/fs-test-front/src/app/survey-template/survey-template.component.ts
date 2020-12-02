import { Component, OnInit } from '@angular/core';
import { SurveyTemplateService } from '../services/survey-template.service';
import { SurveyTemplate } from './survey-template.model';

@Component({
  selector: 'app-survey-template',
  templateUrl: './survey-template.component.html',
  styleUrls: ['./survey-template.component.css']
})
export class SurveyTemplateComponent implements OnInit {
  form: any = {};
  surveyNameText;
  surveyTemplateArray: SurveyTemplate[] = [];
  constructor(private surveyservice: SurveyTemplateService) {
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

  submitSurvey() {
    this.surveyTemplateArray.forEach((e) => {
      if (e.options) {
        e.options = e.options.join(",");
      }
    })
    var submitObj = {
      surveyName: this.surveyNameText,
      forms: this.surveyTemplateArray
    };
    console.log(submitObj);
    this.surveyservice.saveSurveyForm(submitObj).subscribe((res) => {
      console.log(res);
    })
  }

}
