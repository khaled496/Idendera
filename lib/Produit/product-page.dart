import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import '../core/api_client.dart';
import 'Product_Card.dart';
import 'addProduct.dart';

class MoreProducts extends StatefulWidget {
  const MoreProducts();

  @override
  State<MoreProducts> createState() => _MoreProductsState();
}

class _MoreProductsState extends State<MoreProducts> {
  List<Product> products = [];
  List<String> idproducts = [];
  final String _baseUrl = "10.0.2.2:9090";
  late Future<bool> _fetchedproducts;

  Future<bool> fetchproducts() async {
    http.Response response = await http.get(
      Uri.http(_baseUrl, "/produit/Seller/$userid"),
    );

    if (response.statusCode == 200) {
      print("yyy");
      final List<dynamic> gamesFromServer = json.decode(response.body);
      print(gamesFromServer);
      gamesFromServer.forEach((element) {
        products.add(Product(
          element["Image"],
          // Use "_id" instead of "Image"
          element["name"] as String,
          element["description"] as String,
          double.parse(element["price"].toString()),
          element["Seller"].toString(),
          int.parse(element["ratings"].toString()),
          int.parse(element["quantity"].toString()),
          element["category"].toString(),
          // You can set the category and other values as needed
          element["AR"] as bool,
        ));
        idproducts.add(element["_id"]);
      });

      print(products);
    }

    return true;
  }

  @override
  void initState() {
    _fetchedproducts = fetchproducts();
    super.initState();
  }

  Future<void> _refresh() async {
    // Clear the existing data
    products.clear();
    idproducts.clear();

    // Fetch and add new data
    await fetchproducts();
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("MY Products"),
        backgroundColor: Colors.orangeAccent,
      ),
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: Container(
          decoration: BoxDecoration(
            color: Colors.grey[200],
          ),
          child: FutureBuilder(
            future: _fetchedproducts,
            builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
              if (snapshot.hasData) {
                return Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: GridView.builder(
                    itemCount: products.length,
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      mainAxisExtent: 200,
                      mainAxisSpacing: 10,
                      crossAxisSpacing: 10,
                    ),
                    itemBuilder: (BuildContext context, int index) {
                      return Card(
                        elevation: 4,
                        child: ProductCard(products[index], idproducts[index]),
                      );
                    },
                  ),
                );
              } else {
                return Center(
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(
                      Colors.indigo,
                    ),
                  ),
                );
              }
            },
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => AddProduct()),
          );
        },
        child: Icon(Icons.add),
        backgroundColor: Colors.orangeAccent,
      ),
    );
  }
}

class Product {
  String image;
  String name;
  String description;
  double price;
  String Seller;
  int rating;
  int quantity;
  String categorie;
  bool AR;

  Product(this.image, this.name, this.description, this.price, this.Seller, this.rating,
      this.quantity, this.categorie, this.AR);

  @override
  String toString() {
    return 'Game{id: $image, url: $name, title: $description, description: $price}';
  }
}
