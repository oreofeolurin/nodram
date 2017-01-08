/**
 * Created by EdgeTech on 7/6/2016.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
   // { path: '', loadChildren: 'app/landing/landing.module#LandingModule'},
 // { path: 'dashboard', loadChildren: 'app/dashboard/dashboard.module#DashboardModule'}
];

export const APP_ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);