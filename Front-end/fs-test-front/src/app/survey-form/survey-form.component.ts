import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyTemplateService } from '../services/survey-template.service';
import { SurveyTemplate } from '../survey-template/survey-template.model';

@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.css']
})
export class SurveyFormComponent implements OnInit {
  formId;
  surveyTemplateArray: SurveyTemplate[] = [];
  surveyNameText: any;

  constructor(private route: ActivatedRoute, private surveyService: SurveyTemplateService) {
    this.route.params.subscribe(params => {

      this.formId = +params['id'];

    });
  }

  ngOnInit() {
    if (this.formId) { // If we get form id than fetch the relatred data from the api
      this.getFormData(this.formId);
    }
  }
  getFormData(id) {
    this.surveyService.getFormById(id).subscribe((res) => {
      console.log(res);
      if (res.survey.form.length > 0) {
        res.survey.form.forEach(element => {
          if (element.options) {
            element.options = element.options.split(",")
          }
        });
        this.surveyTemplateArray = res.survey.form;
      }
      this.surveyNameText = res.survey.name;

    })
  }

}
