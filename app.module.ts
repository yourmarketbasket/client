import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { NointernetComponent } from './nointernet/nointernet.component';
import { RegisterComponent } from './register/register.component';
import { MatBadgeModule } from '@angular/material/badge';
import { NavigationComponent } from './navigation/navigation.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule} from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DatePipe, registerLocaleData } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SocketService } from './services/socket.service';
import { CreatestoreComponent } from './mystores/createstore/createstore.component';
import { ManageStoresComponent } from './mystores/manage-stores/manage-stores.component';
import { MatTabsModule } from '@angular/material/tabs';
import { StoresDashboardComponent } from './mystores/stores-dashboard/stores-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatDividerModule } from '@angular/material/divider';
import { FooterComponent } from './footer/footer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { HeaderComponent } from './header/header.component';
import { AddProductsComponent } from './mystores/add-products/add-products.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import { LoginComponent } from './login/login.component';
import { ViewProductsComponent } from './mystores/view-products/view-products.component';
import { ProfileComponent } from './profile/profile.component';
import { ManagerComponent } from './manager/manager.component';
import { RootComponent } from './root/root.component';
import { QualityAssuranceComponent } from './quality-assurance/quality-assurance.component';
import { FinanceDepartmentComponent } from './finance-department/finance-department.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { RootHeaderComponent } from './root/root-header/root-header.component';
import { RootSidebarComponent } from './root/root-sidebar/root-sidebar.component';
import { ManagementDashboardComponent } from './management-dashboard/management-dashboard.component';
import { RootDashboardComponent } from './root/root-dashboard/root-dashboard.component';
import { QaDashboardComponent } from './quality-assurance/qa-dashboard/qa-dashboard.component';
import { QaHeaderComponent } from './quality-assurance/qa-header/qa-header.component';
import { QaSidebarComponent } from './quality-assurance/qa-sidebar/qa-sidebar.component';
import { ReviewProductsComponent } from './quality-assurance/review-products/review-products.component';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort';
import { MomentModule} from 'ngx-moment';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { EditProductModalComponent } from './mystores/view-products/edit-product-modal/edit-product-modal.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { ProductsComponent } from './marketplace/products/products.component';
import { HeaderComponent as ProductsHeader } from './marketplace/products/header/header.component';
import { ProductComponent } from './marketplace/product/product.component';
import { SettingsComponent } from './profile/settings/settings.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CartComponent } from './marketplace/cart/cart.component';
import { AddToCartComponent } from './marketplace/add-to-cart/add-to-cart.component';
import { CheckoutComponent } from './marketplace/checkout/checkout.component';
import { PaymentDialogComponent } from './marketplace/checkout/payment-dialog/payment-dialog.component';
import { PaymentSuccessComponent } from './marketplace/checkout/payment-success/payment-success.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {MatSliderModule} from '@angular/material/slider';
import { CategoriesComponent } from './marketplace/categories/categories.component';
import { OrdersComponent } from './marketplace/orders/orders.component';
import { ProcessOrderComponent } from './mystores/process-order/process-order.component';

registerLocaleData(en);



@NgModule({
  declarations: [    
    LoginComponent,
    AppComponent,
    ConfirmationComponent,
    NointernetComponent,
    RegisterComponent,
    NavigationComponent,
    CreatestoreComponent,
    ManageStoresComponent,
    StoresDashboardComponent,
    DashboardComponent,
    SidebarComponent,
    FooterComponent,
    NotFoundComponent,
    HeaderComponent,
    AddProductsComponent,
    ViewProductsComponent,
    ProfileComponent,
    ManagerComponent,
    RootComponent,
    QualityAssuranceComponent,
    FinanceDepartmentComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    RootHeaderComponent,
    RootSidebarComponent,
    ManagementDashboardComponent,
    QaDashboardComponent,
    RootDashboardComponent,
    QaHeaderComponent,
    QaSidebarComponent,
    ReviewProductsComponent,
    EditProductModalComponent,
    MarketplaceComponent,
    ProductsComponent,
    ProductsHeader,
    ProductComponent,
    SettingsComponent,
    ResetPasswordComponent,
    CartComponent,
    AddToCartComponent,
    CheckoutComponent,
    PaymentDialogComponent,
    PaymentSuccessComponent,
    CategoriesComponent,
    OrdersComponent,
    ProcessOrderComponent
    

  ],
  imports: [
    MatSlideToggleModule,
    MatSliderModule,
    NzIconModule,
    NzCarouselModule,
    NgxPaginationModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ImageCropperModule,
    CommonModule,
    MatTableModule,
    MatTooltipModule,
    MatChipsModule,
    MatTabsModule,
    MatListModule,
    BrowserModule,
    MatExpansionModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatSidenavModule,
    MatStepperModule,
    MatGridListModule,
    MatStepperModule,
    MatDatepickerModule,
    FlexLayoutModule,
    MatProgressBarModule,
    MatNativeDateModule,
    MatDividerModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatSortModule,    
    MomentModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    
    




  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },   
       
    },
    DatePipe,
    SocketService,
    {
      provide:MatPaginatorIntl,
    },
    { provide: NZ_I18N, useValue: en_US }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
