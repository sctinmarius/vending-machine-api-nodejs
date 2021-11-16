# vending-machine-api-nodejs

# create account role = seller | buyer
POST http://localhost:4000/api/user/new
body: {
  "username": 'marius',
  "password": '123456',
  "deposit": 0,
  "role": "seller"
}

# only buyer can deposit the coins (cents) [5, 10, 20, 50, 100] 
PUT http://localhost:4000/api/user/deposit
body: {
  "deposit": 5 
}


# only buyer can buy the products
PUT http://localhost:4000/api/user/buy
body: [
  {
    "productId": "619313493ac60bf9f73bc6a7",
    "amountOfProducts": 3,
    "productName": "M&Ms"
  }
]
response: {
    "message": "Your have been served!",
    "totalSpent": 2.7,
    "productsPurchased": [
        {
            "product": "M&Ms"
        }
    ],
    "change": [
        {
            "coin": 10,
            "qty": 1
        },
        {
            "coin": 20,
            "qty": 1
        }
    ]
}


# the buyer receive the money back
PUT http://localhost:4000/api/user/reset
response: {
    "message": "Your funds $x has been returned!",
    "change": [
        {
            "coin": 5,
            "qty": 1
        },
        {
            "coin": 10,
            "qty": 2
        },
        {
            "coin": 50,
            "qty": 1
        },
    ]
}


# everybody can get all the products
GET http://localhost:4000/api/product/all


# only the sellers can add the products
POST http://localhost:4000/api/product/new
body: {
	"amountAvailable": 3,
	"productName": "Dr. Peeper",
	"cost": 1.1
}
headers: {
  x-auth-token: '...'
}


# the sellers can update their products
PUT http://localhost:4000/api/product/:productId
body: {
	"amountAvailable": 7,
	"productName": "Coca-Cola-Zero",
	"cost": 1.1
}
headers: {
  x-auth-token: '...'
}


# the sellers can delete their products
DELETE http://localhost:4000/api/product/:productId
headers: {
  x-auth-token: '...'
}