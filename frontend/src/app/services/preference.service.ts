import { Injectable } from '@angular/core';

@Injectable()
export class PreferenceService {
  private prefix: string;

  constructor() {  }

  public setDomainPrefix(prefix: string){
    this.prefix = prefix;
  }

  public setValue(key : string, value : string) : void{
    localStorage.setItem(this.prefix + key, value);
  }
  
  public removeValue(key : string) : void{
    localStorage.removeItem(this.prefix + key);
  }
  
  public getValue(key : string) : string{
    return localStorage.getItem(this.prefix + key);
  }


}
