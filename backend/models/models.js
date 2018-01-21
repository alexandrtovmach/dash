var modelMenu = {
  id: "",
  title: "",
  subtitle: "",
  pagesinterval: 1,
  imagesperPage: 1,
  currency: "",
  currencydisplayed: true,
  featuredontop: true,
  theme: "",
  categories: [modelCategory]
}

var modelCategory = {
  id: "",
  name: "",
  items: [modelItem]
}

var modelItem = {
  id: "",
  name: "",
  description: "",
  price: [
    {name: '_main', value: 10},
    {name: 'small', value: 5},
    {name: 'big', value: 3.45},
    {name: 'extra', value: 5.86},
  ],
  calories: 1,
  image: "",
  featured: true
}


//db models
var modelMenu = {
  id: 1,
  title: "",
  subtitle: "",
  pagesInterval: 1,
  imagesPerPage: 1,
  currency: "",
  currencyDisplayed: true,
  featuredOnTop: true,
  theme : {
    name: "Dark",
    textColor: "#335522",
    accentColor: "#000000",
    backgroundColor: "#ffffff",
    backgroundImage: "imageURL"
  },
  logo: ""
}

var modelCategory = {
  id: 1,
  name: "",
  menuid: ""
}

var modelItem = {
  id: 1,
  categoryid: "",
  name: "",
  description: "",
  price: "",
  calories: 1,
  image: "",
  featured: true
}


// {
//   "categories" : [ {
//     "items" : [ {
//       "calories" : 255,
//       "description" : "desc1 ascv sbv dbdgbndgn zdgnf dgn dzngnxdfnhm cgu,mtg",
//       "featured" : true,
//       "image" : "image link1",
//       "name" : "item1",
//       "price" : {
//         "large" : 50,
//         "small" : 21
//       }
//     }, {
//       "calories" : 780,
//       "description" : "desc2 ascv sbv dbdgbndgn zdgnf dgn dzngnxdfnhm cgu,mtg",
//       "featured" : true,
//       "image" : "image link2",
//       "name" : "item2",
//       "price" : {
//         "double" : 54,
//         "triple" : 82
//       }
//     } ],
//     "name" : "dinner"
//   }, {
//     "items" : [ {
//       "calories" : 255,
//       "description" : "desc1 ascv sbv dbdgbndgn zdgnf dgn dzngnxdfnhm cgu,mtg",
//       "featured" : true,
//       "image" : "lunch link1",
//       "name" : "lunchitem1",
//       "price" : {
//         "_main" : 54
//       }
//     }, {
//       "calories" : 780,
//       "description" : "desc2 alunchscv slunchbv dbdgbndgn zdgnf dgn dzngnxdfnhm cgu,mtg",
//       "featured" : true,
//       "image" : "lunch link2",
//       "name" : "lunchitem2",
//       "price" : {
//         "_main" : 16
//       }
//     } ],
//     "name" : "lunch"
//   } ],
//   "currency" : "UAH",
//   "currencyDisplayed" : true,
//   "featuredOnTop" : true,
//   "id" : 1,
//   "imagesPerPage" : 1,
//   "logo" : "LOGOTYPE",
//   "pagesInterval" : 1,
//   "subtitle" : "Super interested new subtitle for the menu",
//   "theme" : {
//     "name": "Dark",
//     "textColor": "#335522",
//     "accentColor": "#000000",
//     "backgroundColor": "#ffffff",
//     "backgroundImage": "imageURL"
//   },
//   "title" : "assv"
// }
