
import 'package:ecomproduit/Produit/panier.dart';
import 'package:ecomproduit/Produit/product-page.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';


class ProductInfo extends StatefulWidget {

  final basket _basket;


  ProductInfo(this._basket);

  @override
  State<ProductInfo> createState() => _ProductInfoState();
}

class _ProductInfoState extends State<ProductInfo> {
  final String _baseUrl = "10.0.2.2:9090";
  Product _product = Product("", "", "", 0, "", 1, 2, "", false);
  late Future<bool> _fetchedproducts;

  Future<bool> fetchproducts() async {
    http.Response response = await http.get(
      Uri.http(_baseUrl, "/produit/${widget._basket.id_prod}"),
    );
    print("aaaaaaaaa");
    print(response.request);
    print("${widget._basket.id_prod}");
    if (response.statusCode == 200) {
      print("Response status is 200");
      if (response.statusCode == 200) {
        final Map<String, dynamic> productFromServer = json.decode(
            response.body);

        setState(() {
          _product = Product(
            productFromServer["Image"],
            productFromServer["name"] as String,
            productFromServer["description"] as String,
            double.parse(productFromServer["price"].toString()),
            productFromServer["Seller"].toString(),
            int.parse(productFromServer["ratings"].toString()),
            int.parse(productFromServer["quantity"].toString()),
            productFromServer["category"].toString(),
            // You can set the category and other values as needed
            productFromServer["AR"] as bool,
          );
        });
        return true;
      } else {

        // Handle the case when the response status code is not 200
        print("Error: Response status code is not 200");
      }
    }
    return true;
  }

  @override
  void initState() {
    _fetchedproducts = fetchproducts();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 5,
      margin: EdgeInsets.all(10),
      child: ListTile(
        contentPadding: EdgeInsets.all(10),
        title: Text(_product.name),
        subtitle: Text("${_product.price} TND", textScaleFactor: 2),
        leading: Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10), // Adjust the BorderRadius as needed
            image: DecorationImage(
              fit: BoxFit.cover,
              image: NetworkImage("http://10.0.2.2:9090${_product.image}"),
            ),
          ),
        ),
        trailing: IconButton(
          icon: Icon(Icons.delete),
          onPressed: () async {
            http.Response response = await http.delete(
                Uri.http(_baseUrl, "/panier/${widget._basket.id_basket}"));
            setState(() {

              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (BuildContext context) => PanierPage(),
                ),
              );
            });
          },
        ),
      ),
    );
  }
}