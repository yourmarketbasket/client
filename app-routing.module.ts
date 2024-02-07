import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { AddProductsComponent } from './mystores/add-products/add-products.component';
import { CreatestoreComponent } from './mystores/createstore/createstore.component';
import { ManageStoresComponent } from './mystores/manage-stores/manage-stores.component';
import { StoresDashboardComponent } from './mystores/stores-dashboard/stores-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ViewProductsComponent } from './mystores/view-products/view-products.component';
import { ManagementDashboardComponent } from './management-dashboard/management-dashboard.component';
import { ManagerComponent } from './manager/manager.component';
import { QualityAssuranceComponent } from './quality-assurance/quality-assurance.component';
import { RootComponent } from './root/root.component';
import { RootDashboardComponent } from './root/root-dashboard/root-dashboard.component';
import { QaDashboardComponent } from './quality-assurance/qa-dashboard/qa-dashboard.component';
import { ReviewProductsComponent } from './quality-assurance/review-products/review-products.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { ProductsComponent } from './marketplace/products/products.component';
import { ProductComponent } from './marketplace/product/product.component';
import { SettingsComponent } from './profile/settings/settings.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CartComponent } from './marketplace/cart/cart.component';
import { CheckoutComponent } from './marketplace/checkout/checkout.component';
import { PaymentDialogComponent } from './marketplace/checkout/payment-dialog/payment-dialog.component';
import { PaymentSuccessComponent } from './marketplace/checkout/payment-success/payment-success.component';

const routes: Routes = [
  { path: '', redirectTo: '/market_place', pathMatch: 'full' },
  { path: 'payment_dialog', component:PaymentDialogComponent},
  { path: 'market_place', component: MarketplaceComponent,
  children:[
      {path: '', component: ProductsComponent},
      {path: 'cart', component: CartComponent, canActivate: [AuthGuard],},
      {path:'checkout', component:CheckoutComponent, canActivate: [AuthGuard]},
      {path: 'product', component: ProductComponent},
      {path: 'success', component:PaymentSuccessComponent},
    ]
  },

  {path: 'admin', component: RootDashboardComponent, canActivate: [AuthGuard],
    children: [
      {path: '', component: RootComponent, canActivate: [AuthGuard]},
    ]
  },
  { path: 'manager-dashboard', component: ManagementDashboardComponent, canActivate: [AuthGuard],
    children: [
      {path: '', component: ManagerComponent, canActivate: [AuthGuard]},
    ]
  },
  {path: 'quality-assurance', component: QaDashboardComponent, canActivate: [AuthGuard],
    children: [
      {path: '', component: QualityAssuranceComponent, canActivate: [AuthGuard]},
      {path: 'review-products', component: ReviewProductsComponent, canActivate:[AuthGuard]},

    ]
  },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [AuthGuard] },

  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  {path: 'confirmation', component: ConfirmationComponent},
  {path: 'profile', redirectTo: 'dashboard/profile', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent,
    children: [
      {path: '', redirectTo: 'profile', pathMatch: 'full'},
      {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
      {path: 'view-products', component: ViewProductsComponent, canActivate: [AuthGuard]},
      {path: 'sidebar', component: SidebarComponent, canActivate: [AuthGuard]},
      {path:  'header', component: HeaderComponent, canActivate: [AuthGuard]},
      {path: 'createstore', component: CreatestoreComponent, canActivate: [AuthGuard]},
      {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
      {path: 'stores-dashboard', component: StoresDashboardComponent, canActivate: [AuthGuard],
        children: [
          {path: 'manage-store', component: ManageStoresComponent, canActivate: [AuthGuard],
            children: [
              {path: 'add-product', component: AddProductsComponent, canActivate: [AuthGuard]}
            ]
          }
        ]
    
      }

    ]
 },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
