import 'package:ecomproduit/Produit/product-page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'Product_Card.dart';
import 'addProduct.dart';

class MyProductPage extends StatefulWidget {
  const MyProductPage();

  @override
  State<MyProductPage> createState() => _MyProductPageState();
}

class _MyProductPageState extends State<MyProductPage> {
  List<Product> products = [];
  List<String> idproducts = [];
  List<String> categories = [];
  String selectedCategory = "All"; // Default category
  final String _baseUrl = "10.0.2.2:9090";
  late Future<bool> _fetchedProducts;

  Future<bool> fetchProducts() async {
    http.Response response = await http.get(Uri.http(_baseUrl, "/produit"));

    if (response.statusCode == 200) {
      final List<dynamic> productsFromServer = json.decode(response.body);
      productsFromServer.forEach((element) {
        products.add(Product(
          element["Image"],
          element["name"] as String,
          element["description"] as String,
          double.parse(element["price"].toString()),
          element["Seller"].toString(),
          int.parse(element["ratings"].toString()),
          int.parse(element["quantity"].toString()),
          element["category"].toString(),
          element["AR"] as bool,
        ));
        idproducts.add(element["_id"]);
      });

      fetchCategories();
    }

    return true;
  }

  Future<void> fetchCategories() async {
    Set<String> uniqueCategories = Set<String>();

    for (Product product in products) {
      uniqueCategories.add(product.categorie);
    }

    setState(() {
      categories = ["All", ...uniqueCategories.toList()];
    });
  }

  @override
  void initState() {
    _fetchedProducts = fetchProducts();
    super.initState();
  }

  List<Product> getCategoryProducts(String category) {
    if (category == "All") {
      return products;
    } else {
      return products.where((product) => product.categorie == category).toList();
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: categories.length,
      child: Scaffold(
        appBar: AppBar(
          title: Text("Products"),
          backgroundColor: Colors.deepPurple, // Change app bar color
          bottom: TabBar(
            isScrollable: true,
            tabs: categories.map<Widget>((String category) {
              return Tab(
                text: category,
              );
            }).toList(),
            onTap: (index) {
              setState(() {
                selectedCategory = categories[index];
              });
            },
          ),
          actions: [
            IconButton(
              icon: Icon(Icons.navigate_next),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => MoreProducts()),
                );
              },
            ),
          ],
        ),
        body: Container(
          decoration: BoxDecoration(
            color: Colors.grey[300], // Change background color
          ),
          child: FutureBuilder(
            future: _fetchedProducts,
            builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
              if (snapshot.hasData) {
                List<Product> displayedProducts =
                getCategoryProducts(selectedCategory);

                return Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: GridView.builder(
                    gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                      maxCrossAxisExtent: 200,
                      mainAxisExtent: 300,
                      mainAxisSpacing: 10,
                      crossAxisSpacing: 10,
                    ),
                    itemCount: displayedProducts.length,
                    itemBuilder: (BuildContext context, int index) {
                      return Card(
                        elevation: 4,
                        color: Colors.white, // Change card background color
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Expanded(
                              child: Image.network(
                                "http://10.0.2.2:9090"+displayedProducts[index].image,
                                fit: BoxFit.cover,
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    displayedProducts[index].name,
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      color: Colors.deepPurple, // Change text color
                                    ),
                                  ),
                                  SizedBox(height: 4),
                                  Text(
                                    displayedProducts[index].description,
                                    style: TextStyle(fontSize: 12),
                                  ),
                                  SizedBox(height: 4),
                                  Text(
                                    '\$${displayedProducts[index].price.toString()}',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.green,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                );
              } else {
                return Center(
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.indigo),
                  ),
                );
              }
            },
          ),
        ),
      ),
    );
  }
}
