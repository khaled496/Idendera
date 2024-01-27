import 'package:ecomproduit/Produit/product-page.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'detailPage.dart';

class ProductCard extends StatelessWidget {
  final Product product;
  final idprod;
  ProductCard(this.product, this.idprod);

  @override
  Widget build(BuildContext context) {
    return InkWell(
        onTap: null,
        child: GestureDetector(
          onTap: (){
            Navigator.push(context, CupertinoPageRoute(builder: (context) => DetailPage(product: product, idprod: idprod)));
          },
          child: Container(
              height: 250,
              width: MediaQuery.of(context).size.width / 2 - 29,
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.all(Radius.circular(20)),
                  color: Color(0xfffbd085).withOpacity(0.46)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: <Widget>[
                  Align(
                    alignment: Alignment.topCenter,
                    child: Container(
                      padding: EdgeInsets.all(16.0),
                      width: MediaQuery.of(context).size.width / 2 - 64,
                      height: MediaQuery.of(context).size.width / 2 - 64,
                      child: Image.network(
                        "http://10.0.2.2:9090${product.image}",
                      ),
                    ),
                  ),
                  Flexible(
                    child: Align(
                      alignment: Alignment(1, 0.5),
                      child: Container(
                          margin: const EdgeInsets.only(left: 16.0),
                          padding: const EdgeInsets.all(8.0),
                          decoration: BoxDecoration(
                              color: Color(0xffe0450a).withOpacity(0.51),
                              borderRadius: BorderRadius.only(
                                  topLeft: Radius.circular(10),
                                  bottomLeft: Radius.circular(10))),
                          child: Text(
                            product.name,
                            textAlign: TextAlign.right,
                            style: TextStyle(
                              fontSize: 12.0,
                              color: Colors.white,
                            ),
                          )),
                    ),
                  )
                ],
              )),
        ));
  }
}
