# How to Edit Your Website

Your website is built to be fast and dynamic. Here is where to find everything:

## 1. To Change Content (Text, Products, Images, Phone Numbers)
**File:** `js/data.js`
*   This file contains all your data.
*   Edit this file to change:
    *   Product names, prices, descriptions.
    *   Company phone number, email, address.
    *   provider names and logos.
    *   Images URLs.

## 2. To Change Layout & Design Structure
**File:** `js/script.js`
*   This file contains the HTML templates for your pages.
*   Search for function names like `renderHeader`, `renderFooter`, `Pages.home`, `Pages.product` to find the HTML code for each section.

## 3. To Change Colors, Fonts, or Spacing
**File:** `css/style.css`
*   Add your custom CSS here.
*   Note: The site mainly uses **Tailwind CSS**, so many styles are directly in the class names in `js/script.js`.

## 4. To Change the Main Page Title or Icon
**File:** `index.html`
*   Edit the `<title>` tag.
*   Manage external scripts or css links.

## How to add images
1.  Put your image files in the `images/` folder.
2.  In `js/data.js`, update the image path to use the local file:
    *   Example: change `"https://example.com/image.jpg"` to `"./images/my-product.jpg"`.
