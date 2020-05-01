import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';
import { Product } from '../common/product';
import {map} from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 

  private baseUrl = 'http://localhost:8080/api/products';//because bootstrap only return the 20 first item by default

  private categoryUrl= 'http://localhost:8080/api/product_category';
  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number) : Observable<Product> {
    const productUrl= `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         theCathegoryId: number ): Observable<GetResponseProducts> {

    // build url based on category id
    const searchUrl= `${this.baseUrl}/search/findByCategoryId?id=${theCathegoryId}`
    + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(theCathegoryId: number): Observable<Product[]> {

    // build url based on category id
    const searchUrl= `${this.baseUrl}/search/findByCategoryId?id=${theCathegoryId}`;
    return this.getProducts(searchUrl);
  }

  // build url based on the keyword
  searchProducts(theKeyword: string): Observable<Product[]> {

    // need to build URL based on the keyword 
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

 searchProductsPaginate(thePage: number,
  thePageSize: number,
  theKeyword: string ): Observable<GetResponseProducts> {

// build url based on category keyword page and size
const searchUrl= `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
+ `&page=${thePage}&size=${thePageSize}`;
return this.httpClient.get<GetResponseProducts>(searchUrl);
}

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl)
    .pipe(map(Response => Response._embedded.productCategory));
  }

   

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl)
      .pipe(map(Response => Response._embedded.products));
  }

 
}

interface GetResponseProducts{
  _embedded:{
    products: Product[];
  },
page: {
  size: number,
  totalElements: number,
  totalPages: number,
  number: number
} }

interface GetResponseProductCategory{
  _embedded:{
    productCategory: ProductCategory[];
  }
}
