import 'package:flutter/material.dart';

import '/Produit/product-page.dart';

class MyGameInfo extends StatelessWidget {
  final Product _game;

  const MyGameInfo(this._game);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 120,
      child: Card(
        child: Column(
          children: [
            Container(
              margin: const EdgeInsets.fromLTRB(10, 10, 20, 10),
              child: Image.network("http://10.0.2.2:9090/img/${_game.image}", width: 155, height: 58),
            ),
            Text(_game.name)
          ],
        ),
      ),
    );
  }
}
