import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(), provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()), provideFirebaseApp(() => initializeApp({"projectId":"verdeventura-db","appId":"1:1010780911535:web:c7efd14be17be4acc1e15a","databaseURL":"https://verdeventura-db-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"verdeventura-db.appspot.com","apiKey":"AIzaSyCnWKM_I5yxJzrL40qvFGupJHTykuHSsGU","authDomain":"verdeventura-db.firebaseapp.com","messagingSenderId":"1010780911535"})), provideAuth(() => getAuth()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage())]
};