### Website Features

- Blog section, announcing new galleries, exhibitions, etc.
- Search functionality (with [debounce](https://www.npmjs.com/package/use-debounce))
- Users
  - User profile (Wishlist, order history, settings, etc.)
  - User registration/login with Email or Google
- Purchases
  - Purchase proccess using Stripe
  - Can select different sizes of artworks for purchase (will assume print-on-demand, no stock)
- Galleries
  - Style selection menu
  - Filtering options (method, style, year, place of origin, exhibition,etc.)
  - Artstyles and filters are automatically generated based on the artworks in the database.
  - The different info on an artwork can be clicked to view all artworks with that particular info (same author, same style, etc.)
- Exhibitions
  - Have limited tickets available, divided by time and date
  - Past exhibitions are archived and can be viewed, but not purchased
  - Future exhibitions can be viewed, and can either preorder or add an alert for when preorders open.
- Admin panel
  - Add artworks
  - Manage artworks (delete, edit, etc.)
  - Manage users (delete, edit, view orders,etc.)
  - Manage exhibitions (delete, edit, etc.)

### Database Schema

#### Look at Artsy API and what info it provides

- User
- Author
  - Name
  - Birth Date
  - Birthplace
  - hasMany Artwork
  - hasMany Exhibition (nullable)
  - hasMany Style (nullable)
- Artwork
  - Name
  - Year
  - Place of Origin
  - Description
  - hasOne Author
  - hasMany Style
  - Usually artworks should have a single style and belong to a single exhibition, but not always, so we need a many-to-many relationship.
- Style
  - Name
  - hasMany Artwork
- Exhibition
  - Name
  - Description
  - StartDate
  - EndDate
  - Tickets
    - Price
    - Date
    - Available Boolean
    - Preorder Boolean
    - Preorder Date
  - hasMany Artwork
  - The exhibition page will have a small gallery of artworks that belong to that exhibition.
- Blogs
  - Name
  - Content
  - Date
  - Header Image
