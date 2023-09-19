## 1. Create shopify partners account

1. SignUp at [Shopify Partners](https://www.shopify.com/shopifypartnersvap?gclid=CjwKCAjwjaWoBhAmEiwAXz8DBQ0UJ8T6ens8l2IY9tTq5rozv4gJkDtWkfLdRamd8sOyljgOgl2tXxoCGfMQAvD_BwE)

2. Select `others` as reason to use shopify

   ![signUp-01](./asserts/snaps/signup01.png)

3. Set business location

   ![signUp-02](./asserts/snaps/signup02.png)

4. Set business contact information

   ![signUp-03](./asserts/snaps/signup03.png)

   ![signUp-04](./asserts/snaps/signup04.png)

5. Submitting this form will open the shopify partners dashboard

   ![signUp-05](./asserts/snaps/signup05.png)

## 2. Create shopify storefront

1. On shopify partners dashboard select `Stores` from the left sidebar, open dropdown menu by selecting `Add store` and select `Create development store`.

   ![storefront-01](./asserts/snaps/storefront01.png)

2. Enter details for the new store and create development store.

   ![storefront-02](./asserts/snaps/storefront02.png)

3. Creating new store will navigate to storefront dashboard. If you are not navigated bt default, select `Stores` from the left sidebar of shopify partners dashboard and `login` to the newly created store

   ![storefront-03](./asserts/snaps/storefront03.png)

4. After successful login to the newly created storefront you will be navigated to storefront dashboard.

## 3. Add products

1. On storefront dashboard select `Products` from the left sidebar and then select `Add Your Products`.

   ![products-01](./asserts/snaps/products01.png)

2. Add Products details

   ![products-02](./asserts/snaps/products02.png)

   ![products-03](./asserts/snaps/products03.png)

   ![products-04](./asserts/snaps/products04.png)

   ![products-05](./asserts/snaps/products05.png)

3. You can add products one by one or you can import from a csv file. Download [this csv file](./asserts/snaps/products/products_export.csv) and on the products page select `import`. This will open a dialog box.

   ![products-06](./asserts/snaps/products06.png)

4. Select `add file` and select the downloaded file.

   ![products-07](./asserts/snaps/products07.png)

5. Don't forget to select all options. Select `update and preview` and then `import products`

   ![products-08](./asserts/snaps/products08.png)

## 4. Install and customize Shopify Headless theme

1. Download [Shopify Headless theme](https://github.com/instantcommerce/shopify-headless-theme/archive/refs/heads/master.zip)

2. Select `Online Store` from the sidebar and select `Themes`. Open dropdown menu by clicking `Add theme` and select `upload zip file` and select the downloaded file.

   ![theme-01](./asserts/snaps/theme01.png)

3. From the bottom left of the storefront dashboard click settings 

   ![theme-02](./asserts/snaps/theme02.png)

4. from the top left corner copy the storefront url. Save it some where as we need it again for deployment

   ![theme-03](./asserts/snaps/theme03.png)

5. When theme is uploaded select `customize`

   ![theme-03](./asserts/snaps/theme04.png)

6. Click `Theme settings` (the paintbrush icon), expand the `STOREFRONT section`, enter your `headless store domain` you copied in `step 04``

   ![theme-05](./asserts/snaps/theme05.png)

7. (Optional) No, expand the `FAVICON section`, and select the icon image you want
   
   ![theme-06](./asserts/snaps/theme06.png)

8. From the top right corner save and publish the theme
   
   ![theme-07](./asserts/snaps/theme07.png)

9. (Optional) From the settings we opened in `step 3` you can customize the checkout page. To make changes to checkout page `settings` --> `checkout` --> `customize checkout`. On this page you can
    - set banner image
    - set site logo on banner
    - set styling for main content area
    - set styling for order summary

10. (Optional) From the settings we opened in `step 3` you can customize the branding. To make changes to checkout page `settings` --> `brand`.

11. (Optional) From the settings we opened in `step 3` you can customize the email too. To make changes to checkout page `settings` --> `notifications` --> `customize email templates`.
