import 'package:ecomproduit/Produit/panier.dart';
import 'package:file_picker/file_picker.dart';
import 'package:ecomproduit/Produit/addProduct.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../app_prop.dart';
import '../../core/api_client.dart';
import '../product-page.dart';

class ProductDisplay extends StatelessWidget {
  final Product product;
  final String _baseUrl = "10.0.2.2:9090";
  final String idprod;
  const ProductDisplay({
    required this.product, required this.idprod,
  });
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        Positioned(
          top: 20.0,
          right: 0,
          child: Container(
            width: MediaQuery.of(context).size.width / 1.5,
            height: 85,
            padding: EdgeInsets.only(right: 24),
            decoration: BoxDecoration(
              color: darkGrey,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(8.0),
                bottomLeft: Radius.circular(8.0),
              ),
              boxShadow: [
                BoxShadow(
                  color: Color.fromRGBO(0, 0, 0, 0.16),
                  offset: Offset(0, 3),
                  blurRadius: 6.0,
                ),
              ],
            ),
            child: Align(
              alignment: Alignment(1, 0),
              child: RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: ' ${product.price}',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontFamily: "Montserrat",
                        fontSize: 28.0,
                      ),
                    ),
                    TextSpan(
                      text: ' \Dt',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.normal,
                        fontFamily: "Montserrat",
                        fontSize: 18.0,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
        Align(
          alignment: Alignment(-1, 0),
          child: Padding(
            padding: const EdgeInsets.only(right: 20.0, left: 20.0),
            child: Container(
              height: screenAwareSize(250, context),
              child: Stack(
                children: <Widget>[
                  Padding(
                    padding: const EdgeInsets.only(bottom: 18.0),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16.0),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.5),
                            spreadRadius: 2,
                            blurRadius: 5,
                            offset: Offset(0, 3), // changes position of shadow
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16.0),
                        child: Hero(
                          tag: product.image,
                          child: Image.network(
                            "http://10.0.2.2:9090${product.image}",
                            fit: BoxFit.cover,
                            height: 250,
                            width: 250,
                          ),
                        ),
                      ),
                    ),
                  ),

                ],
              ),
            ),
          ),
        ),
        Positioned(
          left: 20.0,
          bottom: 10.0,
          child: RawMaterialButton(
            onPressed: () {
              Map<String, dynamic> userData = {
                "iduser": userid,
                "idproduit": idprod,
                "somme": product.price,
                "nbproduits": 1,
              };
              Map<String, String> headers = {
                "Content-Type": "application/json; charset=UTF-8"
              };
              http
                  .post(Uri.http(_baseUrl, "/panier/addpanier"),
                  body: json.encode(userData), headers: headers)
                  .then((http.Response response) async {
                print(response.statusCode);
                if (response.statusCode == 200) {
                  Map<String, dynamic> userData = json.decode(response.body);
                }
              });
              Navigator.of(context)
                  .push(MaterialPageRoute(builder: (_) => PanierPage()));
            },
            constraints: BoxConstraints(minWidth: 45, minHeight: 45),
            child: Icon(
              Icons.shopping_basket,
              color: Color.fromRGBO(255, 137, 147, 1),
            ),
            elevation: 0.0,
            shape: CircleBorder(),
            fillColor: Color.fromRGBO(255, 255, 255, 0.4),
          ),
        )
      ],
    );
  }
}
