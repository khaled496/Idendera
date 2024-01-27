import 'package:ecomproduit/Produit/product-page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:http/http.dart' as http;
import '../app_prop.dart';
import '../core/api_client.dart';
import 'components/product_display.dart';

class DetailPage extends StatefulWidget {
  final Product product;
  final String idprod;

  const DetailPage({Key? key, required this.product, required this.idprod})
      : super(key: key);

  @override
  State<DetailPage> createState() => _DetailPageState();
}

class _DetailPageState extends State<DetailPage> {
  String? __mail;
  final String _baseUrl = "10.0.2.2:9090";
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: yellow,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0.0,
        iconTheme: IconThemeData(color: darkGrey),
        title: Text(
          '', // Empty title to allow custom product name positioning
          style: TextStyle(
            color: Colors.grey, // Change as needed
            fontWeight: FontWeight.w500,
            fontSize: 18.0,
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            SizedBox(
              height: 80.0,
            ),
            Align(
              alignment: Alignment.topLeft,
              child: Padding(
                padding: const EdgeInsets.only(left: 20.0),
                child: Text(
                  widget.product.name,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 32.0,
                  ),
                ),
              ),
            ),
            SizedBox(
              height: 16.0,
            ),
            ProductDisplay(
              product: widget.product,
              idprod: widget.idprod,
            ),
            SizedBox(
              height: 24.0,
            ),
            Padding(
              padding: EdgeInsets.only(left: 20.0, right: 40.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Description :',
                    style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.w600,
                      fontSize: 18.0,
                    ),
                  ),
                  SizedBox(height: 8.0),
                  Text(
                    widget.product.description,
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w800,
                      fontFamily: "NunitoSans",
                      fontStyle: FontStyle.normal,
                      fontSize: 16.0,
                    ),
                  ),
                  SizedBox(height: 24.0),
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: EdgeInsets.symmetric(horizontal: 16.0),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                          child: TextField(
                            decoration: InputDecoration(
                              hintText: 'Enter your email...',
                              hintStyle: TextStyle(
                                color: Colors.grey,
                              ),
                              border: InputBorder.none,
                            ),
                            maxLines: 1,
                            keyboardType: TextInputType.emailAddress,
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 16.0,
                            ),
                            onChanged: (value) {
                              __mail = value;
                            }
                          ),
                        ),
                      ),
                      SizedBox(width: 8.0),
                      ElevatedButton.icon(
                        onPressed: () {
                          http.post(Uri.http(_baseUrl, "/produit/Sell/$userid/${widget.product.categorie}/$__mail"));
                        },
                        style: ElevatedButton.styleFrom(
                          primary: darkGrey,
                          padding: EdgeInsets.symmetric(
                              vertical: 16.0, horizontal: 20.0),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                        ),
                        icon: Icon(
                          Icons.send,
                          size: 20.0,
                        ),
                        label: Text(
                          'Send',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16.0,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
