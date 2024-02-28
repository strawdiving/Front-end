# Load setting/data from the server before Initializing an app
- Request:
load data from the server before initializing or bootstrapping the front end app. such as environment specific settings before the front end page loads, so that we can pull the required files depending on the environment

- Method: use APP_INITIALIZER before bootstrapping
          this function will be executed during the application bootstrap process, and the needed data is available on startup

- Action:
e.g. load setting.json which contains welcome name, header text, footer text that all comes from the database based on the user
e.g. user need selected language as a parameter to return the data in the correct language, so the available languages and selected language should be available before any components loaded to use it later on in the API's call.

```javascript
const express = require('express');
const app = express();

app.use(express.static(process.cwd()+"/appui/dist/appui/"));

const port = 3070;

const settings = {
    settings:"settings from server", 
    title: "APP_UI", 
    fullName: "Bhargav Bachina", 
    pageWidth: "60%", 
    text:"This settings coming from the server",
    headerColor: "gray",
    footerColor: "red"
};

app.get('/api/settings', (req,res) => {
    res.json(settings)
})

app.get('/', (req, res) => {
  res.sendFile(process.cwd()+"/appui/dist/appui/index.html")
});

app.listen(port, (err) => {
  if (err) {
    logger.error('Error::', err);
  }
  console.log(`running server on from port:::::::${port}`);
});
```

- appconfig.service.ts
```javascript
import { Inject, Injectable } from '@angular/core';
import { environment } from './../environments/environment';
import { BaseService } from './base.service';

@Injectable()
export Class AppConfigService extends BaseService {
    private configSettings: any = null;

    get settings() {
        return this.configSettings;
    }

    load(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getApi('/api/settings').subscribe((response: any) => {
                this.configSettings = response;
                resolve(true);
            })
        })
    }
}
```

- appconfig.module.ts
This file is the module file which has the ablove service defined in the providers section and imports this module into app.module.ts.
We need to:
- define APP_INITIALIZER in the provide section 
- with the dependency of above service and function **ini_app** to actually invoke fetching the api settings.
```javascript
import { NgModule, APP_INITIALIZATER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppConfigService } from './service';

export function init_app(appConfigService: AppConfigService) {
    return () => appConfigService.load();
}

@NgModule({
    imports: [HttpClientModule],
    providers: [
        AppConfigService,
        { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppConfigService], multi: true }
    ]
})

export AppConfigModule {}

```
- process
settings(Node.js) --> (Angular app) --> appconfig.service.js --> APP_INITIALIZATER --> angular bootstrapping --> app.component.ts


## e.g. 2 get languages
```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResourceService } from './service/resource.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {
        provide: APP_INITIALIZER,
        useFactory: resourceProviderFactory,
        deps: [ResourceService],
        multi: true
    }
    // add the provider APP_INITIALIZER, and the service name in the deps, and the useFactory which will run our promise function
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}

export funciton resourceProviderFactory(provider: ResourceService) {
    return () => provider.loadLanguages();
}
```
```javascript
// resource.service.ts

loadLanguages() {
    return new Promise((resolve, reject) => {
    //An Http Get to my API to get the available languages in my application
    this.http.get<Array<LanguageModel>>('Localization/getLanguages').subscribe(res => {
        //Store the available languages in a data store
        this.updateٍSupportedLanguages(res);
        //Make the first language selected by default , you can cache the selected one and make it selected
        this.updateSelectedLanguage(res[0]);
        resolve(true);
        })
    })
}
```

use the returned data in other service
```javascript
@Injectable()
export class MyServiceService {
    selectedLanguage:LanguageModel;
    constructor(private http: HttpClient,private resouceService:ResourceService) {
        resouceService.selectedLanguage.subscribe(res=>{
            this.selectedLanguage=res;
        })
    }
    //For example, use the selectedLanguage to get data
    getData(){
        return this.http.get(`Test/getData?lang=${this.selectedLanguage.isoCode2}`);
    }
}
```