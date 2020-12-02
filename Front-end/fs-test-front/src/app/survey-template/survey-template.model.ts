export class SurveyTemplate {
  name: string;
  type: string;
  label: string;
  options: any;
  required: boolean;

  value: any;
  constructor(name: string, type: string, label: string, options: any, required: boolean, value: any) {
    this.name = name;
    this.type = type;
    this.label = label;
    this.options = options;
    this.required = required ? required : false;
    this.value = value;
  }
}
