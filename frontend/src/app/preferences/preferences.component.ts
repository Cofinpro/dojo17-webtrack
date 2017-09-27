import { Component, OnInit } from '@angular/core';
import { PreferenceService } from "../services/preference.service";


@Component({
  selector: 'preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
