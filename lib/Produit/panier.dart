import 'package:ecomproduit/Produit/product_info.dart';
import 'package:ecomproduit/core/api_client.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class PanierPage extends StatefulWidget {
  const PanierPage({Key? key}) : super(key: key);

  @override
  State<PanierPage> createState() => _PanierPageState();
}

class _PanierPageState extends State<PanierPage> {
  final List<basket> baskets = [];
  double Total = 0;
  final String _baseUrl = "10.0.2.2:9090";
  late Future<bool> _fetchedGames;

  Future<bool> fetchGames() async {
    http.Response response =
        await http.get(Uri.http(_baseUrl, "/panier/Seller/$userid"));

    if (response.statusCode == 200) {
      final List<dynamic> gamesFromServer = json.decode(response.body);
      gamesFromServer.forEach((element) {
        baskets.add(basket(
            element["_id"],
            element["iduser"],
            element["idproduit"],
            double.parse(element["somme"].toString()),
            int.parse(element["nbproduits"].toString())));
        setState(() {
          Total += double.parse(element["somme"].toString());
        });
      });
      print(Total);
    }

    return true;
  }

  @override
  void initState() {
    _fetchedGames = fetchGames();
    super.initState();
  }

  void remove(basket basket) {
    baskets.remove(basket);
  }

  @override
  Widget build(BuildContext context) {
    // double totalPrice = baskets.fold(0, (sum, basket) => sum + basket.somme);

    return Scaffold(
      appBar: AppBar(
        title: Text("My Basket"),
        backgroundColor: Colors.orangeAccent,
      ),
      body: Container(
        decoration: BoxDecoration(
          color: Colors.grey[200],
        ),
        child: Column(
          children: [
            Expanded(
              child: FutureBuilder(
                future: _fetchedGames,
                builder: (BuildContext context, AsyncSnapshot<bool> snapshot) {
                  if (snapshot.hasData) {
                    return ListView.builder(
                      itemCount: baskets.length,
                      itemBuilder: (BuildContext context, int index) {
                        print("aaaaaaa" + Total.toString());
                        return ProductInfo(baskets[index]);
                      },
                    );
                  } else {
                    return Center(
                      child: CircularProgressIndicator(),
                    );
                  }
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ElevatedButton(
                    onPressed: () async {
                      baskets.forEach((element) async {
                        http.Response response = await http.delete(
                            Uri.http(_baseUrl, "/panier/${element.id_basket}"));
                        http.Response response2 = await http.patch(Uri.http(
                            _baseUrl, "/produit/update/${element.id_prod}"));
                      });

                      setState(() {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (BuildContext context) => PanierPage(),
                          ),
                        );
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      primary: Colors.orangeAccent, // Couleur du bouton
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons
                              .shopping_cart, // Ajoutez ici l'icône que vous souhaitez
                          color: Colors.white, // Couleur de l'icône
                        ),
                        SizedBox(
                            width: 8.0), // Espacement entre l'icône et le texte
                        Text(
                          "Acheter",
                          style: TextStyle(
                              color:
                                  Colors.white), // Couleur du texte du bouton
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: EdgeInsets.all(8.0),
                    decoration: BoxDecoration(
                      color: Color(0xFF4CAF50), // Couleur du conteneur
                      borderRadius:
                          BorderRadius.circular(8.0), // Bordure du conteneur
                    ),
                    child: Text(
                      "Total: ${Total.toString()} Dt",
                      style: TextStyle(
                        color: Colors.white, // Couleur du texte
                        fontWeight: FontWeight.bold,
                        fontSize: 16.0,
                      ),
                    ),
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

class basket {
  String id_basket;
  String id_user;
  String id_prod;
  double somme;
  int nbr_prod;

  basket(this.id_basket, this.id_user, this.id_prod, this.somme, this.nbr_prod);

  @override
  String toString() {
    return 'Game{id: $id_user, url: $id_prod, title: $somme, description: $nbr_prod}';
  }
}
